// Reading a BrickLink minifigure catalog page. Shared by `npm run register` and by the
// dev server's register page (vite.config.js), so both guess the same things.

// A minifigure ID as BrickLink writes it: sw0812, sh0585a, col25-5, TP285, 80564
export const ID_PATTERN = /^[a-z0-9]+(-[0-9]+)?$/i;

export const catalogUrl = id => `https://www.bricklink.com/v2/catalog/catalogitem.page?M=${id}`;
export const pictureUrl = id => `https://img.bricklink.com/ItemImage/MN/0/${id}.png`;

// The ID from a catalog URL, or from a bare ID. The case is kept, because the ID names the
// image files and the deployed site is case-sensitive (TP285 is written in capitals).
export function extractId(input) {
  const text = input.trim();
  const fromUrl = text.match(/[?&]M=([a-z0-9-]+)/i);
  if (fromUrl) return fromUrl[1];
  return ID_PATTERN.test(text) ? text : null;
}

export async function fetchCatalogPage(id) {
  const url = catalogUrl(id);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    }
  });
  if (!res.ok) throw new Error(`BrickLink returned ${res.status} for ${url}`);
  return { url, html: await res.text() };
}

export function parseCatalogPage(html, id) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  let fullName = titleMatch ? titleMatch[1] : "";
  fullName = fullName.replace(/\s*:\s*Minifigure\s+\S+\s*\|\s*BrickLink\s*$/i, "").trim();

  // "Base name (variant detail)" -> split into a name and a label guess.
  const parenMatch = fullName.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const nameGuess = parenMatch ? parenMatch[1].trim() : fullName;
  const labelGuess = parenMatch ? parenMatch[2].trim() : "";

  const yearMatch = html.match(/id="yearReleasedSec">(\d{4})</);
  const yearGuess = yearMatch ? yearMatch[1] : "";

  // Breadcrumb: Catalog: Minifigures: <theme>: <sub-theme>: sw0812
  const crumbMatch = html.match(/catalogTree\.asp\?itemType=M">Minifigures<\/A>:\s*<A[^>]*>([^<]+)<\/A>/i);
  const themeGuess = crumbMatch ? crumbMatch[1].trim() : "";

  const hasLargeImage = html.includes(`ItemImage/MN/0/${id}.png`);

  return { nameGuess, labelGuess, yearGuess, themeGuess, hasLargeImage };
}
