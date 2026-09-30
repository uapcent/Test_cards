import { useEffect, useMemo, useRef, useState } from "react";
import TradingCard, { CARD_HEIGHT, CARD_WIDTH, CardBack } from "../components/TradingCard.jsx";
import { Icon, ThemeIcon } from "../components/icons.jsx";
import { TIERS, TIER_INFO, cardPool, poolByTier } from "../data/cardPool.js";
import { DEFAULT_SETTINGS, MAX_PACK_SIZE, PRESETS } from "../lib/packs.js";
import {
  clearAlbum,
  closePack,
  openPack,
  replaceSettings,
  revealTo,
  updateSettings,
  updateSound,
  usePackStore
} from "../lib/packStore.js";
import { anticipation, playReveal, playRip, playTick } from "../lib/sound.js";
import "./packs.css";

// how many waiting cards are drawn behind the current one
const MAX_STACK = 5;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useNarrow() {
  const query = "(max-width: 640px)";
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setNarrow(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

// A burst of confetti from the middle of the stage, in the tier's colour
const PARTICLES = { sticker: 16, rare: 14, epic: 32, legendary: 48, gold: 72 };

function Burst({ tier }) {
  const particles = useMemo(() => {
    const colors = [TIER_INFO[tier].color, "#ffffff", "#f2c14e"];
    return Array.from({ length: PARTICLES[tier] ?? 0 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 140 + Math.random() * 260;
      return {
        "--dx": `${Math.cos(angle) * distance}px`,
        "--dy": `${Math.sin(angle) * distance}px`,
        "--size": `${4 + Math.random() * 7}px`,
        "--delay": `${Math.random() * 0.12}s`,
        background: colors[Math.floor(Math.random() * colors.length)]
      };
    });
  }, [tier]);

  return (
    <div className="burst-fx" aria-hidden="true">
      {particles.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  );
}

// ---------- opening a pack ----------
function PackOpening({ pack }) {
  const narrow = useNarrow();
  const { cards } = pack;
  const last = cards.length - 1;

  // the card on stage, and whether it has been turned over. Coming back from another
  // page picks up where the pack was left.
  const [cursor, setCursor] = useState(pack.revealed <= last ? pack.revealed : last);
  const [up, setUp] = useState(pack.revealed > last);
  const [busy, setBusy] = useState(false);
  // The summary only replaces the stage once the last card has been looked at and
  // dismissed, or when everything was revealed at once.
  const [done, setDone] = useState(pack.revealed >= cards.length);
  const timer = useRef(null);
  const streakRef = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const current = cards[cursor];
  const onLastCard = up && cursor === last;
  const scale = narrow ? 1.05 : 1.3;

  // Turn over the card at `index` after its build-up
  const reveal = index => {
    const { tier } = cards[index];
    const delay = anticipation(tier);
    setBusy(true);
    timer.current = setTimeout(
      () => {
        playReveal(tier);
        streakRef.current = tier === "common" ? 0 : streakRef.current + 1;
        setUp(true);
        revealTo(index + 1);
        setBusy(false);
      },
      Math.max(delay, 60)
    );
  };

  const advance = () => {
    if (busy || done) return;
    if (!up) {
      reveal(cursor);
    } else if (onLastCard) {
      setDone(true);
    } else {
      // one click per card: move on and turn the next one straight away
      setCursor(cursor + 1);
      setUp(false);
      reveal(cursor + 1);
    }
  };

  const revealAll = () => {
    if (busy || done) return;
    clearTimeout(timer.current);
    const remaining = cards.slice(up ? cursor + 1 : cursor);
    const best = remaining.reduce((top, item) => (TIERS.indexOf(item.tier) > TIERS.indexOf(top.tier) ? item : top), remaining[0]);
    if (best) playReveal(best.tier);
    revealTo(cards.length);
    setCursor(last);
    setUp(true);
    setDone(true);
  };

  const best = useMemo(
    () => cards.reduce((top, item) => (TIERS.indexOf(item.tier) > TIERS.indexOf(top.tier) ? item : top), cards[0]),
    [cards]
  );

  if (done) {
    return (
      <div className="summary">
        <h2>Pack opened</h2>
        <p className="summary__best">
          Best pull: <b style={{ color: TIER_INFO[best.tier].color }}>{best.card.name}</b> ({TIER_INFO[best.tier].label})
        </p>
        <div className="summary__grid">
          {cards.map(item => (
            <TradingCard key={item.uid} card={item.card} tier={item.tier} scale={narrow ? 0.5 : 0.62} />
          ))}
        </div>
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={() => { closePack(); openPack(); }}>
            Open another pack
          </button>
          <button type="button" className="btn" onClick={closePack}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const showFx = up && current.tier !== "common";
  const big = up && ["epic", "legendary", "gold"].includes(current.tier);
  const nextTell = up ? null : current.tier;

  // The cards still to open, fanned out behind the current one like an accordion.
  // Their backs give nothing away: only the card on top glows in its tier's colour.
  const waiting = cards.length - cursor - 1;
  const stacked = Math.min(waiting, MAX_STACK);
  const step = narrow ? 12 : 18;

  return (
    <div className={`stage${big && !reducedMotion() ? " stage--shake" : ""}`}>
      <p className="stage__count" aria-live="polite">
        Card {cursor + 1} of {cards.length}
        {waiting > MAX_STACK ? ` · ${waiting} to go` : ""}
      </p>

      <button
        type="button"
        className={`stage__card${busy ? " stage__card--charging" : ""}`}
        onClick={advance}
        aria-label={up ? (onLastCard ? "See the summary" : "Next card") : "Reveal card"}
        autoFocus
      >
        <span className="deck" style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale }}>
          {Array.from({ length: stacked }, (_, i) => stacked - i).map(depth => (
            <span
              key={depth}
              className="deck__back"
              style={{
                transform: `translate(${depth * step}px, ${-depth * 3}px) rotate(${depth * 1.2}deg)`,
                filter: `brightness(${1 - depth * 0.09})`
              }}
            >
              <CardBack scale={scale} />
            </span>
          ))}
          <span className="deck__front">
            <TradingCard
              key={current.uid}
              card={current.card}
              tier={current.tier}
              flipped={up}
              tell={nextTell}
              scale={scale}
            />
          </span>
        </span>
        {showFx && <Burst key={`fx-${current.uid}`} tier={current.tier} />}
        {big && (
          <span key={`flash-${current.uid}`} className="stage__flash" style={{ "--flash": TIER_INFO[current.tier].color }} />
        )}
      </button>

      <div className="stage__caption" aria-live="polite">
        {up ? (
          <>
            <span
              key={current.uid}
              className={`callout callout--${current.tier}`}
              style={{ color: TIER_INFO[current.tier].color }}
            >
              {TIER_INFO[current.tier].label}
            </span>
            <span className="stage__owned">
              {current.card.owned ? <><Icon name="star" size={13} /> In your collection</> : "Not in your collection yet"}
            </span>
          </>
        ) : (
          <span className="stage__hint">{busy ? "…" : cursor === 0 ? "Click the card to reveal" : "Click to reveal"}</span>
        )}
      </div>

      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={advance} disabled={busy}>
          {!up ? "Reveal" : onLastCard ? "Finish" : "Next card"}
        </button>
        {cards.length > 1 && !onLastCard && (
          <button type="button" className="btn" onClick={revealAll} disabled={busy}>
            Reveal all
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- the sealed pack ----------
function SealedPack({ size, sticker }) {
  const [ripping, setRipping] = useState(false);

  const rip = () => {
    if (ripping) return;
    setRipping(true);
    playRip();
    setTimeout(() => {
      openPack();
      setRipping(false);
    }, reducedMotion() ? 0 : 650);
  };

  return (
    <button type="button" className={`pack${ripping ? " pack--ripping" : ""}`} onClick={rip} autoFocus>
      <span className="pack__top" />
      <span className="pack__body">
        <ThemeIcon name="brick" size={44} />
        <b>Minifigure Booster</b>
        <small>
          {size} {size === 1 ? "card" : "cards"}
          {sticker ? " + 1 sticker" : ""}
        </small>
      </span>
      <span className="pack__bottom" />
      <span className="pack__cta">{ripping ? "…" : "Tear it open"}</span>
    </button>
  );
}

// ---------- settings ----------
function Settings({ settings, sound }) {
  const total = TIERS.reduce((sum, tier) => sum + (poolByTier[tier].length ? Math.max(0, Number(settings.odds[tier]) || 0) : 0), 0);

  return (
    <aside className="settings" aria-label="Pack settings">
      <h3>Pack settings</h3>

      <div className="presets" role="group" aria-label="Presets">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button key={name} type="button" className="chip" onClick={() => { playTick(); replaceSettings(preset); }}>
            {name}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Cards per pack</span>
        <span className="field__row">
          <input
            type="range"
            min="1"
            max={MAX_PACK_SIZE}
            value={settings.size}
            onChange={event => updateSettings({ size: Number(event.target.value) })}
          />
          <output>{settings.size}</output>
        </span>
      </label>

      <fieldset className="odds">
        <legend>Odds</legend>
        {TIERS.map(tier => {
          const usable = poolByTier[tier].length > 0;
          const weight = Number(settings.odds[tier]) || 0;
          return (
            <label key={tier} className="field">
              <span style={{ color: TIER_INFO[tier].color }}>{TIER_INFO[tier].label}</span>
              <span className="field__row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={weight}
                  disabled={!usable}
                  onChange={event => updateSettings({ odds: { ...settings.odds, [tier]: Number(event.target.value) } })}
                />
                <output>{usable && total ? `${((weight / total) * 100).toFixed(1)}%` : "–"}</output>
              </span>
            </label>
          );
        })}
      </fieldset>

      <label className="check">
        <input type="checkbox" checked={settings.sticker} onChange={event => updateSettings({ sticker: event.target.checked })} />
        One die-cut sticker in every pack
      </label>
      <label className="check">
        <input type="checkbox" checked={settings.guarantee} onChange={event => updateSettings({ guarantee: event.target.checked })} />
        Guarantee a Rare or better
      </label>

      <fieldset className="odds">
        <legend>Sound</legend>
        <label className="check">
          <input type="checkbox" checked={!sound.muted} onChange={event => updateSound({ muted: !event.target.checked })} />
          Sound effects
        </label>
        <label className="field">
          <span>Volume</span>
          <span className="field__row">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sound.volume}
              onChange={event => updateSound({ volume: Number(event.target.value) })}
            />
          </span>
        </label>
      </fieldset>

      <button type="button" className="btn btn--small" onClick={() => replaceSettings(DEFAULT_SETTINGS)}>
        Reset to defaults
      </button>
    </aside>
  );
}

// ---------- the album ----------
function Album({ album, packsOpened }) {
  const narrow = useNarrow();
  const [filter, setFilter] = useState("all");
  const entries = Object.values(album);
  const figures = new Set(entries.map(entry => entry.card.id)).size;
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  const shown = entries
    .filter(entry => filter === "all" || entry.tier === filter)
    .sort((a, b) => {
      const rank = tier => (tier === "sticker" ? -1 : TIERS.indexOf(tier));
      return rank(b.tier) - rank(a.tier) || a.card.name.localeCompare(b.card.name);
    });

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

// ---------- the page ----------
export default function PacksPage() {
  const { settings, pack, album, packsOpened, sound } = usePackStore();
  const [view, setView] = useState("open");
  const [showSettings, setShowSettings] = useState(false);

  const pools = TIERS.filter(tier => tier !== "gold").map(tier => `${TIER_INFO[tier].label} ${poolByTier[tier].length}`).join(" · ") + " · Gold: upgraded Epic or Legendary";

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
