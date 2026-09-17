import { useMemo, useState } from "react";
import { characters } from "../data/collection.js";
import "./rankings.css";

const STORAGE_KEY = "ratings";
const K = 32;

// One entry per picture, keyed the same way the old page keyed them,
// so votes saved earlier still count
function buildEntries() {
  const byId = new Map();
  for (const character of characters) {
    for (const variant of character.variants) {
      if (!variant.hasImage) continue;
      byId.set(variant.id, { id: variant.id, name: character.name, year: variant.year, image: variant.image });
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

export default function RankingsPage() {
  const entries = useMemo(buildEntries, []);
  const [ratings, setRatings] = useState(() => loadRatings(entries));
  const [pair, setPair] = useState(() => pickPair(entries, loadRatings(entries)));

  const vote = winner => {
    const loser = pair.find(entry => entry.id !== winner.id);
    const expected = 1 / (1 + Math.pow(10, (ratings[loser.id].rating - ratings[winner.id].rating) / 400));

    const next = {
      ...ratings,
      [winner.id]: { rating: ratings[winner.id].rating + K * (1 - expected), games: ratings[winner.id].games + 1 },
      [loser.id]: { rating: ratings[loser.id].rating - K * (1 - expected), games: ratings[loser.id].games + 1 }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // a full or blocked storage should not stop the voting
    }

    setRatings(next);
    setPair(pickPair(entries, next));
  };

  const top = [...entries].sort((a, b) => ratings[b.id].rating - ratings[a.id].rating).slice(0, 15);

  return (
    <div className="rankings">
      <h1>Which minifigure is better?</h1>

      <div className="rankings__battle">
        <button type="button" className="rankings__choice" onClick={() => vote(pair[0])}>
          <img src={pair[0].image} alt={pair[0].name} />
          <p>{pair[0].name}</p>
          <p className="rankings__year">Year: {pair[0].year ?? "Unknown"}</p>
        </button>

        <span className="rankings__vs">VS</span>

        <button type="button" className="rankings__choice" onClick={() => vote(pair[1])}>
          <img src={pair[1].image} alt={pair[1].name} />
          <p>{pair[1].name}</p>
          <p className="rankings__year">Year: {pair[1].year ?? "Unknown"}</p>
        </button>
      </div>

      <h2>Live ranking</h2>
      <ol className="rankings__list">
        {top.map(entry => (
          <li key={entry.id}>
            <img src={entry.image} alt="" width="40" height="40" />
            <span>{entry.name} — {Math.round(ratings[entry.id].rating)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
