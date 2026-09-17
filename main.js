import { initFilters, applyFilters } from "./scripts/filter_logic.js";
import { showVariant } from "./scripts/card_view.js";
import { resolveImage } from "./scripts/images.js";
import { allGroups } from "./card_data/index.js";

const modal = document.getElementById("cardModal");
const modalTitle = document.getElementById("modalTitle");
const modalVariants = document.getElementById("modalVariants");
const closeBtn = modal.querySelector(".modal-close");

// -------- Normalization --------
function normalizeVariant(variant, card) {
  return {
    image: resolveImage(variant.image),
    info: variant.info || "",
    appears_in: variant.appears_in ?? card.appears_in ?? "",
    year: variant.year ?? card.year ?? null,
    locked: !!variant.locked,
    wantedList: !!variant.wantedList,
    defective: !!variant.defective
  };
}

function normalizeCard(card) {
  // Single-image cards become a card with one variant
  const variants = card.variants?.length
    ? card.variants.map(v => normalizeVariant(v, card))
    : [normalizeVariant(card, card)];

  return {
    name: card.name,
    glow_color: card.glow_color,
    variants,
    filteredVariants: [...variants],
    currentIndex: 0
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
  div.tabIndex = 0;
  div.dataset.group = groupName;
  div.dataset.cardIdx = cardIdx;

  // Only cards with a glow color glow on hover
  if (card.glow_color) {
    div.classList.add("glow");
    div.style.setProperty("--glow-color", card.glow_color);
  }

  div.innerHTML = `
  <img alt="${card.name}" loading="lazy">

  <button class="info-btn" aria-label="Card info">i</button>

  <div class="overlay">
    <strong class="card-name">${card.name}</strong>
    <span class="card-desc"></span>
  </div>
`;

  showVariant(div, card.filteredVariants[0]);
  return div;
}

// -------- Interactions --------
function findCard(groups, cardDiv) {
  const group = groups.find(g => g.name === cardDiv.dataset.group);
  return group?.cards[cardDiv.dataset.cardIdx];
}

function showNextVariant(groups, cardDiv) {
  const card = findCard(groups, cardDiv);
  if (!card?.filteredVariants.length) return;

  card.currentIndex = (card.currentIndex + 1) % card.filteredVariants.length;
  showVariant(cardDiv, card.filteredVariants[card.currentIndex]);
}

function attachCardInteractions(groups) {
  const container = document.getElementById("groupsContainer");

  container.addEventListener("click", e => {
    const infoBtn = e.target.closest(".info-btn");
    if (infoBtn) {
      // Opening info shouldn't also switch the card's variant
      e.stopPropagation();
      openCardModal(findCard(groups, infoBtn.closest(".card")));
      return;
    }

    const cardDiv = e.target.closest(".card");
    if (cardDiv) showNextVariant(groups, cardDiv);
  });

  container.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (!e.target.classList.contains("card")) return;

    e.preventDefault();
    showNextVariant(groups, e.target);
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

// -------- Modal --------
function openCardModal(card) {
  modalTitle.textContent = card.name;
  modalVariants.innerHTML = "";

  card.variants.forEach(variant => {
    const appearsIn = variant.appears_in
      ? `<a href="${variant.appears_in}" target="_blank" rel="noopener noreferrer">
       ${variant.appears_in}
     </a>`
      : "No info";

    const div = document.createElement("div");
    div.className = "modal-variant";
    div.innerHTML = `
      <img src="${variant.image}" alt="${card.name}">
      <p>${variant.info || "No info"}</p>
      <p>Appears in: ${appearsIn}</p>
      <p>Year: ${variant.year || "Unknown"}</p>
    `;

    modalVariants.appendChild(div);
  });

  modal.classList.remove("hidden");
}

function closeCardModal() {
  modal.classList.add("hidden");
}

closeBtn.addEventListener("click", closeCardModal);

modal.addEventListener("click", e => {
  if (e.target === modal) closeCardModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCardModal();
});

// -------- Init --------
normalizeGroups(allGroups);
renderGroups(allGroups);
attachCardInteractions(allGroups);

initFilters(allGroups);
applyFilters();
