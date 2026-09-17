# The wireframes

The layouts were drawn before they were built, as seven boards on a canvas, using
real data from the collection so the states and counts were honest. This folder
holds those boards and the notes written beside them, so the thinking survives
even if the canvas does not.

Canvas: <https://claude.ai/artifact/BJWvw92puB5n3Y6rxywrYo> — "Minifigure Selector
Structures". It is private to the owner.

## The files

`canvas.json` places the boards and holds the notes. Each `.dc.html` file is one
board: an ordinary HTML page with a fixed-size root element, plus a small script
that supplies the data it repeats over. They are written for the canvas editor's
runtime (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}`), so opening one directly in
a browser shows the markup but not the repeated content. Read them as drawings,
not as code to run.

| Board | Size | Shows |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 900 | Tokens, desktop: counter, filters, selected figure, grid grouped by theme, legend, key prompts |
| `TokenDetails.dc.html` | 1440 × 900 | The details menu open over a dimmed grid |
| `TokenPhone.dc.html` | 390 × 844 | Tokens on a phone, details as a bottom sheet |
| `Showcase.dc.html` | 1440 × 900 | Theme tabs, tile grid, variant list, large figure |
| `ShowcasePhone.dc.html` | 390 × 844 | Showcase on a phone, figure on top |
| `Classic.dc.html` | 1280 × 800 | The existing page with the layout switcher added |
| `Shared.dc.html` | 1280 × 800 | The data shape, the image sizes needed, and which piece each layout uses |

The token and tile states in the boards are encoded from the real collection:
`o` owned, `p` some variants owned, `l` not owned, `n` no picture, with `w` for
wishlist, `d` for defective and a trailing number for the variant count. Batman
(seven variants, six owned, released 2015, set 76034-1) is the example figure on
every board so they can be compared.

## The notes that were on the canvas

### Tokens — structure

1. Top bar: layout switcher, owned counter (270 / 453), filters.
2. Selected figure: portrait, name and facts. Arrow keys or hover change it, like
   moving the cursor in the game.
3. Grid: one token per character, grouped by theme with inline labels. Tab jumps
   to the next theme.
4. Token states: owned, some variants owned (gold ring segment), not owned
   (padlock), no image (black), defective (red ring), wishlist (star), variant
   count badge.
5. Details menu: Enter or click opens it. Variant strip on top, facts for the
   selected variant below, Escape closes.

Phone: no hover, so a tap opens the details as a bottom sheet. Theme chips replace
Tab.

### Showcase — structure

1. Theme tabs (12). Q and E switch themes; the active tab shows its owned count.
2. Tile grid, 5 columns, one tile per character. Not owned = black silhouette, no
   image = silhouette with ?.
3. Name, owned count and the variant list with padlocks. Choosing a variant swaps
   the large figure.
4. Large figure of the selected variant with a floor reflection.
5. Key prompts.

Phone: the large figure moves to the top, variants become chips, tiles drop to 3
columns.

Needed images that did not exist yet: cutouts without the white background (for
the silhouettes and the large figure) and a bigger size. Both were built
afterwards; see [../images.md](../images.md).

### Classic and shared pieces

The existing page, ported unchanged. The only addition is the layout switcher,
which replaces the Super Secret link.

The data, figure states and details logic are written once. Each layout only
decides how to draw them: card, token or tile.

### Decided

1. One token or tile per character. Characters that differ enough stay separate;
   only close variants sit inside one character.
2. No merging by name. Repeats are expected, like the game listing characters in
   episode order.
3. Theme icons: simple monochrome ones, found or drawn.
4. Tokens opens first.
5. Tokens: hovering previews the figure above; clicking keeps it shown and opens
   its details. Showcase: only a click changes the right-hand panel, because it is
   a much bigger panel to move.

## What changed between wireframe and build

- The tile grid fits as many columns as the width allows (four at 1280 px, five
  when wider) instead of a fixed five.
- The theme backdrop behind the large figure was added later, at the owner's
  request, and was not in the drawings.
- The Tokens header gained a fixed height to stop a hover flicker; the drawings
  did not anticipate it.
- Classic lost drag-to-reorder, which never saved anything.
