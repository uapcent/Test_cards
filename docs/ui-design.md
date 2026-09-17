# The layouts and why they work this way

The site keeps three ways of looking at the same collection, plus the voting page.
They were drawn as wireframes before any of them was built; the boards are in
[prototypes/](prototypes/) and the decisions taken from them are recorded here.

The look comes from the LEGO game character-select screens: a dark ground, a gold
accent, wide-tracked display type, key prompts along the bottom. Nothing copies
artwork from those games — the icons and shapes are drawn here.

## Tokens — the home page

Round portraits, one per character, grouped by theme with the owned count beside
each heading. A counter at the top shows the whole collection, 270 / 453.

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
