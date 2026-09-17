# Images

Every picture exists in three forms, all named after the same BrickLink ID.

| Form | Where | Size | Used by |
| --- | --- | --- | --- |
| Original | `source_images/sw0812.png` | whatever BrickLink had, 300–1000 px | nothing on the site; only the input for the other two |
| Thumbnail | `assets/minifigures_images/thumbnails/sw0812.webp` | 200 × 200, padded | Tokens, Classic, Rankings |
| Cutout | `assets/minifigures_images/cutouts/sw0812.webp` | up to 600 px tall, background removed | Showcase tiles and its large figure |

Counts today: 443 originals, 438 thumbnails, 437 cutouts.

Originals sit outside `assets/` on purpose. They are 119 MB, and while they lived
in the served folder every build copied them into the deployment.

## The scripts

```bash
npm run thumbnails   # python scripts/optimizeImages.py
npm run cutouts      # python scripts/makeCutouts.py   (--force to redo them all)
npm run images:unused
```

Both skip files that already exist, so they are cheap to re-run after adding a
figure. They need Pillow, NumPy and PyYAML.

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

The tokens crop a small circle out of the head and chest, where a white
background is invisible behind a light-coloured token. Thumbnails are a tenth of
the size of a cutout, and there are hundreds on screen at once on the Tokens page.

## Images hosted elsewhere

Two figures, Merry Brandybuck and Pippin Took, used to point at URLs on
`img.bricklink.com`. Those pictures were downloaded into `source_images/` so that
every figure now has local files. The code still copes with a remote URL — it
falls back to the thumbnail and draws the tile with a plain frame instead of a
silhouette — which is worth keeping for figures that are not on BrickLink at all.

## Theme backdrops

`assets/theme_backgrounds/` holds optional pictures behind the large figure on the
Showcase page, named per theme in `data/themes.yaml`. They are dimmed to 40%,
desaturated, darkened, blurred by 2 px and masked so they fade out towards the
left and at the top and bottom edges. The intent is atmosphere, not decoration you
notice.

## Known issue: figures look different sizes

On the Showcase page the large figure is drawn at a fixed height, but each cutout
was trimmed to its own content, so the *figure inside the box* is not always the
same share of it. A figure holding a staff above its head, or with a cape or wings
spread wide, fills its box differently from a plain one, and ends up looking
smaller or larger on screen. Cutout aspect ratios run from 0.41 to 2.13, which is
the measurement behind the effect.

Possible fixes, none applied yet:

- Scale by the largest connected shape in the picture, which is almost always the
  body, rather than by the whole trimmed box.
- Store a per-variant scale in the YAML for the handful that look wrong.
- Keep a fixed canvas per figure instead of trimming, so every picture shares one
  frame of reference.

Six pictures also have an accessory sitting clearly apart from the figure, such as
a spare head beside it, which is the same problem in its most visible form.
