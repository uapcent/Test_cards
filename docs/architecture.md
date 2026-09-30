# Architecture

## The shape of it

A React app built by Vite, deployed as static files to GitHub Pages. There is no
server and no database. The collection lives in YAML files that are read at build
time, so the whole site is HTML, CSS, one JavaScript bundle and a folder of images.

```
data/*.yaml ──(build)──> one bundle ──> src/data/collection.js ──> the pages
assets/**            copied as-is ──> images the pages request by URL
```

## Why these choices

**Vite and React.** The site grew from one page to four, all showing the same
collection in different shapes. Three layouts needed the same figure states, the
same details panel and the same keyboard handling, which was turning into
duplicated vanilla JavaScript. React makes those pieces shared; Vite gives a dev
server and a build step, which is what lets the data be YAML.

**YAML, not JSON.** The collection is edited by hand by one person. YAML allows
comments and drops most punctuation, so entries are short to write and easy to
read in a diff. A build-time plugin (`@rollup/plugin-yaml`) turns it into data, so
the browser never parses YAML.

**Hash routing.** Pages serves static files, so a path like `/showcase` would 404
on reload. Routes are `#/tokens`, `#/showcase`, `#/classic` and `#/rankings`, which
always resolve to `index.html`. The router is about twenty lines in
`src/App.jsx`; a routing library would not earn its weight here.

**`base: "/Test_cards/"`.** The site is served from a repository sub-path, so Vite
is told about it and every asset URL is built from `import.meta.env.BASE_URL`.
This is why the dev server URL also includes `/Test_cards/`.

**`publicDir: "assets"`.** Images are requested by names that only exist in the
data, so they cannot be imported as modules. Everything under `assets/` is copied
verbatim into the build and served under its own name. The full-size originals
live in `source_images/`, outside that folder, which is what keeps a build at
about 15 MB instead of 134 MB.

## The data layer

`src/data/collection.js` is the only place that reads the YAML. It builds:

- `themes` — each with its characters, the counts of owned and total variants,
  the icon name, the accent colour and the optional backdrop URL.
- `characters` and `charactersById` — flat access for the pages.
- `collection` — `{ owned, total }` for the whole collection.

Each variant is expanded once, with everything a page might need: the thumbnail
URL, the cutout URL, whether it has a picture at all, the BrickLink catalogue
link, and the flags from the YAML. Each character gets a `state` of `owned`,
`partial`, `missing` or `unknown`, and a `displayVariant`, which is the first
variant that has a picture.

Pages never compute image paths or states themselves. Adding a new layout means
reading this model and deciding how to draw it.

## The pages

| Page | Route | Notes |
| --- | --- | --- |
| Tokens | `#/tokens` (default) | Round portraits grouped by theme, one per character. |
| Showcase | `#/showcase` | Theme tabs, slanted tiles, the chosen figure shown large. |
| Classic | `#/classic` | The original page, ported. Cards that cycle their variants. |
| Rankings | `#/rankings` | Elo voting between two pictures. |
| Packs | `#/packs` | Trading-card booster packs and an album. See below. |

Behaviour and the reasoning behind each layout is in [ui-design.md](ui-design.md).

## Shared pieces

- `components/FigureToken.jsx` — one round token with its state, badges and count.
- `components/DetailsDialog.jsx` — the details panel, used by Tokens and Classic.
  Closes on Escape, moves between variants with the arrow keys.
- `components/icons.jsx` — every icon, drawn as inline SVG. Theme icons and the
  finer sub-theme symbols (skull, rocket, imperial...) share one registry and are drawn
  by the same `ThemeIcon`. They are deliberately generic shapes rather than brand
  logos, which are trademarked.
- `lib/hooks.js` — `prefersReducedMotion()` and media-query hooks, for anything that
  animates or changes layout on a phone.
- `lib/gridNav.js` — arrow-key movement in a grid. Left and right step through the
  document order; up and down measure the boxes on screen and pick the nearest one
  in the row above or below, so uneven rows still behave.

## Styling

Plain CSS files, one per page plus `src/styles/app.css` for the tokens (colours,
fonts) and the shared components. Class names follow a loose block/element style
(`.showcase__tabs`, `.tile--missing`). There is no CSS framework: the whole thing
is a few hundred lines and the look is specific.

Two fonts from Google Fonts: Chakra Petch for headings and anything that should
feel like a game interface, IBM Plex Sans for reading.

## State

All state is in React and lives only as long as the page is open: which figure is
selected, which variant, which filter, which theme tab. Nothing is written back to
the YAML from the browser.

The one exception is the Rankings page, which stores its Elo ratings in
`localStorage` under the key `ratings`, keyed by image ID. Those votes are per
browser: they do not sync between devices and Claude never sees them. The keys
have been kept stable across refactors on purpose, so older votes still count.

## The card layer (Packs)

The Packs page turns the collection into trading cards. It follows the same rule as
the rest of the app — the model is built once and pages only draw it — with one
addition: card facts that are not about the figure itself live in their own file.

```
data/cards.yaml ─┐
                 ├─> src/data/cardPool.js ──> src/lib/packs.js ──> src/lib/packStore.js ──> pages/packs/
                 │     (+ data/tiers.js: the rarity ladder)
collection.js ───┘        (one card per          (rolls a pack)       (session state)
                           variant, its rarity
                           and emblem)
```

**The Packs page is a folder**, `src/pages/packs/`: `PacksPage.jsx` is the shell, and the
sealed pack, the pack being opened, the settings, the album and the confetti are a file
each, with `packs.css` beside them. `collection.js` exports a flat `variants` list, which
this page and Rankings both use, since both work one picture at a time.

**Composition, not inheritance.** YAML cannot extend another file, and would not
help here: the figure data is spread over twelve theme files. `cards.yaml` is a
second layer keyed by name or by BrickLink ID, joined to the collection in
`cardPool.js`, the way image paths are already built from the ID. Nothing in a theme
file knows cards exist, and a figure that `cards.yaml` never mentions still becomes
a card.

**Session state lives outside React**, in `src/lib/packStore.js`, so the album,
the settings and a half-opened pack survive switching pages. It is a plain module
with `useSyncExternalStore`, and it writes nothing anywhere: a reload starts over.
This is deliberately unlike Rankings, which keeps its votes in `localStorage`.

**Card classes are `tcard`, not `card`.** `classic.css` is loaded on every page and
defines a global `.card` (with `overflow: hidden`), which silently clipped the
trading cards' figures until they were renamed. Any new stylesheet should either
prefix its classes or nest them under its page.

**Sound is synthesised** in `src/lib/sound.js` with the Web Audio API, so there
are no audio files in the repository.

**Full arts** in `assets/full_arts/<id>.png|webp` are found by `vite.config.js`,
which lists the folder once and hands the names to the page as `__FULL_ARTS__`. A
new file needs the dev server restarted. A figure with no full art shows its normal
cutout on the theme backdrop instead.
