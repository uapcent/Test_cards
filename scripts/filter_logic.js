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

      // Card-level wishlist
      if (filters.wantedList && !v.wantedList) return false; // per-variant check

      return true;
    });

    card.currentIndex = 0;

    if (!card.filteredVariants.length) {
      cardDiv.style.display = "none";
      return;
    }

    cardDiv.style.display = "";

    const variant = card.filteredVariants[0];
    const img = cardDiv.querySelector("img");

    img.src = variant.image;
    img.style.filter = variant.locked ? "grayscale(100%)" : "";
    cardDiv.querySelector(".card-desc").textContent = variant.info;
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
