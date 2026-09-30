// Reading the collection from the YAML files, for the scripts that need to know which
// figures exist. The site has its own version of this in src/data/collection.js, which
// needs Vite to read YAML and so cannot run from a script.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

export const ROOT = fileURLToPath(new URL("../..", import.meta.url));
export const DATA_DIR = path.join(ROOT, "data");

// An image is a BrickLink ID with files of its own, or a full URL with none
export const isRemoteImage = image => /^(https?:)?\/\//i.test(image);

export const loadThemes = () => load(fs.readFileSync(path.join(DATA_DIR, "themes.yaml"), "utf8"));

export const themeFile = theme => path.join(DATA_DIR, `${theme.key}.yaml`);

export const loadCharacters = theme => load(fs.readFileSync(themeFile(theme), "utf8")) ?? [];

// Every variant in the collection, each with its character and theme
export function allVariants() {
  return loadThemes().flatMap(theme =>
    loadCharacters(theme).flatMap(character => character.variants.map(variant => ({ theme, character, variant })))
  );
}

// The BrickLink ID of every figure that has files of its own, each once
export function localImageIds() {
  const ids = allVariants().map(({ variant }) => variant.image).filter(image => image && !isRemoteImage(image));
  return [...new Set(ids)];
}
