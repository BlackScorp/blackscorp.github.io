const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

async function collectPages(fetchPage) {
  const nodes = [];
  let cursor = null;
  do {
    const page = await fetchPage(cursor);
    nodes.push(...page.nodes);
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return nodes;
}

function serializeComment(comment, owner) {
  const author = comment.author?.login || 'Gelöschter Account';
  return {
    id: comment.id,
    author,
    initials: Array.from(author).slice(0, 2).join('').toUpperCase(),
    avatar: comment.author?.avatarUrl || null,
    is_author: author.toLowerCase() === owner.toLowerCase(),
    date: comment.createdAt,
    body: comment.body,
  };
}

module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  const directory = path.join(process.cwd(), '_data', 'comments');
  const eventDiscussion = context.eventName === 'discussion_comment'
    ? context.payload?.discussion?.number
    : null;
  if (context.eventName === 'discussion_comment' && !Number.isInteger(eventDiscussion)) {
    throw new Error('Comment event is missing its discussion number');
  }
  let changedFiles = null;
  const before = context.payload?.before;
  const after = context.payload?.after;
  if (context.eventName === 'push' && /^[a-f0-9]{40}$/.test(before || '') &&
      /^[a-f0-9]{40}$/.test(after || '') && !/^0+$/.test(before)) {
    try {
      changedFiles = new Set(execFileSync('git', ['diff', '--name-only', before, after], {
        encoding: 'utf8',
      }).trim().split('\n'));
    } catch {
      changedFiles = null;
    }
    if (changedFiles && [...changedFiles].some(filename =>
      filename.startsWith('.github/scripts/') || filename === '.github/workflows/publish.yml')) {
      changedFiles = null;
    }
  }
  for (const filename of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
    if (changedFiles && !changedFiles.has(`_data/comments/${filename}`)) continue;
    const filepath = path.join(directory, filename);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    if (!Number.isInteger(data.discussion_number)) continue;
    if (eventDiscussion !== null && data.discussion_number !== eventDiscussion) continue;
    const number = data.discussion_number;
    const result = await github.graphql(`
      query($owner: String!, $repo: String!, $number: Int!) {
        repository(owner: $owner, name: $repo) {
          discussion(number: $number) { id url }
        }
      }
    `, { owner, repo, number });
    const discussion = result.repository.discussion;
    if (!discussion) throw new Error(`Discussion ${number} not found`);
    const comments = await collectPages(async cursor => {
      const result = await github.graphql(`
        query($id: ID!, $cursor: String) {
          node(id: $id) {
            ... on Discussion {
              comments(first: 100, after: $cursor) {
                nodes { id body createdAt author { login avatarUrl(size: 72) } }
                pageInfo { hasNextPage endCursor }
              }
            }
          }
        }
      `, { id: discussion.id, cursor });
      return result.node.comments;
    });
    const serialized = [];
    for (const comment of comments) {
      const replies = await collectPages(async cursor => {
        const result = await github.graphql(`
          query($id: ID!, $cursor: String) {
            node(id: $id) {
              ... on DiscussionComment {
                replies(first: 100, after: $cursor) {
                  nodes { id body createdAt author { login avatarUrl(size: 72) } }
                  pageInfo { hasNextPage endCursor }
                }
              }
            }
          }
        `, { id: comment.id, cursor });
        return result.node.replies;
      });
      serialized.push({
        ...serializeComment(comment, owner),
        replies: replies.map(reply => serializeComment(reply, owner)),
      });
    }
    fs.writeFileSync(filepath, JSON.stringify({
      discussion_number: number,
      discussion_url: discussion.url,
      comments: serialized,
    }, null, 2) + '\n');
  }
};
