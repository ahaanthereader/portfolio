(() => {
  const book = window.AESOP_BOOK;
  const page = document.getElementById("aesopPage");
  if (!Array.isArray(book) || !page) return;

  const previous = document.getElementById("aesopPrev");
  const next = document.getElementById("aesopNext");
  const contentsButton = document.getElementById("aesopContents");
  const pageNumber = document.getElementById("aesopPageNumber");
  const plain = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const bySlug = slug => book.findIndex(fable => fable.slug === slug);

  function contents(focusHeading = false) {
    page.replaceChildren();
    const title = document.createElement("h2");
    title.className = "aesop-contents-title";
    title.tabIndex = -1;
    title.textContent = "Contents";
    const label = document.createElement("label");
    label.className = "aesop-search-label";
    label.htmlFor = "aesopSearch";
    label.textContent = "Find a fable";
    const search = document.createElement("input");
    search.className = "aesop-search";
    search.id = "aesopSearch";
    search.type = "search";
    search.autocomplete = "off";
    search.setAttribute("aria-describedby", "aesopSearchMessage");
    const message = document.createElement("p");
    message.id = "aesopSearchMessage";
    message.className = "aesop-search-message";
    message.setAttribute("aria-live", "polite");
    const list = document.createElement("ol");
    list.className = "aesop-list";

    book.forEach(fable => {
      const item = document.createElement("li");
      item.dataset.search = plain(fable.title);
      const link = document.createElement("a");
      link.href = `#${fable.slug}`;
      link.textContent = fable.title;
      item.append(link);
      list.append(item);
    });
    search.addEventListener("input", () => {
      const query = plain(search.value.trim());
      let count = 0;
      list.querySelectorAll("li").forEach(item => {
        item.hidden = !!query && !item.dataset.search.includes(query);
        if (!item.hidden) count++;
      });
      message.textContent = !query ? "" : count ? `${count} ${count === 1 ? "fable" : "fables"} found.` : "No fable found. Check the spelling.";
    });

    page.append(title, label, search, message, list);
    pageNumber.textContent = `${book.length} fables`;
    previous.disabled = true;
    next.disabled = false;
    if (focusHeading) title.focus({ preventScroll: true });
  }

  function showFable(index, focusHeading) {
    const fable = book[index];
    if (!fable) return contents();
    page.replaceChildren();
    const article = document.createElement("article");
    article.className = "aesop-story";
    const title = document.createElement("h2");
    title.id = "aesopStoryTitle";
    title.tabIndex = -1;
    title.textContent = fable.title;
    article.setAttribute("aria-labelledby", title.id);
    article.append(title);
    fable.story.forEach(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      article.append(paragraph);
    });
    const moral = document.createElement("p");
    moral.className = "aesop-moral";
    const label = document.createElement("strong");
    label.textContent = fable.moralLabel;
    moral.append(label, document.createTextNode(` ${fable.moral}`));
    article.append(moral);
    page.append(article);
    pageNumber.textContent = `Fable ${index + 1} of ${book.length}`;
    previous.disabled = index === 0;
    next.disabled = index === book.length - 1;
    if (focusHeading) title.focus({ preventScroll: true });
  }

  function routeFromHash(focusHeading = false) {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (!slug || slug === "contents") return contents(focusHeading);
    const index = bySlug(slug);
    if (index < 0) return contents();
    showFable(index, focusHeading);
  }

  function goTo(index) {
    if (index < 0 || index >= book.length) return;
    location.hash = book[index].slug;
  }

  previous.addEventListener("click", () => goTo(bySlug(location.hash.slice(1)) - 1));
  next.addEventListener("click", () => {
    const index = bySlug(location.hash.slice(1));
    goTo(index < 0 ? 0 : index + 1);
  });
  contentsButton.addEventListener("click", () => { location.hash = "contents"; });
  window.addEventListener("hashchange", () => routeFromHash(true));
  routeFromHash();
})();
