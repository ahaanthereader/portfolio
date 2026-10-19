/* =================================================================
   ALL CONTENT BELOW IS PLACEHOLDER — swap in Ahaan's real data.
   Kept in clearly-labeled arrays so it's easy to edit.
   ================================================================= */

/* ---- Reading: favorite books ---- */
const BOOKS = [
  { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", cover: "images/book-covers/alice.jpg", color: "var(--plum)", stars: 5,
    blurb: "A girl follows a hurrying rabbit down a hole into a topsy-turvy world of riddles, a grinning cat, and a very grumpy queen. Ahaan's favorite!" },
  { title: "Rapunzel", author: "Paul O. Zelinsky", cover: "images/book-covers/rapunzel.jpg", color: "var(--gold)", stars: 5,
    blurb: "The classic fairy tale of a girl with impossibly long hair, locked away in a tall tower — beautifully retold and painted." },
];

/* ---- Geography: continent facts ---- */
const FACTS = {
  "north-america": { title: "North America 🗽", text: "23 countries and the world's largest island, Greenland. Home to the Grand Canyon and the Great Lakes — the biggest group of freshwater lakes on Earth." },
  "south-america": { title: "South America 🦜", text: "Holds the Amazon, the largest rainforest on Earth, and the Andes, the longest mountain range. Angel Falls in Venezuela is the world's tallest waterfall." },
  "africa":        { title: "Africa 🦁", text: "The second-largest continent with 54 countries — more than any other. The Sahara is the largest hot desert, and the Nile is one of the longest rivers in the world." },
  "europe":        { title: "Europe 🏰", text: "The second-smallest continent but packed with ~44 countries. Russia is the largest country on Earth, and Vatican City is the smallest." },
  "asia":          { title: "Asia 🐯", text: "The biggest and most populous continent — over 4 billion people. It has Mount Everest, the highest point on Earth, and the Dead Sea, the lowest land on Earth." },
  "oceania":       { title: "Oceania 🦘", text: "Thousands of islands across the Pacific, plus Australia. Australia is both a country and a continent, and it's home to the Great Barrier Reef, the largest coral reef system." },
};

