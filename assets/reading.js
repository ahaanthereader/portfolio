/* ---- Render books ---- */
(() => {
  const shelf = $("#shelf");
  shelf.innerHTML = BOOKS.map((b, i) => {
    const tag = b.href ? "a" : "button";
    const href = b.href ? ` href="${b.href}"` : ` type="button" data-i="${i}"`;
    const label = b.href ? ` aria-label="${b.title}, by ${b.author}. Open book."` : ` aria-label="Open ${b.title} details"`;
    return `<${tag} class="book"${href}${label}>
      <span class="cover" style="background:${b.color}">
        ${b.cover ? `<img src="${b.cover}" alt="${b.title} cover">` : b.title}
      </span>
      <span class="meta">
        <span class="by">${b.author}</span>
        <span class="stars" aria-label="${b.stars} out of 5 stars">${stars(b.stars)}</span>
      </span>
    </${tag}>`;
  }).join("");
  shelf.addEventListener("click", e => {
    const card = e.target.closest("button.book"); if (!card) return;
    openBook(BOOKS[card.dataset.i]);
  });

  const prev = $("#shelfPrev"), next = $("#shelfNext");
  if (prev && next) {
    const updateArrows = () => {
      const canScroll = shelf.scrollWidth > shelf.clientWidth + 4;
      prev.hidden = !canScroll || shelf.scrollLeft <= 10;
      next.hidden = !canScroll || shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 10;
    };
    const scrollStep = direction => {
      const card = shelf.querySelector(".book");
      shelf.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 220) + 18), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    };
    prev.addEventListener("click", () => scrollStep(-1));
    next.addEventListener("click", () => scrollStep(1));
    shelf.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    window.addEventListener("load", updateArrows, { once: true });
    if ("ResizeObserver" in window) new ResizeObserver(updateArrows).observe(shelf);
    requestAnimationFrame(updateArrows);
    setTimeout(updateArrows, 100);

    let dragStart = null;
    let suppressClick = false;
    shelf.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragStart = { x: e.clientX, left: shelf.scrollLeft, moved: false };
      shelf.classList.add("is-dragging");
    });
    shelf.addEventListener("pointermove", e => {
      if (!dragStart) return;
      const distance = e.clientX - dragStart.x;
      if (Math.abs(distance) > 5 && !dragStart.moved) {
        dragStart.moved = true;
        shelf.setPointerCapture(e.pointerId);
      }
      if (dragStart.moved) shelf.scrollLeft = dragStart.left - distance;
    });
    const stopDrag = () => {
      if (dragStart?.moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      }
      dragStart = null;
      shelf.classList.remove("is-dragging");
    };
    shelf.addEventListener("click", e => {
      if (!suppressClick || e.detail === 0) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      suppressClick = false;
    }, true);
    shelf.addEventListener("pointerup", stopDrag);
    shelf.addEventListener("pointercancel", stopDrag);
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
