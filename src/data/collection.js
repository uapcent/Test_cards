import themeIndex from "../../data/themes.yaml";

const themeFiles = import.meta.glob("../../data/*.yaml", { eager: true, import: "default" });

const THUMBNAILS = `${import.meta.env.BASE_URL}minifigures_images/thumbnails/`;
const CUTOUTS = `${import.meta.env.BASE_URL}minifigures_images/cutouts/`;
const THEME_ART = `${import.meta.env.BASE_URL}theme_backgrounds/`;

export const UNKNOWN_IMAGE = `${THUMBNAILS}unknown_character.webp`;

const isRemote = image => /^(https?:)?\/\//i.test(image);

export function resolveImage(image) {
  if (!image) return UNKNOWN_IMAGE;
  return isRemote(image) ? image : `${THUMBNAILS}${image}.webp`;
}

// Stable key for a variant: the file name without folders or extension.
// The rankings page stores votes under these, so they must not change.
export function imageId(image) {
  return image.slice(image.lastIndexOf("/") + 1).replace(/\.(png|jpe?g|webp)$/i, "");
}

function buildVariant(raw, characterId, index) {
  const image = raw.image ?? null;
  const localId = image && !isRemote(image) ? image : null;

  return {
    id: image ? imageId(image) : `${characterId}-${index}`,
    label: raw.label ?? "",
    image: resolveImage(image),
    hasImage: !!image,
    // background removed, for the showcase tiles and its large figure
    cutout: localId ? `${CUTOUTS}${localId}.webp` : resolveImage(image),
    hasCutout: !!localId,
    brickLinkId: localId,
    catalogUrl: localId
      ? `https://www.bricklink.com/v2/catalog/catalogitem.page?M=${localId}`
      : null,
    owned: !!raw.owned,
    wishlist: !!raw.wishlist,
    defective: !!raw.defective,
    year: raw.year ?? null,
    set: raw.set ?? null
  };
}

function buildCharacter(raw, themeKey, themeName, index) {
  const id = `${themeKey}-${index}`;
  const variants = raw.variants.map((variant, i) => buildVariant(variant, id, i));
  const ownedCount = variants.filter(variant => variant.owned).length;
  const withImage = variants.find(variant => variant.hasImage);

  return {
    id,
    themeKey,
    themeName,
    name: raw.name,
    glow: raw.glow ?? null,
    variants,
    ownedCount,
    // Shown on the token or card: the first variant that has a picture
    displayVariant: withImage ?? variants[0],
    wishlist: variants.some(variant => variant.wishlist),
    defective: variants.some(variant => variant.defective),
    state: !withImage
      ? "unknown"
      : ownedCount === 0
        ? "missing"
        : ownedCount < variants.length
          ? "partial"
          : "owned"
  };
}

export const themes = themeIndex.map(theme => {
  const characters = themeFiles[`../../data/${theme.key}.yaml`];
  if (!characters) throw new Error(`No data file for theme ${theme.key}`);

  const built = characters.map((character, i) => buildCharacter(character, theme.key, theme.name, i));
  const variants = built.flatMap(character => character.variants);

  return {
    ...theme,
    // optional picture behind the large figure on the Showcase page
    art: theme.art ? `${THEME_ART}${theme.art}` : null,
    characters: built,
    ownedVariants: variants.filter(variant => variant.owned).length,
    totalVariants: variants.length
  };
});

export const characters = themes.flatMap(theme => theme.characters);

export const charactersById = new Map(characters.map(character => [character.id, character]));

export const collection = {
  owned: themes.reduce((total, theme) => total + theme.ownedVariants, 0),
  total: themes.reduce((total, theme) => total + theme.totalVariants, 0)
};
