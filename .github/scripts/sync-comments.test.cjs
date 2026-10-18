const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sync = require('./sync-comments.cjs');

test('syncs paginated comments and replies, edits, deletions and deleted accounts', async () => {
  const originalDirectory = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-comments-'));
  const commentsDirectory = path.join(directory, '_data', 'comments');
  fs.mkdirSync(commentsDirectory, { recursive: true });
  const filepath = path.join(commentsDirectory, 'test.json');
  fs.writeFileSync(filepath, JSON.stringify({ discussion_number: 1, comments: [{ id: 'old' }] }));
  const comment = { id: 'comment-1', author: { login: 'BlackScorp' }, body: '<script>test</script>\nNeue Zeile', createdAt: '2026-10-18T12:00:00Z' };
  let deleted = false;
  const cursors = [];
  const page = (nodes, next = null) => ({ nodes, pageInfo: { hasNextPage: Boolean(next), endCursor: next } });
  const github = {
    graphql: async (query, variables) => {
      if (variables.number) return { repository: { discussion: { id: 'discussion-1', url: 'https://github.com/BlackScorp/blackscorp.github.io/discussions/1' } } };
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
    assert.equal(data.comments[1].author, 'Gelöschter Account');
    assert.equal(data.comments[1].is_author, false);
    assert.ok(cursors.includes('next-comment'));
    assert.ok(cursors.includes('next-reply'));
    comment.body = 'Bearbeiteter Kommentar';
    await sync({ github, context: { repo: { owner: 'BlackScorp', repo: 'blackscorp.github.io' } } });
    data = JSON.parse(fs.readFileSync(filepath));
    assert.equal(data.comments[0].body, 'Bearbeiteter Kommentar');
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
