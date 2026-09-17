const KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

// Moves focus between tokens with the arrow keys. Up and down look for the
// nearest token in the row above or below, so uneven rows still work.
export function moveFocus(container, event) {
  if (!container || !KEYS.includes(event.key)) return;

  const current = event.target.closest("[data-token]");
  if (!current || !container.contains(current)) return;

  const tokens = [...container.querySelectorAll("[data-token]")];
  const index = tokens.indexOf(current);
  if (index === -1) return;

  event.preventDefault();

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const step = event.key === "ArrowRight" ? 1 : -1;
    tokens[index + step]?.focus();
    return;
  }

  const box = current.getBoundingClientRect();
  const wantedBelow = event.key === "ArrowDown";

  const candidates = tokens
    .map(token => ({ token, rect: token.getBoundingClientRect() }))
    .filter(({ rect }) => (wantedBelow ? rect.top > box.bottom - 4 : rect.bottom < box.top + 4));

  if (!candidates.length) return;

  const rowEdge = wantedBelow
    ? Math.min(...candidates.map(({ rect }) => rect.top))
    : Math.max(...candidates.map(({ rect }) => rect.bottom));

  const row = candidates.filter(({ rect }) =>
    wantedBelow ? rect.top < rowEdge + 4 : rect.bottom > rowEdge - 4
  );

  const centre = box.left + box.width / 2;
  const nearest = row.reduce((best, entry) => {
    const distance = Math.abs(entry.rect.left + entry.rect.width / 2 - centre);
    return distance < best.distance ? { ...entry, distance } : best;
  }, { token: null, distance: Infinity });

  nearest.token?.focus();
}
