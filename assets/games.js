/* ---- Games: tabs + Memory Match + Tic-Tac-Toe + Catch the Star ---- */
(() => {
  /* tabs */
  const tabs = $$(".game-tab");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("active", x === t));
    ["memory", "ttt", "catch", "math"].forEach(g => { $("#game-" + g).hidden = g !== t.dataset.game; });
  }));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---- Memory Match ---- */
  (() => {
    const FACES = ["📖", "🌍", "🌳", "📚", "🎹", "🚀", "🦊", "⭐"];
    const grid = $("#memGrid"), movesEl = $("#memMoves"), msgEl = $("#memMsg");
    let first = null, lock = false, moves = 0, matched = 0;
    function start() {
      first = null; lock = false; moves = 0; matched = 0;
      movesEl.textContent = "Moves: 0"; msgEl.textContent = "Find all the matching pairs!";
      const deck = shuffle([...FACES, ...FACES].map((f, i) => ({ f, i })));
      grid.innerHTML = deck.map((c, i) => `<button class="mem-card" data-i="${i}" data-f="${c.f}"></button>`).join("");
    }
    grid.addEventListener("click", e => {
      const card = e.target.closest(".mem-card"); if (!card || lock) return;
      if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
      card.classList.add("flipped"); card.textContent = card.dataset.f;
      if (!first) { first = card; return; }
      moves++; movesEl.textContent = "Moves: " + moves;
      if (first.dataset.f === card.dataset.f) {
        first.classList.add("matched"); card.classList.add("matched"); first = null; matched++;
        if (matched === FACES.length) { msgEl.textContent = `🎉 You won in ${moves} moves!`; award("gamer"); confettiBurst(); }
      } else {
        lock = true; const a = first, b = card; first = null;
        setTimeout(() => { [a, b].forEach(c => { c.classList.remove("flipped"); c.textContent = ""; }); lock = false; }, 750);
      }
    });
    $("#memNew").addEventListener("click", start);
    start();
  })();

  /* ---- Tic-Tac-Toe (you = 🦊, computer = 🤖) ---- */
  (() => {
    const ME = "🦊", AI = "🤖";
    const board = $("#tttBoard"), msg = $("#tttMsg");
    let cells = Array(9).fill(""), over = false;
    const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    function render() { board.innerHTML = cells.map((c, i) => `<button class="ttt-cell ${c ? "taken" : ""}" data-i="${i}">${c}</button>`).join(""); }
    function winner(b) { for (const [x, y, z] of WINS) if (b[x] && b[x] === b[y] && b[y] === b[z]) return { who: b[x], line: [x, y, z] }; return null; }
    function highlight(line) { line.forEach(i => board.children[i].classList.add("win")); }
    function findMove(who) { for (let i = 0; i < 9; i++) if (!cells[i]) { const t = [...cells]; t[i] = who; if (winner(t)) return i; } return -1; }
    function aiMove() {
      let m = findMove(AI);                         // win
      if (m < 0) m = findMove(ME);                  // block
      if (m < 0 && !cells[4]) m = 4;                // center
      if (m < 0) { const free = cells.map((c, i) => c ? -1 : i).filter(i => i >= 0); m = free[Math.floor(Math.random() * free.length)]; }
      if (m >= 0) cells[m] = AI;
    }
    function check() {
      const w = winner(cells);
      if (w) { over = true; render(); highlight(w.line); msg.textContent = w.who === ME ? "🎉 You win!" : "🤖 Computer wins! Try again."; return true; }
      if (cells.every(Boolean)) { over = true; msg.textContent = "It's a tie! 🤝"; return true; }
      return false;
    }
    board.addEventListener("click", e => {
      const cell = e.target.closest(".ttt-cell"); if (!cell || over) return;
      const i = +cell.dataset.i; if (cells[i]) return;
      cells[i] = ME; award("gamer");
      if (check()) return;
      aiMove(); render();
      if (!check()) msg.textContent = "Your turn! You are 🦊";
    });
    function start() { cells = Array(9).fill(""); over = false; msg.textContent = "Your turn! You are 🦊"; render(); }
    $("#tttNew").addEventListener("click", start);
    start();
  })();

  /* ---- Catch the Star (20s) ---- */
  (() => {
    const arena = $("#catchArena"), scoreEl = $("#catchScore"), timeEl = $("#catchTime"), startBtn = $("#catchStart");
    const BKEY = "ahaan-catch-best";
    let score = 0, time = 0, running = false, moveT = null, tickT = null;
    let best = +(localStorage.getItem(BKEY) || 0);
    function place() {
      const star = arena.querySelector(".catch-star") || document.createElement("div");
      star.className = "catch-star"; star.textContent = "⭐";
      const w = arena.clientWidth - 44, h = arena.clientHeight - 44;
      star.style.left = Math.max(0, Math.random() * w) + "px";
      star.style.top = Math.max(0, Math.random() * h) + "px";
      if (!star.parentElement) arena.appendChild(star);
    }
    arena.addEventListener("pointerdown", e => {
      const star = e.target.closest(".catch-star"); if (!star || !running) return;
      score++; scoreEl.textContent = "Score: " + score; place();
    });
    function end() {
      running = false; clearInterval(tickT); clearTimeout(moveT);
      const star = arena.querySelector(".catch-star"); if (star) star.remove();
      best = Math.max(best, score); localStorage.setItem(BKEY, best);
      arena.innerHTML = `<div class="catch-hint">⭐ Time's up! You caught <b>${score}</b> stars.<br>Best: ${best} — tap Start to play again!</div>`;
      timeEl.textContent = "Done!"; startBtn.textContent = "▶ Play again";
    }
    function loop() { if (!running) return; place(); moveT = setTimeout(loop, Math.max(450, 900 - score * 25)); }
    startBtn.addEventListener("click", () => {
      award("gamer");
      arena.innerHTML = ""; score = 0; time = 20; running = true;
      scoreEl.textContent = "Score: 0"; timeEl.textContent = "Time: 20s"; startBtn.textContent = "Playing…";
      place(); loop();
      tickT = setInterval(() => { time--; timeEl.textContent = "Time: " + time + "s"; if (time <= 0) end(); }, 1000);
    });
  })();

  /* ---- Math Dash (30s arithmetic sprint) ---- */
  (() => {
    const qEl = $("#mathQ"), optsEl = $("#mathOpts"), scoreEl = $("#mathScore"), timeEl = $("#mathTime"), startBtn = $("#mathStart");
    const BKEY = "ahaan-math-best";
    let score = 0, time = 0, running = false, tickT = null, answer = 0, mode = "mix", best = +(localStorage.getItem(BKEY) || 0);
    const rnd = n => Math.floor(Math.random() * n);

    // mode buttons (Mixed / Add / Subtract / Multiply / Divide)
    $$(".math-mode").forEach(btn => btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      $$(".math-mode").forEach(b => b.classList.toggle("active", b === btn));
      if (running) newProblem();
    }));

    function pickOp() {
      if (mode === "add") return "+";
      if (mode === "sub") return "-";
      if (mode === "mul") return "×";
      if (mode === "div") return "÷";
      return ["+", "-", "×", "÷"][rnd(4)];
    }
    function newProblem() {
      const op = pickOp();
      let a, b;
      if (op === "+") { a = rnd(20) + 1; b = rnd(20) + 1; answer = a + b; }
      else if (op === "-") { a = rnd(20) + 5; b = rnd(a); answer = a - b; }
      else if (op === "×") { a = rnd(9) + 2; b = rnd(9) + 2; answer = a * b; }
      else { b = rnd(9) + 2; const q = rnd(9) + 2; a = b * q; answer = q; } // ÷ always whole
      qEl.textContent = `${a} ${op} ${b} = ?`;
      // build 4 unique options including the answer
      const opts = new Set([answer]);
      while (opts.size < 4) { const d = answer + (rnd(11) - 5); if (d >= 0 && d !== answer) opts.add(d); }
      const arr = [...opts].sort(() => Math.random() - 0.5);
      optsEl.innerHTML = arr.map(v => `<button class="math-opt" data-v="${v}">${v}</button>`).join("");
    }
    optsEl.addEventListener("click", e => {
      const b = e.target.closest(".math-opt"); if (!b || !running) return;
      const v = +b.dataset.v;
      if (v === answer) { score++; scoreEl.textContent = "Score: " + score; newProblem(); }
      else { b.classList.add("wrong"); const right = optsEl.querySelector(`.math-opt[data-v="${answer}"]`); if (right) right.classList.add("right"); setTimeout(newProblem, 550); }
    });
    function end() {
      running = false; clearInterval(tickT);
      best = Math.max(best, score); localStorage.setItem(BKEY, best);
      qEl.textContent = `⏰ Time's up! You solved ${score}! 🎉`;
      optsEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;font-weight:800;color:var(--ink-soft)">Best: ${best} — tap Start to beat it!</div>`;
      timeEl.textContent = "Done!"; startBtn.textContent = "▶ Play again";
    }
    startBtn.addEventListener("click", () => {
      award("gamer");
      score = 0; time = 30; running = true;
      scoreEl.textContent = "Score: 0"; timeEl.textContent = "Time: 30s"; startBtn.textContent = "Playing…";
      newProblem();
      clearInterval(tickT);
      tickT = setInterval(() => { time--; timeEl.textContent = "Time: " + time + "s"; if (time <= 0) end(); }, 1000);
    });
  })();
})();
