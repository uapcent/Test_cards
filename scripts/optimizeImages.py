"""Makes the small, padded thumbnails used by Tokens, Classic and Rankings.

Built from the cutouts (background already removed) rather than the raw
BrickLink originals, so the padding around the figure is transparent and the
token's own disc colour shows through instead of a white square. Falls back
to the original for anything that has no cutout yet, e.g. unknown_character.

Always regenerates every thumbnail, unlike makeCutouts.py: a thumbnail is
nothing but a mechanical resize of its cutout, never edited by hand, so
there's no reason to skip one that already exists — re-running this after
fixing a cutout by hand picks the fix up automatically.

    python scripts/optimizeImages.py
"""
from pathlib import Path
from PIL import Image
import re

import numpy as np

# ===== CONFIG =====
ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "source_images"
CUTOUT_DIR = ROOT / "assets/minifigures_images/cutouts"
THUMB_DIR = ROOT / "assets/minifigures_images/thumbnails"

TARGET_WIDTH = 200
TARGET_HEIGHT = 200
WEBP_QUALITY = 80

# A figure holding something out to one side, or with a raised weapon, makes
# its overall picture wider on one side than the other — centering on the
# whole picture then centers on that lopsided box, not on the figure. These
# tune how find_head_center_x() tells the head apart from that kind of thing.
HEAD_WIDTH_FRACTION = 0.45   # a row this wide (of the figure's total width) counts as head/shoulders, not a held item
HEAD_SEARCH_FRACTION = 0.5   # only look this far down the figure for where the head starts
HEAD_BAND_FRACTION = 0.22    # once found, average the head's centre over this much further down
# ==================

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def clean_stem(stem: str) -> str:
    # Remove "original" (case-insensitive)
    cleaned = re.sub(r"original", "", stem, flags=re.IGNORECASE)

    # Remove leftover separators like ".", "_" or "-"
    cleaned = cleaned.rstrip("._-")

    return cleaned

def find_originals() -> dict[str, Path]:
    """The biggest original for each image ID, same rule as makeCutouts.py."""
    originals: dict[str, Path] = {}
    for path in SOURCE_DIR.iterdir():
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTS:
            continue
        key = clean_stem(path.stem)
        if key not in originals or path.stat().st_size > originals[key].stat().st_size:
            originals[key] = path
    return originals

def find_head_center_x(alpha_mask: np.ndarray) -> float | None:
    """Approximate where the head is horizontally, so a raised weapon or an
    item held out to one side doesn't drag the whole figure off-centre.

    The head is always at the top, but a thin raised item can be at the very
    top too, narrower than the head/shoulders below it. This walks down from
    the top looking for the first band of rows wide enough to plausibly be a
    head — skipping over anything narrower — and averages its horizontal
    centre over a bit further down. Approximate on purpose: it only has to be
    closer than "centre of the whole picture", not exact.
    """
    rows = np.where(alpha_mask.any(axis=1))[0]
    cols = np.where(alpha_mask.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        return None

    top, bottom = int(rows[0]), int(rows[-1])
    content_width = int(cols[-1]) - int(cols[0]) + 1
    content_height = bottom - top + 1
    head_width_floor = content_width * HEAD_WIDTH_FRACTION

    search_bottom = min(top + int(content_height * HEAD_SEARCH_FRACTION), bottom)
    head_top = top
    consecutive = 0
    for y in range(top, search_bottom + 1):
        xs = np.where(alpha_mask[y])[0]
        width = (xs[-1] - xs[0] + 1) if len(xs) else 0
        if width >= head_width_floor:
            consecutive += 1
            if consecutive >= 3:
                head_top = max(top, y - consecutive + 1)
                break
        else:
            consecutive = 0
    # if nothing was wide enough, head_top stays at the very top of the figure

    head_bottom = min(head_top + max(1, int(content_height * HEAD_BAND_FRACTION)), bottom)
    centers = []
    for y in range(head_top, head_bottom + 1):
        xs = np.where(alpha_mask[y])[0]
        if len(xs):
            centers.append((xs[0] + xs[-1]) / 2)

    if centers:
        return float(np.median(centers))
    return (int(cols[0]) + int(cols[-1])) / 2

def create_thumbnail(image_id: str, source: Path):
    out_path = THUMB_DIR / f"{image_id}.webp"

    with Image.open(source) as original:
        img = original.convert("RGBA")
        original_height = img.height
        alpha_mask = np.array(img)[..., 3] > 8
        head_x = find_head_center_x(alpha_mask)

        # Every figure is a standing minifig, always taller than it is wide —
        # only a spread-out accessory (wings, a cape, a weapon held out to the
        # side) ever makes the *picture* wider than tall. So height is always
        # what the figure itself is scaled by, never width: fitting a wide
        # picture by width instead would shrink the actual figure down small
        # and pad it top and bottom, pushing the head away from the top edge
        # that the CSS crop zooms into. Scaling by height keeps the figure
        # full-height and simply lets an accessory that sticks out past 200px
        # wide be cropped by the canvas, which the horizontal head-centring
        # below already handles.
        scale = min(1, TARGET_HEIGHT / original_height)  # never upscale a small original
        img = img.resize((max(1, round(img.width * scale)), round(original_height * scale)), Image.LANCZOS)

        # Create exact-size canvas. Vertically the figure now always fills the
        # full height, so it's simply top-aligned. Horizontally, centre on the
        # head rather than the whole (possibly lopsided) picture.
        canvas = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (0, 0, 0, 0))
        y = (TARGET_HEIGHT - img.height) // 2
        if head_x is not None:
            x = round(TARGET_WIDTH / 2 - head_x * scale)
            # still keep at least a third of the figure on-canvas either way,
            # in case the heuristic gets an unusual picture wrong
            x = max(min(x, TARGET_WIDTH - img.width // 3), img.width // 3 - img.width)
        else:
            x = (TARGET_WIDTH - img.width) // 2
        canvas.paste(img, (x, y), img)

        canvas.save(
            out_path,
            "WEBP",
            quality=WEBP_QUALITY,
            method=6
        )

        print(f"{source.relative_to(ROOT)} -> thumbnails/{out_path.name}")

def main():
    THUMB_DIR.mkdir(parents=True, exist_ok=True)

    originals = find_originals()
    no_cutout = 0
    for image_id, original in sorted(originals.items()):
        cutout = CUTOUT_DIR / f"{image_id}.webp"
        if cutout.exists():
            source = cutout
        else:
            source = original
            no_cutout += 1
        create_thumbnail(image_id, source)

    print("Done.")
    if no_cutout:
        print(f"{no_cutout} had no cutout and used the original instead.")

if __name__ == "__main__":
    main()
