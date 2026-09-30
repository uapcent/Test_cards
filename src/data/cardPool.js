import cardConfig from "../../data/cards.yaml";
import { themes } from "./collection.js";

// The rarity ladder, lowest to highest. `layout` picks the card template,
// `finish` the effect on it and `border` the frame material. Sticker is not
// on the ladder: every pack carries one, and it never has a finish.
export const TIERS = ["common", "rare", "epic", "legendary", "gold"];

export const TIER_INFO = {
  common: { label: "Common", layout: "frame", finish: "none", border: "gray", color: "#9aa3b2" },
  rare: { label: "Rare", layout: "frame", finish: "holo", border: "gray", color: "#4aa3ff" },
  epic: { label: "Epic", layout: "art", finish: "none", border: "gold", color: "#b06dff" },
  legendary: { label: "Legendary", layout: "art", finish: "foil", border: "gold", color: "#ffb020" },
  gold: { label: "Gold", layout: "frame", finish: "gold", border: "gold", color: "#ffd84a" },
  sticker: { label: "Die-cut", layout: "sticker", finish: "none", border: "white", color: "#f4f1e8" }
};

// What share of the collection lands in each base tier, best first. Gold is not
// a base tier: it is a rare upgrade of an Epic or Legendary figure, rolled per pull.
const BASE_SHARES = [
  ["legendary", 0.05],
  ["epic", 0.1],
  ["rare", 0.25]
];

const FULL_ARTS = `${import.meta.env.BASE_URL}full_arts/`;
const fullArtFiles = new Map(__FULL_ARTS__.map(file => [file.replace(/\.[^.]+$/, ""), file]));

const THEME_ART = `${import.meta.env.BASE_URL}theme_backgrounds/`;

// A pattern matches a whole text, or a start, an end or a middle when it carries
// a * there; a lone * matches anything. Case does not matter.
function matcher(pattern) {
  const lower = pattern.toLowerCase();
  const start = lower.startsWith("*");
  const end = lower.endsWith("*");
  const core = lower.slice(start ? 1 : 0, end ? -1 : undefined);
  if (start && end) return text => text.toLowerCase().includes(core);
  if (start) return text => text.toLowerCase().endsWith(core);
  if (end) return text => text.toLowerCase().startsWith(core);
  return text => text.toLowerCase() === lower;
}

// BrickLink numbers per figure, from `npm run card-stats`. The file is optional:
// without it every figure is simply middling, and the rest of the score still works.
const stats = Object.values(import.meta.glob("../../data/card-stats.yaml", { eager: true, import: "default" }))[0] ?? {};

// Where a figure stands among all that have a number for `field`, from 0 (lowest) to 1
// (highest), with ties sharing the middle of their range. A figure with no number is
// placed in the middle, since not knowing says nothing either way.
function standing(field) {
  const known = Object.values(stats)
    .map(entry => entry?.[field])
    .filter(number => typeof number === "number")
    .sort((a, b) => a - b);
  return id => {
    const number = stats[id]?.[field];
    if (typeof number !== "number" || known.length < 2) return 0.5;
    const first = known.indexOf(number);
    const last = known.lastIndexOf(number);
    return (first + last) / 2 / (known.length - 1);
  };
}

const lotsStanding = standing("lots");
const setsStanding = standing("sets");
const yearStanding = standing("year");

// How hard a figure is to get, from 0 (everywhere) to 1 (almost nowhere): few lots for
// sale weighs most, then few sets it came in, then being an old release.
function scarcity(id) {
  return 0.5 * (1 - lotsStanding(id)) + 0.3 * (1 - setsStanding(id)) + 0.2 * (1 - yearStanding(id));
}

const iconic = cardConfig.iconic.map(matcher);

