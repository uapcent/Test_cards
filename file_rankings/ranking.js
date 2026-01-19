import { marvelGroups } from "../card_data/marvelCardData.js";
import { dcGroups } from "../card_data/dcCardData.js";
import { ninjagoGroups } from "../card_data/ninjagoCardData.js";
import { starWarsGroups } from "../card_data/starWarsCardData.js";
import { miscGroups } from "../card_data/miscCardData.js";

// ---------- helpers ----------
function normalizeImage(image) {
  if (!image) return null;
  const name = image.includes("/") ? image.slice(image.lastIndexOf("/") + 1) : image;
  return name.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

// Flatten all groups into a single list of cards with image
function extractCards(groupsArray) {
  const map = new Map(); // image → { name, image }

  for (const groups of groupsArray) {
    for (const group of groups) {
      for (const card of group.cards ?? []) {
        if (card.image) map.set(normalizeImage(card.image), { name: card.name, image: normalizeImage(card.image) });
        if (Array.isArray(card.variants)) {
          for (const v of card.variants) {
            if (v.image) map.set(normalizeImage(v.image), { name: card.name, image: normalizeImage(v.image) });
          }
        }
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
  const sorted = [...images].sort((a, b) => ratings[a].rating - ratings[b].rating);
  const i = Math.floor(Math.random() * (sorted.length - 1));
  return [sorted[i], sorted[i + 1]];
}

// ---------- UI ----------
const cardMap = extractCards([marvelGroups, dcGroups, ninjagoGroups, starWarsGroups, miscGroups]);
const images = [...cardMap.keys()];
const ratings = initRatings(images);

const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const rankingEl = document.getElementById("ranking");

let currentPair = [];

function renderPair() {
  currentPair = pickPair(images, ratings);

  const leftImg = `../assets/minifigures_images/thumbnails/${currentPair[0]}.webp`;
  const rightImg = `../assets/minifigures_images/thumbnails/${currentPair[1]}.webp`;

  leftBtn.innerHTML = `<img src="${leftImg}" alt="${cardMap.get(currentPair[0]).name}">`;
  rightBtn.innerHTML = `<img src="${rightImg}" alt="${cardMap.get(currentPair[1]).name}">`;

  console.log(`New pair: ${cardMap.get(currentPair[0]).name} vs ${cardMap.get(currentPair[1]).name}`);
}

function renderRanking() {
  const sorted = [...images].sort((a, b) => ratings[b].rating - ratings[a].rating);

  rankingEl.innerHTML = "";
  for (const img of sorted.slice(0, 15)) {
    const li = document.createElement("li");

    li.innerHTML = `
      <img src="../assets/minifigures_images/thumbnails/${img}.webp" alt="${cardMap.get(img).name}" width="40" height="40">
      <span>${cardMap.get(img).name} — ${Math.round(ratings[img].rating)}</span>
    `;

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "0.5rem";

    rankingEl.appendChild(li);
  }

  console.log("Top ranking:", sorted.slice(0, 5).map(i => `${cardMap.get(i).name}(${Math.round(ratings[i].rating)})`));
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