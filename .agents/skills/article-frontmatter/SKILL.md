---
name: article-frontmatter
description: "Review or update Front Matter for Jekyll blog articles: published date, SEO keywords, reusable tags, and Mermaid or model-viewer loading. Use when asked to adjust, check, clean up, or complete article metadata or Front Matter."
metadata:
  short-description: "Maintain article titles, slugs, SEO metadata, tags, and embedded viewers"
---

# Article Front Matter

Use this skill only for article metadata tasks in `_articles/`. Do not rewrite article prose unless the user asks.

## Workflow

1. Identify the target article and inspect its complete Front Matter and content. Check nearby article metadata and the site's post layout when needed.
2. Check `published` and `date`. Keep an explicitly requested publication date. If the intended date is not specified, preserve a plausible existing date; do not silently replace it with today's date. Flag a missing, malformed, or future date if its intent is unclear. Use `YYYY-MM-DD` and ensure `published: true` only when the article is intended to be public.
3. Ensure `title` and the article slug agree. Derive the slug from the title using lowercase words separated by hyphens, matching the repository's established URL style. The slug must match the final slug segment of the article directory (preserve any leading numeric article prefix), and the `permalink` must be `/blog/SLUG/`. If the user changes the title, rename the article directory and update its permalink to match. Do not change a title solely to normalize it unless requested; report a mismatch when a title or slug change was not part of the request.
4. Review `description` as a concise, accurate summary of the article, suitable for search previews. Update it when the article's subject or title changes; keep it aligned with the actual content and avoid claims absent from the article. Review `keywords` against the article's actual subject and likely search phrases. Prefer a concise list of specific, relevant terms and phrases; remove duplicates and unrelated or overly broad entries.
5. Before suggesting tags, collect existing tags from other `_articles/*/index.md` Front Matter. Reuse exact existing tags when they fit. Keep tags lowercase and use only letters, digits, and underscores, consistent with the site's tag-page rules. Suggest a new tag only when no existing tag accurately covers the topic. Avoid empty tag lists when useful tags can be assigned.
6. Search the article body for fenced Mermaid blocks (for example, a Markdown fence labelled `mermaid`). If one or more are present, set `mermaid: true`. If none are present, remove the `mermaid` key from Front Matter; the post layout loads Mermaid scripts only when `page.mermaid == true`.
7. Search the article body for `<model-viewer>` elements. If one or more are present, set `model_viewer: true`. If none are present, remove the `model_viewer` key; the post layout loads the local model-viewer module only when `page.model_viewer == true`. Keep model files local to the article and use paths that resolve from its published URL.
8. If renaming an article directory, check `comments_key` and `_data/comments/` references. Preserve an existing discussion key and its data-file mapping so comments remain attached; do not rename or discard discussion data just to match the new article slug. Update slug-derived references only when their relationship is clear.
9. Preserve unrelated Front Matter fields, their values, and article content. Keep the existing YAML style where practical. Summarize changed fields and mention any date or metadata ambiguity that needs the user's decision.

## Trigger phrases

This skill is intended for explicit requests such as “adjust article Front Matter,” “check the article metadata,” “fix the SEO description/keywords/tags/date,” “reuse existing blog tags,” “synchronize the Mermaid flag,” or “change the article title and slug.” It is configured for explicit invocation only and should not activate for general article editing.
