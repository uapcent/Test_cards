import { useEffect, useMemo, useState } from "react";
import { themes } from "../data/collection.js";
import { Icon, ThemeIcon } from "../components/icons.jsx";
import "./rankings.css";

const STORAGE_KEY = "ratings";
const K = 32;
const LEADERBOARD_SIZE = 15;

// One entry per picture, keyed the same way the old page keyed them,
// so votes saved earlier still count
function buildEntries() {
  const byId = new Map();
  for (const theme of themes) {
    for (const character of theme.characters) {
      for (const variant of character.variants) {
        if (!variant.hasImage) continue;
        byId.set(variant.id, {
          id: variant.id,
          name: character.name,
          label: variant.label,
          year: variant.year,
          owned: variant.owned,
          image: variant.image,
          cutout: variant.cutout,
          hasCutout: variant.hasCutout,
          themeName: theme.name,
          icon: theme.icon,
          accent: theme.accent,
          art: theme.art
        });
      }
    }
  }
  return [...byId.values()];
}

function loadRatings(entries) {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    saved = {};
  }

  const ratings = {};
  for (const entry of entries) {
    // two Lord of the Rings pictures used to come from BrickLink, so older
    // votes for them sit under keys ending in ".original"
    ratings[entry.id] = saved[entry.id] ?? saved[`${entry.id}.original`] ?? { rating: 1000, games: 0 };
  }
  return ratings;
}

function pickPair(entries, ratings) {
  const a = entries[Math.floor(Math.random() * entries.length)];
  const close = entries.filter(
    entry => entry.id !== a.id && Math.abs(ratings[entry.id].rating - ratings[a.id].rating) < 150
  );
  const pool = close.length ? close : entries.filter(entry => entry.id !== a.id);
  return [a, pool[Math.floor(Math.random() * pool.length)]];
}

// One side of the versus screen. The whole panel is the button.
function Contender({ entry, side, rank, rating, onPick }) {
  const details = [entry.label || "Standard", entry.year].filter(Boolean).join(" · ");
  const classes = ["contender", `contender--${side}`];
  if (!entry.hasCutout) classes.push("contender--photo");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      style={{
        ...(entry.accent ? { "--theme-accent": entry.accent } : {}),
        ...(entry.art ? { "--theme-art": `url("${entry.art}")` } : {})
      }}
      aria-label={`${entry.name}, ${details}, ${entry.themeName}${rank ? `, ranked ${rank}` : ""}`}
      onClick={onPick}
    >
      <span className="contender__backdrop" aria-hidden="true" />

      {/* keyed so each new pair slides in rather than swapping in place */}
      <span className="contender__inner" key={entry.id}>
        <span className="contender__top">
          <span className="contender__theme">
            <ThemeIcon name={entry.icon} size={18} />
            <span>{entry.themeName}</span>
          </span>
          <span className="contender__standing">
            {rank ? (
              <>
                <strong>#{rank}</strong> {Math.round(rating)}
              </>
            ) : (
              "Unrated"
            )}
          </span>
        </span>

        <span className="contender__stage">
          <img className="contender__figure" src={entry.cutout} alt="" />
          <span className="contender__reflection-clip">
            <img className="contender__reflection" src={entry.cutout} alt="" />
          </span>
        </span>

        <span className="contender__plate">
          <span className="contender__text">
            <span className="contender__name">{entry.name}</span>
            <span className="contender__sub">
              {details}
              {!entry.owned && (
                <span className="contender__lock">
                  <Icon name="lock" size={13} /> Not owned
                </span>
              )}
            </span>
          </span>
          <kbd aria-hidden="true">{side === "left" ? "←" : "→"}</kbd>
        </span>
      </span>
    </button>
  );
}

