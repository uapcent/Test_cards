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

// Where a tier stands on the ladder, for sorting and comparing. A sticker is not on
// it, so it comes out below everything.
export const tierRank = tier => TIERS.indexOf(tier);
