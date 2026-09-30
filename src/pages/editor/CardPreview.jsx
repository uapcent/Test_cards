import TradingCard from "../../components/TradingCard.jsx";
import { cardPool } from "../../data/cardPool.js";
import { artUrl } from "./pickers.jsx";

// A real card to show a look on: the first one of the theme (or sub-theme) that has a
// figure standing tall enough to judge it by, or any of the theme as a last resort
export function sampleCard(themeKey, subthemeName) {
  const ofTheme = cardPool.filter(card => card.themeKey === themeKey);
  const ofSubtheme = subthemeName ? ofTheme.filter(card => card.subtheme === subthemeName) : [];
  const pool = ofSubtheme.length ? ofSubtheme : ofTheme;
  return pool.find(card => !card.fullArt) ?? pool[0] ?? cardPool[0];
}

// The look a theme or sub-theme gives a card, from a values object that may leave
// fields out (inherit) and the parent's values to fall back to
export function withLook(card, look, parent = {}) {
  const art = look.art ?? parent.art;
  return {
    ...card,
    icon: look.icon ?? parent.icon ?? card.icon,
    accent: look.accent ?? parent.accent ?? card.accent,
    art: art ? artUrl(art) : null,
    subtheme: look.name ?? null
  };
}

// The same card in the three layouts, so a colour, icon or backdrop can be judged on
// the frame, the full art and the sticker at once
export default function CardPreview({ card, tiers = ["common", "epic", "sticker"] }) {
  return (
    <div className="ed-preview">
      {tiers.map(tier => (
        <TradingCard key={tier} card={card} tier={tier} scale={0.62} />
      ))}
    </div>
  );
}