export default function RankingsPage() {
  const entries = useMemo(buildEntries, []);
  const [ratings, setRatings] = useState(() => loadRatings(entries));
  const [pair, setPair] = useState(() => pickPair(entries, ratings));
  const [lastRound, setLastRound] = useState(null);

  const leaderboard = useMemo(
    () =>
      entries
        .filter(entry => ratings[entry.id].games > 0)
        .sort((a, b) => ratings[b.id].rating - ratings[a.id].rating),
    [entries, ratings]
  );
  const rankOf = useMemo(() => new Map(leaderboard.map((entry, index) => [entry.id, index + 1])), [leaderboard]);
  const votes = Math.round(entries.reduce((total, entry) => total + ratings[entry.id].games, 0) / 2);

  const vote = winner => {
    const loser = pair.find(entry => entry.id !== winner.id);
    const expected = 1 / (1 + Math.pow(10, (ratings[loser.id].rating - ratings[winner.id].rating) / 400));
    const change = K * (1 - expected);

    const next = {
      ...ratings,
      [winner.id]: { rating: ratings[winner.id].rating + change, games: ratings[winner.id].games + 1 },
      [loser.id]: { rating: ratings[loser.id].rating - change, games: ratings[loser.id].games + 1 }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // a full or blocked storage should not stop the voting
    }

    setRatings(next);
    setLastRound({ winner, loser, change: Math.round(change) });
    setPair(pickPair(entries, next));
  };

  const skip = () => setPair(pickPair(entries, ratings));

  useEffect(() => {
    const onKeyDown = event => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, [contenteditable]")) return;
      // holding a key must not cast a stream of votes, and Alt+Left is the browser's Back
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") vote(pair[0]);
      else if (key === "arrowright" || key === "d") vote(pair[1]);
      else if (key === "s") skip();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const winnerRank = lastRound && rankOf.get(lastRound.winner.id);

  return (
    <div className="rankings">
      <header className="rankings__bar">
        <h1>Rankings</h1>
        <p className="rankings__counter">
          <span className="rankings__votes">{votes}</span>
          <span className="rankings__muted">
            {votes === 1 ? "vote" : "votes"} · {leaderboard.length} / {entries.length} figures rated
          </span>
        </p>
      </header>

      <div className="rankings__body">
        <section className="arena" aria-labelledby="arena-title">
          <h2 id="arena-title" className="arena__prompt">Which one is better?</h2>

          <Contender
            entry={pair[0]}
            side="left"
            rank={rankOf.get(pair[0].id)}
            rating={ratings[pair[0].id].rating}
            onPick={() => vote(pair[0])}
          />

          <div className="arena__middle">
            <span className="arena__vs" aria-hidden="true">VS</span>
            <button type="button" className="arena__skip" onClick={skip}>Skip</button>
          </div>

          <Contender
            entry={pair[1]}
            side="right"
            rank={rankOf.get(pair[1].id)}
            rating={ratings[pair[1].id].rating}
            onPick={() => vote(pair[1])}
          />
        </section>

        <aside className="leaderboard" aria-labelledby="leaderboard-title">
          <h2 id="leaderboard-title">
            Leaderboard
            <span>Top {LEADERBOARD_SIZE}</span>
          </h2>

          {leaderboard.length ? (
            <ol className="leaderboard__list">
              {leaderboard.slice(0, LEADERBOARD_SIZE).map((entry, index) => {
                const classes = ["leaderboard__row"];
                if (index < 3) classes.push("is-podium");
                if (lastRound && entry.id === lastRound.winner.id) classes.push("is-recent");

                return (
                  <li key={entry.id} className={classes.join(" ")}>
                    <span className="leaderboard__rank">{index + 1}</span>
                    <span className="leaderboard__disc">
                      <span>
                        <img src={entry.image} alt="" loading="lazy" />
                      </span>
                    </span>
                    <span className="leaderboard__who">
                      <span className="leaderboard__name">{entry.name}</span>
                      <span className="leaderboard__theme">
                        {entry.themeName}
                        {entry.label && ` · ${entry.label}`}
                      </span>
                    </span>
                    <span className="leaderboard__rating">{Math.round(ratings[entry.id].rating)}</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="leaderboard__empty">No votes yet. Pick a figure and the ranking starts here.</p>
          )}
        </aside>
      </div>

      <footer className="rankings__footer">
        <p className="rankings__last" aria-live="polite">
          {lastRound ? (
            <>
              <span className="rankings__last-label">Last round</span>
              <span className="is-up">
                ▲ {lastRound.winner.name} +{lastRound.change}
                {winnerRank && <span className="rankings__muted"> · now #{winnerRank}</span>}
              </span>
              <span className="is-down">▼ {lastRound.loser.name} −{lastRound.change}</span>
            </>
          ) : (
            <span className="rankings__muted">Pairs are drawn from figures rated close to each other.</span>
          )}
        </p>

        <div className="rankings__hints">
          <span><kbd>←</kbd><kbd>→</kbd> Pick</span>
          <span><kbd>S</kbd> Skip</span>
        </div>
      </footer>
    </div>
  );
}
