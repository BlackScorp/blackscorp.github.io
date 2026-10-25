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
    fs.mkdirSync(path.join(directory, '_articles'));
    const write = (name, metadata, body = 'Post content') => {
      const article = path.join(directory, '_articles', name);
      fs.mkdirSync(article, { recursive: true });
      fs.writeFileSync(path.join(article, 'index.md'), `---\n${metadata}\n---\n\n${body}\n`);
    };
    write('1.public', 'title: "Public: title"\npublished: true\ndate: 2020-01-01');
    write('4.linked', 'title: Linked\npublished: true\ndate: 2020-01-04\ncomments_key: linked');
    write('2.draft', 'title: Draft\npublished: false\ndate: 2020-01-02', 'published: true');
    write('3.default', 'title: Default\ndate: 2020-01-03', 'published: true');
    const read = () => JSON.parse(execFileSync('bash', [script], { cwd: directory, encoding: 'utf8' }));
    let posts = read();
    assert.equal(posts.length, 1);
    assert.equal(posts[0].title, 'Public: title');
    assert.equal(posts[0].comments_key, null);
    assert.equal(posts[0].content.trim(), 'Post content');
    write('2.draft', "title: 'Now public'\npublished: true # ready\ndate: 2020-01-02");
    posts = read();
    assert.equal(posts.length, 2);
    assert.equal(posts[1].title, 'Now public');
    assert.equal(posts[1].comments_key, null);
    assert.ok(posts.every(post => !post.path.includes('linked')));
    fs.rmSync(path.join(directory, '_articles'), { recursive: true });
    fs.mkdirSync(path.join(directory, '_articles'));
    assert.deepEqual(read(), []);
    write('4.linked', 'title: Linked\npublished: true\ndate: 2020-01-04\ncomments_key: linked');
    assert.deepEqual(read(), []);
    write('1.ordner-beitrag', 'title: Ordner\npublished: true\ndate: 2020-01-01', 'Inhalt');
    assert.equal(read()[0].path, '_articles/1.ordner-beitrag/index.md');
    write('1.ordner-beitrag', 'title: Zukunft\npublished: true\ndate: 2999-01-01');
    assert.deepEqual(read(), []);
    write('1.ordner-beitrag', 'title: Ohne Datum\npublished: true');
    assert.deepEqual(read(), []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
