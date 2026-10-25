const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const preview = process.env.BLOG_PREVIEW_URL;

function articleTags() {
  return readdirSync(path.join(root, '_articles'), { recursive: true }).filter((filename) => /\.(md|markdown)$/.test(filename)).flatMap((filename) => {
    const source = readFileSync(path.join(root, '_articles', filename), 'utf8');
    const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontMatter, `${filename}: Front Matter fehlt`);
    const tags = frontMatter[1].match(/^tags:\s*\[([^\]\r\n]*)\]\s*$/m);
    if (!tags) {
      assert.doesNotMatch(frontMatter[1], /^tags:/m, `${filename}: Tags als Inline-Liste angeben`);
      return [];
    }
    return tags[1].split(',').map((tag) => tag.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  });
}

test('blog posts support Mermaid diagrams from local assets', () => {
  const layout = readFileSync(path.join(root, '_layouts/post.html'), 'utf8');
  const initializer = readFileSync(path.join(root, 'assets/js/mermaid-init.js'), 'utf8');

  assert.ok(existsSync(path.join(root, 'assets/js/mermaid.min.js')));
  assert.match(layout, /assets\/js\/mermaid\.min\.js/);
  assert.match(layout, /assets\/js\/mermaid-init\.js/);
  assert.match(initializer, /code\.language-mermaid/);
  assert.match(initializer, /securityLevel: 'strict'/);
});

test('all article tags have a page and support generated feeds', () => {
  for (const tag of articleTags()) {
    assert.match(tag, /^[a-zA-Z0-9_]+$/, `Nicht unterstützter Feed-Tag: ${tag}`);
    const page = readFileSync(path.join(root, '_pages/tags', `${tag}.md`), 'utf8');
    assert.ok(page.includes(`tag: ${tag}\n`));
    assert.ok(page.includes(`permalink: /blog/tags/${tag}/\n`));
  }
  const config = readFileSync(path.join(root, '_config.yml'), 'utf8');
  assert.match(config, /collections:\s*\n\s+articles:/);
  assert.match(config, /permalink:\s*\/blog\/:path/);
});

test('preview exposes the general feed, tag feeds and navigation', { skip: !preview }, async () => {
  async function get(url) {
    const response = await fetch(new URL(url, preview));
    assert.equal(response.status, 200, url);
    return response.text();
  }

  const blog = await get('/blog/');
  const navigation = blog.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(navigation);
  assert.match(navigation[1], /<a href="https:\/\/paypal\.me\/blackscorp" target="_blank" rel="noopener noreferrer" aria-label="Support über PayPal \(öffnet in neuem Tab\)"><svg[^>]+aria-hidden="true">[\s\S]*?<\/svg><span>Support<\/span><\/a>/);
  assert.match(blog, /<link[^>]+type="application\/atom\+xml"[^>]+href="[^"]*\/feed.xml"/);
  assert.match(blog, /class="blog-feed-icon" href="\/feed.xml"[^>]+target="_blank" rel="noopener noreferrer"[^>]+aria-label="[^"]*öffnet in neuem Tab/);
  assert.doesNotMatch(blog, /Alle Tags|RSS-Feed: alle Beiträge/);
  for (const tag of new Set(articleTags())) {
    assert.ok(blog.includes(`href="/blog/tags/${encodeURIComponent(tag)}/"`));
  }
  const overview = await get('/blog/tags/');
  const stylesheet = await get('/assets/css/site.css');
  assert.doesNotMatch(stylesheet, /\.tag-section:target/);
  for (const tag of new Set(articleTags())) {
    assert.ok(overview.includes(`href="/blog/tags/${tag}/"`));
    const page = await get(`/blog/tags/${tag}/`);
    assert.match(page, new RegExp(`<h1>${tag}</h1>`));
    assert.ok(page.includes(`class="blog-feed-icon" href="/feed/by_tag/${tag}.xml"`));
    assert.match(page, /class="blog-feed-icon"[^>]+target="_blank" rel="noopener noreferrer"[^>]+aria-label="[^"]*öffnet in neuem Tab/);
    assert.match(page, /class="blog-list"/);
    assert.doesNotMatch(page, /class="post-tags"|tag-section|tag-empty/);
    assert.equal([...page.matchAll(/<h1[ >]/g)].length, 1);
  }
  const generalFeed = await get('/feed.xml');
  assert.match(generalFeed, /<feed[^>]+xmlns="http:\/\/www.w3.org\/2005\/Atom"/);
  assert.doesNotMatch(generalFeed, /<html/);
  assert.match(generalFeed, /<link[^>]+href="https?:\/\//);

  for (const tag of new Set(articleTags())) {
    const feedPath = `/feed/by_tag/${tag}.xml`;
    const feed = await get(feedPath);
    assert.match(feed, /<feed[^>]+xmlns="http:\/\/www.w3.org\/2005\/Atom"/);
    if (generalFeed.includes(`term="${tag}"`)) assert.match(feed, /<entry>/);
    for (const entry of feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      assert.ok(entry[1].includes(`term="${tag}"`), `${feedPath}: falscher Tag`);
      assert.match(entry[1], /<link[^>]+href="https?:\/\//);
    }
  }
});
