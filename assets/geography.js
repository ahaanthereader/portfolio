/* ---- Geography: click ANY country on the map ---- */
(() => {
  const svg = $(".map-card svg"); if (!svg) return;
  // Countries Ahaan currently has library books about (must match map labels)
  const BOOK_COUNTRIES = {
    "Colombia":     "Golriz Golkar",
    "South Africa": "Alicia Klepeis",
    "Angola":       "Sean Sheehan",
    "Chad":         "Martha Kneib",
    "Mali":         "Ettagale Blauer",
  };
  const slug = c => c.toLowerCase().replace(/ /g, "-");

  // Highlight the countries he's reading about
  $$(".cont path", svg).forEach(p => {
    const name = p.querySelector("title")?.textContent;
    if (name && BOOK_COUNTRIES[name]) p.classList.add("book");
  });

  const explored = new Set();
  svg.addEventListener("click", e => {
    const path = e.target.closest("path"); if (!path) return;
    $$(".cont path.active", svg).forEach(p => p.classList.remove("active"));
    path.classList.add("active");
    const name = path.querySelector("title")?.textContent || "Somewhere";
    explored.add(name);
    if (explored.size >= 5) award("globetrotter");
    const cont = path.closest(".cont")?.dataset.name || "the world";
    const fact = FACTS[slug(cont)]?.text || "";
    const note = BOOK_COUNTRIES[name]
      ? `📚 Ahaan has a library book all about ${name}, by ${BOOK_COUNTRIES[name]}! `
      : "";
    $("#factTitle").textContent = `${name}`;
    $("#factText").textContent = `${note}🌍 ${name} is in ${cont}. ${fact}`;
  });
})();
