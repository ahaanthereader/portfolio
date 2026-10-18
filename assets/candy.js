/* ---- Pick a sweet: every page is a candy. Clicking one sends it to 3D Ahaan, he eats it, and the page opens.
   Calm mode (reduced motion) and modified clicks (new tab, etc.) just follow the link. ---- */
(function () {
  const PAGES = [
    ["reading.html", "Reading"], ["kindle.html", "Kindle"], ["geography.html", "Geography"], ["quiz.html", "Quiz"],
    ["doors.html", "Doors"], ["bells.html", "Bells"], ["swing.html", "The Swing"], ["library.html", "Library"],
    ["story.html", "Story Studio"], ["music.html", "Music"], ["movies.html", "Movies"], ["games.html", "Games"],
    ["calendar.html", "Calendar"], ["rewards.html", "Rewards"], ["journey.html", "Journey"]
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

  PAGES.forEach(([href, label], i) => {
    const a = document.createElement("a");
    a.className = "candy"; a.href = href;
    a.innerHTML = '<span class="candy-art" aria-hidden="true"><svg viewBox="0 0 80 80">' + ART[i % ART.length](COLORS[i % COLORS.length]) + '</svg></span><span class="candy-label">' + label + "</span>";
    a.addEventListener("click", e => eat(e, a));
    shelf.appendChild(a);
  });

  let busy = false;
  function eat(e, a) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || calm()) return;   // normal link
    e.preventDefault();
    if (busy) return; busy = true;
    const art = a.querySelector(".candy-art"), r = art.getBoundingClientRect();
    let to = window.AhaanFigure && AhaanFigure.mouth();
    if (!to) { const fig = document.getElementById("ahaanFigure").getBoundingClientRect(); to = { x: fig.left + fig.width / 2, y: fig.top + fig.height * 0.2 }; }
    const fly = art.cloneNode(true);
    fly.className = "candy-fly";
    Object.assign(fly.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.appendChild(fly);
    const dx = to.x - (r.left + r.width / 2), dy = to.y - (r.top + r.height / 2);
    requestAnimationFrame(() => requestAnimationFrame(() => { fly.style.transform = "translate(" + dx + "px," + dy + "px) scale(.35) rotate(25deg)"; }));
    setTimeout(() => {
      fly.style.opacity = "0";
      if (window.AhaanFigure) AhaanFigure.chomp();
      const nom = document.createElement("div"); nom.className = "nom"; nom.textContent = "Nom nom!";
      Object.assign(nom.style, { left: to.x + "px", top: to.y + "px" }); document.body.appendChild(nom);
    }, 650);
    setTimeout(() => { location.href = a.href; }, 1300);
  }
  // Coming back with the Back button: clear any leftover sweets.
  addEventListener("pageshow", () => { busy = false; document.querySelectorAll(".candy-fly, .nom").forEach(n => n.remove()); });
})();
