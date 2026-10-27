---
name: article-image-variants
description: Convert existing image files into WebP article assets for this Jekyll blog, creating mobile, tablet, desktop, and hero thumbnail variants and updating image Front Matter. Use only when asked to create, convert, resize, or prepare WebP images for a blog article; do not use for generating new artwork or general image editing.
metadata:
  short-description: Article image WebP variants
---

# Article image variants

Use this skill when a Jekyll article needs its source images converted to WebP and prepared for the site's responsive image includes.

## Workflow

1. Identify the article directory, its source images, and whether each is the hero image (`image` in Front Matter) or an inline image rendered with `article-image.html`. Keep original source files unless the user asks to remove them.
2. For the hero image, create only the full-size WebP first. Preserve its aspect ratio and do not crop. Update `image`, `image_width`, and `image_height` in the article Front Matter to point to the WebP and its actual dimensions. Keep any existing alt text and caption.
3. Show the full-size WebP in the article's actual layout and ask the user to approve it before generating responsive variants. If the local preview cannot run, explain the concrete blocker and show the image file for review; do not generate the responsive set until approval.
4. After approval, create a 640 px wide mobile image and a 1024 px wide tablet image, keeping the aspect ratio and never cropping. For the hero image, also create a 480 px wide preview. Use the source dimensions if the image is smaller than a target; never enlarge an image.
5. Add or update `image_mobile`, `image_tablet`, `image_preview`, `image_preview_width`, and `image_preview_height` for the hero. Update article prose to use `{% include article-image.html src="..." mobile="..." tablet="..." width="..." height="..." alt="..." %}` for inline images, using the desktop WebP dimensions. Inline images do not get a preview variant.
6. Use WebP for every generated variant. Name files from the source basename, with `-mobile`, `-tablet`, and (hero only) `-preview` suffixes. Ensure all references resolve within the article directory and preserve the image's original proportions.

Use `scripts/resize_webp.py` for deterministic conversion and resizing. It writes only the requested output file and never crops or enlarges. Inspect the generated image and Front Matter before finishing. Do not change `published`, dates, or unrelated article content.
