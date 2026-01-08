export const dcGroups = [
  {
    name: "DC Comics",
    cards: [
      // Main bat-family
      {
        name: "Batman",
        currentIndex: 0,
        variants: [
          {
            image: "sh0151.png",
            info: "New 52",
            locked: false
          },
          {
            image: "sh0329.png",
            info: "Lego Batman movie",
            locked: false
          },
          {
            image: "sh0402.png",
            info: "Wing Suit",
            locked: false
          },
          {
            image: "sh0217.png",
            info: "Armored Suit",
            locked: false
          },
          {
            image: "sh0146.png",
            info: "Space Suit",
            locked: false
          }, {
            image: "coltlbm03.png",
            info: "Fairy Batman",
            locked: false
          },
          {
            image: "sh0786.png",
            info: "The Batman Movie",
            locked: true
          }
        ]
      },
      {
        name: "Robin - Dick Grayson",
        info: "Lego Batman Movie",
        image: "sh0315.png"
      },
      {
        name: "Robin - Tim Drake",
        variants: [{
          image: "sh0195.jpg",
          info: "New 52",
          locked: false
        }, {
          image: "sh0011.png",
          info: "Batman 2",
          locked: true
        }]
      },
      {
        name: "Robin - Damian Wayne",
        image: "sh0289.png",
        locked: [true],
        wantedList: true
      },
      {
        name: "Nightwing",
        image: "sh0659.png",
        locked: true,
        wantedList: true
      },
      {
        name: "Red Hood",
        image: "sh0282.png",
        locked: true,
        wantedList: true

      },
      {
        name: "Batgirl",
        variants: [
          {
            image: "sh0305.png",
            info: "Lego Batman Movie",
            locked: false
          }, {
            image: "sh0658.png",
            info: "Rebirth",
            locked: true
          }
        ]
      },
      // Justice League
      {
        name: "Superman",
        variants: [
          {
            image: "sh1055.png",
            info: "Classic Superman",
            locked: false
          },
          {
            image: "sh0219.png",
            info: "Down of Justice",
            locked: true
          }
        ]
      },
      {
        name: "Wonder Woman",
        image: "sh0456.png",
        locked: true
      },
      {
        name: "Aquaman",
        variants: [
          {
            image: "sh0050.original.png",
            info: "Classic Aquaman",
            locked: true
          },
          {
            image: "colsh03.png",
            info: "Aquaman: The New 52",
            locked: true
          }
        ],
        locked: true,
        wantedList: true
      },
      {
        name: "Green Lantern",
        info: "Hal Jordan",
        image: "sh0145.png",
        glow_color: '#09ff00ff'
      },
      {
        name: "The Flash",
        image: "sh0087.png",
        locked: true,
        glow_color: '#ffe600ff',
        wantedList: true
      }, {
        name: "Hawkman",
        image: "sh0154.png",
        locked: true
      },
      {
        name: "Hawkgirl",
        image: "sh0461.png",
        locked: true
      },
      {
        name: "Cyborg",
        image: "sh0155.png",
        locked: true
      },
      {
        name: "Martian ManHunter",
        image: "sh0158.png",
        locked: true
      },
      // Other heroes
      {
        name: "Supergirl",
        image: "sh0670.png",
        locked: true
      },
      {
        name: "Bizarro",
        image: "sh0043.png",
        locked: true
      },
      // Bat-Villains
      {
        name: "The Joker",
        variants: [{
          image: "dim017.png",
        }, {
          info: "Lego Batman Movie",
          image: "sh0353.png"
        }]
      },
      {
        name: "Harley Quinn",
        image: "sh0024.png",
      },
      {
        name: "Scarecrow",
        info: "Lego Batman Movie",
        image: "sh0391.png",
      },
      {
        name: "Two Face",
        image: "sh0007.png",
        locked: true,
        wantedList: true
      },
      {
        name: "Poison Ivy",
        image: "sh0327.png",
        locked: true,
        wantedList: true
      },
      {
        name: "The Penguin",
        image: "sh0314.png",
        locked: true,
        wantedList: true
      },
      {
        name: "Catwoman",
        locked: [false, true],
        variants: [{
          info: "Lego Batman Movie",
          image: "sh0330.png",
          locked: false
        }, {
          info: "",
          image: "sh0595.png",
          locked: true
        }]
      },
      {
        name: "Mr Freeze",
        image: "sh0049.png",
        locked: true,
        wantedList: true
      },
      {
        name: "Killer Crock",
        locked: true
      },
      {
        name: "Bane",
        image: "sh0009.png",
        locked: true,
        wantedList: true
      },
      {
        name: "The Riddler",
        variants: [{
          image: "sh1081.jpg",
          locked: false
        }, {
          image: "sh0593.png",
          locked: true
        }]
      },
      {
        name: "Sinestro",
        image: "sh0144.png",
        glow_color: '#ffe600ff'
      },
      {
        name: "Condiment King",
        image: "sh0488.original.png",
        locked: true,
        wantedList: true
      },
      {
        name: "Deathstroke",
        image: "sh0194.jpg",
      },
      {
        name: "Black Manta",
        image: "sh0526.png",
        locked: true
      },
      {
        name: "Lex Luthor",
        variants: [
          {
            info: "Black suit",
            image: "sh0012.png",
            locked: true
          },
          {
            info: "Power Armor",
            image: "sh1007.png",
            locked: true
          }
        ]
      },
      {
        name: "Metamorpho",
        image: "colsh12.png",
        locked: true
      },
      {
        name: "Superboy",
        image: "sh0143.png",
        locked: true
      },
      {
        name: "Flash - Jay Garrick",
        image: "colsh15.png",
        locked: true
      },
      {
        name: "Reverse Flash",
        image: "sh0471.png",
        locked: true
      },
      {
        name: "Captain Cold",
        image: "sh0148.png",
        locked: true
      },
      {
        name: "Commissioner Gordon",
        variants: [
          {
            image: "sh0591.png",
            locked: true
          },
          {
            info: "Lego Batman Movie",
            image: "coltlbm07.png",
            locked: true
          },
          {
            info: "The Dark Knight Triology",
            image: "sh0063.png",
            locked: true
          }
        ],
        wantedList: true
      },
      {
        name: "Alfred Pennyworth",
        info: "Lego Batman Movie",
        image: "sh0313.png",
        locked: [true],
        wantedList: true
      }

    ]
  },
];