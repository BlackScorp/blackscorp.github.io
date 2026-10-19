const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

test('comment staging supports an empty directory and JSON additions, edits and deletions', () => {
  const workflow = readFileSync(path.join(__dirname, '../workflows/publish.yml'), 'utf8');
  const command = workflow.match(/^          (git add[^\r\n]+)$/m);
  assert.ok(command);
  const directory = mkdtempSync(path.join(os.tmpdir(), 'blog-publish-'));
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' });
  const stage = () => execFileSync('bash', ['-e', '-c', command[1]], { cwd: directory });
  const commit = () => git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Fixture');
  try {
    git('init', '-q');
    mkdirSync(path.join(directory, '_data/comments'), { recursive: true });
    writeFileSync(path.join(directory, '_data/comments/.gitkeep'), '');
    stage();
    commit();
    stage();
    assert.equal(git('diff', '--cached', '--name-only'), '');

    const filename = path.join(directory, '_data/comments/post.json');
    writeFileSync(filename, '{}\n');
    stage();
    assert.equal(git('diff', '--cached', '--name-status').trim(), 'A\t_data/comments/post.json');
    commit();
    writeFileSync(filename, '{"comments": []}\n');
    stage();
    assert.equal(git('diff', '--cached', '--name-status').trim(), 'M\t_data/comments/post.json');
    commit();
    rmSync(filename);
    stage();
    assert.equal(git('diff', '--cached', '--name-status').trim(), 'D\t_data/comments/post.json');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
