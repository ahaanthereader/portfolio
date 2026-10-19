/* ---- Doors of the World: collectible country cards (real facts; rounded "about" numbers; verify before sharing widely) ---- */
(function () {
  const COUNTRIES = [
  {
    "id": "japan",
    "name": "Japan",
    "flag": "🇯🇵",
    "lang": "ja",
    "c": "#c0392b",
    "cd": "#7c1f16",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"8\" y=\"6\" width=\"104\" height=\"10\" rx=\"3\" fill=\"#e04836\"/><rect x=\"22\" y=\"20\" width=\"76\" height=\"7\" rx=\"3\" fill=\"#a02c1f\"/><rect x=\"26\" y=\"10\" width=\"10\" height=\"40\" fill=\"#e04836\"/><rect x=\"84\" y=\"10\" width=\"10\" height=\"40\" fill=\"#e04836\"/></svg>",
    "stats": [
      [
        "Capital",
        "Tokyo"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Japanese"
      ],
      [
        "Money",
        "Yen"
      ],
      [
        "People",
        "about 124 million"
      ],
      [
        "Size",
        "about 378,000 km²"
      ]
    ],
    "facts": [
      [
        "🏝️",
        "Japan is made of more than 6,800 islands."
      ],
      [
        "🗻",
        "Mount Fuji is its tallest mountain, 3,776 metres high."
      ],
      [
        "🚄",
        "Bullet trains (Shinkansen) have zoomed there since 1964."
      ]
    ],
    "script": "七転び八起き",
    "en": "“Fall down seven times, get up eight.”",
    "note": "A Japanese proverb about never giving up.",
    "why": "Missed a goal or a puzzle? Try again. Every try makes you stronger."
  },
  {
    "id": "china",
    "name": "China",
    "flag": "🇨🇳",
    "lang": "zh",
    "c": "#c99a1c",
    "cd": "#7a5c0a",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M8 22 L60 4 L112 22 L104 29 L60 13 L16 29 Z\" fill=\"#e3b62c\"/><path d=\"M24 36 L60 24 L96 36 L90 41 L60 30 L30 41 Z\" fill=\"#c99a1c\"/><rect x=\"55\" y=\"30\" width=\"10\" height=\"20\" fill=\"#7a5c0a\"/></svg>",
    "stats": [
      [
        "Capital",
        "Beijing"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Mandarin Chinese"
      ],
      [
        "Money",
        "Yuan (renminbi)"
      ],
      [
        "People",
        "about 1.4 billion"
      ],
      [
        "Size",
        "about 9.6 million km²"
      ]
    ],
    "facts": [
      [
        "🐼",
        "Wild giant pandas live only in China."
      ],
      [
        "🧭",
        "Paper, printing, the compass and gunpowder were all invented in China."
      ],
      [
        "🧱",
        "The Great Wall was built in pieces over many hundreds of years."
      ]
    ],
    "script": "千里之行，始于足下",
    "en": "“A journey of a thousand miles begins with a single step.”",
    "note": "From the Tao Te Ching, written about 2,500 years ago.",
    "why": "Big goals start small. One page a day can finish a whole book!"
  },
  {
    "id": "india",
    "name": "India",
    "flag": "🇮🇳",
    "lang": "sa",
    "c": "#0e7c7b",
    "cd": "#075251",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M30 50 L30 24 Q30 6 60 6 Q90 6 90 24 L90 50 L78 50 L78 26 Q78 17 60 17 Q42 17 42 26 L42 50 Z\" fill=\"#12908e\"/><circle cx=\"60\" cy=\"35\" r=\"9\" fill=\"#f4b942\"/></svg>",
    "stats": [
      [
        "Capital",
        "New Delhi"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Languages",
        "Hindi and English, plus many more"
      ],
      [
        "Money",
        "Rupee"
      ],
      [
        "People",
        "about 1.4 billion"
      ],
      [
        "Size",
        "about 3.3 million km²"
      ]
    ],
    "facts": [
      [
        "♟️",
        "The game of chess began in India, long ago."
      ],
      [
        "0️⃣",
        "Zero as a number was developed by mathematicians in India."
      ],
      [
        "🗣️",
        "The Constitution recognises 22 languages."
      ]
    ],
    "script": "वसुधैव कुटुम्बकम्",
    "en": "“The world is one family.”",
    "note": "From an ancient Sanskrit text, the Maha Upanishad.",
    "why": "Be kind and curious about everyone. Friends all over the world make you wiser."
  },
  {
    "id": "kazakhstan",
    "name": "Kazakhstan",
    "flag": "🇰🇿",
    "lang": "kk",
    "c": "#2f6fb2",
    "cd": "#1a4066",
    "base": 783.99,
    "crest": "<svg viewBox=\"0 0 120 50\"><g stroke=\"#e8f1fa\" stroke-width=\"5\" fill=\"none\"><circle cx=\"60\" cy=\"25\" r=\"15\"/><path d=\"M60 10 L60 40 M45 25 L75 25 M50 15 L70 35 M70 15 L50 35\"/></g><circle cx=\"60\" cy=\"25\" r=\"5\" fill=\"#e8f1fa\"/></svg>",
    "stats": [
      [
        "Capital",
        "Astana"
      ],
      [
        "Continent",
        "Mostly Asia, a little Europe"
      ],
      [
        "Languages",
        "Kazakh and Russian"
      ],
      [
        "Money",
        "Tenge"
      ],
      [
        "People",
        "about 20 million"
      ],
      [
        "Size",
        "about 2.7 million km²"
      ]
    ],
    "facts": [
      [
        "🌍",
        "It is the biggest landlocked country, with no sea coast at all."
      ],
      [
        "🚀",
        "The first person in space, Yuri Gagarin, blasted off in 1961 from Baikonur in Kazakhstan."
      ],
      [
        "🍎",
        "Wild apples grew in the mountains here. Almaty's name is linked to apples."
      ]
    ],
    "script": "Жеті рет өлшеп, бір рет кес",
    "en": "“Measure seven times, cut once.”",
    "note": "A Kazakh proverb: think carefully before you act.",
    "why": "Check your work before you finish. Careful steps lead to great results."
  },
  {
    "id": "kenya",
    "name": "Kenya",
    "flag": "🇰🇪",
    "lang": "sw",
    "c": "#3f8a43",
    "cd": "#265a2a",
    "base": 698.46,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"57\" y=\"22\" width=\"6\" height=\"28\" fill=\"#7a5a2a\"/><ellipse cx=\"60\" cy=\"18\" rx=\"44\" ry=\"9\" fill=\"#5fae5a\"/><ellipse cx=\"60\" cy=\"12\" rx=\"30\" ry=\"7\" fill=\"#7cc576\"/></svg>",
    "stats": [
      [
        "Capital",
        "Nairobi"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Languages",
        "Swahili and English"
      ],
      [
        "Money",
        "Kenyan shilling"
      ],
      [
        "People",
        "about 55 million"
      ],
      [
        "Size",
        "about 580,000 km²"
      ]
    ],
    "facts": [
      [
        "🦓",
        "Every year huge herds of wildebeest and zebras cross the plains in the Great Migration."
      ],
      [
        "🏔️",
        "Mount Kenya is the second-highest mountain in Africa."
      ],
      [
        "📏",
        "The Equator runs right through Kenya."
      ]
    ],
    "script": "Haraka haraka haina baraka",
    "en": "“Hurry, hurry has no blessing.”",
    "note": "A Swahili proverb: rushing spoils things.",
    "why": "Slow down and do it well. Your best work is not a race."
  },
  {
    "id": "italy",
    "name": "Italy",
    "flag": "🇮🇹",
    "lang": "it",
    "c": "#a8642c",
    "cd": "#6e3d17",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 50 L20 22 Q20 6 40 6 Q60 6 60 22 L60 50 L52 50 L52 24 Q52 14 40 14 Q28 14 28 24 L28 50 Z\" fill=\"#c98a52\"/><path d=\"M62 50 L62 22 Q62 6 82 6 Q102 6 102 22 L102 50 L94 50 L94 24 Q94 14 82 14 Q70 14 70 24 L70 50 Z\" fill=\"#c98a52\"/></svg>",
    "stats": [
      [
        "Capital",
        "Rome"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Italian"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 59 million"
      ],
      [
        "Size",
        "about 301,000 km²"
      ]
    ],
    "facts": [
      [
        "👢",
        "Italy looks like a boot on the map."
      ],
      [
        "⛪",
        "The smallest country in the world, Vatican City, sits inside the city of Rome."
      ],
      [
        "🌋",
        "Mount Vesuvius, a volcano, rises near the city of Naples."
      ]
    ],
    "script": "Chi va piano va sano e va lontano",
    "en": "“He who goes slowly goes safely, and goes far.”",
    "note": "An Italian proverb: steady beats rushed.",
    "why": "A little practice every day takes you a very long way."
  },
  {
    "id": "france",
    "name": "France",
    "flag": "🇫🇷",
    "lang": "fr",
    "c": "#2b5797",
    "cd": "#18345c",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M25 50 L25 20 Q25 4 60 4 Q95 4 95 20 L95 50 L85 50 L85 22 Q85 14 60 14 Q35 14 35 22 L35 50 Z\" fill=\"#3b6fc2\"/><path d=\"M60 4 L60 50\" stroke=\"#e6b800\" stroke-width=\"3\"/><circle cx=\"60\" cy=\"24\" r=\"6\" fill=\"#e6b800\"/></svg>",
    "stats": [
      [
        "Capital",
        "Paris"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "French"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 68 million"
      ],
      [
        "Size",
        "about 643,000 km²"
      ]
    ],
    "facts": [
      [
        "🗼",
        "The Eiffel Tower grows about 15 cm taller in hot summer sun."
      ],
      [
        "🧀",
        "France produces over 1,000 different kinds of cheese."
      ],
      [
        "🚲",
        "The Tour de France bicycle race has rolled every summer since 1903."
      ]
    ],
    "script": "Petit à petit, l’oiseau fait son nid",
    "en": "“Little by little, the bird builds its nest.”",
    "note": "A French saying about daily progress.",
    "why": "Brick by brick, page by page: steady small efforts make huge wonders."
  },
  {
    "id": "mexico",
    "name": "Mexico",
    "flag": "🇲🇽",
    "lang": "es",
    "c": "#b34728",
    "cd": "#6e2714",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 48 L25 36 L95 36 L105 48 Z\" fill=\"#8c3218\"/><path d=\"M28 36 L36 24 L84 24 L92 36 Z\" fill=\"#d45935\"/><path d=\"M40 24 L48 12 L72 12 L80 24 Z\" fill=\"#f28246\"/><circle cx=\"60\" cy=\"7\" r=\"5\" fill=\"#ffd13b\"/></svg>",
    "stats": [
      [
        "Capital",
        "Mexico City"
      ],
      [
        "Continent",
        "North America"
      ],
      [
        "Language",
        "Spanish"
      ],
      [
        "Money",
        "Mexican Peso"
      ],
      [
        "People",
        "about 129 million"
      ],
      [
        "Size",
        "about 1.97 million km²"
      ]
    ],
    "facts": [
      [
        "🍫",
        "Chocolate was first enjoyed in Mexico by ancient Maya and Aztec people."
      ],
      [
        "🦋",
        "Millions of Monarch butterflies migrate to Mexican pine forests every winter."
      ],
      [
        "🌋",
        "Mexico City was built on an ancient lakebed surrounded by volcanoes."
      ]
    ],
    "script": "Poco a poco se anda lejos",
    "en": "“Little by little, one travels far.”",
    "note": "A Mexican saying about patience on the road.",
    "why": "Do not rush the journey. Enjoy every step and you will arrive happy."
  },
  {
    "id": "egypt",
    "name": "Egypt",
    "flag": "🇪🇬",
    "lang": "ar",
    "c": "#a67c1e",
    "cd": "#5c430c",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M18 48 L32 8 L88 8 L102 48 Z\" fill=\"#c99a2c\"/><path d=\"M38 48 L46 22 L74 22 L82 48 Z\" fill=\"#5c430c\"/><circle cx=\"60\" cy=\"14\" r=\"6\" fill=\"#f7d560\"/></svg>",
    "stats": [
      [
        "Capital",
        "Cairo"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Language",
        "Arabic"
      ],
      [
        "Money",
        "Egyptian Pound"
      ],
      [
        "People",
        "about 112 million"
      ],
      [
        "Size",
        "about 1 million km²"
      ]
    ],
    "facts": [
      [
        "🌊",
        "The Nile River is one of the longest rivers on our planet."
      ],
      [
        "📐",
        "The Great Pyramid of Giza stood as the world’s tallest building for over 3,800 years."
      ],
      [
        "🐈",
        "Ancient Egyptians loved cats and believed they brought good luck."
      ]
    ],
    "script": "اطلبوا العلم من المهد إلى اللحد",
    "en": "“Seek knowledge from the cradle to the grave.”",
    "note": "An Egyptian proverb celebrating lifelong learning.",
    "why": "Never stop asking questions. Learning keeps life fun and magical."
  },
  {
    "id": "brazil",
    "name": "Brazil",
    "flag": "🇧🇷",
    "lang": "pt",
    "c": "#227845",
    "cd": "#114727",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M10 25 L60 6 L110 25 L60 44 Z\" fill=\"#f5c518\"/><circle cx=\"60\" cy=\"25\" r=\"13\" fill=\"#24559c\"/><path d=\"M48 24 Q60 21 72 26\" stroke=\"#fff\" stroke-width=\"2.5\" fill=\"none\"/></svg>",
    "stats": [
      [
        "Capital",
        "Brasília"
      ],
      [
        "Continent",
        "South America"
      ],
      [
        "Language",
        "Portuguese"
      ],
      [
        "Money",
        "Brazilian Real"
      ],
      [
        "People",
        "about 215 million"
      ],
      [
        "Size",
        "about 8.5 million km²"
      ]
    ],
    "facts": [
      [
        "🌳",
        "The Amazon Rainforest produces much of the planet’s fresh oxygen."
      ],
      [
        "🦜",
        "Brazil has more bird and plant species than almost any other country."
      ],
      [
        "⚽",
        "Brazil has won the FIFA World Cup five times."
      ]
    ],
    "script": "A união faz a força",
    "en": "“Unity creates strength.”",
    "note": "A Brazilian proverb about teaming up.",
    "why": "When you work together with friends, you can solve any puzzle."
  },
  {
    "id": "australia",
    "name": "Australia",
    "flag": "🇦🇺",
    "lang": "en",
    "c": "#9c4b1f",
    "cd": "#57260c",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M12 42 Q60 12 108 42\" stroke=\"#f2994a\" stroke-width=\"8\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"60\" cy=\"22\" r=\"7\" fill=\"#f2c94c\"/></svg>",
    "stats": [
      [
        "Capital",
        "Canberra"
      ],
      [
        "Continent",
        "Oceania"
      ],
      [
        "Language",
        "English"
      ],
      [
        "Money",
        "Australian Dollar"
      ],
      [
        "People",
        "about 27 million"
      ],
      [
        "Size",
        "about 7.7 million km²"
      ]
    ],
    "facts": [
      [
        "🦘",
        "Kangaroos and emus cannot easily walk backward."
      ],
      [
        "🪸",
        "The Great Barrier Reef is so huge it can be seen from space."
      ],
      [
        "🐨",
        "Koalas sleep up to 20 hours a day in eucalyptus trees."
      ]
    ],
    "script": "We are all visitors here",
    "en": "“Take care of the land, and the land takes care of you.”",
    "note": "An Indigenous Australian teaching about caring for nature.",
    "why": "Look after animals, trees, and earth wherever you play."
  },
  {
    "id": "greece",
    "name": "Greece",
    "flag": "🇬🇷",
    "lang": "el",
    "c": "#1f659e",
    "cd": "#10395c",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 16 L60 4 L105 16 Z\" fill=\"#3282c4\"/><rect x=\"22\" y=\"18\" width=\"76\" height=\"6\" fill=\"#ffffff\"/><rect x=\"28\" y=\"24\" width=\"8\" height=\"24\" fill=\"#ffffff\"/><rect x=\"48\" y=\"24\" width=\"8\" height=\"24\" fill=\"#ffffff\"/><rect x=\"64\" y=\"24\" width=\"8\" height=\"24\" fill=\"#ffffff\"/><rect x=\"84\" y=\"24\" width=\"8\" height=\"24\" fill=\"#ffffff\"/></svg>",
    "stats": [
      [
        "Capital",
        "Athens"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Greek"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 10 million"
      ],
      [
        "Size",
        "about 132,000 km²"
      ]
    ],
    "facts": [
      [
        "🏛️",
        "The Olympic Games began in ancient Olympia around 776 BC."
      ],
      [
        "🫒",
        "Greece has some olive trees that have grown for thousands of years."
      ],
      [
        "🏝️",
        "Greece includes thousands of beautiful islands in the Aegean and Ionian seas."
      ]
    ],
    "script": "Γνῶθι σεαυτόν",
    "en": "“Know thyself.”",
    "note": "Inscribed on the Temple of Apollo at Delphi.",
    "why": "Understand what makes you happy, what challenges you, and be proud of who you are."
  },
  {
    "id": "spain",
    "name": "Spain",
    "flag": "🇪🇸",
    "lang": "es",
    "c": "#b83b27",
    "cd": "#6e1d10",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M30 48 L30 26 Q30 8 60 8 Q90 8 90 26 L90 48 Z\" fill=\"none\" stroke=\"#f2a93b\" stroke-width=\"6\"/><circle cx=\"60\" cy=\"28\" r=\"8\" fill=\"#d9381e\"/></svg>",
    "stats": [
      [
        "Capital",
        "Madrid"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Spanish (Castilian)"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 48 million"
      ],
      [
        "Size",
        "about 506,000 km²"
      ]
    ],
    "facts": [
      [
        "🏰",
        "Spain has the only castle with a drawbridge inside a city: the Alhambra."
      ],
      [
        "🥖",
        "The Sagrada Família church in Barcelona has been under construction since 1882."
      ],
      [
        "🍇",
        "Spain is the world’s leading producer of olive oil."
      ]
    ],
    "script": "Querer es poder",
    "en": "“Where there is a will, there is a way.”",
    "note": "A Spanish proverb about determination.",
    "why": "When your heart is set on something good, keep going until you succeed."
  },
  {
    "id": "canada",
    "name": "Canada",
    "flag": "🇨🇦",
    "lang": "en",
    "c": "#a82c2c",
    "cd": "#611616",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M60 6 L64 18 L76 16 L72 26 L82 28 L72 38 L60 34 L48 38 L38 28 L48 26 L44 16 L56 18 Z\" fill=\"#d63030\"/><rect x=\"58\" y=\"34\" width=\"4\" height=\"14\" fill=\"#8a1a1a\"/></svg>",
    "stats": [
      [
        "Capital",
        "Ottawa"
      ],
      [
        "Continent",
        "North America"
      ],
      [
        "Languages",
        "English and French"
      ],
      [
        "Money",
        "Canadian Dollar"
      ],
      [
        "People",
        "about 40 million"
      ],
      [
        "Size",
        "about 9.98 million km²"
      ]
    ],
    "facts": [
      [
        "🍁",
        "Canada produces over 70% of the world’s maple syrup."
      ],
      [
        "🐻",
        "More than half of the world’s wild polar bears live in northern Canada."
      ],
      [
        "🌊",
        "Canada has more lakes than all other countries combined."
      ]
    ],
    "script": "A mari usque ad mare",
    "en": "“From sea to sea.”",
    "note": "Canada’s motto celebrating coasts from Atlantic to Pacific to Arctic.",
    "why": "Think big and stay curious about the horizons ahead."
  },
  {
    "id": "south-korea",
    "name": "South Korea",
    "flag": "🇰🇷",
    "lang": "ko",
    "c": "#235985",
    "cd": "#12334f",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M10 24 Q60 6 110 24 L102 32 Q60 16 18 32 Z\" fill=\"#2f7fba\"/><circle cx=\"60\" cy=\"35\" r=\"10\" fill=\"#c43737\"/></svg>",
    "stats": [
      [
        "Capital",
        "Seoul"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Korean"
      ],
      [
        "Money",
        "South Korean Won"
      ],
      [
        "People",
        "about 51 million"
      ],
      [
        "Size",
        "about 100,000 km²"
      ]
    ],
    "facts": [
      [
        "✍️",
        "King Sejong invented Hangul in 1443 so every child could easily read and write."
      ],
      [
        "🥋",
        "Taekwondo, the Olympic martial art, originated in Korea."
      ],
      [
        "🚀",
        "South Korea has some of the fastest internet speeds in the world."
      ]
    ],
    "script": "시작이 반이다",
    "en": "“Starting is half the journey.”",
    "note": "A Korean proverb: taking the first step is the biggest victory.",
    "why": "Do not be afraid of a blank page. Write the first word and you are already halfway!"
  },
  {
    "id": "germany",
    "name": "Germany",
    "flag": "🇩🇪",
    "lang": "de",
    "c": "#855c20",
    "cd": "#47300c",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"20\" y=\"8\" width=\"80\" height=\"8\" fill=\"#2b2721\"/><rect x=\"26\" y=\"18\" width=\"6\" height=\"30\" fill=\"#d99b26\"/><rect x=\"44\" y=\"18\" width=\"6\" height=\"30\" fill=\"#d99b26\"/><rect x=\"62\" y=\"18\" width=\"6\" height=\"30\" fill=\"#d99b26\"/><rect x=\"80\" y=\"18\" width=\"6\" height=\"30\" fill=\"#d99b26\"/></svg>",
    "stats": [
      [
        "Capital",
        "Berlin"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "German"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 84 million"
      ],
      [
        "Size",
        "about 357,000 km²"
      ]
    ],
    "facts": [
      [
        "📖",
        "The Brothers Grimm collected fairytales like Rapunzel and Hansel & Gretel here."
      ],
      [
        "🌲",
        "One-third of Germany is covered by dense, protected forests like the Black Forest."
      ],
      [
        "🏰",
        "Germany has more than 20,000 castles and palaces."
      ]
    ],
    "script": "Übung macht den Meister",
    "en": "“Practice makes the master.”",
    "note": "A German proverb on building skill through joy and patience.",
    "why": "Playing piano or learning coding gets easier and more fun every time you practice."
  },
  {
    "id": "united-kingdom",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "lang": "en",
    "c": "#204d80",
    "cd": "#112b47",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M30 48 L30 22 L60 6 L90 22 L90 48 Z\" fill=\"#306ba8\"/><circle cx=\"60\" cy=\"26\" r=\"8\" fill=\"#ffd54f\"/></svg>",
    "stats": [
      [
        "Capital",
        "London"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "English"
      ],
      [
        "Money",
        "Pound Sterling"
      ],
      [
        "People",
        "about 68 million"
      ],
      [
        "Size",
        "about 242,000 km²"
      ]
    ],
    "facts": [
      [
        "🕰️",
        "Big Ben is actually the nickname of the giant bell inside the Elizabeth Tower."
      ],
      [
        "🚂",
        "The world’s first passenger railway opened in northern England in 1825."
      ],
      [
        "👑",
        "Windsor Castle is the oldest occupied castle in the world, over 900 years old."
      ]
    ],
    "script": "Every cloud has a silver lining",
    "en": "“There is good in every challenging moment.”",
    "note": "A traditional British saying about optimism.",
    "why": "Even on rainy days, you can build cozy memories and read great stories."
  },
  {
    "id": "morocco",
    "name": "Morocco",
    "flag": "🇲🇦",
    "lang": "ar",
    "c": "#9c382a",
    "cd": "#571c14",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M35 48 L35 25 Q35 12 60 4 Q85 12 85 25 L85 48 Z\" fill=\"#c44d3b\"/><path d=\"M60 16 L64 24 L72 24 L66 29 L68 37 L60 32 L52 37 L54 29 L48 24 L56 24 Z\" fill=\"#228b22\"/></svg>",
    "stats": [
      [
        "Capital",
        "Rabat"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Languages",
        "Arabic and Berber (Tamazight)"
      ],
      [
        "Money",
        "Moroccan Dirham"
      ],
      [
        "People",
        "about 38 million"
      ],
      [
        "Size",
        "about 710,000 km²"
      ]
    ],
    "facts": [
      [
        "🏫",
        "The University of al-Qarawiyyin in Fez was founded in 859 AD, the oldest continuously operating university."
      ],
      [
        "🐐",
        "In Morocco, goats climb Argan trees to munch on sweet fruit."
      ],
      [
        "🏜️",
        "Morocco sits right at the western gateway of the vast Sahara desert."
      ]
    ],
    "script": "قطرة قطرة كيحمل الواد",
    "en": "“Drop by drop, the river fills.”",
    "note": "A Moroccan proverb about patience and accumulation.",
    "why": "Small kindnesses and small lessons add up to an ocean of wisdom."
  },
  {
    "id": "new-zealand",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "lang": "mi",
    "c": "#236e67",
    "cd": "#123d39",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 45 Q60 5 100 45\" fill=\"none\" stroke=\"#389e94\" stroke-width=\"8\" stroke-linecap=\"round\"/><circle cx=\"60\" cy=\"20\" r=\"8\" fill=\"#f2f2f2\"/></svg>",
    "stats": [
      [
        "Capital",
        "Wellington"
      ],
      [
        "Continent",
        "Oceania"
      ],
      [
        "Languages",
        "Māori, English, and NZ Sign Language"
      ],
      [
        "Money",
        "New Zealand Dollar"
      ],
      [
        "People",
        "about 5.2 million"
      ],
      [
        "Size",
        "about 268,000 km²"
      ]
    ],
    "facts": [
      [
        "🥝",
        "The kiwi bird is flightless, nocturnal, and has nostrils at the very tip of its beak."
      ],
      [
        "🌋",
        "New Zealand has natural hot springs and active geysers in Rotorua."
      ],
      [
        "🌄",
        "Gisborne is the first city in the world to greet the morning sunrise each day."
      ]
    ],
    "script": "Whāia te iti kahurangi",
    "en": "“Aim for the highest star; if you bow, let it be to a lofty mountain.”",
    "note": "A Māori whakataukī (proverb) about lofty dreams.",
    "why": "Reach for your biggest dreams. Aim high and be proud of your efforts."
  },
  {
    "id": "ireland",
    "name": "Ireland",
    "flag": "🇮🇪",
    "lang": "ga",
    "c": "#23733d",
    "cd": "#103d1f",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M30 48 L30 20 Q30 6 60 6 Q90 6 90 20 L90 48 Z\" fill=\"none\" stroke=\"#2fa657\" stroke-width=\"6\"/><circle cx=\"48\" cy=\"26\" r=\"6\" fill=\"#f5a623\"/><circle cx=\"72\" cy=\"26\" r=\"6\" fill=\"#f5a623\"/><circle cx=\"60\" cy=\"18\" r=\"6\" fill=\"#f5a623\"/></svg>",
    "stats": [
      [
        "Capital",
        "Dublin"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Languages",
        "Irish and English"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 5.3 million"
      ],
      [
        "Size",
        "about 70,000 km²"
      ]
    ],
    "facts": [
      [
        "🍀",
        "Ireland is known as the Emerald Isle because of its lush green rolling countryside."
      ],
      [
        "🌊",
        "The Cliffs of Moher rise 214 metres straight out of the Atlantic Ocean."
      ],
      [
        "🧙",
        "Irish folklore is home to stories of leprechauns, giants, and fairy rings."
      ]
    ],
    "script": "Ní neart go cur le chéile",
    "en": "“There is no strength without unity.”",
    "note": "An Irish seanfhocal (ancient proverb) celebrating cooperation.",
    "why": "Stand beside your friends and family. Together you are unstoppable."
  },
  {
    "id": "turkey",
    "name": "Turkey",
    "flag": "🇹🇷",
    "lang": "tr",
    "c": "#9c2d2d",
    "cd": "#541515",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 48 L20 28 Q20 8 60 8 Q100 8 100 28 L100 48 Z\" fill=\"#b83939\"/><circle cx=\"55\" cy=\"26\" r=\"9\" fill=\"#ffffff\"/><circle cx=\"58\" cy=\"26\" r=\"7.5\" fill=\"#b83939\"/></svg>",
    "stats": [
      [
        "Capital",
        "Ankara"
      ],
      [
        "Continent",
        "Spans Asia and Europe"
      ],
      [
        "Language",
        "Turkish"
      ],
      [
        "Money",
        "Turkish Lira"
      ],
      [
        "People",
        "about 85 million"
      ],
      [
        "Size",
        "about 783,000 km²"
      ]
    ],
    "facts": [
      [
        "🌉",
        "Istanbul is the only city in the world located across two continents at once."
      ],
      [
        "🎈",
        "Hot air balloons float over fairy chimneys in Cappadocia every sunrise."
      ],
      [
        "🌷",
        "Tulips were cultivated in Turkey long before they spread across Europe."
      ]
    ],
    "script": "Damlaya damlaya göl olur",
    "en": "“Drop by drop, a lake forms.”",
    "note": "A Turkish proverb on the power of saving small things.",
    "why": "A penny saved, a chapter read, a tree planted: small steps build a grand future."
  },
  {
    "id": "peru",
    "name": "Peru",
    "flag": "🇵🇪",
    "lang": "qu",
    "c": "#a84c24",
    "cd": "#5e250f",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M28 48 L40 10 L80 10 L92 48 Z\" fill=\"#c95f32\"/><path d=\"M46 48 L52 24 L68 24 L74 48 Z\" fill=\"#5e250f\"/></svg>",
    "stats": [
      [
        "Capital",
        "Lima"
      ],
      [
        "Continent",
        "South America"
      ],
      [
        "Languages",
        "Spanish, Quechua, and Aymara"
      ],
      [
        "Money",
        "Peruvian Sol"
      ],
      [
        "People",
        "about 34 million"
      ],
      [
        "Size",
        "about 1.28 million km²"
      ]
    ],
    "facts": [
      [
        "🦙",
        "Machu Picchu was built high in the Andes mountains by the Inca civilization."
      ],
      [
        "🥔",
        "Peru is home to more than 4,000 natural varieties of native potatoes."
      ],
      [
        "🌈",
        "Vinicunca is a real mountain with rainbow stripes created by minerals."
      ]
    ],
    "script": "Ama sua, ama llulla, ama quella",
    "en": "“Do not steal, do not lie, do not be lazy.”",
    "note": "The ancient three-part Quechua moral code of the Inca empire.",
    "why": "Be honest, be truthful, and do your best work every single day."
  },
  {
    "id": "norway",
    "name": "Norway",
    "flag": "🇳🇴",
    "lang": "no",
    "c": "#1c5e8c",
    "cd": "#0e344f",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 48 L20 22 L60 4 L100 22 L100 48 Z\" fill=\"#267cb8\"/><path d=\"M45 4 L60 16 L75 4\" stroke=\"#f2f2f2\" stroke-width=\"4\" fill=\"none\"/></svg>",
    "stats": [
      [
        "Capital",
        "Oslo"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Norwegian"
      ],
      [
        "Money",
        "Norwegian Krone"
      ],
      [
        "People",
        "about 5.5 million"
      ],
      [
        "Size",
        "about 385,000 km²"
      ]
    ],
    "facts": [
      [
        "🌌",
        "The Northern Lights (Aurora Borealis) dance across the winter night sky."
      ],
      [
        "🎿",
        "Modern skiing was born in Telemark, Norway."
      ],
      [
        "🏔️",
        "Norway has over 1,000 dramatic, deep fjords carved by ancient glaciers."
      ]
    ],
    "script": "Ut på tur, aldri sur",
    "en": "“Out on a hike, never grumpy.”",
    "note": "A Norwegian proverb celebrating outdoor adventures.",
    "why": "Step outside into fresh air and nature whenever you need a joyful boost."
  },
  {
    "id": "south-africa",
    "name": "South Africa",
    "flag": "🇿🇦",
    "lang": "zu",
    "c": "#9c6f1a",
    "cd": "#543b0c",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 42 L60 8 L105 42 Z\" fill=\"#c48f29\"/><circle cx=\"60\" cy=\"28\" r=\"9\" fill=\"#2e7d32\"/></svg>",
    "stats": [
      [
        "Capital",
        "Pretoria, Cape Town, and Bloemfontein"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Languages",
        "12 official languages including Zulu, Xhosa, English, and Afrikaans"
      ],
      [
        "Money",
        "South African Rand"
      ],
      [
        "People",
        "about 60 million"
      ],
      [
        "Size",
        "about 1.22 million km²"
      ]
    ],
    "facts": [
      [
        "🐧",
        "Wild African penguins waddle along Boulders Beach in Cape Town."
      ],
      [
        "🏔️",
        "Table Mountain has a flat top over 3 kilometers wide."
      ],
      [
        "🦁",
        "Kruger National Park is one of Africa’s largest animal reserves."
      ]
    ],
    "script": "Umuntu ngumuntu ngabantu",
    "en": "“A person is a person through other people.”",
    "note": "The Zulu concept of Ubuntu: we are bound together.",
    "why": "Treat everyone with kindness, empathy, and respect."
  },
  {
    "id": "thailand",
    "name": "Thailand",
    "flag": "🇹🇭",
    "lang": "th",
    "c": "#a8751e",
    "cd": "#5c3e0a",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 48 L60 6 L105 48 Z\" fill=\"#c9912c\"/><path d=\"M35 48 L60 20 L85 48 Z\" fill=\"#f5cb51\"/><path d=\"M60 6 L60 0\" stroke=\"#e65100\" stroke-width=\"4\"/></svg>",
    "stats": [
      [
        "Capital",
        "Bangkok"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Thai"
      ],
      [
        "Money",
        "Thai Baht"
      ],
      [
        "People",
        "about 71 million"
      ],
      [
        "Size",
        "about 513,000 km²"
      ]
    ],
    "facts": [
      [
        "🐘",
        "The elephant is Thailand’s revered national symbol."
      ],
      [
        "🐒",
        "The city of Lopburi hosts an annual fruit buffet banquet for wild monkeys."
      ],
      [
        "🛶",
        "Bangkok features bustling floating markets on long-tail boats."
      ]
    ],
    "script": "น้ำขึ้นให้รีบตัก",
    "en": "“When the tide rises, fill your bucket.”",
    "note": "A Thai proverb about seizing great opportunities.",
    "why": "When a wonderful chance to learn or play arrives, jump in with enthusiasm!"
  },
  {
    "id": "argentina",
    "name": "Argentina",
    "flag": "🇦🇷",
    "lang": "es",
    "c": "#2b78a8",
    "cd": "#164561",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"15\" y=\"10\" width=\"90\" height=\"8\" fill=\"#64b5f6\"/><rect x=\"15\" y=\"22\" width=\"90\" height=\"8\" fill=\"#ffffff\"/><rect x=\"15\" y=\"34\" width=\"90\" height=\"8\" fill=\"#64b5f6\"/><circle cx=\"60\" cy=\"26\" r=\"6\" fill=\"#fbc02d\"/></svg>",
    "stats": [
      [
        "Capital",
        "Buenos Aires"
      ],
      [
        "Continent",
        "South America"
      ],
      [
        "Language",
        "Spanish"
      ],
      [
        "Money",
        "Argentine Peso"
      ],
      [
        "People",
        "about 46 million"
      ],
      [
        "Size",
        "about 2.78 million km²"
      ]
    ],
    "facts": [
      [
        "🦖",
        "Argentinosaurus, one of the biggest dinosaurs ever discovered, lived in Patagonia."
      ],
      [
        "🌊",
        "Iguazu Falls has 275 distinct roaring waterfalls along the jungle border."
      ],
      [
        "🏔️",
        "Aconcagua is the tallest mountain in the Americas at 6,961 meters."
      ]
    ],
    "script": "Al mal tiempo, buena cara",
    "en": "“Put on a cheerful face in bad weather.”",
    "note": "An Argentine proverb about keeping spirits bright.",
    "why": "When things feel tricky, a cheerful smile brings sunshine back."
  },
  {
    "id": "sweden",
    "name": "Sweden",
    "flag": "🇸🇪",
    "lang": "sv",
    "c": "#1f6ca1",
    "cd": "#0f3c5c",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"15\" y=\"12\" width=\"90\" height=\"28\" fill=\"#006aa7\"/><rect x=\"42\" y=\"12\" width=\"8\" height=\"28\" fill=\"#fecc00\"/><rect x=\"15\" y=\"22\" width=\"90\" height=\"8\" fill=\"#fecc00\"/></svg>",
    "stats": [
      [
        "Capital",
        "Stockholm"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Swedish"
      ],
      [
        "Money",
        "Swedish Krona"
      ],
      [
        "People",
        "about 10.5 million"
      ],
      [
        "Size",
        "about 450,000 km²"
      ]
    ],
    "facts": [
      [
        "👑",
        "Stockholm is built across 14 connected islands with over 50 bridges."
      ],
      [
        "☕",
        "Swedes enjoy “fika”, a daily tradition of pausing for conversation and a cinnamon bun."
      ],
      [
        "🦌",
        "Moose (called the king of the forest) roam freely throughout Swedish woods."
      ]
    ],
    "script": "Borta bra men hemma bäst",
    "en": "“Away is good, but home is best.”",
    "note": "A Swedish proverb about loving your cozy home.",
    "why": "Explore the vast world, but cherish the warmth of your own family and books."
  },
  {
    "id": "iceland",
    "name": "Iceland",
    "flag": "🇮🇸",
    "lang": "is",
    "c": "#235e94",
    "cd": "#113554",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 48 L40 12 L65 48 Z\" fill=\"#ffffff\"/><path d=\"M55 48 L80 12 L105 48 Z\" fill=\"#ffffff\"/><path d=\"M60 48 L60 20\" stroke=\"#d32f2f\" stroke-width=\"4\"/></svg>",
    "stats": [
      [
        "Capital",
        "Reykjavík"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Icelandic"
      ],
      [
        "Money",
        "Icelandic Króna"
      ],
      [
        "People",
        "about 390,000"
      ],
      [
        "Size",
        "about 103,000 km²"
      ]
    ],
    "facts": [
      [
        "🌋",
        "Iceland is known as the Land of Fire and Ice with volcanoes under glaciers."
      ],
      [
        "🐎",
        "Icelandic horses can do a special smooth fifth gait called the tölt."
      ],
      [
        "📚",
        "Iceland publishes more books per person than almost any country."
      ]
    ],
    "script": "Þetta reddast",
    "en": "“It will all work out in the end.”",
    "note": "Iceland’s beloved national motto of resilience.",
    "why": "Do not worry when plans change. Take a breath; things have a way of working out."
  },
  {
    "id": "vietnam",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "lang": "vi",
    "c": "#a62929",
    "cd": "#5e1414",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 26 Q60 10 105 26 L98 34 Q60 20 22 34 Z\" fill=\"#d32f2f\"/><polygon points=\"60,18 63,25 70,25 64,29 66,36 60,32 54,36 56,29 50,25 57,25\" fill=\"#ffeb3b\"/></svg>",
    "stats": [
      [
        "Capital",
        "Hanoi"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Vietnamese"
      ],
      [
        "Money",
        "Vietnamese Đồng"
      ],
      [
        "People",
        "about 100 million"
      ],
      [
        "Size",
        "about 331,000 km²"
      ]
    ],
    "facts": [
      [
        "🐉",
        "Hạ Long Bay has thousands of towering limestone karst islands."
      ],
      [
        "🍜",
        "Pho, a fragrant noodle soup, is enjoyed fresh across Vietnam every morning."
      ],
      [
        "🕳️",
        "Sơn Đoòng is the largest natural cave on Earth, with its own internal clouds."
      ]
    ],
    "script": "Học, học nữa, học mãi",
    "en": "“Learn, learn more, learn forever.”",
    "note": "A Vietnamese teaching on the joy of lifelong discovery.",
    "why": "Every day offers something fresh to discover and enjoy."
  },
  {
    "id": "ghana",
    "name": "Ghana",
    "flag": "🇬🇭",
    "lang": "ak",
    "c": "#a87e19",
    "cd": "#594109",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 45 L60 8 L100 45 Z\" fill=\"#fbc02d\"/><polygon points=\"60,18 63,26 71,26 65,31 67,39 60,34 53,39 55,31 49,26 57,26\" fill=\"#000000\"/></svg>",
    "stats": [
      [
        "Capital",
        "Accra"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Language",
        "English (plus Akan, Ewe, Ga, and more)"
      ],
      [
        "Money",
        "Ghanaian Cedi"
      ],
      [
        "People",
        "about 34 million"
      ],
      [
        "Size",
        "about 238,000 km²"
      ]
    ],
    "facts": [
      [
        "🍫",
        "Ghana produces rich cocoa beans used by chocolate makers all over the world."
      ],
      [
        "🎨",
        "Kente cloth is handwoven with bright symbolic patterns worn on special celebrations."
      ],
      [
        "🏰",
        "Cape Coast and Elmina are home to UNESCO World Heritage coastal fortresses."
      ]
    ],
    "script": "Ti koro nko agyina",
    "en": "“One head does not hold a council.”",
    "note": "An Akan proverb about sharing thoughts and listening.",
    "why": "Listen to others and share your thoughts. Many minds together find great answers."
  },
  {
    "id": "switzerland",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "lang": "de",
    "c": "#ad2b2b",
    "cd": "#631414",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M20 48 L60 8 L100 48 Z\" fill=\"#d32f2f\"/><rect x=\"54\" y=\"20\" width=\"12\" height=\"20\" fill=\"#ffffff\"/><rect x=\"50\" y=\"24\" width=\"20\" height=\"12\" fill=\"#ffffff\"/></svg>",
    "stats": [
      [
        "Capital",
        "Bern"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Languages",
        "German, French, Italian, and Romansh"
      ],
      [
        "Money",
        "Swiss Franc"
      ],
      [
        "People",
        "about 8.9 million"
      ],
      [
        "Size",
        "about 41,000 km²"
      ]
    ],
    "facts": [
      [
        "⛰️",
        "The Matterhorn is one of the world’s most famous pyramid-shaped mountain peaks."
      ],
      [
        "🚂",
        "The Jungfrau railway station is the highest in Europe at 3,454 meters."
      ],
      [
        "🧀",
        "Swiss cheese has natural holes created by harmless bacterial fermentation."
      ]
    ],
    "script": "Unus pro omnibus, omnes pro uno",
    "en": "“One for all, all for one.”",
    "note": "The traditional motto of the Swiss Confederation.",
    "why": "Stand by your team, your class, and your family in everything you do."
  },
  {
    "id": "nepal",
    "name": "Nepal",
    "flag": "🇳🇵",
    "lang": "ne",
    "c": "#a13123",
    "cd": "#57160e",
    "base": 440,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 48 L50 8 L85 48 Z\" fill=\"#b71c1c\"/><path d=\"M45 48 L75 14 L105 48 Z\" fill=\"#b71c1c\"/><circle cx=\"45\" cy=\"34\" r=\"6\" fill=\"#ffffff\"/></svg>",
    "stats": [
      [
        "Capital",
        "Kathmandu"
      ],
      [
        "Continent",
        "Asia"
      ],
      [
        "Language",
        "Nepali"
      ],
      [
        "Money",
        "Nepalese Rupee"
      ],
      [
        "People",
        "about 31 million"
      ],
      [
        "Size",
        "about 147,000 km²"
      ]
    ],
    "facts": [
      [
        "🏔️",
        "Mount Everest (Sagarmatha) is Earth’s highest peak at 8,848.86 meters."
      ],
      [
        "🇳🇵",
        "Nepal has the only national flag that is not rectangular: it has two stacked triangles."
      ],
      [
        "🦏",
        "Chitwan National Park protects one-horned rhinos and Bengal tigers."
      ]
    ],
    "script": "मेहनतको फल मीठो हुन्छ",
    "en": "“The fruit of hard work is sweet.”",
    "note": "A Nepali proverb celebrating honest, diligent effort.",
    "why": "Put your best effort into learning and creating. The reward is wonderful satisfaction."
  },
  {
    "id": "united-states",
    "name": "United States",
    "flag": "🇺🇸",
    "lang": "en",
    "c": "#2c4c7c",
    "cd": "#172b47",
    "base": 523.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><path d=\"M15 15 L60 6 L105 15 L105 32 Q60 46 15 32 Z\" fill=\"#3b639e\"/><polygon points=\"60,18 63,25 70,25 64,29 66,36 60,32 54,36 56,29 50,25 57,25\" fill=\"#fbc02d\"/></svg>",
    "stats": [
      [
        "Capital",
        "Washington, D.C."
      ],
      [
        "Continent",
        "North America"
      ],
      [
        "Language",
        "English"
      ],
      [
        "Money",
        "US Dollar"
      ],
      [
        "People",
        "about 335 million"
      ],
      [
        "Size",
        "about 9.83 million km²"
      ]
    ],
    "facts": [
      [
        "🌲",
        "The giant sequoia tree General Sherman is the world’s largest living tree by volume."
      ],
      [
        "🚀",
        "NASA astronauts landed the first humans on the Moon in July 1969."
      ],
      [
        "🏞️",
        "Yellowstone was created in 1872 as the world’s very first national park."
      ]
    ],
    "script": "Where liberty dwells, there is my country",
    "en": "“Where freedom and kindness live, that is home.”",
    "note": "A famous reflection on liberty by Benjamin Franklin.",
    "why": "Stand up for fairness and create a welcoming world for everyone."
  },
  {
    "id": "nigeria",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "lang": "yo",
    "c": "#1b6939",
    "cd": "#0c3b1e",
    "base": 587.33,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"15\" y=\"10\" width=\"30\" height=\"30\" fill=\"#2e7d32\"/><rect x=\"45\" y=\"10\" width=\"30\" height=\"30\" fill=\"#ffffff\"/><rect x=\"75\" y=\"10\" width=\"30\" height=\"30\" fill=\"#2e7d32\"/></svg>",
    "stats": [
      [
        "Capital",
        "Abuja"
      ],
      [
        "Continent",
        "Africa"
      ],
      [
        "Languages",
        "English (plus Hausa, Yoruba, Igbo, and 500+ more)"
      ],
      [
        "Money",
        "Nigerian Naira"
      ],
      [
        "People",
        "about 225 million"
      ],
      [
        "Size",
        "about 923,000 km²"
      ]
    ],
    "facts": [
      [
        "🌍",
        "Nigeria is the most populous country on the African continent."
      ],
      [
        "🎬",
        "Nollywood produces thousands of creative movies every year."
      ],
      [
        "🦋",
        "Cross River State is famous as a home to unique, colorful tropical butterflies."
      ]
    ],
    "script": "Ile la ti n ko eso r'ode",
    "en": "“Good character begins at home.”",
    "note": "A Yoruba proverb emphasizing kindness at home first.",
    "why": "Start each day being gentle and helpful to the people around you."
  },
  {
    "id": "netherlands",
    "name": "Netherlands",
    "flag": "🇳🇱",
    "lang": "nl",
    "c": "#a35222",
    "cd": "#5e2b0d",
    "base": 659.25,
    "crest": "<svg viewBox=\"0 0 120 50\"><circle cx=\"60\" cy=\"25\" r=\"14\" fill=\"#f57c00\"/><path d=\"M60 11 L60 39 M46 25 L74 25 M50 15 L70 35 M70 15 L50 35\" stroke=\"#ffffff\" stroke-width=\"2.5\"/></svg>",
    "stats": [
      [
        "Capital",
        "Amsterdam"
      ],
      [
        "Continent",
        "Europe"
      ],
      [
        "Language",
        "Dutch"
      ],
      [
        "Money",
        "Euro"
      ],
      [
        "People",
        "about 18 million"
      ],
      [
        "Size",
        "about 41,500 km²"
      ]
    ],
    "facts": [
      [
        "🚲",
        "There are more bicycles in the Netherlands than human residents!"
      ],
      [
        "🌊",
        "About a third of the country sits below sea level, protected by clever dikes."
      ],
      [
        "🌷",
        "Keukenhof park blooms with over seven million flower bulbs every spring."
      ]
    ],
    "script": "Oefening baart kunst",
    "en": "“Practice gives birth to skill.”",
    "note": "A Dutch proverb about artistic dedication.",
    "why": "Keep drawing, building, and trying. Practice turns curiosity into mastery."
  },
  {
    "id": "colombia",
    "name": "Colombia",
    "flag": "🇨🇴",
    "lang": "es",
    "c": "#b87c18",
    "cd": "#664307",
    "base": 493.88,
    "crest": "<svg viewBox=\"0 0 120 50\"><rect x=\"15\" y=\"8\" width=\"90\" height=\"18\" fill=\"#ffd600\"/><rect x=\"15\" y=\"26\" width=\"90\" height=\"9\" fill=\"#0055a5\"/><rect x=\"15\" y=\"35\" width=\"90\" height=\"9\" fill=\"#d32f2f\"/></svg>",
    "stats": [
      [
        "Capital",
        "Bogotá"
      ],
      [
        "Continent",
        "South America"
      ],
      [
        "Language",
        "Spanish"
      ],
      [
        "Money",
        "Colombian Peso"
      ],
      [
        "People",
        "about 52 million"
      ],
      [
        "Size",
        "about 1.14 million km²"
      ]
    ],
    "facts": [
      [
        "🐦",
        "Colombia is home to nearly 2,000 bird species, the highest variety in the world."
      ],
      [
        "🌺",
        "The national flower is the Cattleya trianae, a gorgeous wild orchid."
      ],
      [
        "☕",
        "The high volcanic mountains grow some of the most fragrant Arabica coffee beans."
      ]
    ],
    "script": "Ganas de aprender, camino para crecer",
    "en": "“Eagerness to learn is the pathway to growth.”",
    "note": "A Colombian proverb encouraging curiosity.",
    "why": "Approach every puzzle with enthusiasm. Joyful curiosity opens every door."
  }
];

  const doorsEl = document.getElementById("dowDoors");
  if (!doorsEl) return;
  const $ = id => document.getElementById(id);
  const panel = $("dowPanel"), scriptEl = $("dowScript"), closeBtn = $("dowClose"), toggle = $("dowToggle"), vol = $("dowVol"), countEl = $("dowCount");
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  const SKEY = "ahaanDoorsSound", CKEY = "ahaanDoorsCards";
  let soundOn = false, openId = null, chars = [], raf = 0, mx = 0.5, got = [];

  try { const s = JSON.parse(localStorage.getItem(SKEY)); if (s) { soundOn = !!s.on; if (typeof s.vol === "number") vol.value = s.vol; } } catch (e) {}
  try { const g = JSON.parse(localStorage.getItem(CKEY)); if (Array.isArray(g)) got = g.filter(id => COUNTRIES.some(c => c.id === id)); } catch (e) {}
  const saveSound = () => { try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: +vol.value })); } catch (e) {} };
  const saveCards = () => { try { localStorage.setItem(CKEY, JSON.stringify(got)); } catch (e) {} };
  const paintToggle = () => { toggle.setAttribute("aria-pressed", String(soundOn)); toggle.textContent = "🔔 Soft chime: " + (soundOn ? "on" : "off"); };
  AhaanAudio.setVolume(+vol.value / 100); AhaanAudio.setMuted(!soundOn); paintToggle();
  toggle.addEventListener("click", () => {
    soundOn = !soundOn; AhaanAudio.setMuted(!soundOn); paintToggle(); saveSound();
    if (soundOn) AhaanAudio.bell(523.25, 0, 0.09);        // one soft note so he hears the level he chose
  });
  vol.addEventListener("input", () => { AhaanAudio.setVolume(+vol.value / 100); saveSound(); });

  const buttons = {};
  function paintDoor(ct) {
    const b = buttons[ct.id], has = got.indexOf(ct.id) >= 0;
    b.setAttribute("aria-label", "Open the door of " + ct.name + (has ? " (card collected)" : ""));
    const mark = b.querySelector(".dow-got"); if (mark) mark.hidden = !has;
  }
  function paintCount() {
    countEl.textContent = got.length === COUNTRIES.length ? "🌍 You collected every card!" : "Cards collected: " + got.length + " of " + COUNTRIES.length;
  }
  COUNTRIES.forEach(ct => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "dow-door"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "dowPanel");
    b.innerHTML = '<span class="dow-crest" aria-hidden="true">' + ct.crest + '</span><span class="dow-leaf" style="--c:' + ct.c + ';--cd:' + ct.cd + '"><span class="dow-got" aria-hidden="true" hidden>✓</span><span class="dow-knob"></span><span class="dow-label">' + ct.name.toUpperCase() + '</span></span>';
    b.addEventListener("click", () => (openId === ct.id ? closeDoor() : openDoor(ct)));
    doorsEl.appendChild(b); buttons[ct.id] = b; paintDoor(ct);
  });
  paintCount();

  function chime(base) { [0, 7, 12].forEach((s, i) => AhaanAudio.bell(base * Math.pow(2, s / 12), i * 0.2, 0.09)); }

  function setScript(text, lang) {
    cancelAnimationFrame(raf); scriptEl.innerHTML = ""; chars = [];
    scriptEl.lang = lang; scriptEl.setAttribute("aria-label", text);
    Array.prototype.forEach.call(text, ch => { const s = document.createElement("span"); s.textContent = ch; s.setAttribute("aria-hidden", "true"); scriptEl.appendChild(s); chars.push(s); });
    if (!calm()) sway();
  }
  function sway() {                                       // runs only while a door is open, and only in default motion
    const t = performance.now() / 1000, n = chars.length;
    for (let i = 0; i < n; i++) {
      const prox = n > 1 ? Math.max(0, 1 - Math.abs(i / (n - 1) - mx) * 2.6) : 1;
      const w = Math.sin(t * 1.7 + i * 0.55) * (1.5 + 5 * prox);
      chars[i].style.transform = "translateY(" + w.toFixed(1) + "px) rotate(" + (w * 0.4).toFixed(1) + "deg)";
    }
    raf = requestAnimationFrame(sway);
  }
  panel.addEventListener("mousemove", e => { const r = scriptEl.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; });

  function openDoor(ct) {
    Object.keys(buttons).forEach(k => buttons[k].setAttribute("aria-expanded", String(k === ct.id)));
    openId = ct.id;
    panel.style.setProperty("--c", ct.c);
    $("dowFlag").textContent = ct.flag;
    $("dowNum").textContent = "Card " + (COUNTRIES.indexOf(ct) + 1) + " of " + COUNTRIES.length;
    $("dowName").textContent = ct.name;
    const stats = $("dowStats"); stats.innerHTML = "";
    ct.stats.forEach(s => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = s[0]; dd.textContent = s[1]; d.appendChild(dt); d.appendChild(dd); stats.appendChild(d); });
    const facts = $("dowFacts"); facts.innerHTML = "";
    ct.facts.forEach(f => { const li = document.createElement("li"), e = document.createElement("span"), t = document.createElement("span"); e.textContent = f[0]; e.setAttribute("aria-hidden", "true"); t.textContent = f[1]; li.appendChild(e); li.appendChild(t); facts.appendChild(li); });
    $("dowEn").textContent = ct.en; $("dowNote").textContent = ct.note; $("dowWhy").textContent = ct.why;
    setScript(ct.script, ct.lang);
    const isNew = got.indexOf(ct.id) < 0;
    if (isNew) { got.push(ct.id); saveCards(); paintDoor(ct); paintCount(); }
    $("dowNew").hidden = !isNew;
    panel.hidden = false;
    if (window.CardDialog) CardDialog.open(panel, buttons[ct.id]);
    if (window.AhaanBrush) AhaanBrush.card(panel, ct.c, ct.cd);   // optional painted wash; CSS watercolor is the fallback
    if (soundOn) chime(ct.base);                           // silent unless Ahaan switched the chime on
  }
  function closeDoor() {
    cancelAnimationFrame(raf); openId = null; panel.hidden = true;
    if (window.CardDialog) CardDialog.close(panel);
    Object.keys(buttons).forEach(k => buttons[k].setAttribute("aria-expanded", "false"));
  }
  closeBtn.addEventListener("click", closeDoor);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && openId) { const b = buttons[openId]; closeDoor(); b.focus(); } });
})();
