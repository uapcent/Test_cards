# Theme backgrounds

Drop a picture here, run `npm run theme-backgrounds` to shrink it, then name
it in `data/themes.yaml` under the theme's `art`, for example:

    - key: star-wars
      name: Star Wars
      icon: saber
      accent: "#2f5d86"
      art: star-wars.webp

It is drawn behind the large figure on the Showcase page, and behind the
selected figure on Tokens: dimmed, slightly blurred, faded out at the edges,
so wide and calm pictures work better than busy ones. Themes without one fall
back to a wash of their `accent` colour.

Run `npm run theme-backgrounds` (`python scripts/optimizeThemeBackgrounds.py`)
after adding a picture. A screenshot or a stock clip dropped in as-is can be a
couple of MB at 1920px+ wide, which is wasted weight for something nobody ever
sees at full resolution or full sharpness — it just makes that theme's first
backdrop load feel slow. The script shrinks anything over 1600px wide and
re-saves it as a `.webp` at a size still good enough for a blurred backdrop;
it's cheap enough to just always run on everything here rather than track
what's already been done.

It also brightens a picture that's naturally much darker than the others —
the CSS dims every theme by the same fixed amount, so a scene shot dark to
begin with (a cave, a starship corridor) can dim into invisibility while a
brighter one still reads fine. The script only ever brightens, never darkens,
and caps how far it'll push a near-black picture so it doesn't turn to grey
noise.
