import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";

export default defineConfig({
  // The site is served from https://uapcent.github.io/Test_cards/
  base: "/Test_cards/",
  // Images are served as they are, under their own names
  publicDir: "assets",
  // stale files from an earlier build must not ship
  build: { emptyOutDir: true },
  plugins: [react(), yaml()]
});
