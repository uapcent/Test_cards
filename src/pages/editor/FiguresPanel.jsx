import { useMemo, useState } from "react";
import { cardPool } from "../../data/cardPool.js";
import { TIER_INFO } from "../../data/tiers.js";
import CardPreview, { withLook } from "./CardPreview.jsx";
import { IconPicker } from "./pickers.jsx";

const RARITIES = ["common", "rare", "epic", "legendary"];

// One figure at a time: pin its rarity, put it in a particular sub-theme, or give it an
// icon of its own. These are the `overrides` of cards.yaml.
export default function FiguresPanel({ cards, themes }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cardPool
      .filter(card => !needle || `${card.name} ${card.label} ${card.id} ${card.subtheme ?? ""} ${card.themeName}`.toLowerCase().includes(needle))
      .slice(0, 80);
  }, [query]);

  const card = cardPool.find(entry => entry.id === selectedId);
  const override = (card && cards.data.overrides?.[card.id]) ?? {};
  const rules = (card && cards.data.subthemes?.[card.themeKey]) ?? [];
  const theme = Array.isArray(themes.data) ? themes.data.find(entry => entry.key === card?.themeKey) : null;

  // A field set to nothing is removed, and so is an override left with nothing in it
  const set = (field, value) =>
    cards.change(doc => {
      const path = ["overrides", card.id];
      if (value == null || value === "") {
        doc.deleteIn([...path, field]);
        if (doc.getIn(path)?.items?.length === 0) doc.deleteIn(path);
      } else {
        doc.setIn([...path, field], value);
      }
    });

  // The figure as the overrides would draw it. The sub-theme it is in today is kept
  // unless an override names another.
  const chosen = rules.find(rule => rule.key === override.subtheme);
  const preview = card
    ? chosen
      ? withLook(card, { ...chosen, icon: override.icon ?? chosen.icon }, { icon: theme?.icon, accent: theme?.accent, art: theme?.art })
      : { ...card, icon: override.icon ?? card.icon }
    : null;
  const tier = override.rarity ?? card?.tier;

  return (
    <div className="ed-split">
      <div className="ed-side">
        <input type="search" placeholder="Search a figure, theme or ID" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search" />
        <ul className="ed-list ed-list--tall" aria-label="Figures">
          {matches.map(entry => (
            <li key={entry.id}>
              <button type="button" className={entry.id === selectedId ? "is-on" : ""} onClick={() => setSelectedId(entry.id)}>
                <span>
                  {entry.name}
                  {entry.label && <small> · {entry.label}</small>}
                </span>
                {cards.data.overrides?.[entry.id] && <i className="ed-dot" title="has overrides" />}
              </button>
            </li>
          ))}
        </ul>
        {matches.length === 80 && <p className="ed-hint">Showing the first 80; search to narrow it.</p>}
      </div>

      {card ? (
        <div className="ed-form">
          <h2>
            {card.name}
            {card.label && <small> · {card.label}</small>}
          </h2>
          <p className="ed-hint">
            {card.themeName}
            {card.subtheme ? ` · ${card.subtheme}` : ""} · {card.id} · rarity from the rules: {TIER_INFO[card.tier].label}
          </p>

          <label>Rarity</label>
          <div className="ed-choice" role="group" aria-label="Rarity">
            <button type="button" className={!override.rarity ? "is-on" : ""} onClick={() => set("rarity", null)}>
              automatic
            </button>
            {RARITIES.map(name => (
              <button key={name} type="button" className={override.rarity === name ? "is-on" : ""} onClick={() => set("rarity", name)}>
                {TIER_INFO[name].label}
              </button>
            ))}
          </div>

          <label>Sub-theme</label>
          <select value={override.subtheme ?? ""} onChange={event => set("subtheme", event.target.value)} aria-label="Sub-theme">
            <option value="">automatic ({card.subtheme ?? "none"})</option>
            {rules.map(rule => (
              <option key={rule.key} value={rule.key}>
                {rule.name}
              </option>
            ))}
          </select>

          <label>Icon</label>
          <IconPicker value={override.icon ?? null} onChange={value => set("icon", value)} inherit />

          <CardPreview card={preview} tiers={[tier, "sticker"]} />
        </div>
      ) : (
        <p className="ed-hint">Pick a figure on the left.</p>
      )}
    </div>
  );
}
