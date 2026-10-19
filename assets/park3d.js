/* ---- Home: 3D Top-View Interactive State Map with Ahaan walking exploration.
   Top-down / Bird's-eye view with intuitive directional controls:
   - Up: North (Missouri)
   - Down: South (Louisiana)
   - Left: West (Texas & Oklahoma)
   - Right: East (Tennessee & Mississippi)
   - Full View Controls: Zoom in/out, pan/drag, and reset view.
   - Sensory-friendly: motion only on user interaction; still in Calm mode. ---- */
(function () {
  const hero = document.querySelector(".home-hero"),
        canvas = document.getElementById("parkCanvas"),
        figBox = document.getElementById("ahaanFigure");
  if (!hero || !canvas || !window.AhaanModel) return;

  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  window.AhaanFigure = { mouth: () => null, chomp: () => {} };

  // Sensory-friendly audio settings: silent until enabled
  const SKEY = "ahaanDoorsSound";
  let soundOn = false;
  try {
    const s = JSON.parse(localStorage.getItem(SKEY));
    if (s) soundOn = !!s.on;
  } catch (e) {}

  const soundBtn = document.getElementById("soundBtn");
  function syncSoundUI() {
    if (!soundBtn) return;
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = "🔔 Sound: " + (soundOn ? "on" : "off");
    if (window.AhaanAudio) window.AhaanAudio.setMuted(!soundOn);
  }
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundOn = !soundOn;
      try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: 60 })); } catch (e) {}
      syncSoundUI();
      if (soundOn && window.AhaanAudio) {
        window.AhaanAudio.bell(523.25, 0, 0.08);
      }
    });
    syncSoundUI();
  }

  function playSound(type) {
    if (!soundOn || !window.AhaanAudio) return;
    if (type === "guitar") {
      [
        { f: 220.00, when: 0.00, peak: 0.07, decay: 2.2 },
        { f: 277.18, when: 0.08, peak: 0.06, decay: 2.0 },
        { f: 329.63, when: 0.16, peak: 0.06, decay: 1.8 },
        { f: 440.00, when: 0.24, peak: 0.05, decay: 1.6 }
      ].forEach(n => {
        window.AhaanAudio.strike(n.f, {
          when: n.when,
          peak: n.peak,
          decay: n.decay,
          partials: [[1, 1, 1], [2, 0.4, 0.7], [3, 0.2, 0.5]]
        });
      });
    } else if (type === "storybook") {
      window.AhaanAudio.bell(587.33, 0, 0.06);
    } else if (type === "beacon") {
      window.AhaanAudio.strike(130.81, { decay: 2.6, peak: 0.07, partials: [[1, 1, 1], [2, 0.5, 0.8]] });
    } else if (type === "riverboat") {
      window.AhaanAudio.bell(523.25, 0, 0.06);
      window.AhaanAudio.bell(659.25, 0.22, 0.05);
    } else if (type === "wind") {
      window.AhaanAudio.bell(392.00, 0, 0.05);
    } else if (type === "bounce") {
      window.AhaanAudio.strike(196.00, {
        decay: 0.28,
        peak: 0.08,
        attack: 0.02,
        partials: [[1, 1, 1], [1.5, 0.4, 0.8], [2, 0.2, 0.5]]
      });
    } else if (type === "breeze") {
      window.AhaanAudio.strike(261.63, {
        decay: 0.55,
        peak: 0.04,
        attack: 0.08,
        partials: [[1, 0.8, 1], [1.25, 0.5, 0.9]]
      });
    } else if (type === "star") {
      window.AhaanAudio.bell(880.00, 0, 0.06);
    } else if (type === "apple") {
      window.AhaanAudio.bell(659.25, 0, 0.06);
    } else if (type === "arch") {
      window.AhaanAudio.bell(440.00, 0, 0.06);
    } else if (type === "chime") {
      window.AhaanAudio.bell(523.25, 0, 0.05);
      window.AhaanAudio.bell(659.25, 0.12, 0.04);
    } else if (type === "harp") {
      window.AhaanAudio.bell(440.00, 0, 0.05);
      window.AhaanAudio.bell(554.37, 0.1, 0.05);
      window.AhaanAudio.bell(659.25, 0.2, 0.04);
    } else if (type === "bell") {
      window.AhaanAudio.bell(587.33, 0, 0.06);
    }
  }

  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js";
      s.onload = resolve; s.onerror = () => reject(new Error("three.js failed to load"));
      document.head.appendChild(s);
    });
  }

  loadThree().then(() => {
    try { init(); } catch (e) { console.warn("3D map unavailable:", e.message); }
  }).catch(e => console.warn("3D map unavailable:", e.message));

  function init() {
    const T = window.THREE;
    T.ColorManagement.legacyMode = false;
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new T.Scene();
    const HORIZON = new T.Color("#dbeaf2");
    scene.fog = new T.Fog(HORIZON, 60, 200);

    const camera = new T.PerspectiveCamera(40, 1, 0.1, 450);

    // ---- Sky Dome ----
    scene.add(new T.Mesh(new T.SphereGeometry(200, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new T.Color("#1f73c7") },
        mid: { value: new T.Color("#6bb2e8") },
        bottom: { value: HORIZON }
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.05 ? mix(mid, top, smoothstep(0.05, 0.55, h)) : mix(bottom, mid, smoothstep(-0.04, 0.05, h)); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}"
    })));

    // ---- Lighting ----
    scene.add(new T.HemisphereLight(0xe4f2ff, 0x6e8a56, 0.95));
    const sun = new T.DirectionalLight(0xfff6e3, 1.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -35, right: 35, top: 35, bottom: -35, near: 1, far: 110 });
    sun.shadow.bias = -0.0003;
    sun.position.set(-20, 45, 25);
    scene.add(sun);

    // ==========================================
    // 3D Arkansas & Neighboring States Map Data
    // ==========================================
    const STATES = [
      {
        id: "AR",
        name: "Arkansas",
        city: "Little Rock",
        capital: "Little Rock",
        motto: "The Natural State",
        color: 0x5a9e4d,
        x: 0,
        z: 0,
        rad: 6.2,
        icon: "⭐",
        fact: "Arkansas has diamond fields, sparkling quartz crystal mines, and emerald forests.",
        extra: "Ahaan's Home Base: The picnic blanket and open storybook where adventures begin.",
        actionLabel: "Open Reading Nook"
      },
      {
        id: "MO",
        name: "Missouri",
        city: "St. Louis",
        capital: "Jefferson City",
        motto: "Show-Me State",
        color: 0x4d8a54,
        x: 0,
        z: -13.5,
        rad: 5.6,
        icon: "🏛️",
        fact: "The St. Louis Gateway Arch is 630 feet tall. It is the tallest human-made monument in the United States!",
        extra: "Explorers Meriwether Lewis and William Clark began their historic journey west from here in 1804.",
        actionLabel: "Glow Gateway Arch"
      },
      {
        id: "TN",
        name: "Tennessee",
        city: "Nashville",
        capital: "Nashville",
        motto: "Volunteer State",
        color: 0x487d85,
        x: 13.5,
        z: -5.8,
        rad: 5.4,
        icon: "🎶",
        fact: "Nashville is known as Music City! Tennessee is famous for bluegrass tunes and the Great Smoky Mountains.",
        extra: "Acoustic guitars, banjos, and fiddles fill the mountain air with cheerful melodies.",
        actionLabel: "Strum Acoustic Guitar"
      },
      {
        id: "MS",
        name: "Mississippi",
        city: "Jackson",
        capital: "Jackson",
        motto: "Magnolia State",
        color: 0x498a67,
        x: 12.8,
        z: 7.2,
        rad: 5.4,
        icon: "🌊",
        fact: "The Mississippi River flows all the way south to the Gulf of Mexico. White magnolia blossoms grow here.",
        extra: "Warm river breezes carry the scent of sweet magnolias as river barges float past.",
        actionLabel: "Sweep River Beacon"
      },
      {
        id: "LA",
        name: "Louisiana",
        city: "Baton Rouge",
        capital: "Baton Rouge",
        motto: "Pelican State",
        color: 0x3d7b73,
        x: 0,
        z: 13.5,
        rad: 5.6,
        icon: "🌿",
        fact: "Louisiana has rich bayous and wetland habitats. Pelican birds glide in the water beside historic riverboats.",
        extra: "The red paddle wheel splashes water as the boat cruises past Spanish moss and cypress trees.",
        actionLabel: "Ring Riverboat Bell"
      },
      {
        id: "TX",
        name: "Texas",
        city: "Austin",
        capital: "Austin",
        motto: "The Lone Star State",
        color: 0xa4793f,
        x: -13.8,
        z: 7.2,
        rad: 6.2,
        icon: "🤠",
        fact: "Texas is famous for wide open prairies and big starry skies. Bluebonnet wildflowers bloom across hills each spring.",
        extra: "On clear nights, you can see constellations and shooting stars sparkling across the big open sky.",
        actionLabel: "Spin Lone Star"
      },
      {
        id: "OK",
        name: "Oklahoma",
        city: "Oklahoma City",
        capital: "Oklahoma City",
        motto: "Sooner State",
        color: 0x9c5f42,
        x: -13.8,
        z: -7.2,
        rad: 5.6,
        icon: "🌻",
        fact: "Strong prairie winds sweep across the plains. Giant wind turbines capture the breeze to create clean electricity.",
        extra: "Golden tallgrass prairie grasses wave gently like ocean ripples under the sunny sky.",
        actionLabel: "Spin Wind Turbine"
      }
    ];

    const interactiveMeshes = [];
    const landmarkAnimators = [];

    // Playground animation anchors
    let swingPivot = null;
    let companionSwingPivot = null;
    let trampMat = null;

    function registerInteractive(obj, meta) {
      obj.traverse(child => {
        if (child.isMesh) {
          child.userData = meta;
          interactiveMeshes.push(child);
        }
      });
    }

    const mapGroup = new T.Group();
    scene.add(mapGroup);

    // Procedural painterly meadow texture (clovers, grass blades, buttercups)
    function createMeadowTexture(T) {
      const c = document.createElement("canvas");
      c.width = 512; c.height = 512;
      const g = c.getContext("2d");

      // Deep, rich grass gradient base
      const bg = g.createLinearGradient(0, 0, 512, 512);
      bg.addColorStop(0, "#9fc586");
      bg.addColorStop(0.5, "#8db673");
      bg.addColorStop(1, "#7ea964");
      g.fillStyle = bg;
      g.fillRect(0, 0, 512, 512);

      // Subtle organic soil and lawn dappling
      for (let i = 0; i < 450; i++) {
        const x = Math.random() * 512, y = Math.random() * 512;
        const rad = 2 + Math.random() * 5;
        g.fillStyle = Math.random() > 0.5 ? "rgba(105, 155, 75, 0.3)" : "rgba(165, 205, 130, 0.3)";
        g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      }

      // 3-Lobed clover clusters
      for (let i = 0; i < 95; i++) {
        const cx = Math.random() * 512, cy = Math.random() * 512;
        const cRad = 3 + Math.random() * 3.5;
        g.fillStyle = Math.random() > 0.3 ? "#4d7e35" : "#3d6b28";
        for (let lobe = 0; lobe < 3; lobe++) {
          const ang = (lobe * Math.PI * 2) / 3;
          g.beginPath();
          g.arc(cx + Math.cos(ang) * cRad * 0.7, cy + Math.sin(ang) * cRad * 0.7, cRad * 0.65, 0, Math.PI * 2);
          g.fill();
        }
        g.fillStyle = "rgba(180, 225, 150, 0.45)";
        g.beginPath(); g.arc(cx, cy, cRad * 0.28, 0, Math.PI * 2); g.fill();
      }

      // Fine botanical grass blades
      g.strokeStyle = "rgba(60, 105, 40, 0.45)";
      g.lineWidth = 1.3;
      for (let i = 0; i < 350; i++) {
        const gx = Math.random() * 512, gy = Math.random() * 512;
        g.beginPath();
        g.moveTo(gx, gy);
        g.quadraticCurveTo(gx + (Math.random() - 0.5) * 8, gy - 6 - Math.random() * 8, gx + (Math.random() - 0.5) * 12, gy - 12);
        g.stroke();
      }

      // Wildflower specks (daisy white and sunny yellow buttercups)
      for (let i = 0; i < 50; i++) {
        const bx = Math.random() * 512, by = Math.random() * 512;
        const isYellow = Math.random() > 0.4;
        g.fillStyle = isYellow ? "#ffd54f" : "#ffffff";
        g.beginPath(); g.arc(bx, by, 2.5, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ff9800";
        g.beginPath(); g.arc(bx, by, 1.0, 0, Math.PI * 2); g.fill();
      }

      const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.repeat.set(14, 14);
      return tex;
    }

    // Surrounding grassy terrain with rich clover meadow texture
    const groundGeo = new T.PlaneGeometry(180, 180, 48, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new T.MeshStandardMaterial({
      color: 0xffffff,
      map: createMeadowTexture(T),
      roughness: 0.9
    });
    const ground = new T.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    ground.position.y = 0;
    mapGroup.add(ground);

    // Build state parcel tiles and 3D landmarks
    const stateMeshes = [];
    STATES.forEach(st => {
      const tileGeo = new T.CylinderGeometry(st.rad, st.rad * 1.04, 0.45, 36);
      const tileMat = new T.MeshStandardMaterial({
        color: st.color,
        roughness: 0.75,
        flatShading: true
      });
      const tile = new T.Mesh(tileGeo, tileMat);
      tile.position.set(st.x, 0.22, st.z);
      tile.receiveShadow = true;
      tile.userData = st;
      mapGroup.add(tile);
      stateMeshes.push(tile);

      // Elevated white border ring
      const ringGeo = new T.RingGeometry(st.rad * 0.97, st.rad * 1.04, 40);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.position.set(st.x, 0.48, st.z);
      mapGroup.add(ring);

      // 3D Landmark & State Pin
      buildLandmark(st, mapGroup, T);
      createStatePin(st, mapGroup, T);
    });

    const walkableSurfaces = [ground, ...stateMeshes];

    // ==========================================
    // 3D Mississippi River & Footbridges
    // ==========================================
    buildRiver(mapGroup, T, walkableSurfaces);

    // ==========================================
    // 3D Connecting Trails & Roads
    // ==========================================
    buildPaths(mapGroup, STATES, T, walkableSurfaces);

    // ==========================================
    // 3D Nature: Lush Trees, Rocks & Wildflowers
    // ==========================================
    buildNature(mapGroup, T);

    // ==========================================
    // 3D Storytelling Reading Props (Arkansas)
    // ==========================================
    buildStoryProps(mapGroup, T, walkableSurfaces);

    // ==========================================
    // 3D Playground Equipment (Arkansas)
    // ==========================================
    buildPlayground(mapGroup, T, walkableSurfaces);

    // ==========================================
    // 3D Trampoline Particles System
    // ==========================================
    const trampParticlesGroup = new T.Group();
    mapGroup.add(trampParticlesGroup);

    const particlePool = [];
    const PARTICLE_COUNT = 24;
    const pGeo = new T.DodecahedronGeometry(0.08, 0);
    const pColors = [0xffd166, 0x06d6a0, 0x118ab2, 0xff5964, 0xfff3b0];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pMat = new T.MeshStandardMaterial({
        color: pColors[i % pColors.length],
        roughness: 0.3,
        emissive: pColors[i % pColors.length],
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0
      });
      const pMesh = new T.Mesh(pGeo, pMat);
      pMesh.visible = false;
      pMesh.userData = { vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0.6 };
      trampParticlesGroup.add(pMesh);
      particlePool.push(pMesh);
    }

    // Emit sparkling star particles during trampoline bounce launch
    function spawnTrampParticles() {
      if (calm()) return;
      for (let i = 0; i < 12; i++) {
        const p = particlePool[(Math.random() * PARTICLE_COUNT) | 0];
        if (!p) continue;
        p.visible = true;
        const ang = Math.random() * Math.PI * 2;
        const rad = 0.2 + Math.random() * 0.7;
        p.position.set(-4.3 + Math.cos(ang) * rad, 0.58, 0.2 + Math.sin(ang) * rad);
        p.userData.vx = Math.cos(ang) * (0.8 + Math.random() * 1.2);
        p.userData.vy = 2.4 + Math.random() * 1.8;
        p.userData.vz = Math.sin(ang) * (0.8 + Math.random() * 1.2);
        p.userData.life = 0.5 + Math.random() * 0.25;
        p.userData.maxLife = p.userData.life;
        p.material.opacity = 0.9;
        p.scale.set(1, 1, 1);
      }
    }

    // Update particle positions and fade opacity
    function updateParticles(dt) {
      let anyActive = false;
      particlePool.forEach(p => {
        if (!p.visible) return;
        anyActive = true;
        p.userData.life -= dt;
        if (p.userData.life <= 0) {
          p.visible = false;
          p.material.opacity = 0;
          return;
        }
        p.userData.vy -= 9.8 * dt;
        p.position.x += p.userData.vx * dt;
        p.position.y += p.userData.vy * dt;
        p.position.z += p.userData.vz * dt;
        p.rotation.x += dt * 5;
        p.rotation.y += dt * 6;
        const alpha = p.userData.life / p.userData.maxLife;
        p.material.opacity = alpha * 0.9;
        p.scale.setScalar(Math.max(0.2, alpha));
      });
      return anyActive;
    }

    // ==========================================
    // 3D Sky: Storybook Clouds & Sunbeams
    // ==========================================
    const clouds = buildClouds(scene, T);
    buildSunbeams(scene, T);

    function buildPaths(parent, states, T, walkables) {
      const pathMat = new T.MeshStandardMaterial({ color: 0xdfceb0, roughness: 0.9, flatShading: true });
      const curbMat = new T.MeshStandardMaterial({ color: 0xbeaa86, roughness: 0.85 });
      const stoneMat = new T.MeshStandardMaterial({ color: 0xf6eee0, roughness: 0.8 });

      function addSegment(x1, z1, x2, z2, width, hasSteps) {
        const dx = x2 - x1, dz = z2 - z1;
        const len = Math.hypot(dx, dz);
        const ang = Math.atan2(dx, dz);
        const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;

        const group = new T.Group();
        group.position.set(mx, 0.38, mz);
        group.rotation.y = ang;

        const road = new T.Mesh(new T.BoxGeometry(width, 0.08, len), pathMat);
        road.receiveShadow = true;
        group.add(road);
        if (walkables) walkables.push(road);

        const curbGeo = new T.BoxGeometry(0.18, 0.12, len);
        const leftCurb = new T.Mesh(curbGeo, curbMat);
        leftCurb.position.x = -width / 2;
        const rightCurb = new T.Mesh(curbGeo, curbMat);
        rightCurb.position.x = width / 2;
        group.add(leftCurb, rightCurb);

        if (hasSteps && len > 3.5) {
          const count = Math.floor(len / 1.8);
          for (let i = -count / 2; i <= count / 2; i++) {
            const stone = new T.Mesh(new T.BoxGeometry(0.55, 0.1, 0.65), stoneMat);
            stone.position.set(0, 0.04, i * 1.8);
            group.add(stone);
          }
        }
        parent.add(group);
      }

      const ar = states.find(s => s.id === "AR");
      // Radial paths from Arkansas to each neighboring state
      states.filter(s => s.id !== "AR").forEach(st => {
        addSegment(ar.x, ar.z, st.x, st.z, 2.2, true);
      });

      // Perimeter highway connecting neighbor to neighbor
      const pairs = [["MO", "TN"], ["TN", "MS"], ["MS", "LA"], ["LA", "TX"], ["TX", "OK"], ["OK", "MO"]];
      pairs.forEach(([a, b]) => {
        const s1 = states.find(s => s.id === a), s2 = states.find(s => s.id === b);
        if (s1 && s2) addSegment(s1.x, s1.z, s2.x, s2.z, 1.4, false);
      });
    }

    function buildRiver(parent, T, walkables) {
      const riverGeo = new T.PlaneGeometry(3.6, 52, 1, 36);
      riverGeo.rotateX(-Math.PI / 2);
      const pos = riverGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        const curve = Math.sin(z * 0.12) * 2.2 + Math.cos(z * 0.07) * 1.0;
        pos.setX(i, pos.getX(i) + curve + 7.0);
      }
      riverGeo.computeVertexNormals();

      const riverMat = new T.MeshStandardMaterial({
        color: 0x3d90cb,
        roughness: 0.18,
        metalness: 0.22,
        transparent: true,
        opacity: 0.92
      });
      const river = new T.Mesh(riverGeo, riverMat);
      river.position.y = 0.14;
      parent.add(river);

      function makeBridge(bx, bz, rot) {
        const b = new T.Group();
        b.position.set(bx, 0.44, bz);
        b.rotation.y = rot;
        const woodMat = new T.MeshStandardMaterial({ color: 0x7a4928, roughness: 0.85 });
        const deck = new T.Mesh(new T.BoxGeometry(2.6, 0.16, 4.4), woodMat);
        deck.castShadow = true;
        b.add(deck);
        if (walkables) walkables.push(deck);

        [-1.15, 1.15].forEach(x => {
          const rail = new T.Mesh(new T.BoxGeometry(0.12, 0.52, 4.4), woodMat);
          rail.position.set(x, 0.32, 0);
          b.add(rail);
        });
        parent.add(b);
      }
      makeBridge(6.8, -3.2, -0.42);
      makeBridge(8.2, 4.4, 0.46);

      // Floating water lily pads and pink lotus flowers
      const lilyGeo = new T.CircleGeometry(0.55, 14);
      lilyGeo.rotateX(-Math.PI / 2);
      const lilyMat = new T.MeshStandardMaterial({ color: 0x3d7a42, roughness: 0.6 });
      const lotusMat = new T.MeshStandardMaterial({ color: 0xf498b8, roughness: 0.5 });
      const lilyPositions = [
        [6.8, -10.5], [7.6, -7.0], [7.2, 0.5], [8.0, 9.5], [7.4, 15.0]
      ];
      lilyPositions.forEach(([lx, lz]) => {
        const pad = new T.Mesh(lilyGeo, lilyMat);
        pad.position.set(lx, 0.17, lz);
        parent.add(pad);
        const flower = new T.Mesh(new T.ConeGeometry(0.2, 0.28, 6), lotusMat);
        flower.position.set(lx, 0.32, lz);
        parent.add(flower);
      });

      // Wooden river dock / pier on the Arkansas riverbank
      const dock = new T.Group();
      dock.position.set(5.4, 0.35, -0.5);
      const dockMat = new T.MeshStandardMaterial({ color: 0x6e4428, roughness: 0.85 });
      const pier = new T.Mesh(new T.BoxGeometry(2.4, 0.14, 1.6), dockMat);
      dock.add(pier);
      if (walkables) walkables.push(pier);
      [-1.1, 1.1].forEach(px => {
        const post = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.6, 8), dockMat);
        post.position.set(px, 0.3, 0.7);
        dock.add(post);
      });
      parent.add(dock);
    }

    function buildStoryProps(parent, T, walkables) {
      const storyGroup = new T.Group();
      parent.add(storyGroup);

      // 1. Gingham Picnic Reading Blanket
      const blanketCanvas = document.createElement("canvas");
      blanketCanvas.width = 128; blanketCanvas.height = 128;
      const bg = blanketCanvas.getContext("2d");
      bg.fillStyle = "#fff8f0";
      bg.fillRect(0, 0, 128, 128);
      bg.fillStyle = "rgba(215, 65, 80, 0.75)";
      for (let i = 0; i < 128; i += 32) {
        bg.fillRect(i, 0, 16, 128);
        bg.fillRect(0, i, 128, 16);
      }
      const blanketTex = new T.CanvasTexture(blanketCanvas);
      blanketTex.encoding = T.sRGBEncoding;
      blanketTex.wrapS = blanketTex.wrapT = T.RepeatWrapping;
      blanketTex.repeat.set(4, 3);

      const blanketMat = new T.MeshStandardMaterial({ map: blanketTex, roughness: 0.9 });
      const blanket = new T.Mesh(new T.BoxGeometry(3.6, 0.05, 2.6), blanketMat);
      blanket.position.set(2.4, 0.46, 1.4);
      blanket.receiveShadow = true;
      storyGroup.add(blanket);
      if (walkables) walkables.push(blanket);

      // 2. Open Hardcover Storybook (Interactive Page Flip)
      const bookGroup = new T.Group();
      bookGroup.position.set(2.0, 0.50, 1.2);
      bookGroup.rotation.y = -0.25;
      const coverMat = new T.MeshStandardMaterial({ color: 0x1d3557, roughness: 0.7 });
      const pagesMat = new T.MeshStandardMaterial({ color: 0xfffaee, roughness: 0.8 });
      const cover = new T.Mesh(new T.BoxGeometry(1.2, 0.04, 0.85), coverMat);
      bookGroup.add(cover);

      const leftPage = new T.Mesh(new T.BoxGeometry(0.52, 0.03, 0.78), pagesMat);
      leftPage.position.set(-0.28, 0.03, 0);
      const rightPageGroup = new T.Group();
      rightPageGroup.position.set(0, 0.03, 0);
      const rightPage = new T.Mesh(new T.BoxGeometry(0.52, 0.03, 0.78), pagesMat);
      rightPage.position.set(0.28, 0, 0);
      rightPageGroup.add(rightPage);
      bookGroup.add(leftPage, rightPageGroup);

      const ribbon = new T.Mesh(new T.BoxGeometry(0.08, 0.02, 0.95), new T.MeshStandardMaterial({ color: 0xe63946 }));
      ribbon.position.set(0, 0.04, 0.08);
      bookGroup.add(ribbon);
      storyGroup.add(bookGroup);

      let bookFlipT = 0;
      const triggerBook = () => {
        bookFlipT = 1.0;
        playSound("storybook");
        const list = (typeof CHECKOUTS !== "undefined" ? CHECKOUTS : (window.CHECKOUTS || []));
        const checkoutsList = list.slice(0, 3).map(b => `
          <div class="disc-book-item">
            <span>📖</span>
            <div class="disc-book-title">${b.title} <small style="color:#577390; font-weight:normal;">by ${b.author}</small></div>
          </div>
        `).join("");

        openDiscoveryModal({
          icon: "📖",
          name: "Ahaan's Reading Nook",
          subtitle: "Stories, Adventure & Favorite Books",
          fact: "Reading takes you on magical journeys around the globe! Ahaan loves exploring country tales, maps, and curious riddles.",
          extraContentHtml: `
            <div style="font-weight:700; margin-bottom:8px; color:#1a324d;">Ahaan's Library Checkouts:</div>
            ${checkoutsList}
          `,
          actionLabel: "Flip Story Page",
          x: 2.0,
          z: 1.2,
          onInteract: triggerBook
        });
        wake();
      };
      registerInteractive(bookGroup, { name: "Storybook", x: 2.0, z: 1.2, onInteract: triggerBook });

      landmarkAnimators.push((dt) => {
        if (bookFlipT > 0.001) {
          rightPageGroup.rotation.z = Math.sin(bookFlipT * Math.PI) * 1.8;
          bookFlipT = Math.max(0, bookFlipT - dt * 2.2);
          return true;
        }
        rightPageGroup.rotation.z = 0;
        return false;
      });

      // 3. Adventure Journal & Pen
      const journalGroup = new T.Group();
      journalGroup.position.set(3.3, 0.50, 1.8);
      journalGroup.rotation.y = 0.35;
      const journalMat = new T.MeshStandardMaterial({ color: 0x7c4928, roughness: 0.7 });
      const journal = new T.Mesh(new T.BoxGeometry(0.7, 0.06, 0.95), journalMat);
      journalGroup.add(journal);
      const pen = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 0.7, 8), new T.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 }));
      pen.rotation.z = Math.PI / 2;
      pen.position.set(0, 0.045, 0.55);
      journalGroup.add(pen);
      storyGroup.add(journalGroup);

      registerInteractive(journalGroup, {
        name: "Adventure Journal",
        x: 3.3,
        z: 1.8,
        onInteract: () => {
          playSound("storybook");
          openDiscoveryModal({
            icon: "✍️",
            name: "Adventure Journal",
            subtitle: "Travel Notes & Story Pages",
            fact: "Ahaan writes his own adventure tales in this leather-bound journal.",
            extra: "Every explorer needs a pencil and notebook to sketch maps and record discoveries!",
            actionLabel: "Write Story Idea",
            x: 3.3,
            z: 1.8,
            onInteract: () => showToast("✍️ Story idea added to your adventure journal!")
          });
        }
      });

      // 4. Stargazing Brass Telescope on Tripod
      const teleGroup = new T.Group();
      teleGroup.position.set(-2.2, 0.45, 2.6);
      const woodMat = new T.MeshStandardMaterial({ color: 0x6e4428, roughness: 0.85 });
      const brassMat = new T.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
      for (let leg = 0; leg < 3; leg++) {
        const ang = (leg * Math.PI * 2) / 3;
        const pole = new T.Mesh(new T.CylinderGeometry(0.04, 0.05, 1.9, 8), woodMat);
        pole.position.set(Math.cos(ang) * 0.45, 0.9, Math.sin(ang) * 0.45);
        pole.rotation.x = Math.sin(ang) * 0.25;
        pole.rotation.z = -Math.cos(ang) * 0.25;
        pole.castShadow = true;
        teleGroup.add(pole);
      }
      const mount = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 0.25, 10), brassMat);
      mount.position.y = 1.82;
      teleGroup.add(mount);

      const tubeGroup = new T.Group();
      tubeGroup.position.set(0, 1.95, 0);
      tubeGroup.rotation.y = -0.5;
      tubeGroup.rotation.x = -0.55;
      const tube = new T.Mesh(new T.CylinderGeometry(0.1, 0.16, 2.2, 14), brassMat);
      tube.castShadow = true;
      tubeGroup.add(tube);
      const lensRing = new T.Mesh(new T.TorusGeometry(0.17, 0.03, 8, 16), brassMat);
      lensRing.position.y = 1.1;
      tubeGroup.add(lensRing);
      teleGroup.add(tubeGroup);
      storyGroup.add(teleGroup);

      let teleTiltT = 0;
      const triggerTele = () => {
        teleTiltT = 1.0;
        playSound("star");
        openDiscoveryModal({
          icon: "🔭",
          name: "Sky & Stars Explorer",
          subtitle: "Brass Telescope Observations",
          fact: "Look through the brass telescope to see fluffy cumulus clouds by day and sparkling stars by night.",
          extraContentHtml: `
            <div style="background:#eef6fc; border:1px solid #c9dff2; border-radius:10px; padding:10px 12px; color:#183b5d;">
              <b>⭐ Constellation Fact:</b> The Big Dipper is part of Ursa Major (the Great Bear). It points straight to Polaris, the North Star!
            </div>
          `,
          actionLabel: "Aim Skyward",
          x: -2.2,
          z: 2.6,
          onInteract: triggerTele
        });
        wake();
      };
      registerInteractive(teleGroup, { name: "Brass Telescope", x: -2.2, z: 2.6, onInteract: triggerTele });

      landmarkAnimators.push((dt) => {
        if (teleTiltT > 0.001) {
          tubeGroup.rotation.x = -0.55 - Math.sin(teleTiltT * Math.PI) * 0.35;
          teleTiltT = Math.max(0, teleTiltT - dt * 1.8);
          return true;
        }
        tubeGroup.rotation.x = -0.55;
        return false;
      });

      // 5. Picnic Basket with Shiny Red Apple
      const basketGroup = new T.Group();
      basketGroup.position.set(1.5, 0.46, 2.2);
      const wickerMat = new T.MeshStandardMaterial({ color: 0xb58249, roughness: 0.9 });
      const basket = new T.Mesh(new T.BoxGeometry(0.85, 0.55, 0.65), wickerMat);
      basket.position.y = 0.28;
      basket.castShadow = true;
      basketGroup.add(basket);
      const handle = new T.Mesh(new T.TorusGeometry(0.38, 0.04, 8, 16, Math.PI), wickerMat);
      handle.position.y = 0.55;
      basketGroup.add(handle);
      const appleMat = new T.MeshStandardMaterial({ color: 0xd90429, roughness: 0.4 });
      const apple = new T.Mesh(new T.SphereGeometry(0.12, 10, 8), appleMat);
      apple.position.set(0.65, 0.12, -0.2);
      apple.castShadow = true;
      basketGroup.add(apple);
      storyGroup.add(basketGroup);

      let appleBounceT = 0;
      const triggerApple = () => {
        appleBounceT = 1.0;
        playSound("apple");
        if (window.AhaanFigure && window.AhaanFigure.chomp) window.AhaanFigure.chomp();
        showToast("🍎 CRUNCH! Delicious sweet Honeycrisp apple!");
        wake();
      };
      registerInteractive(basketGroup, { name: "Picnic Apple", x: 1.5, z: 2.2, onInteract: triggerApple });

      landmarkAnimators.push((dt) => {
        if (appleBounceT > 0.001) {
          apple.position.y = 0.12 + Math.sin(appleBounceT * Math.PI) * 0.45;
          appleBounceT = Math.max(0, appleBounceT - dt * 2.5);
          return true;
        }
        apple.position.y = 0.12;
        return false;
      });

      // 6. Garden Lantern (Interactive PointLight Toggle)
      const lanternGroup = new T.Group();
      lanternGroup.position.set(-2.0, 0.45, -1.6);
      const metalMat = new T.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.4 });
      const baseLantern = new T.Mesh(new T.CylinderGeometry(0.2, 0.24, 0.1, 8), metalMat); baseLantern.position.y = 0.05;
      const capLantern = new T.Mesh(new T.ConeGeometry(0.26, 0.22, 8), metalMat); capLantern.position.y = 0.7;
      const glassMat = new T.MeshStandardMaterial({ color: 0xffd166, roughness: 0.2, emissive: 0xffaa00, emissiveIntensity: 0.5 });
      const glass = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 0.5, 8), glassMat);
      glass.position.y = 0.35;
      lanternGroup.add(baseLantern, glass, capLantern);

      const lanternLight = new T.PointLight(0xffa726, 1.4, 8.0);
      lanternLight.position.set(-2.0, 0.9, -1.6);
      lanternLight.castShadow = true;
      parent.add(lanternLight);
      storyGroup.add(lanternGroup);

      let lanternOn = true;
      const triggerLantern = () => {
        lanternOn = !lanternOn;
        lanternLight.intensity = lanternOn ? 1.4 : 0;
        glassMat.emissiveIntensity = lanternOn ? 0.5 : 0.05;
        playSound("storybook");
        showToast(`💡 Lantern ${lanternOn ? "turned on" : "turned off"}!`);
        wake();
      };
      registerInteractive(lanternGroup, { name: "Garden Lantern", x: -2.0, z: -1.6, onInteract: triggerLantern });

      // 7. Dandelions with Floating Seed Tufts
      const dandelionSeeds = [];
      const seedGeo = new T.SphereGeometry(0.06, 6, 4);
      const seedMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

      function createDandelion(x, z, scale) {
        const dand = new T.Group();
        dand.position.set(x, 0.45, z);
        const stemMat = new T.MeshStandardMaterial({ color: 0x5a8a42, roughness: 0.8 });
        const stem = new T.Mesh(new T.CylinderGeometry(0.04 * scale, 0.04 * scale, 1.1 * scale, 8), stemMat);
        stem.position.y = 0.55 * scale;
        dand.add(stem);
        const headMat = new T.MeshStandardMaterial({ color: 0xffd000, roughness: 0.9, flatShading: true });
        const blossom = new T.Mesh(new T.SphereGeometry(0.3 * scale, 10, 8), headMat);
        blossom.position.y = 1.15 * scale;
        dand.add(blossom);
        for (let l = 0; l < 4; l++) {
          const lang = (l * Math.PI) / 2;
          const leaf = new T.Mesh(new T.BoxGeometry(0.18 * scale, 0.03, 0.65 * scale), stemMat);
          leaf.position.set(Math.cos(lang) * 0.3 * scale, 0.05, Math.sin(lang) * 0.3 * scale);
          leaf.rotation.y = lang;
          leaf.rotation.x = 0.2;
          dand.add(leaf);
        }
        storyGroup.add(dand);

        registerInteractive(dand, {
          name: "Dandelion",
          x, z,
          onInteract: () => {
            if (calm()) {
              showToast("🌼 Yellow sunshine dandelion in the grass!");
              return;
            }
            playSound("wind");
            for (let s = 0; s < 8; s++) {
              const seed = new T.Mesh(seedGeo, seedMat.clone());
              seed.position.set(x + (Math.random() - 0.5) * 0.3, 0.45 + 1.15 * scale, z + (Math.random() - 0.5) * 0.3);
              const vel = new T.Vector3((Math.random() - 0.2) * 1.4, 0.8 + Math.random() * 1.2, (Math.random() - 0.5) * 1.4);
              storyGroup.add(seed);
              dandelionSeeds.push({ mesh: seed, vel, life: 1.0 });
            }
            showToast("✨ Made a wish on the dandelion seeds!");
            wake();
          }
        });
      }
      createDandelion(-3.4, 3.8, 1.2);
      createDandelion(-3.8, 4.4, 0.9);
      createDandelion(3.8, 3.6, 1.1);
      createDandelion(4.4, 4.2, 0.85);

      landmarkAnimators.push((dt) => {
        let active = false;
        for (let i = dandelionSeeds.length - 1; i >= 0; i--) {
          active = true;
          const sd = dandelionSeeds[i];
          sd.mesh.position.addScaledVector(sd.vel, dt);
          sd.vel.x += dt * 0.4;
          sd.life -= dt * 0.45;
          sd.mesh.material.opacity = Math.max(0, sd.life);
          if (sd.life <= 0) {
            storyGroup.remove(sd.mesh);
            dandelionSeeds.splice(i, 1);
          }
        }
        return active;
      });
    }

    // ==========================================
    // 3D Playground Equipment (Arkansas)
    // ==========================================
    function buildPlayground(parent, T, walkables) {
      const playGroup = new T.Group();
      parent.add(playGroup);

      const cedarMat = new T.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.85 });
      const canopyMat = new T.MeshStandardMaterial({ color: 0xffc837, roughness: 0.55 });
      const slideChuteMat = new T.MeshStandardMaterial({ color: 0xef476f, roughness: 0.35 });
      const railYellowMat = new T.MeshStandardMaterial({ color: 0xffd166, roughness: 0.4 });
      const landingPadMat = new T.MeshStandardMaterial({ color: 0x118ab2, roughness: 0.7 });
      const steelMat = new T.MeshStandardMaterial({ color: 0xa8b2ba, metalness: 0.85, roughness: 0.25 });
      const chainMat = new T.MeshStandardMaterial({ color: 0xdde2e6, metalness: 0.85, roughness: 0.25 });
      const swingSeatMatA = new T.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.45 }); // Vivid cherry red
      const swingSeatMatB = new T.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45 }); // Azure blue
      const mulchMat = new T.MeshStandardMaterial({ color: 0x5a3825, roughness: 0.95 });
      const trampPadMat = new T.MeshStandardMaterial({ color: 0x06d6a0, roughness: 0.45 });
      const trampMatBlack = new T.MeshStandardMaterial({ color: 0x1a211e, roughness: 0.95 });
      const netMat = new T.MeshStandardMaterial({ color: 0x223344, transparent: true, opacity: 0.22, side: T.DoubleSide });
      const foamSleeveMat = new T.MeshStandardMaterial({ color: 0x3a86ff, roughness: 0.6 });

      // ------------------------------------------
      // 1. Playground Slide (North-West Lawn: x = -2.6, z = -3.2)
      // ------------------------------------------
      const slideGroup = new T.Group();
      slideGroup.position.set(-2.6, 0.45, -3.2);
      playGroup.add(slideGroup);

      // Four cedar timber tower posts
      [[-0.42, -0.32], [0.42, -0.32], [-0.42, 0.32], [0.42, 0.32]].forEach(([px, pz]) => {
        const post = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 2.3, 8), cedarMat);
        post.position.set(px, 1.15, pz);
        post.castShadow = true;
        slideGroup.add(post);
      });

      // Wooden tower platform deck at y = 1.6
      const slideDeck = new T.Mesh(new T.BoxGeometry(0.96, 0.08, 0.76), cedarMat);
      slideDeck.position.set(0, 1.6, 0);
      slideDeck.receiveShadow = true;
      slideGroup.add(slideDeck);
      if (walkables) walkables.push(slideDeck);

      // Pitch gable canopy roof
      const canopy = new T.Mesh(new T.ConeGeometry(0.78, 0.52, 4), canopyMat);
      canopy.position.set(0, 2.5, 0);
      canopy.rotation.y = Math.PI / 4;
      canopy.castShadow = true;
      slideGroup.add(canopy);

      // Rear ladder rungs on North side (z = -0.32)
      for (let r = 0; r < 5; r++) {
        const rung = new T.Mesh(new T.CylinderGeometry(0.022, 0.022, 0.68, 8), railYellowMat);
        rung.position.set(0, 0.32 + r * 0.27, -0.32);
        rung.rotation.z = Math.PI / 2;
        rung.castShadow = true;
        slideGroup.add(rung);
      }

      // Safety side rails on deck
      [-0.42, 0.42].forEach(rx => {
        const sideRail = new T.Mesh(new T.BoxGeometry(0.04, 0.35, 0.72), railYellowMat);
        sideRail.position.set(rx, 1.82, 0);
        slideGroup.add(sideRail);
      });

      // Smooth curved slide chute descending South towards the viewer (+Z)
      const chuteCurve = new T.CatmullRomCurve3([
        new T.Vector3(0, 1.58, 0.35),
        new T.Vector3(0, 1.35, 0.75),
        new T.Vector3(0, 0.75, 1.25),
        new T.Vector3(0, 0.22, 1.65),
        new T.Vector3(0, 0.06, 1.95)
      ]);
      const chute = new T.Mesh(new T.TubeGeometry(chuteCurve, 28, 0.22, 12, false), slideChuteMat);
      chute.castShadow = true;
      slideGroup.add(chute);

      // Soft rubber landing pad at bottom of chute
      const landingPad = new T.Mesh(new T.BoxGeometry(0.85, 0.04, 0.85), landingPadMat);
      landingPad.position.set(0, 0.02, 2.1);
      landingPad.receiveShadow = true;
      slideGroup.add(landingPad);
      if (walkables) walkables.push(landingPad);

      registerInteractive(slideGroup, {
        name: "Playground Slide",
        activity: "slide",
        onInteract: () => startPlayActivity("slide")
      });

      // ------------------------------------------
      // 2. Cedar Swing Set (North-East Lawn: x = 3.2, z = -2.8)
      // ------------------------------------------
      // 2. Cedar A-Frame Swing Set (East Lawn: x = 3.2, z = -2.8)
      // ------------------------------------------
      const swingGroup = new T.Group();
      swingGroup.position.set(3.2, 0.45, -2.8);
      playGroup.add(swingGroup);

      // Soft cedar mulch safety bed
      const mulchBed = new T.Mesh(new T.BoxGeometry(6.4, 0.03, 5.2), mulchMat);
      mulchBed.position.set(0, 0.015, 0);
      mulchBed.receiveShadow = true;
      swingGroup.add(mulchBed);
      if (walkables) walkables.push(mulchBed);

      // Cedar A-Frame upright legs on left (x = -2.5) and right (x = 2.5)
      const legHeight = 8.2;
      [-2.5, 2.5].forEach(ax => {
        [-1.8, 1.8].forEach(az => {
          const leg = new T.Mesh(new T.CylinderGeometry(0.09, 0.11, legHeight, 10), cedarMat);
          leg.position.set(ax, legHeight * 0.48, az * 0.45);
          leg.rotation.x = (az > 0 ? -1 : 1) * 0.25;
          leg.castShadow = true;
          swingGroup.add(leg);
        });
        const spreader = new T.Mesh(new T.BoxGeometry(0.12, 0.12, 2.1), cedarMat);
        spreader.position.set(ax, 2.6, 0);
        swingGroup.add(spreader);
      });

      // Top horizontal crossbeam at y = 7.60
      const crossbeam = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 5.4, 12), cedarMat);
      crossbeam.position.set(0, 7.60, 0);
      crossbeam.rotation.z = Math.PI / 2;
      crossbeam.castShadow = true;
      swingGroup.add(crossbeam);

      // Left Swing: Ahaan's interactive swing (x = -1.15)
      const swingChainLen = 4.8;
      swingPivot = new T.Group();
      swingPivot.position.set(-1.15, 7.55, 0);
      [-0.48, 0.48].forEach(cx => {
        const chain = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, swingChainLen, 6), chainMat);
        chain.position.set(cx, -swingChainLen * 0.5, 0);
        swingPivot.add(chain);

        const bolt = new T.Mesh(new T.CylinderGeometry(0.024, 0.024, 0.12, 6), steelMat);
        bolt.position.set(cx, -swingChainLen + 0.05, 0);
        swingPivot.add(bolt);
      });
      const seatA = new T.Mesh(new T.BoxGeometry(1.24, 0.09, 0.60), swingSeatMatA);
      seatA.position.set(0, -swingChainLen, 0);
      seatA.castShadow = true;
      swingPivot.add(seatA);
      swingGroup.add(swingPivot);

      // Right Swing: Companion swing gently swaying in breeze (x = 1.15)
      companionSwingPivot = new T.Group();
      companionSwingPivot.position.set(1.15, 7.55, 0);
      [-0.48, 0.48].forEach(cx => {
        const chain = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, swingChainLen, 6), chainMat);
        chain.position.set(cx, -swingChainLen * 0.5, 0);
        companionSwingPivot.add(chain);

        const bolt = new T.Mesh(new T.CylinderGeometry(0.024, 0.024, 0.12, 6), steelMat);
        bolt.position.set(cx, -swingChainLen + 0.05, 0);
        companionSwingPivot.add(bolt);
      });
      const seatB = new T.Mesh(new T.BoxGeometry(1.24, 0.09, 0.60), swingSeatMatB);
      seatB.position.set(0, -swingChainLen, 0);
      seatB.castShadow = true;
      companionSwingPivot.add(seatB);
      swingGroup.add(companionSwingPivot);

      registerInteractive(swingGroup, {
        name: "Playground Swings",
        activity: "swing",
        onInteract: () => startPlayActivity("swing")
      });

      // ------------------------------------------
      // 3. Backyard Trampoline (West Lawn: x = -4.3, z = 0.2)
      // ------------------------------------------
      const trampGroup = new T.Group();
      trampGroup.position.set(-4.3, 0.45, 0.2);
      playGroup.add(trampGroup);

      // Steel circular frame ring
      const frameRing = new T.Mesh(new T.TorusGeometry(1.35, 0.045, 8, 32), steelMat);
      frameRing.position.y = 0.55;
      frameRing.rotation.x = Math.PI / 2;
      frameRing.castShadow = true;
      trampGroup.add(frameRing);

      // Four U-shaped support legs
      for (let leg = 0; leg < 4; leg++) {
        const lang = (leg * Math.PI) / 2 + Math.PI / 4;
        const lx = Math.cos(lang) * 1.25, lz = Math.sin(lang) * 1.25;
        const post = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.55, 8), steelMat);
        post.position.set(lx, 0.275, lz);
        post.castShadow = true;
        trampGroup.add(post);
      }

      // Spring safety cover pad
      const springPad = new T.Mesh(new T.TorusGeometry(1.24, 0.12, 8, 32), trampPadMat);
      springPad.position.y = 0.56;
      springPad.rotation.x = Math.PI / 2;
      springPad.castShadow = true;
      trampGroup.add(springPad);

      // Bounce jump mat
      trampMat = new T.Mesh(new T.CylinderGeometry(1.12, 1.12, 0.03, 24), trampMatBlack);
      trampMat.position.y = 0.54;
      trampMat.receiveShadow = true;
      trampGroup.add(trampMat);
      if (walkables) walkables.push(trampMat);

      // 4 Enclosure safety poles
      for (let p = 0; p < 4; p++) {
        const pang = (p * Math.PI) / 2 + Math.PI / 4;
        const px = Math.cos(pang) * 1.34, pz = Math.sin(pang) * 1.34;
        const pole = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.35, 8), foamSleeveMat);
        pole.position.set(px, 1.22, pz);
        pole.castShadow = true;
        trampGroup.add(pole);
      }

      // Safety enclosure net with front entrance gap
      const netMesh = new T.Mesh(new T.CylinderGeometry(1.32, 1.32, 1.3, 24, 1, true, 0.4, Math.PI * 1.7), netMat);
      netMesh.position.y = 1.2;
      trampGroup.add(netMesh);

      // 2-step access ladder on East side (towards Arkansas center)
      const trampLadder = new T.Group();
      trampLadder.position.set(1.35, 0.27, 0);
      trampLadder.rotation.z = -0.28;
      [-0.14, 0.14].forEach(lz => {
        const side = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.62, 6), steelMat);
        side.position.set(0, 0, lz);
        trampLadder.add(side);
      });
      for (let r = -0.14; r <= 0.14; r += 0.28) {
        const rung = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 0.28, 6), steelMat);
        rung.position.set(0, r, 0);
        rung.rotation.x = Math.PI / 2;
        trampLadder.add(rung);
      }
      trampGroup.add(trampLadder);

      registerInteractive(trampGroup, {
        name: "Spring Trampoline",
        activity: "trampoline",
        onInteract: () => startPlayActivity("trampoline")
      });

      // Ambient companion swing motion in breeze
      landmarkAnimators.push((dt) => {
        if (companionSwingPivot) {
          if (!calm()) {
            companionSwingPivot.rotation.x = Math.sin(performance.now() * 0.0018) * 0.08;
          } else {
            companionSwingPivot.rotation.x = 0;
          }
        }
        if (currentActivity !== "swing" && swingPivot && Math.abs(swingPivot.rotation.x) > 0.001) {
          swingPivot.rotation.x *= Math.max(0, 1 - dt * 3.5);
          return true;
        }
        return false;
      });
    }

    function buildClouds(scene, T) {
      const cloudsGroup = new T.Group();
      scene.add(cloudsGroup);

      const cloudMat = new T.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.85,
        flatShading: true
      });
      const shadowMat = new T.MeshBasicMaterial({
        color: 0x1a3320,
        transparent: true,
        opacity: 0.16,
        depthWrite: false
      });
      const shadowGeo = new T.CircleGeometry(3.5, 16);
      shadowGeo.rotateX(-Math.PI / 2);

      const clouds = [];
      const cloudConfigs = [
        { x: -30, y: 20, z: -26, s: 0.95, speed: 0.35 },
        { x: 25, y: 21, z: -25, s: 1.05, speed: 0.4 },
        { x: -4, y: 22, z: -28, s: 1.2, speed: 0.3 },
        { x: 36, y: 19, z: -22, s: 0.85, speed: 0.42 },
        { x: -36, y: 19, z: -18, s: 0.85, speed: 0.38 }
      ];

      cloudConfigs.forEach(cfg => {
        const cGroup = new T.Group();
        cGroup.position.set(cfg.x, cfg.y, cfg.z);
        cGroup.userData = { speed: cfg.speed, baseZ: cfg.z };

        // Fluffy cumulus cloud lobes
        const s0 = new T.Mesh(new T.SphereGeometry(2.4 * cfg.s, 10, 8), cloudMat);
        s0.castShadow = true;
        cGroup.add(s0);
        const s1 = new T.Mesh(new T.SphereGeometry(1.7 * cfg.s, 8, 7), cloudMat);
        s1.position.set(-1.8 * cfg.s, -0.2 * cfg.s, 0.4 * cfg.s);
        s1.castShadow = true;
        cGroup.add(s1);
        const s2 = new T.Mesh(new T.SphereGeometry(1.9 * cfg.s, 8, 7), cloudMat);
        s2.position.set(2.0 * cfg.s, -0.2 * cfg.s, -0.3 * cfg.s);
        s2.castShadow = true;
        cGroup.add(s2);
        const s3 = new T.Mesh(new T.SphereGeometry(1.5 * cfg.s, 8, 7), cloudMat);
        s3.position.set(0.4 * cfg.s, 1.2 * cfg.s, 0.2 * cfg.s);
        s3.castShadow = true;
        cGroup.add(s3);

        // Ground shadow oval moving with cloud
        const shadow = new T.Mesh(shadowGeo, shadowMat);
        shadow.scale.set(cfg.s * 1.2, 1, cfg.s * 0.85);
        shadow.position.set(0, -cfg.y + 0.22, 1.2);
        cGroup.add(shadow);

        cloudsGroup.add(cGroup);
        clouds.push(cGroup);
      });

      return clouds;
    }

    function buildSunbeams(scene, T) {
      const beamsGroup = new T.Group();
      scene.add(beamsGroup);

      const beamMat = new T.MeshBasicMaterial({
        color: 0xfff6dc,
        transparent: true,
        opacity: 0.08,
        side: T.DoubleSide,
        depthWrite: false,
        blending: T.AdditiveBlending
      });

      [-16, -7, 3, 14].forEach((bx, i) => {
        const beam = new T.Mesh(new T.PlaneGeometry(5 + i, 45), beamMat);
        beam.position.set(bx, 8, -2);
        beam.rotation.z = -0.45;
        beam.rotation.x = 0.35;
        beamsGroup.add(beam);
      });
    }

    function buildNature(parent, T) {
      const barkMat = new T.MeshStandardMaterial({ color: 0x5a3821, roughness: 0.9 });
      const foliageMats = [
        new T.MeshStandardMaterial({ color: 0x488338, roughness: 0.8 }),
        new T.MeshStandardMaterial({ color: 0x3d742e, roughness: 0.8 }),
        new T.MeshStandardMaterial({ color: 0x569642, roughness: 0.8 }),
        new T.MeshStandardMaterial({ color: 0x27532a, roughness: 0.85 }), // pine dark green
        new T.MeshStandardMaterial({ color: 0xf2a4b4, roughness: 0.75 }), // cherry blossom pink
        new T.MeshStandardMaterial({ color: 0xf5cb56, roughness: 0.75 })  // golden maple
      ];
      const rockMat = new T.MeshStandardMaterial({ color: 0x939a95, roughness: 0.85, flatShading: true });
      const flowerMats = [
        new T.MeshBasicMaterial({ color: 0xffffff }),
        new T.MeshBasicMaterial({ color: 0xffd13b }),
        new T.MeshBasicMaterial({ color: 0xb59dd6 })
      ];

      function createOak(x, z, scale, matIdx) {
        const tree = new T.Group();
        tree.position.set(x, 0, z);
        const trunk = new T.Mesh(new T.CylinderGeometry(0.24 * scale, 0.38 * scale, 2.6 * scale, 8), barkMat);
        trunk.position.y = 1.3 * scale;
        trunk.castShadow = true;
        tree.add(trunk);

        const fMat = foliageMats[matIdx || 0];
        const crown = new T.Group();
        crown.position.y = 2.7 * scale;
        const mainSph = new T.Mesh(new T.SphereGeometry(1.4 * scale, 10, 8), fMat);
        mainSph.castShadow = true;
        crown.add(mainSph);
        const c1 = new T.Mesh(new T.SphereGeometry(0.9 * scale, 8, 7), fMat);
        c1.position.set(0.6 * scale, 0.4 * scale, 0.3 * scale);
        const c2 = new T.Mesh(new T.SphereGeometry(0.85 * scale, 8, 7), fMat);
        c2.position.set(-0.5 * scale, 0.3 * scale, -0.4 * scale);
        crown.add(c1, c2);
        tree.add(crown);
        parent.add(tree);
      }

      function createPine(x, z, scale) {
        const tree = new T.Group();
        tree.position.set(x, 0, z);
        const trunk = new T.Mesh(new T.CylinderGeometry(0.18 * scale, 0.28 * scale, 1.8 * scale, 8), barkMat);
        trunk.position.y = 0.9 * scale;
        trunk.castShadow = true;
        tree.add(trunk);

        const pMat = foliageMats[3];
        [
          { r: 1.3 * scale, h: 1.6 * scale, y: 1.8 * scale },
          { r: 1.0 * scale, h: 1.4 * scale, y: 2.7 * scale },
          { r: 0.7 * scale, h: 1.2 * scale, y: 3.5 * scale }
        ].forEach(c => {
          const cone = new T.Mesh(new T.ConeGeometry(c.r, c.h, 7), pMat);
          cone.position.y = c.y;
          cone.castShadow = true;
          tree.add(cone);
        });
        parent.add(tree);
      }

      function createRock(x, z, sx, sy, sz) {
        const rock = new T.Mesh(new T.DodecahedronGeometry(0.7, 0), rockMat);
        rock.position.set(x, 0.3 * sy, z);
        rock.scale.set(sx, sy, sz);
        rock.rotation.set(x * 0.5, z * 0.3, 0);
        rock.castShadow = true;
        parent.add(rock);
      }

      function createFlowerPatch(cx, cz, radius, count) {
        for (let i = 0; i < count; i++) {
          const ang = (i / count) * Math.PI * 2 + (i % 3);
          const r = 0.3 + (i % 5) * (radius / 5);
          const fx = cx + Math.cos(ang) * r;
          const fz = cz + Math.sin(ang) * r;
          const fMat = flowerMats[i % flowerMats.length];
          const f = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.22, 6), fMat);
          f.position.set(fx, 0.16, fz);
          parent.add(f);
        }
      }

      function createSignpost(x, z, label, arrow) {
        const sign = new T.Group();
        sign.position.set(x, 0.45, z);
        const post = new T.Mesh(new T.CylinderGeometry(0.08, 0.09, 1.6, 8), barkMat);
        post.position.y = 0.8;
        post.castShadow = true;
        sign.add(post);

        const c = document.createElement("canvas");
        c.width = 160; c.height = 56;
        const g = c.getContext("2d");
        g.fillStyle = "#7c4522";
        g.roundRect(4, 4, 152, 48, 8);
        g.fill();
        g.strokeStyle = "#ffffff"; g.lineWidth = 2;
        g.stroke();
        g.fillStyle = "#ffffff";
        g.font = "bold 20px sans-serif";
        g.textAlign = "center";
        g.fillText(`${arrow} ${label}`, 80, 35);
        const tex = new T.CanvasTexture(c);
        tex.encoding = T.sRGBEncoding;

        const board = new T.Mesh(
          new T.PlaneGeometry(1.6, 0.5),
          new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide })
        );
        board.position.set(0, 1.35, 0);
        board.rotation.x = -Math.PI * 0.25;
        sign.add(board);
        parent.add(sign);
      }

      // Northwest Grove (between Oklahoma & Missouri)
      createOak(-8.5, -14.2, 1.1, 0);
      createPine(-10.8, -16.0, 1.2);
      createOak(-6.8, -11.0, 0.95, 2);
      createPine(-15.2, -14.5, 1.05);
      createOak(-11.5, -9.5, 0.9, 5);

      // Northeast Grove (between Missouri & Tennessee)
      createPine(7.5, -15.2, 1.15);
      createOak(9.8, -13.0, 1.05, 1);
      createOak(5.6, -10.5, 0.9, 4);
      createPine(12.5, -14.8, 1.1);

      // East & Riverbank Grove (near Tennessee & Mississippi)
      createOak(18.5, -11.5, 1.2, 0);
      createOak(19.2, -1.5, 1.15, 2);
      createPine(18.0, 3.8, 1.1);
      createOak(17.5, 12.5, 1.25, 1);
      createOak(6.2, -7.5, 0.85, 4);
      createPine(6.4, 8.5, 0.95);

      // South Grove (between Louisiana, Mississippi & Texas)
      createOak(7.2, 14.8, 1.1, 0);
      createPine(9.5, 13.0, 1.05);
      createOak(-7.5, 14.5, 1.15, 2);
      createPine(-9.2, 16.5, 1.2);
      createOak(0.0, 21.0, 1.3, 1);

      // Southwest Grove (between Texas & Oklahoma)
      createOak(-18.5, 0.0, 1.25, 5);
      createPine(-21.0, -3.5, 1.15);
      createOak(-21.2, 3.8, 1.1, 0);
      createPine(-17.8, 13.0, 1.05);
      createOak(-14.2, 0.0, 0.85, 2);

      // Forest rim framing around perimeter
      const rimTrees = [
        [-24, -12], [-22, -19], [-16, -23], [-8, -25], [0, -25], [8, -25], [16, -23], [23, -18],
        [25, -9], [25, 0], [25, 10], [22, 19], [15, 24], [7, 26], [-1, 26], [-8, 25], [-16, 23],
        [-23, 17], [-26, 8], [-26, -2]
      ];
      rimTrees.forEach(([rx, rz], i) => {
        if (i % 2 === 0) createOak(rx, rz, 1.15 + (i % 3) * 0.1, i % 3);
        else createPine(rx, rz, 1.1 + (i % 3) * 0.12);
      });

      // Rocks
      createRock(-4.8, -4.5, 1.1, 0.8, 1.2);
      createRock(-5.4, -4.0, 0.7, 0.6, 0.8);
      createRock(5.0, -3.5, 1.2, 0.9, 1.0);
      createRock(7.5, -2.0, 0.9, 0.7, 1.1);
      createRock(8.5, 6.0, 1.0, 0.8, 0.9);
      createRock(-6.5, 5.0, 1.2, 0.9, 1.1);
      createRock(-8.0, 11.0, 1.4, 1.1, 1.3);
      createRock(10.5, -9.0, 1.1, 0.8, 1.0);

      // Flower patches
      createFlowerPatch(-3.5, -3.5, 1.8, 14);
      createFlowerPatch(4.2, -4.8, 2.0, 16);
      createFlowerPatch(-4.5, 4.2, 1.8, 14);
      createFlowerPatch(5.5, 4.8, 2.0, 16);
      createFlowerPatch(-9.5, -3.0, 2.2, 18);
      createFlowerPatch(11.5, 2.5, 2.2, 18);

      // Directional trail signs on grass verges
      createSignpost(-2.0, -6.6, "Missouri", "↑");
      createSignpost(6.8, -0.6, "Tennessee", "→");
      createSignpost(-6.8, 3.4, "Texas", "←");
      createSignpost(2.0, 6.6, "Louisiana", "↓");
    }

    function buildLandmark(st, parent, T) {
      if (st.id === "AR") {
        return;
      }

      if (st.id === "MO") {
        const archGroup = new T.Group();
        archGroup.position.set(st.x, 0.45, st.z);

        const archMat = new T.MeshStandardMaterial({
          color: 0xdce2ea,
          metalness: 0.5,
          roughness: 0.25,
          emissive: new T.Color(0x000000),
          emissiveIntensity: 0
        });
        const arch = new T.Mesh(new T.TorusGeometry(3.6, 0.42, 14, 36, Math.PI), archMat);
        arch.castShadow = true;
        archGroup.add(arch);

        // Golden apex halo ring
        const haloMat = new T.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0 });
        const halo = new T.Mesh(new T.TorusGeometry(3.8, 0.08, 8, 36, Math.PI), haloMat);
        archGroup.add(halo);

        let pulseT = 0;
        const trigger = () => {
          pulseT = 1.0;
          playSound("arch");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(archGroup, { ...st, onInteract: trigger });
        parent.add(archGroup);

        landmarkAnimators.push((dt) => {
          if (pulseT > 0.001) {
            pulseT = Math.max(0, pulseT - dt * 1.5);
            archMat.emissive.setHex(0xf4d06f);
            archMat.emissiveIntensity = Math.sin(pulseT * Math.PI) * 0.7;
            haloMat.opacity = Math.sin(pulseT * Math.PI) * 0.85;
            return true;
          }
          archMat.emissiveIntensity = 0;
          haloMat.opacity = 0;
          return false;
        });
      } else if (st.id === "TX") {
        const starGroup = new T.Group();
        starGroup.position.set(st.x, 0.45, st.z);

        const pedestal = new T.Mesh(
          new T.CylinderGeometry(1.6, 1.9, 0.6, 16),
          new T.MeshStandardMaterial({ color: 0x8c6239, roughness: 0.8 })
        );
        pedestal.position.y = 0.3;
        pedestal.castShadow = true;
        starGroup.add(pedestal);

        const starMat = new T.MeshStandardMaterial({
          color: 0xffcf40,
          roughness: 0.3,
          metalness: 0.4,
          emissive: new T.Color(0x000000)
        });
        const starMesh = new T.Mesh(new T.ConeGeometry(1.8, 2.4, 5), starMat);
        starMesh.position.y = 1.7;
        starMesh.castShadow = true;
        starGroup.add(starMesh);

        let spinSpeed = 0;
        const trigger = () => {
          spinSpeed = 8.5;
          playSound("star");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(starGroup, { ...st, onInteract: trigger });
        parent.add(starGroup);

        landmarkAnimators.push((dt) => {
          if (spinSpeed > 0.01) {
            starMesh.rotation.y += spinSpeed * dt;
            starMat.emissive.setHex(0xffb703);
            starMat.emissiveIntensity = Math.min(0.6, spinSpeed * 0.08);
            spinSpeed = Math.max(0, spinSpeed - dt * 3.5);
            return true;
          }
          starMat.emissiveIntensity = 0;
          return false;
        });
      } else if (st.id === "TN") {
        const guitar = new T.Group();
        guitar.position.set(st.x, 0.45, st.z);

        const woodMat = new T.MeshStandardMaterial({ color: 0xb5632d, roughness: 0.6 });
        const body = new T.Mesh(new T.CylinderGeometry(1.1, 1.4, 0.35, 18), woodMat);
        body.position.y = 0.8;
        body.rotation.z = 0.35;
        body.castShadow = true;

        const soundHole = new T.Mesh(new T.CircleGeometry(0.35, 16), new T.MeshBasicMaterial({ color: 0x1a0f08 }));
        soundHole.position.set(0, 0.8, 0.18);
        soundHole.rotation.z = 0.35;

        const neck = new T.Mesh(new T.BoxGeometry(0.25, 2.6, 0.2), new T.MeshStandardMaterial({ color: 0x3d2314 }));
        neck.position.set(-0.55, 1.9, 0);
        neck.rotation.z = 0.35;
        neck.castShadow = true;

        guitar.add(body, soundHole, neck);

        // Guitar strings
        const stringMat = new T.MeshBasicMaterial({ color: 0xffffff });
        for (let s = -2; s <= 2; s++) {
          const str = new T.Mesh(new T.BoxGeometry(0.018, 2.2, 0.01), stringMat);
          str.position.set(-0.45 + s * 0.04, 1.8, 0.12);
          str.rotation.z = 0.35;
          guitar.add(str);
        }

        let wobbleT = 0;
        const trigger = () => {
          wobbleT = 1.0;
          playSound("guitar");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(guitar, { ...st, onInteract: trigger });
        parent.add(guitar);

        landmarkAnimators.push((dt) => {
          if (wobbleT > 0.001) {
            guitar.rotation.y = Math.sin(wobbleT * 18) * 0.22 * wobbleT;
            wobbleT = Math.max(0, wobbleT - dt * 2.2);
            return true;
          }
          guitar.rotation.y = 0;
          return false;
        });
      } else if (st.id === "LA") {
        const boat = new T.Group();
        boat.position.set(st.x, 0.45, st.z);

        const hull = new T.Mesh(new T.BoxGeometry(3.2, 0.65, 1.4), new T.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.6 }));
        hull.position.y = 0.4;
        hull.castShadow = true;

        const cabin = new T.Mesh(new T.BoxGeometry(2.0, 0.85, 0.95), new T.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.6 }));
        cabin.position.y = 0.95;
        cabin.castShadow = true;

        const stackMat = new T.MeshStandardMaterial({ color: 0x2b2d42 });
        const stack1 = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.9, 8), stackMat);
        stack1.position.set(-0.5, 1.6, 0);
        const stack2 = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.9, 8), stackMat);
        stack2.position.set(0.5, 1.6, 0);

        const wheelGroup = new T.Group();
        wheelGroup.position.set(0, 0.45, -0.85);
        const wheelMat = new T.MeshStandardMaterial({ color: 0xb53229, roughness: 0.7 });
        for (let p = 0; p < 6; p++) {
          const spoke = new T.Mesh(new T.BoxGeometry(0.85, 0.06, 0.18), wheelMat);
          spoke.rotation.z = (p * Math.PI) / 3;
          wheelGroup.add(spoke);
        }

        boat.add(hull, cabin, stack1, stack2, wheelGroup);

        const steamMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const steam1 = new T.Mesh(new T.SphereGeometry(0.24, 8, 6), steamMat);
        steam1.position.set(-0.5, 2.2, 0);
        const steam2 = new T.Mesh(new T.SphereGeometry(0.28, 8, 6), steamMat);
        steam2.position.set(0.5, 2.3, 0);
        boat.add(steam1, steam2);

        let paddleBoost = 0;
        const trigger = () => {
          paddleBoost = 1.0;
          playSound("riverboat");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(boat, { ...st, onInteract: trigger });
        parent.add(boat);

        landmarkAnimators.push((dt) => {
          wheelGroup.rotation.z += dt * (1.5 + paddleBoost * 7.0);
          if (paddleBoost > 0.001) {
            steamMat.opacity = Math.sin(paddleBoost * Math.PI) * 0.75;
            steam1.position.y = 2.1 + (1 - paddleBoost) * 0.6;
            steam2.position.y = 2.2 + (1 - paddleBoost) * 0.7;
            paddleBoost = Math.max(0, paddleBoost - dt * 1.4);
            return true;
          }
          steamMat.opacity = 0;
          return false;
        });
      } else if (st.id === "OK") {
        const turbine = new T.Group();
        turbine.position.set(st.x, 0.45, st.z);

        const pole = new T.Mesh(new T.CylinderGeometry(0.14, 0.28, 4.2, 12), new T.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 }));
        pole.position.y = 2.1;
        pole.castShadow = true;

        const hub = new T.Mesh(new T.SphereGeometry(0.25, 10, 8), new T.MeshStandardMaterial({ color: 0xcccccc }));
        hub.position.set(0, 4.2, 0.2);

        const bladesGroup = new T.Group();
        bladesGroup.position.set(0, 4.2, 0.32);
        const bladeMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        for (let b = 0; b < 3; b++) {
          const ang = (b * Math.PI * 2) / 3;
          const blade = new T.Mesh(new T.BoxGeometry(0.16, 2.2, 0.04), bladeMat);
          blade.position.set(Math.sin(ang) * 1.1, Math.cos(ang) * 1.1, 0);
          blade.rotation.z = -ang;
          bladesGroup.add(blade);
        }

        turbine.add(pole, hub, bladesGroup);

        let spinBoost = 0;
        const trigger = () => {
          spinBoost = 9.0;
          playSound("wind");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(turbine, { ...st, onInteract: trigger });
        parent.add(turbine);

        landmarkAnimators.push((dt) => {
          const baseSpd = calm() ? 0 : 0.8;
          bladesGroup.rotation.z += (baseSpd + spinBoost) * dt;
          if (spinBoost > 0.01) {
            spinBoost = Math.max(0, spinBoost - dt * 2.5);
            return true;
          }
          return false;
        });
      } else if (st.id === "MS") {
        const lightGroup = new T.Group();
        lightGroup.position.set(st.x, 0.45, st.z);

        const tower = new T.Mesh(new T.CylinderGeometry(0.55, 0.95, 3.4, 14), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
        tower.position.y = 1.7;
        tower.castShadow = true;

        const topMat = new T.MeshStandardMaterial({ color: 0x2b4c7e });
        const lanternRoom = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 0.45, 14), topMat);
        lanternRoom.position.y = 3.4;

        const beaconLamp = new T.Mesh(
          new T.SphereGeometry(0.28, 10, 8),
          new T.MeshBasicMaterial({ color: 0xffe66d })
        );
        beaconLamp.position.set(0, 3.4, 0);

        const beamGroup = new T.Group();
        beamGroup.position.set(0, 3.4, 0);
        const beamMat = new T.MeshBasicMaterial({
          color: 0xfff3b0,
          transparent: true,
          opacity: 0.35,
          side: T.DoubleSide,
          depthWrite: false,
          blending: T.AdditiveBlending
        });
        const lightBeam = new T.Mesh(new T.ConeGeometry(2.4, 8.5, 16, 1, true), beamMat);
        lightBeam.position.set(0, 0, 4.2);
        lightBeam.rotation.x = -Math.PI / 2;
        beamGroup.add(lightBeam);

        lightGroup.add(tower, lanternRoom, beaconLamp, beamGroup);

        let sweepBoost = 0;
        const trigger = () => {
          sweepBoost = 4.5;
          playSound("beacon");
          openDiscoveryModal({
            ...st,
            onInteract: trigger
          });
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(lightGroup, { ...st, onInteract: trigger });
        parent.add(lightGroup);

        landmarkAnimators.push((dt) => {
          const baseSpd = calm() ? 0 : 0.6;
          beamGroup.rotation.y += (baseSpd + sweepBoost) * dt;
          if (sweepBoost > 0.01) {
            sweepBoost = Math.max(0, sweepBoost - dt * 1.5);
            beamMat.opacity = 0.35 + (sweepBoost / 4.5) * 0.35;
            return true;
          }
          beamMat.opacity = 0.35;
          return false;
        });
      }
    }

    function createStatePin(st, parent, T) {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(255, 255, 255, 0.96)";
      g.roundRect(4, 4, 248, 120, 20);
      g.fill();
      g.strokeStyle = "#2f7fcf"; g.lineWidth = 6;
      g.stroke();
      g.fillStyle = "#1b2a4a"; g.font = "bold 32px sans-serif"; g.textAlign = "center";
      g.fillText(st.name, 128, 52);
      g.fillStyle = "#3d6482"; g.font = "bold 24px sans-serif";
      g.fillText(st.capital, 128, 92);

      const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      const pinMat = new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide });
      const pin = new T.Mesh(new T.PlaneGeometry(3.0, 1.5), pinMat);
      // Tilt pin upward so it faces the elevated camera view directly
      pin.rotation.x = -Math.PI * 0.25;
      pin.position.set(st.x, 2.2, st.z + st.rad * 0.45);

      registerInteractive(pin, {
        ...st,
        onInteract: () => {
          openDiscoveryModal({
            ...st,
            onInteract: () => {
              if (st.onInteract) st.onInteract();
            }
          });
        }
      });

      parent.add(pin);
    }

    // Target Click Marker
    const markerGeo = new T.RingGeometry(0.35, 0.75, 24);
    markerGeo.rotateX(-Math.PI / 2);
    const markerMat = new T.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0 });
    const marker = new T.Mesh(markerGeo, markerMat);
    marker.position.y = 0.52;
    scene.add(marker);

    // ==========================================
    // 3D Ahaan Character Setup
    // ==========================================
    const A = window.AhaanModel.build(T);
    const ahaanScale = 0.62; // Bold, prominent hero scale
    A.rig.scale.setScalar(ahaanScale);

    // Baseline height so Ahaan stands upright on the state tile
    const groundLevelY = 0.45;
    const rigBaseY = groundLevelY - (A.footY * ahaanScale); // Solidly on the state tile
    A.rig.position.set(0, rigBaseY, 0);

    let ahaanAngle = 0; // 0 = facing South toward camera
    A.rig.rotation.y = ahaanAngle;
    scene.add(A.rig);

    // ==========================================
    // International Greetings & Interactive Waving
    // ==========================================
    const INTERNATIONAL_GREETINGS = [
      {
        flag: "🇮🇳",
        lang: "Hindi",
        country: "India",
        greeting: "Namaste! (नमस्ते)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "harp"
      },
      {
        flag: "🇪🇸",
        lang: "Spanish",
        country: "Spain & Latin America",
        greeting: "¡Hola! Bienvenidos",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "guitar"
      },
      {
        flag: "🇯🇵",
        lang: "Japanese",
        country: "Japan",
        greeting: "Konnichiwa! (こんにちは)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "bell"
      },
      {
        flag: "🇫🇷",
        lang: "French",
        country: "France",
        greeting: "Bonjour! Bienvenue",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "chime"
      },
      {
        flag: "🇮🇹",
        lang: "Italian",
        country: "Italy",
        greeting: "Ciao! Benvenuti",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "guitar"
      },
      {
        flag: "🇩🇪",
        lang: "German",
        country: "Germany",
        greeting: "Hallo! Willkommen",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "bell"
      },
      {
        flag: "🇨🇳",
        lang: "Mandarin",
        country: "China",
        greeting: "Nǐ hǎo! (你好)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "harp"
      },
      {
        flag: "🇰🇷",
        lang: "Korean",
        country: "South Korea",
        greeting: "Annyeong! (안녕)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "chime"
      },
      {
        flag: "🇧🇷",
        lang: "Portuguese",
        country: "Brazil & Portugal",
        greeting: "Olá! Bem-vindo",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "guitar"
      },
      {
        flag: "🇰🇪",
        lang: "Swahili",
        country: "Kenya & East Africa",
        greeting: "Jambo! Karibu",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "bell"
      },
      {
        flag: "🇪🇬",
        lang: "Arabic",
        country: "Egypt & Arab World",
        greeting: "Marhaban! (مرحباً)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "harp"
      },
      {
        flag: "🇬🇷",
        lang: "Greek",
        country: "Greece",
        greeting: "Geia sou! (Γεια σου)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "chime"
      },
      {
        flag: "🇳🇵",
        lang: "Nepali",
        country: "Nepal",
        greeting: "Namaskar! (नमस्कार)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "bell"
      },
      {
        flag: "🇳🇱",
        lang: "Dutch",
        country: "Netherlands",
        greeting: "Hallo! Welkom",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "guitar"
      },
      {
        flag: "🇻🇳",
        lang: "Vietnamese",
        country: "Vietnam",
        greeting: "Xin chào! (👋)",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "chime"
      },
      {
        flag: "🌺",
        lang: "Hawaiian",
        country: "Hawaii",
        greeting: "Aloha! E komo mai",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "guitar"
      },
      {
        flag: "🇺🇸",
        lang: "English",
        country: "United States",
        greeting: "Hello there!",
        sub: "Welcome to my world! I'm Ahaan.",
        sound: "bell"
      }
    ];

    let lastGreetingIndex = -1;
    function pickRandomGreeting() {
      let idx;
      do {
        idx = Math.floor(Math.random() * INTERNATIONAL_GREETINGS.length);
      } while (idx === lastGreetingIndex && INTERNATIONAL_GREETINGS.length > 1);
      lastGreetingIndex = idx;
      return INTERNATIONAL_GREETINGS[idx];
    }

    let waveTimer = 0;
    let bubbleHideTimer = null;

    function updateBubblePosition() {
      const bubble = document.getElementById("ahaanBubble");
      if (!bubble) return;

      if (currentActivity || cameraMode === "landmark") {
        bubble.style.opacity = "0";
        bubble.style.pointerEvents = "none";
        return;
      } else {
        bubble.style.opacity = "";
        bubble.style.pointerEvents = "";
      }

      const headPos = new T.Vector3();
      A.head.getWorldPosition(headPos);
      headPos.y += 1.25; // Position with breathing space above hair fringe

      headPos.project(camera);

      const rect = canvas.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      const canvasX = (headPos.x + 1) * 0.5 * rect.width;
      const canvasY = (1 - headPos.y) * 0.5 * rect.height;

      const rawX = (rect.left - heroRect.left) + canvasX;
      const rawY = (rect.top - heroRect.top) + canvasY;

      // Keep bubble inside viewport boundaries
      const minX = 145;
      const maxX = Math.max(minX, hero.clientWidth - 145);
      const clampedX = Math.max(minX, Math.min(maxX, rawX));
      const tailOffset = Math.max(-70, Math.min(70, rawX - clampedX));

      bubble.style.left = `${clampedX}px`;
      bubble.style.top = `${rawY}px`;

      const tail = bubble.querySelector(".ab-tail");
      if (tail) {
        tail.style.transform = `translateX(calc(-50% + ${tailOffset}px))`;
      }
    }

    function sayAhaan(greeting, sub, flag, lang) {
      const bubble = document.getElementById("ahaanBubble");
      const flagEl = document.getElementById("abFlag");
      const miniFlagEl = document.getElementById("abMiniFlag");
      const greetEl = document.getElementById("abGreeting");
      const subEl = document.getElementById("abSub");
      const langEl = document.getElementById("abLang");

      if (flagEl) flagEl.textContent = flag || "🎈";
      if (miniFlagEl) miniFlagEl.textContent = flag || "🎈";
      if (greetEl) greetEl.textContent = greeting;
      if (subEl) subEl.textContent = sub || "";
      if (langEl) langEl.textContent = lang || "Playground";

      if (bubble) {
        bubble.classList.remove("is-compact", "is-walking");
        bubble.classList.add("is-visible");
      }
      updateBubblePosition();
      wake();
    }

    function greetRandom(isInitial) {
      const item = pickRandomGreeting();
      sayAhaan(item.greeting, item.sub, item.flag, `${item.lang} · ${item.country}`);

      // Start arm wave animation on character model
      if (A.startWave) {
        A.startWave();
        waveTimer = 3.8;
      }

      // Play soft sound if user enabled audio
      if (!isInitial && soundOn) {
        playSound(item.sound || "chime");
      }

      // Compact the bubble after idle period
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = setTimeout(() => {
        const bubble = document.getElementById("ahaanBubble");
        if (bubble && !isWalking && !currentActivity) {
          bubble.classList.add("is-compact");
        }
      }, 8500);
    }

    // Register Ahaan's 3D model for tap interactions
    registerInteractive(A.rig, {
      name: "Ahaan",
      onInteract() {
        if (currentActivity) {
          if (currentActivity === "slide") {
            sayAhaan("Wheeeee! 🛝", "I love sliding down!", "🛝", "Playground Slide");
          } else if (currentActivity === "swing") {
            sayAhaan("Flying high! 🎈", "Look at the big blue sky!", "🎈", "Cedar Swing Set");
          } else if (currentActivity === "trampoline") {
            sayAhaan("Boing boing! 🤸", "Jumping to the stars!", "🤸", "Spring Trampoline");
          }
        } else {
          greetRandom(false);
        }
      }
    });

    // Wire up speech bubble clicks to cycle greetings
    const ahaanBubbleEl = document.getElementById("ahaanBubble");
    if (ahaanBubbleEl) {
      ahaanBubbleEl.addEventListener("click", () => {
        greetRandom(false);
      });
    }
    const abCycleBtnEl = document.getElementById("abCycleBtn");
    if (abCycleBtnEl) {
      abCycleBtnEl.addEventListener("click", e => {
        e.stopPropagation();
        greetRandom(false);
      });
    }

    // Walking State
    let targetPos = null;
    let isWalking = false;
    const walkSpeed = 6.8;
    const keys = { up: false, down: false, left: false, right: false };
    let currentStateId = "AR";

    // ==========================================
    // Playground Activities State & Controls
    // ==========================================
    let currentActivity = null; // null | "slide" | "swing" | "trampoline"
    let activityPhase = 0;      // 0 = approach, 1 = climb/mount, 2 = play, 3 = exit
    let activityTimer = 0;
    let lastApexChime = 0;

    // Trampoline physics state
    let trampY = 0.54;
    let trampVy = 0.0;
    let trampBounceApex = 1.6;
    let trampDeflection = 0.0;
    let trampIsFlipping = false;
    let trampFlip = 0.0;

    // Swing pendulum physics state
    let swingAngle = 0.0;
    let swingVelocity = 0.0;
    let lastBreezeSoundTime = 0;

    // Camera action close-up state
    let cameraMode = "normal"; // "normal" | "action" | "landmark"
    const actionCamTarget = new T.Vector3();
    const actionCamPos = new T.Vector3();
    const normalCamTarget = new T.Vector3();
    const normalCamPos = new T.Vector3();
    const currentCamTarget = new T.Vector3(0, 0.5, 0);
    const currentCamPos = new T.Vector3(0, 28, 22);

    // Nearby interaction prompt state
    let currentNearbyItem = null;
    const actionPrompt = document.getElementById("actionPrompt");
    const actionPromptBtn = document.getElementById("actionPromptBtn");
    const actionPromptText = document.getElementById("actionPromptText");

    // Activity control buttons state
    const activityHud = document.getElementById("activityHud");
    const actBoostBtn = document.getElementById("actBoostBtn");
    const actBoostLabel = document.getElementById("actBoostLabel");
    const actDismountBtn = document.getElementById("actDismountBtn");

    if (actionPromptBtn) {
      actionPromptBtn.addEventListener("click", () => {
        if (currentNearbyItem && currentNearbyItem.onActivate) {
          currentNearbyItem.onActivate();
        }
      });
    }

    if (actBoostBtn) {
      actBoostBtn.addEventListener("click", () => {
        boostCurrentActivity();
      });
    }

    if (actDismountBtn) {
      actDismountBtn.addEventListener("click", () => {
        stopPlayActivity();
      });
    }

    // List of interactive locations and prompts
    const INTERACTABLES = [
      {
        id: "trampoline",
        name: "Spring Trampoline",
        x: -4.3,
        z: 0.2,
        approachRadius: 2.8,
        actionLabel: "Jump! 🤸",
        promptText: "Press Enter to Jump! 🤸",
        onActivate: () => startPlayActivity("trampoline")
      },
      {
        id: "swing",
        name: "Cedar Swings",
        x: 2.15,
        z: -1.5,
        approachRadius: 3.5,
        actionLabel: "Swing! 🪁",
        promptText: "Press Enter to Swing! 🪁",
        onActivate: () => startPlayActivity("swing")
      },
      {
        id: "slide",
        name: "Playground Slide",
        x: -2.6,
        z: -3.2,
        approachRadius: 2.8,
        actionLabel: "Slide! 🛝",
        promptText: "Press Enter to Slide! 🛝",
        onActivate: () => startPlayActivity("slide")
      },
      {
        id: "MO",
        name: "Missouri",
        city: "St. Louis",
        x: 0,
        z: -13.5,
        approachRadius: 5.5,
        actionLabel: "Explore St. Louis! 🏛️",
        promptText: "Press Enter to Explore St. Louis! 🏛️",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "MO"))
      },
      {
        id: "TN",
        name: "Tennessee",
        city: "Nashville",
        x: 13.5,
        z: -5.8,
        approachRadius: 5.5,
        actionLabel: "Explore Nashville! 🎶",
        promptText: "Press Enter to Explore Nashville! 🎶",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "TN"))
      },
      {
        id: "MS",
        name: "Mississippi",
        city: "Jackson",
        x: 12.8,
        z: 7.2,
        approachRadius: 5.5,
        actionLabel: "Explore Jackson! 🌊",
        promptText: "Press Enter to Explore Jackson! 🌊",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "MS"))
      },
      {
        id: "LA",
        name: "Louisiana",
        city: "Baton Rouge",
        x: 0,
        z: 13.5,
        approachRadius: 5.5,
        actionLabel: "Explore Baton Rouge! 🌿",
        promptText: "Press Enter to Explore Baton Rouge! 🌿",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "LA"))
      },
      {
        id: "TX",
        name: "Texas",
        city: "Austin",
        x: -13.8,
        z: 7.2,
        approachRadius: 5.5,
        actionLabel: "Explore Austin! 🤠",
        promptText: "Press Enter to Explore Austin! 🤠",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "TX"))
      },
      {
        id: "OK",
        name: "Oklahoma",
        city: "Oklahoma City",
        x: -13.8,
        z: -7.2,
        approachRadius: 5.5,
        actionLabel: "Explore Oklahoma City! 🌻",
        promptText: "Press Enter to Explore Oklahoma City! 🌻",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "OK"))
      },
      {
        id: "AR",
        name: "Arkansas",
        city: "Little Rock",
        x: 2.0,
        z: 1.2,
        approachRadius: 3.5,
        actionLabel: "Explore Little Rock! ⭐",
        promptText: "Press Enter to Explore Little Rock! ⭐",
        onActivate: () => exploreLandmark(STATES.find(s => s.id === "AR"))
      }
    ];

    // Detect nearby playground items and landmarks
    function checkProximity() {
      if (currentActivity) {
        if (actionPrompt && !actionPrompt.hidden) {
          actionPrompt.classList.remove("show");
          actionPrompt.hidden = true;
        }
        currentNearbyItem = null;
        return;
      }

      let closest = null;
      let minD = 999;
      const px = A.rig.position.x;
      const pz = A.rig.position.z;

      for (let i = 0; i < INTERACTABLES.length; i++) {
        const item = INTERACTABLES[i];
        const d = Math.hypot(px - item.x, pz - item.z);
        if (d <= item.approachRadius && d < minD) {
          minD = d;
          closest = item;
        }
      }

      if (closest !== currentNearbyItem) {
        currentNearbyItem = closest;
        if (currentNearbyItem && actionPrompt && actionPromptText) {
          actionPromptText.textContent = currentNearbyItem.promptText;
          actionPrompt.hidden = false;
          requestAnimationFrame(() => actionPrompt.classList.add("show"));
        } else if (actionPrompt) {
          actionPrompt.classList.remove("show");
          setTimeout(() => {
            if (!currentNearbyItem) actionPrompt.hidden = true;
          }, 220);
        }
      }
    }

    // Zoom into landmark and open discovery card
    function exploreLandmark(st) {
      if (!st) return;
      if (currentActivity) stopPlayActivity();

      cameraMode = "landmark";
      actionCamTarget.set(st.x, 2.2, st.z);
      actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);

      A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
      if (A.startWave) A.startWave();

      playSound("bell");
      sayAhaan("Welcome to " + (st.city || st.name) + "! 🌍", st.fact, st.icon || "📍", st.name);
      openDiscoveryModal(st);
      wake();
    }

    // Start a playground activity
    function startPlayActivity(type) {
      if (currentActivity) stopPlayActivity();
      currentActivity = type;
      activityPhase = 0;
      activityTimer = 0;
      lastApexChime = 0;

      if (type === "slide") {
        targetPos = new T.Vector3(-2.6, rigBaseY, -3.8);
        marker.position.set(-2.6, 0.52, -3.8);
        markerMat.opacity = 0.95;
        cameraMode = "action";
        actionCamTarget.set(-2.6, 1.6, -2.4);
        actionCamPos.set(-2.6 + 6.2, 5.5, -2.4 + 7.5);
        sayAhaan("Let us slide! 🛝", "Climb up to the top!", "🛝", "Playground Slide");
      } else if (type === "swing") {
        targetPos = new T.Vector3(2.05, rigBaseY, -1.6);
        marker.position.set(2.05, 0.52, -1.6);
        markerMat.opacity = 0.95;
        swingAngle = 0.35;
        swingVelocity = 1.4;
        cameraMode = "action";
        actionCamTarget.set(2.05, 4.3, -2.8);
        actionCamPos.set(2.05 - 10.2, 5.8, -2.8 + 10.2);
        sayAhaan("Let us swing! 🪁", "Pump legs to touch the sky!", "🪁", "Cedar Swings");
      } else if (type === "trampoline") {
        targetPos = new T.Vector3(-2.95, rigBaseY, 0.2);
        marker.position.set(-2.95, 0.52, 0.2);
        markerMat.opacity = 0.95;
        trampY = 0.54;
        trampVy = 5.6;
        trampBounceApex = 1.6;
        trampDeflection = 0;
        trampIsFlipping = false;
        trampFlip = 0;
        cameraMode = "action";
        actionCamTarget.set(-4.3, 1.8, 0.2);
        actionCamPos.set(-4.3 + 6.2, 6.2, 0.2 + 8.5);
        sayAhaan("Trampoline time! 🤸", "Boing! Let us bounce high!", "🤸", "Spring Trampoline");
      }

      if (type === "trampoline" || type === "swing") {
        if (activityHud) {
          if (actBoostLabel) {
            actBoostLabel.textContent = type === "trampoline" ? "Bounce Higher! ⬆️" : "Swing Higher! 🪁";
          }
          activityHud.hidden = false;
          requestAnimationFrame(() => activityHud.classList.add("show"));
        }
      }
      if (actionPrompt) {
        actionPrompt.classList.remove("show");
        actionPrompt.hidden = true;
      }
      wake();
    }

    // Stop current playground activity and return to grass
    function stopPlayActivity() {
      if (!currentActivity) return;
      const prev = currentActivity;
      currentActivity = null;
      activityPhase = 0;
      activityTimer = 0;

      cameraMode = "normal";

      if (activityHud) {
        activityHud.classList.remove("show");
        setTimeout(() => {
          if (!currentActivity) activityHud.hidden = true;
        }, 220);
      }

      if (A.resetLimbs) A.resetLimbs();
      if (A.rig.parent !== scene) scene.add(A.rig);
      A.rig.scale.setScalar(ahaanScale);
      A.rig.rotation.set(0, 0, 0);
      A.rig.position.y = rigBaseY;

      if (prev === "trampoline") {
        A.rig.position.set(-2.95, rigBaseY, 0.2);
        if (trampMat) trampMat.position.y = 0.54;
      } else if (prev === "swing") {
        A.rig.position.set(2.05, rigBaseY, -1.6);
        if (swingPivot) swingPivot.rotation.x = 0;
      } else if (prev === "slide") {
        A.rig.position.set(-2.6, rigBaseY, -1.1);
      }

      sayAhaan("That was great fun! ✨", "Walk around the park to explore more.", "🎈", "Park");
      wake();
    }

    // Boost bounce height or swing momentum
    function boostCurrentActivity() {
      if (!currentActivity) return;
      if (currentActivity === "trampoline") {
        trampBounceApex = Math.min(3.8, trampBounceApex + 0.85);
        if (trampVy < 0) {
          trampVy += 3.5;
        } else {
          trampVy = Math.max(trampVy, Math.sqrt(2 * 16.0 * trampBounceApex));
        }
        playSound("bounce");
        spawnTrampParticles();
        sayAhaan("Boing! Higher! 🤸", "Look at the clouds!", "🤸", "Spring Trampoline");
        wake();
      } else if (currentActivity === "swing") {
        const dir = Math.sign(swingVelocity) || 1;
        swingVelocity += dir * 1.6;
        if (Math.abs(swingVelocity) > 4.6) swingVelocity = Math.sign(swingVelocity) * 4.6;
        playSound("breeze");
        sayAhaan("Wheeee! Swing higher! 🪁", "Fly high into the sky!", "🪁", "Cedar Swings");
        wake();
      }
    }

    // Update ongoing playground activity simulation
    function updatePlayActivity(dt) {
      if (!currentActivity) return;

      if (currentActivity === "slide") {
        // Phase 0: Approach ladder
        if (activityPhase === 0) {
          const dist = Math.hypot(A.rig.position.x - (-2.6), A.rig.position.z - (-3.8));
          if (dist < 0.65 || !targetPos) {
            activityPhase = 1;
            activityTimer = 0;
            targetPos = null;
            isWalking = false;
            markerMat.opacity = 0;
            A.rig.position.set(-2.6, rigBaseY, -3.8);
            A.rig.rotation.y = 0;
          }
        }
        // Phase 1: Climb ladder
        else if (activityPhase === 1) {
          activityTimer += dt;
          const climbDuration = calm() ? 1.6 : 1.1;
          const t = Math.min(1, activityTimer / climbDuration);
          A.rig.position.set(-2.6, rigBaseY + t * 1.55, -3.8 + t * 0.6);
          A.rig.rotation.y = 0;

          const cycle = t * Math.PI * 4;
          A.leftLeg.hip.rotation.x = Math.sin(cycle) * 0.45;
          A.rightLeg.hip.rotation.x = -Math.sin(cycle) * 0.45;
          A.leftLeg.knee.rotation.x = Math.max(0, Math.sin(cycle) * 0.6);
          A.rightLeg.knee.rotation.x = Math.max(0, -Math.sin(cycle) * 0.6);
          A.leftArm.arm.rotation.x = -1.2 + Math.cos(cycle) * 0.4;
          A.wavingArm.arm.rotation.x = -1.2 - Math.cos(cycle) * 0.4;

          if (t >= 1) {
            activityPhase = 2;
            activityTimer = 0;
            A.rig.position.set(-2.6, rigBaseY + 1.55, -3.2);
            A.leftLeg.hip.rotation.x = -1.4;
            A.rightLeg.hip.rotation.x = -1.4;
            A.leftLeg.knee.rotation.x = 0.2;
            A.rightLeg.knee.rotation.x = 0.2;
            A.leftArm.arm.rotation.x = -0.6;
            A.wavingArm.arm.rotation.x = -0.6;
          }
        }
        // Phase 2: Pause at top
        else if (activityPhase === 2) {
          activityTimer += dt;
          if (activityTimer >= 0.5) {
            activityPhase = 3;
            activityTimer = 0;
            playSound("wind");
            sayAhaan("Wheeeee! 🛝", "Fly down the chute!", "🛝", "Playground Slide");
          }
        }
        // Phase 3: Slide down chute
        else if (activityPhase === 3) {
          activityTimer += dt;
          const slideDuration = calm() ? 1.8 : 1.1;
          const st = Math.min(1, activityTimer / slideDuration);

          const startZ = -2.85, endZ = -1.25;
          const curZ = startZ + st * (endZ - startZ);
          const hFactor = Math.pow(1 - st, 1.8);
          A.rig.position.set(-2.6, rigBaseY + hFactor * 1.55, curZ);
          A.rig.rotation.y = 0;

          A.leftArm.arm.rotation.z = 2.4;
          A.wavingArm.arm.rotation.z = -2.4;
          const armWave = calm() ? 0 : Math.sin(activityTimer * 14) * 0.2;
          A.leftArm.arm.rotation.x = -1.8 + armWave;
          A.wavingArm.arm.rotation.x = -1.8 + armWave;
          A.leftLeg.hip.rotation.x = -1.3;
          A.rightLeg.hip.rotation.x = -1.3;

          if (st >= 1) {
            activityPhase = 4;
            activityTimer = 0;
            if (A.resetLimbs) A.resetLimbs();
            A.rig.position.set(-2.6, rigBaseY, -1.1);
            A.rig.rotation.y = 0;
          }
        }
        // Phase 4: Landing hop
        else if (activityPhase === 4) {
          activityTimer += dt;
          const hopTime = 0.65;
          const hopProgress = Math.min(1, activityTimer / hopTime);
          const hopHeight = Math.sin(hopProgress * Math.PI) * 0.35;
          A.rig.position.set(-2.6, rigBaseY + hopHeight, -1.1);
          if (activityTimer >= hopTime) {
            stopPlayActivity();
          }
        }
      } else if (currentActivity === "swing") {
        // Phase 0: Approach swing
        if (activityPhase === 0) {
          const dist = Math.hypot(A.rig.position.x - 2.05, A.rig.position.z - (-1.6));
          if (dist < 0.75 || !targetPos) {
            activityPhase = 1;
            activityTimer = 0;
            targetPos = null;
            isWalking = false;
            markerMat.opacity = 0;

            // Mount Ahaan directly onto swingPivot seat
            swingPivot.add(A.rig);
            A.rig.position.set(0, -2.28, 0.04);
            A.rig.rotation.set(0, 0, 0);
            A.rig.scale.setScalar(ahaanScale);

            // Set sitting posture
            A.leftLeg.hip.rotation.set(-1.45, 0, -0.04);
            A.rightLeg.hip.rotation.set(-1.45, 0, 0.04);
            A.leftLeg.knee.rotation.set(0.90, 0, 0);
            A.rightLeg.knee.rotation.set(0.90, 0, 0);
            A.leftArm.arm.rotation.set(-1.15, 0, 0.30);
            A.wavingArm.arm.rotation.set(-1.15, 0, -0.30);
            A.leftArm.elbow.rotation.set(0.60, 0, 0);
            A.wavingArm.elbow.rotation.set(0.60, 0, 0);
            A.head.rotation.set(-0.15, 0, 0);
          }
        }
        // Phase 1: Real pendulum swinging physics with seated Ahaan
        else if (activityPhase === 1) {
          activityTimer += dt;
          const swingL = 4.8;
          const swingG = 9.8;
          const swingDamping = 0.18;

          const angularAcc = -(swingG / swingL) * Math.sin(swingAngle) - swingDamping * swingVelocity;
          swingVelocity += angularAcc * dt;
          swingAngle += swingVelocity * dt;

          if (swingPivot) swingPivot.rotation.x = swingAngle;

          // Leg-pumping animation based on motion direction
          if (swingVelocity > 0.25) {
            A.leftLeg.hip.rotation.x = -1.55;
            A.rightLeg.hip.rotation.x = -1.55;
            A.leftLeg.knee.rotation.x = 0.20;
            A.rightLeg.knee.rotation.x = 0.20;
          } else if (swingVelocity < -0.25) {
            A.leftLeg.hip.rotation.x = -1.25;
            A.rightLeg.hip.rotation.x = -1.25;
            A.leftLeg.knee.rotation.x = 1.35;
            A.rightLeg.knee.rotation.x = 1.35;
          } else {
            A.leftLeg.hip.rotation.x = -1.40;
            A.rightLeg.hip.rotation.x = -1.40;
            A.leftLeg.knee.rotation.x = 0.90;
            A.rightLeg.knee.rotation.x = 0.90;
          }

          // Hands securely gripping swing chains at chest height
          A.leftArm.arm.rotation.set(-1.15, 0, 0.30);
          A.wavingArm.arm.rotation.set(-1.15, 0, -0.30);
          A.leftArm.elbow.rotation.set(0.60, 0, 0);
          A.wavingArm.elbow.rotation.set(0.60, 0, 0);

          // Head looks forward into the wind
          A.head.rotation.set(-0.15, 0, 0);

          // Breeze sound at high velocity
          if (Math.abs(swingAngle) < 0.20 && Math.abs(swingVelocity) > 2.0) {
            const nowTime = performance.now();
            if (nowTime - lastBreezeSoundTime > 650) {
              lastBreezeSoundTime = nowTime;
              playSound("breeze");
            }
          }

          // Apex chime on high arc
          if (Math.abs(swingAngle) > 0.65 && (activityTimer - lastApexChime > 0.85)) {
            lastApexChime = activityTimer;
            playSound("bell");
          }
        }
      } else if (currentActivity === "trampoline") {
        // Phase 0: Approach access ladder
        if (activityPhase === 0) {
          const dist = Math.hypot(A.rig.position.x - (-2.95), A.rig.position.z - 0.2);
          if (dist < 0.65 || !targetPos) {
            activityPhase = 1;
            activityTimer = 0;
            targetPos = null;
            isWalking = false;
            markerMat.opacity = 0;
            A.rig.position.set(-2.95, rigBaseY, 0.2);
            A.rig.rotation.y = 0;
          }
        }
        // Phase 1: Hop onto trampoline mat
        else if (activityPhase === 1) {
          activityTimer += dt;
          const hopTime = 0.55;
          const t = Math.min(1, activityTimer / hopTime);
          const curX = -2.95 + t * (-4.3 - (-2.95));
          const arcY = Math.sin(t * Math.PI) * 0.45;
          A.rig.position.set(curX, rigBaseY + t * 0.54 + arcY, 0.2);
          A.rig.rotation.y = 0;

          if (t >= 1) {
            activityPhase = 2;
            activityTimer = 0;
            trampY = 0.54;
            trampVy = 5.2;
            A.rig.position.set(-4.3, rigBaseY + 0.54, 0.2);
            sayAhaan("Boing! Boing! 🤸", "I can touch the clouds!", "🤸", "Spring Trampoline");
          }
        }
        // Phase 2: Real spring bouncing physics
        else if (activityPhase === 2) {
          activityTimer += dt;
          const gravity = 16.0;

          if (trampBounceApex > 1.4) {
            trampBounceApex = Math.max(1.4, trampBounceApex - dt * 0.15);
          }

          if (trampY > 0.54) {
            // Airborne flight
            trampVy -= gravity * dt;
            trampY += trampVy * dt;

            const stretch = Math.min(0.2, Math.max(0, trampVy / 12) * 0.2);
            A.rig.scale.set(
              ahaanScale * (1 - stretch * 0.4),
              ahaanScale * (1 + stretch * 0.6),
              ahaanScale * (1 - stretch * 0.4)
            );

            A.leftArm.arm.rotation.z = 2.0;
            A.wavingArm.arm.rotation.z = -2.0;
            A.leftArm.arm.rotation.x = -0.3;
            A.wavingArm.arm.rotation.x = -0.3;
            A.leftLeg.knee.rotation.x = 0;
            A.rightLeg.knee.rotation.x = 0;

            if (trampIsFlipping) {
              trampFlip += dt * 8.0;
              if (trampFlip >= Math.PI * 2) {
                trampFlip = 0;
                trampIsFlipping = false;
              }
              A.rig.rotation.x = trampFlip;
            } else {
              A.rig.rotation.x = 0;
            }

            if (trampVy < 0 && (trampVy + gravity * dt) >= 0 && trampBounceApex >= 2.0) {
              playSound("bell");
            }
          } else {
            // Mat compression and rebound
            trampDeflection = 0.54 - trampY;
            const springK = 220.0, springDamping = 4.0;
            const springForce = springK * trampDeflection - springDamping * trampVy;
            trampVy += springForce * dt;
            trampY += trampVy * dt;

            trampDeflection = Math.min(0.24, Math.max(0, 0.54 - trampY));
            if (trampMat) trampMat.position.y = 0.54 - trampDeflection;

            const squash = Math.min(0.35, trampDeflection * 1.6);
            A.rig.scale.set(
              ahaanScale * (1 + squash * 0.7),
              ahaanScale * (1 - squash * 0.85),
              ahaanScale * (1 + squash * 0.7)
            );
            A.rig.rotation.x = 0;

            A.leftLeg.knee.rotation.x = squash * 4.5;
            A.rightLeg.knee.rotation.x = squash * 4.5;
            A.leftLeg.hip.rotation.x = -squash * 2.2;
            A.rightLeg.hip.rotation.x = -squash * 2.2;
            A.leftArm.arm.rotation.x = 0.35;
            A.wavingArm.arm.rotation.x = 0.35;
            A.leftArm.arm.rotation.z = 0.2;
            A.wavingArm.arm.rotation.z = -0.2;

            if (trampVy > 0 && trampY >= 0.52) {
              trampY = 0.54;
              if (trampMat) trampMat.position.y = 0.54;
              playSound("bounce");
              spawnTrampParticles();
              if (trampBounceApex >= 2.2) {
                trampIsFlipping = true;
                trampFlip = 0;
              }
            }
          }

          A.rig.position.set(-4.3, rigBaseY + (trampY - 0.54) + 0.54, 0.2);
          A.rig.rotation.y = 0;
        }
      }
    }

    // ==========================================
    // Top-View Camera & Interactive Controls
    // ==========================================
    let zoomLevel = 1.0; // 0.7 = close-up, 1.0 = normal, 1.4 = wide
    const baseCamY = 28;
    const baseCamZ = 22;
    let panOffset = new T.Vector2(0, 0);
    const cameraTarget = new T.Vector3(0, 0, 0);

    function updateCameraPosition(dt) {
      let desiredTarget, desiredPos;
      if (cameraMode === "action" || cameraMode === "landmark") {
        desiredTarget = actionCamTarget;
        desiredPos = actionCamPos;
      } else {
        const targetX = A.rig.position.x * 0.45 + panOffset.x;
        const targetZ = A.rig.position.z * 0.45 + panOffset.y;
        normalCamTarget.set(targetX, 0.5, targetZ);
        normalCamPos.set(targetX, baseCamY * zoomLevel, targetZ + baseCamZ * zoomLevel);
        desiredTarget = normalCamTarget;
        desiredPos = normalCamPos;
      }

      if (!calm()) {
        const factor = Math.min(1, (dt || 0.016) * 4.5);
        currentCamPos.lerp(desiredPos, factor);
        currentCamTarget.lerp(desiredTarget, factor);
        camera.position.copy(currentCamPos);
        camera.lookAt(currentCamTarget);
      } else {
        currentCamPos.copy(desiredPos);
        currentCamTarget.copy(desiredTarget);
        camera.position.copy(desiredPos);
        camera.lookAt(desiredTarget);
      }
    }
    updateCameraPosition();

    // ---- View Control UI Buttons ----
    function createViewControls() {
      let ctl = document.getElementById("mapControls");
      if (ctl) return;
      ctl = document.createElement("div");
      ctl.id = "mapControls";
      ctl.className = "map-controls";
      ctl.innerHTML = `
        <button type="button" class="mctl-btn" id="mctlZoomIn" title="Zoom In">➕</button>
        <button type="button" class="mctl-btn" id="mctlZoomOut" title="Zoom Out">➖</button>
        <button type="button" class="mctl-btn" id="mctlReset" title="Reset View">🧭 Top View</button>
      `;
      hero.appendChild(ctl);

      document.getElementById("mctlZoomIn").addEventListener("click", () => {
        zoomLevel = Math.max(0.65, zoomLevel - 0.15);
        updateCameraPosition();
        wake();
      });
      document.getElementById("mctlZoomOut").addEventListener("click", () => {
        zoomLevel = Math.min(1.45, zoomLevel + 0.15);
        updateCameraPosition();
        wake();
      });
      document.getElementById("mctlReset").addEventListener("click", () => {
        zoomLevel = 1.0;
        panOffset.set(0, 0);
        updateCameraPosition();
        wake();
      });
    }
    createViewControls();

    // Mouse Wheel Zoom
    hero.addEventListener("wheel", e => {
      if (calm()) return;
      e.preventDefault();
      zoomLevel = Math.max(0.65, Math.min(1.45, zoomLevel + (e.deltaY > 0 ? 0.08 : -0.08)));
      updateCameraPosition();
      wake();
    }, { passive: false });

    // Drag to Pan View & Tap to Walk (Mouse, Trackpad, Touch)
    let isPointerDown = false, isDragging = false;
    let dragStart = { x: 0, y: 0 }, downPos = { x: 0, y: 0 };

    hero.addEventListener("pointerdown", e => {
      if (calm()) return;
      if (e.target.closest && e.target.closest(".candy-blanket, .nav, .breeze-pill, .sound-btn, .map-controls, .discovery-modal, .discovery-backdrop, .state-toast, .ahaan-bubble, button, a")) return;

      isPointerDown = true;
      isDragging = false;
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
      downPos.x = e.clientX;
      downPos.y = e.clientY;
    });

    hero.addEventListener("pointermove", e => {
      if (isPointerDown || isDragging) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes);
      canvas.style.cursor = hits.length > 0 ? "pointer" : "default";
    });

    window.addEventListener("pointermove", e => {
      if (!isPointerDown) return;
      const totalDx = e.clientX - downPos.x;
      const totalDy = e.clientY - downPos.y;
      if (!isDragging && Math.hypot(totalDx, totalDy) > 6) {
        isDragging = true;
      }
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) * 0.055;
        const dy = (e.clientY - dragStart.y) * 0.055;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        panOffset.x -= dx;
        panOffset.y += dy;
        updateCameraPosition();
        wake();
      }
    });

    window.addEventListener("pointerup", e => {
      if (!isPointerDown) return;
      isPointerDown = false;

      // If user tapped without dragging: check interactive objects first, then walkable ground
      if (!isDragging && (e.button === 0 || e.button === undefined)) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // 1. Raycast interactive 3D landmarks, props, and pins
        const intHits = raycaster.intersectObjects(interactiveMeshes);
        if (intHits.length > 0) {
          const hit = intHits[0];
          const data = hit.object.userData;
          if (data && data.onInteract) {
            if (currentActivity && (!data.activity || data.activity !== currentActivity)) {
              stopPlayActivity();
            }
            data.onInteract();
            if (typeof data.x === "number" && typeof data.z === "number") {
              targetPos = new T.Vector3(data.x, rigBaseY, data.z);
              marker.position.set(data.x, 0.52, data.z);
              markerMat.opacity = 0.95;
            }
            wake();
            return;
          }
        }

        // 2. Raycast walkable ground surfaces
        const hits = raycaster.intersectObjects(walkableSurfaces);
        if (hits.length > 0) {
          const hit = hits[0];
          if (currentActivity) stopPlayActivity();
          targetPos = new T.Vector3(hit.point.x, rigBaseY, hit.point.z);
          marker.position.set(hit.point.x, 0.52, hit.point.z);
          markerMat.opacity = 0.95;
          wake();
        }
      }
      isDragging = false;
    });

    window.addEventListener("contextmenu", e => {
      if (e.target.closest && e.target.closest(".home-hero")) e.preventDefault();
    });

    // ---- Raycasting setup ----
    const raycaster = new T.Raycaster();
    const mouse = new T.Vector2();

    // ---- Top-View Keyboard Navigation (Up=North, Down=South, Left=West, Right=East) ----
    function handleKey(e, isDown) {
      if (calm()) return;
      const code = e.code || "";
      const key = e.key || "";
      let handled = false;

      // Enter key to interact with nearby item or boost active equipment
      if (isDown && (code === "Enter" || key === "Enter")) {
        if (currentNearbyItem && !currentActivity) {
          e.preventDefault();
          currentNearbyItem.onActivate();
          return;
        } else if (currentActivity === "trampoline" || currentActivity === "swing") {
          e.preventDefault();
          boostCurrentActivity();
          return;
        }
      }

      // Space key to boost bounce or swing
      if (isDown && (code === "Space" || key === " " || key === "Spacebar")) {
        if (currentActivity === "trampoline" || currentActivity === "swing") {
          e.preventDefault();
          boostCurrentActivity();
          return;
        } else if (currentNearbyItem && !currentActivity) {
          e.preventDefault();
          currentNearbyItem.onActivate();
          return;
        }
      }

      // Escape key to dismount from playground equipment
      if (isDown && (code === "Escape" || key === "Escape")) {
        if (currentActivity) {
          e.preventDefault();
          stopPlayActivity();
          return;
        }
      }

      // Up = North (towards Missouri, -Z) or boost active equipment
      if (code === "ArrowUp" || key === "ArrowUp" || code === "KeyW" || key === "w" || key === "W") {
        if (isDown && (currentActivity === "trampoline" || currentActivity === "swing")) {
          e.preventDefault();
          boostCurrentActivity();
          return;
        }
        keys.up = isDown; handled = true;
      }
      // Down = South (towards Louisiana, +Z)
      if (code === "ArrowDown" || key === "ArrowDown" || code === "KeyS" || key === "s" || key === "S") {
        keys.down = isDown; handled = true;
      }
      // Left = West (towards Texas / Oklahoma, -X)
      if (code === "ArrowLeft" || key === "ArrowLeft" || code === "KeyA" || key === "a" || key === "A") {
        keys.left = isDown; handled = true;
      }
      // Right = East (towards Tennessee / Mississippi, +X)
      if (code === "ArrowRight" || key === "ArrowRight" || code === "KeyD" || key === "d" || key === "D") {
        keys.right = isDown; handled = true;
      }

      if (handled) {
        if (isDown) e.preventDefault(); // Stop window scroll
        if (isDown && currentActivity) stopPlayActivity();
        targetPos = null;
        wake();
      }
    }
    window.addEventListener("keydown", e => handleKey(e, true));
    window.addEventListener("keyup", e => handleKey(e, false));

    // ---- State Detection & Notification Banner ----
    function checkCurrentState(x, z) {
      let found = null, minD = 999;
      STATES.forEach(st => {
        const d = Math.hypot(x - st.x, z - st.z);
        if (d <= st.rad && d < minD) { minD = d; found = st; }
      });
      if (found && found.id !== currentStateId) {
        currentStateId = found.id;
        showStateToast(found);
      }
    }

    function showStateToast(st) {
      let toast = document.getElementById("stateToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "stateToast";
        toast.className = "state-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.innerHTML = `
        <span class="icon">${st.icon}</span> <b>${st.name}</b> · Capital: <u>${st.capital}</u> (${st.motto})
        <button type="button" class="toast-card-btn" id="toastCardBtn">Explore 📖</button>
      `;
      toast.classList.add("show");
      const btn = toast.querySelector("#toastCardBtn");
      if (btn) {
        btn.onclick = (e) => {
          e.stopPropagation();
          openDiscoveryModal(st);
        };
      }
      toast.onclick = () => openDiscoveryModal(st);
      clearTimeout(toast._tid);
      toast._tid = setTimeout(() => toast.classList.remove("show"), 4200);
    }

    // ==========================================
    // Interactive Discovery Modal Controls
    // ==========================================
    const discModal = document.getElementById("discoveryModal");
    const discBackdrop = document.getElementById("discoveryBackdrop");
    const discCloseBtn = document.getElementById("discClose");
    const discIconEl = document.getElementById("discIcon");
    const discTitleEl = document.getElementById("discTitle");
    const discSubtitleEl = document.getElementById("discSubtitle");
    const discFactEl = document.getElementById("discFact");
    const discExtraEl = document.getElementById("discExtra");
    const discWalkBtn = document.getElementById("discWalkBtn");
    const discInteractBtn = document.getElementById("discInteractBtn");

    function openDiscoveryModal(item) {
      if (!discModal || !discBackdrop) return;
      if (discIconEl) discIconEl.textContent = item.icon || "📍";
      if (discTitleEl) discTitleEl.textContent = item.name || item.title || "";
      if (discSubtitleEl) discSubtitleEl.textContent = item.subtitle || (item.capital ? `Capital: ${item.capital} · ${item.motto}` : "");
      if (discFactEl) discFactEl.textContent = item.fact || "";

      if (discExtraEl) {
        if (item.extraContentHtml) {
          discExtraEl.innerHTML = item.extraContentHtml;
          discExtraEl.hidden = false;
        } else if (item.extra) {
          discExtraEl.textContent = item.extra;
          discExtraEl.hidden = false;
        } else {
          discExtraEl.innerHTML = "";
          discExtraEl.hidden = true;
        }
      }

      if (discWalkBtn) {
        discWalkBtn.textContent = `🚶 Walk to ${item.name || "Here"}`;
        discWalkBtn.onclick = () => {
          closeDiscoveryModal();
          if (typeof item.x === "number" && typeof item.z === "number") {
            targetPos = new T.Vector3(item.x, rigBaseY, item.z);
            marker.position.set(item.x, 0.52, item.z);
            markerMat.opacity = 0.95;
            wake();
          }
        };
      }

      if (discInteractBtn) {
        discInteractBtn.textContent = item.actionLabel ? `✨ ${item.actionLabel}` : "✨ Animate Landmark";
        discInteractBtn.onclick = () => {
          if (item.onInteract) item.onInteract();
        };
      }

      discBackdrop.hidden = false;
      discModal.hidden = false;
      requestAnimationFrame(() => {
        discBackdrop.classList.add("show");
        discModal.classList.add("show");
        if (discCloseBtn) discCloseBtn.focus({ preventScroll: true });
      });
    }

    function closeDiscoveryModal() {
      if (!discModal || !discBackdrop) return;
      discModal.classList.remove("show");
      discBackdrop.classList.remove("show");
      if (cameraMode === "landmark") {
        cameraMode = "normal";
        wake();
      }
      setTimeout(() => {
        discModal.hidden = true;
        discBackdrop.hidden = true;
      }, 240);
    }

    if (discCloseBtn) discCloseBtn.addEventListener("click", closeDiscoveryModal);
    if (discBackdrop) discBackdrop.addEventListener("click", closeDiscoveryModal);
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") closeDiscoveryModal();
    });

    // ==========================================
    // Main Animation Loop
    // ==========================================
    let raf = 0, last = performance.now();
    function render() { renderer.render(scene, camera); }
    function wake() { if (!raf && !calm()) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    function frame(now) {
      raf = 0;
      if (document.hidden) return;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Handle Walking via Keys or Click Target
      let moveX = 0, moveZ = 0;
      if (keys.up) moveZ -= 1;
      if (keys.down) moveZ += 1;
      if (keys.left) moveX -= 1;
      if (keys.right) moveX += 1;

      if (moveX !== 0 || moveZ !== 0) {
        isWalking = true;
        const len = Math.hypot(moveX, moveZ);
        moveX /= len; moveZ /= len;
        ahaanAngle = Math.atan2(moveX, moveZ);
        A.rig.position.x += moveX * walkSpeed * dt;
        A.rig.position.z += moveZ * walkSpeed * dt;
      } else if (targetPos) {
        const dx = targetPos.x - A.rig.position.x;
        const dz = targetPos.z - A.rig.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.4) {
          isWalking = true;
          ahaanAngle = Math.atan2(dx / dist, dz / dist);
          A.rig.position.x += (dx / dist) * walkSpeed * dt;
          A.rig.position.z += (dz / dist) * walkSpeed * dt;
          markerMat.opacity = Math.max(0.2, markerMat.opacity - dt * 0.4);
        } else {
          isWalking = false;
          targetPos = null;
          markerMat.opacity = 0;
        }
      } else {
        isWalking = false;
      }

      // Smoothly rotate Ahaan towards heading
      if (isWalking && (!currentActivity || activityPhase === 0)) {
        const curRot = A.rig.rotation.y;
        let diff = ahaanAngle - curRot;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        A.rig.rotation.y += diff * Math.min(1, dt * 14);
      }

      // Update hand wave animation
      let wavingActive = false;
      if (waveTimer > 0) {
        waveTimer -= dt;
        if (waveTimer <= 0 && A.stopWave) A.stopWave();
      }
      if (A.updateWave && (!currentActivity || activityPhase === 0)) {
        wavingActive = A.updateWave(dt, isWalking, calm());
      }

      // Update leg and arm walk cycle
      if (A.updateWalk && (!currentActivity || activityPhase === 0)) {
        A.updateWalk(isWalking, 8.5, dt);
      }

      // Update playground activity
      if (currentActivity) {
        updatePlayActivity(dt);
      }

      if (!currentActivity || activityPhase === 0) {
        A.rig.position.y = rigBaseY; // Lock vertical baseline
      }

      // Track speech bubble above Ahaan and update walk state
      updateBubblePosition();
      const currentBubble = document.getElementById("ahaanBubble");
      if (currentBubble) {
        if (isWalking) {
          currentBubble.classList.add("is-walking");
        } else if (currentBubble.classList.contains("is-walking")) {
          currentBubble.classList.remove("is-walking");
        }
      }

      // Check nearby interactive items for action prompt
      checkProximity();

      // Check current state boundary
      checkCurrentState(A.rig.position.x, A.rig.position.z);

      // Update camera in top view or close-up action view
      updateCameraPosition(dt);

      // Update trampoline sparkle particles
      const anyParticlesActive = updateParticles(dt);

      // Drift storybook clouds if motion is allowed
      if (!calm() && clouds) {
        clouds.forEach(cl => {
          cl.position.x += cl.userData.speed * dt;
          if (cl.position.x > 75) cl.position.x = -75;
        });
      }

      // Update landmark and story prop animations
      let anyAnimActive = false;
      landmarkAnimators.forEach(fn => {
        if (fn(dt)) anyAnimActive = true;
      });

      render();

      let desiredTarget, desiredPos;
      if (cameraMode === "action" || cameraMode === "landmark") {
        desiredTarget = actionCamTarget;
        desiredPos = actionCamPos;
      } else {
        desiredTarget = normalCamTarget;
        desiredPos = normalCamPos;
      }
      const cameraMoving = currentCamPos.distanceTo(desiredPos) > 0.05 || currentCamTarget.distanceTo(desiredTarget) > 0.05;

      if (cameraMoving || isWalking || targetPos || Object.values(keys).some(v => v) || markerMat.opacity > 0 || isDragging || anyAnimActive || wavingActive || waveTimer > 0 || currentActivity || anyParticlesActive) {
        raf = requestAnimationFrame(frame);
      }
    }

    // Window Resize Handling
    function resize() {
      const w = hero.clientWidth, h = hero.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      updateCameraPosition();
      updateBubblePosition();
      render();
    }
    window.addEventListener("resize", resize);
    resize();
    render();

    // Preserve AhaanFigure global interface for sweet eating & comic interactions
    window.AhaanFigure = {
      mouth() {
        const v = new T.Vector3(0, 0, 0.9);
        A.mouth.getWorldPosition(v);
        v.project(camera);
        const r = canvas.getBoundingClientRect();
        return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
      },
      hand() {
        const v = new T.Vector3();
        A.leftArm.elbow.getWorldPosition(v);
        v.project(camera);
        const r = canvas.getBoundingClientRect();
        return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
      },
      head() {
        const v = new T.Vector3();
        A.head.getWorldPosition(v);
        v.project(camera);
        const r = canvas.getBoundingClientRect();
        return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
      },
      pose(name) { wake(); },
      chomp() { wake(); }
    };

    window.Park3D = {
      interactiveMeshes,
      STATES,
      INTERACTABLES,
      openDiscoveryModal,
      closeDiscoveryModal,
      playSound,
      startPlayActivity,
      stopPlayActivity,
      boostCurrentActivity,
      exploreLandmark,
      teleportAhaan: (x, z) => {
        if (currentActivity) stopPlayActivity();
        A.rig.position.x = x;
        A.rig.position.z = z;
        checkProximity();
        checkCurrentState(x, z);
        updateBubblePosition();
        wake();
      },
      walkTo: (x, z) => {
        targetPos = new T.Vector3(x, rigBaseY, z);
        wake();
      },
      getCurrentActivity: () => currentActivity,
      getCurrentNearbyItem: () => currentNearbyItem,
      getA: () => A,
      getSwingPivot: () => swingPivot
    };

    hero.classList.add("park-ready");
    greetRandom(true);
    updateBubblePosition();
  }
})();
