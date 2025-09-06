// Example card data
const cards = [
  {
    name: "Iron Man",
    info: "Genius billionaire in armor.",
    images: ["minifigures_images/iron_man.jpg", "minifigures_images/lego-iron-man-mark-5-armor-minifigure-1054653.jpg"],
    locked: true
  },
  {
    name: "Hulk",
    info: "Strongest Avenger.",
    images: ["minifigures_images/lego-hulk-large-with-dark-tan-pants-minifigure-1219731.jpg"],
    locked: true
  }
  ,
  {
    name: "Batman - Armored",
    info: "Ready to fight superman",
    images: ["minifigures_images/sh0217.png"],
    locked: false
  },
  {
    name: "Batman",
    info: "",
    images: ["minifigures_images/sh0151.png"],
    locked: false
  },
  {
    name: "Deathstroke",
    info: "",
    images: ["minifigures_images/sh0194.jpg"],
    locked: false
  },
  {
    name: "Robin",
    info: "Tim Drake",
    images: ["minifigures_images/sh0195.jpg"],
    locked: false
  },
  {
    name: "The Flash",
    info: "",
    images: ["minifigures_images/sh0087.original.png"],
    locked: true
  },
  {
    name: "Batgirl",
    info: "Lego Batman Movie",
    images: ["minifigures_images/sh0305.png"],
    locked: false
  },
    {
    name: "Superman",
    info: "",
    images: ["minifigures_images/sh1055.png", "minifigures_images/sh0219.original.png"],
    locked: false
  }
  
];

const grid = document.getElementById("cardGrid");

// Render cards
cards.forEach((card, index) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.index = index;
  div.dataset.imageIndex = 0;

  div.innerHTML = `
    <img src="${card.images[0]}" alt="${card.name}" style="${card.locked ? 'filter: grayscale(100%);' : ''}">
    <div class="overlay">
      <strong>${card.name}</strong><br>
      ${card.info}
    </div>
  `;

  // Cycle images on click (only if not locked)
  div.addEventListener("click", () => {
    if (card.locked) return;
    let imgIndex = parseInt(div.dataset.imageIndex, 10);
    imgIndex = (imgIndex + 1) % card.images.length;
    div.dataset.imageIndex = imgIndex;
    div.querySelector("img").src = card.images[imgIndex];
  });

  grid.appendChild(div);
});

// Make grid sortable
new Sortable(grid, {
  animation: 150,
  ghostClass: 'sortable-ghost'
});