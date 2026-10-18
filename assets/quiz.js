/* ---- Geography: capitals quiz (finite, scored, with final screen) ---- */
(() => {
  const TOTAL = QUIZ.length;
  const qEl = $("#quizQ"), optsEl = $("#quizOpts"), scoreEl = $("#quizScore"),
        progEl = $("#quizProg"), barEl = $("#quizBar"), finalEl = $("#quizFinal");
  let order = [], idx = 0, score = 0, locked = false;

  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

  function start() {
    order = shuffle([...Array(TOTAL).keys()]);
    idx = 0; score = 0; locked = false;
    finalEl.hidden = true;
    qEl.style.display = ""; optsEl.style.display = "";
    $(".quiz-top").style.display = ""; barEl.parentElement.style.display = "";
    renderQ();
  }

  function renderQ() {
    locked = false;
    const item = QUIZ[order[idx]];
    progEl.textContent = `Question ${idx + 1} of ${TOTAL}`;
    scoreEl.textContent = `Score: ${score}`;
    barEl.style.width = (idx / TOTAL * 100) + "%";
    qEl.textContent = item.q;
    // shuffle the answer options, remember the correct text
    const correctText = item.opts[item.a];
    const opts = shuffle(item.opts.map((t, k) => ({ t, correct: k === item.a })));
    optsEl.innerHTML = opts.map(o => `<button class="opt" data-correct="${o.correct}">${o.t}</button>`).join("");
    optsEl._correct = correctText;
  }

  optsEl.addEventListener("click", e => {
    const btn = e.target.closest(".opt"); if (!btn || locked) return;
    locked = true;
    award("quizwhiz");
    const right = btn.dataset.correct === "true";
    if (right) score++;
    $$(".opt", optsEl).forEach(b => {
      b.disabled = true;
      if (b.dataset.correct === "true") b.classList.add("right");
    });
    if (!right) btn.classList.add("wrong");
    scoreEl.textContent = `Score: ${score}`;
    setTimeout(() => { idx++; (idx >= TOTAL) ? renderFinal() : renderQ(); }, 950);
  });

  function renderFinal() {
    barEl.style.width = "100%";
    progEl.textContent = `Done! ${TOTAL} of ${TOTAL}`;
    const pct = Math.round(score / TOTAL * 100);
    let emoji, msg;
    if (pct === 100)      { emoji = "🏆"; msg = "Perfect score — a true geography master!"; }
    else if (pct >= 80)   { emoji = "🌟"; msg = "Brilliant! You really know your capitals."; }
    else if (pct >= 60)   { emoji = "🗺️"; msg = "Great job — better than most grown-ups!"; }
    else if (pct >= 40)   { emoji = "🌍"; msg = "Nice try! These are the world's trickiest capitals."; }
    else                  { emoji = "🧭"; msg = "Tough round — give it another go!"; }
    qEl.style.display = "none"; optsEl.style.display = "none";
    finalEl.hidden = false;
    finalEl.innerHTML = `
      <div class="emoji">${emoji}</div>
      <div class="big">${score} / ${TOTAL}</div>
      <div class="pct">${pct}% correct</div>
      <div class="msg">${msg}</div>
      <button class="again" id="quizAgain">Play again ↻</button>`;
    $("#quizAgain").addEventListener("click", start);
  }

  start();
})();
