// Shows one variant on a rendered card element.
export function showVariant(cardDiv, variant) {
  const img = cardDiv.querySelector("img");
  img.src = variant.image;
  img.style.filter = variant.locked ? "grayscale(100%)" : "";

  cardDiv.querySelector(".card-desc").textContent = variant.info;
  cardDiv.classList.toggle("defective", variant.defective);
}