/* ---- Geography: the 50 TOUGHEST capitals quiz (all real answers) ---- */
const QUIZ = [
  { q: "Capital of Australia?",                 opts: ["Sydney", "Melbourne", "Canberra", "Perth"], a: 2 },
  { q: "Capital of Turkey?",                    opts: ["Istanbul", "Ankara", "Izmir", "Antalya"], a: 1 },
  { q: "Capital of Canada?",                    opts: ["Toronto", "Vancouver", "Ottawa", "Montreal"], a: 2 },
  { q: "Capital of Switzerland?",               opts: ["Zurich", "Geneva", "Bern", "Basel"], a: 2 },
  { q: "Capital of New Zealand?",               opts: ["Auckland", "Wellington", "Christchurch", "Hamilton"], a: 1 },
  { q: "Capital of Kazakhstan?",                opts: ["Almaty", "Astana", "Shymkent", "Karaganda"], a: 1 },
  { q: "Capital of Myanmar?",                   opts: ["Yangon", "Mandalay", "Naypyidaw", "Bago"], a: 2 },
  { q: "Capital of Nigeria?",                   opts: ["Lagos", "Abuja", "Kano", "Ibadan"], a: 1 },
  { q: "Capital of Côte d'Ivoire?",             opts: ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro"], a: 1 },
  { q: "Capital of Tanzania?",                  opts: ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza"], a: 1 },
  { q: "Capital of Morocco?",                   opts: ["Casablanca", "Marrakesh", "Rabat", "Fez"], a: 2 },
  { q: "Capital of Pakistan?",                  opts: ["Karachi", "Lahore", "Islamabad", "Faisalabad"], a: 2 },
  { q: "Capital of Brazil?",                    opts: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], a: 2 },
  { q: "Constitutional capital of Bolivia?",    opts: ["La Paz", "Sucre", "Santa Cruz", "Cochabamba"], a: 1 },
  { q: "Official capital of Sri Lanka?",        opts: ["Colombo", "Kandy", "Sri Jayawardenepura Kotte", "Galle"], a: 2 },
  { q: "Administrative capital of South Africa?",opts: ["Cape Town", "Johannesburg", "Pretoria", "Durban"], a: 2 },
  { q: "Capital of Saudi Arabia?",              opts: ["Jeddah", "Mecca", "Riyadh", "Medina"], a: 2 },
  { q: "Capital of the United Arab Emirates?",   opts: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"], a: 1 },
  { q: "Capital of Vietnam?",                   opts: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hue"], a: 1 },
  { q: "Official capital of Benin?",            opts: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"], a: 1 },
  { q: "Capital of Cameroon?",                  opts: ["Douala", "Yaoundé", "Bamenda", "Garoua"], a: 1 },
  { q: "Capital of Liechtenstein?",             opts: ["Vaduz", "Schaan", "Triesen", "Balzers"], a: 0 },
  { q: "Capital of Bhutan?",                    opts: ["Paro", "Thimphu", "Punakha", "Phuentsholing"], a: 1 },
  { q: "Capital of Eritrea?",                   opts: ["Asmara", "Massawa", "Keren", "Assab"], a: 0 },
  { q: "Capital of Suriname?",                  opts: ["Georgetown", "Paramaribo", "Cayenne", "Nieuw Nickerie"], a: 1 },
  { q: "Capital of Belize?",                    opts: ["Belize City", "Belmopan", "San Ignacio", "Orange Walk"], a: 1 },
  { q: "Capital of Ecuador?",                   opts: ["Guayaquil", "Quito", "Cuenca", "Manta"], a: 1 },
  { q: "Capital of Equatorial Guinea?",         opts: ["Bata", "Malabo", "Ebebiyín", "Mongomo"], a: 1 },
  { q: "Capital of Palau?",                     opts: ["Koror", "Ngerulmud", "Melekeok", "Airai"], a: 1 },
  { q: "Capital of the Federated States of Micronesia?", opts: ["Palikir", "Weno", "Kolonia", "Tofol"], a: 0 },
  { q: "Capital of Tajikistan?",                opts: ["Dushanbe", "Khujand", "Bokhtar", "Kulob"], a: 0 },
  { q: "Capital of Turkmenistan?",              opts: ["Ashgabat", "Türkmenabat", "Daşoguz", "Mary"], a: 0 },
  { q: "Capital of Kyrgyzstan?",                opts: ["Osh", "Bishkek", "Jalal-Abad", "Karakol"], a: 1 },
  { q: "Capital of Azerbaijan?",                opts: ["Baku", "Ganja", "Sumqayit", "Lankaran"], a: 0 },
  { q: "Capital of Georgia (country)?",         opts: ["Batumi", "Tbilisi", "Kutaisi", "Rustavi"], a: 1 },
  { q: "Capital of Moldova?",                   opts: ["Tiraspol", "Chișinău", "Bălți", "Bender"], a: 1 },
  { q: "Capital of Montenegro?",                opts: ["Podgorica", "Cetinje", "Nikšić", "Budva"], a: 0 },
  { q: "Capital of North Macedonia?",           opts: ["Skopje", "Bitola", "Kumanovo", "Ohrid"], a: 0 },
  { q: "Capital of Bosnia and Herzegovina?",    opts: ["Sarajevo", "Banja Luka", "Mostar", "Tuzla"], a: 0 },
  { q: "Capital of Slovenia?",                  opts: ["Maribor", "Ljubljana", "Celje", "Koper"], a: 1 },
  { q: "Capital of Slovakia?",                  opts: ["Košice", "Bratislava", "Nitra", "Žilina"], a: 1 },
  { q: "Capital of the Maldives?",              opts: ["Malé", "Hulhumalé", "Addu City", "Fuvahmulah"], a: 0 },
  { q: "Capital of Brunei?",                    opts: ["Kuala Belait", "Bandar Seri Begawan", "Seria", "Tutong"], a: 1 },
  { q: "Capital of Laos?",                      opts: ["Luang Prabang", "Vientiane", "Pakse", "Savannakhet"], a: 1 },
  { q: "Capital of Papua New Guinea?",          opts: ["Lae", "Port Moresby", "Mount Hagen", "Madang"], a: 1 },
  { q: "Capital of Vanuatu?",                   opts: ["Luganville", "Port Vila", "Norsup", "Isangel"], a: 1 },
  { q: "Capital of the Marshall Islands?",      opts: ["Majuro", "Ebeye", "Jabor", "Wotje"], a: 0 },
  { q: "Capital of Tonga?",                     opts: ["Nuku'alofa", "Neiafu", "Pangai", "Haveluloto"], a: 0 },
  { q: "Capital of Mauritius?",                 opts: ["Port Louis", "Curepipe", "Vacoas", "Beau Bassin"], a: 0 },
  { q: "De facto capital of Nauru?",            opts: ["Yaren", "Aiwo", "Denigomodu", "Meneng"], a: 0 },
];

/* ---- Library: Ahaan's REAL current checkouts (from the library app) ---- */
const CHECKOUTS = [
  { title: "Countries of the World", author: "Andrea Mills", stamp: "DUE JUN 6", color: "var(--sky)" },
  { title: "Colombia",              author: "Golriz Golkar", stamp: "DUE JUN 6", color: "var(--gold)" },
  { title: "South Africa",          author: "Alicia Klepeis", stamp: "DUE JUN 6", color: "var(--plum)" },
  { title: "Angola",                author: "Sean Sheehan", stamp: "DUE JUN 6", cover: "images/book-covers/angola.jpg" },
  { title: "Chad",                  author: "Martha Kneib", stamp: "DUE JUN 6", cover: "images/book-covers/chad.jpg" },
  { title: "Mali",                  author: "Ettagale Blauer", stamp: "DUE JUN 6", cover: "images/book-covers/mali.jpg" },
  { title: "The Travel Bucket List", author: "Lonely Planet", stamp: "DUE JUN 6", color: "var(--terra)" },
];
const LIB_STATS = { books: "7", renewals: "3", genre: "Geography" };
window.CHECKOUTS = CHECKOUTS;
window.BOOKS = BOOKS;

/* ---- Timeline ---- */
const TIMELINE = [
  { yr: "2022", text: "Read my first chapter book 📖" },
  { yr: "2023", text: "Memorized all the capitals 🗺️" },
  { yr: "Recently", text: "Got my own library card 📚" },
  { yr: "Now",  text: "Reading a whole stack of country books — and writing my own stories! ✍️" },
];

/* =================================================================
   RENDER + INTERACTIONS
   ================================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stars = n => "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);

/* ---- Rewards: unlockable badges earned by exploring the site (localStorage) ---- */
const BADGES = [
  { id: "bookworm",     emoji: "📖", title: "Bookworm",     desc: "Opened a book to read" },
  { id: "globetrotter", emoji: "🗺️", title: "Globe Trotter", desc: "Explored 5 countries" },
  { id: "quizwhiz",     emoji: "🧠", title: "Quiz Whiz",     desc: "Tried the capitals quiz" },
  { id: "pianist",      emoji: "🎹", title: "Little Mozart", desc: "Played the piano" },
  { id: "storyteller",  emoji: "✍️", title: "Storyteller",   desc: "Wrote a story page" },
  { id: "planner",      emoji: "📅", title: "Planner",       desc: "Stickered the calendar" },
  { id: "skyswinger",   emoji: "🌳", title: "Sky Swinger",   desc: "Swung super high" },
  { id: "calmcat",      emoji: "🎧", title: "Calm Cat",      desc: "Played calm music" },
  { id: "gamer",        emoji: "🎮", title: "Game Champ",    desc: "Played an arcade game" },
];
const RKEY = "ahaan-badges";
let earned = {};
try { earned = JSON.parse(localStorage.getItem(RKEY)) || {}; } catch (e) { earned = {}; }

function renderBadges() {
  const grid = $("#badgeGrid"); if (!grid) return;
  grid.innerHTML = BADGES.map(b => `
    <div class="badge ${earned[b.id] ? "earned" : ""}" data-id="${b.id}">
      <div class="b-lock">${earned[b.id] ? "✅" : "🔒"}</div>
      <div class="b-emoji">${b.emoji}</div>
      <div class="b-title">${b.title}</div>
      <div class="b-desc">${b.desc}</div>
    </div>`).join("");
  const n = BADGES.filter(b => earned[b.id]).length;
  $("#badgeCount").textContent = n;
  $("#badgeTotal").textContent = BADGES.length;
  $("#badgeFill").style.width = (n / BADGES.length * 100) + "%";
  $("#badgeMsg").textContent = n === 0 ? "Explore the site to light up your badges! ✨"
    : n === BADGES.length ? "🎉 WOW! You collected every badge — you're a superstar!"
    : `Awesome! ${BADGES.length - n} more to collect.`;
}

function award(id) {
  if (earned[id]) return;
  const badge = BADGES.find(b => b.id === id); if (!badge) return;
  earned[id] = true;
  localStorage.setItem(RKEY, JSON.stringify(earned));
  renderBadges();
  const el = $(`.badge[data-id="${id}"]`);
  if (el) { el.classList.add("just-earned"); setTimeout(() => el.classList.remove("just-earned"), 600); }
  showToast(`🎉 New badge: ${badge.title}!`);
  confettiBurst();
}

let _toastT;
function showToast(msg) {
  const t = $("#rewardToast"); if (!t) return;
  t.textContent = msg; t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove("show"), 2400);
}

function confettiBurst() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bits = ["🎉", "⭐", "🎈", "✨", "🏅"];
  for (let i = 0; i < 18; i++) {
    const c = document.createElement("div");
    c.className = "confetti-bit";
    c.textContent = bits[i % bits.length];
    c.style.left = (38 + Math.random() * 24) + "vw";
    c.style.top = "72vh";
    document.body.appendChild(c);
    const dx = (Math.random() * 2 - 1) * 42, dy = -(30 + Math.random() * 42), rot = (Math.random() * 2 - 1) * 360;
    c.animate(
      [{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: `translate(${dx}vw, ${dy}vh) rotate(${rot}deg)`, opacity: 0 }],
      { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => c.remove();
  }
}

renderBadges();

/* ---- Mobile menu ---- */
(() => {
  const btn = $("#menuBtn"), links = $("#navLinks");
  if (btn && links) {
    btn.addEventListener("click", () => { btn.classList.toggle("open"); links.classList.toggle("open"); });
    $$("#navLinks a").forEach(a => a.addEventListener("click", () => { btn.classList.remove("open"); links.classList.remove("open"); }));
  }
  // Grouped menus (Read / Explore / Play / My stuff): open on click, one at a time; Esc or a click outside closes.
  const groups = $$(".nav-group");
  const closeAll = keep => groups.forEach(g => { if (g !== keep) { g.classList.remove("open"); g.querySelector(".nav-gbtn").setAttribute("aria-expanded", "false"); } });
  groups.forEach(g => {
    const b = g.querySelector(".nav-gbtn");
    b.addEventListener("click", e => { e.stopPropagation(); const open = !g.classList.contains("open"); closeAll(g); g.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open)); });
  });
  document.addEventListener("click", e => { if (!e.target.closest(".nav-group")) closeAll(); });
  document.addEventListener("keydown", e => { if (e.key !== "Escape") return; const g = groups.find(x => x.classList.contains("open")); if (g) { closeAll(); g.querySelector(".nav-gbtn").focus(); } });
})();

/* ---- Card dialogs (Doors, Bells): the card opens over a softly dimmed page, so each page stays one screen ---- */
window.CardDialog = (() => {
  let back = null, current = null, returnTo = null, origParent = null, origNext = null;
  function backdrop() {
    if (back) return back;
    back = document.createElement("div"); back.className = "card-backdrop"; back.hidden = true;
    back.addEventListener("click", () => { const c = current && current.querySelector(".dow-close"); if (c) c.click(); });
    document.body.appendChild(back); return back;
  }
  return {
    open(panel, from) {
      backdrop().hidden = false; current = panel; returnTo = from || document.activeElement;
      if (panel.parentNode !== document.body) {
        origParent = panel.parentNode; origNext = panel.nextSibling;
        document.body.appendChild(panel);
      }
      panel.classList.add("as-dialog"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.removeAttribute("aria-live");
      const c = panel.querySelector(".dow-close"); if (c) c.focus({ preventScroll: true });
    },
    close(panel) {
      if (back) back.hidden = true;
      panel.classList.remove("as-dialog");
      if (origParent && panel.parentNode === document.body) {
        origParent.insertBefore(panel, origNext);
        origParent = null; origNext = null;
      }
      current = null;
      if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true }); returnTo = null;
    }
  };
})();

/* ---- Navbar elevation on scroll ---- */
(() => {
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("elevated", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
})();
