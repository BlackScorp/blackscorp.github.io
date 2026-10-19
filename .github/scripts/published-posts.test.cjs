const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const script = path.join(__dirname, 'published-posts.sh');

test('selects explicit published flags from front matter, preserving title, key and body', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'published-posts-'));
  try {
    fs.mkdirSync(path.join(directory, '_posts'));
    const write = (name, metadata, body = 'Post content') => {
      fs.writeFileSync(path.join(directory, '_posts', `${name}.md`), `---\n${metadata}\n---\n\n${body}\n`);
    };
    write('2020-01-01-public', 'title: "Public: title"\npublished: true');
    write('2020-01-04-linked', 'title: Linked\npublished: true\ncomments_key: linked');
    write('2020-01-02-draft', 'title: Draft\npublished: false', 'published: true');
    write('2020-01-03-default', 'title: Default', 'published: true');
    const read = () => JSON.parse(execFileSync('bash', [script], { cwd: directory, encoding: 'utf8' }));
    let posts = read();
    assert.equal(posts.length, 1);
    assert.equal(posts[0].title, 'Public: title');
    assert.equal(posts[0].comments_key, null);
    assert.equal(posts[0].content.trim(), 'Post content');
    write('2020-01-02-draft', "title: 'Now public'\npublished: true # ready");
    posts = read();
    assert.equal(posts.length, 2);
    assert.equal(posts[1].title, 'Now public');
    assert.equal(posts[1].comments_key, null);
    assert.ok(posts.every(post => !post.path.includes('linked')));
    fs.rmSync(path.join(directory, '_posts'), { recursive: true });
    fs.mkdirSync(path.join(directory, '_posts'));
    assert.deepEqual(read(), []);
    write('2020-01-04-linked', 'title: Linked\npublished: true\ncomments_key: linked');
    assert.deepEqual(read(), []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
