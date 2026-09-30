import { useEffect, useMemo, useRef, useState } from "react";
import TradingCard, { CARD_HEIGHT, CARD_WIDTH, CardBack } from "../../components/TradingCard.jsx";
import { Icon } from "../../components/icons.jsx";
import { TIER_INFO } from "../../data/tiers.js";
import { prefersReducedMotion, useNarrow } from "../../lib/hooks.js";
import { bestOf } from "../../lib/packs.js";
import { closePack, openPack, revealTo } from "../../lib/packStore.js";
import { anticipation, playReveal } from "../../lib/sound.js";
import Burst from "./Burst.jsx";

// how many waiting cards are drawn behind the current one
const MAX_STACK = 5;

// The summary that follows a pack: every card, and what to do next
function Summary({ cards, narrow }) {
  const best = bestOf(cards);

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

// A pack being opened, one card at a time, with the rest fanned out behind it
export default function PackOpening({ pack }) {
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
    // only the best of what is left is heard, not a hundred chimes at once
    const remaining = cards.slice(up ? cursor + 1 : cursor);
    if (remaining.length) playReveal(bestOf(remaining).tier);
    revealTo(cards.length);
    setCursor(last);
    setUp(true);
    setDone(true);
  };

  if (done) return <Summary cards={cards} narrow={narrow} />;

  const showFx = up && current.tier !== "common";
  const big = up && ["epic", "legendary", "gold"].includes(current.tier);
  const nextTell = up ? null : current.tier;

  // The cards still to open, fanned out behind the current one like an accordion.
  // Their backs give nothing away: only the card on top glows in its tier's colour.
  const waiting = cards.length - cursor - 1;
  const stacked = Math.min(waiting, MAX_STACK);
  const step = narrow ? 12 : 18;

  return (
    <div className={`stage${big && !prefersReducedMotion() ? " stage--shake" : ""}`}>
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
