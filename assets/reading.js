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

  const prev = $("#shelfPrev"), next = $("#shelfNext");
  if (prev && next) {
    const updateArrows = () => {
      const canScroll = shelf.scrollWidth > shelf.clientWidth + 4;
      prev.hidden = !canScroll;
      next.hidden = !canScroll;
      prev.disabled = shelf.scrollLeft <= 4;
      next.disabled = shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 4;
    };
    prev.addEventListener("click", () => { shelf.scrollBy({ left: -280, behavior: "smooth" }); setTimeout(updateArrows, 320); });
    next.addEventListener("click", () => { shelf.scrollBy({ left: 280, behavior: "smooth" }); setTimeout(updateArrows, 320); });
    shelf.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    setTimeout(updateArrows, 100);
  }
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
