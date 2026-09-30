# The layouts and why they work this way

The site keeps three ways of looking at the same collection, plus the voting page and the card packs.
They were drawn as wireframes before any of them was built; the boards are in
[prototypes/](prototypes/) and the decisions taken from them are recorded here.

The look comes from the LEGO game character-select screens: a dark ground, a gold
accent, wide-tracked display type, key prompts along the bottom. Nothing copies
artwork from those games — the icons and shapes are drawn here.

## Tokens — the home page

Round portraits, one per character, grouped by theme with the owned count beside
each heading. A counter at the top shows the whole collection, with a percentage
and a thin progress bar under it, and each filter button shows how many
characters it currently matches.

**The counter, filters and selected figure stay on screen.** That block is
sticky, so it never scrolls out of view while the grid below it does — on a
collection this size you'd otherwise lose sight of what's selected a few
themes down. Each theme heading is also a button that collapses its grid, for
jumping past a theme you're not looking at right now. Both only apply above the
720px breakpoint: stacked on a phone, the selected figure is too tall to pin
without hiding most of the grid, so there it scrolls away normally instead.

**The selected figure gets the theme's own backdrop**, the same picture-behind-
a-colour-wash treatment as the Showcase page below, dimmed and blurred so it
reads as atmosphere rather than another figure.

**One token per character, not per variant.** Variants live inside the details
menu, the way the games let you pick a character and then a costume.

**Hovering previews, clicking keeps.** Moving the pointer over a token shows that
figure in the header, like moving the cursor in the game. Clicking pins it and
opens the details; when the pointer is elsewhere, the pinned figure is the one on
show. Arrow keys move between tokens and preview as they go, Enter opens the
details, Tab jumps to the next theme, Escape closes.

**The header has a fixed height.** This matters more than it looks. It used to grow
when a name wrapped onto a second line, which pushed the grid down, moved the token
out from under the pointer, restored the short name, and flickered between two
figures forever. Both the name and the fact list now have reserved space, so
nothing below them can move. Any change to that block should keep its height
constant.

**Token states**, all readable at 52 px:

| State | Drawn as |
| --- | --- |
| Owned | full-colour portrait |
| Some variants owned | gold segment around the ring |
| Not owned | darkened portrait with a padlock |
| No picture | black disc |
| Defective | red ring |
| Wishlist | gold star |
| Several variants | small count |

On a phone there is no hover, so a tap opens the details as a bottom sheet.

## Showcase — the big one

Theme tabs across the top, a grid of slanted tiles, the variant list, and the
chosen figure shown large with a reflection.

**Only a click changes the figure.** Hovering does nothing and arrow keys move
focus without changing the panel. The large figure is a big thing to swap, and
having it flick about while the pointer crosses the grid was not wanted.

**Not-owned figures are silhouettes.** A black shape reads as "not collected yet"
immediately, and it works because the cutouts have no background.

**Q and E switch themes**, matching the shoulder-button feel of the games; the
tabs are also ordinary buttons. Theme switching steps from the current index
rather than a captured one, so holding the key does not stall on one theme.

**The reflection is the same picture at the same size**, flipped and clipped to a
strip, so it mirrors the figure exactly and greys out with it. It was originally a
smaller copy squeezed into a fixed box, which looked wrong and stayed in colour
when the figure went grey.

**The backdrop** is per theme, spanning the right side of the page: strongest
behind the figure, invisible on the left, faded top and bottom, dimmed and blurred
so it never competes with the figure.

On a phone the figure moves to the top, the variants become chips and the tiles
drop to three columns.

## Classic — the original page

The page as it existed before any of this, ported unchanged: a dark grid of cards,
hover tilts them, clicking cycles through a character's variants, the "i" button
opens the details, two checkboxes filter. It was kept because it is dense and
familiar, and because the new layouts should be judged against it.

The only deliberate change is the layout switcher replacing the old "Super Secret"
link. Drag-to-reorder was dropped in the port; it never saved anything.

Cards glow on hover in the character's `glow` colour, and characters without one
do not glow. That is intentional, not an oversight.

## Rankings

Two pictures, pick the better one, Elo ratings with K = 32 stored in the browser.
Pairs are drawn from figures within 150 rating points of each other so the
comparisons stay interesting. Reached from the layout switcher.

