import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";


// ===== PATHS =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILES = [
  "./card_data/dcCardData.js",
  "./card_data/marvelCardData.js",
  "./card_data/miscCardData.js",
  "./card_data/ninjagoCardData.js",
  "./card_data/starWarsCardData.js",
];

const IMAGE_DIR = path.resolve("assets/minifigures_images");
const THUMB_DIR = path.join(IMAGE_DIR, "thumbnails");

const SUPPORTED_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
// =================

// -------- helpers --------
function normalizeFilename(value) {
  if (!value) return null;

  // full URL → filename
  const name = value.includes("/")
    ? value.substring(value.lastIndexOf("/") + 1)
    : value;

  return name;
}

function toThumbnailName(filename) {
  return filename
    .replace(/original/gi, "")
    .replace(/\.(png|jpg|jpeg|webp)$/i, ".webp")
    .replace(/[._-]+$/, "");
}

function collectImagesFromCards(cards, set) {
  for (const card of cards) {
    if (card.image) {
      const img = normalizeFilename(card.image);
      if (img) set.add(img);
    }

    if (Array.isArray(card.variants)) {
      for (const v of card.variants) {
        if (v.image) {
          const img = normalizeFilename(v.image);
          if (img) set.add(img);
        }
      }
    }
  }
}
// -------------------------

// Load data files
const usedOriginals = new Set();
const usedThumbs = new Set();

for (const file of DATA_FILES) {
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  const groups = Object.values(mod).flat();

  for (const group of groups) {
    if (!group.cards) continue;

    collectImagesFromCards(group.cards, usedOriginals);
  }
}

// Build thumbnail set
for (const img of usedOriginals) {
  usedThumbs.add(toThumbnailName(img));
}

// ---- cleanup originals ----
for (const file of fs.readdirSync(IMAGE_DIR)) {
  const full = path.join(IMAGE_DIR, file);
  if (fs.statSync(full).isDirectory()) continue;

  const ext = path.extname(file).toLowerCase();
  if (!SUPPORTED_EXTS.has(ext)) continue;

  if (!usedOriginals.has(file)) {
    fs.unlinkSync(full);
    console.log("Deleted original:", file);
  }
}

// ---- cleanup thumbnails ----
for (const file of fs.readdirSync(THUMB_DIR)) {
  if (!usedThumbs.has(file)) {
    fs.unlinkSync(path.join(THUMB_DIR, file));
    console.log("Deleted thumbnail:", file);
  }
}

console.log("Cleanup complete.");