// Sub-themes per theme, in the order they were written, which is the order they win
const subthemeRules = new Map(
  Object.entries(cardConfig.subthemes ?? {}).map(([themeKey, rules]) => [
    themeKey,
    rules.map(rule => ({
      key: rule.key,
      name: rule.name,
      icon: rule.icon ?? null,
      accent: rule.accent ?? null,
      art: rule.art ? `${THEME_ART}${rule.art}` : null,
      names: (rule.names ?? []).map(matcher),
      labels: (rule.labels ?? []).map(matcher)
    }))
  ])
);
const overrides = cardConfig.overrides ?? {};

// A stable number in [0, 1) from a string, so a figure always sorts the same way
function jitter(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

// The sub-theme a card belongs to, if any: the one an override names, or else the
// first of its theme's whose names or labels take it
function subthemeFor(themeKey, name, label, id) {
  const rules = subthemeRules.get(themeKey) ?? [];
  const wanted = overrides[id]?.subtheme;
  if (wanted) return rules.find(rule => rule.key === wanted) ?? null;
  return rules.find(rule => rule.names.some(match => match(name)) || (label && rule.labels.some(match => match(label)))) ?? null;
}

function buildPool() {
  const appearances = new Map();
  for (const theme of themes) {
    for (const character of theme.characters) {
      appearances.set(character.name, (appearances.get(character.name) ?? 0) + character.variants.length);
    }
  }

  const cards = [];
  for (const theme of themes) {
    for (const character of theme.characters) {
      for (const variant of character.variants) {
        if (!variant.hasCutout) continue;
        const fullArtFile = fullArtFiles.get(variant.id);
        const subtheme = subthemeFor(theme.key, character.name, variant.label, variant.id);
        cards.push({
          id: variant.id,
          name: character.name,
          label: variant.label,
          year: variant.year,
          bricklinkId: variant.brickLinkId,
          owned: variant.owned,
          themeKey: theme.key,
          themeName: theme.name,
          // what the card looks like: its sub-theme's icon, colour and backdrop, and
          // wherever the sub-theme says nothing, its theme's
          subtheme: subtheme?.name ?? null,
          icon: overrides[variant.id]?.icon ?? subtheme?.icon ?? theme.icon,
          accent: subtheme?.accent ?? theme.accent,
          art: subtheme?.art ?? theme.art,
          glow: character.glow,
          cutout: variant.cutout,
          thumbnail: variant.image,
          scale: variant.scale,
          fullArt: fullArtFile ? `${FULL_ARTS}${fullArtFile}` : null,
          // Fame (the iconic list, and how often LEGO remade the name) plus scarcity
          // (BrickLink), plus a tiny stable nudge so exact ties always break the same
          // way. Scarcity can carry a rare non-iconic figure past a common iconic one,
          // and it is what tells a convention exclusive from the everyday Batman.
          score:
            (iconic.some(match => match(character.name)) ? 5 : 0) +
            Math.min(appearances.get(character.name), 4) * 0.5 +
            scarcity(variant.id) * 5 +
            jitter(variant.id) * 0.5
        });
      }
    }
  }

  // Rank by score and cut into tiers by share, so the mix is always the same
  // however the collection grows. An override in cards.yaml wins over the rank.
  const ranked = [...cards].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  let cursor = 0;
  for (const [tier, share] of BASE_SHARES) {
    const end = cursor + Math.round(ranked.length * share);
    for (; cursor < end; cursor++) ranked[cursor].tier = tier;
  }
  for (; cursor < ranked.length; cursor++) ranked[cursor].tier = "common";
  for (const card of cards) card.tier = overrides[card.id]?.rarity ?? card.tier;

  return cards;
}

export const cardPool = buildPool();

export const cardsById = new Map(cardPool.map(card => [card.id, card]));

// Figures grouped by their base tier; a Gold pull is drawn from the top two
export const poolByTier = Object.fromEntries(
  TIERS.map(tier => [
    tier,
    tier === "gold"
      ? cardPool.filter(card => card.tier === "epic" || card.tier === "legendary")
      : cardPool.filter(card => card.tier === tier)
  ])
);
