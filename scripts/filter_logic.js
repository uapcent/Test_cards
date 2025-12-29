// filters.js

let filters = {
  wantedList: false,
  unlocked: false
};

export function initFilters() {
  const wantedList = document.getElementById("filter-wantedList");
  const unlockedCheckbox = document.getElementById("filter-unlocked");

  if (!wantedList || !unlockedCheckbox) return;

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
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let visible = true;

    if (filters.wantedList && card.dataset.wantedList !== "true") {
      visible = false;
    }

    if (filters.unlocked && card.dataset.locked === "true") {
      visible = false;
    }

    card.style.display = visible ? "" : "none";
  });

  updateGroupVisibility();
}

function updateGroupVisibility() {
  document.querySelectorAll(".group-section").forEach(section => {
    const visibleCards = section.querySelectorAll(".card:not([style*='display: none'])");
    section.style.display = visibleCards.length ? "" : "none";
  });
}
