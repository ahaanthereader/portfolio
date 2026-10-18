/* ---- Library rows + stats ---- */
(() => {
  $("#libRows").innerHTML = CHECKOUTS.map(c => `
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
  $("#statBooks").textContent = LIB_STATS.books;
  $("#statVisits").textContent = LIB_STATS.renewals;
  $("#statGenre").textContent = LIB_STATS.genre;
})();
