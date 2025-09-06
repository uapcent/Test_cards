// Example card data
const groups = [
  {
    name: "Marvel",
    cards: [
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
      },
      {
        name: "Moon Knight",
        info: "",
        images: ["minifigures_images/colmar14.original.png"],
        locked: false,
          legendary: true
      },
      {
        name: "Storm",
        info: "",
        images: ["minifigures_images/colmar23.original.png"],
        locked: false
      }
    ]
  },
  {
    name: "DC Comics",
    cards: [
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
      },
      {
        name: "Lex Luthor",
        info: "Black suit",
        images: ["minifigures_images/sh0012.original.png"],
        locked: true
      },
      {
        name: "Green Lantern",
        info: "Hal Jordan",
        images: ["minifigures_images/sh0145.png"],
        locked: false
      },
      {
        name: "Scarecrow",
        info: "Lego Batman Movie",
        images: ["minifigures_images/sh0391.original.png"],
        locked: false
      }
    ]
  }
];

const groupsContainer = document.getElementById("groupsContainer");

// Render cards
groups.forEach(group => {
  // Create section for group
  const section = document.createElement("section");
  section.classList.add("group-section");

  // Add group title
  const title = document.createElement("h2");
  title.textContent = group.name;
  section.appendChild(title);

  // Create grid for cards
  const grid = document.createElement("div");
  grid.classList.add("grid");

  group.cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.classList.add("card");
    if (card.legendary) div.classList.add("legendary");
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

  section.appendChild(grid);
  groupsContainer.appendChild(section);

  // Make grid sortable
  new Sortable(grid, {
    animation: 150,
    ghostClass: 'sortable-ghost'
  });
});

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 30; // invert sign
    const rotateX = ((y - centerY) / centerY) * 30;  // invert sign
    card.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });
});