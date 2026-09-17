import { allGroups } from "../card_data/index.js";
import { imageId, resolveImage } from "../scripts/images.js";

// ---------- helpers ----------
// Flatten all groups into one entry per image, keyed by image ID
function extractCards(groups) {
  const map = new Map(); // image ID → { name, year, image }

  for (const group of groups) {
    for (const card of group.cards ?? []) {
      for (const entry of [card, ...(card.variants ?? [])]) {
        if (!entry.image) continue;

        map.set(imageId(entry.image), {
          name: card.name,
          year: entry.year ?? card.year,
          image: resolveImage(entry.image)
        });
      }
    }
  }

  return map;
}

// ---------- Elo rating ----------
function initRatings(images) {
  const saved = JSON.parse(localStorage.getItem("ratings") || "{}");
  const ratings = {};

  for (const img of images) {
    ratings[img] = saved[img] ?? { rating: 1000, games: 0 };
  }
  return ratings;
}

function expectedScore(a, b) {
  return 1 / (1 + Math.pow(10, (b - a) / 400));
}

function vote(winner, loser, ratings) {
  const k = 32;
  const w = ratings[winner];
  const l = ratings[loser];

  const expected = expectedScore(w.rating, l.rating);

  w.rating += k * (1 - expected);
  l.rating += k * (0 - (1 - expected));

  w.games++;
  l.games++;

  localStorage.setItem("ratings", JSON.stringify(ratings));
  console.log(`Vote: ${winner} beats ${loser}`);
  console.log(`Updated ratings: ${winner}=${Math.round(w.rating)}, ${loser}=${Math.round(l.rating)}`);
}

// ---------- pick pair ----------
function pickPair(images, ratings) {
  const a = images[Math.floor(Math.random() * images.length)];
  const ratingA = ratings[a].rating;

  const candidates = images.filter(
    b => b !== a && Math.abs(ratings[b].rating - ratingA) < 150
  );

  const b = candidates.length
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : images[Math.floor(Math.random() * images.length)];

  return [a, b];
}

// ---------- UI ----------
const cardMap = extractCards(allGroups);
const images = [...cardMap.keys()];
const ratings = initRatings(images);

const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const rankingEl = document.getElementById("ranking");

let currentPair = [];

function renderChoice(button, id) {
  const card = cardMap.get(id);

  button.innerHTML = `
    <img src="${card.image}" alt="${card.name}">
    <p> ${card.name} </p>
    <p> Year: ${card.year || "Unknown"} </p>
  `;
}

function renderPair() {
  currentPair = pickPair(images, ratings);

  renderChoice(leftBtn, currentPair[0]);
  renderChoice(rightBtn, currentPair[1]);

  console.log(`New pair: ${cardMap.get(currentPair[0]).name} vs ${cardMap.get(currentPair[1]).name}`);
}

function renderRanking() {
  const sorted = [...images].sort((a, b) => ratings[b].rating - ratings[a].rating);

  rankingEl.innerHTML = "";
  for (const img of sorted.slice(0, 15)) {
    const card = cardMap.get(img);
    const li = document.createElement("li");

    li.innerHTML = `
      <img src="${card.image}" alt="${card.name}" width="40" height="40">
      <span>${card.name} — ${Math.round(ratings[img].rating)}</span>
    `;

    rankingEl.appendChild(li);
  }
}

leftBtn.onclick = () => {
  vote(currentPair[0], currentPair[1], ratings);
  renderPair();
  renderRanking();
};

rightBtn.onclick = () => {
  vote(currentPair[1], currentPair[0], ratings);
  renderPair();
  renderRanking();
};

// Initial render
renderPair();
renderRanking();
