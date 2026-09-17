// Lists images that no character uses. Nothing is deleted unless you pass --delete.
//   node scripts/cleanup_unused_images.js
//   node scripts/cleanup_unused_images.js --delete
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load } from "js-yaml";

// ===== PATHS =====
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DATA_DIR = path.join(ROOT, "data");
const IMAGE_DIR = path.join(ROOT, "assets/minifigures_images");
const THUMB_DIR = path.join(IMAGE_DIR, "thumbnails");

const SUPPORTED_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

// Used by the code as the fallback picture, not by the data
const ALWAYS_KEEP = ["unknown_character"];
// =================

const shouldDelete = process.argv.includes("--delete");

// Same rule as clean_stem() in optimizeImages.py: "sw0812.original.png" -> "sw0812"
function originalId(file) {
  return path.parse(file).name
    .replace(/original/gi, "")
    .replace(/[._-]+$/, "");
}

const themes = load(fs.readFileSync(path.join(DATA_DIR, "themes.yaml"), "utf8"));

// Images are BrickLink IDs, or full URLs that have no local file
const usedIds = new Set(ALWAYS_KEEP);
for (const theme of themes) {
  const characters = load(fs.readFileSync(path.join(DATA_DIR, `${theme.key}.yaml`), "utf8"));
  for (const character of characters) {
    for (const variant of character.variants) {
      if (variant.image && !/^(https?:)?\/\//i.test(variant.image)) usedIds.add(variant.image);
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
  ...findUnused(THUMB_DIR, file => path.parse(file).name)
];

for (const file of unused) {
  if (shouldDelete) fs.unlinkSync(file);
  console.log(`${shouldDelete ? "Deleted" : "Unused"}: ${path.relative(ROOT, file)}`);
}

console.log(shouldDelete
  ? `Deleted ${unused.length} unused images.`
  : `Found ${unused.length} unused images. Run with --delete to remove them.`);
