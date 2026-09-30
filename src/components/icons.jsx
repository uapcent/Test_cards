// Simple monochrome icons, drawn here rather than pulled from a set, so nothing
// depends on another project's artwork. Swap any of them freely.
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const THEME_PATHS = {
  // shield
  shield: <path d="M12 3l7 3v5.5c0 4-2.9 7-7 8.5-4.1-1.5-7-4.5-7-8.5V6z" {...stroke} />,
  // bat
  bat: (
    <path
      d="M2 9c2.6-.8 4 .6 4.8 1.8L8 8l2.2 2h3.6L16 8l1.2 2.8C18 9.6 19.4 8.2 22 9c-2.2 1.8-3.2 3.8-3.2 6-2.8-1-4.8 0-6.8 2-2-2-4-3-6.8-2 0-2.2-1-4.2-3.2-6z"
      {...stroke}
    />
  ),
  // ninja head band
  mask: (
    <g {...stroke}>
      <path d="M5.5 9.5a6.5 6.5 0 0 1 13 0" />
      <path d="M4 12h16v3.5H4z" />
      <path d="M8.5 20.5 12 17l3.5 3.5" />
    </g>
  ),
  // laser sword
  saber: (
    <g {...stroke}>
      <path d="M20 4 10.5 13.5" />
      <path d="m9 15-3 3" />
      <rect x="3.2" y="16.2" width="5" height="4.6" rx="1" transform="rotate(-45 5.7 18.5)" />
    </g>
  ),
  // ring
  ring: (
    <g {...stroke}>
      <circle cx="12" cy="13" r="6.5" />
      <circle cx="12" cy="13" r="3.5" />
    </g>
  ),
  // wand
  wand: (
    <g {...stroke}>
      <path d="M4 20 16 8" />
      <path d="m15 5 1.2 2.8L19 9l-2.8 1.2L15 13l-1.2-2.8L11 9l2.8-1.2z" />
    </g>
  ),
  // straw hat
  hat: (
    <g {...stroke}>
      <path d="M7.5 14a4.5 4.5 0 0 1 9 0" />
      <path d="M3 14.5h18" />
      <path d="M4.5 14.5c0 2 3.4 3.5 7.5 3.5s7.5-1.5 7.5-3.5" />
    </g>
  ),
  // ghost
  ghost: (
    <g {...stroke}>
      <path d="M5 20V10a7 7 0 0 1 14 0v10l-2.3-2-2.3 2-2.4-2-2.4 2L7.3 18z" />
      <path d="M9.5 10h.01M14.5 10h.01" strokeWidth="2.4" />
    </g>
  ),
  // castle tower
  tower: (
    <g {...stroke}>
      <path d="M5 21V7h3V4h2.5v3h3V4H16v3h3v14z" />
      <path d="M10 21v-5h4v5" />
    </g>
  ),
  // twenty-sided die
  dice: (
    <g {...stroke}>
      <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
      <path d="m12 6 5 8.5H7z" />
    </g>
  ),
  // traffic cone
  cone: (
    <g {...stroke}>
      <path d="M12 3.5 18 18H6z" />
      <path d="M8.6 12.5h6.8" />
      <path d="M3.5 20.5h17" />
    </g>
  ),
  // brick
  brick: (
    <g {...stroke}>
      <path d="M4 8.5h16V19H4z" />
      <path d="M7.5 8.5V6h3v2.5M13.5 8.5V6h3v2.5" />
    </g>
  )
};

