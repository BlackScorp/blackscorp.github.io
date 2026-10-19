const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const preview = process.env.BLOG_PREVIEW_URL;

test('discovery files are generated from Jekyll content', () => {
  const config = readFileSync(path.join(root, '_config.yml'), 'utf8');
  assert.match(config, /^  - jekyll-sitemap$/m);
  const template = readFileSync(path.join(root, '_pages/llm.txt'), 'utf8');
  assert.match(template, /^layout: null$/m);
  assert.match(template, /^permalink: \/llm.txt$/m);
  assert.match(template, /^sitemap: false$/m);
  assert.match(template, /site.pages/);
  assert.match(template, /site.posts/);
  assert.match(template, /absolute_url/);
});

test('preview serves the sitemap, robots and generated LLM index', { skip: !preview }, async () => {
  async function get(url) {
    const response = await fetch(new URL(url, preview));
    assert.equal(response.status, 200, url);
    return response.text();
  }

  const sitemap = await get('/sitemap.xml');
  assert.match(sitemap, /<urlset[^>]+xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locations.length > 0);
  assert.equal(new Set(locations).size, locations.length);
  for (const location of locations) assert.equal(new URL(location).origin, 'https://blackscorp.github.io');
  assert.ok(locations.some((location) => new URL(location).pathname === '/'));
  assert.ok(!locations.some((location) => new URL(location).pathname === '/llm.txt'));
  assert.ok(!locations.some((location) => new URL(location).pathname === '/cv/'));
  const cv = await fetch(new URL('/cv/', preview));
  assert.equal(cv.status, 404);

  const robots = await get('/robots.txt');
  assert.match(robots, /Sitemap: https:\/\/blackscorp.github.io\/sitemap.xml/);

  const index = await get('/llm.txt');
  assert.match(index, /^# Vitalij Mik/m);
  assert.match(index, /^## Seiten$/m);
  assert.match(index, /^## Blogbeiträge$/m);
  assert.doesNotMatch(index, /<html|<!DOCTYPE|\{%|\{\{|^---$/im);
  const links = [...index.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  assert.ok(links.length > 0);
  assert.equal(new Set(links).size, links.length);
  assert.ok(links.some((link) => new URL(link).pathname === '/'));
  assert.ok(!links.some((link) => new URL(link).pathname === '/cv/'));
  for (const link of links) assert.ok(locations.includes(link), `${link}: fehlt in Sitemap`);
});
