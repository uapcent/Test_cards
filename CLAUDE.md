# Minifigure checklist

A personal site that tracks which LEGO minifigures the owner has, styled after the
character-select screens in the LEGO video games. One person owns and edits it:
there are no accounts, no server and no shared state.

Live at <https://uapcent.github.io/Test_cards/>.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/Test_cards/  — the path matters
npm run build    # writes dist/
npm run preview  # serves dist/
```

Image helpers, all skipping work that is already done:

```bash
npm run thumbnails    # source_images/ -> assets/minifigures_images/thumbnails/
npm run cutouts       # source_images/ -> assets/minifigures_images/cutouts/
npm run images:unused # lists images no character uses; add -- --delete to remove
npm run register       # interactive: add a figure from a BrickLink URL
```

## Where things are

| Path | What |
| --- | --- |
| `data/` | The collection, as YAML. `themes.yaml` lists the themes; one file per theme. |
| `src/pages/` | One file per layout: Tokens, Showcase, Classic, Rankings. |
| `src/components/` | Pieces shared between layouts: the token, the details dialog, the icons. |
| `src/data/collection.js` | Reads the YAML and builds the model every page uses. |
| `assets/` | What the site serves: `minifigures_images/thumbnails/`, `.../cutouts/`, `theme_backgrounds/`. |
| `source_images/` | Full-size originals. Not served, only used to make the two sizes above. |
| `scripts/` | Image tools. |
| `docs/` | Longer explanations, listed below. |

## Rules worth knowing before changing things

- **A character is not the same as a variant.** Visibly different versions of a
  figure are separate characters, and repeated names are intentional. See
  [docs/data-model.md](docs/data-model.md).
- **`glow` is optional on purpose.** Characters without one do not glow on the
  Classic page. It is not a bug.
- **Images are never referenced by hand.** A variant carries a BrickLink ID like
  `sw0812`, and the code builds every path from it.
- **Pushes to this repo fail if they are large.** Keep commits small; see
  [docs/deployment.md](docs/deployment.md).

## The documents

- [docs/architecture.md](docs/architecture.md) — how the app is put together.
- [docs/data-model.md](docs/data-model.md) — the YAML, field by field, and how to add a figure.
- [docs/images.md](docs/images.md) — the three image sizes and the scripts that make them.
- [docs/ui-design.md](docs/ui-design.md) — the layouts and why each one behaves as it does.
- [docs/deployment.md](docs/deployment.md) — GitHub Pages, the workflow, the push problem.
- [docs/prototypes/](docs/prototypes/) — the wireframes the design came from.
- [docs/open-items.md](docs/open-items.md) — known issues and what was planned next.

## History in one paragraph

It began as a static page of HTML, CSS and vanilla JavaScript with the collection
hard-coded in five `.js` files. That version was cleaned up, then moved to Vite and
React with the data in YAML, keeping the original page as the Classic layout. The
Tokens and Showcase layouts came from wireframes drawn before any code. Work that
is still open is in [docs/open-items.md](docs/open-items.md).