// Finer-grained symbols for sub-themes: a faction, a hero family, a series (see
// `subthemes` in data/cards.yaml). Placeholders in the same spirit as the theme
// icons — generic shapes, meant to be swapped for custom drawings.
const SUBTHEME_PATHS = {
  // skull
  skull: (
    <g {...stroke}>
      <path d="M12 3a7 7 0 0 0-7 7c0 2.200 1 4 2.500 5.200V19h9v-3.800C18 14 19 12.200 19 10a7 7 0 0 0-7-7z" />
      <circle cx="9.200" cy="10.500" r="1.400" />
      <circle cx="14.800" cy="10.500" r="1.400" />
      <path d="M10 19v-2.500M14 19v-2.500" />
    </g>
  ),
  // rocket
  rocket: (
    <g {...stroke}>
      <path d="M12 3c3 2.500 4.500 6 4.500 10l-2 2.500h-5L7.500 13C7.500 9 9 5.500 12 3z" />
      <circle cx="12" cy="10" r="1.600" />
      <path d="M7.500 13 5 16.500l3 .5M16.500 13l2.500 3.500-3 .5M10.500 18.500 12 21l1.500-2.500" />
    </g>
  ),
  // anchor
  anchor: (
    <g {...stroke}>
      <circle cx="12" cy="5.500" r="2" />
      <path d="M12 7.500V20M6.500 12h11M5 14c0 3.500 3 6 7 6s7-2.500 7-6" />
    </g>
  ),
  // compass
  compass: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8.500" />
      <path d="m9 15 2-5 5-2-2 5z" />
    </g>
  ),
  // police badge
  badge: (
    <g {...stroke}>
      <path d="M12 3l2.500 2.500H18V9l2 3-2 3v3.500h-3.500L12 21l-2.500-2.500H6V15l-2-3 2-3V5.500h3.500z" />
      <circle cx="12" cy="12" r="2.500" />
    </g>
  ),
  // gear with spokes
  imperial: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3.5v6.3M12 14.2v6.3M3.5 12h6.3M14.2 12h6.3M6 6l4.4 4.4M13.6 13.6 18 18M18 6l-4.4 4.4M10.4 13.6 6 18" />
    </g>
  ),
  // winged bird
  rebel: (
    <path
      d="M12 20.5 9.6 14 3 8.5c3.6-.3 6 .6 7.4 2.3L12 7l1.6 3.8C15 9.1 17.400 8.200 21 8.500L14.400 14z"
      {...stroke}
    />
  ),
  // jagged blade
  sith: (
    <g {...stroke}>
      <path d="M19 4 13 10l2 1.500-3 3-.8-1.800L8 14.500" />
      <path d="m9 15-3 3" />
      <rect x="3.200" y="16.200" width="5" height="4.600" rx="1" transform="rotate(-45 5.700 18.500)" />
    </g>
  ),
  // droid: dome head with an eye
  droid: (
    <g {...stroke}>
      <path d="M5 13a7 7 0 0 1 14 0z" />
      <circle cx="12" cy="10.500" r="1.600" />
      <path d="M6 16.500h12M8 20h8" />
    </g>
  ),
  // trooper helmet
  helmet: (
    <g {...stroke}>
      <path d="M5 13a7 7 0 0 1 14 0v5.500a1.500 1.500 0 0 1-1.500 1.500h-11A1.500 1.500 0 0 1 5 18.500z" />
      <path d="M7.500 12.500h9v2.500h-9z" />
    </g>
  ),
  // web
  web: (
    <g {...stroke}>
      <path d="M12 3v18M3 12h18M5.600 5.600l12.800 12.800M18.400 5.600 5.600 18.400" />
      <path d="M12 7.500 16.500 12 12 16.500 7.500 12z" />
    </g>
  ),
  // angular A
  avengers: (
    <g {...stroke}>
      <path d="M4.500 20 12 4l7.500 16" />
      <path d="M8 14.500h8" />
    </g>
  ),
  // X
  xmen: (
    <g {...stroke}>
      <path d="M5 5l14 14M19 5 5 19" strokeWidth="2.600" />
    </g>
  ),
  // diamond crest
  superman: <path d="M12 3.500 20.500 9 12 20.500 3.500 9z" {...stroke} />,
  // lightning bolt
  bolt: <path d="M13.500 3 6 13.500h5L10 21l8-11h-5.200z" {...stroke} />,
  // ring lantern
  lantern: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  // trident
  trident: (
    <g {...stroke}>
      <path d="M12 21V8M6.500 5v4.500a5.500 5.500 0 0 0 11 0V5" />
      <path d="M12 3v5" />
    </g>
  ),
  star: <path d="M12 3l2.600 5.800 6.400.7-4.800 4.300 1.400 6.300L12 16.800 6.400 20.100l1.400-6.300L3 9.500l6.400-.7z" {...stroke} />
};

// One registry for every symbol a theme, a sub-theme or a card can wear, so they are
// all drawn, named and replaced the same way. A name with no drawing shows the brick.
const SYMBOL_PATHS = { ...THEME_PATHS, ...SUBTHEME_PATHS };

// every symbol name a theme, sub-theme or card can use, for pickers
export const SYMBOL_NAMES = Object.keys(SYMBOL_PATHS);

export function ThemeIcon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {SYMBOL_PATHS[name] ?? SYMBOL_PATHS.brick}
    </svg>
  );
}

const UI_PATHS = {
  lock: (
    <g {...stroke} strokeWidth="2.2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </g>
  ),
  star: <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="currentColor" />,
  warning: (
    <g {...stroke} strokeWidth="2.2">
      <path d="M12 3 2 21h20z" />
      <path d="M12 10v5M12 18v.5" />
    </g>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" {...stroke} strokeWidth="2.2" />,
  brickCount: (
    <g fill="currentColor">
      <rect x="5" y="4" width="4" height="3" rx="1" />
      <rect x="10" y="4" width="4" height="3" rx="1" />
      <rect x="15" y="4" width="4" height="3" rx="1" />
      <rect x="3" y="7" width="18" height="11" rx="2" />
    </g>
  ),
  chevron: <path d="M6 9l6 6 6-6" {...stroke} strokeWidth="2.2" />
};

export function Icon({ name, size = 18, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
    >
      {UI_PATHS[name]}
    </svg>
  );
}
