import { TIERS, cardPool, poolByTier } from "../data/cardPool.js";

// Everything a player can change about how packs are rolled. Odds are weights,
// not percentages, so they do not need to add up to anything.
export const DEFAULT_SETTINGS = {
  size: 5,
  odds: { common: 60, rare: 26, epic: 10, legendary: 3.5, gold: 0.5 },
  sticker: true,
  // at least one Rare or better in any pack of three or more
  guarantee: true
};

export const PRESETS = {
  Normal: { ...DEFAULT_SETTINGS },
  Lucky: { ...DEFAULT_SETTINGS, size: 10, odds: { common: 20, rare: 30, epic: 30, legendary: 15, gold: 5 } },
  "All Legendary": { ...DEFAULT_SETTINGS, odds: { common: 0, rare: 0, epic: 0, legendary: 100, gold: 0 } },
  "All Gold": { ...DEFAULT_SETTINGS, odds: { common: 0, rare: 0, epic: 0, legendary: 0, gold: 100 } }
};

export const MAX_PACK_SIZE = 100;

const pick = list => list[Math.floor(Math.random() * list.length)];

// Tiers that have someone to draw. A tier with weight but an empty pool (say no
// figure is Legendary) is skipped instead of failing.
function usableOdds(odds, only = TIERS) {
  return only.map(tier => [tier, poolByTier[tier].length ? Math.max(0, Number(odds[tier]) || 0) : 0]);
}

function rollTier(odds, only) {
  const weights = usableOdds(odds, only);
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) return "common";
  let roll = Math.random() * total;
  for (const [tier, weight] of weights) {
    roll -= weight;
    if (roll < 0) return tier;
  }
  return weights[weights.length - 1][0];
}

let serial = 0;
const entry = (card, tier) => ({ uid: ++serial, card, tier });

// One pack: the sticker first, then the cards worst to best, so the best card
// is the last thing revealed
export function rollPack(settings) {
  const size = Math.max(1, Math.min(MAX_PACK_SIZE, Math.round(settings.size) || 1));
  const cards = [];

  for (let i = 0; i < size; i++) {
    const tier = rollTier(settings.odds);
    cards.push(entry(pick(poolByTier[tier]), tier));
  }

  if (settings.guarantee && size >= 3 && !cards.some(item => item.tier !== "common")) {
    const better = TIERS.slice(1);
    if (usableOdds(settings.odds, better).some(([, weight]) => weight > 0)) {
      const tier = rollTier(settings.odds, better);
      cards[Math.floor(Math.random() * cards.length)] = entry(pick(poolByTier[tier]), tier);
    }
  }

  cards.sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier));
  return settings.sticker ? [entry(pick(cardPool), "sticker"), ...cards] : cards;
}
