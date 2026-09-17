# Theme backgrounds

Drop a picture here and name it in `data/themes.yaml` under the theme's `art`,
for example:

    - key: star-wars
      name: Star Wars
      icon: saber
      accent: "#2f5d86"
      art: star-wars.webp

It is drawn behind the large figure on the Showcase page: dimmed, slightly
blurred, faded out towards the left and at the top and bottom edges, so wide
and calm pictures work better than busy ones. Themes without one fall back to
a wash of their `accent` colour.
