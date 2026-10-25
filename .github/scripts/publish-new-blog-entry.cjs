const fs = require('node:fs');
const path = require('node:path');

module.exports = async ({ github, context, posts, categoryName = 'Blog' }) => {
  const directory = path.join(process.cwd(), '_data', 'comments');
  const keys = new Set();
  const candidates = posts.map(post => {
    if (!/^_articles\/\d+\.[a-z0-9]+(?:-[a-z0-9]+)*\/index\.(?:md|markdown)$/.test(post.path)) {
      throw new Error(`Invalid article path: ${post.path}`);
    }
    const folder = path.basename(path.dirname(post.path));
    const key = post.comments_key ?? folder.replace('.', '-');
    if (typeof key !== 'string' || !/^[\w-]+$/.test(key) || keys.has(key)) {
      throw new Error(`Invalid or duplicate comments_key: ${key}`);
    }
    keys.add(key);
    if (typeof post.title !== 'string' || !post.title.trim()) {
      throw new Error(`Missing title: ${post.path}`);
    }
    const source = fs.readFileSync(post.path, 'utf8');
    if (!/^(?:\uFEFF)?---\r?\n/.test(source)) throw new Error(`Missing front matter: ${post.path}`);
    const filepath = path.join(directory, `${key}.json`);
    const mapped = fs.existsSync(filepath);
    if (mapped && !Number.isInteger(JSON.parse(fs.readFileSync(filepath, 'utf8')).discussion_number)) {
      throw new Error(`Invalid discussion mapping: ${filepath}`);
    }
    return { ...post, key, source, filepath, mapped };
  });
  const pending = candidates.filter(post => !post.mapped);
  let repository;
  const discussions = [];
  if (pending.length) {
    const result = await github.graphql(`
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
          discussionCategories(first: 100) { nodes { id name } }
        }
      }
    `, context.repo);
    repository = result.repository;
    const category = repository.discussionCategories.nodes.find(item => item.name === categoryName);
    if (!category) throw new Error(`Discussion category not found: ${categoryName}`);
    repository.categoryId = category.id;
    let cursor = null;
    do {
      const result = await github.graphql(`
        query($owner: String!, $repo: String!, $cursor: String) {
          repository(owner: $owner, name: $repo) {
            discussions(first: 100, after: $cursor) {
              nodes { number url body }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      `, { ...context.repo, cursor });
      const page = result.repository.discussions;
      discussions.push(...page.nodes);
      cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    } while (cursor);
  }
  for (const post of candidates) {
    if (!post.mapped) {
      const marker = `Blog-ID: \`${post.key}\``;
      const matches = discussions.filter(discussion => discussion.body.split(/\r?\n/).includes(marker));
      if (matches.length > 1) throw new Error(`Multiple discussions for ${post.key}`);
      let discussion = matches[0];
      if (!discussion) {
        const result = await github.graphql(`
          mutation($input: CreateDiscussionInput!) {
            createDiscussion(input: $input) { discussion { number url body } }
          }
        `, { input: {
          repositoryId: repository.id,
          categoryId: repository.categoryId,
          title: post.title,
          body: `${post.content.trim()}\n\n---\n\n${marker}\n`,
        } });
        discussion = result.createDiscussion.discussion;
        discussions.push(discussion);
      }
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(post.filepath, JSON.stringify({
        discussion_number: discussion.number,
        discussion_url: discussion.url,
        comments: [],
      }, null, 2) + '\n');
    }
    if (post.comments_key == null) {
      const newline = post.source.includes('\r\n') ? '\r\n' : '\n';
      fs.writeFileSync(post.path, post.source.replace(/^(\uFEFF?---\r?\n|---\r?\n)/,
        opening => `${opening}comments_key: ${post.key}${newline}`));
    }
  }
};
