from pathlib import Path
from PIL import Image
import re

# ===== CONFIG =====
IMAGE_DIR = Path("assets/minifigures_images")
THUMB_DIR = IMAGE_DIR / "thumbnails"

TARGET_WIDTH = 200
TARGET_HEIGHT = 200
WEBP_QUALITY = 80
# ==================

THUMB_DIR.mkdir(exist_ok=True)

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def clean_stem(stem: str) -> str:
    # Remove "original" (case-insensitive)
    cleaned = re.sub(r"original", "", stem, flags=re.IGNORECASE)

    # Remove leftover separators like ".", "_" or "-"
    cleaned = cleaned.rstrip("._-")

    return cleaned

def create_thumbnail(image_path: Path):
    cleaned_stem = clean_stem(image_path.stem)
    out_path = THUMB_DIR / f"{cleaned_stem}.webp"

    if out_path.exists():
        # print(f"{image_path.name} -> thumbnails/{out_path.name} (skipped)")
        return

    with Image.open(image_path) as img:
        img = img.convert("RGBA")

        # Resize while keeping aspect ratio
        img.thumbnail((TARGET_WIDTH, TARGET_HEIGHT), Image.LANCZOS)

        # Create exact-size canvas (centered)
        canvas = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (0, 0, 0, 0))
        x = (TARGET_WIDTH - img.width) // 2
        y = (TARGET_HEIGHT - img.height) // 2
        canvas.paste(img, (x, y), img)

        canvas.save(
            out_path,
            "WEBP",
            quality=WEBP_QUALITY,
            method=6
        )

        print(f"{image_path.name} -> thumbnails/{out_path.name}")

def main():
    for img_path in IMAGE_DIR.iterdir():
        if img_path.is_file() and img_path.suffix.lower() in SUPPORTED_EXTS:
            if img_path.parent.name == "thumbnails":
                continue
            create_thumbnail(img_path)

    print("Done.")

if __name__ == "__main__":
    main()
