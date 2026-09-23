# Images

Every picture exists in three forms, all named after the same BrickLink ID.

| Form | Where | Size | Used by |
| --- | --- | --- | --- |
| Original | `source_images/sw0812.png` | whatever BrickLink had, 300–1000 px | nothing on the site; only the input for the cutout and, as a fallback, the thumbnail |
| Cutout | `assets/minifigures_images/cutouts/sw0812.webp` | up to 600 px tall, background removed | Showcase tiles and its large figure, the Rankings vote screen; the input for the thumbnail |
| Thumbnail | `assets/minifigures_images/thumbnails/sw0812.webp` | 200 × 200, padded, transparent | Tokens, Classic, the Rankings leaderboard |

Counts today: 443 originals, 442 cutouts, 443 thumbnails (442 built from a cutout,
one — `unknown_character`, not a real BrickLink figure — from its original).

Originals sit outside `assets/` on purpose. They are 119 MB, and while they lived
in the served folder every build copied them into the deployment.

## The scripts

```bash
npm run cutouts            # python scripts/makeCutouts.py               — only missing ones (--force for all)
npm run thumbnails         # python scripts/optimizeImages.py            — always regenerates every one
npm run theme-backgrounds  # python scripts/optimizeThemeBackgrounds.py  — always redoes every one
npm run images:unused
```

`optimizeImages.py` builds each thumbnail from that figure's cutout, not the raw
original, so run `cutouts` first when adding a figure — a thumbnail made before
its cutout exists falls back to the (white-background) original. Unlike cutouts,
a thumbnail is never edited by hand, only ever a mechanical resize of its
cutout, so there's nothing to protect by skipping existing ones: `thumbnails`
always redoes every single one, which also means it picks up a hand-fixed
cutout automatically next time it runs. `npm run register` already leaves
cutouts to be generated afterwards, so the run-`cutouts`-first ordering only
matters if you're scripting around it.

Centering a thumbnail on the whole cutout would centre it on a raised weapon or
an accessory held out to one side just as much as on the figure itself, so
`optimizeImages.py` instead makes an approximate guess at where the head is —
walking down from the top for the first band of rows wide enough to plausibly be
a head or hat rather than something thin like a raised sword or an antenna — and
centres on that instead. It's a heuristic, not real detection, so it's wrong
for the handful of figures that are a head-shaped mask with no separate body to
tell apart (see `HEAD_WIDTH_FRACTION` and its neighbours in the script if it
needs retuning).

The figure is always scaled by height, never by width, even for the 16 cutouts
that end up wider than tall — every figure is a standing minifig, only ever
made wider than tall by something spread out like wings or a cape, so fitting
those by width instead would have shrunk the actual figure down small and
padded it top and bottom, pushing the head away from the top edge the CSS crop
zooms into. Scaling by height keeps the figure itself full-height and lets an
accessory that sticks out past 200px simply get cropped by the canvas, which
the head-centring above already copes with.

`makeCutouts.py` skips files that already exist, so it's cheap to re-run after
adding a figure. Both need Pillow, NumPy and PyYAML.

The flood fill in `makeCutouts.py` can't always tell a mostly-white figure
apart from the BrickLink background, so some cutouts get fixed by hand instead.
`--force` normally redoes every cutout, which would overwrite that work — list
the affected IDs, one per line, in `scripts/manual_cutouts.txt` and it leaves
them alone even under `--force`.

`scripts/cleanup_unused_images.js` lists pictures that no character references, in
all three folders, and only deletes when passed `--delete`. It reads the YAML, so
it always matches the current collection.

### How the background is removed

BrickLink photographs figures on plain white. `makeCutouts.py` floods inwards from
each of the four corners with a tolerance, and whatever the flood reaches becomes
transparent. Filling from the edges rather than keying out white is what keeps
white parts *inside* the figure — a stormtrooper's armour, Zane's robes — opaque.
The alpha edge is blurred slightly, the picture is trimmed to what is left and
scaled down to at most 600 px tall. It is never scaled up.

All 435 figures came out with a real background; the script reports any where it
removed almost nothing, and none did.

Cutouts are what make the Showcase silhouettes possible: turning a transparent
picture fully black gives the "not owned" look for free.

### Why thumbnails still exist

The tokens crop a small circle out of the head and chest, and — since a
thumbnail's padding is transparent, same as a cutout's — the disc's own colour
shows through around the figure instead of a white square. Thumbnails are a
tenth of the size of a cutout, and there are hundreds on screen at once on the
Tokens page, which is the part a cutout is too large and too slow to generate
for.

## Images hosted elsewhere

Two figures, Merry Brandybuck and Pippin Took, used to point at URLs on
`img.bricklink.com`. Those pictures were downloaded into `source_images/` so that
every figure now has local files. The code still copes with a remote URL — it
falls back to the thumbnail and draws the tile with a plain frame instead of a
silhouette — which is worth keeping for figures that are not on BrickLink at all.

## Theme backdrops

`assets/theme_backgrounds/` holds optional pictures behind the large figure on
the Showcase page, and behind the selected figure on Tokens, named per theme
in `data/themes.yaml`. They are dimmed, desaturated, blurred and masked so
they fade out towards the edges. The intent is atmosphere, not decoration you
notice — but dimmed and blurred is not the same as tiny: run
`npm run theme-backgrounds` after dropping a new one in, which shrinks
anything over 1600 px wide and re-saves it as a `.webp` at a size that still
looks right blurred, so a screenshot or a stock clip dropped in at full size
doesn't make that theme's first load noticeably slower than the others.

## Known issue: figures look different sizes

On the Showcase page the large figure is drawn at a fixed height, but each cutout
was trimmed to its own content, so the *figure inside the box* is not always the
same share of it. A figure holding a staff above its head, or with a cape or wings
spread wide, fills its box differently from a plain one, and ends up looking
smaller or larger on screen. Cutout aspect ratios run from 0.41 to 2.13, which is
the measurement behind the effect.

`data/*.yaml` characters take an optional `scale` (see
[data-model.md](data-model.md)) as a manual, per-character fix for the ones
that look visibly wrong — used so far for Gorilla Grodd and Thanos (both
oversized "big figure" pieces, not standard minifigs) and R2-D2 (a small
droid). It only affects the Showcase page's large figure. Nobody has to guess
what "1" (the default) means: it's simply unscaled, the same as every other
character, and Lex Luthor (`sh0012`) — bald, no accessories, nothing to throw
the measurement off — is as good a mental reference as any for what
"correctly sized" looks like.

The Showcase **tile grid** had a related but different bug, now fixed: tiles
capped both the image's width and height, so a cutout wider than it was tall
— the same spread-cape-or-wings case, or a big-figure villain — hit the width
cap first and rendered visibly shorter than a plain figure, even though both
were meant to be the same height. Tiles now size by height only, same as the
large figure, and let extra width run past the tile's edge, cropped by its
own `overflow: hidden`.

Six pictures also have an accessory sitting clearly apart from the figure, such as
a spare head beside it, which is the same fixed-height-different-box-share
problem in its most visible form, and `scale` doesn't help with those.
