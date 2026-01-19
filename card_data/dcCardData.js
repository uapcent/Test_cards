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
            image: "sh0151",
            info: "New 52",
            locked: false
          },
          {
            image: "sh0329",
            info: "Lego Batman movie",
            locked: false
          },
          {
            image: "sh0402",
            info: "Wing Suit",
            locked: false
          },
          {
            image: "sh0217",
            info: "Armored Suit",
            locked: false
          },
          {
            image: "sh0146",
            info: "Space Suit",
            locked: false
          }, {
            image: "coltlbm03",
            info: "Fairy Batman",
            locked: false
          },
          {
            image: "sh0786",
            info: "The Batman Movie",
            locked: true
          }
        ]
      },
      {
        name: "Robin - Dick Grayson",
        info: "Lego Batman Movie",
        image: "sh0315"
      },
      {
        name: "Robin - Tim Drake",
        variants: [{
          image: "sh0195",
          info: "New 52",
          locked: false
        }, {
          image: "sh0011",
          info: "Batman 2",
          locked: true
        }]
      },
      {
        name: "Robin - Damian Wayne",
        image: "sh0289",
        locked: [true],
        wantedList: true
      },
      {
        name: "Nightwing",
        image: "sh0659",
        locked: true,
        wantedList: true
      },
      {
        name: "Red Hood",
        image: "sh0282",
        locked: true,
        wantedList: true

      },
      {
        name: "Batgirl",
        variants: [
          {
            image: "sh0305",
            info: "Lego Batman Movie",
            locked: false
          }, {
            image: "sh0658",
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
            image: "sh1055",
            info: "Classic Superman",
            locked: false
          },
          {
            image: "sh0219",
            info: "Down of Justice",
          }
        ]
      },
      {
        name: "Wonder Woman",
        image: "sh0456",
        locked: true
      },
      {
        name: "Aquaman",
        variants: [
          {
            image: "sh0050",
            info: "Classic Aquaman",
            locked: true
          },
          {
            image: "colsh03",
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
        image: "sh0145",
        glow_color: '#09ff00ff'
      },
      {
        name: "Green Lantern",
        info: "Guy Gardner",
        image: "tp302",
        glow_color: '#09ff00ff',
        defective: true
      },
      {
        name: "The Flash",
        image: "sh0087",
        locked: true,
        glow_color: '#ffe600ff',
        wantedList: true
      }, {
        name: "Hawkman",
        image: "sh0154",
        locked: true
      },
      {
        name: "Hawkgirl",
        variants: [{
          info: "Justice Gang",
          image: "tp301",
          defective: true
        }, {
          info: "Classic",
          image: "sh0461",
          locked: true,
        }]
      },
      {
        name: "Cyborg",
        image: "sh0155",
        locked: true
      },
      {
        name: "Martian ManHunter",
        image: "sh0158",
        locked: true
      },
      // Other heroes
      {
        name: "Supergirl",
        image: "sh0670",
        locked: true
      },
      {
        name: "Superboy",
        image: "sh0143",
        locked: true
      },
      {
        name: "Flash - Jay Garrick",
        image: "colsh15",
        locked: true
      },
      // Bat-Villains
      {
        name: "The Joker",
        variants: [{
          image: "dim017",
        }, {
          info: "Lego Batman Movie",
          image: "sh0353"
        }]
      },
      {
        name: "Harley Quinn",
        image: "sh0024",
      },
      {
        name: "Scarecrow",
        info: "Lego Batman Movie",
        image: "sh0391",
      },
      {
        name: "Two Face",
        image: "sh0007",
        locked: true,
        wantedList: true
      },
      {
        name: "Poison Ivy",
        image: "sh0327",
        locked: true,
        wantedList: true
      },
      {
        name: "The Penguin",
        variants: [{
          info: "Lego Batman Movie",
          image: "sh0314",
          locked: true,
          wantedList: true
        }]
      },
      {
        name: "Catwoman",
        locked: [false, true],
        variants: [{
          info: "Lego Batman Movie",
          image: "sh0330",
          locked: false
        }, {
          image: "sh0595",
          locked: true
        }]
      },
      {
        name: "Mr Freeze",
        image: "sh0049",
        locked: true,
        wantedList: true
      },
      {
        name: "Killer Crock",
        locked: true
      },
      {
        name: "Bane",
        image: "sh0009",
        locked: true,
        wantedList: true
      },
      {
        name: "The Riddler",
        variants: [{
          image: "sh1081",
          locked: false
        }, {
          image: "sh0593",
          locked: true
        }]
      },
      {
        name: "Sinestro",
        image: "sh0144",
        glow_color: '#ffe600ff'
      },
      {
        name: "Condiment King",
        image: "sh0488",
        locked: true,
        wantedList: true
      },
      {
        name: "Deathstroke",
        image: "sh0194",
      },
      {
        name: "Black Manta",
        image: "sh0526",
        locked: true
      },
      {
        name: "Lex Luthor",
        variants: [
          {
            info: "Black suit",
            image: "sh0012",
            locked: true
          },
          {
            info: "Power Armor",
            image: "sh1007",
            locked: true,
            wantedList: true
          }
        ]
      },
      {
        name: "Bizarro",
        image: "sh0043",
        locked: true
      },
      {
        name: "Metamorpho",
        image: "colsh12",
        locked: true
      },
      {
        name: "Reverse Flash",
        image: "sh0471",
        locked: true
      },
      {
        name: "Captain Cold",
        image: "sh0148",
        locked: true
      },
      {
        name: "Commissioner Gordon",
        variants: [
          {
            image: "sh0591",
            locked: true,
            wantedList: true

          },
          {
            info: "Lego Batman Movie",
            image: "coltlbm07",
            locked: true,
            wantedList: true

          },
          {
            info: "The Dark Knight Triology",
            image: "sh0063",
            locked: true,
            wantedList: true

          }
        ],
      },
      {
        name: "Alfred Pennyworth",
        info: "Lego Batman Movie",
        image: "sh0313",
        locked: true,
        wantedList: true
      }

    ]
  },
];