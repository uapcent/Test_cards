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

export function ThemeIcon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {THEME_PATHS[name] ?? THEME_PATHS.brick}
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