It is drawn as the versus screen of a fighting game, built from the pieces the
other layouts already use, because the first version (white photo cards and a
plain list) looked like a different site.

**Two slanted panels, one per figure.** They are the Showcase tiles made large:
the same slant, the same gold border on hover, the cutout standing on a
reflection, and the theme's colour washed behind it, with its picture when the
theme has one. The right panel mirrors the left. Each row inside is skewed back
around its own middle rather than the whole block at once, so the theme line
follows the slant at the top and the name follows it at the bottom; skewing the
block as one cut text off the corners.

**The figure fits whatever height is left.** The stage is a size container and
the figure's height is worked out from it, leaving room for the reflection and
for the lift on hover, so the name plate is never pushed out and a raised weapon
never runs into the theme line. The page fits a 700 px tall laptop screen
without scrolling.

**Standing on show.** Each panel carries its rank and rating, or "Unrated". The
leaderboard lists only figures that have had at least one vote, since everyone
else sitting at 1000 says nothing, and highlights the last winner. A line at the
bottom reports the last round, and is announced to screen readers.

**Keys**: Left and Right (or A and D) pick, S skips a pair without recording
anything. Held keys are ignored so one press is one vote, and nothing fires with
Alt, Ctrl or Cmd held, because Alt+Left is the browser's Back.

**Not-owned figures are shown in full colour**, unlike the Showcase silhouettes,
because you cannot judge a black shape. A padlock and "Not owned" mark them.

On a phone the panels stay side by side, since comparing is the point; the theme
name shrinks to its icon and the leaderboard moves below.

## Packs

Booster packs of trading cards, one card per variant with a picture (443 today).
Tear the pack, turn the cards over one at a time, keep them in an album. Nothing is
saved: closing the tab empties the album, on purpose.

**Rarity ladder.** Each tier is a template, an effect and a border:

| Tier | Template | Effect | Border |
| --- | --- | --- | --- |
| Common | Classic frame | none | grey |
| Rare | Classic frame | holographic figure | grey |
| Epic | Full art | none | gold |
| Legendary | Full art | foil | gold |
| Gold | Classic frame | gold-tinted figure | gold |
| Die-cut | Sticker | none | white |

Gold is the top of the ladder and is drawn from the Epic and Legendary figures, so a
Gold Common cannot exist. Every pack also carries one die-cut sticker; stickers never
get an effect, and are not a tier that can be rolled.

**A figure's tier is fixed, a pull is random.** Each variant has a base tier, worked
out in `src/data/cardPool.js` from a score and cut into shares (5% Legendary, 10% Epic,
25% Rare, the rest Common). A pull first rolls a tier from the odds, then draws a figure
of that tier, so Darth Vader is always Legendary and Jar Jar always is not. The score
is fame plus scarcity:

- **Fame:** 5 points for being in the `iconic` list in `data/cards.yaml`, and half a
  point for each time LEGO remade the name in the collection (up to 2).
- **Scarcity, up to 5 points**, from BrickLink numbers in `data/card-stats.yaml`: how
  few lots are for sale (half the weight), how few sets the figure came in (0.3) and how
  old the release is (0.2). Each is a standing among all figures, not a raw number, so
  one very expensive or very common figure cannot distort the rest. This is what puts a
  convention-exclusive Batman above the everyday one, and lets a scarce figure that is
  not on the iconic list outrank a common one that is.
- A tiny stable nudge, so exact ties always break the same way.

A figure with no stats counts as middling, not rare or common. `overrides` in
`cards.yaml` pin single figures by BrickLink ID.

**Full art is the exception to "no hand-made images".** `assets/full_arts/<id>.webp`
replaces the cutout on Epic and Legendary cards; without one the cutout is used. Drop a
PNG there and run `npm run full-arts`.

**Sub-themes give a card its look.** Every card has a theme and often something narrower
inside it: a faction (Galactic Empire, Jedi), a hero family (Bat Family, X-Men), an
episode or a season (The Prequels), a series (Skulkin, Pirates). A sub-theme is defined
in `data/cards.yaml` and supplies an icon, a colour and, if you add a picture, a
backdrop; whatever it leaves out comes from the theme. A card belongs to one, chosen
by its character name or by its variant label (labels already say "Episode III" or
"Mars Mission"), and the first match in the theme's list wins, so narrow ones go
before broad ones. The card's footer names the sub-theme, or the theme without one.
The icon replaces the diamond; the drawings are generic placeholders in `icons.jsx`.

