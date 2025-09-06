export const groups = [
  {
    name: "Marvel",
    cards: [
      {
        name: "Iron Man",
        info: "Mark 45 Armor",
        images: ["minifigures_images/sh0164.original.png"],
        locked: false,
        glow_color: '#04e2ffff'
      },
      {
        name: "Hulk",
        info: "Strongest Avenger.",
        images: ["minifigures_images/lego-hulk-large-with-dark-tan-pants-minifigure-1219731.jpg"],
        locked: true,
        glow_color: '#09ff00ff'
      },
      {
        name: "Moon Knight",
        images: ["minifigures_images/colmar14.original.png"],
        locked: false,
        legendary: true,
        glow_color: '#ffffffff'

      },
      {
        name: "Storm",
        images: ["minifigures_images/colmar23.original.png"],
        locked: false
      },
      {
        name: "Spider-man",
        info: "Black Web Pattern",
        images: ["minifigures_images/sh0038.original.png"],
        locked: false
      },
      {
        name: "Dr. Octopus (Otto Octavius)",
        info: "Black Web Pattern",
        images: ["minifigures_images/sh0110.original.png"],
        locked: false
      },
      {
        name: "Spider-Man 2099 - Miguel O'Hara",
        info: "Across the Spider-Verse",
        images: ["minifigures_images/colspi05.original.png"],
        locked: true
      }

    ]
  },
  {
    name: "DC Comics",
    cards: [
      // Main bat-family
      {
        name: "Batman",
        infos: ["New 52", "Lego Batman movie", "Wing Suit", "Armored Suit", "Space Suit", "Fairy Batman"],
        images: ["minifigures_images/sh0151.png", "minifigures_images/sh0329.original.png", "minifigures_images/sh0402.png", "minifigures_images/sh0217.png", "minifigures_images/sh0146.png", "minifigures_images/coltlbm03.original.png"],
        locked: false,
        legendary: false
      },
      {
        name: "Robin - Dick Grayson",
        info: "Lego Batman Movie",
        images: ["minifigures_images/sh0315.png"],
        locked: false
      },
      {
        name: "Robin - Tim Drake",
        infos: ["New 52", "Batman 2"],
        images: ["minifigures_images/sh0195.jpg", "minifigures_images/sh0011.png"],
        locked: [false, true]
      },
      {
        name: "Robin - Damian Wayne",
        images: ["minifigures_images/sh0289.original.png"],
        locked: [true]
      },
      {
        name: "Nightwing",
        images: ["minifigures_images/sh0659.original.png"],
        locked: true
      },
      {
        name: "Red Hood",
        info: "",
        images: ["minifigures_images/sh0282.original.png"],
        locked: true
      },
      {
        name: "Batgirl",
        info: "Lego Batman Movie",
        images: ["minifigures_images/sh0305.png"],
        locked: false
      },
      // Justice League
      {
        name: "Superman",
        infos: ["Classic Superman", "Down of Justice"],
        images: ["minifigures_images/sh1055.png", "minifigures_images/sh0219.original.png"],
        locked: false
      },
      {
        name: "Wonder Woman",
        locked: true
      },
      {
        name: "Aquaman",
        locked: true
      },
      {
        name: "Green Lantern",
        info: "Hal Jordan",
        images: ["minifigures_images/sh0145.png"],
        locked: false,
        glow_color: '#09ff00ff'

      },
      {
        name: "The Flash",
        images: ["minifigures_images/sh0087.original.png"],
        locked: true,
        glow_color: '#ffe600ff'
      }, {
        name: "Hawkman/Hawkgirl",
        locked: true
      },
      {
        name: "Martian ManHunter",
        locked: true
      },
      // Other heroes
      {
        name: "Supergirl",
        locked: true
      },

      // Bat-Villains
      {
        name: "The Joker",
        infos: ["", "Lego Batman Movie"],
        images: ["minifigures_images/dim017.png", "minifigures_images/sh0353.original.png"],
        locked: false
      },
      {
        name: "Harley Quinn",
        images: ["minifigures_images/sh0024.original.png"],
        locked: false
      },
      {
        name: "Scarecrow",
        info: "Lego Batman Movie",
        images: ["minifigures_images/sh0391.original.png"],
        locked: false
      },
      {
        name: "Two Face",
        images: ["minifigures_images/sh0007.original.png"],
        locked: true
      },
      {
        name: "The Penguin",
        locked: true
      },
      {
        name: "Catwoman",
        infos: ["Lego Batman Movie", ""],
        images: ["minifigures_images/sh0330.original.png", "minifigures_images/sh0595.original.png"],
        locked: [false, true]
      },
      {
        name: "Mr Freeze",
        images: ["minifigures_images/sh0049.png"],
        locked: true
      },
      {
        name: "Bane",
        images: ["minifigures_images/sh0009.original.png"],
        locked: true
      },
      {
        name: "The riddler",
        images: ["minifigures_images/sh0593.original.png"],
        locked: true
      },
      {
        name: "Sinestro",
        images: ["minifigures_images/sh0144.original.png"],
        locked: false,
      },
      {
        name: "Deathstroke",
        images: ["minifigures_images/sh0194.jpg"],
        locked: false
      },
      {
        name: "Lex Luthor",
        info: "Black suit",
        images: ["minifigures_images/sh0012.original.png"],
        locked: true
      },
      {
        name: "Commissioner Gordon",
        infos: ["", "Lego Batman Movie", "The Dark Knight Triology"],
        images: ["minifigures_images/sh0591.original.png", "minifigures_images/coltlbm07.original.png", "minifigures_images/sh0063.original.png"],
        locked: [true, true, true]
      }

    ]
  },
  {
    name: "Ninjago",
    cards: [
      {
        name: "Kai",
        infos: ["The Golden Weapons", "DX"],
        images: ["minifigures_images/njo0007.original.png", "minifigures_images/njo0009.original.png"],
        locked: false,
        glow_color: '#ff0000ff'

      },
      {
        name: "Jay",
        infos: ["The Golden Weapons", "Tournament of Elements", "Rogue (Jay)"],
        images: ["minifigures_images/njo0004.original.png", "minifigures_images/njo0137.png", "minifigures_images/njo0986.original.png"],
        locked: [false, false, true],
        glow_color: '#00c3ffff'

      },
      {
        name: "Zane",
        infos: ["DX", "Tournament of Elements", "(Honor Robe) - Day of the Departed", "Dragons Rising"],
        images: ["minifigures_images/njo0018.original.png", "minifigures_images/njo0111.png", "minifigures_images/njo0266.png", "minifigures_images/njo0922.original.png"],
        locked: false,
        glow_color: '#ffffffff'

      },
      {
        name: "Cole",
        infos: ["RX", "Dragons Rising - Mech"],
        images: ["minifigures_images/njo0262.png", "minifigures_images/njo0900.original.png"],
        locked: false,
        glow_color: '#ff9900ff'
      },
      {
        name: "Lloid",
        infos: ["Torunament of Elements"],
        images: ["minifigures_images/njo0123.png"],
        locked: false,
        glow_color: '#00ff22ff'
      },
      {
        name: "Nya",
        infos: ["The Golden Weapons", "Skybound"],
        images: ["minifigures_images/njo0012.original.png", "minifigures_images/njo0245.original.png"],
        locked: false,
        glow_color: '#0051ffff'
      },
      {
        name: "Sensei Wu",
        info: "Lego Ninjago Movie",
        images: ["minifigures_images/njo0354.original.png"],
        locked: false
      },

      {
        name: "Garmadon",
        infos: ["The Golden Weapons", "Lego Ninjago Movie"],
        images: ["minifigures_images/njo0013.png", "minifigures_images/njo0310.original.png"],
        locked: false
      },
      {
        name: "Bonezai (Skulkin)",
        info: "The Golden Weapons",
        images: ["minifigures_images/njo0008.original.png"],
        locked: false
      },
      {
        name: "Chopov (Skulkin)",
        info: "The Golden Weapons",
        images: ["minifigures_images/njo0005.png"],
        locked: false
      },
      {
        name: "Frakjaw (Skulkin)",
        info: "Day of the Departed",
        images: ["minifigures_images/njo0244.png"],
        locked: false
      },
      {
        name: "Krazi (Skulkin)",
        infos: ["The Golden Weapons", "Day of the Departed"],
        images: ["minifigures_images/njo0017.original.png", "minifigures_images/njo0247.png"],
        locked: false
      },
      {
        name: "Samukai (Skulkin)",
        info: "The Golden Weapons",
        images: ["minifigures_images/njo0014.png"],
        locked: true
      },
      {
        name: "Ronin",
        info: "Day of the Departed",
        images: ["minifigures_images/njo0246.png"],
        locked: false
      },
      {
        name: "Morro",
        info: "Possession",
        images: ["minifigures_images/njo0158.png"],
        locked: false,
        glow_color: '#03da15ff'
      },
      {
        name: "Chope",
        info: "Tournament of Elements",
        images: ["minifigures_images/njo0138.png"],
        locked: false
      },
      {
        name: "Clouse",
        info: "Tournament of Elements",
        images: ["minifigures_images/njo0112.png"],
        locked: false
      },{
        name: "Chop'rai",
        info: "Tournament of Elements",
        images: ["minifigures_images/njo0113.png"],
        locked: false
      },{
        name: "Chen",
        info: "Tournament of Elements",
        images: ["minifigures_images/njo0126.png"],
        locked: true
      },
      {
        name: "Dummy, Training",
        info: "The Golden Weapons",
        images: ["minifigures_images/gen035.png"],
        locked: false
      }
    ]
  },
  {
    name: "Star Wars",
    cards: [
      {
        name: "Han Solo",
        info: "Celebration",
        images: ["minifigures_images/sw0356.png"],
        locked: false
      },
      {
        name: "Darth Vader",
        info: "",
        images: ["minifigures_images/sw1273.original.png"],
        locked: false,
        glow_color: '#ff0000ff'

      },
      {
        name: "Darth Maul",
        info: "",
        images: ["minifigures_images/sw1415.original.png", "minifigures_images/sw1333.original.png"],
        locked: false,
        glow_color: '#ff0000ff'

      }

    ]
  },
];