"""Cuts the background out of the figure images for the Showcase page.

The pictures come from BrickLink on a plain white background. Filling inwards
from the corners removes it without touching white parts inside the figure.

    python scripts/makeCutouts.py            only missing ones
    python scripts/makeCutouts.py --force    all of them again
"""
from pathlib import Path
import re
import sys

from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import yaml

# ===== CONFIG =====
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SOURCE_DIR = ROOT / "source_images"
OUT_DIR = ROOT / "assets/minifigures_images/cutouts"

MAX_HEIGHT = 600        # tall enough for the large figure, never upscaled
WEBP_QUALITY = 82
FILL_TOLERANCE = 36     # how far a pixel may differ from the corner and still count as background
EDGE_SOFTNESS = 0.7     # blur on the cut edge, in pixels
# ==================

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
MARKER = (255, 0, 255)


def clean_stem(stem: str) -> str:
    """Same rule as optimizeImages.py: "sw0812.original.png" -> "sw0812"."""
    return re.sub(r"original", "", stem, flags=re.IGNORECASE).rstrip("._-")


def used_image_ids() -> list[str]:
    themes = yaml.safe_load((DATA_DIR / "themes.yaml").read_text(encoding="utf-8"))
    ids = set()
    for theme in themes:
        characters = yaml.safe_load((DATA_DIR / f"{theme['key']}.yaml").read_text(encoding="utf-8"))
        for character in characters:
            for variant in character["variants"]:
                image = variant.get("image")
                if image and not re.match(r"^(https?:)?//", image):
                    ids.add(image)
    return sorted(ids)


def find_sources() -> dict[str, Path]:
    """The biggest original for each image ID."""
    sources: dict[str, Path] = {}
    for path in SOURCE_DIR.iterdir():
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTS:
            continue
        key = clean_stem(path.stem)
        if key not in sources or path.stat().st_size > sources[key].stat().st_size:
            sources[key] = path
    return sources


def background_mask(image: Image.Image) -> np.ndarray:
    """True where the pixel belongs to the background."""
    filled = image.copy()
    for corner in [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]:
        if filled.getpixel(corner) == MARKER:
            continue
        ImageDraw.floodfill(filled, corner, MARKER, thresh=FILL_TOLERANCE)

    before = np.array(image)
    after = np.array(filled)
    changed = np.any(before != after, axis=2)
    # pixels that were already the marker colour must not count as background
    return changed & np.all(after == MARKER, axis=2)


def make_cutout(source: Path, out_path: Path) -> str:
    original = Image.open(source)

    if original.mode in ("RGBA", "LA") and np.array(original.convert("RGBA"))[..., 3].min() < 250:
        # already cut out
        figure = original.convert("RGBA")
    else:
        rgb = original.convert("RGB")
        mask = background_mask(rgb)
        alpha = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8), mode="L")
        alpha = alpha.filter(ImageFilter.GaussianBlur(EDGE_SOFTNESS))
        figure = rgb.convert("RGBA")
        figure.putalpha(alpha)

    box = figure.getchannel("A").getbbox()
    if box is None:
        return "empty"

    figure = figure.crop(box)
    share = np.count_nonzero(np.array(figure)[..., 3] > 8) / (figure.width * figure.height)

    if figure.height > MAX_HEIGHT:
        width = round(figure.width * MAX_HEIGHT / figure.height)
        figure = figure.resize((width, MAX_HEIGHT), Image.LANCZOS)

    figure.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)

    # a figure filling its whole box usually means the background was not found
    return "check" if share > 0.97 else "ok"


def main() -> None:
    force = "--force" in sys.argv
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = find_sources()
    written, skipped, missing, suspicious = 0, 0, [], []

    for image_id in used_image_ids():
        source = sources.get(image_id)
        if source is None:
            missing.append(image_id)
            continue

        out_path = OUT_DIR / f"{image_id}.webp"
        if out_path.exists() and not force:
            skipped += 1
            continue

        result = make_cutout(source, out_path)
        written += 1
        if result != "ok":
            suspicious.append(f"{image_id} ({result})")

    print(f"wrote {written}, already there {skipped}")
    if missing:
        print(f"no original for {len(missing)}: {', '.join(missing[:10])}")
    if suspicious:
        print(f"worth a look ({len(suspicious)}): {', '.join(suspicious)}")


if __name__ == "__main__":
    main()
