/* ---- Pick a sweet: every page is a candy. Clicking one sends it to 3D Ahaan, he eats it, and the page opens.
   Calm mode (reduced motion) and modified clicks (new tab, etc.) just follow the link. ---- */
(function () {
  const GROUPS = [
    ["📚 Read", [["reading.html", "Reading"], ["kindle.html", "Kindle"], ["library.html", "Library"], ["story.html", "Stories"], ["sketchbook.html", "Sketch"]]],
    ["🧭 Explore", [["geography.html", "Maps"], ["quiz.html", "Quiz"], ["doors.html", "Doors"], ["bells.html", "Bells"]]],
    ["🎈 Play", [["swing.html", "Swing"], ["games.html", "Games"], ["music.html", "Music"], ["movies.html", "Movies"]]],
    ["⭐ My stuff", [["calendar.html", "Calendar"], ["rewards.html", "Rewards"], ["journey.html", "Journey"]]]
  ];
  const COLORS = ["#f28b82", "#f7b267", "#f2cf4a", "#8fd19e", "#7cc4e4", "#b39ddb", "#f4a6c6"];
  const shelf = document.getElementById("candyShelf");
  if (!shelf) return;
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";

  // Our own sweets: wrapped candy, swirl lollipop, gummy bear, peppermint, heart lollipop.
  const ART = [
    c => `<path d="M24 40 L6 28 L10 40 L6 52 Z M56 40 L74 28 L70 40 L74 52 Z" fill="${c}" opacity=".75"/><ellipse cx="40" cy="40" rx="19" ry="15" fill="${c}"/><path d="M30 30 Q36 40 30 50 M42 27 Q48 40 42 53" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`,
    c => `<rect x="38" y="44" width="4.5" height="32" rx="2" fill="#f3e9da" stroke="#d8c8ae"/><circle cx="40" cy="30" r="20" fill="${c}"/><path d="M40 30 m-14 0 a14 14 0 1 1 28 0 a10 10 0 1 1 -20 0 a6 6 0 1 1 12 0" stroke="#fff" stroke-width="3.5" fill="none" opacity=".85"/>`,
    c => `<g fill="${c}" opacity=".9"><circle cx="31" cy="15" r="5"/><circle cx="49" cy="15" r="5"/><circle cx="40" cy="24" r="11"/><ellipse cx="40" cy="49" rx="15" ry="18"/><ellipse cx="25" cy="43" rx="5" ry="8"/><ellipse cx="55" cy="43" rx="5" ry="8"/><ellipse cx="32" cy="66" rx="6" ry="5"/><ellipse cx="48" cy="66" rx="6" ry="5"/></g><ellipse cx="35" cy="42" rx="4" ry="7" fill="#fff" opacity=".4"/><circle cx="36" cy="22" r="1.6" fill="#3a2e21"/><circle cx="44" cy="22" r="1.6" fill="#3a2e21"/>`,
    c => `<circle cx="40" cy="40" r="21" fill="#fffaf2" stroke="#e8dcc8"/><g fill="${c}"><path d="M40 40 L40 19 A21 21 0 0 1 58 29 Z"/><path d="M40 40 L58 51 A21 21 0 0 1 40 61 Z"/><path d="M40 40 L22 51 A21 21 0 0 1 22 29 Z"/></g><circle cx="40" cy="40" r="5" fill="#fffaf2"/>`,
    c => `<rect x="38" y="46" width="4.5" height="30" rx="2" fill="#f3e9da" stroke="#d8c8ae"/><path d="M40 50 C20 38 18 20 30 16 C36 14 40 19 40 22 C40 19 44 14 50 16 C62 20 60 38 40 50 Z" fill="${c}"/><ellipse cx="32" cy="26" rx="4" ry="6" fill="#fff" opacity=".45"/>`
  ];

  let i = 0;
  GROUPS.forEach(([title, links]) => {
    const g = document.createElement("div");
    g.className = "candy-group"; g.setAttribute("role", "group"); g.setAttribute("aria-label", title.replace(/^\S+\s/, ""));
    g.style.setProperty("--n", links.length);
    g.innerHTML = '<div class="candy-glabel" aria-hidden="true">' + title + '</div><div class="candy-row"></div>';
    const row = g.querySelector(".candy-row");
    links.forEach(([href, label]) => {
      const a = document.createElement("a");
      a.className = "candy"; a.href = href;
      a.innerHTML = '<span class="candy-art" aria-hidden="true"><svg viewBox="0 0 80 80">' + ART[i % ART.length](COLORS[i % COLORS.length]) + '</svg></span><span class="candy-label">' + label + "</span>";
      a.addEventListener("click", e => eat(e, a));
      row.appendChild(a); i++;
    });
    shelf.appendChild(g);
  });

  // Five silly comic lines per page (original, in a goofy comic-book spirit). One is picked at random,
  // never the same as last time for that page, so Ahaan doesn't get bored.
  const PHRASES = {
    "reading.html": ["Bookworm power, ACTIVATE!", "This book is so good my eyeballs did a backflip!", "Shh... the pages are whispering!", "One more chapter. Okay, FIVE more!", "Reading gives my brain the zoomies!"],
    "kindle.html": ["Beep boop! Story download complete!", "My Kindle is HUNGRY for stories!", "Swipe, swipe... ADVENTURE!", "Tiny screen, GIGANTIC stories!", "Page-turning power: 1000 percent!"],
    "library.html": ["To the library, at TOP SPEED!", "Shhh... ZOOM! Library mode!", "So many books, so little bedtime!", "Library card: FULLY CHARGED!", "The books missed me. I could tell."],
    "story.html": ["Once upon a time... something SILLY happened!", "Author Ahaan is IN the building!", "My pencil has BIG plans!", "Warning: this story may contain giggles!", "Plot twist: the hot dog was the hero all along!"],
    "sketchbook.html": ["Time to draw and explore!", "Singapore sketchbook open!", "Check out these cool drawings!", "Magnifying glass ready!", "Curled pages feel like real paper!"],
    "geography.html": ["Map-tastic! Where to, Captain?", "Continents, ASSEMBLE!", "Latitude! Longitude! LUNCH-itude!", "Adventure is THAT way. Probably.", "I can see my house from here! (Not really.)"],
    "quiz.html": ["Brain, don't fail me now!", "Capital cities? I've GOT this!", "Ding ding! Quiz brain ONLINE!", "My brain is doing push-ups!", "Ask me anything. Well... almost anything!"],
    "doors.html": ["Knock knock! Who's there? THE WHOLE WORLD!", "Which door? ALL the doors!", "Opening doors like a PRO!", "Wisdom delivery, coming right up!", "Behind this door: something AWESOME!"],
    "bells.html": ["DING! DONG! Hello, world!", "Ring-a-ding-ding, here I go!", "Bells of the world, UNITE!", "Jingle mode: ON!", "Tiny ring, BIG smile!"],
    "swing.html": ["Higher! HIGHER! To the MOON!", "Whoosh! My tummy just did a flip!", "Swing champion, reporting for duty!", "I'm basically flying. Pretty much.", "Up, up, and a-SWING!"],
    "games.html": ["Game face: ON!", "Ready, set, GAME TIME!", "Level up, here I come!", "Victory dance... loading...", "High score, you're MINE!"],
    "music.html": ["Drop the beat! (Gently.)", "My ears are throwing a PARTY!", "La la la... I'm a ROCK STAR!", "Piano fingers: warmed up!", "This song is stuck in my brain. GOOD!"],
    "movies.html": ["Lights, camera, SNACKS!", "Popcorn ready! Eyeballs ready!", "Movie night is the BEST night!", "Plot twist: I ate all the popcorn!", "Shh... the good part is coming!"],
    "calendar.html": ["What day is it? FUN day!", "Stickers on my calendar? YES!", "Planning mode: ACTIVATED!", "Today is a great day to be awesome!", "Countdown to fun: 3... 2... 1!"],
    "rewards.html": ["Badge time! SHINY!", "Look at all my trophies!", "Achievement unlocked: being AWESOME!", "Gold star for ME!", "My badges are sparkling at me!"],
    "journey.html": ["Look how far I've come!", "Chapter one: me! Chapter two: ALSO me!", "My story so far is EPIC!", "Time machine, take me back!", "From tiny to TERRIFIC!"]
  };
  function phraseFor(href) {
    const list = PHRASES[href] || ["YUM! Let's go!"];
    let lastMap = {}; try { lastMap = JSON.parse(localStorage.getItem("ahaanPhraseLast")) || {}; } catch (e) {}
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastMap[href]) i = (i + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
    lastMap[href] = i; try { localStorage.setItem("ahaanPhraseLast", JSON.stringify(lastMap)); } catch (e) {}
    return list[i];
  }
  function bubble(text, at) {
    const b = document.createElement("div"); b.className = "comic-bubble"; b.setAttribute("role", "status"); b.textContent = text;
    const m = (window.AhaanFigure && AhaanFigure.mouth && AhaanFigure.mouth()) || at;
    Object.assign(b.style, { left: Math.max(290, m.x - 30) + "px", top: (m.y + 46) + "px" });
    document.body.appendChild(b);
  }
  function burst(text, at) {
    const b = document.createElement("div"); b.className = "comic-burst"; b.setAttribute("aria-hidden", "true"); b.textContent = text;
    Object.assign(b.style, { left: at.x + 70 + "px", top: at.y + 10 + "px" }); document.body.appendChild(b);
  }

  let busy = false, timers = [];
  function eat(e, a) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || calm()) return;   // normal link
    e.preventDefault();
    if (busy) return; busy = true;
    const F = window.AhaanFigure || {}, href = a.getAttribute("href");
    const art = a.querySelector(".candy-art"), r = art.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const fig = document.getElementById("ahaanFigure").getBoundingClientRect();
    const fallback = { x: fig.left + fig.width / 2, y: fig.top + fig.height * 0.2 };
    const where = fn => (typeof fn === "function" && fn()) || fallback;
    const fly = art.cloneNode(true);
    fly.className = "candy-fly";
    Object.assign(fly.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.appendChild(fly);
    const moveTo = (pt, scale, ms) => { fly.style.transitionDuration = ms + "ms, 250ms"; fly.style.transform = "translate(" + (pt.x - cx) + "px," + (pt.y - cy) + "px) scale(" + scale + ") rotate(20deg)"; };
    const go = () => { if (busy) location.href = a.href; };
    if (F.pose) F.pose("reach");                                                               // 1. he reaches for the sweet
    timers = [
      setTimeout(() => moveTo(where(F.hand), 0.55, 420), 300),                                  // 2. it lands in his hand
      setTimeout(() => { if (F.pose) F.pose("mouth"); moveTo(where(F.mouth), 0.4, 380); }, 760), // 3. hand to mouth
      setTimeout(() => {                                                                        // 4. CHOMP! and a silly line
        fly.style.opacity = "0"; if (F.chomp) F.chomp();
        burst("CHOMP!", where(F.mouth)); bubble(phraseFor(href), where(F.head));
      }, 1160),
      setTimeout(() => { if (F.pose) F.pose("rest"); }, 1600),
      setTimeout(go, 3000)                                                                      // 5. off to the page
    ];
    setTimeout(() => document.addEventListener("click", go, { once: true }), 50);              // a click anywhere skips ahead
  }
  // Coming back with the Back button: clear any leftover sweets.
  addEventListener("pageshow", () => { busy = false; timers.forEach(clearTimeout); if (window.AhaanFigure && AhaanFigure.pose) AhaanFigure.pose("rest"); document.querySelectorAll(".candy-fly, .nom, .comic-bubble, .comic-burst").forEach(n => n.remove()); });
})();
