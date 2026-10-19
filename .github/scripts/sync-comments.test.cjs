const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sync = require('./sync-comments.cjs');
const { execFileSync } = require('node:child_process');

test('syncs paginated comments and replies, edits, deletions and deleted accounts', async () => {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-comments-'));
  const commentsDirectory = path.join(directory, '_data', 'comments');
  fs.mkdirSync(commentsDirectory, { recursive: true });
  const filepath = path.join(commentsDirectory, 'test.json');
  fs.writeFileSync(filepath, JSON.stringify({ discussion_number: 1, comments: [{ id: 'old' }] }));
  const comment = { id: 'comment-1', author: { login: 'BlackScorp' }, body: '<script>test</script>\nNeue Zeile', createdAt: '2026-10-18T12:00:00Z' };
  comment.author.avatarUrl = 'https://avatars.githubusercontent.com/u/1';
  comment.author.url = 'https://github.com/BlackScorp';
  comment.url = 'https://github.com/BlackScorp/blackscorp.github.io/discussions/1#discussioncomment-1';
  comment.bodyHTML = '<p>&lt;script&gt;test&lt;/script&gt;</p><div class="highlight"><pre><span class="pl-k">const</span> value = 1;</pre></div>';
  let deleted = false;
  const cursors = [];
  const page = (nodes, next = null) => ({ nodes, pageInfo: { hasNextPage: Boolean(next), endCursor: next } });
  const github = {
    graphql: async (query, variables) => {
      if (variables.number) return { repository: { discussion: { id: 'discussion-1', url: 'https://github.com/BlackScorp/blackscorp.github.io/discussions/1' } } };
      assert.match(query, /id url body bodyHTML createdAt author \{ login url avatarUrl/);
      cursors.push(variables.cursor);
      if (variables.id === 'discussion-1') {
        return { node: { comments: deleted ? page([]) : variables.cursor ? page([{ ...comment, id: 'comment-2', author: null }]) : page([comment], 'next-comment') } };
      }
      return { node: { replies: variables.cursor ? page([{ ...comment, id: 'reply-2', author: null }]) : page([{ ...comment, id: 'reply-1' }], 'next-reply') } };
    },
  };
  try {
    process.chdir(directory);
    await sync({ github, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } });
    let data = JSON.parse(fs.readFileSync(filepath));
    assert.equal(data.comments.length, 2);
    assert.equal(data.comments[0].replies.length, 2);
    assert.equal(data.comments[0].body, comment.body);
    assert.equal(data.comments[0].is_author, true);
    assert.equal(data.comments[0].avatar, comment.author.avatarUrl);
    assert.equal(data.comments[0].author_url, comment.author.url);
    assert.equal(data.comments[0].url, comment.url);
    assert.equal(data.comments[0].body_html, comment.bodyHTML);
    assert.equal(data.comments[0].replies[0].body_html, comment.bodyHTML);
    assert.equal(data.comments[0].replies[0].url, comment.url);
    assert.equal(data.comments[1].author_url, null);
    assert.equal(data.comments[0].replies[0].avatar, data.comments[0].avatar);
    assert.equal(data.comments[1].avatar, null);
    assert.equal(data.comments[0].replies[1].avatar, null);
    assert.equal(fs.existsSync(path.join(directory, 'assets')), false);
    assert.equal(data.comments[1].author, 'Gelöschter Account');
    assert.equal(data.comments[1].is_author, false);
    assert.ok(cursors.includes('next-comment'));
    assert.ok(cursors.includes('next-reply'));
    comment.body = 'Bearbeiteter Kommentar';
    comment.bodyHTML = '<p>Bearbeiteter Kommentar</p>';
    await sync({ github, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } });
    data = JSON.parse(fs.readFileSync(filepath));
    assert.equal(data.comments[0].body, 'Bearbeiteter Kommentar');
    assert.equal(data.comments[0].body_html, '<p>Bearbeiteter Kommentar</p>');
    deleted = true;
    await sync({ github, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } });
    assert.deepEqual(JSON.parse(fs.readFileSync(filepath)).comments, []);
    const stable = fs.readFileSync(filepath, 'utf8');
    await sync({ github, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } });
    assert.equal(fs.readFileSync(filepath, 'utf8'), stable);
    await assert.rejects(sync({ github: { graphql: async () => ({ repository: { discussion: null } }) }, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } }), /not found/);
    assert.equal(fs.readFileSync(filepath, 'utf8'), stable);
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('limits comment and reply events to their discussion, including edits and deletions', async () => {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-comment-events-'));
  const commentsDirectory = path.join(directory, '_data', 'comments');
  fs.mkdirSync(commentsDirectory, { recursive: true });
  const filepath = path.join(commentsDirectory, 'first.json');
  const otherFilepath = path.join(commentsDirectory, 'second.json');
  fs.writeFileSync(filepath, JSON.stringify({ discussion_number: 1, comments: [] }));
  const untouched = JSON.stringify({ discussion_number: 2, comments: [{ id: 'untouched' }] });
  fs.writeFileSync(otherFilepath, untouched);
  const comment = { id: 'parent', body: 'Parent', createdAt: '2026-10-18T12:00:00Z' };
  let replies = [{ ...comment, id: 'reply', body: 'Reply' }];
  const page = nodes => ({ nodes, pageInfo: { hasNextPage: false } });
  const numbers = [];
  const github = {
    graphql: async (query, variables) => {
      if (variables.number) {
        numbers.push(variables.number);
        return { repository: { discussion: { id: `discussion-${variables.number}`, url: 'discussion' } } };
      }
      if (variables.id.startsWith('discussion-')) return { node: { comments: page([comment]) } };
      return { node: { replies: page(replies) } };
    },
  };
  const context = { repo: { owner: 'owner', repo: 'repo' }, eventName: 'discussion_comment' };
  try {
    process.chdir(directory);
    for (const action of ['created', 'edited', 'deleted']) {
      if (action === 'edited') replies[0].body = 'Edited reply';
      if (action === 'deleted') replies = [];
      await sync({ github, context: { ...context, payload: {
        action, discussion: { number: 1 }, comment: { id: 'reply' },
      } } });
      const data = JSON.parse(fs.readFileSync(filepath));
      assert.equal(data.comments[0].replies.length, replies.length);
      if (replies.length) assert.equal(data.comments[0].replies[0].body, replies[0].body);
      assert.equal(fs.readFileSync(otherFilepath, 'utf8'), untouched);
    }
    assert.deepEqual(numbers, [1, 1, 1]);
    await sync({ github, context: { ...context, payload: { discussion: { number: 99 } } } });
    assert.deepEqual(numbers, [1, 1, 1]);
    await assert.rejects(sync({ github, context }), /missing its discussion number/);
    for (const eventName of ['schedule', 'workflow_dispatch']) {
      numbers.length = 0;
      await sync({ github, context: { ...context, eventName } });
      assert.deepEqual(numbers.sort(), [1, 2]);
    }
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('pushes only fetch changed mappings and fall back to full sync when necessary', async () => {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-comment-push-'));
  const commentsDirectory = path.join(directory, '_data', 'comments');
  fs.mkdirSync(commentsDirectory, { recursive: true });
  const filepath = path.join(commentsDirectory, 'first.json');
  fs.writeFileSync(filepath, JSON.stringify({ discussion_number: 1, comments: [] }));
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const snapshot = () => {
    git('add', '.');
    return git('write-tree');
  };
  const numbers = [];
  const github = {
    graphql: async (query, variables) => {
      if (variables.number) {
        numbers.push(variables.number);
        return { repository: { discussion: { id: 'discussion', url: 'discussion' } } };
      }
      return { node: { comments: { nodes: [], pageInfo: { hasNextPage: false } } } };
    },
  };
  const context = { repo: { owner: 'owner', repo: 'repo' }, eventName: 'push' };
  try {
    process.chdir(directory);
    git('init');
    const before = snapshot();
    fs.writeFileSync(path.join(directory, 'post.md'), 'New post');
    let after = snapshot();
    await sync({ github, context: { ...context, payload: { before, after } } });
    assert.deepEqual(numbers, []);
    fs.writeFileSync(path.join(commentsDirectory, 'second.json'), JSON.stringify({ discussion_number: 2, comments: [] }));
    after = snapshot();
    await sync({ github, context: { ...context, payload: { before, after } } });
    assert.deepEqual(numbers, [2]);
    fs.mkdirSync(path.join(directory, '.github', 'scripts'), { recursive: true });
    fs.writeFileSync(path.join(directory, '.github', 'scripts', 'sync-comments.cjs'), 'changed');
    after = snapshot();
    for (const payload of [{ before, after }, { before: '0'.repeat(40), after }, {}]) {
      numbers.length = 0;
      await sync({ github, context: { ...context, payload } });
      assert.deepEqual(numbers.sort(), [1, 2]);
    }
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