**Fitting the figure.** Every figure is drawn at the same height with its feet on the
same line, and its width simply follows the picture, the way the Showcase does it; the
per-variant `scale` shrinks small pieces (droids, children) but never enlarges a big
one, since it would only lose its head to the frame. On a frame card (Common, Rare, Gold)
the art window is a fixed size, so figures stand on its lower edge with a little room
above, and a wide one (wings, a cloak) is cut by the inner frame. On a full-art card
nothing clips it and a wide figure spills past the card, limited to about 130% of the
card's width, and on hover it also grows and slides with the pointer. A figure's shape
is read from its picture the first time it is shown. Head and foot bars have fixed
heights, because the window used to shrink whenever a name carried a variant label,
which is what made some figures seem to hover.

**Foil flows.** Bands of the whole spectrum stream across the card, faster and further
the more the pointer moves, and drift by themselves while nothing is hovering. A soft
bright band follows the pointer, and a few sparkles twinkle at irregular spots (evenly
spaced dots read as a grid). It uses `screen` blending so it shows on dark art, and
reduced motion switches the drift and the twinkle off.

**Gold is always a dark card**, whatever the theme, so the gold has something to
stand out against.

**The pack is a stack.** The cards still to open fan out behind the current one, up
to five, with plain backs that give nothing away. Only the card on top glows in its
tier's colour.

**The reveal is built for anticipation.** The back of an unopened card glows in its
tier's colour before it is turned, Epic and above wait a moment while a riser builds,
then flash, shake and burst. Cards come worst to best, the die-cut first, and a run of
good pulls raises the chime's pitch. Reveal all skips ahead and plays only the best
card's sound. Reduced motion turns off tilt, shake and the flash.

**Settings are on the page** (pack size up to 100, the odds of each tier, sticker and
guaranteed-Rare toggles, sound and volume) with presets for Normal, Lucky, All
Legendary and All Gold. Odds are weights, not percentages; the page shows the
resulting percentages.

## Card editor (local only)

`#/card-editor` is a tool for setting up the trading cards' look without editing YAML by
hand. **It only exists under `npm run dev`.** `App.jsx` adds the page only when
`import.meta.env.DEV` is true, which Vite turns into `false` in a build and drops the
branch, so the editor, its styles and the `yaml` package it needs never reach the
deployed site (a build was checked for them). The page refuses to render outside dev as
well, as a second lock.

It edits two files in memory and gives them back as downloads, to be put over
`data/cards.yaml` and `data/themes.yaml`; the dev server then reloads them. Nothing is
written anywhere else.

- **Themes:** a theme's icon, colour and backdrop picture (`themes.yaml`).
- **Sub-themes:** add, delete, rename and reorder them, set an icon, colour and backdrop
  (each can be left to inherit the theme's), and which character names and variant
  labels they take. The order matters, since the first match wins.
- **Figures:** pin a rarity, choose a sub-theme or give an icon to one figure: the
  `overrides` of `cards.yaml`.

Every change shows on a real card in three layouts (frame, full art, sticker). A backdrop
can also be tried from a picture on your computer before it is in the folder: it is
previewed only in that tab, and the editor reminds you to put it in
`assets/theme_backgrounds/`, run `npm run theme-backgrounds` and restart the dev server,
which reads the folder once at start-up.

The files are edited as YAML documents, so every comment survives, and an unedited file
comes back byte for byte (one blank line before the `overrides` comment in `cards.yaml`
is the only known difference).

## Details panel

Shared by Tokens and Classic: portrait, name, a bar per variant showing what is
owned, the variant strip, and the facts — status, year, set link, BrickLink ID.
Rows with nothing to show print a dash rather than disappearing, so the panel does
not change shape as you move between variants.

## Accessibility

Everything clickable is a real `button` or `a`. Icon-only controls carry
`aria-label`, tokens announce their state ("Batman, some variants owned, 6 of 7
variants"), the dialog is a labelled `role="dialog"` that takes focus and closes on
Escape, and every layout is reachable with the keyboard alone. Touch targets are at
least 44 px.

## The wireframes

[prototypes/](prototypes/) holds the seven boards this design came from, together
with the notes written beside them. They are the source files of a canvas artifact
and are kept here so the thinking survives without it.
