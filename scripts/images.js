// Card data stores images either as BrickLink IDs ("sw0812"), which map to
// generated thumbnails, or as full URLs for images with no local thumbnail.
const THUMBNAIL_DIR = new URL("../assets/minifigures_images/thumbnails/", import.meta.url);

export const UNKNOWN_IMAGE = new URL("unknown_character.webp", THUMBNAIL_DIR).href;

export function isRemoteImage(image) {
  return /^(https?:)?\/\//i.test(image);
}

export function resolveImage(image) {
  if (!image) return UNKNOWN_IMAGE;
  if (isRemoteImage(image)) return image;
  return new URL(`${image}.webp`, THUMBNAIL_DIR).href;
}

// Stable key for an image: its file name without folders or extension.
export function imageId(image) {
  return image
    .slice(image.lastIndexOf("/") + 1)
    .replace(/\.(png|jpe?g|webp)$/i, "");
}
