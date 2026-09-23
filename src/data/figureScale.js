// Named multipliers for how tall a figure is drawn on the Showcase page's
// large view, relative to a standard minifig — see the `scale` field in
// docs/data-model.md. Computed from BrickLink's own "Pack. Dim." for each
// figure (the second of the three measurements, its packaging height) against
// Lex Luthor's (sh0012, 4 cm): bald, no cape or accessories, as plain a
// standard minifig as BrickLink has measurements for.
//
// A `scale` in the YAML can be one of these names instead of a raw number, so
// every astromech droid, every child-proportioned figure and so on reads the
// same, deliberately, rather than each carrying its own slightly-different
// guess.
export const FIGURE_SCALE = {
  BIG_FIGURE: 1.75, // Thanos (sh0504): 7 cm
  CHILD: 0.925, // Harry Potter, child variant (hp314): 3.7 cm
  TODDLER: 0.425, // May "Mayday" Parker (colspi11): 1.7 cm
  ASTROMECH: 0.8375 // R2-D2 (sw0217): 3.35 cm
};

export function resolveScale(raw) {
  if (raw == null) return 1;
  if (typeof raw === "number") return raw;
  return FIGURE_SCALE[raw.toUpperCase()] ?? 1;
}
