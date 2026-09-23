# The data

Everything the site shows comes from `data/`. As of this writing: **12 themes,
384 characters, 453 variants, 270 of them owned.**

```
data/
  themes.yaml              the themes, in display order
  marvel.yaml              one file per theme, named by its key
  dc.yaml
  ...
```

## themes.yaml

```yaml
- key: ninjago             # the data file, data/ninjago.yaml
  name: Ninjago            # shown on tabs and headings
  icon: mask               # a drawing in src/components/icons.jsx
  accent: "#9a7b12"        # colour washed behind the large figure on Showcase
  art: ninjago-dojo.webp   # optional picture for that wash
```

`art` names a file in `assets/theme_backgrounds/`. It is dimmed, blurred and faded
out towards the left, so wide calm pictures work better than busy ones. Without
`art`, the `accent` colour is used on its own.

## A theme file

```yaml
- name: Batman
  glow: "#04e2ffff"        # optional; only used by the Classic page
  variants:
    - label: New 52
      image: sh0151
      owned: true
      year: 2015
      set: https://www.bricklink.com/v2/catalog/catalogitem.page?S=76034-1
    - label: The Batman Movie
      image: sh0786
      owned: false
      wishlist: true
```

### Character fields

| Field | Meaning |
| --- | --- |
| `name` | Shown everywhere. Duplicates across the file are expected — see below. |
| `glow` | Optional colour. The Classic page glows in it on hover; characters without one do not glow, by choice. |
| `variants` | At least one. A figure with a single version still has a one-entry list. |

### Variant fields

| Field | Meaning |
| --- | --- |
| `image` | A BrickLink ID such as `sw0812`. Every image path is built from it. May be missing for a figure you know about but have no picture of. |
| `label` | The name of this version: `Hoth`, `New 52`, `Legacy`. Optional for single-variant characters. |
| `owned` | Whether you have it. Always written out. |
| `wishlist` | Optional; marks it with a star. |
| `defective` | Optional; marks it in red. |
| `year` | Optional release year. |
| `set` | Optional link to the set or figure on BrickLink. |
| `scale` | Optional multiplier for how tall this variant is drawn on the Showcase page's large view. Every cutout is otherwise shown at the same height regardless of the figure's real size, since that's right for the overwhelming majority — a standing minifig next to another standing minifig. `scale` is the deliberate exception, for the handful that are a genuinely different kind of piece: an oversized "big figure" villain, a small droid, a child-proportioned figure. It's per-*variant*, not per-character, because a character's variants aren't always the same kind of piece — Harry Potter's `Gryffindor Robe` is a shorter child mold, his `Lego Dimensions` variant isn't. Leave it out and it's `1`, meaning "a standard minifig." |

Only 62 variants carry a `year` and 27 a `set`, so details panels are mostly
sparse until those are filled in. Every variant with a local `image` still gets a
BrickLink catalogue link, because that URL can be built from the ID.

### Working out a `scale`

`scale` can be a plain number, or one of the named constants in
[src/data/figureScale.js](../src/data/figureScale.js) — `big_figure`, `child`,
`toddler`, `astromech` so far — which exists so that every astromech droid, or
every child-proportioned figure, reads as the same size instead of each
carrying its own slightly-different guess. Prefer a constant over a raw number
when a figure is clearly the same kind of piece as one already in there.

The values come from BrickLink's own "Pack. Dim." for the figure — the second
of its three measurements, which is the packaging's height — divided by Lex
Luthor's (`sh0012`): 4 cm, and about as plain a standard minifig as BrickLink
has measurements for, being bald and carrying no cape or accessories to throw
the packaging size off. `Thanos` (`sh0504`) at 7 cm gives `7 / 4 = 1.75`, the
`big_figure` constant; `R2-D2` (`sw0217`) at 3.35 cm gives `0.8375`, the
`astromech` constant; and so on. A figure within a few percent of standard
isn't worth the field at all — this is for the ones that would visibly look
wrong sitting next to a plain minifig, not for evening out every last
millimetre BrickLink happens to report.

## Characters versus variants

**A visibly different version of a figure is its own character, not a variant.**
Anakin Skywalker from Episode I, Anakin from Episode III and Darth Vader are the
same person in the story and three separate entries here. Only close versions of
the same look — Batman's New 52, Wing Suit and Armored Suit — sit together as
variants of one character.

Repeated names are therefore expected and are **not** a defect to clean up:
Obi-Wan Kenobi appears four times, Luke Skywalker three, Princess Leia twice. The
model is the LEGO Star Wars character-select screen, which lists characters in
episode order and shows the same character many times.

Consequence: 339 of the 384 characters have exactly one variant, so variant lists
are usually short and the Showcase hides the list when there is only one unnamed
variant.

## Derived state

`src/data/collection.js` computes, per character:

| State | When |
| --- | --- |
| `owned` | every variant owned |
| `partial` | some owned, some not — 15 characters today |
| `missing` | none owned |
| `unknown` | no variant has a picture — 16 variants across the collection |

Each layout draws those four states in its own shape, but the rules live in one
place.

## Adding a figure

`npm run register` asks for a BrickLink minifigure URL or ID (`sw0812`), fetches
that catalog page, and guesses the name, year and theme from it. It checks that
ID against every theme file first, since it can only ever be one specific casting
of one figure, and warns before letting you register it a second time. It
downloads the full-size picture into `source_images/`, then appends the entry to
the right file in `data/` — either as a new character or, if you confirm, as
another variant of one that's already there (it lists every same-named match,
since names repeat on purpose). The BrickLink link defaults to that same catalog
page, since one can always be built from the ID; type over it only when the
figure came from a specific set instead. Everything it guesses can be overridden
before it writes anything, and it refuses to write if the result wouldn't be
valid YAML. It only touches your local files; there's nothing to run against the
deployed site.

Afterwards run `npm run thumbnails` and `npm run cutouts` to generate the other
two image sizes.

### By hand

1. Put the full-size picture in `source_images/` named after its BrickLink ID,
   for example `sw1234.png`. `.original` in the name is stripped, so
   `sw1234.original.png` works too.
2. Run `npm run thumbnails` and `npm run cutouts`.
3. Add the entry to the right theme file.

Nothing else references the picture; the ID is enough.

## History of the format

The collection used to be five JavaScript files exporting arrays, with fields
named `info`, `locked`, `wantedList` and `appears_in`. The move to YAML renamed
them to `label`, `owned` (inverted), `wishlist` and `set`. The conversion was
checked entry by entry against the old data: same 12 themes, 384 characters and
453 variants. Seven `appears_in` fields held the text "Bricklink" instead of a
link and were dropped.
