import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";

// Full-art pictures are named after a BrickLink ID like every other image, but
// the page has to know which figures have one, so the folder is listed once
// here. A new file needs the dev server restarted to be noticed.
const fullArts = (() => {
  try {
    return readdirSync("assets/full_arts").filter(file => /\.(png|webp|jpe?g)$/i.test(file));
  } catch {
    return [];
  }
})();

export default defineConfig({
  // The site is served from https://uapcent.github.io/Test_cards/
  base: "/Test_cards/",
  // Images are served as they are, under their own names
  publicDir: "assets",
  // stale files from an earlier build must not ship
  build: { emptyOutDir: true },
  define: { __FULL_ARTS__: JSON.stringify(fullArts) },
  plugins: [react(), yaml()]
});
