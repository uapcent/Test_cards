import { initFilters, applyFilters } from "./scripts/filter_logic.js";

import { marvelGroups } from "./card_data/marvelCardData.js";
import { dcGroups } from "./card_data/dcCardData.js";
import { ninjagoGroups } from "./card_data/ninjagoCardData.js";
import { starWarsGroups } from "./card_data/starWarsCardData.js";
import { miscGroups } from "./card_data/miscCardData.js";
import { testGroups } from "./card_data/testData.js";

const IMAGE_BASE_PATH = "assets/minifigures_images/thumbnails/";
const UNKNOWN_IMAGE = IMAGE_BASE_PATH + "unknown_character.webp";

const allGroups = [
  ...marvelGroups,
  ...dcGroups,
  ...ninjagoGroups,
  ...starWarsGroups,
  ...miscGroups
  // ...testGroups
];

// -------- Normalization --------
function normalizeCard(card) {
  if (card.variants && card.variants.length) {
    const variants = card.variants.map(v => ({
      image: resolveImage(v.image),
      info: v.info || "",
      locked: !!v.locked,
      wantedList: !!v.wantedList,
      defective: !!v.defective
    }));

    return {
      name: card.name,
      glow_color: card.glow_color,
      variants,
      filteredVariants: [...variants],
      currentIndex: 0,
      defective: !!card.defective
    };
  }

  // Single-image card → wrap into a single variant
  const variant = {
    image: resolveImage(card.image),
    info: card.info || "",
    locked: !!card.locked,
    wantedList: !!card.wantedList,
    defective: !!card.defective
  };

  return {
    name: card.name,
    glow_color: card.glow_color,
    variants: [variant],
    filteredVariants: [variant],
    currentIndex: 0,
    defective: !!card.defective
  };
}


function normalizeGroups(groups) {
  groups.forEach(group => {
    group.cards = group.cards.map(normalizeCard);
  });
}

// -------- Rendering --------
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

// -------- Card creation --------
function createCardElement(card, groupName, cardIdx) {
  const div = document.createElement("div");
  div.className = "card";

  div.dataset.group = groupName;
  div.dataset.cardIdx = cardIdx;

  div.style.setProperty("--glow-color", card.glow_color);

  const variant = card.filteredVariants[0];

  div.className = "card";
  if (variant.defective) div.classList.add("defective");


  const variantInfo = variant ? variant.info : "No available variants";
  const variantImage = variant
    ? variant.image
    : UNKNOWN_IMAGE;

  const lockedVariant = variant ? variant.locked : true;

  div.innerHTML = `
    <img
      src="${variantImage}"
      alt="${card.name}"
      loading="lazy"
      style="${lockedVariant ? "filter: grayscale(100%)" : ""}"
    >
    <div class="overlay">
      <strong>${card.name}</strong><br>
      <span class="card-desc">${variantInfo}</span>
    </div>
  `;

  return div;
}


// -------- Interactions --------
function attachCardInteractions(groups) {
  const container = document.getElementById("groupsContainer");

  container.addEventListener("click", e => {
    const cardDiv = e.target.closest(".card");
    if (!cardDiv) return;

    const group = groups.find(g => g.name === cardDiv.dataset.group);
    if (!group) return;

    const card = group.cards[cardDiv.dataset.cardIdx];
    if (!card.filteredVariants.length) return;

    card.currentIndex = (card.currentIndex + 1) % card.filteredVariants.length;
    const variant = card.filteredVariants[card.currentIndex];

    const img = cardDiv.querySelector("img");
    img.src = variant.image;
    img.style.filter = variant.locked ? "grayscale(100%)" : "";
    cardDiv.querySelector(".card-desc").textContent = variant.info;

    // 🔴 update defective class
    if (variant.defective) cardDiv.classList.add("defective");
    else cardDiv.classList.remove("defective");


    cardDiv.querySelector(".card-desc").textContent = variant.info;
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

function resolveImage(image) {
  if (!image) return UNKNOWN_IMAGE;

  // If already a full URL (http, https, protocol-relative)
  if (/^(https?:)?\/\//i.test(image)) {
    return image;
  }

  // Otherwise, treat as local asset
  return IMAGE_BASE_PATH + image;
}



// -------- Init --------
normalizeGroups(allGroups);
renderGroups(allGroups);
attachCardInteractions(allGroups);

initFilters(allGroups);
applyFilters();

