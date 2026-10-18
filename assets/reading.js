/* ---- Render books ---- */
(() => {
  const shelf = $("#shelf");
  shelf.innerHTML = BOOKS.map((b, i) => `
    <div class="book" data-i="${i}">
      <div class="cover" style="background:${b.color}">
        ${b.cover ? `<img src="${b.cover}" alt="${b.title} cover">` : b.title}
      </div>
      <div class="meta">
        <div class="by">${b.author}</div>
        <div class="stars">${stars(b.stars)}</div>
      </div>
    </div>`).join("");
  shelf.addEventListener("click", e => {
    const card = e.target.closest(".book"); if (!card) return;
    openBook(BOOKS[card.dataset.i]);
  });
})();

/* ---- Book lightbox ---- */
function openBook(b) {
  const cov = $("#lbCover");
  if (b.cover) { cov.textContent = ""; cov.style.background = `url("${b.cover}") center/cover, ${b.color}`; }
  else { cov.textContent = b.title; cov.style.background = b.color; }
  $("#lbTitle").textContent = b.title;
  $("#lbBy").textContent = "by " + b.author;
  $("#lbStars").textContent = stars(b.stars);
  $("#lbBlurb").textContent = b.blurb;
  $("#lb").classList.add("open");
}
(() => {
  const lb = $("#lb");
  $("#lbClose").addEventListener("click", () => lb.classList.remove("open"));
  lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("open"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });
})();
