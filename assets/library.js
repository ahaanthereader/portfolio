/* ---- Library rows, stats + 3D AshenPress tab switching ---- */
(() => {
  const libRows = $("#libRows");
  if (libRows && typeof CHECKOUTS !== "undefined") {
    libRows.innerHTML = CHECKOUTS.map(c => `
      <div class="lib-row">
        <span class="title">
          ${c.cover
            ? `<img class="lib-cover" src="${c.cover}" alt="${c.title} book cover" loading="lazy">`
            : `<span class="lib-cover ph" style="background:${c.color || 'var(--forest)'}">📕</span>`}
          <span class="lib-meta"><span>${c.title}</span><span class="auth">${c.author}</span></span>
        </span>
        <span class="stamp">${c.stamp}</span>
      </div>
    `).join("");
  }

  if (typeof LIB_STATS !== "undefined") {
    if ($("#statBooks")) $("#statBooks").textContent = LIB_STATS.books;
    if ($("#statVisits")) $("#statVisits").textContent = LIB_STATS.renewals;
    if ($("#statGenre")) $("#statGenre").textContent = LIB_STATS.genre;
    if ($("#statTabBooks")) $("#statTabBooks").textContent = LIB_STATS.books;
  }

  // Tab switching between 3D Art Book Shelf (AshenPress) and Checkouts
  const tabShelf = $("#tabShelfBtn");
  const tabCheckouts = $("#tabCheckoutsBtn");
  const panelShelf = $("#panelShelf");
  const panelCheckouts = $("#panelCheckouts");

  function switchTab(toShelf) {
    if (toShelf) {
      if (tabShelf) {
        tabShelf.classList.add("active");
        tabShelf.setAttribute("aria-selected", "true");
      }
      if (tabCheckouts) {
        tabCheckouts.classList.remove("active");
        tabCheckouts.setAttribute("aria-selected", "false");
      }
      if (panelShelf) {
        panelShelf.hidden = false;
        panelShelf.classList.add("active");
      }
      if (panelCheckouts) {
        panelCheckouts.hidden = true;
        panelCheckouts.classList.remove("active");
      }
    } else {
      if (tabCheckouts) {
        tabCheckouts.classList.add("active");
        tabCheckouts.setAttribute("aria-selected", "true");
      }
      if (tabShelf) {
        tabShelf.classList.remove("active");
        tabShelf.setAttribute("aria-selected", "false");
      }
      if (panelCheckouts) {
        panelCheckouts.hidden = false;
        panelCheckouts.classList.add("active");
      }
      if (panelShelf) {
        panelShelf.hidden = true;
        panelShelf.classList.remove("active");
      }
    }
  }

  if (tabShelf && tabCheckouts && panelShelf && panelCheckouts) {
    tabShelf.addEventListener("click", () => switchTab(true));
    tabCheckouts.addEventListener("click", () => switchTab(false));
  }
})();
