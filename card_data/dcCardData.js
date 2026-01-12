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
            image: "sh0151.webp",
            info: "New 52",
            locked: false
          },
          {
            image: "sh0329.webp",
            info: "Lego Batman movie",
            locked: false
          },
          {
            image: "sh0402.webp",
            info: "Wing Suit",
            locked: false
          },
          {
            image: "sh0217.webp",
            info: "Armored Suit",
            locked: false
          },
          {
            image: "sh0146.webp",
            info: "Space Suit",
            locked: false
          }, {
            image: "coltlbm03.webp",
            info: "Fairy Batman",
            locked: false
          },
          {
            image: "sh0786.webp",
            info: "The Batman Movie",
            locked: true
          }
        ]
      },
      {
        name: "Robin - Dick Grayson",
        info: "Lego Batman Movie",
        image: "sh0315.webp"
      },
      {
        name: "Robin - Tim Drake",
        variants: [{
          image: "sh0195.webp",
          info: "New 52",
          locked: false
        }, {
          image: "sh0011.webp",
          info: "Batman 2",
          locked: true
        }]
      },
      {
        name: "Robin - Damian Wayne",
        image: "sh0289.webp",
        locked: [true],
        wantedList: true
      },
      {
        name: "Nightwing",
        image: "sh0659.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "Red Hood",
        image: "sh0282.webp",
        locked: true,
        wantedList: true

      },
      {
        name: "Batgirl",
        variants: [
          {
            image: "sh0305.webp",
            info: "Lego Batman Movie",
            locked: false
          }, {
            image: "sh0658.webp",
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
            image: "sh1055.webp",
            info: "Classic Superman",
            locked: false
          },
          {
            image: "sh0219.webp",
            info: "Down of Justice",
          }
        ]
      },
      {
        name: "Wonder Woman",
        image: "sh0456.webp",
        locked: true
      },
      {
        name: "Aquaman",
        variants: [
          {
            image: "sh0050.original.webp",
            info: "Classic Aquaman",
            locked: true
          },
          {
            image: "colsh03.webp",
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
        image: "sh0145.webp",
        glow_color: '#09ff00ff'
      },
      {
        name: "Green Lantern",
        info: "Guy Gardner",
        image: "tp302.webp",
        glow_color: '#09ff00ff'
      },
      {
        name: "The Flash",
        image: "sh0087.webp",
        locked: true,
        glow_color: '#ffe600ff',
        wantedList: true
      }, {
        name: "Hawkman",
        image: "sh0154.webp",
        locked: true
      },
      {
        name: "Hawkgirl",
        variants: [{
          info: "Justice Gang",
          image: "tp301.webp",
        }, {
          info: "Classic",
          image: "sh0461.webp",
          locked: true,
        }]
      },
      {
        name: "Cyborg",
        image: "sh0155.webp",
        locked: true
      },
      {
        name: "Martian ManHunter",
        image: "sh0158.webp",
        locked: true
      },
      // Other heroes
      {
        name: "Supergirl",
        image: "sh0670.webp",
        locked: true
      },
      {
        name: "Bizarro",
        image: "sh0043.webp",
        locked: true
      },
      // Bat-Villains
      {
        name: "The Joker",
        variants: [{
          image: "dim017.webp",
        }, {
          info: "Lego Batman Movie",
          image: "sh0353.webp"
        }]
      },
      {
        name: "Harley Quinn",
        image: "sh0024.webp",
      },
      {
        name: "Scarecrow",
        info: "Lego Batman Movie",
        image: "sh0391.webp",
      },
      {
        name: "Two Face",
        image: "sh0007.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "Poison Ivy",
        image: "sh0327.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "The Penguin",
        image: "sh0314.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "Catwoman",
        locked: [false, true],
        variants: [{
          info: "Lego Batman Movie",
          image: "sh0330.webp",
          locked: false
        }, {
          info: "",
          image: "sh0595.webp",
          locked: true
        }]
      },
      {
        name: "Mr Freeze",
        image: "sh0049.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "Killer Crock",
        locked: true
      },
      {
        name: "Bane",
        image: "sh0009.webp",
        locked: true,
        wantedList: true
      },
      {
        name: "The Riddler",
        variants: [{
          image: "sh1081.webp",
          locked: false
        }, {
          image: "sh0593.webp",
          locked: true
        }]
      },
      {
        name: "Sinestro",
        image: "sh0144.webp",
        glow_color: '#ffe600ff'
      },
      {
        name: "Condiment King",
        image: "sh0488.original.webp",
        locked: true
      },
      {
        name: "Deathstroke",
        image: "sh0194.webp",
      },
      {
        name: "Black Manta",
        image: "sh0526.webp",
        locked: true
      },
      {
        name: "Lex Luthor",
        variants: [
          {
            info: "Black suit",
            image: "sh0012.webp",
            locked: true
          },
          {
            info: "Power Armor",
            image: "sh1007.webp",
            locked: true
          }
        ]
      },
      {
        name: "Metamorpho",
        image: "colsh12.webp",
        locked: true
      },
      {
        name: "Superboy",
        image: "sh0143.webp",
        locked: true
      },
      {
        name: "Flash - Jay Garrick",
        image: "colsh15.webp",
        locked: true
      },
      {
        name: "Reverse Flash",
        image: "sh0471.webp",
        locked: true
      },
      {
        name: "Captain Cold",
        image: "sh0148.webp",
        locked: true
      },
      {
        name: "Commissioner Gordon",
        variants: [
          {
            image: "sh0591.webp",
            locked: true
          },
          {
            info: "Lego Batman Movie",
            image: "coltlbm07.webp",
            locked: true
          },
          {
            info: "The Dark Knight Triology",
            image: "sh0063.webp",
            locked: true
          }
        ],
        wantedList: true
      },
      {
        name: "Alfred Pennyworth",
        info: "Lego Batman Movie",
        image: "sh0313.webp",
        locked: [true],
        wantedList: true
      }

    ]
  },
];