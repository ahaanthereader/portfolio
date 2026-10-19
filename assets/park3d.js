/* ---- Home: a lit 3D park diorama with Ahaan standing in it (Three.js, lazy-loaded).
   Calm by design: a slow breeze moves leaves, grass, flowers and the swing (owner decision D9). It pauses
   with the Breeze button and off screen, and the park is completely still in Calm mode. Ahaan's head follows
   the cursor only while it moves; he waves when tapped and chomps when he eats a sweet. If WebGL or the CDN
   is unavailable, the painted SVG scene stays as the fallback. ---- */
(function () {
  const hero = document.querySelector(".home-hero"), canvas = document.getElementById("parkCanvas"), figBox = document.getElementById("ahaanFigure");
  if (!hero || !canvas || !window.AhaanModel) return;
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  window.AhaanFigure = { mouth: () => null, chomp: () => {} };

  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js";
      s.onload = resolve; s.onerror = () => reject(new Error("three.js failed to load"));
      document.head.appendChild(s);
    });
  }
  loadThree().then(() => { try { init(); } catch (e) { console.warn("3D park unavailable, keeping the painted scene:", e.message); } })
    .catch(e => console.warn("3D park unavailable, keeping the painted scene:", e.message));

  function init() {
    const T = window.THREE;
    T.ColorManagement.legacyMode = false;
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const scene = new T.Scene();
    const HORIZON = new T.Color("#d6e9f2");
    scene.fog = new T.Fog(HORIZON, 30, 95);
    const camera = new T.PerspectiveCamera(35, 1, 0.1, 300);
    camera.position.set(0, 2.1, 12); camera.lookAt(0, 2.7, 0);

    // ---- sky dome: deep blue overhead fading to a soft horizon ----
    scene.add(new T.Mesh(new T.SphereGeometry(150, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color("#2f7fcf") }, mid: { value: new T.Color("#6aaee3") }, bottom: { value: HORIZON } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.1 ? mix(mid, top, smoothstep(0.1, 0.55, h)) : mix(bottom, mid, smoothstep(-0.02, 0.1, h)); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}"
    })));

    // ---- light: soft sky fill plus a warm sun with gentle shadows ----
    scene.add(new T.HemisphereLight(0xdcefff, 0x6b8f4e, 0.8));
    const sun = new T.DirectionalLight(0xfff1d6, 1.55);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -10, near: 1, far: 60 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
    sun.target.position.set(0, 0, 3); sun.position.set(-9, 15, 12);
    scene.add(sun, sun.target);

    // ---- wind: one shared clock; materials bend in their vertex shader ----
    const wind = { uTime: { value: 0 } };
    function windify(m, amp, mode) {
      const bend = mode === "grass" ? "position.y * position.y" : mode === "head" ? "1.0" : "clamp((wpos.y - 1.2) * 0.22, 0.0, 1.0)";
      m.onBeforeCompile = sh => {
        sh.uniforms.uTime = wind.uTime;
        sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
          vec4 wpos = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            wpos = instanceMatrix * wpos;
          #endif
          wpos = modelMatrix * wpos;
          float bend = ${bend};
          float gust = sin(uTime * 1.3 + wpos.x * 0.35 + wpos.z * 0.2) * 0.65 + sin(uTime * 2.1 + wpos.x * 0.9 + wpos.z * 0.6) * 0.35;
          transformed.x += gust * bend * ${amp.toFixed(3)};
          transformed.z += cos(uTime * 1.1 + wpos.z * 0.45) * bend * ${(amp * 0.4).toFixed(3)};
          ${mode === "foliage" ? `transformed += normal * sin(uTime * 3.2 + position.x * 5.0 + position.y * 4.0) * ${(amp * 0.35).toFixed(3)} * bend;` : ""}`);
      };
      m.customProgramCacheKey = () => "wind-" + mode + amp;
      return m;
    }

    // ---- ground: flat lawn in front, rolling hills behind ----
    function heightAt(x, z) { if (z > -6) return 0; const k = Math.min(1, (-6 - z) / 22); return (Math.sin(x * 0.08) + Math.sin(x * 0.031 + 1.3) * 1.6 + Math.cos(z * 0.07) + 0.6) * k * 1.4; }
    const groundGeo = new T.PlaneGeometry(240, 170, 170, 120); groundGeo.rotateX(-Math.PI / 2); groundGeo.translate(0, 0, -40);
    const gp = groundGeo.attributes.position, gcol = [];
    const cA = new T.Color("#7fbf6a"), cB = new T.Color("#5f9f52"), cFar = new T.Color("#a7cd98");
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i), z = gp.getZ(i); gp.setY(i, heightAt(x, z));
      const n = (Math.sin(x * 1.3 + z * 0.7) + Math.sin(x * 0.37 - z * 1.1)) * 0.25 + 0.5;
      const c = cA.clone().lerp(cB, n * 0.6).lerp(cFar, Math.min(1, Math.max(0, (-z - 8) / 30))); gcol.push(c.r, c.g, c.b);
    }
    groundGeo.setAttribute("color", new T.Float32BufferAttribute(gcol, 3)); groundGeo.computeVertexNormals();
    const ground = new T.Mesh(groundGeo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); ground.receiveShadow = true; scene.add(ground);

    // ---- a winding path ----
    const curve = new T.CatmullRomCurve3([new T.Vector3(-18, 0, 10), new T.Vector3(-9, 0, 6), new T.Vector3(-2, 0, 2.6), new T.Vector3(4, 0, -1.4), new T.Vector3(11, 0, -5), new T.Vector3(20, 0, -8)]);
    const pv = [], pidx = [], PN = 140;
    for (let i = 0; i <= PN; i++) {
      const p = curve.getPoint(i / PN), tg = curve.getTangent(i / PN), w = 0.85 * (0.85 + 0.15 * Math.sin(i * 0.3));
      pv.push(p.x - tg.z * w, 0.02, p.z + tg.x * w, p.x + tg.z * w, 0.02, p.z - tg.x * w);
      if (i < PN) { const a = i * 2; pidx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const pg = new T.BufferGeometry(); pg.setAttribute("position", new T.Float32BufferAttribute(pv, 3)); pg.setIndex(pidx); pg.computeVertexNormals();
    const path = new T.Mesh(pg, new T.MeshStandardMaterial({ color: "#e6d6b4", roughness: 1, side: T.DoubleSide })); path.receiveShadow = true; scene.add(path);

    // ---- trees: bark trunks with soft, lumpy foliage that rustles in the wind ----
    const blobGeo = (() => {
      const g = new T.SphereGeometry(1, 22, 16), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + Math.sin(x * 3.1 + y * 1.7) * 0.07 + Math.sin(y * 2.3 + z * 2.9) * 0.07 + Math.sin(z * 3.7 + x * 1.3) * 0.05; p.setXYZ(i, x * n, y * n, z * n); }
      g.computeVertexNormals(); return g;
    })();
    const leafMats = ["#6fa86a", "#5e9a5c", "#4f874e", "#86bd7c", "#78b06d"].map(c => windify(new T.MeshStandardMaterial({ color: c, roughness: 0.92 }), 0.07, "foliage"));
    const barkMat = new T.MeshStandardMaterial({ color: "#7a5a3e", roughness: 1 });
    function tree(x, z, s, shadow) {
      const g = new T.Group(); g.position.set(x, heightAt(x, z), z);
      const h = 3.2 * s, trunk = new T.Mesh(new T.CylinderGeometry(0.16 * s, 0.3 * s, h, 9), barkMat);
      trunk.position.y = h / 2; trunk.castShadow = shadow; g.add(trunk);
      const n = 6 + Math.floor(rand() * 3);
      for (let i = 0; i < n; i++) {
        const a = rand() * Math.PI * 2, r = (0.35 + rand() * 0.85) * s, sz = (0.9 + rand() * 0.75) * s;
        const b = new T.Mesh(blobGeo, leafMats[Math.floor(rand() * leafMats.length)]);
        b.scale.set(sz, sz * 0.85, sz); b.position.set(Math.cos(a) * r, h + (rand() * 1.3 - 0.1) * s, Math.sin(a) * r * 0.8);
        b.castShadow = shadow; b.receiveShadow = true; g.add(b);
      }
      scene.add(g); return g;
    }
    [[-17, 2, 0.9], [-24, -4, 1.0], [7, -10, 1.2], [14, -14, 1.5], [24, -20, 1.6], [5, -24, 1.2], [18, -34, 1.8], [34, -30, 1.8], [-40, -30, 1.3], [-12, -48, 1.1]]
      .forEach(([x, z, s]) => tree(x, z, s, z > -14));
    // bushes along the path and around the lawn
    const bushes = [];
    [[-11, 4.5], [-7.5, 1], [6, 0.5], [9, -2.5], [-3, -2], [12, 2.5]].forEach(([x, z]) => {
      for (let i = 0; i < 3; i++) { const b = new T.Mesh(blobGeo, leafMats[(i + 2) % 5]); const s = 0.45 + rand() * 0.35; b.scale.set(s * 1.3, s, s); b.position.set(x + (rand() - 0.5) * 1.2, s * 0.6, z + (rand() - 0.5) * 0.8); b.castShadow = true; b.receiveShadow = true; scene.add(b); bushes.push(b); }
    });

    // ---- the big tree that frames the right side, with a branch for the swing ----
    const bigTree = new T.Group(); scene.add(bigTree);
    const bigH = 5.2;
    const bigTrunk = new T.Mesh(new T.CylinderGeometry(0.42, 0.75, bigH, 12), barkMat); bigTrunk.position.y = bigH / 2; bigTrunk.castShadow = true; bigTree.add(bigTrunk);
    for (let i = 0; i < 4; i++) { const r = new T.Mesh(new T.ConeGeometry(0.35, 1.2, 6), barkMat); const a = i * 1.7; r.position.set(Math.cos(a) * 0.7, 0.3, Math.sin(a) * 0.7); r.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1); bigTree.add(r); }
    for (let i = 0; i < 12; i++) {
      const a = rand() * Math.PI * 2, r = 0.5 + rand() * 2.6, sz = 1.5 + rand() * 1.3, b = new T.Mesh(blobGeo, leafMats[i % 5]);
      b.scale.set(sz, sz * 0.85, sz); b.position.set(Math.cos(a) * r - 0.8, bigH + rand() * 2.4, Math.sin(a) * r * 0.7); b.castShadow = true; b.receiveShadow = true; bigTree.add(b);
    }

    // ---- sculptures: a giant open book and a globe (both for Ahaan) ----
    const stone = new T.MeshStandardMaterial({ color: "#d8d0c0", roughness: 0.9 });
    function buildBook() {
      const g = new T.Group();
      const plinth = new T.Mesh(new T.BoxGeometry(1.7, 0.55, 1.2), stone); plinth.position.y = 0.275; g.add(plinth);
      const capSlab = new T.Mesh(new T.BoxGeometry(1.85, 0.08, 1.35), stone); capSlab.position.y = 0.59; g.add(capSlab);
      const cover = new T.MeshStandardMaterial({ color: "#9b3b2f", roughness: 0.7 }), paper = new T.MeshStandardMaterial({ color: "#f6efdc", roughness: 0.85 }), ink = new T.MeshStandardMaterial({ color: "#6b5a48", roughness: 1 });
      const book = new T.Group(); book.position.y = 0.68; book.rotation.x = -0.35;
      [-1, 1].forEach(s => {
        const half = new T.Group(); half.rotation.z = s * 0.16;
        const cv = new T.Mesh(new T.BoxGeometry(0.82, 0.05, 1.12), cover); cv.position.x = s * 0.42; half.add(cv);
        const pg2 = new T.Mesh(new T.BoxGeometry(0.76, 0.12, 1.04), paper); pg2.position.set(s * 0.4, 0.085, 0); half.add(pg2);
        for (let r = 0; r < 7; r++) { const ln = new T.Mesh(new T.BoxGeometry(0.52 - (r % 3) * 0.08, 0.004, 0.025), ink); ln.position.set(s * 0.4, 0.147, -0.36 + r * 0.12); half.add(ln); }
        book.add(half);
      });
      const ribbon = new T.Mesh(new T.BoxGeometry(0.05, 0.006, 0.42), new T.MeshStandardMaterial({ color: "#c0392b", roughness: 0.6 })); ribbon.position.set(0.06, 0.15, 0.62); ribbon.rotation.x = 0.9; book.add(ribbon);
      g.add(book);
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return g;
    }
    function buildGlobe(tex) {
      const g = new T.Group();
      const bronze = new T.MeshStandardMaterial({ color: "#a7834a", roughness: 0.45, metalness: 0.6 });
      const base = new T.Mesh(new T.CylinderGeometry(0.75, 0.9, 0.45, 32), stone); base.position.y = 0.225; g.add(base);
      const post = new T.Mesh(new T.CylinderGeometry(0.09, 0.14, 0.9, 16), bronze); post.position.y = 0.9; g.add(post);
      const tilt = new T.Group(); tilt.position.y = 2.05; tilt.rotation.z = 0.41; g.add(tilt);
      const ring = new T.Mesh(new T.TorusGeometry(1.0, 0.035, 10, 64, Math.PI), bronze); ring.rotation.z = -Math.PI / 2; tilt.add(ring);
      const earth = new T.Mesh(new T.SphereGeometry(0.9, 48, 32), new T.MeshStandardMaterial({ map: tex, roughness: 0.6, color: tex ? 0xffffff : 0x4f93cf }));
      earth.rotation.y = Math.PI - 0.35; tilt.add(earth);
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      g.userData.earth = earth;
      return g;
    }
    const bookSculpture = buildBook(); scene.add(bookSculpture);
    const globe = buildGlobe(null); globe.scale.setScalar(0.62); scene.add(globe);
    const mapImg = new Image();
    mapImg.onload = () => {
      const c = document.createElement("canvas"); c.width = 2048; c.height = 1024; c.getContext("2d").drawImage(mapImg, 0, 0, 2048, 1024);
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
      globe.userData.earth.material.map = t; globe.userData.earth.material.color.set(0xffffff); globe.userData.earth.material.needsUpdate = true; requestRender();
    };
    mapImg.src = "assets/world-map.svg";

    // ---- the library on the hill, and a little free library by the path ----
    function buildLibrary() {
      const g = new T.Group(), white = new T.MeshStandardMaterial({ color: "#efe7d8", roughness: 0.9 }), roofM = new T.MeshStandardMaterial({ color: "#d9cdb6", roughness: 0.9 });
      for (let i = 0; i < 3; i++) { const st = new T.Mesh(new T.BoxGeometry(7.4 - i * 0.4, 0.22, 3.4 - i * 0.3), white); st.position.y = 0.11 + i * 0.22; g.add(st); }
      const body = new T.Mesh(new T.BoxGeometry(6.2, 2.6, 2.2), white); body.position.set(0, 1.96, -0.4); g.add(body);
      for (let i = 0; i < 6; i++) { const c = new T.Mesh(new T.CylinderGeometry(0.16, 0.18, 2.6, 14), white); c.position.set(-2.5 + i * 1.0, 1.96, 1.0); g.add(c); }
      const ent = new T.Mesh(new T.BoxGeometry(6.6, 0.45, 2.9), white); ent.position.set(0, 3.48, 0); g.add(ent);
      const tri = new T.Shape(); tri.moveTo(-3.4, 0); tri.lineTo(3.4, 0); tri.lineTo(0, 1.1); tri.lineTo(-3.4, 0);
      const ped = new T.Mesh(new T.ExtrudeGeometry(tri, { depth: 2.9, bevelEnabled: false }), roofM); ped.position.set(0, 3.7, -1.45); g.add(ped);
      const door = new T.Mesh(new T.BoxGeometry(0.9, 1.6, 0.05), new T.MeshStandardMaterial({ color: "#6a4a32", roughness: 0.8 })); door.position.set(0, 1.46, 0.72); g.add(door);
      const c = document.createElement("canvas"); c.width = 512; c.height = 64; const x = c.getContext("2d");
      x.fillStyle = "#efe7d8"; x.fillRect(0, 0, 512, 64); x.fillStyle = "#7a6a52"; x.font = "bold 38px Georgia, serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("L I B R A R Y", 256, 34);
      const tt = new T.CanvasTexture(c); tt.encoding = T.sRGBEncoding;
      const sign = new T.Mesh(new T.PlaneGeometry(4.2, 0.36), new T.MeshStandardMaterial({ map: tt, roughness: 0.9 })); sign.position.set(0, 3.48, 1.452); g.add(sign);
      return g;
    }
    const library = buildLibrary(); library.scale.setScalar(1.15); scene.add(library);
    function buildLittleLibrary() {
      const g = new T.Group(), wood = new T.MeshStandardMaterial({ color: "#d9a066", roughness: 0.8 });
      const post = new T.Mesh(new T.BoxGeometry(0.14, 1.1, 0.14), new T.MeshStandardMaterial({ color: "#8a6448", roughness: 1 })); post.position.y = 0.55; g.add(post);
      const box = new T.Mesh(new T.BoxGeometry(0.75, 0.6, 0.5), wood); box.position.y = 1.4; g.add(box);
      const roof = new T.Mesh(new T.ConeGeometry(0.62, 0.38, 4), new T.MeshStandardMaterial({ color: "#b8432f", roughness: 0.8 })); roof.position.y = 1.89; roof.rotation.y = Math.PI / 4; g.add(roof);
      const glass = new T.Mesh(new T.PlaneGeometry(0.58, 0.44), new T.MeshStandardMaterial({ color: "#f7f0e2", roughness: 0.4 })); glass.position.set(0, 1.4, 0.252); g.add(glass);
      ["#5a8fd6", "#e07a5f", "#f2cc5c", "#81b29a", "#9c7bc4"].forEach((col, i) => { const b = new T.Mesh(new T.BoxGeometry(0.08, 0.28 + (i % 2) * 0.05, 0.05), new T.MeshStandardMaterial({ color: col, roughness: 0.7 })); b.position.set(-0.2 + i * 0.1, 1.33, 0.26); g.add(b); });
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return g;
    }
    const littleLib = buildLittleLibrary(); scene.add(littleLib);

    // ---- grass blades and flowers: instanced, bending with the breeze ----
    const blade = new T.PlaneGeometry(0.07, 1, 1, 4); blade.translate(0, 0.5, 0);
    { const p = blade.attributes.position, col = []; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - y * 0.85)); const k = 0.55 + y * 0.45; col.push(k, k, k); } blade.setAttribute("color", new T.Float32BufferAttribute(col, 3)); blade.computeVertexNormals(); }
    const grassMat = windify(new T.MeshStandardMaterial({ vertexColors: true, side: T.DoubleSide, roughness: 1 }), 0.28, "grass");
    const GRASS = 9000, grass = new T.InstancedMesh(blade, grassMat, GRASS);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), sc = new T.Vector3(), gc = new T.Color();
    const greens = ["#6db15c", "#5c9e4f", "#7cc06a", "#4f8d45"].map(c => new T.Color(c));
    for (let i = 0; i < GRASS; i++) {
      const x = (rand() - 0.5) * 34, z = -3 + rand() * 13, s = 0.25 + rand() * 0.32;
      e.set((rand() - 0.5) * 0.3, rand() * Math.PI, (rand() - 0.5) * 0.3); q.setFromEuler(e); v.set(x, 0, z); sc.set(1, s * 1.6, 1).multiplyScalar(s * 1.4);
      grass.setMatrixAt(i, m4.compose(v, q, sc)); grass.setColorAt(i, gc.copy(greens[i % 4]));
    }
    grass.receiveShadow = true; scene.add(grass);
    const FLOWERS = 340, stemGeo = new T.CylinderGeometry(0.012, 0.016, 1, 5); stemGeo.translate(0, 0.5, 0);
    const stems = new T.InstancedMesh(stemGeo, windify(new T.MeshStandardMaterial({ color: "#5f9c55", roughness: 1 }), 0.12, "grass"), FLOWERS);
    const petalGeo = new T.IcosahedronGeometry(0.075, 1);
    const heads = new T.InstancedMesh(petalGeo, windify(new T.MeshStandardMaterial({ roughness: 0.7 }), 0.12, "head"), FLOWERS);
    const petals = ["#f6c6d0", "#ffffff", "#fff0a8", "#e9b7f0", "#f7a6a0"].map(c => new T.Color(c));
    for (let i = 0; i < FLOWERS; i++) {
      const cluster = i % 4 === 0;
      const x = cluster ? -6 + (rand() - 0.5) * 4 : (rand() - 0.5) * 28, z = cluster ? 4 + (rand() - 0.5) * 2 : -2 + rand() * 11, h = 0.28 + rand() * 0.22;
      e.set(0, rand() * Math.PI, 0); q.setFromEuler(e); v.set(x, 0, z); sc.set(1, h, 1);
      stems.setMatrixAt(i, m4.compose(v, q, sc));
      v.set(x, h, z); sc.set(1, 1, 1); heads.setMatrixAt(i, m4.compose(v, q, sc)); heads.setColorAt(i, gc.copy(petals[i % 5]));
    }
    scene.add(stems, heads);

    // ---- clouds: soft and still (the sky does not move) ----
    const cloudMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.35, fog: false });
    [[26, 15, -80], [44, 19, -90], [12, 8, -95], [60, 12, -95]].forEach(([x, y, z]) => {
      for (let i = 0; i < 6; i++) { const b = new T.Mesh(blobGeo, cloudMat); const s = 3 + rand() * 3; b.scale.set(s * 1.4, s * 0.8, s); b.position.set(x + (i - 2.5) * 3.2, y + rand() * 2, z + rand() * 3); scene.add(b); }
    });

    // ---- Ahaan ----
    const A = window.AhaanModel.build(T);
    scene.add(A.rig); A.rig.rotation.y = -0.18;

    // ---- layout: anchor things to screen positions so the scene fits every window ----
    const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitV = new T.Vector3();
    function groundAt(sx, sy) { ndc.set(sx * 2 - 1, -(sy * 2 - 1)); ray.setFromCamera(ndc, camera); return ray.ray.intersectPlane(plane, hitV) ? hitV.clone() : null; }
    function layout() {
      const W = hero.clientWidth, H = hero.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.fov = camera.aspect < 1 ? 50 : 35; camera.updateProjectionMatrix();
      const hr = hero.getBoundingClientRect(), fr = figBox.getBoundingClientRect();
      // Ahaan: feet at the bottom-centre of his layout box, as tall as the box
      const fx = (fr.left + fr.width / 2 - hr.left) / W, fy = Math.min(0.97, (fr.bottom - hr.top) / H);
      const feet = groundAt(fx, fy) || new T.Vector3(2.5, 0, 3);
      const want = fr.height * 0.96;
      let s = 0.3;
      const topLocal = new T.Vector3(0, A.footY + A.height, 0), footLocal = new T.Vector3(0, A.footY, 0);
      for (let k = 0; k < 3; k++) {
        A.rig.scale.setScalar(s); A.rig.position.set(feet.x, -A.footY * s, feet.z); A.rig.updateMatrixWorld(true);
        const a = A.rig.localToWorld(topLocal.clone()).project(camera), b = A.rig.localToWorld(footLocal.clone()).project(camera);
        const got = (a.y - b.y) / 2 * H; if (got > 1) s *= want / got;
      }
      A.rig.scale.setScalar(s); A.rig.position.set(feet.x, -A.footY * s, feet.z);
      const place = (obj, sx, sy, fb) => { const p = groundAt(sx, sy) || fb; obj.position.set(p.x, heightAt(p.x, p.z), p.z); return p; };
      place(bigTree, 0.98, 0.84, new T.Vector3(7, 0, 1));
      place(bookSculpture, 0.12, 0.9, new T.Vector3(-4, 0, 6)); bookSculpture.rotation.y = 0.35;
      place(globe, Math.max(0.16, fx - 0.28), 0.82, new T.Vector3(-0.5, 0, 2));
      place(littleLib, 0.035, 0.72, new T.Vector3(-7, 0, 2));
      const lp = groundAt(Math.max(0.2, fx - 0.14), 0.585) || new T.Vector3(2, 0, -18); library.position.set(lp.x, heightAt(lp.x, lp.z) - 0.2, Math.min(lp.z, -12)); library.rotation.y = 0.15;
      // swing to Ahaan's left, hanging from a branch of the big tree
      requestRender();
    }

    // ---- motion: head follows the cursor, wave on tap, chomp on eating; breeze when allowed ----
    let px = innerWidth / 2, py = innerHeight / 2, lastMove = -1e9, waveUntil = 0, chompUntil = 0;
    let hx = 0, hy = 0, ex = 0, ey = 0, armA = 0, blink = 0, nextBlink = 0, windT = 0, offscreen = false;
    const clamp = (v2, a, b) => Math.max(a, Math.min(b, v2));
    const breezeOn = () => !calm() && !hero.classList.contains("breeze-off") && !offscreen && !document.hidden;
    const headPos = new T.Vector3();
    function screenOf(obj) { obj.getWorldPosition(headPos); headPos.project(camera); const r = canvas.getBoundingClientRect(); return { x: r.left + (headPos.x + 1) / 2 * r.width, y: r.top + (1 - headPos.y) / 2 * r.height }; }
    addEventListener("pointermove", e2 => { px = e2.clientX; py = e2.clientY; lastMove = performance.now(); wake(); }, { passive: true });
    canvas.addEventListener("pointerdown", e2 => {
      if (calm()) return;
      const r = canvas.getBoundingClientRect(); ndc.set((e2.clientX - r.left) / r.width * 2 - 1, -((e2.clientY - r.top) / r.height * 2 - 1)); ray.setFromCamera(ndc, camera);
      if (ray.intersectObject(A.rig, true).length) { waveUntil = performance.now() + 2000; wake(); }
    });

    const POSES = { rest: [0.1, 0, 0], reach: [1.2, -0.35, -0.25], mouth: [-0.5, -1.15, -2.0] };   // [shoulder z, shoulder x, elbow x]
    let pose = "rest"; const cur = POSES.rest.slice();
    let raf = 0, last = performance.now(), lastRender = 0, pending = false;
    function render() { renderer.render(scene, camera); lastRender = performance.now(); }
    function requestRender() { if (calm() || !raf) { pending = true; requestAnimationFrame(() => { if (pending) { pending = false; render(); } }); } }
    function wake() { if (!raf && !calm()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function frame(now) {
      raf = 0;
      if (offscreen || document.hidden) return;
      if (calm()) {                                                        // Calm mode: settle into a still pose and stop
        A.head.rotation.set(0, 0, 0); A.eyes.forEach(o => { o.iris.position.set(0, 0, 0.045); o.eye.scale.y = 1; });
        A.wavingArm.arm.rotation.z = A.wavingArm.rest; A.wavingArm.elbow.rotation.z = 0; pose = "rest"; POSES.rest.forEach((v3, k) => { cur[k] = v3; }); A.leftArm.arm.rotation.set(0, 0, cur[0]); A.leftArm.elbow.rotation.x = 0; A.mouth.scale.y = 1; armA = 0;
        render(); return;
      }
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
      const breeze = breezeOn();
      if (breeze) windT += dt;
      wind.uTime.value = windT;

      const hs = screenOf(A.head);
      const tx = clamp((px - hs.x) / (innerWidth / 2), -1, 1), ty = clamp((py - hs.y) / (innerHeight / 2), -1, 1);
      const kh = 1 - Math.exp(-dt * 7), ke = 1 - Math.exp(-dt * 14);
      hx += (tx - hx) * kh; hy += (ty - hy) * kh; ex += (tx - ex) * ke; ey += (ty - ey) * ke;
      A.head.rotation.y = hx * 0.55; A.head.rotation.x = clamp(hy, -1, 0.6) * 0.16; A.head.rotation.z = -hx * 0.05;
      A.eyes.forEach(o => { o.iris.position.x = clamp(ex - hx * 0.6, -1, 1) * 0.05; o.iris.position.y = -clamp(ey - hy * 0.5, -1, 1) * 0.03; });
      const active = now - lastMove < 2500;
      if (active && now > nextBlink) { blink = 1; nextBlink = now + 2400 + Math.random() * 2600; }
      blink = Math.max(0, blink - dt * 7);
      const lid = 1 - Math.sin(Math.min(1, blink) * Math.PI) * 0.92;
      A.eyes.forEach(o => { o.eye.scale.y = Math.max(0.08, lid); });
      const waving = now < waveUntil;
      armA += ((waving ? -2.9 : 0) - armA) * (1 - Math.exp(-dt * 7));
      A.wavingArm.arm.rotation.z = A.wavingArm.rest + armA;
      A.wavingArm.elbow.rotation.z = waving ? Math.sin(t * 11) * 0.5 : A.wavingArm.elbow.rotation.z * 0.8;
      A.brows.forEach(b => { b.position.y += (0.3 + (waving ? 0.06 : 0) - b.position.y) * 0.2; });
      const goal = POSES[pose], kp = 1 - Math.exp(-dt * 9);
      for (let k = 0; k < 3; k++) cur[k] += (goal[k] - cur[k]) * kp;
      A.leftArm.arm.rotation.z = cur[0]; A.leftArm.arm.rotation.x = cur[1]; A.leftArm.elbow.rotation.x = cur[2];
      const posing = Math.abs(goal[0] - cur[0]) + Math.abs(goal[1] - cur[1]) + Math.abs(goal[2] - cur[2]) > 0.004 || pose !== "rest";
      const chomping = now < chompUntil;
      A.mouth.scale.y = chomping ? 1 + 1.1 * Math.abs(Math.sin(t * 16)) : A.mouth.scale.y + (1 - A.mouth.scale.y) * 0.25;

      const interacting = active || waving || chomping || posing || Math.abs(armA) > 0.01 || blink > 0 || Math.abs(A.mouth.scale.y - 1) > 0.01;
      if (interacting || now - lastRender > 33) render();                       // breeze alone renders at ~30 fps
      if (interacting || breeze) raf = requestAnimationFrame(frame);
    }

    window.AhaanFigure = {
      mouth() { return screenOf(A.mouth); },
      hand() { return screenOf(A.leftArm.elbow.children[1].children[0]); },
      head() { const p = screenOf(A.head), r = canvas.getBoundingClientRect(); return { x: p.x, y: p.y - A.rig.scale.x * 1.3 / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.distanceTo(A.rig.position)) * r.height }; },
      pose(name) { if (calm() || !POSES[name]) return; pose = name; wake(); },
      chomp() { if (calm()) return; chompUntil = performance.now() + 700; wake(); }
    };
    new MutationObserver(() => { wake(); requestRender(); }).observe(hero, { attributes: true, attributeFilter: ["class"] });
    const kick = () => { if (raf) cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); };   // one loop only
    new MutationObserver(kick).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", kick);
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { offscreen = !es[0].isIntersecting; if (!offscreen) wake(); }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
    if (/[?&]debug\b/.test(location.search)) window.__park = { T, renderer, scene, camera, A, render };   // developer close-ups only
    layout(); render();
    hero.classList.add("park-ready");
    wake();
  }
})();
