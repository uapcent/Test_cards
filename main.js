// Example card data
import { marvelGroups } from './cardData.js';
import { dcGroups } from './cardData.js';
import { ninjagoGroups } from './cardData.js';
import { starWarsGroups } from './cardData.js';

// Helper to normalize card data
function normalizeCard(card) {
  return {
    name: card.name,
    images: card.images || ["minifigures_images/unknown_character.png"],
    infos: Array.isArray(card.infos) ? card.infos : [card.info || ""],
    locked: Array.isArray(card.locked) ? card.locked : [card.locked || false],
    legendary: !!card.legendary,
    glow_color: card.glow_color, // <-- Add this line
    currentIndex: 0
  };
}

// Normalize all cards
displayCardInfo(marvelGroups);
displayCardInfo(dcGroups);
displayCardInfo(ninjagoGroups);
displayCardInfo(starWarsGroups);

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
    if (card.legendary) div.classList.add("legendary");
    div.dataset.group = group.name;
    div.dataset.cardIdx = cardIdx;
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

