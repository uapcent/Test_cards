import { useState } from "react";
import TradingCard from "../../components/TradingCard.jsx";
import { cardPool } from "../../data/cardPool.js";
import { TIERS, TIER_INFO, tierRank } from "../../data/tiers.js";
import { useNarrow } from "../../lib/hooks.js";
import { clearAlbum } from "../../lib/packStore.js";

// Everything pulled this session, best first, with a filter by rarity
export default function Album({ album, packsOpened }) {
  const narrow = useNarrow();
  const [filter, setFilter] = useState("all");
  const entries = Object.values(album);
  const figures = new Set(entries.map(entry => entry.card.id)).size;
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  const shown = entries
    .filter(entry => filter === "all" || entry.tier === filter)
    .sort((a, b) => tierRank(b.tier) - tierRank(a.tier) || a.card.name.localeCompare(b.card.name));

  const counts = entries.reduce((map, entry) => map.set(entry.tier, (map.get(entry.tier) ?? 0) + 1), new Map());

  return (
    <div className="album">
      <div className="album__stats">
        <span><b>{packsOpened}</b> packs opened</span>
        <span><b>{total}</b> cards pulled</span>
        <span><b>{entries.length}</b> different cards</span>
        <span><b>{figures}</b> of {cardPool.length} figures</span>
      </div>

      <div className="presets" role="group" aria-label="Filter by rarity">
        {["all", ...TIERS, "sticker"].map(key => (
          <button
            key={key}
            type="button"
            className={`chip${filter === key ? " chip--on" : ""}`}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "All" : TIER_INFO[key].label}
            {key !== "all" && counts.get(key) ? ` · ${counts.get(key)}` : ""}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="empty">Nothing here yet. Open a pack and your pulls will land in the album for as long as this tab stays open.</p>
      ) : (
        <div className="album__grid">
          {shown.map(({ card, tier, count }) => (
            <div key={`${card.id}|${tier}`} className="album__item">
              <TradingCard card={card} tier={tier} scale={narrow ? 0.62 : 0.72} />
              {count > 1 && <span className="album__count">×{count}</span>}
            </div>
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <button type="button" className="btn btn--small" onClick={clearAlbum}>
          Empty the album
        </button>
      )}
    </div>
  );
}
