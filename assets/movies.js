/* ---- Movies: favorites grid + popcorn "what to watch" spinner ---- */
(() => {
  // PLACEHOLDER favorites — swap in Ahaan's real movies (name, why he loves it).
  const MOVIES = [
    { name: "Add a favorite", emoji: "🎬", color: "var(--plum)",   stars: 5, why: "Tell me one of Ahaan's favorite movies and I'll add it here!" },
    { name: "Add a favorite", emoji: "🍿", color: "var(--forest)", stars: 5, why: "What movie makes Ahaan laugh the most?" },
    { name: "Add a favorite", emoji: "🎥", color: "var(--terra)",  stars: 5, why: "His all-time favorite goes here." },
    { name: "Add a favorite", emoji: "⭐", color: "var(--sky)",    stars: 4, why: "A movie he could watch again and again." },
  ];
  const grid = $("#movieGrid");
  if (grid) {
    grid.innerHTML = MOVIES.map(m => `
      <div class="movie" title="${m.why}">
        <div class="poster" style="background:${m.color}">
          <span class="pico">${m.emoji}</span>
          <span class="pname">${m.name}</span>
        </div>
        <div class="mmeta">
          <div class="stars">${stars(m.stars)}</div>
          <div class="mby">${m.why}</div>
        </div>
      </div>`).join("");
  }

  const IDEAS = [
    "🦸 A superhero adventure!",
    "🚀 A trip to outer space!",
    "🐾 A funny animal cartoon!",
    "🏰 A magical fairy-tale!",
    "🦖 Dinosaurs vs. everything!",
    "🕵️ A mystery to solve!",
    "🌊 An underwater adventure!",
    "🤖 Robots and gadgets!",
    "😂 A silly laugh-out-loud comedy!",
    "🗺️ An around-the-world journey!",
    "🐉 Dragons and brave heroes!",
    "🎢 A wild theme-park ride of a movie!",
  ];
  const btn = $("#spinBtn"), out = $("#spinResult");
  if (btn) btn.addEventListener("click", () => {
    let n = 0;
    const tick = () => {
      out.textContent = IDEAS[Math.floor(Math.random() * IDEAS.length)];
      if (++n < 10) { setTimeout(tick, 70 + n * 14); }
      else { out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop"); out.textContent = "Tonight: " + IDEAS[Math.floor(Math.random() * IDEAS.length)]; }
    };
    tick();
  });
})();
