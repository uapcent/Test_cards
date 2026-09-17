# Open items

## Known issues

**Figures look different sizes on the Showcase.** The large figure is drawn at a
fixed height, but each cutout was trimmed to its own content, so a figure with a
raised weapon, a cape or wide wings fills its box differently and reads as smaller
or larger. Aspect ratios across the cutouts run from 0.41 to 2.13. Candidate
fixes are in [images.md](images.md#known-issue-figures-look-different-sizes);
scaling by the largest connected shape is the most promising.

**Accessories in the pictures.** BrickLink photographs spare heads and parts beside
the figure, so they appear in the large view. Six pictures have one clearly
detached. Cropping to the main shape would fix this and the sizing issue together.

**Details are mostly empty.** Only 62 of 453 variants have a year and 27 a set
link, because that information was typed in by hand. Filling it automatically was
the plan below.

**Rankings votes are per browser.** They live in `localStorage`, so they do not
follow you to another device and cannot be shared.

**Twenty-five "Add figure cutouts, part N" commits** clutter the history, from
working around the push problem. Squashing them would need a large push, so they
stay.

## Planned but not built

**Adding figures automatically.** Registering a figure by hand is the slowest part
of owning this collection: find it on BrickLink, copy the ID, save the picture,
type the entry. The plan was a command that takes a BrickLink ID and does the rest:

```
npm run add sw0812 -- --theme star-wars
```

It would fetch the name, the year and the sets the figure appears in from the
BrickLink API, download the picture into `source_images/`, generate the thumbnail
and cutout, and append the entry to the right YAML file. A second command would
read a BrickLink order and add or mark as owned everything in it.

This needs BrickLink API credentials, registered at their API page against an IP
address (or `0.0.0.0`). The limit is 5,000 requests a day, far more than needed.
It could not be confirmed whether a store is required or any account will do.
Rebrickable is not a substitute: it does not publish the mapping from its
minifigure IDs to BrickLink's, and this collection is keyed on BrickLink IDs.

Optionally the same script could run as a GitHub Action triggered from the GitHub
website, so figures can be added from a phone with no laptop involved.

**Theme icons.** The twelve in `src/components/icons.jsx` are simple shapes drawn
here — a shield, a bat, a ninja band, a laser sword — chosen over brand logos,
which are trademarked. They are easy to replace one at a time.

**Theme backdrops.** One exists so far (`ninjago-dojo.webp`). The rest fall back to
their accent colour, which is a perfectly good end state if no picture is added.

## Decisions already made, so they do not get relitigated

1. One token or tile per character; variants live inside it.
2. Characters that look clearly different stay separate, and repeated names are
   expected.
3. Tokens is the page that opens first.
4. On Tokens, hovering previews and clicking keeps. On Showcase, only a click
   changes the figure.
5. `glow` is optional; characters without one do not glow.
6. Theme icons are drawn here rather than taken from brand artwork.
