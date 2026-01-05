from pathlib import Path
from PIL import Image

# ===== CONFIG =====
IMAGE_DIR = Path("assets/minifigures_images")
THUMB_DIR = IMAGE_DIR / "thumbnails"

TARGET_WIDTH = 200      # ideal for cards
TARGET_HEIGHT = 200     # uniform size
WEBP_QUALITY = 80       # good balance quality/size
# ==================

THUMB_DIR.mkdir(exist_ok=True)

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def create_thumbnail(image_path: Path):
    out_path = THUMB_DIR / (image_path.stem + ".webp")

    if out_path.exists():
        return  # skip already processed

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

        print(f"✔ {image_path.name} → thumbnails/{out_path.name}")

def main():
    for img_path in IMAGE_DIR.iterdir():
        if img_path.is_file() and img_path.suffix.lower() in SUPPORTED_EXTS:
            if img_path.parent.name == "thumbnails":
                continue
            create_thumbnail(img_path)

    print("Done.")

if __name__ == "__main__":
    main()
