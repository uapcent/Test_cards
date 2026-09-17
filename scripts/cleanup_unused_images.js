// Lists images that no card uses. Nothing is deleted unless you pass --delete.
//   node scripts/cleanup_unused_images.js
//   node scripts/cleanup_unused_images.js --delete
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { allGroups } from "../card_data/index.js";
import { isRemoteImage } from "./images.js";

// ===== PATHS =====
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const IMAGE_DIR = path.join(ROOT, "assets/minifigures_images");
const THUMB_DIR = path.join(IMAGE_DIR, "thumbnails");

const SUPPORTED_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

// Used by the code (fallback for cards without an image), not by card data
const ALWAYS_KEEP = ["unknown_character"];
// =================

const shouldDelete = process.argv.includes("--delete");

// Same rule as clean_stem() in optimizeImages.py: "sw0812.original.png" → "sw0812"
function originalId(file) {
  return path.parse(file).name
    .replace(/original/gi, "")
    .replace(/[._-]+$/, "");
}

function thumbnailId(file) {
  return path.parse(file).name;
}

// Card data stores local images as IDs ("sw0812"); URLs have no local file
const usedIds = new Set(ALWAYS_KEEP);

for (const group of allGroups) {
  for (const card of group.cards) {
    for (const { image } of [card, ...(card.variants ?? [])]) {
      if (image && !isRemoteImage(image)) usedIds.add(image);
    }
  }
}

function findUnused(dir, idOf) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .filter(entry => SUPPORTED_EXTS.has(path.extname(entry.name).toLowerCase()))
    .filter(entry => !usedIds.has(idOf(entry.name)))
    .map(entry => path.join(dir, entry.name));
}

const unused = [
  ...findUnused(IMAGE_DIR, originalId),
  ...findUnused(THUMB_DIR, thumbnailId)
];

for (const file of unused) {
  if (shouldDelete) fs.unlinkSync(file);
  console.log(`${shouldDelete ? "Deleted" : "Unused"}: ${path.relative(ROOT, file)}`);
}

console.log(shouldDelete
  ? `Deleted ${unused.length} unused images.`
  : `Found ${unused.length} unused images. Run with --delete to remove them.`);
