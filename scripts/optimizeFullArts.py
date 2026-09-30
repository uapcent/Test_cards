"""Turns the custom renders dropped into assets/full_arts/ into what the site serves.

Full arts are hand-made pictures for the Epic and Legendary trading cards, named
after a BrickLink ID like everything else (njo0121.png). Whatever isn't a WebP yet
is converted here, and the original moves to source_images/full_arts/ so the
full-size picture is kept but never served — the same split as the cutouts.

Two things are done to each one besides the conversion:

  - It is trimmed to its visible pixels. A card draws every figure at one height
    with its feet on one line, so any transparent padding under the feet would make
    that figure float above the others.
  - It is shrunk to MAX_HEIGHT, since a card never shows one larger than about 550
    pixels tall on a high-density screen.

A file that is already a WebP is left alone, so a render you have finished by hand
is never touched again.

    python scripts/optimizeFullArts.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "assets/full_arts"
ORIGINALS_DIR = ROOT / "source_images/full_arts"

MAX_HEIGHT = 900
WEBP_QUALITY = 88
CONVERTIBLE = {".png", ".jpg", ".jpeg"}

def main():
    ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)
    converted = 0

    for path in sorted(ART_DIR.iterdir()):
        if not path.is_file() or path.suffix.lower() not in CONVERTIBLE:
            continue

        before_kb = path.stat().st_size / 1024
        img = Image.open(path).convert("RGBA")

        box = img.getchannel("A").getbbox()
        if box:
            img = img.crop(box)
        if img.height > MAX_HEIGHT:
            ratio = MAX_HEIGHT / img.height
            img = img.resize((round(img.width * ratio), MAX_HEIGHT), Image.LANCZOS)

        out_path = path.with_suffix(".webp")
        img.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
        path.replace(ORIGINALS_DIR / path.name)

        after_kb = out_path.stat().st_size / 1024
        print(f"{path.name} -> {out_path.name}  {img.width}x{img.height}  {before_kb:.0f} KB -> {after_kb:.0f} KB")
        converted += 1

    print(f"Converted {converted} full art{'' if converted == 1 else 's'}.")

if __name__ == "__main__":
    main()
