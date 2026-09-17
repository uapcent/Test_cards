import { showVariant } from "./card_view.js";

let filters = {
  wantedList: false,
  unlocked: false
};

let groupsRef = null;

export function initFilters(groups) {
  groupsRef = groups;

  const wantedList = document.getElementById("filter-wantedList");
  const unlockedCheckbox = document.getElementById("filter-unlocked");

  wantedList.addEventListener("change", () => {
    filters.wantedList = wantedList.checked;
    applyFilters();
  });

  unlockedCheckbox.addEventListener("change", () => {
    filters.unlocked = unlockedCheckbox.checked;
    applyFilters();
  });
}

export function applyFilters() {
  document.querySelectorAll(".card").forEach(cardDiv => {
    const group = groupsRef.find(g => g.name === cardDiv.dataset.group);
    const card = group.cards[cardDiv.dataset.cardIdx];

    card.filteredVariants = card.variants.filter(v => {
      if (filters.unlocked && v.locked) return false;
      if (filters.wantedList && !v.wantedList) return false;
      return true;
    });

    card.currentIndex = 0;

    if (!card.filteredVariants.length) {
      cardDiv.style.display = "none";
      return;
    }

    cardDiv.style.display = "";
    showVariant(cardDiv, card.filteredVariants[0]);
  });

  updateGroupVisibility();
}

function updateGroupVisibility() {
  document.querySelectorAll(".group-section").forEach(section => {
    const visibleCard = section.querySelector(
      ".card:not([style*='display: none'])"
    );
    section.style.display = visibleCard ? "" : "none";
  });
}
