/* Four short quiz rounds from the Country Book and checked lists. */
(() => {
  const categories = [
    { id: "capitals", title: "Country Capitals", line: "Find capitals from the Country Book.", items: () => COUNTRY_BOOK.filter(x => x.capital).map(x => ({ name: x.name, answer: x.capital.split(" (")[0], region: x.continent, kind: x.kind })) },
    { id: "states", title: "US State Capitals", line: "Match each state with its capital.", items: () => US_STATE_CAPITALS.map(x => ({ name: x.state, answer: x.capital, region: regionForState(x.state) })) },
    { id: "food", title: "Country Food", line: "Find a food famous in each place.", items: () => COUNTRY_BOOK.filter(x => x.food).map(x => ({ name: x.name, answer: x.food, region: x.continent })) },
    { id: "buildings", title: "Famous Buildings", line: "Find the country for each famous building.", items: () => FAMOUS_BUILDINGS.map(x => ({ name: x.building, answer: x.country, region: "" })) }
  ];
  const $ = id => document.getElementById(id);
  const startEl = $("quizStart"), roundEl = $("quizRound"), qEl = $("quizQ"), optsEl = $("quizOpts");
  const scoreEl = $("quizScore"), progEl = $("quizProg"), barEl = $("quizBar"), feedbackEl = $("quizFeedback"), finalEl = $("quizFinal"), stopBtn = $("quizStop");
  let category, items, round, index, score, answered;
  const shuffle = list => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  };
  function regionForState(state) {
    const east = ["Connecticut", "Delaware", "Maine", "Maryland", "Massachusetts", "New Hampshire", "New Jersey", "New York", "Pennsylvania", "Rhode Island", "Vermont"];
    const midwest = ["Illinois", "Indiana", "Iowa", "Kansas", "Michigan", "Minnesota", "Missouri", "Nebraska", "North Dakota", "Ohio", "South Dakota", "Wisconsin"];
    const south = ["Alabama", "Arkansas", "Florida", "Georgia", "Kentucky", "Louisiana", "Mississippi", "North Carolina", "Oklahoma", "South Carolina", "Tennessee", "Texas", "Virginia", "West Virginia"];
    return east.includes(state) ? "Northeast" : midwest.includes(state) ? "Midwest" : south.includes(state) ? "South" : "West";
  }
  function makeQuestion(item) {
    const sameRegion = shuffle(items.filter(x => x !== item && x.region === item.region && x.answer !== item.answer));
    const otherRegions = shuffle(items.filter(x => x !== item && x.region !== item.region && x.answer !== item.answer));
    const distractors = [...new Set([...sameRegion, ...otherRegions].map(x => x.answer))].slice(0, 3);
    return shuffle([item.answer, ...distractors]);
  }
  function prompt(item) {
    if (category.id === "capitals") return `What is the capital of ${item.name}?`;
    if (category.id === "states") return `What is the capital of ${item.name}?`;
    if (category.id === "food") return `Which food is famous in ${item.name}?`;
    return `The ${item.name} is in which country?`;
  }
  function feedback(item, correct) {
    if (category.id === "capitals" || category.id === "states") return `${correct ? "Yes." : "Not that one."} The capital of ${item.name} is ${item.answer}.`;
    if (category.id === "food") return `${correct ? "Yes." : "Not that one."} ${item.answer} is famous in ${item.name}.`;
    return `${correct ? "Yes." : "Not that one."} The ${item.name} is in ${item.answer}.`;
  }
  function renderStart() {
    startEl.replaceChildren();
    categories.forEach(cat => {
      const card = document.createElement("article"); card.className = "quiz-card";
      const title = document.createElement("h3"); title.textContent = cat.title;
      const line = document.createElement("p"); line.textContent = cat.line;
      const button = document.createElement("button"); button.type = "button"; button.textContent = "Play 10";
      button.addEventListener("click", () => begin(cat));
      card.append(title, line, button); startEl.append(card);
    });
  }
  function begin(cat) {
    category = cat; items = shuffle(cat.items()); round = items.slice(0, 10); index = 0; score = 0; answered = 0;
    startEl.hidden = true; roundEl.hidden = false; finalEl.hidden = true; feedbackEl.hidden = true; stopBtn.hidden = false;
    roundEl.querySelector(".quiz-top").style.display = "flex"; barEl.parentElement.hidden = false; qEl.hidden = false; optsEl.hidden = false;
    renderQuestion();
  }
  function renderQuestion() {
    const item = round[index]; progEl.textContent = `Question ${index + 1} of 10`; scoreEl.textContent = `Score: ${score}`;
    barEl.style.width = `${index * 10}%`; qEl.textContent = prompt(item); feedbackEl.hidden = true; optsEl.replaceChildren();
    makeQuestion(item).forEach(answer => {
      const button = document.createElement("button"); button.type = "button"; button.className = "opt"; button.textContent = answer;
      button.dataset.correct = String(answer === item.answer); optsEl.append(button);
    });
    optsEl.querySelector("button")?.focus();
  }
  optsEl.addEventListener("click", event => {
    const button = event.target.closest("button.opt"); if (!button || answered) return;
    answered = 1; const item = round[index], correct = button.dataset.correct === "true"; if (correct) score++;
    optsEl.querySelectorAll("button").forEach(option => { option.disabled = true; if (option.dataset.correct === "true") option.classList.add("right"); });
    if (!correct) button.classList.add("wrong");
    scoreEl.textContent = `Score: ${score}`; feedbackEl.replaceChildren(document.createTextNode(feedback(item, correct)));
    const next = document.createElement("button"); next.type = "button"; next.textContent = "Next"; next.addEventListener("click", () => { index++; answered = 0; index === round.length ? finish() : renderQuestion(); });
    feedbackEl.append(next); feedbackEl.hidden = false;
  });
  function finish() {
    const count = answered ? index + 1 : index;
    roundEl.querySelector(".quiz-top").style.display = "none"; barEl.parentElement.hidden = true; qEl.hidden = true; optsEl.hidden = true; feedbackEl.hidden = true; stopBtn.hidden = true;
    finalEl.hidden = false; finalEl.replaceChildren();
    const line = document.createElement("p"); line.className = "big"; line.textContent = `You knew ${score} out of ${count}.`;
    const name = document.createElement("p"); name.className = "msg"; name.textContent = score >= 8 ? "Great work!" : "Nice try! Keep learning at your own pace.";
    finalEl.append(line, name);
    const bestKey = `capitalsQuizBest-${category.id}`; let best = 0;
    try { best = Number(localStorage.getItem(bestKey) || 0); } catch (_) {}
    if (count === 10 && score > best) { best = score; try { localStorage.setItem(bestKey, String(best)); } catch (_) {} }
    if (best > 0) { const bestLine = document.createElement("p"); bestLine.textContent = `Best round on this device: ${best} out of 10.`; finalEl.append(bestLine); }
    const again = document.createElement("button"); again.type = "button"; again.textContent = "Play again"; again.addEventListener("click", () => begin(category));
    const choose = document.createElement("button"); choose.type = "button"; choose.textContent = "Choose another quiz"; choose.addEventListener("click", showStart);
    finalEl.append(again, choose);
  }
  function showStart() { roundEl.hidden = true; startEl.hidden = false; startEl.querySelector("button")?.focus(); }
  stopBtn.addEventListener("click", finish);
  renderStart();
})();
