import { initFilters, applyFilters } from "./scripts/filter_logic.js";

import { marvelGroups } from './card_data/marvelCardData.js';
import { dcGroups } from './card_data/dcCardData.js';
import { ninjagoGroups } from './card_data/ninjagoCardData.js';
import { starWarsGroups } from './card_data/starWarsCardData.js';
import { miscGroups } from './card_data/miscCardData.js';

const IMAGE_BASE_PATH = "assets/minifigures_images/";


// Helper to normalize card data
function normalizeCard(card) {
  return {
    name: card.name,
    images: (card.images || []).map(
      img => IMAGE_BASE_PATH + img
    ),
    infos: Array.isArray(card.infos) ? card.infos : [card.info || ""],
    locked: Array.isArray(card.locked) ? card.locked : [card.locked || false],
    wantedList: !!card.wantedList,
    glow_color: card.glow_color,
    currentIndex: 0
  };
}


// Normalize all cards
displayCardInfo(marvelGroups);
displayCardInfo(dcGroups);
displayCardInfo(ninjagoGroups);
displayCardInfo(starWarsGroups);
displayCardInfo(miscGroups);

function displayCardInfo(groups) {
  groups.forEach(group => {
    group.cards = group.cards.map(normalizeCard);
  });

  const groupsContainer = document.getElementById("groupsContainer");

  // Render all groups and cards
  groups.forEach(group => {
    const section = document.createElement("section");
    section.classList.add("group-section");

    const title = document.createElement("h2");
    title.textContent = group.name;
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.classList.add("grid");

    group.cards.forEach((card, cardIdx) => {
      const div = document.createElement("div");
      div.classList.add("card");
      if (card.wantedList) div.classList.add("wantedList");

      div.dataset.group = group.name;
      div.dataset.cardIdx = cardIdx;
      div.dataset.wantedList = card.wantedList;
      div.dataset.locked = card.locked.some(v => v);

      div.style.setProperty('--glow-color', card.glow_color);


      div.innerHTML = `
      <img src="${card.images[0]}" alt="${card.name}" style="${card.locked[0] ? 'filter: grayscale(100%);' : ''}">
      <div class="overlay">
        <strong>${card.name}</strong><br>
        <span class="card-desc">${card.infos[0]}</span>
      </div>
    `;
      grid.appendChild(div);
    });

    section.appendChild(grid);
    groupsContainer.appendChild(section);

    new Sortable(grid, {
      animation: 150,
      ghostClass: 'sortable-ghost'
    });
  });

  initFilters();
  applyFilters();



  // Event delegation for clicks and mousemove
  groupsContainer.addEventListener('click', function (e) {
    const cardDiv = e.target.closest('.card');
    if (!cardDiv) return;
    const groupName = cardDiv.dataset.group;
    const cardIdx = cardDiv.dataset.cardIdx;
    const group = groups.find(g => g.name === groupName);
    const card = group.cards[cardIdx];

    // Only cycle if not locked for current index
    // if (card.locked[card.currentIndex]) return;

    card.currentIndex = (card.currentIndex + 1) % card.images.length;
    const img = cardDiv.querySelector('img');
    img.src = card.images[card.currentIndex];
    img.style.filter = card.locked[card.currentIndex] ? "grayscale(100%)" : "";

    const desc = cardDiv.querySelector('.card-desc');
    desc.textContent = card.infos[card.currentIndex % card.infos.length];
  });

  groupsContainer.addEventListener('mousemove', function (e) {
    const cardDiv = e.target.closest('.card');
    if (!cardDiv) return;
    const rect = cardDiv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 30;
    const rotateX = ((y - centerY) / centerY) * 30;
    cardDiv.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  groupsContainer.addEventListener('mouseleave', function (e) {
    const cardDiv = e.target.closest('.card');
    if (!cardDiv) return;
    cardDiv.style.transform = '';
  }, true);
}

