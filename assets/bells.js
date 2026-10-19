/* ---- Bells of the World: hanging bells on strings, soft opt-in sound, collectible stamp cards ----
   String physics: a small Verlet rope simulation written for this page (the classic Jakobsen-style
   technique). It only runs after Ahaan rings or drags a bell, settles, then stops: no idle motion.
   Facts use rounded "about" numbers; verify the marked ones before sharing widely. */
(function () {
  const BELLS = [
  {
    "id": "japan",
    "name": "Japan",
    "flag": "🇯🇵",
    "bell": "Bonshō",
    "shape": "bonsho",
    "c": "#5f7d6a",
    "cd": "#3d5547",
    "word": "鐘",
    "wordLang": "ja",
    "say": "kane",
    "tone": {
      "f": 110,
      "decay": 3.8,
      "peak": 0.11,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.76,
          0.35,
          0.6
        ],
        [
          4.07,
          0.15,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Bonshō (temple bell)"
      ],
      [
        "Made of",
        "Bronze"
      ],
      [
        "Rung by",
        "Swinging a wooden log against the outside"
      ],
      [
        "Famous one",
        "Chion-in temple, Kyoto: about 70 tonnes"
      ]
    ],
    "facts": [
      [
        "🎍",
        "On New Year's Eve, temples ring their big bell 108 times."
      ],
      [
        "🪵",
        "A bonshō has no clapper inside. It is struck from the outside."
      ],
      [
        "〰️",
        "Its deep hum keeps sounding long after a single strike."
      ]
    ],
    "listen": "A very deep, slow hum."
  },
  {
    "id": "china",
    "name": "China",
    "flag": "🇨🇳",
    "bell": "Bianzhong",
    "shape": "bianzhong",
    "c": "#b08a3e",
    "cd": "#7a5c22",
    "word": "钟",
    "wordLang": "zh",
    "say": "zhōng",
    "tone": {
      "f": 392,
      "decay": 2,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.4,
          0.4,
          0.6
        ],
        [
          3.9,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Bianzhong (a set of tuned bells)"
      ],
      [
        "Made of",
        "Bronze"
      ],
      [
        "Rung by",
        "Tapping with wooden mallets"
      ],
      [
        "Famous one",
        "Marquis Yi's set: 65 bells, about 2,400 years old"
      ]
    ],
    "facts": [
      [
        "🎵",
        "Each of those ancient bells plays two different notes, depending on where you tap it."
      ],
      [
        "🔔",
        "The Yongle Bell in Beijing weighs about 46 tonnes."
      ],
      [
        "✍️",
        "The Yongle Bell is covered in more than 200,000 written characters."
      ]
    ],
    "listen": "A bright, clear note."
  },
  {
    "id": "india",
    "name": "India",
    "flag": "🇮🇳",
    "bell": "Ghanta",
    "shape": "ghanta",
    "c": "#c99a2e",
    "cd": "#8a6510",
    "word": "घंटा",
    "wordLang": "hi",
    "say": "ghaṇṭā",
    "tone": {
      "f": 880,
      "decay": 2.6,
      "peak": 0.07,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.76,
          0.3,
          0.6
        ],
        [
          5.4,
          0.12,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Ghanta (temple bell)"
      ],
      [
        "Made of",
        "Bell metal (copper and tin) or brass"
      ],
      [
        "Rung by",
        "Pulling the clapper by hand"
      ],
      [
        "Where",
        "At the doorway of many temples"
      ]
    ],
    "facts": [
      [
        "🛕",
        "People often ring the temple bell when they arrive."
      ],
      [
        "🪔",
        "A small hand bell is rung during aarti, a prayer with lamps."
      ],
      [
        "🧪",
        "Bell metal is a mix of copper and tin."
      ]
    ],
    "listen": "A ringing, shimmering note."
  },
  {
    "id": "kazakhstan",
    "name": "Kazakhstan",
    "flag": "🇰🇿",
    "bell": "Qońyraw",
    "shape": "handbell",
    "c": "#d4a43a",
    "cd": "#2f6fb2",
    "word": "қоңырау",
    "wordLang": "kk",
    "say": "qoñyrau",
    "tone": {
      "f": 1046.5,
      "decay": 1.1,
      "peak": 0.06,
      "repeat": 3,
      "gap": 0.13,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.25,
          0.5
        ],
        [
          3,
          0.12,
          0.3
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Qońyraw (hand bell)"
      ],
      [
        "Made of",
        "Metal, often brass"
      ],
      [
        "Rung by",
        "Shaking it by the handle"
      ],
      [
        "Famous moment",
        "The school Last Bell day"
      ]
    ],
    "facts": [
      [
        "🎒",
        "On the first day of school, a First Bell is rung to welcome the year."
      ],
      [
        "🎓",
        "At the Last Bell ceremony, a young pupil rings a hand bell, often riding on an older student's shoulder."
      ],
      [
        "🐫",
        "Long ago, Silk Road camel caravans crossed this land, and camels often wore bells."
      ]
    ],
    "listen": "A quick, happy jingle."
  },
  {
    "id": "kenya",
    "name": "Kenya",
    "flag": "🇰🇪",
    "bell": "Kengele",
    "shape": "cowbell",
    "c": "#7a6a58",
    "cd": "#4a3e33",
    "word": "kengele",
    "wordLang": "sw",
    "say": "ken-GEH-leh",
    "tone": {
      "f": 523.25,
      "decay": 0.7,
      "peak": 0.08,
      "repeat": 2,
      "gap": 0.35,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.5,
          0.5,
          0.7
        ],
        [
          2.3,
          0.3,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Kengele"
      ],
      [
        "Made of",
        "Iron or other metal"
      ],
      [
        "Rung by",
        "Animals walking, or dancers moving"
      ],
      [
        "Used for",
        "Hearing where the herd is"
      ]
    ],
    "facts": [
      [
        "🐄",
        "Herders hang bells on cattle and goats so they can hear the herd, even out of sight."
      ],
      [
        "💃",
        "Some dancers wear small ankle bells that jingle with every step."
      ],
      [
        "🗣️",
        "Kengele is the Swahili word for bell."
      ]
    ],
    "listen": "A short, clanky clonk."
  },
  {
    "id": "italy",
    "name": "Italy",
    "flag": "🇮🇹",
    "bell": "Campana",
    "shape": "campana",
    "c": "#9a6a3a",
    "cd": "#5e3d1c",
    "word": "campana",
    "wordLang": "it",
    "say": "cam-PAH-na",
    "tone": {
      "f": 196,
      "decay": 3.6,
      "peak": 0.1,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.4,
          0.35,
          0.7
        ],
        [
          3,
          0.25,
          0.5
        ],
        [
          4,
          0.12,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Campana (church bell)"
      ],
      [
        "Made of",
        "Bronze"
      ],
      [
        "Rung by",
        "Swinging it in a bell tower"
      ],
      [
        "Famous tower",
        "Leaning Tower of Pisa: 7 bells"
      ]
    ],
    "facts": [
      [
        "🗼",
        "The Leaning Tower of Pisa is really a bell tower, with seven bells."
      ],
      [
        "📏",
        "St Mark's bell tower in Venice is about 99 metres tall."
      ],
      [
        "🏭",
        "In the town of Agnone, one family foundry has made bells for many hundreds of years."
      ]
    ],
    "listen": "A big, round dong."
  },
  {
    "id": "united-kingdom",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "bell": "Big Ben",
    "shape": "campana",
    "c": "#3c6382",
    "cd": "#1e374d",
    "word": "bell",
    "wordLang": "en",
    "say": "bel",
    "tone": {
      "f": 174.61,
      "decay": 4.2,
      "peak": 0.12,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.4,
          0.35,
          0.7
        ],
        [
          3.2,
          0.2,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "The Great Bell (Big Ben)"
      ],
      [
        "Made of",
        "Bronze (tin and copper)"
      ],
      [
        "Rung by",
        "A 200 kg mechanical hammer striking the outside"
      ],
      [
        "Weight",
        "13.7 tonnes"
      ]
    ],
    "facts": [
      [
        "🕰️",
        "Big Ben strikes the hour of E natural inside the famous Elizabeth Tower."
      ],
      [
        "📻",
        "BBC radio has broadcast the live chimes of Big Ben since 1923."
      ],
      [
        "🔨",
        "A slight crack in 1859 gave Big Ben its distinct, beloved chime."
      ]
    ],
    "listen": "A resonant, majestic gong."
  },
  {
    "id": "france",
    "name": "France",
    "flag": "🇫🇷",
    "bell": "Emmanuel",
    "shape": "campana",
    "c": "#345f9e",
    "cd": "#1b3863",
    "word": "cloche",
    "wordLang": "fr",
    "say": "clohsh",
    "tone": {
      "f": 146.83,
      "decay": 4.5,
      "peak": 0.12,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.55,
          0.85
        ],
        [
          2.8,
          0.3,
          0.6
        ],
        [
          4.1,
          0.15,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Bourdon Emmanuel (Notre-Dame)"
      ],
      [
        "Made of",
        "Bronze, cast in 1686"
      ],
      [
        "Where",
        "South Tower of Notre-Dame de Paris"
      ],
      [
        "Weight",
        "about 13 tonnes"
      ]
    ],
    "facts": [
      [
        "⛪",
        "Emmanuel is the largest and oldest surviving bell of Notre-Dame Cathedral."
      ],
      [
        "🔔",
        "It rings on major holidays, victories, and historic French commemorations."
      ],
      [
        "🎵",
        "Its sound is tuned to a deep, resonant F sharp."
      ]
    ],
    "listen": "A rich, velvety Cathedral chime."
  },
  {
    "id": "united-states",
    "name": "United States",
    "flag": "🇺🇸",
    "bell": "Liberty Bell",
    "shape": "campana",
    "c": "#9c5a32",
    "cd": "#572d14",
    "word": "bell",
    "wordLang": "en",
    "say": "bel",
    "tone": {
      "f": 293.66,
      "decay": 2.2,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.2,
          0.4,
          0.6
        ],
        [
          3.5,
          0.18,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "The Liberty Bell"
      ],
      [
        "Made of",
        "Bronze (70% copper, 25% tin)"
      ],
      [
        "Where",
        "Independence National Historical Park, Philadelphia"
      ],
      [
        "Inscription",
        "“Proclaim Liberty Throughout All the Land”"
      ]
    ],
    "facts": [
      [
        "🇺🇸",
        "Rung in July 1776 to gather citizens for the reading of the Declaration of Independence."
      ],
      [
        "⚡",
        "It developed a famous crack in the 1840s, so it is tapped gently with a mallet today."
      ],
      [
        "🕊️",
        "A symbol of freedom and civil rights around the world."
      ]
    ],
    "listen": "A warm, historic brass ring."
  },
  {
    "id": "mexico",
    "name": "Mexico",
    "flag": "🇲🇽",
    "bell": "Dolores",
    "shape": "campana",
    "c": "#b34d2e",
    "cd": "#6e2916",
    "word": "campana",
    "wordLang": "es",
    "say": "cam-PAH-nah",
    "tone": {
      "f": 329.63,
      "decay": 2.8,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.45,
          0.7
        ],
        [
          3,
          0.22,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Campana de Dolores"
      ],
      [
        "Made of",
        "Bronze"
      ],
      [
        "History",
        "Rung by Miguel Hidalgo in 1810"
      ],
      [
        "Location",
        "National Palace balcony, Mexico City"
      ]
    ],
    "facts": [
      [
        "🇲🇽",
        "Every September 15, the President of Mexico rings this bell for El Grito."
      ],
      [
        "🔔",
        "The original bell hung in the church tower of Dolores Hidalgo."
      ],
      [
        "🎉",
        "Its ringing signals Mexican Independence Day celebrations across the nation."
      ]
    ],
    "listen": "A bold, festive church chime."
  },
  {
    "id": "thailand",
    "name": "Thailand",
    "flag": "🇹🇭",
    "bell": "Rakhang",
    "shape": "ghanta",
    "c": "#d4a428",
    "cd": "#7a5a0c",
    "word": "ระฆัง",
    "wordLang": "th",
    "say": "ra-khang",
    "tone": {
      "f": 783.99,
      "decay": 3.1,
      "peak": 0.08,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.5,
          0.35,
          0.6
        ],
        [
          4.2,
          0.15,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Rakhang (temple hanging bell)"
      ],
      [
        "Made of",
        "Cast brass and bronze"
      ],
      [
        "Where",
        "Wat Rakhang and temples across Bangkok"
      ],
      [
        "Rung by",
        "A wooden mallet by visiting pilgrims"
      ]
    ],
    "facts": [
      [
        "🛕",
        "Temple bells are rung three times for luck, mindfulness, and good wishes."
      ],
      [
        "🍃",
        "Many smaller brass bells hang from pagoda roofs with leaf-shaped wind-catchers."
      ],
      [
        "🇹🇭",
        "Wat Rakhang Khositaram is named after an ancient golden bell unearthed there."
      ]
    ],
    "listen": "A shimmering, bright temple chime."
  },
  {
    "id": "south-korea",
    "name": "South Korea",
    "flag": "🇰🇷",
    "bell": "Emile Bell",
    "shape": "bonsho",
    "c": "#486b7a",
    "cd": "#284450",
    "word": "종",
    "wordLang": "ko",
    "say": "jong",
    "tone": {
      "f": 130.81,
      "decay": 4.8,
      "peak": 0.12,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.6,
          0.9
        ],
        [
          2.85,
          0.4,
          0.7
        ],
        [
          3.9,
          0.18,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Divine Bell of King Seongdeok (Emile Bell)"
      ],
      [
        "Cast in",
        "771 AD (Silla Kingdom)"
      ],
      [
        "Where",
        "Gyeongju National Museum"
      ],
      [
        "Weight",
        "about 19 tonnes"
      ]
    ],
    "facts": [
      [
        "👑",
        "One of the greatest bronze masterpieces of East Asian antiquity."
      ],
      [
        "💨",
        "It features an acoustic sound pipe on top that makes its hum echo for miles."
      ],
      [
        "🕊️",
        "Carved with elegant flying heavenly apsaras holding incense burners."
      ]
    ],
    "listen": "A haunting, deep Buddhist echo."
  },
  {
    "id": "myanmar",
    "name": "Myanmar",
    "flag": "🇲🇲",
    "bell": "Mingun",
    "shape": "bonsho",
    "c": "#b38827",
    "cd": "#63480a",
    "tone": {
      "f": 98,
      "decay": 5.2,
      "peak": 0.13,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.8,
          0.6,
          0.85
        ],
        [
          2.6,
          0.4,
          0.6
        ],
        [
          3.5,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Mingun Bell"
      ],
      [
        "Cast in",
        "1808"
      ],
      [
        "Where",
        "Mingun, Sagaing Region"
      ],
      [
        "Weight",
        "about 90 tonnes"
      ]
    ],
    "word": "ခေါင်းလောင်း",
    "wordLang": "my",
    "say": "khaung-laung",
    "facts": [
      [
        "⚖️",
        "For centuries, the Mingun Bell was the world’s heaviest functioning bell."
      ],
      [
        "🚶",
        "The bell is so enormous that children can stand upright inside it."
      ],
      [
        "🪵",
        "Struck gently on the exterior rim with a heavy hardwood striker."
      ]
    ],
    "listen": "An earth-shaking, rumbling hum."
  },
  {
    "id": "greece",
    "name": "Greece",
    "flag": "🇬🇷",
    "bell": "Kampana",
    "shape": "campana",
    "c": "#20689e",
    "cd": "#0f3e61",
    "word": "καμπάνα",
    "wordLang": "el",
    "say": "kam-PAH-nah",
    "tone": {
      "f": 440,
      "decay": 3.2,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.05,
          0.45,
          0.7
        ],
        [
          3.1,
          0.2,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Island Kampana"
      ],
      [
        "Where",
        "Blue-domed churches of Santorini and Mount Athos"
      ],
      [
        "Rung by",
        "Pulling long hemp ropes tied to swinging clappers"
      ],
      [
        "Material",
        "Bronze alloy"
      ]
    ],
    "facts": [
      [
        "🌊",
        "Bells ring across whitewashed cliffside villages over the Aegean Sea."
      ],
      [
        "⛵",
        "In ancient times, bells on island watchtowers warned sailors of squalls."
      ],
      [
        "⛪",
        "Mount Athos has bell towers that ring antiphonal rhythms for morning prayers."
      ]
    ],
    "listen": "A sunny, resonant island chime."
  },
  {
    "id": "russia",
    "name": "Russia",
    "flag": "🇷🇺",
    "bell": "Tsar Bell",
    "shape": "campana",
    "c": "#8c6534",
    "cd": "#4d3416",
    "word": "колокол",
    "wordLang": "ru",
    "say": "KO-lo-kol",
    "tone": {
      "f": 123.47,
      "decay": 4.6,
      "peak": 0.11,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.9,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Tsar Bell (Tsar Kolokol)"
      ],
      [
        "Weight",
        "over 200 tonnes"
      ],
      [
        "Where",
        "Moscow Kremlin square"
      ],
      [
        "Height",
        "over 6 metres tall"
      ]
    ],
    "facts": [
      [
        "👑",
        "The largest bell ever cast in history; it was made in 1735."
      ],
      [
        "💔",
        "During a palace fire, cold water cracked an 11-tonne slab off its side."
      ],
      [
        "🔔",
        "Russia is famous for 'zvon' bell ringing: playing complex polyphonic bell melodies."
      ]
    ],
    "listen": "A monumental, grand thunder."
  },
  {
    "id": "switzerland",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "bell": "Treichel",
    "shape": "cowbell",
    "c": "#a33636",
    "cd": "#571616",
    "word": "Schelle",
    "wordLang": "de",
    "say": "SHEH-luh",
    "tone": {
      "f": 261.63,
      "decay": 1.4,
      "peak": 0.1,
      "repeat": 2,
      "gap": 0.28,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.6,
          0.4,
          0.6
        ],
        [
          2.4,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Alpine Treichel & Schelle"
      ],
      [
        "Made of",
        "Hammered sheet bronze or cast brass"
      ],
      [
        "Worn by",
        "Simmental cows on Swiss alpine pastures"
      ],
      [
        "Festival",
        "Alpabzug (autumn cattle descent)"
      ]
    ],
    "facts": [
      [
        "🏔️",
        "The melodic clinking of cowbells echoes across high green Alpine meadows."
      ],
      [
        "👑",
        "The prize cow leads the parade wearing the largest, most ornate embroidered collar."
      ],
      [
        "🧀",
        "Farmers recognize individual cows from afar purely by the pitch of their bell."
      ]
    ],
    "listen": "A warm, hollow Alpine clank."
  },
  {
    "id": "austria",
    "name": "Austria",
    "flag": "🇦🇹",
    "bell": "Pummerin",
    "shape": "campana",
    "c": "#874e30",
    "cd": "#4f2b18",
    "word": "Glocke",
    "wordLang": "de",
    "say": "GLAW-kuh",
    "tone": {
      "f": 164.81,
      "decay": 4.4,
      "peak": 0.11,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.7,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Die Pummerin"
      ],
      [
        "Where",
        "St. Stephen's Cathedral (Stephansdom), Vienna"
      ],
      [
        "Weight",
        "over 20 tonnes"
      ],
      [
        "Cast from",
        "Captured historical cannon metal in 1711"
      ]
    ],
    "facts": [
      [
        "🎆",
        "Pummerin rings out live across Austrian television and radio at midnight every New Year."
      ],
      [
        "🏛️",
        "It is the third-largest church bell in Western and Central Europe."
      ],
      [
        "🎻",
        "Vienna is famous as the world capital of classical music and carillons."
      ]
    ],
    "listen": "A deep, majestic Viennese toll."
  },
  {
    "id": "spain",
    "name": "Spain",
    "flag": "🇪🇸",
    "bell": "Campana de la Vela",
    "shape": "campana",
    "c": "#a84b2c",
    "cd": "#5c2412",
    "word": "campana",
    "wordLang": "es",
    "say": "cam-PAH-nah",
    "tone": {
      "f": 349.23,
      "decay": 3,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.4,
          0.7
        ],
        [
          3.2,
          0.18,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Campana de la Vela"
      ],
      [
        "Where",
        "Torre de la Vela, the Alhambra in Granada"
      ],
      [
        "History",
        "Rung for centuries to manage irrigation in the Vega"
      ],
      [
        "Tradition",
        "Young people ring it on January 2 for good luck"
      ]
    ],
    "facts": [
      [
        "🏰",
        "The bell sits atop the highest defensive watchtower of the Moorish Alhambra palace."
      ],
      [
        "🌾",
        "Its chimes told farmers when to open and close their river water gates."
      ],
      [
        "☀️",
        "Heard clearly across the historic Albayzín quarter below."
      ]
    ],
    "listen": "A bright, clear Spanish tower ring."
  },
  {
    "id": "germany",
    "name": "Germany",
    "flag": "🇩🇪",
    "bell": "Petersglocke",
    "shape": "campana",
    "c": "#6e5330",
    "cd": "#3d2d18",
    "word": "Glocke",
    "wordLang": "de",
    "say": "GLAW-kuh",
    "tone": {
      "f": 130.81,
      "decay": 4.6,
      "peak": 0.12,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.55,
          0.85
        ],
        [
          2.8,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "St. Petersglocke ('Dicker Pitter')"
      ],
      [
        "Where",
        "Cologne Cathedral (Kölner Dom)"
      ],
      [
        "Weight",
        "about 24 tonnes"
      ],
      [
        "Note",
        "Low C (C2)"
      ]
    ],
    "facts": [
      [
        "🏰",
        "It is the largest free-swinging bell in the world hung on a straight yoke."
      ],
      [
        "⭐",
        "Cast in 1923 by master bellfounder Heinrich Ulrich."
      ],
      [
        "🔔",
        "Rung only on high holy days and moments of great national celebration."
      ]
    ],
    "listen": "An imposing, deep cathedral rumble."
  },
  {
    "id": "nepal",
    "name": "Nepal",
    "flag": "🇳🇵",
    "bell": "Bajra Ghanta",
    "shape": "ghanta",
    "c": "#b87c28",
    "cd": "#66420f",
    "word": "घण्टी",
    "wordLang": "ne",
    "say": "ghan-tee",
    "tone": {
      "f": 987.77,
      "decay": 2.8,
      "peak": 0.07,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.76,
          0.3,
          0.6
        ],
        [
          5.2,
          0.1,
          0.3
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Taleju Temple Bell & Bajra Ghanta"
      ],
      [
        "Where",
        "Kathmandu Durbar Square and Swayambhunath"
      ],
      [
        "Material",
        "Ashtadhatu (eight sacred metals)"
      ],
      [
        "Ritual",
        "Held in the left hand with the dorje in the right"
      ]
    ],
    "facts": [
      [
        "🏔️",
        "Temple bells in the Kathmandu Valley are cast with Newar metalcraft."
      ],
      [
        "🕊️",
        "Prayer wheels and bells ring together as gentle breezes blow down from the Himalayas."
      ],
      [
        "✨",
        "Ashtadhatu alloy blends gold, silver, copper, zinc, tin, iron, lead, and mercury."
      ]
    ],
    "listen": "A crystal, singing mountain tone."
  },
  {
    "id": "tibet",
    "name": "Tibet",
    "flag": "🏔️",
    "bell": "Tingsha",
    "shape": "bianzhong",
    "c": "#9e7938",
    "cd": "#523c14",
    "word": "ཏིང་ཤགས",
    "wordLang": "bo",
    "say": "ting-sha",
    "tone": {
      "f": 1174.66,
      "decay": 3.6,
      "peak": 0.06,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.2,
          0.25,
          0.5
        ],
        [
          4.1,
          0.1,
          0.3
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Tingsha cymbals"
      ],
      [
        "Made of",
        "Bell bronze alloy"
      ],
      [
        "Joined by",
        "A leather cord"
      ],
      [
        "Used for",
        "Meditation, mindfulness, and opening prayers"
      ]
    ],
    "facts": [
      [
        "🧘",
        "Struck rim-to-rim to produce a pure, clear note that vibrates for over 30 seconds."
      ],
      [
        "💨",
        "Used by Himalayan monks to center the mind and invite peaceful thoughts."
      ],
      [
        "✨",
        "Decorated with auspicious symbols like dragons or the lotus flower."
      ]
    ],
    "listen": "A shimmering, eternal crystal ring."
  },
  {
    "id": "vietnam",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "bell": "Đại hồng chung",
    "shape": "bonsho",
    "c": "#874d2b",
    "cd": "#4a2612",
    "word": "chuông",
    "wordLang": "vi",
    "say": "chwawng",
    "tone": {
      "f": 146.83,
      "decay": 4.4,
      "peak": 0.11,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.9,
          0.5,
          0.8
        ],
        [
          2.7,
          0.3,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Đại hồng chung (Great Bell)"
      ],
      [
        "Where",
        "Thiên Mụ Pagoda, Huế"
      ],
      [
        "Cast in",
        "1710 by Lord Nguyễn Phúc Chu"
      ],
      [
        "Weight",
        "over 2 tonnes"
      ]
    ],
    "facts": [
      [
        "🌊",
        "The bell chimes echo across the Perfume River in ancient Huế."
      ],
      [
        "📜",
        "Inscribed with Buddhist verses wishing peace and prosperity for all families."
      ],
      [
        "🌸",
        "Rung twice daily, at 3:30 AM and 7:30 PM, to guide monks into silent reflection."
      ]
    ],
    "listen": "A gentle, rolling river hum."
  },
  {
    "id": "egypt",
    "name": "Egypt",
    "flag": "🇪🇬",
    "bell": "Jarasa",
    "shape": "campana",
    "c": "#9c762d",
    "cd": "#523d11",
    "word": "جرس",
    "wordLang": "ar",
    "say": "JA-ras",
    "tone": {
      "f": 392,
      "decay": 2.8,
      "peak": 0.08,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.1,
          0.4,
          0.6
        ],
        [
          3.2,
          0.18,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Saint Catherine's Monastery Chimes"
      ],
      [
        "Where",
        "Sinai Peninsula, Egypt"
      ],
      [
        "History",
        "Gifted by the Russian Emperor in 1871"
      ],
      [
        "Bells in tower",
        "Nine tuned bells"
      ]
    ],
    "facts": [
      [
        "🏜️",
        "Saint Catherine's is the oldest continuously inhabited Christian monastery in the world."
      ],
      [
        "⛰️",
        "The bells echo off the red granite cliffs of Mount Sinai."
      ],
      [
        "🪵",
        "Alongside bells, monks also strike a wooden simandre (plank) to announce dawn."
      ]
    ],
    "listen": "A desert oasis cathedral chime."
  },
  {
    "id": "ghana",
    "name": "Ghana",
    "flag": "🇬🇭",
    "bell": "Gankogui",
    "shape": "cowbell",
    "c": "#635848",
    "cd": "#383126",
    "word": "gankogui",
    "wordLang": "ak",
    "say": "gan-ko-GWEE",
    "tone": {
      "f": 587.33,
      "decay": 0.9,
      "peak": 0.1,
      "repeat": 2,
      "gap": 0.18,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.8,
          0.45,
          0.7
        ],
        [
          2.6,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Gankogui (double bell)"
      ],
      [
        "Made of",
        "Forged iron"
      ],
      [
        "Played by",
        "Struck with a wooden stick"
      ],
      [
        "Role",
        "The timekeeper bell in West African polyrhythm music"
      ]
    ],
    "facts": [
      [
        "🥁",
        "The double bell has one low-pitched bell and one high-pitched bell welded together."
      ],
      [
        "🎶",
        "Every drummer in the ensemble listens to the gankogui pattern to stay in time."
      ],
      [
        "🇬🇭",
        "Made by traditional blacksmiths in the Volta Region of Ghana."
      ]
    ],
    "listen": "A crisp, syncopated twin clank."
  },
  {
    "id": "nigeria",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "bell": "Agogô",
    "shape": "cowbell",
    "c": "#4a5943",
    "cd": "#263321",
    "word": "agogo",
    "wordLang": "yo",
    "say": "ah-GOH-goh",
    "tone": {
      "f": 659.25,
      "decay": 1,
      "peak": 0.09,
      "repeat": 2,
      "gap": 0.22,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          1.7,
          0.4,
          0.6
        ],
        [
          2.5,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Yoruba Agogô"
      ],
      [
        "Made of",
        "Wrought iron or brass"
      ],
      [
        "Origin",
        "Yoruba ceremonies and royal courts"
      ],
      [
        "Spread",
        "Traveled across the Atlantic into samba and capoeira"
      ]
    ],
    "facts": [
      [
        "👑",
        "Traditional Yoruba kings (Obas) were announced by court agogo bell ringers."
      ],
      [
        "🥁",
        "It is fundamental to Afro-Brazilian batucada drumming bands."
      ],
      [
        "✨",
        "Iron bells are sacred to Ogun, the guardian of crafts and metallurgy."
      ]
    ],
    "listen": "A sharp, lively rhythmic chime."
  },
  {
    "id": "peru",
    "name": "Peru",
    "flag": "🇵🇪",
    "bell": "María Angola",
    "shape": "campana",
    "c": "#9e532b",
    "cd": "#542711",
    "word": "campana",
    "wordLang": "es",
    "say": "cam-PAH-nah",
    "tone": {
      "f": 220,
      "decay": 3.8,
      "peak": 0.1,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.5,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Campana María Angola"
      ],
      [
        "Where",
        "Cusco Cathedral, Peru"
      ],
      [
        "Cast in",
        "1659"
      ],
      [
        "Composition",
        "Bronze with gold and silver donations"
      ]
    ],
    "facts": [
      [
        "🏰",
        "Legend says its deep voice can be heard over 40 kilometers away across the Andes valleys."
      ],
      [
        "✨",
        "Local history tells that a noblewoman named María Angola tossed bags of gold into the molten bronze."
      ],
      [
        "🇵🇪",
        "Rung only for extraordinary civic and religious celebrations in historic Cusco."
      ]
    ],
    "listen": "A golden, reverberating Andean toll."
  },
  {
    "id": "netherlands",
    "name": "Netherlands",
    "flag": "🇳🇱",
    "bell": "Carillon",
    "shape": "campana",
    "c": "#3c6a96",
    "cd": "#1e3c5c",
    "word": "klok",
    "wordLang": "nl",
    "say": "klawk",
    "tone": {
      "f": 523.25,
      "decay": 2.6,
      "peak": 0.08,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.4,
          0.7
        ],
        [
          3,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Dutch Carillon (Klokkenspel)"
      ],
      [
        "Where",
        "Dom Tower, Utrecht and across Dutch cities"
      ],
      [
        "Invented by",
        "The Hemony brothers in the 17th century"
      ],
      [
        "Played with",
        "A baton keyboard and foot pedals"
      ]
    ],
    "facts": [
      [
        "🚲",
        "As you cycle through Dutch town squares, folk tunes float down from high brick towers."
      ],
      [
        "🎼",
        "The Netherlands has over 180 carillons, more than any country in the world."
      ],
      [
        "🎯",
        "The Hemony brothers were the first to tune the bell overtones with scientific precision."
      ]
    ],
    "listen": "A bright, melodic town square song."
  },
  {
    "id": "canada",
    "name": "Canada",
    "flag": "🇨🇦",
    "bell": "Peace Tower",
    "shape": "campana",
    "c": "#a32f2f",
    "cd": "#591414",
    "word": "bell",
    "wordLang": "en",
    "say": "bel",
    "tone": {
      "f": 440,
      "decay": 3.4,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.45,
          0.7
        ],
        [
          2.8,
          0.25,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Peace Tower Carillon"
      ],
      [
        "Where",
        "Parliament Hill, Ottawa"
      ],
      [
        "Inaugurated",
        "1927 to commemorate World War I peace"
      ],
      [
        "Bells in tower",
        "53 bronze bells"
      ]
    ],
    "facts": [
      [
        "🍁",
        "The largest bourdon bell weighs over 10 tonnes, while the smallest weighs just 4.5 kg."
      ],
      [
        "🎶",
        "The Dominion Carillonneur plays free live recitals on weekdays noon."
      ],
      [
        "❄️",
        "Bells ring out clearly through crisp Canadian winter snow."
      ]
    ],
    "listen": "A noble, harmonious civic chime."
  },
  {
    "id": "new-zealand",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "bell": "Wellington Carillon",
    "shape": "campana",
    "c": "#2e7069",
    "cd": "#153d39",
    "word": "pere",
    "wordLang": "mi",
    "say": "PEH-reh",
    "tone": {
      "f": 329.63,
      "decay": 3.2,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.45,
          0.7
        ],
        [
          3.1,
          0.2,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "National War Memorial Carillon"
      ],
      [
        "Where",
        "Pukeahu National War Memorial Park, Wellington"
      ],
      [
        "Bells in tower",
        "49 bells"
      ],
      [
        "Dedicated",
        "1932"
      ]
    ],
    "facts": [
      [
        "🕊️",
        "Each bell is named after military units, nurses, and historic figures."
      ],
      [
        "🌊",
        "The carillon tower looks out over Wellington Harbour and Cook Strait."
      ],
      [
        "🗣️",
        "'Pere' is the Māori word for bell or chime."
      ]
    ],
    "listen": "A calm, solemn, beautiful chime."
  },
  {
    "id": "sweden",
    "name": "Sweden",
    "flag": "🇸🇪",
    "bell": "Thornan",
    "shape": "campana",
    "c": "#286fa6",
    "cd": "#113c5e",
    "word": "klocka",
    "wordLang": "sv",
    "say": "KLAW-kah",
    "tone": {
      "f": 196,
      "decay": 3.8,
      "peak": 0.1,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.5,
          0.8
        ],
        [
          2.6,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Stora Thornan (Uppsala Cathedral)"
      ],
      [
        "Where",
        "Uppsala Domkyrka, Sweden"
      ],
      [
        "Weight",
        "over 7 tonnes"
      ],
      [
        "History",
        "Cast in 1626 from Swedish copper"
      ]
    ],
    "facts": [
      [
        "👑",
        "Thornan is the largest medieval-lineage cathedral bell in all of Sweden."
      ],
      [
        "❄️",
        "Its deep sound carried news of coronations and midwinter festivals across snowfields."
      ],
      [
        "⛪",
        "Uppsala Cathedral’s twin spires rise 118 metres tall."
      ]
    ],
    "listen": "A grand Nordic cathedral chime."
  },
  {
    "id": "ireland",
    "name": "Ireland",
    "flag": "🇮🇪",
    "bell": "St. Patrick's Bell",
    "shape": "handbell",
    "c": "#2a7848",
    "cd": "#134225",
    "word": "clog",
    "wordLang": "ga",
    "say": "klug",
    "tone": {
      "f": 698.46,
      "decay": 1.8,
      "peak": 0.07,
      "repeat": 3,
      "gap": 0.15,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.1,
          0.3,
          0.5
        ],
        [
          3.4,
          0.15,
          0.3
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "The Bell of Saint Patrick (Clog Phádraig)"
      ],
      [
        "Age",
        "about 1,500 years old (c. 500 AD)"
      ],
      [
        "Made of",
        "Iron plates riveted and coated in bronze"
      ],
      [
        "Location",
        "National Museum of Ireland, Dublin"
      ]
    ],
    "facts": [
      [
        "🍀",
        "One of the oldest surviving Christian relics in Ireland."
      ],
      [
        "✨",
        "Enclosed around 1100 AD in a breathtaking gold, silver, and crystal shrine (shrine case)."
      ],
      [
        "📖",
        "Mentioned in the ancient Irish Annals of Ulster."
      ]
    ],
    "listen": "An ancient, rhythmic handbell ring."
  },
  {
    "id": "poland",
    "name": "Poland",
    "flag": "🇵🇱",
    "bell": "Sigismund Bell",
    "shape": "campana",
    "c": "#9e3434",
    "cd": "#591919",
    "word": "dzwon",
    "wordLang": "pl",
    "say": "jvon",
    "tone": {
      "f": 174.61,
      "decay": 4.2,
      "peak": 0.11,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.55,
          0.85
        ],
        [
          2.5,
          0.35,
          0.6
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Royal Sigismund Bell (Dzwon Zygmunta)"
      ],
      [
        "Where",
        "Wawel Cathedral, Kraków"
      ],
      [
        "Cast in",
        "1520 by Hans Beham"
      ],
      [
        "Weight",
        "nearly 13 tonnes"
      ]
    ],
    "facts": [
      [
        "👑",
        "It requires a team of 12 bellringers pulling together in rhythm to swing it."
      ],
      [
        "Touch",
        "Legend says touching its clapper brings good luck and true love."
      ],
      [
        "🏰",
        "Rung only on major Polish national holidays and papal visits."
      ]
    ],
    "listen": "A booming, joyful Slavic chorus."
  },
  {
    "id": "brazil",
    "name": "Brazil",
    "flag": "🇧🇷",
    "bell": "Sino da Independência",
    "shape": "campana",
    "c": "#207a44",
    "cd": "#104724",
    "word": "sino",
    "wordLang": "pt",
    "say": "SEE-noo",
    "tone": {
      "f": 261.63,
      "decay": 3.5,
      "peak": 0.1,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.45,
          0.75
        ],
        [
          2.6,
          0.3,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Sino da Independência"
      ],
      [
        "Where",
        "São Paulo and Rio de Janeiro"
      ],
      [
        "Cast in",
        "1822"
      ],
      [
        "Material",
        "Bronze alloy with silver"
      ]
    ],
    "facts": [
      [
        "🇧🇷",
        "Rung in 1822 to proclaim the independence of Brazil."
      ],
      [
        "🌿",
        "Brazil colonial towns like Ouro Preto are famous for church bells echoing over cobblestones."
      ],
      [
        "🔔",
        "Rung on national holidays and independence commemorations."
      ]
    ],
    "listen": "A festive, warm Latin American ring."
  },
  {
    "id": "turkey",
    "name": "Turkey",
    "flag": "🇹🇷",
    "bell": "Çan",
    "shape": "campana",
    "c": "#b3382c",
    "cd": "#63170e",
    "word": "çan",
    "wordLang": "tr",
    "say": "chahn",
    "tone": {
      "f": 370,
      "decay": 2.9,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.1,
          0.4,
          0.7
        ],
        [
          3.3,
          0.2,
          0.4
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Anatolian Çan & Caravan Bells"
      ],
      [
        "Where",
        "Galata Tower, Istanbul and Anatolia"
      ],
      [
        "Made of",
        "Cast brass and bronze"
      ],
      [
        "Heritage",
        "Centuries of Silk Road trade"
      ]
    ],
    "facts": [
      [
        "🐫",
        "Silk Road camel caravans carried musical çan bells so groups stayed together across the plains."
      ],
      [
        "🏰",
        "Historic clock towers in Izmir and Istanbul mark the hours across busy bazaars."
      ],
      [
        "☕",
        "Small decorative brass bells often adorn tea gardens along the Bosphorus."
      ]
    ],
    "listen": "A crisp, evocative Mediterranean chime."
  },
  {
    "id": "australia",
    "name": "Australia",
    "flag": "🇦🇺",
    "bell": "Swan Bells",
    "shape": "campana",
    "c": "#8f5024",
    "cd": "#4f270d",
    "word": "bell",
    "wordLang": "en",
    "say": "bel",
    "tone": {
      "f": 493.88,
      "decay": 3.2,
      "peak": 0.09,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2,
          0.4,
          0.7
        ],
        [
          2.8,
          0.25,
          0.5
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "The Swan Bells"
      ],
      [
        "Where",
        "Swan Bell Tower, Perth, Western Australia"
      ],
      [
        "History",
        "Historic bells from St Martin-in-the-Fields, London (c. 1700s)"
      ],
      [
        "Bells in tower",
        "18 bells"
      ]
    ],
    "facts": [
      [
        "🦢",
        "Overlooking the Swan River, the glass tower is one of the largest change-ringing instruments."
      ],
      [
        "👑",
        "These historic bells rang for British royalty before being gifted to Australia in 1988."
      ],
      [
        "🎶",
        "Teams of volunteer change ringers play intricate mathematical bell melodies on Sundays."
      ]
    ],
    "listen": "A sparkling, joyful river chime."
  },
  {
    "id": "morocco",
    "name": "Morocco",
    "flag": "🇲🇦",
    "bell": "Nāqūs",
    "shape": "ghanta",
    "c": "#9c4234",
    "cd": "#541e16",
    "word": "ناقوس",
    "wordLang": "ar",
    "say": "naa-QOOS",
    "tone": {
      "f": 554.37,
      "decay": 2.5,
      "peak": 0.08,
      "partials": [
        [
          1,
          1,
          1
        ],
        [
          2.4,
          0.35,
          0.6
        ],
        [
          4.1,
          0.15,
          0.3
        ]
      ]
    },
    "stats": [
      [
        "Bell",
        "Nāqūs (brass chime bell)"
      ],
      [
        "Where",
        "Fez medina and royal gates"
      ],
      [
        "Made of",
        "Hand-hammered brass with geometric Arabesque engraving"
      ],
      [
        "Crafted by",
        "Master brass artisans (safarin)"
      ]
    ],
    "facts": [
      [
        "🕌",
        "The Safarine square in Fez has echoed with brass hammer strikes for 800 years."
      ],
      [
        "🎨",
        "Each bell is engraved with delicate floral and geometric Islamic star patterns."
      ],
      [
        "🐪",
        "Traditional water sellers (guerrab) in Marrakech ring small brass bells to welcome thirsty travelers."
      ]
    ],
    "listen": "An intricate, resonant brass chime."
  }
];

  const $id = id => document.getElementById(id);
  const stage = $id("belStage"), canvas = $id("belCanvas");
  if (!stage || !canvas) return;
  const ctx = canvas.getContext("2d");
  const panel = $id("belPanel"), toggle = $id("belToggle"), vol = $id("belVol"), countEl = $id("belCount"), stampsEl = $id("belStamps");
  const setPrev = $id("belSetPrev"), setNext = $id("belSetNext"), setLabel = $id("belSetLabel"), wordsList = $id("belWordsList");
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  const SKEY = "ahaanDoorsSound", CKEY = "ahaanBellsStamps";          // sound choice is shared with Doors
  let soundOn = false, got = [], openId = null, currentSet = 0;

  try { const s = JSON.parse(localStorage.getItem(SKEY)); if (s) { soundOn = !!s.on; if (typeof s.vol === "number") vol.value = s.vol; } } catch (e) {}
  try { const g = JSON.parse(localStorage.getItem(CKEY)); if (Array.isArray(g)) got = g.filter(id => BELLS.some(b => b.id === id)); } catch (e) {}
  const saveSound = () => { try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: +vol.value })); } catch (e) {} };
  const saveStamps = () => { try { localStorage.setItem(CKEY, JSON.stringify(got)); } catch (e) {} };
  const paintToggle = () => { toggle.setAttribute("aria-pressed", String(soundOn)); toggle.textContent = "🔔 Sound: " + (soundOn ? "on" : "off"); };
  AhaanAudio.setVolume(+vol.value / 100); AhaanAudio.setMuted(!soundOn); paintToggle();
  toggle.addEventListener("click", () => {
    soundOn = !soundOn; AhaanAudio.setMuted(!soundOn); paintToggle(); saveSound();
    if (soundOn) AhaanAudio.strike(523.25, { decay: 1.5, peak: 0.08 });   // one soft note so he hears the level
  });
  vol.addEventListener("input", () => { AhaanAudio.setVolume(+vol.value / 100); saveSound(); });

  function sound(b) {
    if (!soundOn) return;
    const t = b.tone;
    for (let i = 0; i < (t.repeat || 1); i++) AhaanAudio.strike(t.f, { when: i * (t.gap || 0), decay: t.decay, peak: t.peak, partials: t.partials });
  }

  /* ---------- rope physics ---------- */
  const SEG = 9, GRAV = 900;
  let W = 0, H = 0, S = 1, ropes = [], drag = null, raf = 0, quiet = 0, last = 0;

  const roof = stage.querySelector(".bel-roof");
  function build() {
    const cr = canvas.getBoundingClientRect(); W = cr.width; H = cr.height;
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // The roof may be letterboxed to save height: hang each bell from the beam where the roof is actually drawn.
    const rr = roof.getBoundingClientRect(), sc = Math.min(rr.width / 600, rr.height / 150), cw = 600 * sc, left = rr.left + (rr.width - cw) / 2 - cr.left;
    S = Math.max(0.55, Math.min(1.25, cw / 620));
    const currentBells = BELLS.slice(currentSet * 6, (currentSet + 1) * 6);
    ropes = currentBells.map((b, i) => {
      const ax = left + cw * (0.21 + i * 0.116), len = Math.max(24, H - 70 * S) * (0.55 + (i % 3) * 0.14), seg = len / SEG, pts = [];
      for (let k = 0; k <= SEG; k++) pts.push({ x: ax, y: k * seg, px: ax, py: k * seg });
      return { b, ax, seg, len, pts, glow: (got.indexOf(b.id) >= 0 && openId === b.id) ? 1 : 0 };
    });
    draw();
  }

  function step(dt) {
    let energy = 0;
    ropes.forEach(r => {
      const p = r.pts;
      for (let k = 1; k <= SEG; k++) {
        const q = p[k], vx = (q.x - q.px) * 0.972, vy = (q.y - q.py) * 0.972;
        q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + GRAV * dt * dt;
        energy += vx * vx + vy * vy;
      }
      for (let it = 0; it < 8; it++) {
        for (let k = 0; k < SEG; k++) {
          const a = p[k], c = p[k + 1], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, diff = (d - r.seg) / d;
          if (k === 0) { c.x -= dx * diff; c.y -= dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; c.x -= dx * diff * 0.5; c.y -= dy * diff * 0.5; }
        }
        p[0].x = r.ax; p[0].y = 0;
        if (drag && drag.rope === r) { p[SEG].x = drag.x; p[SEG].y = drag.y; }
      }
    });
    return energy;
  }

  function loop(now) {
    const dt = Math.min(1 / 30, (now - last) / 1000) || 1 / 60; last = now;
    const e = step(dt); draw();
    if (!drag && e < 0.004) { if (++quiet > 45) { raf = 0; return; } } else quiet = 0;   // settled: stop the loop
    raf = requestAnimationFrame(loop);
  }
  function wake() { if (!raf && !calm()) { last = performance.now(); quiet = 0; raf = requestAnimationFrame(loop); } }

  /* ---------- drawing (our own bell shapes) ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
    return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
  }
  function body(c, path, col, w) {
    const g = c.createLinearGradient(-w, 0, w, 0);
    g.addColorStop(0, shade(col, 0.35)); g.addColorStop(0.45, col); g.addColorStop(1, shade(col, -0.35));
    c.fillStyle = g; c.beginPath(); path(c); c.closePath(); c.fill();
    c.strokeStyle = shade(col, -0.45); c.lineWidth = 1.2; c.stroke();
  }
  const clapper = (c, y, r) => { c.fillStyle = "#4a3a2c"; c.beginPath(); c.arc(0, y, r, 0, Math.PI * 2); c.fill(); };
  const SHAPES = {
    bonsho(c, b) {
      c.fillStyle = shade(b.c, -0.4); c.fillRect(-4, 0, 8, 9);
      body(c, p => { p.moveTo(-17, 14); p.quadraticCurveTo(-17, 6, 0, 6); p.quadraticCurveTo(17, 6, 17, 14); p.lineTo(18, 58); p.quadraticCurveTo(18, 62, 14, 62); p.lineTo(-14, 62); p.quadraticCurveTo(-18, 62, -18, 58); }, b.c, 18);
      c.strokeStyle = shade(b.c, -0.35); c.lineWidth = 1.5;
      [26, 46].forEach(y => { c.beginPath(); c.moveTo(-17.5, y); c.lineTo(17.5, y); c.stroke(); });
      c.fillStyle = shade(b.c, 0.25); for (let i = -2; i <= 2; i++) for (let j = 0; j < 2; j++) { c.beginPath(); c.arc(i * 6, 15 + j * 5, 1.4, 0, Math.PI * 2); c.fill(); }
    },
    bianzhong(c, b) {
      c.fillStyle = shade(b.c, -0.4); c.fillRect(-3, 0, 6, 11);
      body(c, p => { p.moveTo(-12, 10); p.lineTo(12, 10); p.lineTo(19, 52); p.quadraticCurveTo(10, 45, 0, 54); p.quadraticCurveTo(-10, 45, -19, 52); }, b.c, 18);
      c.fillStyle = shade(b.c, 0.3); for (let i = -1; i <= 1; i++) for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(i * 6, 18 + j * 7, 1.6, 0, Math.PI * 2); c.fill(); }
    },
    ghanta(c, b) {
      c.fillStyle = shade(b.c, -0.2); c.beginPath(); c.arc(0, 6, 5, 0, Math.PI * 2); c.fill(); c.fillRect(-3, 8, 6, 7);
      body(c, p => { p.moveTo(-6, 14); p.quadraticCurveTo(-14, 16, -15, 34); p.quadraticCurveTo(-16, 48, -24, 54); p.lineTo(24, 54); p.quadraticCurveTo(16, 48, 15, 34); p.quadraticCurveTo(14, 16, 6, 14); }, b.c, 24);
      clapper(c, 57, 4);
    },
    handbell(c, b) {
      c.fillStyle = "#8a5a2c"; c.fillRect(-3, 0, 6, 17);
      c.fillStyle = b.cd; c.beginPath(); c.moveTo(-2, 13); c.lineTo(-12, 22); c.lineTo(-6, 13); c.fill(); c.beginPath(); c.moveTo(2, 13); c.lineTo(12, 22); c.lineTo(6, 13); c.fill();
      body(c, p => { p.moveTo(-8, 16); p.quadraticCurveTo(-16, 18, -16, 32); p.lineTo(-20, 46); p.lineTo(20, 46); p.lineTo(16, 32); p.quadraticCurveTo(16, 18, 8, 16); }, b.c, 20);
      clapper(c, 49, 3.5);
    },
    cowbell(c, b) {
      c.strokeStyle = "#5a4636"; c.lineWidth = 3; c.beginPath(); c.arc(0, 8, 6, Math.PI, 0); c.stroke();
      body(c, p => { p.moveTo(-10, 8); p.lineTo(10, 8); p.lineTo(16, 48); p.quadraticCurveTo(0, 51, -16, 48); }, b.c, 16);
      c.fillStyle = "#3a2e24"; c.fillRect(-3, 47, 6, 7);
    },
    campana(c, b) {
      c.fillStyle = "#6a4a2a"; c.fillRect(-15, 0, 30, 6);
      body(c, p => { p.moveTo(-9, 6); p.quadraticCurveTo(-17, 8, -17, 26); p.quadraticCurveTo(-17, 44, -27, 56); p.quadraticCurveTo(0, 60, 27, 56); p.quadraticCurveTo(17, 44, 17, 26); p.quadraticCurveTo(17, 8, 9, 6); }, b.c, 27);
      c.strokeStyle = shade(b.c, -0.35); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-22, 50); c.quadraticCurveTo(0, 54, 22, 50); c.stroke();
      clapper(c, 60, 4);
    }
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ropes.forEach(r => {
      const p = r.pts;
      ctx.strokeStyle = "rgba(70,50,30,.7)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
      for (let k = 1; k < SEG; k++) ctx.quadraticCurveTo(p[k].x, p[k].y, (p[k].x + p[k + 1].x) / 2, (p[k].y + p[k + 1].y) / 2);
      ctx.lineTo(p[SEG].x, p[SEG].y); ctx.stroke();
      const a = p[SEG], q = p[SEG - 1];
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(-Math.atan2(a.x - q.x, a.y - q.y)); ctx.scale(S, S);
      if (r.glow > 0) { ctx.fillStyle = "rgba(255,232,160," + (0.55 * r.glow) + ")"; ctx.beginPath(); ctx.ellipse(0, 32, 40, 38, 0, 0, Math.PI * 2); ctx.fill(); }
      SHAPES[r.b.shape](ctx, r.b);
      ctx.restore();
    });
  }

  /* ---------- set switcher ---------- */
  function updateSetUI() {
    if (setLabel) {
      setLabel.textContent = "Set " + (currentSet + 1) + " of 6 · Bells " + (currentSet * 6 + 1) + "–" + ((currentSet + 1) * 6);
    }
    if (wordsList) {
      const currentBells = BELLS.slice(currentSet * 6, (currentSet + 1) * 6);
      wordsList.innerHTML = currentBells.map(b =>
        '<li><span class="v" lang="' + b.wordLang + '">' + b.word + '</span><small>' + b.say + ' · ' + b.name + '</small></li>'
      ).join("");
    }
    build();
  }
  function switchSet(newSet) {
    if (newSet < 0) newSet = 5;
    else if (newSet > 5) newSet = 0;
    currentSet = newSet;
    updateSetUI();
  }
  if (setPrev) setPrev.addEventListener("click", () => switchSet(currentSet - 1));
  if (setNext) setNext.addEventListener("click", () => switchSet(currentSet + 1));

  /* ---------- ringing, stamps, cards ---------- */
  function ring(r, fromDrag) {
    ropes.forEach(o => { o.glow = o === r ? 1 : 0; });
    if (!calm() && !fromDrag) { const l = r.pts[SEG]; l.px -= (Math.random() < 0.5 ? -1 : 1) * 7; wake(); }
    else draw();
    sound(r.b);
    openCard(r.b);
  }

  function ringStamp(b) {
    const bIndex = BELLS.indexOf(b);
    const targetSet = Math.floor(bIndex / 6);
    const ropeIndex = bIndex % 6;
    if (currentSet !== targetSet) {
      currentSet = targetSet;
      updateSetUI();
    }
    const r = ropes[ropeIndex];
    if (r) ring(r);
  }

  const stampBtns = {};
  function paintStamp(b) {
    const el = stampBtns[b.id], has = got.indexOf(b.id) >= 0;
    if (!el) return;
    el.querySelector(".bel-post").hidden = !has;
    el.setAttribute("aria-label", "Ring the " + b.bell + " bell from " + b.name + (has ? " (stamp collected)" : ""));
  }
  const paintCount = () => { countEl.textContent = got.length === BELLS.length ? "🌍 You collected every bell stamp!" : "Stamps collected: " + got.length + " of " + BELLS.length; };
  BELLS.forEach((b, i) => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "bel-stamp"; el.style.setProperty("--c", b.c); el.style.setProperty("--tilt", ((i % 3) - 1) * 1.2 + "deg");
    el.setAttribute("aria-expanded", "false"); el.setAttribute("aria-controls", "belPanel");
    el.innerHTML = '<span class="bel-flag" aria-hidden="true">' + b.flag + '</span><span class="bel-name">' + b.name + '</span><span class="bel-word" lang="' + b.wordLang + '">' + b.word + '</span><span class="bel-post" aria-hidden="true" hidden>RUNG</span>';
    el.addEventListener("click", () => ringStamp(b));
    stampsEl.appendChild(el); stampBtns[b.id] = el; paintStamp(b);
  });
  paintCount();

  function openCard(b) {
    openId = b.id;
    Object.keys(stampBtns).forEach(k => stampBtns[k].setAttribute("aria-expanded", String(k === b.id)));
    panel.style.setProperty("--c", b.c);
    $id("belFlag").textContent = b.flag;
    $id("belNum").textContent = "Stamp " + (BELLS.indexOf(b) + 1) + " of " + BELLS.length;
    $id("belName").textContent = b.name + " · " + b.bell;
    const stats = $id("belStats"); stats.innerHTML = "";
    b.stats.forEach(s => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = s[0]; dd.textContent = s[1]; d.append(dt, dd); stats.appendChild(d); });
    const facts = $id("belFacts"); facts.innerHTML = "";
    b.facts.forEach(f => { const li = document.createElement("li"), e = document.createElement("span"), t = document.createElement("span"); e.textContent = f[0]; e.setAttribute("aria-hidden", "true"); t.textContent = f[1]; li.append(e, t); facts.appendChild(li); });
    $id("belListen").textContent = b.listen;
    const w = $id("belWord"); w.textContent = b.word; w.lang = b.wordLang;
    $id("belSay").textContent = "say it: " + b.say;
    const isNew = got.indexOf(b.id) < 0;
    if (isNew) { got.push(b.id); saveStamps(); paintStamp(b); paintCount(); }
    $id("belNew").hidden = !isNew;
    panel.hidden = false;
    if (window.CardDialog) CardDialog.open(panel, stampBtns[b.id]);
    if (window.AhaanBrush) AhaanBrush.card(panel, b.c, b.cd);
  }
  function closeCard() {
    panel.hidden = true; openId = null;
    if (window.CardDialog) CardDialog.close(panel);
    Object.keys(stampBtns).forEach(k => stampBtns[k].setAttribute("aria-expanded", "false"));
    ropes.forEach(o => { o.glow = 0; }); draw();
  }
  $id("belClose").addEventListener("click", closeCard);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && openId) { const el = stampBtns[openId]; closeCard(); if (el && el.focus) el.focus(); } });

  /* ---------- pointer: tap a bell to ring it, or drag it and let go ---------- */
  function hit(x, y) {
    let best = null, bd = 46 * S;
    ropes.forEach(r => { const l = r.pts[SEG], d = Math.hypot(l.x - x, l.y + 30 * S - y); if (d < bd) { bd = d; best = r; } });
    return best;
  }
  const local = e => { const rc = canvas.getBoundingClientRect(); return { x: e.clientX - rc.left, y: e.clientY - rc.top }; };
  canvas.addEventListener("pointerdown", e => {
    const p = local(e), r = hit(p.x, p.y); if (!r) return;
    if (calm()) { ring(r); return; }
    drag = { rope: r, x: p.x, y: p.y, sx: p.x, sy: p.y, moved: false };
    canvas.setPointerCapture(e.pointerId); wake();
  });
  canvas.addEventListener("pointermove", e => {
    const p = local(e);
    if (!drag) { canvas.style.cursor = hit(p.x, p.y) ? "grab" : "default"; return; }
    const r = drag.rope, dx = p.x - r.ax, dy = p.y, d = Math.hypot(dx, dy), k = d > r.len ? r.len / d : 1;   // keep within the string length
    drag.x = r.ax + dx * k; drag.y = dy * k;
    if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 6) drag.moved = true;
  });
  const release = () => { if (!drag) return; const r = drag.rope, moved = drag.moved; drag = null; ring(r, moved); };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", () => { drag = null; });

  let rt; const rebuild = () => { clearTimeout(rt); rt = setTimeout(build, 120); };
  if ("ResizeObserver" in window) new ResizeObserver(rebuild).observe(canvas); else addEventListener("resize", rebuild);
  updateSetUI();
})();
