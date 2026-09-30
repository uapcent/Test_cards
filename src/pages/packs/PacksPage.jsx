import { useState } from "react";
import { cardPool, poolByTier } from "../../data/cardPool.js";
import { TIERS, TIER_INFO } from "../../data/tiers.js";
import { updateSound, usePackStore } from "../../lib/packStore.js";
import Album from "./Album.jsx";
import PackOpening from "./PackOpening.jsx";
import SealedPack from "./SealedPack.jsx";
import Settings from "./Settings.jsx";
import "./packs.css";

// How many figures each base tier holds; Gold is an upgrade of the top two, not a pool
const pools =
  TIERS.filter(tier => tier !== "gold")
    .map(tier => `${TIER_INFO[tier].label} ${poolByTier[tier].length}`)
    .join(" · ") + " · Gold: upgraded Epic or Legendary";

// Booster packs of trading cards: the header, and whichever of the sealed pack, the
// pack being opened or the album is showing. All state is in packStore, so it
// survives switching to another page.
export default function PacksPage() {
  const { settings, pack, album, packsOpened, sound } = usePackStore();
  const [view, setView] = useState("open");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="packs">
      <header className="packs__header">
        <div>
          <h1>Packs</h1>
          <p>Open booster packs of {cardPool.length} figures. Nothing is saved: close the tab and the album is gone.</p>
        </div>
        <div className="packs__tools">
          <div className="tabs" role="tablist" aria-label="View">
            <button type="button" role="tab" aria-selected={view === "open"} onClick={() => setView("open")}>
              Open
            </button>
            <button type="button" role="tab" aria-selected={view === "album"} onClick={() => setView("album")}>
              Album {Object.keys(album).length > 0 && <span className="tabs__count">{Object.keys(album).length}</span>}
            </button>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={sound.muted ? "Turn sound on" : "Turn sound off"}
            aria-pressed={!sound.muted}
            onClick={() => updateSound({ muted: !sound.muted })}
          >
            {sound.muted ? "🔇" : "🔊"}
          </button>
          <button
            type="button"
            className={`btn btn--small${showSettings ? " btn--on" : ""}`}
            aria-expanded={showSettings}
            onClick={() => setShowSettings(value => !value)}
          >
            Settings
          </button>
        </div>
      </header>

      <div className={`packs__body${showSettings ? " packs__body--with-settings" : ""}`}>
        <section className="packs__main">
          {view === "album" ? (
            <Album album={album} packsOpened={packsOpened} />
          ) : pack ? (
            <PackOpening key={packsOpened} pack={pack} />
          ) : (
            <div className="idle">
              <SealedPack size={settings.size} sticker={settings.sticker} />
              <p className="idle__pools">{pools}</p>
            </div>
          )}
        </section>
        {showSettings && <Settings settings={settings} sound={sound} />}
      </div>
    </main>
  );
}
