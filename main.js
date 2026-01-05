import { initFilters, applyFilters } from "./scripts/filter_logic.js";

import { marvelGroups } from "./card_data/marvelCardData.js";
import { dcGroups } from "./card_data/dcCardData.js";
import { ninjagoGroups } from "./card_data/ninjagoCardData.js";
import { starWarsGroups } from "./card_data/starWarsCardData.js";
import { miscGroups } from "./card_data/miscCardData.js";

const IMAGE_BASE_PATH = "assets/minifigures_images/";
const UNKNOWN_IMAGE = IMAGE_BASE_PATH + "unknown_character.png";

const allGroups = [
  ...marvelGroups,
  ...dcGroups,
  ...ninjagoGroups,
  ...starWarsGroups,
  ...miscGroups
];

// Normalization (single responsibility)
function normalizeCard(card) {
  const images = (card.images || []).map(img => IMAGE_BASE_PATH + img);

  return {
    name: card.name,
    images: images.length ? images : [UNKNOWN_IMAGE],
    infos: Array.isArray(card.infos) ? card.infos : [card.info || ""],
    locked: Array.isArray(card.locked) ? card.locked : [card.locked || false],
    wantedList: !!card.wantedList,
    glow_color: card.glow_color,
    currentIndex: 0
  };
}

function normalizeGroups(groups) {
  groups.forEach(group => {
    group.cards = group.cards.map(normalizeCard);
  });
}

// Rendering (pure DOM work)
function renderGroups(groups) {
  const container = document.getElementById("groupsContainer");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  groups.forEach(group => {
    const section = document.createElement("section");
    section.className = "group-section";

    const title = document.createElement("h2");
    title.textContent = group.name;

    const grid = document.createElement("div");
    grid.className = "grid";

    group.cards.forEach((card, idx) => {
      grid.appendChild(createCardElement(card, group.name, idx));
    });

    section.append(title, grid);
    container.appendChild(section);

    new Sortable(grid, {
      animation: 150,
      ghostClass: "sortable-ghost",
      disabled: isTouch
    });
  });
}

// Car creation
function createCardElement(card, groupName, cardIdx) {
  const div = document.createElement("div");
  div.className = "card";

  if (card.wantedList) div.classList.add("wantedList");

  div.dataset.group = groupName;
  div.dataset.cardIdx = cardIdx;
  div.dataset.wantedList = card.wantedList;
  div.dataset.locked = card.locked.some(Boolean);

  div.style.setProperty("--glow-color", card.glow_color);

  div.innerHTML = `
    <img
      src="${card.images[0]}"
      alt="${card.name}"
      loading="lazy"
      style="${card.locked[0] ? "filter: grayscale(100%)" : ""}"
    >
    <div class="overlay">
      <strong>${card.name}</strong><br>
      <span class="card-desc">${card.infos[0]}</span>
    </div>
  `;

  return div;
}

// Event handling
function attachCardInteractions(groups) {
  const container = document.getElementById("groupsContainer");

  container.addEventListener("click", e => {
    const cardDiv = e.target.closest(".card");
    if (!cardDiv) return;

    const group = groups.find(g => g.name === cardDiv.dataset.group);
    if (!group) return;

    const card = group.cards[cardDiv.dataset.cardIdx];

    card.currentIndex = (card.currentIndex + 1) % card.images.length;

    const img = cardDiv.querySelector("img");
    img.src = card.images[card.currentIndex];
    img.style.filter = card.locked[card.currentIndex] ? "grayscale(100%)" : "";

    cardDiv.querySelector(".card-desc").textContent =
      card.infos[card.currentIndex % card.infos.length];
  });

  container.addEventListener("mousemove", e => {
    const cardDiv = e.target.closest(".card");
    if (!cardDiv) return;

    const rect = cardDiv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * 30;
    const rotateY = ((x - rect.width / 2) / rect.width) * 30;

    cardDiv.style.transform =
      `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  container.addEventListener(
    "mouseleave",
    e => {
      const cardDiv = e.target.closest(".card");
      if (cardDiv) cardDiv.style.transform = "";
    },
    true
  );
}

// Initialization
normalizeGroups(allGroups);
renderGroups(allGroups);
attachCardInteractions(allGroups);

initFilters();
applyFilters();
