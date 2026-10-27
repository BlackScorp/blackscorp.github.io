#!/usr/bin/env python3
"""Convert an image to WebP, optionally scaling it down to a target width."""

import argparse
from pathlib import Path
from PIL import Image, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--width", type=int, help="Maximum output width; aspect ratio is preserved")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality (default: 82)")
    args = parser.parse_args()

    if args.output.suffix.lower() != ".webp":
        parser.error("output filename must end in .webp")
    if args.width is not None and args.width < 1:
        parser.error("--width must be a positive integer")
    if not 0 <= args.quality <= 100:
        parser.error("--quality must be between 0 and 100")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(args.source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "transparency" in image.info else "RGB")
        if args.width and image.width > args.width:
            height = round(image.height * args.width / image.width)
            image = image.resize((args.width, height), Image.Resampling.LANCZOS)
        image.save(args.output, format="WEBP", quality=args.quality, method=6)
        print(f"{args.output}: {image.width}x{image.height}")


if __name__ == "__main__":
    main()
