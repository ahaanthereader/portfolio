(() => {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = new Date();
  const isFreshDate = value => {
    const date = new Date(`${value}T00:00:00`);
    const age = now.getTime() - date.getTime();
    return age >= 0 && age < 7 * dayMs;
  };
  const entries = [...document.querySelectorAll(".fresh-drop time[datetime]")];
  let newestEntryIsFresh = false;
  entries.forEach(time => {
    const fresh = isFreshDate(time.dateTime);
    if (fresh) {
      newestEntryIsFresh = true;
      const badge = time.closest(".fresh-drop")?.querySelector("[data-fresh-new]");
      if (badge) badge.hidden = false;
    }
  });

  const homeLink = document.querySelector(".fresh-drops-home[data-latest-date]");
  if (newestEntryIsFresh || (homeLink && isFreshDate(homeLink.dataset.latestDate))) {
    document.querySelectorAll(".fresh-drops-home [data-fresh-new]").forEach(badge => {
      badge.hidden = false;
    });
  }
})();
