const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const publish = require('./publish-new-blog-entry.cjs');

async function fixture(run) {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-publish-'));
  fs.mkdirSync(path.join(directory, '_posts'));
  const post = { path: '_posts/2026-10-18-neuer-beitrag.md', title: 'Neuer Beitrag', content: 'Text mit **Markdown**\n' };
  fs.writeFileSync(path.join(directory, post.path), '---\ntitle: Neuer Beitrag\npublished: true\n---\n\nText mit **Markdown**\n');
  try {
    process.chdir(directory);
    await run(post);
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function api(existing = []) {
  const calls = [];
  const discussion = { number: 12, url: 'discussion-12', body: '' };
  return {
    calls,
    discussion,
    graphql: async (query, variables) => {
      calls.push({ query, variables });
      if (query.includes('discussionCategories')) {
        return { repository: { id: 'repository', discussionCategories: { nodes: [{ id: 'category', name: 'Blog' }] } } };
      }
      if (query.includes('createDiscussion')) {
        discussion.body = variables.input.body;
        return { createDiscussion: { discussion } };
      }
      return { repository: { discussions: {
        nodes: existing,
        pageInfo: { hasNextPage: false },
      } } };
    },
  };
}

const context = { repo: { owner: 'owner', repo: 'repo' } };

test('creates a discussion with the post body, persists its link and is stable on repeat', async () => {
  await fixture(async post => {
    const github = api();
    await publish({ github, context, posts: [post] });
    const key = '2026-10-18-neuer-beitrag';
    const source = fs.readFileSync(post.path, 'utf8');
    assert.match(source, /^---\ncomments_key: 2026-10-18-neuer-beitrag\n/);
    assert.match(source, /published: true/);
    assert.deepEqual(JSON.parse(fs.readFileSync(`_data/comments/${key}.json`)), {
      discussion_number: 12, discussion_url: 'discussion-12', comments: [],
    });
    const input = github.calls.find(call => call.query.includes('createDiscussion')).variables.input;
    assert.deepEqual(input, {
      repositoryId: 'repository', categoryId: 'category', title: post.title,
      body: 'Text mit **Markdown**\n\n---\n\nBlog-ID: `2026-10-18-neuer-beitrag`\n',
    });
    github.calls.length = 0;
    await publish({ github, context, posts: [{ ...post, comments_key: key }] });
    assert.deepEqual(github.calls, []);
    assert.equal(fs.readFileSync(post.path, 'utf8'), source);
  });
});

test('recovers a discussion created before an interrupted commit, including later pages', async () => {
  await fixture(async post => {
    const github = api();
    const graphql = github.graphql;
    github.graphql = async (query, variables) => {
      if (!query.includes('discussions(first:')) return graphql(query, variables);
      return { repository: { discussions: {
        nodes: variables.cursor ? [{ number: 7, url: 'recovered', body: 'Text\nBlog-ID: `2026-10-18-neuer-beitrag`\n' }] : [],
        pageInfo: { hasNextPage: !variables.cursor, endCursor: 'next' },
      } } };
    };
    await publish({ github, context, posts: [post] });
    assert.equal(github.calls.some(call => call.query.includes('createDiscussion')), false);
    assert.equal(JSON.parse(fs.readFileSync('_data/comments/2026-10-18-neuer-beitrag.json')).discussion_number, 7);
  });
});

test('preserves existing mappings and comments, repairs missing keys and keeps CRLF', async () => {
  await fixture(async post => {
    fs.mkdirSync('_data/comments', { recursive: true });
    const data = JSON.stringify({ discussion_number: 1, comments: [{ body: 'Existing comment' }] });
    fs.writeFileSync('_data/comments/2026-10-18-neuer-beitrag.json', data);
    fs.writeFileSync(post.path, fs.readFileSync(post.path, 'utf8').replaceAll('\n', '\r\n'));
    const github = api();
    await publish({ github, context, posts: [post] });
    assert.deepEqual(github.calls, []);
    assert.equal(fs.readFileSync('_data/comments/2026-10-18-neuer-beitrag.json', 'utf8'), data);
    assert.match(fs.readFileSync(post.path, 'utf8'), /^---\r\ncomments_key: [\w-]+\r\n/);
  });
});

test('uses existing custom keys and does not contact GitHub for an empty post list', async () => {
  await fixture(async post => {
    const github = api();
    await publish({ github, context, posts: [] });
    assert.deepEqual(github.calls, []);
    fs.writeFileSync(post.path, fs.readFileSync(post.path, 'utf8').replace('title:', 'comments_key: custom\ntitle:'));
    await publish({ github, context, posts: [{ ...post, comments_key: 'custom' }] });
    assert.ok(fs.existsSync('_data/comments/custom.json'));
    assert.equal(fs.readFileSync(post.path, 'utf8').match(/comments_key:/g).length, 1);
  });
});

test('rejects invalid and duplicate keys, missing categories and ambiguous discussions', async () => {
  await fixture(async post => {
    const github = api();
    await assert.rejects(publish({ github, context, posts: [{ ...post, comments_key: '../bad' }] }), /Invalid or duplicate/);
    await assert.rejects(publish({ github, context, posts: [post, post] }), /Invalid or duplicate/);
    await assert.rejects(publish({ github, context, posts: [post], categoryName: 'Missing' }), /category not found/);
    const existing = { number: 1, url: 'duplicate', body: 'Blog-ID: `2026-10-18-neuer-beitrag`' };
    await assert.rejects(publish({ github: api([existing, existing]), context, posts: [post] }), /Multiple discussions/);
    assert.equal(fs.existsSync('_data/comments'), false);
  });
});

test('does not persist a mapping or key when the API fails', async () => {
  await fixture(async post => {
    const github = api();
    const graphql = github.graphql;
    github.graphql = async (query, variables) => {
      if (query.includes('createDiscussion')) throw new Error('Permission denied');
      return graphql(query, variables);
    };
    await assert.rejects(publish({ github, context, posts: [post] }), /Permission denied/);
    assert.equal(fs.existsSync('_data/comments'), false);
    assert.doesNotMatch(fs.readFileSync(post.path, 'utf8'), /comments_key/);
  });
});
