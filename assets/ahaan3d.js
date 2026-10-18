/* ---- 3D Ahaan, full length: a lazy-loaded Three.js figure standing in the hero park.
   Calm by design: nothing moves on its own. His head turns toward the cursor while you move it,
   he waves when tapped, and he chomps when he eats a sweet. In Calm mode he stays still. ---- */
(function () {
  const box = document.getElementById("ahaanFigure");
  if (!box) return;
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  window.AhaanFigure = { mouth: () => null, chomp: () => {} };     // safe defaults until (or unless) 3D loads

  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js";
      s.onload = resolve; s.onerror = () => reject(new Error("three.js failed to load"));
      document.head.appendChild(s);
    });
  }
  loadThree().then(init).catch(() => { box.classList.add("no-3d"); });

  function init() {
    const T = window.THREE;
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    box.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(30, 1, 0.1, 60);
    camera.position.set(0, -2.15, 14.4);
    camera.lookAt(0, -2.15, 0);
    scene.add(new T.HemisphereLight(0xfff4e6, 0x6a4a38, 0.8));
    const key = new T.DirectionalLight(0xffffff, 0.9); key.position.set(1.5, 2, 3); scene.add(key);
    const rim = new T.DirectionalLight(0xffe3b0, 0.3); rim.position.set(-2, 1.5, -2); scene.add(rim);

    const SKIN = 0xa4663f, SKIN_D = 0x93583a, HAIR = 0x120f0e, MAROON = 0x5a1d2d, CREAM = 0xf2ecda;
    const mat = (c, r) => new T.MeshStandardMaterial({ color: c, roughness: r == null ? 0.8 : r });
    const part = (geo, m, x, y, z, sx, sy, sz) => {
      const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0);
      if (sx) o.scale.set(sx, sy, sz); return o;
    };
    const sphere = new T.SphereGeometry(1, 40, 28);

    function stripes(bands) {
      const c = document.createElement("canvas"); c.width = 8; c.height = bands * 16;
      const g = c.getContext("2d");
      for (let i = 0; i < bands; i++) { g.fillStyle = i % 2 ? "#" + CREAM.toString(16) : "#5a1d2d"; g.fillRect(0, i * 16, 8, 16); }
      const t = new T.CanvasTexture(c); return t;
    }
    const shirt = new T.MeshStandardMaterial({ map: stripes(10), roughness: 0.9 });
    const sleeveTex = stripes(10); sleeveTex.wrapS = sleeveTex.wrapT = T.RepeatWrapping; sleeveTex.repeat.set(1, 1.2);
    const sleeve = new T.MeshStandardMaterial({ map: sleeveTex, roughness: 0.9 });

    const JEANS = 0x8fb0d4, JEANS_D = 0x7896bb;
    const rig = new T.Group(); scene.add(rig);

    // ---- body: striped polo, collar, placket, neck ----
    rig.add(part(sphere, shirt, 0, -2.45, 0, 1.18, 1.3, 0.78));
    rig.add(part(new T.CylinderGeometry(0.36, 0.4, 0.5, 24), mat(SKIN_D), 0, -1.15, 0));
    const collar = part(new T.TorusGeometry(0.46, 0.12, 12, 32), mat(0x43121f), 0, -1.33, 0.05, 1.1, 1, 0.8);
    collar.rotation.x = Math.PI / 2; rig.add(collar);
    rig.add(part(new T.BoxGeometry(0.18, 0.7, 0.05), mat(CREAM), 0, -1.85, 0.71));
    [-1.68, -1.98].forEach(y => rig.add(part(new T.SphereGeometry(0.045, 12, 10), mat(0xffffff, 0.4), 0, y, 0.75)));

    // ---- jeans and sneakers ----
    rig.add(part(sphere, mat(JEANS), 0, -3.62, 0, 0.92, 0.38, 0.6));
    [-1, 1].forEach(s => {
      rig.add(part(new T.CapsuleGeometry(0.4, 1.45, 8, 16), mat(s < 0 ? JEANS : JEANS_D), s * 0.46, -4.55, 0));
      rig.add(part(sphere, mat(0xf4f1ea, 0.6), s * 0.47, -5.72, 0.16, 0.42, 0.24, 0.62));
      rig.add(part(sphere, mat(0x9a9a9a), s * 0.47, -5.88, 0.16, 0.43, 0.08, 0.63));
    });

    // ---- arms (his right arm waves) ----
    function makeArm(side) {
      const arm = new T.Group(); arm.position.set(side * 1.16, -1.6, 0.05);
      const rest = side * 0.12; arm.rotation.z = rest;
      arm.add(part(new T.CapsuleGeometry(0.27, 0.32, 6, 14), sleeve, 0, -0.28, 0));
      const elbow = new T.Group(); elbow.position.set(0, -0.62, 0); arm.add(elbow);
      elbow.add(part(new T.CapsuleGeometry(0.19, 0.95, 6, 12), mat(SKIN), 0, -0.62, 0));
      elbow.add(part(new T.SphereGeometry(0.23, 18, 14), mat(SKIN), 0, -1.25, 0));
      rig.add(arm); return { arm, elbow, rest };
    }
    const wavingArm = makeArm(-1); makeArm(1);

    // ---- head ----
    const head = new T.Group(); rig.add(head);
    head.add(part(sphere, mat(SKIN, 0.7), 0, 0, 0, 1, 1.08, 0.98));
    [-1, 1].forEach(s => head.add(part(sphere, mat(SKIN_D), s * 0.99, -0.08, -0.02, 0.15, 0.3, 0.26)));
    const hair = part(new T.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, 1.65), mat(HAIR, 1), 0, 0.04, -0.04, 1.035, 1.085, 1.035);
    hair.rotation.x = -0.5; head.add(hair);
    head.add(part(sphere, mat(SKIN_D, 0.7), 0, -0.14, 0.97, 0.11, 0.1, 0.09));            // nose
    [-1, 1].forEach(s => {                                                                 // blush
      const b = part(sphere, new T.MeshBasicMaterial({ color: 0xd2705a, transparent: true, opacity: 0.2 }), s * 0.58, -0.24, 0.78, 0.17, 0.12, 0.05);
      b.rotation.y = s * 0.7; head.add(b);
    });

    const eyes = [], brows = [];
    [-1, 1].forEach(s => {
      const eye = new T.Group(); eye.position.set(s * 0.38, 0.06, 0.86); eye.rotation.y = s * 0.28; head.add(eye);
      eye.add(part(sphere, mat(0xfffdf8, 0.3), 0, 0, 0, 0.21, 0.23, 0.12));
      const iris = new T.Group(); iris.position.z = 0.08; eye.add(iris);
      iris.add(part(sphere, mat(0x3a2415, 0.4), 0, 0, 0, 0.135, 0.135, 0.06));
      iris.add(part(sphere, mat(0x0b0706, 0.3), 0, 0, 0.025, 0.075, 0.075, 0.04));
      iris.add(part(sphere, new T.MeshBasicMaterial({ color: 0xffffff }), 0.045, 0.05, 0.05, 0.03, 0.03, 0.02));
      eyes.push({ eye, iris });
      const brow = part(new T.CapsuleGeometry(0.035, 0.27, 4, 8), mat(HAIR, 1), s * 0.4, 0.33, 0.87);
      brow.rotation.z = Math.PI / 2 - s * 0.14; brow.rotation.y = s * 0.3; head.add(brow); brows.push(brow);
    });

    const mouth = new T.Group(); mouth.position.set(0, -0.4, 0.92); head.add(mouth);
    const open = part(new T.CircleGeometry(0.19, 28, Math.PI, Math.PI), new T.MeshBasicMaterial({ color: 0x5a1f1a, side: T.DoubleSide }), 0, 0, 0, 1, 0.85, 1);
    mouth.add(open);
    mouth.add(part(new T.PlaneGeometry(0.3, 0.05), new T.MeshBasicMaterial({ color: 0xffffff }), 0, -0.03, 0.002));
    [-1, 1].forEach(s => mouth.add(part(new T.SphereGeometry(0.03, 10, 8), mat(0x8c4a3c), s * 0.2, 0.0, 0.0)));

    // ---- state: render only while something is actually moving ----
    let px = innerWidth / 2, py = innerHeight / 2, lastMove = -1e9, waveUntil = 0, chompUntil = 0, raf = 0, last = performance.now();
    let hx = 0, hy = 0, ex = 0, ey = 0, armA = 0, blink = 0, nextBlink = 0, rect = box.getBoundingClientRect();
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const render = () => renderer.render(scene, camera);
    function resize() {
      const w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      rect = box.getBoundingClientRect(); render();
    }
    function wake() { if (!raf && !calm()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; lastMove = performance.now(); wake(); }, { passive: true });
    box.addEventListener("pointerdown", () => { if (calm()) return; waveUntil = performance.now() + 2000; wake(); });

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
      rect = box.getBoundingClientRect();
      const tx = clamp((px - (rect.left + rect.width / 2)) / (innerWidth / 2), -1, 1);
      const ty = clamp((py - (rect.top + rect.height * 0.2)) / (innerHeight / 2), -1, 1);
      const kh = 1 - Math.exp(-dt * 7), ke = 1 - Math.exp(-dt * 14);
      hx += (tx - hx) * kh; hy += (ty - hy) * kh; ex += (tx - ex) * ke; ey += (ty - ey) * ke;
      head.rotation.y = hx * 0.6; head.rotation.x = hy * 0.3; head.rotation.z = -hx * 0.05;
      rig.rotation.y = hx * 0.1;
      eyes.forEach(o => { o.iris.position.x = clamp(ex - hx * 0.6, -1, 1) * 0.075; o.iris.position.y = -clamp(ey - hy * 0.5, -1, 1) * 0.07; });

      const active = now - lastMove < 2500;
      if (active && now > nextBlink) { blink = 1; nextBlink = now + 2400 + Math.random() * 2600; }
      blink = Math.max(0, blink - dt * 7);
      const lid = 1 - Math.sin(Math.min(1, blink) * Math.PI) * 0.92;
      eyes.forEach(o => { o.eye.scale.y = Math.max(0.08, lid); });

      const waving = now < waveUntil;
      armA += ((waving ? -2.9 : 0) - armA) * (1 - Math.exp(-dt * 7));
      wavingArm.arm.rotation.z = wavingArm.rest + armA;
      wavingArm.elbow.rotation.z = waving ? Math.sin(t * 11) * 0.5 : wavingArm.elbow.rotation.z * 0.8;
      brows.forEach(b => { b.position.y += (0.33 + (waving ? 0.07 : 0) - b.position.y) * 0.2; });
      const chomping = now < chompUntil;
      mouth.scale.y = chomping ? 1 + 1.1 * Math.abs(Math.sin(t * 16)) : mouth.scale.y + (1 - mouth.scale.y) * 0.25;
      render();

      const settled = Math.abs(tx - hx) < 0.002 && Math.abs(ty - hy) < 0.002 && Math.abs(tx - ex) < 0.002 && blink === 0 &&
        !waving && Math.abs(armA) < 0.01 && !chomping && Math.abs(mouth.scale.y - 1) < 0.01;
      if (settled && !active) { raf = 0; return; }              // nothing to animate: stop the loop
      raf = requestAnimationFrame(frame);
    }

    window.AhaanFigure = {
      mouth() {
        const v = new T.Vector3(); mouth.getWorldPosition(v); v.project(camera);
        const r = box.getBoundingClientRect();
        return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
      },
      chomp() { if (calm()) return; chompUntil = performance.now() + 700; wake(); }
    };
    resize(); addEventListener("resize", resize);
  }
})();
