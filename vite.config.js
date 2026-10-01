import { execFile } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";
import { ID_PATTERN, fetchCatalogPage, parseCatalogPage, pictureUrl } from "./scripts/lib/bricklink.js";

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

// The pictures available as theme backdrops, for the dev-only card editor's picker. Read
// once at start-up like the full arts.
const themeArt = (() => {
  try {
    return readdirSync("assets/theme_backgrounds").filter(file => /\.(png|webp|jpe?g)$/i.test(file));
  } catch {
    return [];
  }
})();

const IMAGE_FILE = /\.(png|webp|jpe?g|avif)$/i;
const listImages = folder => {
  try {
    return readdirSync(folder).filter(file => IMAGE_FILE.test(file));
  } catch {
    return [];
  }
};

// Runs a Python script from the project folder and gives back what it printed
const runPython = (script, args = []) =>
  new Promise(done => {
    execFile("python", [script, ...args], { timeout: 5 * 60 * 1000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      const output = `${stdout}${stderr}`.trim();
      done({ ok: !error, output: error && !output ? error.message : output });
    });
  });

// Endpoints for the dev-only register and check pages, under /__dev/. They exist only
// while `npm run dev` runs (apply: "serve"), so a build has none of this. The browser
// cannot read BrickLink itself (no CORS), nor see which files are in the folders.
//   GET  /__dev/files              the image files in each folder, read fresh every time
//   GET  /__dev/bricklink?id=      what a catalog page says: name, label, year, theme
//   POST /__dev/picture?id=        saves BrickLink's picture into source_images/
//   POST /__dev/make-images        runs the cutout and thumbnail scripts, as npm run does
function devTools() {
  const json = (res, status, body) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };

  return {
    name: "dev-tools",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__dev", async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        const id = url.searchParams.get("id") ?? "";
        try {
          if (url.pathname === "/files") {
            return json(res, 200, {
              source: listImages("source_images"),
              cutouts: listImages("assets/minifigures_images/cutouts"),
              thumbnails: listImages("assets/minifigures_images/thumbnails"),
              fullArts: listImages("assets/full_arts")
            });
          }
          if (url.pathname === "/make-images" && req.method === "POST") {
            // in this order, since thumbnails are made from the cutouts; the scripts
            // themselves decide what needs doing (cutouts skips existing ones)
            let log = "";
            // (and thumbnails only for the figures that have none: all of them take minutes)
            for (const [script, args] of [["makeCutouts.py", []], ["optimizeImages.py", ["--missing"]]]) {
              const result = await runPython(`scripts/${script}`, args);
              log += `$ python scripts/${script} ${args.join(" ")}
${result.output}
`;
              if (!result.ok) return json(res, 200, { ok: false, output: log });
            }
            return json(res, 200, { ok: true, output: log });
          }
          if (!ID_PATTERN.test(id)) return json(res, 400, { error: "That is not a BrickLink ID." });
          if (url.pathname === "/bricklink") {
            const { html } = await fetchCatalogPage(id);
            return json(res, 200, { id, ...parseCatalogPage(html, id) });
          }
          if (url.pathname === "/picture" && req.method === "POST") {
            mkdirSync("source_images", { recursive: true });
            const existing = readdirSync("source_images").find(file => file.replace(/\.original/, "").replace(/\.[^.]+$/, "") === id);
            if (existing) return json(res, 200, { saved: false, file: existing });
            const picture = await fetch(pictureUrl(id));
            if (!picture.ok) return json(res, 200, { saved: false, error: `BrickLink has no picture (HTTP ${picture.status}).` });
            writeFileSync(`source_images/${id}.png`, Buffer.from(await picture.arrayBuffer()));
            return json(res, 200, { saved: true, file: `${id}.png` });
          }
          json(res, 404, { error: "Unknown endpoint." });
        } catch (error) {
          json(res, 502, { error: error.message });
        }
      });
    }
  };
}

export default defineConfig({
  // The site is served from https://uapcent.github.io/Test_cards/
  base: "/Test_cards/",
  // Images are served as they are, under their own names
  publicDir: "assets",
  // stale files from an earlier build must not ship
  build: { emptyOutDir: true },
  define: { __FULL_ARTS__: JSON.stringify(fullArts), __THEME_ART__: JSON.stringify(themeArt) },
  plugins: [react(), yaml(), devTools()]
});
