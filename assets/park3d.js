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
  let soundOn = false, soundVol = null, chopperSoundActive = false;
  try {
    const s = JSON.parse(localStorage.getItem(SKEY));
    if (s) soundOn = !!s.on;
    // Keep the volume that Ahaan set on the Bells or Doors page. The home toggle must not make sound louder.
    if (s && typeof s.vol === "number") soundVol = s.vol;
  } catch (e) {}
  if (soundVol !== null && window.AhaanAudio) window.AhaanAudio.setVolume(soundVol / 100);

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
      try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: soundVol === null ? 60 : soundVol })); } catch (e) {}
      syncSoundUI();
      if (soundOn && window.AhaanAudio) {
        window.AhaanAudio.bell(523.25, 0, 0.08);
        if (chopperSoundActive) window.AhaanAudio.startRotor();
      } else if (window.AhaanAudio) {
        window.AhaanAudio.stopRotor();
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
    } else if (type === "dino") {
      window.AhaanAudio.strike(130.81, { decay: 0.52, peak: 0.035, attack: 0.08, partials: [[1, 1, 1], [1.48, 0.3, 0.8], [2.02, 0.12, 0.6]] });
      window.AhaanAudio.strike(98, { when: 0.12, decay: 0.42, peak: 0.025, attack: 0.08, partials: [[1, 1, 1], [1.5, 0.25, 0.7]] });
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
      s.src = "assets/three.min.js";
      s.onload = resolve;
      s.onerror = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js";
        s2.onload = resolve;
        s2.onerror = () => reject(new Error("three.js failed to load"));
        document.head.appendChild(s2);
      };
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
    // Warm watercolor parchment horizon (matching Singapore Sketchbook wash)
    const HORIZON = new T.Color("#ece7dc");
    scene.fog = new T.Fog(HORIZON, 36, 120);

    const camera = new T.PerspectiveCamera(40, 1, 0.1, 450);

    // ---- Sky Dome: Soft Watercolor Wash Gradient ----
    scene.add(new T.Mesh(new T.SphereGeometry(200, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new T.Color("#628ea6") },       // Cerulean ink wash
        mid: { value: new T.Color("#a2c0d6") },       // Soft sky wash
        bottom: { value: new T.Color("#ece7dc") }     // Warm parchment paper horizon
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.05 ? mix(mid, top, smoothstep(0.05, 0.55, h)) : mix(bottom, mid, smoothstep(-0.04, 0.05, h)); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}"
    })));

    // ---- Lighting: Warm Golden Watercolor Sun & Ambient Meadow Bounce ----
    scene.add(new T.HemisphereLight(0xfcf8ee, 0x8a997d, 1.15));
    const sun = new T.DirectionalLight(0xfff5e2, 1.35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 48, bottom: -48, near: 1, far: 130 });
    sun.shadow.bias = -0.0003;
    sun.position.set(-25, 48, 28);
    scene.add(sun);

    // Warm golden rim light for specular depth on trees and landmarks
    const rimSun = new T.DirectionalLight(0xf2e0c9, 0.40);
    rimSun.position.set(30, 24, -32);
    scene.add(rimSun);

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
        color: 0x648f5e, // Soft sage watercolor
        x: 0,
        z: 0,
        rad: 6.2,
        icon: "⭐",
        fact: "Arkansas has diamond fields, sparkling quartz crystal mines, and emerald forests.",
        extra: "Ahaan's Home Base: The picnic blanket and open storybook where adventures begin.",
        actionLabel: "Read Storybook 📖"
      },
      {
        id: "MO",
        name: "Missouri",
        city: "St. Louis",
        capital: "Jefferson City",
        motto: "Show-Me State",
        color: 0x587e5e, // Muted woodland watercolor
        x: 0,
        z: -25.5,
        rad: 6.4,
        icon: "🏛️",
        fact: "The St. Louis Gateway Arch is 630 feet tall. It is the tallest human-made monument in the United States!",
        extra: "Explorers Meriwether Lewis and William Clark began their historic journey west from here in 1804.",
        actionLabel: "Light Gateway Arch 🏛️"
      },
      {
        id: "TN",
        name: "Tennessee",
        city: "Nashville",
        capital: "Nashville",
        motto: "Volunteer State",
        color: 0x527785, // Dusty indigo-teal watercolor
        x: 24.5,
        z: -10.5,
        rad: 6.0,
        icon: "🎶",
        fact: "Nashville is known as Music City! Tennessee is famous for bluegrass tunes and the Great Smoky Mountains.",
        extra: "Acoustic guitars, banjos, and fiddles fill the mountain air with cheerful melodies.",
        actionLabel: "Strum Bluegrass Guitar 🎶"
      },
      {
        id: "MS",
        name: "Mississippi",
        city: "Jackson",
        capital: "Jackson",
        motto: "Magnolia State",
        color: 0x4e826b, // Bayou moss watercolor
        x: 23.5,
        z: 13.5,
        rad: 6.0,
        icon: "🌊",
        fact: "The Mississippi River flows all the way south to the Gulf of Mexico. White magnolia blossoms grow here.",
        extra: "Warm river breezes carry the scent of sweet magnolias as river barges float past.",
        actionLabel: "Sweep River Beacon 🌊"
      },
      {
        id: "LA",
        name: "Louisiana",
        city: "Baton Rouge",
        capital: "Baton Rouge",
        motto: "Pelican State",
        color: 0x467570, // Celadon wetland watercolor
        x: 0,
        z: 25.5,
        rad: 6.4,
        icon: "🌿",
        fact: "Louisiana has rich bayous and wetland habitats. Pelican birds glide in the water beside historic riverboats.",
        extra: "The red paddle wheel splashes water as the boat cruises past Spanish moss and cypress trees.",
        actionLabel: "Ring Riverboat Bell 🔔"
      },
      {
        id: "TX",
        name: "Texas",
        city: "Austin",
        capital: "Austin",
        motto: "The Lone Star State",
        color: 0xa87c4f, // Terracotta sand watercolor
        x: -25.0,
        z: 13.0,
        rad: 7.0,
        icon: "🤠",
        fact: "Texas is famous for wide open prairies and big starry skies. Bluebonnet wildflowers bloom across hills each spring.",
        extra: "On clear nights, you can see constellations and shooting stars sparkling across the big open sky.",
        actionLabel: "Spin Lone Star ⭐"
      },
      {
        id: "OK",
        name: "Oklahoma",
        city: "Oklahoma City",
        capital: "Oklahoma City",
        motto: "Sooner State",
        color: 0x98654a, // Sienna ochre watercolor
        x: -25.0,
        z: -13.0,
        rad: 6.2,
        icon: "🌻",
        fact: "Strong prairie winds sweep across the plains. Giant wind turbines capture the breeze to create clean electricity.",
        extra: "Golden tallgrass prairie grasses wave gently like ocean ripples under the sunny sky.",
        actionLabel: "Spin Wind Turbine 🌬️"
      }
    ];

    const interactiveMeshes = [];
    const landmarkAnimators = [];
    const parkObstacles = [];

    // Living breeze animation arrays
    const windTrees = [];
    const windGrassTufts = [];
    const windFlowers = [];

    // Lazy River floating state
    let lazyRiverAngle = 0.1;
    let lazyRiverSpeed = 0.35;
    let lazyRiverInflatable = null;
    let lazyRiverWater = null;

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

    // Procedural watercolor meadow wash texture (Singapore Sketchbook aesthetic)
    function createMeadowTexture(T) {
      const c = document.createElement("canvas");
      c.width = 512; c.height = 512;
      const g = c.getContext("2d");

      // Warm linen / paper wash base (Singapore Sketchbook paper ground)
      g.fillStyle = "#ece7dc";
      g.fillRect(0, 0, 512, 512);

      // Soft sage and olive watercolor washes
      const bg = g.createRadialGradient(256, 256, 60, 256, 256, 360);
      bg.addColorStop(0, "rgba(128, 162, 116, 0.72)");
      bg.addColorStop(0.65, "rgba(110, 144, 98, 0.68)");
      bg.addColorStop(1, "rgba(94, 126, 84, 0.62)");
      g.fillStyle = bg;
      g.fillRect(0, 0, 512, 512);

      // Watercolor pigment granulation (natural speckle)
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512, y = Math.random() * 512;
        const rad = 1.5 + Math.random() * 3.5;
        g.fillStyle = Math.random() > 0.5 ? "rgba(95, 138, 80, 0.18)" : "rgba(236, 231, 220, 0.28)";
        g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      }

      // Painterly botanical clover tri-leaves with soft ink contour
      for (let i = 0; i < 75; i++) {
        const cx = Math.random() * 512, cy = Math.random() * 512;
        const cRad = 2.5 + Math.random() * 3.0;
        g.fillStyle = Math.random() > 0.3 ? "rgba(68, 112, 56, 0.45)" : "rgba(82, 128, 68, 0.40)";
        for (let lobe = 0; lobe < 3; lobe++) {
          const ang = (lobe * Math.PI * 2) / 3;
          g.beginPath();
          g.arc(cx + Math.cos(ang) * cRad * 0.7, cy + Math.sin(ang) * cRad * 0.7, cRad * 0.62, 0, Math.PI * 2);
          g.fill();
        }
      }

      // Fine botanical grass strokes
      g.strokeStyle = "rgba(75, 118, 62, 0.32)";
      g.lineWidth = 1.1;
      for (let i = 0; i < 280; i++) {
        const gx = Math.random() * 512, gy = Math.random() * 512;
        g.beginPath();
        g.moveTo(gx, gy);
        g.quadraticCurveTo(gx + (Math.random() - 0.5) * 6, gy - 6 - Math.random() * 6, gx + (Math.random() - 0.5) * 10, gy - 10);
        g.stroke();
      }

      // Soft wildflower specks (white chamomile and warm tea buttercups)
      for (let i = 0; i < 40; i++) {
        const bx = Math.random() * 512, by = Math.random() * 512;
        const isYellow = Math.random() > 0.45;
        g.fillStyle = isYellow ? "rgba(245, 203, 86, 0.75)" : "rgba(255, 252, 245, 0.85)";
        g.beginPath(); g.arc(bx, by, 2.2, 0, Math.PI * 2); g.fill();
      }

      const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.repeat.set(12, 12);
      return tex;
    }

    // Surrounding grassy terrain with watercolor paper wash
    const groundGeo = new T.PlaneGeometry(180, 180, 48, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new T.MeshStandardMaterial({
      color: 0xffffff,
      map: createMeadowTexture(T),
      roughness: 0.94
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
        roughness: 0.88,
        flatShading: true
      });
      const tile = new T.Mesh(tileGeo, tileMat);
      tile.position.set(st.x, 0.22, st.z);
      tile.receiveShadow = true;
      tile.userData = st;
      mapGroup.add(tile);
      stateMeshes.push(tile);

      // Elevated cotton paper border ring with antique gold leaf inlay
      const ringGeo = new T.RingGeometry(st.rad * 0.97, st.rad * 1.04, 44);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new T.MeshBasicMaterial({ color: 0xfcf9f2, transparent: true, opacity: 0.92 });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.position.set(st.x, 0.48, st.z);
      mapGroup.add(ring);

      const goldRingGeo = new T.RingGeometry(st.rad * 0.93, st.rad * 0.97, 44);
      goldRingGeo.rotateX(-Math.PI / 2);
      const goldRingMat = new T.MeshStandardMaterial({
        color: 0xc8a64d,
        metalness: 0.40,
        roughness: 0.60
      });
      const goldRing = new T.Mesh(goldRingGeo, goldRingMat);
      goldRing.position.set(st.x, 0.47, st.z);
      mapGroup.add(goldRing);

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
    // 3D Circular Lazy River & Float Dock
    // ==========================================
    buildLazyRiver(mapGroup, T, walkableSurfaces);

    // ==========================================
    // 3D Connecting Trails & Roads
    // ==========================================
    buildPaths(mapGroup, STATES, T, walkableSurfaces);

    // ==========================================
    // 3D Nature: Lush Trees, Rocks & Wildflowers
    // ==========================================
    buildNature(mapGroup, T);
    buildHeroEnrichments(mapGroup, T);
    const zooInteractables = buildZoo(mapGroup, T);

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
      const pathMat = new T.MeshStandardMaterial({ color: 0xdcd0b6, roughness: 0.94, flatShading: true });
      const curbMat = new T.MeshStandardMaterial({ color: 0xbfae8e, roughness: 0.90 });
      const stoneMat = new T.MeshStandardMaterial({ color: 0xf4ece0, roughness: 0.88 });

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

    // One profile drives bridge geometry and the walking route height.
    function bridgeDeckHeight(u, bankY = 0.32) {
      const t = Math.max(0, Math.min(1, u));
      return bankY + 2.84 + 0.46 * Math.sin(Math.PI * t);
    }

    function bridgeDeckAt(x, z) {
      const r = 8.8, halfSpan = 2.3;
      const bridges = [[0,-1],[1,0],[0,1],[-1,0]];
      for (const [dx,dz] of bridges) {
        const cx=dx*r, cz=dz*r, along=(x-cx)*dx+(z-cz)*dz;
        const across=Math.abs((x-cx)*dz-(z-cz)*dx);
        if (Math.abs(along)<=halfSpan && across<=1.15) {
          return bridgeDeckHeight((along+halfSpan)/(2*halfSpan),0);
        }
      }
      const riverBridges = [[11.5,-4.9,1.98],[14.2,8.15,1.05]];
      for (const [cx,cz,rotation] of riverBridges) {
        const along=(x-cx)*Math.sin(rotation)+(z-cz)*Math.cos(rotation);
        const across=Math.abs((x-cx)*Math.cos(rotation)-(z-cz)*Math.sin(rotation));
        if (Math.abs(along)<=3.2 && across<=1.05) {
          return bridgeDeckHeight((along+3.2)/6.4,0.32);
        }
      }
      return null;
    }

    function groundHeightAt(x, z, baseY) {
      const deck = bridgeDeckAt(x, z);
      return deck === null ? baseY : baseY + Math.max(0, deck + 0.08 - 0.45);
    }

    function bikeSurfaceHeightAt(x, z) {
      const deck = bridgeDeckAt(x, z);
      return deck === null ? 0.06 : deck - 0.04;
    }

    function buildRiver(parent, T, walkables) {
      const riverGeo = new T.PlaneGeometry(4.6, 78, 1, 48);
      riverGeo.rotateX(-Math.PI / 2);
      const pos = riverGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        const curve = Math.sin(z * 0.08) * 3.0 + Math.cos(z * 0.05) * 1.5;
        pos.setX(i, pos.getX(i) + curve + 11.2);
      }
      riverGeo.computeVertexNormals();

      const riverMat = new T.MeshStandardMaterial({
        color: 0x588aa2,
        roughness: 0.35,
        metalness: 0.08,
        transparent: true,
        opacity: 0.88
      });
      const river = new T.Mesh(riverGeo, riverMat);
      river.position.y = 0.14;
      parent.add(river);

      function makeBridge(bx, bz, rot, length = 6.4, width = 2.6, bankY = 0.32) {
        const b = new T.Group();
        b.position.set(bx, 0, bz);
        b.rotation.y = rot;
        const woodMat = new T.MeshStandardMaterial({ color: 0x7a4928, roughness: 0.82 });
        const darkWoodMat = new T.MeshStandardMaterial({ color: 0x543218, roughness: 0.90 });
        const segments = 16, half = length / 2;
        const surface = new T.BufferGeometry(), verts = [], indices = [];
        for (let i=0;i<=segments;i++) {
          const u=i/segments, z=-half+length*u, y=bridgeDeckHeight(u,bankY);
          verts.push(-width/2,y,z,width/2,y,z);
          if(i<segments){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}
        }
        surface.setAttribute('position',new T.Float32BufferAttribute(verts,3)); surface.setIndex(indices); surface.computeVertexNormals();
        const deck=new T.Mesh(surface,woodMat);deck.castShadow=true;deck.receiveShadow=true;b.add(deck);if(walkables)walkables.push(deck);
        for(let i=0;i<segments;i++){
          const u=(i+.5)/segments,z=-half+length*u,y=bridgeDeckHeight(u,bankY)+.025;
          const line=new T.Mesh(new T.BoxGeometry(width,.025,.035),darkWoodMat);line.position.set(0,y,z);b.add(line);
        }
        [-width/2-.28,width/2+.28].forEach(x=>{
          for(let i=0;i<=segments;i+=4){const u=i/segments,z=-half+length*u,y=bridgeDeckHeight(u,bankY);const post=new T.Mesh(new T.CylinderGeometry(.07,.09,y+0.45,8),darkWoodMat);post.position.set(x,(y+.45)/2,z);b.add(post);}
          const rail=new T.Mesh(new T.BoxGeometry(.12,.14,length),woodMat);rail.position.set(x,3.42+bankY,0);b.add(rail);
        });
        parent.add(b);
      }
      // Wooden footbridges crossing the river aligned with trail vectors to Tennessee and Mississippi
      makeBridge(11.5, -4.9, 1.98);
      makeBridge(14.2, 8.15, 1.05);

      // Floating water lily pads and pink lotus flowers along the extended river
      const lilyGeo = new T.CircleGeometry(0.60, 14);
      lilyGeo.rotateX(-Math.PI / 2);
      const lilyMat = new T.MeshStandardMaterial({ color: 0x3d7a42, roughness: 0.6 });
      const lotusMat = new T.MeshStandardMaterial({ color: 0xf498b8, roughness: 0.5 });
      const lilyPositions = [
        [10.8, -26.0], [11.5, -16.0], [11.2, -8.0], [10.6, 1.2], [11.8, 14.0], [11.4, 24.0], [10.9, 32.0]
      ];
      lilyPositions.forEach(([lx, lz]) => {
        const pad = new T.Mesh(lilyGeo, lilyMat);
        pad.position.set(lx, 0.17, lz);
        parent.add(pad);
        const flower = new T.Mesh(new T.ConeGeometry(0.22, 0.30, 6), lotusMat);
        flower.position.set(lx, 0.32, lz);
        parent.add(flower);
      });

      // Wooden river dock / pier on the Arkansas riverbank
      const dock = new T.Group();
      dock.position.set(8.2, 0.35, 0.8);
      const dockMat = new T.MeshStandardMaterial({ color: 0x6e4428, roughness: 0.85 });
      const pier = new T.Mesh(new T.BoxGeometry(2.6, 0.14, 1.8), dockMat);
      dock.add(pier);
      if (walkables) walkables.push(pier);
      [-1.2, 1.2].forEach(px => {
        const post = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.6, 8), dockMat);
        post.position.set(px, 0.3, 0.8);
        dock.add(post);
      });
      parent.add(dock);
    }

    // ==========================================
    // 3D Circular Lazy River around Arkansas
    // ==========================================
    function buildLazyRiver(parent, T, walkables) {
      const riverGroup = new T.Group();
      parent.add(riverGroup);

      // Lazy river circular canal (R = 8.8m, width 2.6m from r=7.5m to r=10.1m)
      const canalInnerR = 7.5;
      const canalOuterR = 10.1;
      const canalMidR = (canalInnerR + canalOuterR) / 2; // 8.8m

      // Water surface ring
      const waterGeo = new T.RingGeometry(canalInnerR, canalOuterR, 64);
      waterGeo.rotateX(-Math.PI / 2);
      const waterMat = new T.MeshStandardMaterial({
        color: 0x54869e,
        roughness: 0.35,
        metalness: 0.08,
        transparent: true,
        opacity: 0.88
      });
      lazyRiverWater = new T.Mesh(waterGeo, waterMat);
      lazyRiverWater.position.y = 0.16;
      riverGroup.add(lazyRiverWater);

      // Pebble riverbanks along inner and outer canal perimeters
      const pebbleMat = new T.MeshStandardMaterial({ color: 0x8f7d6a, roughness: 0.9 });
      const sandMat = new T.MeshStandardMaterial({ color: 0xd8caa8, roughness: 0.95 });
      [canalInnerR, canalOuterR].forEach((r, idx) => {
        const bankGeo = new T.RingGeometry(r - 0.25, r + 0.25, 48);
        bankGeo.rotateX(-Math.PI / 2);
        const bank = new T.Mesh(bankGeo, idx === 0 ? pebbleMat : sandMat);
        bank.position.y = 0.20;
        riverGroup.add(bank);
      });

      // River stones scattered along the banks
      for (let s = 0; s < 28; s++) {
        const ang = (s / 28) * Math.PI * 2;
        const rad = (s % 2 === 0 ? canalInnerR - 0.15 : canalOuterR + 0.15) + (Math.sin(s * 7) * 0.2);
        const stone = new T.Mesh(
          new T.DodecahedronGeometry(0.18 + (s % 3) * 0.08, 0),
          pebbleMat
        );
        stone.position.set(Math.cos(ang) * rad, 0.24, Math.sin(ang) * rad);
        stone.scale.set(1.2, 0.6, 1.0);
        stone.castShadow = true;
        riverGroup.add(stone);
      }

      // Wooden river float dock on Arkansas bank (East side: x = 7.0, z = 0.8)
      const dockGroup = new T.Group();
      dockGroup.position.set(7.0, 0.28, 0.8);
      const woodMat = new T.MeshStandardMaterial({ color: 0x734826, roughness: 0.85 });
      const dockPier = new T.Mesh(new T.BoxGeometry(2.0, 0.12, 2.2), woodMat);
      dockPier.castShadow = true;
      dockPier.receiveShadow = true;
      dockGroup.add(dockPier);
      if (walkables) walkables.push(dockPier);

      // Dock mooring post
      const post = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.75, 8), woodMat);
      post.position.set(0.85, 0.35, 0.85);
      post.castShadow = true;
      dockGroup.add(post);

      // Signpost: "Lazy River Float 🍩"
      const signCanvas = document.createElement("canvas");
      signCanvas.width = 160; signCanvas.height = 64;
      const sg = signCanvas.getContext("2d");
      sg.fillStyle = "#f6f2e8";
      sg.fillRect(0, 0, 160, 64);
      sg.strokeStyle = "#8a5830"; sg.lineWidth = 4;
      sg.strokeRect(4, 4, 152, 56);
      sg.fillStyle = "#3a2618";
      sg.font = "bold 18px sans-serif";
      sg.textAlign = "center";
      sg.fillText("🍩 Lazy River", 80, 28);
      sg.font = "14px sans-serif";
      sg.fillText("Hop in & Float!", 80, 48);
      const signTex = new T.CanvasTexture(signCanvas);
      const signBoard = new T.Mesh(
        new T.PlaneGeometry(1.2, 0.48),
        new T.MeshBasicMaterial({ map: signTex, side: T.DoubleSide })
      );
      signBoard.position.set(0.4, 0.85, 0.85);
      signBoard.rotation.y = -Math.PI / 4;
      dockGroup.add(signBoard);
      riverGroup.add(dockGroup);

      // Cheerful circular inflatable tube (doughnut swim ring lounger)
      lazyRiverInflatable = new T.Group();
      lazyRiverInflatable.position.set(canalMidR, 0.22, 0);

      // Ring body: unbleached cotton canvas with hand-painted watercolor stripes
      const tubeMat = new T.MeshStandardMaterial({
        color: 0xede6db, // Natural warm canvas
        roughness: 0.88,
        metalness: 0.02
      });
      const tubeMesh = new T.Mesh(new T.TorusGeometry(1.02, 0.32, 20, 36), tubeMat);
      tubeMesh.rotation.x = Math.PI / 2;
      tubeMesh.castShadow = true;
      lazyRiverInflatable.add(tubeMesh);

      // Decorative hand-painted watercolor stripes around tube (terracotta, sage, slate, ochre)
      const stripeColors = [0x9e5445, 0x567b55, 0x587a8e, 0xc8a265];
      for (let st = 0; st < 8; st++) {
        const sang = (st / 8) * Math.PI * 2;
        const stripeMat = new T.MeshStandardMaterial({ color: stripeColors[st % stripeColors.length], roughness: 0.85 });
        const sprinkle = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.22, 8), stripeMat);
        sprinkle.position.set(Math.cos(sang) * 1.02, 0.30, Math.sin(sang) * 1.02);
        sprinkle.rotation.z = Math.PI / 2;
        sprinkle.rotation.y = sang;
        lazyRiverInflatable.add(sprinkle);
      }

      // Plush headrest / backrest pillow cushion on rear rim for lazy river lounging
      const pillowMat = new T.MeshStandardMaterial({ color: 0x9e5445, roughness: 0.88 }); // Terracotta canvas
      const pillow = new T.Mesh(new T.CapsuleGeometry(0.18, 0.65, 8, 16), pillowMat);
      pillow.position.set(0, 0.34, -0.96);
      pillow.rotation.z = Math.PI / 2;
      lazyRiverInflatable.add(pillow);

      // Supportive suspended lounger seat mesh inside the tube hole
      const seatMeshMat = new T.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.90 }); // Deep indigo canvas
      const seatMesh = new T.Mesh(new T.CylinderGeometry(0.70, 0.62, 0.06, 24), seatMeshMat);
      seatMesh.position.set(0, -0.06, 0);
      lazyRiverInflatable.add(seatMesh);

      // Dual white molded safety grab handles on sides
      [-1, 1].forEach(s => {
        const handle = new T.Mesh(
          new T.TorusGeometry(0.16, 0.028, 8, 14, Math.PI),
          new T.MeshStandardMaterial({ color: 0xfcf8ee, roughness: 0.5 })
        );
        handle.position.set(s * 1.26, 0.16, 0);
        handle.rotation.z = s > 0 ? 0 : Math.PI;
        lazyRiverInflatable.add(handle);
      });

      riverGroup.add(lazyRiverInflatable);

      // 4 Arched wooden footbridges crossing over the circular lazy river
      // High parabolic arch (clearance y = 2.42m) gives generous open headroom for floating underneath!
      const bridgeAngles = [
        { ang: -Math.PI / 2, label: "North to Missouri", rot: 0 },
        { ang: 0, label: "East to Mississippi", rot: Math.PI / 2 },
        { ang: Math.PI / 2, label: "South to Louisiana", rot: 0 },
        { ang: Math.PI, label: "West to Texas", rot: Math.PI / 2 }
      ];
      bridgeAngles.forEach(ba => {
        const bx = Math.cos(ba.ang) * canalMidR;
        const bz = Math.sin(ba.ang) * canalMidR;
        const bridge = new T.Group();
        bridge.position.set(bx, 0, bz);
        bridge.rotation.y = ba.rot;

        // Multi-segment parabolic arched bridge deck
        const segs = 9;
        const totalSpan = 4.6; // spanning radial canal width
        for (let i = 0; i < segs; i++) {
          const t0 = i / segs;
          const t1 = (i + 1) / segs;
          const z0 = -totalSpan * 0.5 + t0 * totalSpan;
          const z1 = -totalSpan * 0.5 + t1 * totalSpan;
          const zmid = (z0 + z1) * 0.5;
          const arch0 = bridgeDeckHeight(t0, 0);
          const arch1 = bridgeDeckHeight(t1, 0);
          const ymid = (arch0 + arch1) * 0.5;
          const dz = z1 - z0;
          const dy = arch1 - arch0;
          const segLen = Math.hypot(dz, dy);
          const segSlope = Math.atan2(dy, dz);

          const plank = new T.Mesh(new T.BoxGeometry(2.3, 0.11, segLen * 1.03), woodMat);
          plank.position.set(0, ymid, zmid);
          plank.rotation.x = -segSlope;
          plank.castShadow = true;
          plank.receiveShadow = true;
          bridge.add(plank);
          if (walkables) walkables.push(plank);

          // Arched balustrade handrails along both sides of deck
          [-1.12, 1.12].forEach(rx => {
            const railSeg = new T.Mesh(new T.BoxGeometry(0.07, 0.28, segLen * 1.02), woodMat);
            railSeg.position.set(rx, ymid + 0.32, zmid);
            railSeg.rotation.x = -segSlope;
            bridge.add(railSeg);

            if (i % 2 === 0) {
              const post = new T.Mesh(new T.CylinderGeometry(0.045, 0.05, 0.48, 6), woodMat);
              post.position.set(rx, ymid + 0.22, zmid);
              bridge.add(post);
            }
          });
        }

        // Stone / timber abutment piers at the two water banks
        [-totalSpan * 0.48, totalSpan * 0.48].forEach(pz => {
          const abutment = new T.Mesh(new T.BoxGeometry(2.35, 0.65, 0.42), woodMat);
          abutment.position.set(0, 0.28, pz);
          abutment.castShadow = true;
          bridge.add(abutment);
        });

        riverGroup.add(bridge);
      });

      // Register interactive float dock
      registerInteractive(dockGroup, {
        name: "Lazy River Float",
        activity: "lazyriver",
        x: 7.0,
        z: 0.8,
        onInteract: () => startPlayActivity("lazyriver")
      });
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
      parkObstacles.push(
        { x: -2.6, z: -3.2, r: 1.55 },
        { x: 3.2, z: -2.8, r: 2.05 },
        { x: -4.3, z: 0.2, r: 2.35 }
      );
      const playGroup = new T.Group();
      parent.add(playGroup);

      const cedarMat = new T.MeshStandardMaterial({ color: 0x7a5a3e, roughness: 0.90 });
      const canopyMat = new T.MeshStandardMaterial({ color: 0x9b6842, roughness: 0.88 }); // Terracotta artist canvas
      const slideChuteMat = new T.MeshStandardMaterial({ color: 0x486478, roughness: 0.55, metalness: 0.20 }); // Slate blue metal
      const railYellowMat = new T.MeshStandardMaterial({ color: 0xc8a265, roughness: 0.65 }); // Antique brass
      const landingPadMat = new T.MeshStandardMaterial({ color: 0x567862, roughness: 0.90 }); // Forest moss mulch
      const steelMat = new T.MeshStandardMaterial({ color: 0x767066, metalness: 0.70, roughness: 0.40 });
      const chainMat = new T.MeshStandardMaterial({ color: 0x58544c, metalness: 0.75, roughness: 0.35 });
      const swingSeatMatA = new T.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.88 }); // Deep indigo artist canvas
      const swingSeatMatB = new T.MeshStandardMaterial({ color: 0x7a483a, roughness: 0.88 }); // Terracotta canvas
      const mulchMat = new T.MeshStandardMaterial({ color: 0x6e523e, roughness: 0.95 });
      const trampPadMat = new T.MeshStandardMaterial({ color: 0x4c6a56, roughness: 0.90 }); // Sage canvas padding
      const trampMatBlack = new T.MeshStandardMaterial({ color: 0x26332c, roughness: 0.95 }); // Deep woven charcoal mat
      const netMat = new T.MeshStandardMaterial({ color: 0x2b3831, transparent: true, opacity: 0.18, side: T.DoubleSide });
      const foamSleeveMat = new T.MeshStandardMaterial({ color: 0x5a7566, roughness: 0.85 }); // Muted moss sleeve

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
        x: -2.95,
        z: 0.2,
        onInteract: () => startPlayActivity("trampoline")
      });

      // Ambient companion swing motion in breeze
      landmarkAnimators.push((dt) => {
        if (companionSwingPivot) {
          if (!calm() && breezeOn()) {
            companionSwingPivot.rotation.x = Math.sin(performance.now() * 0.0018) * 0.08;
          } else if (calm()) {
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
      const barkMat = new T.MeshStandardMaterial({ color: 0x544234, roughness: 0.92 });
      const foliageMats = [
        new T.MeshStandardMaterial({ color: 0x5b7e54, roughness: 0.92 }), // Soft sage watercolor
        new T.MeshStandardMaterial({ color: 0x496745, roughness: 0.92 }), // Olive botanical wash
        new T.MeshStandardMaterial({ color: 0x688d5e, roughness: 0.92 }), // Warm meadow green
        new T.MeshStandardMaterial({ color: 0x324f3b, roughness: 0.94 }), // Deep spruce pine
        new T.MeshStandardMaterial({ color: 0xdfbfbc, roughness: 0.90 }), // Muted plumeria blush
        new T.MeshStandardMaterial({ color: 0xbfa258, roughness: 0.90 })  // Golden ochre foliage
      ];
      const rockMat = new T.MeshStandardMaterial({ color: 0x8a877e, roughness: 0.92, flatShading: true });
      const flowerMats = [
        new T.MeshStandardMaterial({ color: 0xfcf8ee, roughness: 0.88 }), // Warm cream plumeria
        new T.MeshStandardMaterial({ color: 0xd9b24e, roughness: 0.88 }), // Soft golden ochre
        new T.MeshStandardMaterial({ color: 0xbfa8cc, roughness: 0.88 })  // Muted lavender orchid
      ];

      function createOak(x, z, scale, matIdx) {
        parkObstacles.push({ x, z, r: 0.62 * scale });
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

        // Living breeze sway registration
        windTrees.push({ obj: crown, speed: 1.25, phase: x * 0.4 + z * 0.3, amp: 0.055 * scale });
      }

      function createPine(x, z, scale) {
        parkObstacles.push({ x, z, r: 0.52 * scale });
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

        // Living breeze sway registration
        windTrees.push({ obj: tree, speed: 1.1, phase: x * 0.35 + z * 0.25, amp: 0.04 * scale });
      }

      function createRock(x, z, sx, sy, sz) {
        parkObstacles.push({ x, z, r: Math.max(sx, sz) * 0.65 });
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

          // Living breeze sway registration
          windFlowers.push({ obj: f, speed: 2.4, phase: fx * 1.8 + fz * 1.8, amp: 0.12 });
        }
      }

      // 3D watercolor grass tufts across meadow parcels and trail verges
      const tuftMat = new T.MeshStandardMaterial({
        color: 0x629654,
        roughness: 0.8,
        flatShading: true
      });
      function createGrassTuft(gx, gz, scale) {
        const tuft = new T.Group();
        tuft.position.set(gx, 0.18, gz);
        for (let b = 0; b < 3; b++) {
          const blade = new T.Mesh(new T.ConeGeometry(0.06 * scale, 0.45 * scale, 3), tuftMat);
          blade.position.set((b - 1) * 0.07 * scale, 0.22 * scale, 0);
          blade.rotation.z = (b - 1) * 0.25;
          tuft.add(blade);
        }
        parent.add(tuft);
        windGrassTufts.push({ obj: tuft, speed: 2.6, phase: gx * 1.5 + gz * 1.5, amp: 0.16 });
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
        const labelText = `${arrow} ${label}`;
        while (g.measureText(labelText).width > 144 && parseInt(g.font, 10) > 12) {
          g.font = `bold ${parseInt(g.font, 10) - 1}px sans-serif`;
        }
        g.fillText(labelText, 80, 35, 144);
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
      createOak(-14.5, -20.2, 1.25, 0);
      createPine(-18.8, -22.0, 1.3);
      createOak(-11.8, -17.0, 1.1, 2);
      createPine(-21.2, -19.5, 1.15);
      createOak(-16.5, -13.5, 1.05, 5);

      // Northeast Grove (between Missouri & Tennessee)
      createPine(12.5, -22.2, 1.25);
      createOak(16.8, -19.0, 1.15, 1);
      createOak(9.6, -16.5, 1.0, 4);
      createPine(19.5, -18.8, 1.2);

      // East & Riverbank Grove (near Tennessee & Mississippi)
      createOak(28.5, -16.5, 1.3, 0);
      createOak(29.2, -1.5, 1.25, 2);
      createPine(28.0, 5.8, 1.2);
      createOak(27.5, 18.5, 1.35, 1);
      createOak(16.2, -12.5, 1.05, 4);
      createPine(16.4, 14.5, 1.1);

      // South Grove (between Louisiana, Mississippi & Texas)
      createOak(12.2, 22.8, 1.2, 0);
      createPine(15.5, 20.0, 1.15);
      createOak(-12.5, 21.5, 1.25, 2);
      createPine(-15.2, 24.5, 1.3);
      createOak(0.0, 32.0, 1.4, 1);

      // Southwest Grove (between Texas & Oklahoma)
      createOak(-26.5, 0.0, 1.35, 5);
      createPine(-29.0, -4.5, 1.25);
      createOak(-28.2, 5.8, 1.2, 0);
      createPine(-24.8, 18.0, 1.15);
      createOak(-20.2, 0.0, 1.05, 2);

      // Forest rim framing around the expansive perimeter (r ~ 40 to 48)
      const rimTrees = [
        [-38, -18], [-34, -28], [-24, -36], [-12, -40], [0, -42], [12, -40], [24, -36], [34, -28],
        [40, -14], [42, 0], [40, 16], [35, 28], [24, 38], [12, 42], [0, 43], [-12, 42], [-24, 38],
        [-35, 28], [-40, 14], [-42, 0]
      ];
      rimTrees.forEach(([rx, rz], i) => {
        if (i % 2 === 0) createOak(rx, rz, 1.3 + (i % 3) * 0.15, i % 3);
        else createPine(rx, rz, 1.25 + (i % 3) * 0.18);
      });

      // Trailside boulders & mossy stones
      createRock(-4.8, -4.5, 1.1, 0.8, 1.2);
      createRock(-5.4, -4.0, 0.7, 0.6, 0.8);
      createRock(5.0, -3.5, 1.2, 0.9, 1.0);
      createRock(7.5, -2.0, 0.9, 0.7, 1.1);
      createRock(8.5, 6.0, 1.0, 0.8, 0.9);
      createRock(-6.5, 5.0, 1.2, 0.9, 1.1);
      createRock(-14.0, 17.0, 1.5, 1.1, 1.3);
      createRock(16.5, -14.0, 1.3, 0.9, 1.1);
      createRock(-17.5, -9.0, 1.4, 1.0, 1.2);

      // Colorful wildflower patches along trail verges
      createFlowerPatch(-3.5, -3.5, 1.8, 14);
      createFlowerPatch(4.2, -4.8, 2.0, 16);
      createFlowerPatch(-4.5, 4.2, 1.8, 14);
      createFlowerPatch(5.5, 4.8, 2.0, 16);
      createFlowerPatch(-14.5, -6.0, 2.6, 22);
      createFlowerPatch(16.5, 4.5, 2.6, 22);
      createFlowerPatch(0.0, -16.0, 2.5, 20);
      createFlowerPatch(0.0, 16.0, 2.5, 20);

      // Scatter 3D grass tufts across meadow parcels and along trail verges
      const tuftCoords = [
        [-2.5, -4.8, 1.0], [2.8, -4.5, 0.9], [-4.2, -1.8, 1.1], [4.5, -1.2, 1.0],
        [-3.8, 3.2, 0.95], [3.9, 3.8, 1.05], [-1.2, 5.2, 1.0], [1.5, -5.8, 0.9],
        [-6.8, -8.5, 1.15], [-9.2, -12.4, 1.2], [-12.5, -14.2, 1.1], [-16.0, -18.5, 1.25],
        [7.2, -8.2, 1.1], [11.5, -12.8, 1.2], [14.8, -15.5, 1.15], [18.2, -19.0, 1.2],
        [8.5, 2.5, 1.05], [12.0, 5.5, 1.15], [15.5, 9.2, 1.2], [19.2, 13.5, 1.25],
        [-7.5, 8.5, 1.1], [-11.2, 12.0, 1.15], [-14.5, 15.8, 1.2], [-18.0, 19.5, 1.25],
        [-2.5, 12.5, 1.1], [2.2, 14.0, 1.15], [-1.8, 18.2, 1.2], [2.5, 21.5, 1.25],
        [-22.5, -3.5, 1.2], [-25.0, 2.8, 1.25], [-20.5, 6.2, 1.1], [-18.2, -5.5, 1.15],
        [22.5, -2.5, 1.2], [25.0, 4.5, 1.25], [21.0, 8.2, 1.1], [18.5, -4.5, 1.15]
      ];
      tuftCoords.forEach(([tx, tz, ts]) => createGrassTuft(tx, tz, ts));

      // Living organic breeze animator: continuous swaying for trees, grass tufts, and flowers
      landmarkAnimators.push((dt) => {
        if (calm() || !breezeOn()) return false;
        const t = performance.now() * 0.001;
        for (let i = 0; i < windTrees.length; i++) {
          const wt = windTrees[i];
          wt.obj.rotation.z = Math.sin(t * wt.speed + wt.phase) * wt.amp;
          wt.obj.rotation.x = Math.cos(t * wt.speed * 0.75 + wt.phase) * (wt.amp * 0.6);
        }
        for (let i = 0; i < windGrassTufts.length; i++) {
          const wg = windGrassTufts[i];
          wg.obj.rotation.z = Math.sin(t * wg.speed + wg.phase) * wg.amp;
        }
        for (let i = 0; i < windFlowers.length; i++) {
          const wf = windFlowers[i];
          wf.obj.rotation.z = Math.sin(t * wf.speed + wf.phase) * wf.amp;
        }
        return true; // Keep breeze motion active at 60fps
      });

      // Directional trail signs on grass verges at all 6 trail exits from Arkansas
      createSignpost(-1.8, -6.6, "Missouri", "↑");
      createSignpost(5.6, -3.2, "Tennessee", "↗");
      createSignpost(5.6, 3.2, "Mississippi", "↘");
      createSignpost(1.8, 6.6, "Louisiana", "↓");
      createSignpost(-5.6, 3.2, "Texas", "↙");
      createSignpost(-5.6, -3.2, "Oklahoma", "↖");
    }

    // ==========================================
    // Ahaan's Zoo (southwest section, outside the train loop; the water park goes northeast)
    // Ahaan picked the animals: tiger, elephant, kangaroo, monkey.
    // ==========================================
    function buildZoo(parent, T) {
      const zoo = new T.Group();
      parent.add(zoo);
      const mat = color => new T.MeshStandardMaterial({ color, roughness: 0.85 });
      const woodMat = mat(0x8a6240);
      const gravelMat = mat(0xd9c7a2);
      const darkMat = mat(0x2b2721);
      const eyeMat = mat(0x1d1a17);
      const plaza = { x: -45, z: 45 };

      function addPart(group, geo, material, x, y, z) {
        const m = new T.Mesh(geo, material);
        m.position.set(x, y, z);
        m.castShadow = true;
        group.add(m);
        return m;
      }
      function pathStrip(x1, z1, x2, z2, width) {
        const len = Math.hypot(x2 - x1, z2 - z1);
        const strip = new T.Mesh(new T.PlaneGeometry(width, len), gravelMat);
        strip.rotation.x = -Math.PI / 2;
        strip.rotation.z = Math.atan2(x2 - x1, z2 - z1);
        strip.position.set((x1 + x2) / 2, 0.03, (z1 + z2) / 2);
        strip.receiveShadow = true;
        zoo.add(strip);
      }
      function makeSign(lines, w, h) {
        const c = document.createElement("canvas");
        c.width = 512; c.height = Math.round(512 * h / w);
        const g = c.getContext("2d");
        g.fillStyle = "#f6eddc"; g.fillRect(0, 0, c.width, c.height);
        g.strokeStyle = "#553726"; g.lineWidth = 12; g.strokeRect(6, 6, c.width - 12, c.height - 12);
        g.fillStyle = "#3b2a1c"; g.textAlign = "center"; g.textBaseline = "middle";
        lines.forEach((line, i) => {
          g.font = `bold ${line.size}px Georgia`;
          g.fillText(line.text, c.width / 2, c.height * (i + 1) / (lines.length + 1));
        });
        const tex = new T.CanvasTexture(c);
        tex.encoding = T.sRGBEncoding;
        return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide }));
      }

      // Gravel path from Texas, through the rim-tree gap, to the gate and plaza.
      pathStrip(-27, 19, -29.5, 33, 1.8);
      pathStrip(-29.5, 33, -38, 38, 1.8);
      pathStrip(-38, 38, plaza.x, plaza.z, 2.2);
      const plazaDisc = new T.Mesh(new T.CircleGeometry(4.2, 28), gravelMat);
      plazaDisc.rotation.x = -Math.PI / 2;
      plazaDisc.position.set(plaza.x, 0.035, plaza.z);
      plazaDisc.receiveShadow = true;
      zoo.add(plazaDisc);

      // Gate arch facing the park.
      const gate = new T.Group();
      gate.position.set(-38, 0, 38);
      gate.rotation.y = Math.PI * 3 / 4;
      [-1.6, 1.6].forEach(x => addPart(gate, new T.CylinderGeometry(0.16, 0.2, 3.4, 8), woodMat, x, 1.7, 0));
      addPart(gate, new T.BoxGeometry(3.8, 0.28, 0.3), woodMat, 0, 3.45, 0);
      const gateSign = makeSign([{ text: "Ahaan's Zoo", size: 74 }], 3.2, 0.8);
      gateSign.position.set(0, 2.95, 0.17);
      gate.add(gateSign);
      const gateSignBack = gateSign.clone();
      gateSignBack.position.z = -0.17;
      gateSignBack.rotation.y = Math.PI;
      gate.add(gateSignBack);
      zoo.add(gate);
      parkObstacles.push({ x: -39.13, z: 36.87, r: 0.3 }, { x: -36.87, z: 39.13, r: 0.3 });

      // --- Animal models (simple, friendly shapes) ---
      function eyes(group, y, z, spread, size) {
        [-spread, spread].forEach(x => addPart(group, new T.SphereGeometry(size, 8, 6), eyeMat, x, y, z));
      }
      function buildTiger() {
        const root = new T.Group();
        const orange = mat(0xe08a3c), cream = mat(0xf6e7cf);
        const body = addPart(root, new T.CapsuleGeometry(0.42, 1.1, 6, 12), orange, 0, 0.75, 0);
        body.rotation.x = Math.PI / 2;
        [-0.3, 0, 0.3].forEach(z => {
          const stripe = addPart(root, new T.TorusGeometry(0.43, 0.045, 6, 16, Math.PI), darkMat, 0, 0.77, z);
          stripe.rotation.y = Math.PI / 2;
        });
        [[-0.25, 0.45], [0.25, 0.45], [-0.25, -0.45], [0.25, -0.45]].forEach(([x, z]) => addPart(root, new T.CylinderGeometry(0.11, 0.12, 0.55, 8), orange, x, 0.28, z));
        const head = new T.Group();
        head.position.set(0, 1.05, 0.85);
        addPart(head, new T.SphereGeometry(0.38, 14, 10), orange, 0, 0, 0);
        addPart(head, new T.SphereGeometry(0.2, 10, 8), cream, 0, -0.08, 0.28);
        addPart(head, new T.SphereGeometry(0.06, 8, 6), darkMat, 0, 0, 0.45);
        [-0.24, 0.24].forEach(x => addPart(head, new T.SphereGeometry(0.11, 8, 6), orange, x, 0.3, 0));
        eyes(head, 0.1, 0.32, 0.13, 0.05);
        root.add(head);
        const tail = new T.Group();
        tail.position.set(0, 0.9, -0.95);
        const tailMesh = addPart(tail, new T.CylinderGeometry(0.05, 0.07, 0.9, 6), orange, 0, 0.3, -0.25);
        tailMesh.rotation.x = -0.7;
        root.add(tail);
        return { root, head, tail, ears: [] };
      }
      function buildElephant() {
        const root = new T.Group();
        const grey = mat(0x9aa0a6);
        const earMat = new T.MeshStandardMaterial({ color: 0xb5b9bd, roughness: 0.85, side: T.DoubleSide });
        const body = addPart(root, new T.SphereGeometry(1, 16, 12), grey, 0, 1.55, 0);
        body.scale.set(0.95, 0.85, 1.25);
        [[-0.5, 0.6], [0.5, 0.6], [-0.5, -0.6], [0.5, -0.6]].forEach(([x, z]) => addPart(root, new T.CylinderGeometry(0.26, 0.28, 1.0, 10), grey, x, 0.5, z));
        const head = new T.Group();
        head.position.set(0, 2.0, 1.2);
        addPart(head, new T.SphereGeometry(0.62, 14, 10), grey, 0, 0, 0);
        const trunk = addPart(head, new T.CylinderGeometry(0.12, 0.2, 1.1, 8), grey, 0, -0.55, 0.55);
        trunk.rotation.x = 0.35;
        eyes(head, 0.15, 0.52, 0.25, 0.06);
        const ears = [-1, 1].map(side => {
          const ear = new T.Group();
          ear.position.set(side * 0.5, 0.05, -0.05);
          const flap = addPart(ear, new T.CircleGeometry(0.55, 14), earMat, side * 0.35, 0, 0);
          flap.rotation.y = side * 0.3;
          head.add(ear);
          return ear;
        });
        root.add(head);
        const tail = new T.Group();
        tail.position.set(0, 1.6, -1.2);
        addPart(tail, new T.CylinderGeometry(0.04, 0.05, 0.6, 6), grey, 0, -0.3, 0);
        root.add(tail);
        return { root, head, tail, ears };
      }
      function buildKangaroo() {
        const root = new T.Group();
        const tan = mat(0xc08a5a), light = mat(0xe8c9a3);
        const body = addPart(root, new T.SphereGeometry(0.55, 14, 10), tan, 0, 1.0, 0);
        body.scale.set(0.9, 1.3, 0.85);
        addPart(root, new T.SphereGeometry(0.3, 10, 8), light, 0, 0.85, 0.32);
        addPart(root, new T.SphereGeometry(0.13, 8, 6), tan, 0, 1.0, 0.55); // joey peeking out
        [-0.3, 0.3].forEach(x => {
          const foot = addPart(root, new T.BoxGeometry(0.18, 0.12, 0.7), tan, x, 0.08, 0.15);
          foot.castShadow = true;
          addPart(root, new T.SphereGeometry(0.26, 10, 8), tan, x, 0.4, -0.05);
          const arm = addPart(root, new T.CylinderGeometry(0.06, 0.06, 0.4, 6), tan, x * 0.8, 1.2, 0.35);
          arm.rotation.x = 0.8;
        });
        const head = new T.Group();
        head.position.set(0, 1.85, 0.1);
        addPart(head, new T.SphereGeometry(0.27, 12, 10), tan, 0, 0, 0);
        const snout = addPart(head, new T.SphereGeometry(0.15, 10, 8), light, 0, -0.06, 0.25);
        snout.scale.z = 1.4;
        [-0.14, 0.14].forEach(x => {
          const ear = addPart(head, new T.ConeGeometry(0.08, 0.32, 8), tan, x, 0.32, -0.05);
          ear.rotation.z = -x;
        });
        eyes(head, 0.06, 0.22, 0.1, 0.04);
        root.add(head);
        const tail = new T.Group();
        tail.position.set(0, 0.6, -0.4);
        const tailMesh = addPart(tail, new T.ConeGeometry(0.16, 1.2, 8), tan, 0, -0.25, -0.45);
        tailMesh.rotation.x = -1.2;
        root.add(tail);
        return { root, head, tail, ears: [], hops: true };
      }
      function buildMonkey() {
        const root = new T.Group();
        const brown = mat(0x7a5236), face = mat(0xe3c2a0);
        // Tree stump seat
        addPart(root, new T.CylinderGeometry(0.55, 0.65, 0.8, 12), woodMat, 0, 0.4, 0);
        const body = addPart(root, new T.SphereGeometry(0.36, 12, 10), brown, 0, 1.15, 0);
        body.scale.y = 1.15;
        [-0.22, 0.22].forEach(x => {
          addPart(root, new T.SphereGeometry(0.13, 8, 6), brown, x, 0.85, 0.3);
          const arm = addPart(root, new T.CylinderGeometry(0.05, 0.05, 0.45, 6), brown, x * 1.4, 1.1, 0.12);
          arm.rotation.z = x > 0 ? -0.5 : 0.5;
        });
        const head = new T.Group();
        head.position.set(0, 1.65, 0.05);
        addPart(head, new T.SphereGeometry(0.27, 12, 10), brown, 0, 0, 0);
        addPart(head, new T.SphereGeometry(0.18, 10, 8), face, 0, -0.04, 0.16);
        [-0.28, 0.28].forEach(x => addPart(head, new T.SphereGeometry(0.1, 8, 6), face, x, 0.02, 0));
        eyes(head, 0.04, 0.3, 0.07, 0.035);
        root.add(head);
        const tail = new T.Group();
        tail.position.set(0, 1.0, -0.3);
        const tailMesh = addPart(tail, new T.TorusGeometry(0.3, 0.04, 6, 14, Math.PI * 1.4), brown, 0, 0.1, -0.25);
        tailMesh.rotation.y = Math.PI / 2;
        root.add(tail);
        return { root, head, tail, ears: [] };
      }

      const ANIMALS = [
        { id: "zoo-tiger", name: "Tiger", emoji: "🐯", x: -45, z: 37, build: buildTiger, ground: 0x9cb070,
          fact: "Tigers love to swim in cool water." },
        { id: "zoo-elephant", name: "Elephant", emoji: "🐘", x: -37, z: 45, build: buildElephant, ground: 0xb7a882,
          fact: "Elephants say hello with their trunks." },
        { id: "zoo-kangaroo", name: "Kangaroo", emoji: "🦘", x: -53, z: 45, build: buildKangaroo, ground: 0xc9b07a,
          fact: "Baby kangaroos ride in their mom's pouch." },
        { id: "zoo-monkey", name: "Monkey", emoji: "🐒", x: -45, z: 53, build: buildMonkey, ground: 0x86a868,
          fact: "Monkeys help their friends stay clean." }
      ];
      const fenceRadius = 3.2;

      ANIMALS.forEach((animal, index) => {
        const pen = new T.Group();
        pen.position.set(animal.x, 0, animal.z);
        zoo.add(pen);
        // The default camera looks from +z, so signs and animals face +z for easy reading.
        const toPlaza = Math.atan2(plaza.x - animal.x, plaza.z - animal.z);
        const facing = 0;

        const floor = new T.Mesh(new T.CircleGeometry(fenceRadius, 28), mat(animal.ground));
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.04;
        floor.receiveShadow = true;
        pen.add(floor);

        // Low wooden fence ring with posts and two rails.
        const postCount = 18;
        for (let i = 0; i < postCount; i++) {
          const a = (i / postCount) * Math.PI * 2;
          addPart(pen, new T.CylinderGeometry(0.07, 0.08, 1.0, 6), woodMat, Math.sin(a) * fenceRadius, 0.5, Math.cos(a) * fenceRadius);
        }
        [0.45, 0.85].forEach(y => {
          const rail = new T.Mesh(new T.TorusGeometry(fenceRadius, 0.04, 6, 48), woodMat);
          rail.rotation.x = Math.PI / 2;
          rail.position.y = y;
          pen.add(rail);
        });
        // Hedge clumps behind the pen.
        for (let i = 0; i < 5; i++) {
          const a = toPlaza + Math.PI + (i - 2) * 0.35;
          const bush = addPart(pen, new T.SphereGeometry(0.55, 10, 8), mat(0x5d8a4e), Math.sin(a) * (fenceRadius + 0.7), 0.45, Math.cos(a) * (fenceRadius + 0.7));
          bush.scale.y = 0.8;
        }

        // Name sign outside the fence, on the plaza side.
        const sign = new T.Group();
        const signAngle = facing + 0.75; // Beside the view line, so the sign does not hide the animal.
        sign.position.set(Math.sin(signAngle) * (fenceRadius + 0.8), 0, Math.cos(signAngle) * (fenceRadius + 0.8));
        sign.rotation.y = facing;
        addPart(sign, new T.CylinderGeometry(0.07, 0.07, 1.6, 6), woodMat, 0, 0.8, 0);
        const board = makeSign([{ text: `${animal.emoji} ${animal.name}`, size: 92 }, { text: animal.fact, size: 34 }], 2.8, 1.2);
        board.position.set(0, 1.75, 0.1);
        board.rotation.x = -0.55; // Tilt back toward the overhead camera.
        sign.add(board);
        pen.add(sign);

        const model = animal.build();
        model.root.rotation.y = facing;
        model.root.position.y = 0.04;
        pen.add(model.root);
        animal.model = model;
        animal.phase = index * 1.7;
        animal.happy = 0;
        parkObstacles.push({ x: animal.x, z: animal.z, r: fenceRadius + 0.2 });
      });

      // Gentle idle motion: slow head turns, tail sways, ear flaps, small hops.
      // The render loop pauses when motion is off, so this stops too.
      landmarkAnimators.push(dt => {
        if (calm()) return false;
        const t = performance.now() * 0.001;
        ANIMALS.forEach(animal => {
          const m = animal.model;
          const p = animal.phase;
          animal.happy = Math.max(0, animal.happy - dt);
          const joy = animal.happy > 0 ? Math.sin(animal.happy * 6) * 0.18 : 0;
          m.head.rotation.y = Math.sin(t * 0.45 + p) * 0.35;
          m.head.rotation.x = joy;
          m.tail.rotation.y = Math.sin(t * 1.3 + p) * 0.4;
          m.ears.forEach((ear, i) => { ear.rotation.y = (i ? -1 : 1) * Math.abs(Math.sin(t * 0.9 + p)) * 0.35; });
          if (m.hops) {
            const hop = Math.max(0, Math.sin(t * 0.8 + p));
            m.root.position.y = 0.04 + Math.pow(hop, 6) * 0.25 + (animal.happy > 0 ? Math.abs(Math.sin(animal.happy * 5)) * 0.15 : 0);
          }
        });
        return true;
      });

      function greet(animal, who) {
        animal.happy = 1.6;
        sayAhaan(`${who === "Vihaan" ? "Vihaan says hi" : "Hi"}, ${animal.name}! ${animal.emoji}`, animal.fact, animal.emoji, "Ahaan's Zoo");
        wake();
      }

      return ANIMALS.map(animal => ({
        id: animal.id,
        name: animal.name,
        x: animal.x,
        z: animal.z,
        approachRadius: fenceRadius + 2.3,
        actionLabel: `Say hi to the ${animal.name.toLowerCase()} ${animal.emoji}`,
        promptText: `Say hi to the ${animal.name.toLowerCase()} ${animal.emoji}`,
        vihaanPromptText: `Enter: say hi to the ${animal.name.toLowerCase()} ${animal.emoji}`,
        onActivate: () => greet(animal, "Ahaan"),
        onVihaan: () => greet(animal, "Vihaan")
      }));
    }

    function buildHeroEnrichments(parent, T) {
      // 1. Floating celebration balloons near picnic lawn (x: -1.8, z: 2.3)
      const balloonColors = [0xf43f5e, 0xfacc15, 0x38bdf8, 0xa855f7];
      const balloonsGroup = new T.Group();
      balloonsGroup.position.set(-1.8, 0.45, 2.3);

      const cordMat = new T.MeshBasicMaterial({ color: 0x94a3b8 });
      balloonColors.forEach((col, i) => {
        const bMesh = new T.Mesh(new T.SphereGeometry(0.24, 16, 12), new T.MeshStandardMaterial({
          color: col,
          roughness: 0.35,
          metalness: 0.05
        }));
        bMesh.scale.set(0.85, 1.15, 0.85);
        const bx = (i % 2 === 0 ? -1 : 1) * 0.16 + (Math.sin(i * 1.5) * 0.08);
        const bz = (i < 2 ? -1 : 1) * 0.14;
        const by = 2.1 + (i * 0.22);
        bMesh.position.set(bx, by, bz);
        bMesh.castShadow = true;
        balloonsGroup.add(bMesh);

        // String down to anchor stone
        const stringGeo = new T.CylinderGeometry(0.006, 0.006, by, 4);
        const stringMesh = new T.Mesh(stringGeo, cordMat);
        stringMesh.position.set(bx * 0.5, by * 0.5, bz * 0.5);
        stringMesh.rotation.z = -bx * 0.12;
        balloonsGroup.add(stringMesh);
      });
      parent.add(balloonsGroup);

      // Animate balloons swaying in breeze
      landmarkAnimators.push((dt) => {
        if (!breezeOn()) return false;
        if (!calm()) {
          const t = performance.now() * 0.0016;
          balloonsGroup.rotation.z = Math.sin(t) * 0.06;
          balloonsGroup.rotation.x = Math.cos(t * 0.8) * 0.05;
        } else {
          balloonsGroup.rotation.set(0, 0, 0);
        }
      });

      // 2. Animated Garden Butterflies
      const butterflyMats = [
        new T.MeshBasicMaterial({ color: 0xf59e0b, side: T.DoubleSide }),
        new T.MeshBasicMaterial({ color: 0xec4899, side: T.DoubleSide }),
        new T.MeshBasicMaterial({ color: 0x06b6d4, side: T.DoubleSide })
      ];

      const butterflies = [
        { cx: 2.2, cz: 1.8, r: 1.1, speed: 1.2, h: 0.95 },
        { cx: -2.4, cz: -1.6, r: 0.9, speed: 1.4, h: 0.85 }
      ];

      butterflies.forEach((bcfg, idx) => {
        const bGroup = new T.Group();
        bGroup.position.set(bcfg.cx, 0.45 + bcfg.h, bcfg.cz);
        const mat = butterflyMats[idx % butterflyMats.length];

        const wingGeo = new T.PlaneGeometry(0.12, 0.09);
        const leftWing = new T.Mesh(wingGeo, mat);
        leftWing.position.x = -0.06;
        const rightWing = new T.Mesh(wingGeo, mat);
        rightWing.position.x = 0.06;

        bGroup.add(leftWing);
        bGroup.add(rightWing);
        parent.add(bGroup);

        landmarkAnimators.push((dt) => {
          if (!breezeOn()) return false;
          if (!calm()) {
            const time = performance.now() * 0.001 * bcfg.speed;
            const flap = Math.sin(time * 24) * 0.85;
            leftWing.rotation.y = flap;
            rightWing.rotation.y = -flap;

            const bx = bcfg.cx + Math.cos(time) * bcfg.r;
            const bz = bcfg.cz + Math.sin(time) * bcfg.r;
            const by = 0.45 + bcfg.h + Math.sin(time * 3.0) * 0.22;
            bGroup.position.set(bx, by, bz);
            bGroup.rotation.y = -time + Math.PI / 2;
          } else {
            bGroup.position.set(bcfg.cx, 0.45 + bcfg.h, bcfg.cz);
          }
        });
      });

      // 3. Floating River Water Lilies
      const lilyMat = new T.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.75 });
      const flowerMat = new T.MeshBasicMaterial({ color: 0xfde047 });
      const petalMat = new T.MeshBasicMaterial({ color: 0xf472b6 });

      const lilies = [
        { x: 5.4, z: -1.2 },
        { x: 4.9, z: 2.8 },
        { x: 10.5, z: 8.5 }
      ];

      lilies.forEach(pos => {
        const pad = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 0.02, 12), lilyMat);
        pad.position.set(pos.x, 0.26, pos.z);
        const bloom = new T.Mesh(new T.SphereGeometry(0.08, 8, 8), petalMat);
        bloom.position.set(0, 0.05, 0);
        pad.add(bloom);
        const center = new T.Mesh(new T.SphereGeometry(0.04, 6, 6), flowerMat);
        center.position.set(0, 0.08, 0);
        pad.add(center);
        parent.add(pad);
      });
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Golden Gateway Arch! ✨", st.fact, st.icon || "📍", st.name);
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Spinning Lone Star! ⭐", st.fact, st.icon || "📍", st.name);
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Country Acoustic Guitar! 🎸", st.fact, st.icon || "📍", st.name);
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Bayou Riverboat Paddle! 🚢", st.fact, st.icon || "📍", st.name);
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(boat, { ...st, onInteract: trigger });
        parent.add(boat);

        landmarkAnimators.push((dt) => {
          wheelGroup.rotation.z += dt * ((breezeOn() ? 1.5 : 0) + paddleBoost * 7.0);
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Prairie Wind Turbine! 💨", st.fact, st.icon || "📍", st.name);
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(turbine, { ...st, onInteract: trigger });
        parent.add(turbine);

        landmarkAnimators.push((dt) => {
          const baseSpd = calm() || !breezeOn() ? 0 : 0.8;
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
          cameraMode = "landmark";
          actionCamTarget.set(st.x, 2.2, st.z);
          actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);
          A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
          if (A.startWave) A.startWave();
          sayAhaan("Gulf Beacon Lighthouse! 🌊", st.fact, st.icon || "📍", st.name);
          wake();
        };

        st.onInteract = trigger;
        registerInteractive(lightGroup, { ...st, onInteract: trigger });
        parent.add(lightGroup);

        landmarkAnimators.push((dt) => {
          const baseSpd = calm() || !breezeOn() ? 0 : 0.6;
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
      c.width = 512; c.height = 256;
      const g = c.getContext("2d");

      // Soft drop shadow
      g.shadowColor = "rgba(18, 38, 60, 0.22)";
      g.shadowBlur = 12;
      g.shadowOffsetY = 6;

      // Ivory parchment card
      g.fillStyle = "rgba(255, 253, 249, 0.98)";
      g.roundRect(8, 8, 496, 240, 32);
      g.fill();

      // Reset shadow for crisp borders
      g.shadowColor = "transparent";

      // Outer gilded gold border
      g.strokeStyle = "#d4af37";
      g.lineWidth = 10;
      g.stroke();

      // Inner subtle hairline
      g.strokeStyle = "rgba(180, 140, 50, 0.45)";
      g.lineWidth = 2;
      g.roundRect(18, 18, 476, 220, 24);
      g.stroke();

      // State icon badge
      g.font = "38px sans-serif";
      g.textAlign = "center";
      g.fillText(st.icon, 256, 56);

      // State Name in rich serif
      g.fillStyle = "#12263f";
      g.font = "bold 52px serif";
      g.fillText(st.name, 256, 126);

      // Capital & Motto
      g.fillStyle = "#4a6884";
      g.font = "600 32px sans-serif";
      g.fillText(st.capital, 256, 178);

      // Subtle decorative star flourish
      g.fillStyle = "#d4af37";
      g.font = "20px sans-serif";
      g.fillText("★  ★  ★", 256, 218);

      const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      const pinMat = new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide });
      const pin = new T.Mesh(new T.PlaneGeometry(3.6, 1.8), pinMat);
      // Tilt pin upward so it faces the elevated camera view directly
      pin.rotation.x = -Math.PI * 0.25;
      pin.position.set(st.x, 2.5, st.z + st.rad * 0.45);

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
    const V = window.AhaanModel.build(T, { shirt: 0xc9363e, collar: 0x92232d });
    const ahaanScale = 0.62; // Bold, prominent hero scale
    A.rig.scale.setScalar(ahaanScale);
    V.rig.scale.setScalar(ahaanScale);
    V.rig.visible = false;
    scene.add(V.rig);
    const playerLabelAhaan = document.getElementById("playerLabelAhaan");
    const playerLabelVihaan = document.getElementById("playerLabelVihaan");
    const togetherBtn = document.getElementById("togetherBtn");
    const vihaanKeys = { up: false, down: false, left: false, right: false };
    let togetherEnabled = false;
    let vihaanAngle = 0;
    let vihaanWalking = false;
    let vihaanWaveTimer = 0;
    let vihaanExiting = false;
    let vihaanExitTimeout = 0;
    let shiftHeld = false;
    function maxPlayerSeparation() {
      const maximumZoom = 1.45;
      const cameraDistance = Math.hypot(28, 22) * maximumZoom;
      const horizontalSpan = 2 * Math.tan(20 * Math.PI / 180) * cameraDistance * Math.min(camera.aspect, 1.25);
      return Math.max(4, horizontalSpan - 7);
    }
    function moveActor(actor, dx, dz) {
      const nextX = actor.rig.position.x + dx;
      const nextZ = actor.rig.position.z + dz;
      if (togetherEnabled && Math.hypot(nextX - (actor === A ? V.rig.position.x : A.rig.position.x), nextZ - (actor === A ? V.rig.position.z : A.rig.position.z)) > maxPlayerSeparation()) return false;
      actor.rig.position.x = nextX;
      actor.rig.position.z = nextZ;
      return true;
    }
    function clampPlayerSeparation() {
      if (!togetherEnabled) return;
      const dx = V.rig.position.x - A.rig.position.x;
      const dz = V.rig.position.z - A.rig.position.z;
      const distance = Math.hypot(dx, dz);
      const limit = maxPlayerSeparation();
      if (distance <= limit || distance === 0) return;
      const scale = limit / distance;
      V.rig.position.x = A.rig.position.x + dx * scale;
      V.rig.position.z = A.rig.position.z + dz * scale;
      V.rig.position.y = groundHeightAt(V.rig.position.x, V.rig.position.z, rigBaseY);
    }
    const vihaanStart = new T.Vector3(1.55, 0, 0.25);
    V.rig.position.set(vihaanStart.x, 0, vihaanStart.z);
    V.rig.rotation.y = vihaanAngle;
    const playerLabelVector = new T.Vector3();
    function updatePlayerLabels() {
      [[A, playerLabelAhaan], [V, playerLabelVihaan]].forEach(([actor, label]) => {
        if (!label || !togetherEnabled) return;
        playerLabelVector.set(actor.rig.position.x, actor.rig.position.y + 3.4, actor.rig.position.z).project(camera);
        const rect = hero.getBoundingClientRect();
        const labelMargin = (label.offsetWidth || 48) * 0.5 + 10;
        const labelX = Math.max(labelMargin, Math.min(rect.width - labelMargin, (playerLabelVector.x * 0.5 + 0.5) * rect.width));
        const labelY = Math.max(42, Math.min(rect.height - 12, (-playerLabelVector.y * 0.5 + 0.5) * rect.height));
        label.style.left = `${labelX}px`;
        label.style.top = `${labelY}px`;
      });
    }
    if (togetherBtn) togetherBtn.addEventListener("click", event => {
      togetherEnabled = !togetherEnabled;
      A.setShirtPalette(
        togetherEnabled ? 0x2b6ea6 : 0x5a1d2d,
        togetherEnabled ? 0x1d4f78 : 0x43121f
      );
      togetherBtn.setAttribute("aria-pressed", String(togetherEnabled));
      togetherBtn.textContent = `Play together: ${togetherEnabled ? "On" : "Off"}`;
      if (event.detail > 0) togetherBtn.blur();
      if (playerLabelAhaan) playerLabelAhaan.hidden = !togetherEnabled;
      if (playerLabelVihaan) playerLabelVihaan.hidden = !togetherEnabled;
      vihaanKeys.up = vihaanKeys.down = vihaanKeys.left = vihaanKeys.right = false;
      if (togetherEnabled) {
        clearTimeout(vihaanExitTimeout);
        vihaanExitTimeout = 0;
        V.rig.visible = true;
        vihaanExiting = false;
        V.rig.position.set(A.rig.position.x + vihaanStart.x, groundLevelY - V.footY * ahaanScale, A.rig.position.z + vihaanStart.z);
        if (!calm() && V.startWave) { V.startWave(); vihaanWaveTimer = 2.8; }
      } else {
        parkEbike();
        parkCar();
        parkChopper();
        vihaanBounceTime = 0;
        vihaanEatingTimer = 0;
        vihaanConeGroup.visible = false;
        V.leftArm.arm.rotation.set(0, 0, V.leftArm.rest);
        V.leftArm.elbow.rotation.set(0, 0, 0);
        if (pickerActor === V) closeIceCreamPicker(false);
        if (!calm() && V.rig.visible && V.startWave) {
          V.startWave(); vihaanWaveTimer = 2; vihaanExiting = true;
          vihaanExitTimeout = setTimeout(() => {
            if (togetherEnabled) return;
            vihaanWaveTimer = 0;
            vihaanExiting = false;
            V.rig.visible = false;
            if (V.stopWave) V.stopWave();
          }, 2100);
        } else {
          if (V.stopWave) V.stopWave();
          vihaanWaveTimer = 0; V.rig.visible = false; vihaanExiting = false;
        }
      }
      updateCameraPosition(1);
      updatePlayerLabels();
      render();
      wake();
    });

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
      if (!isInitial && !calm() && A.startWave) {
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
    const actionKeyBadge = actionPromptBtn && actionPromptBtn.querySelector(".action-key-badge");

    const bikeState = { x: -0.65, z: 6.2, heading: 0, speed: 0, riding: false, boostHeld: false, wheels: [], lean: 0, target: null };
    const bikeKeys = { up: false, down: false, left: false, right: false };
    const bikeRoot = new T.Group();
    const bikeFrameMat = new T.MeshStandardMaterial({ color: 0x7b3440, roughness: 0.72, metalness: 0.12 });
    const bikeMetalMat = new T.MeshStandardMaterial({ color: 0x514b43, roughness: 0.52, metalness: 0.62 });
    const rubberMat = new T.MeshStandardMaterial({ color: 0x282721, roughness: 0.9 });
    const seatMat = new T.MeshStandardMaterial({ color: 0x3d3029, roughness: 0.88 });
    const bikeWheelRadius = 0.78;
    const bikeWheelZ = [-1.12, 1.12];
    function bikeRod(parent, a, b, radius, material) {
      const start = new T.Vector3(a[0], a[1], a[2]);
      const end = new T.Vector3(b[0], b[1], b[2]);
      const direction = end.clone().sub(start);
      const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, direction.length(), 8), material);
      mesh.position.copy(start).add(end).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize());
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }
    bikeWheelZ.forEach(z => {
      const wheel = new T.Group();
      wheel.position.set(0, bikeWheelRadius + 0.04, z);
      wheel.rotation.y = Math.PI / 2;
      wheel.rotation.order = "YXZ";
      wheel.add(new T.Mesh(new T.TorusGeometry(bikeWheelRadius, 0.075, 10, 28), rubberMat));
      wheel.add(new T.Mesh(new T.TorusGeometry(bikeWheelRadius - 0.10, 0.026, 6, 24), bikeMetalMat));
      const hub = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 0.22, 10), bikeMetalMat);
      hub.rotation.z = Math.PI / 2;
      wheel.add(hub);
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        bikeRod(wheel, [0, 0, 0], [Math.sin(angle) * (bikeWheelRadius - 0.13), Math.cos(angle) * (bikeWheelRadius - 0.13), 0], 0.012, bikeMetalMat);
      }
      bikeRoot.add(wheel);
      bikeState.wheels.push(wheel);
    });
    bikeRod(bikeRoot, [0, 0.82, -1.12], [0, 0.92, 0], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 0.92, 0], [0, 1.72, -0.58], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 1.72, -0.58], [0, 0.82, -1.12], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 0.92, 0], [0, 1.62, 0.63], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 2.48, 0.63], [0, 0.82, 1.12], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 0.82, 1.12], [0, 0.92, 0], 0.075, bikeFrameMat);
    bikeRod(bikeRoot, [0, 0.82, -1.12], [0, 0.82, 1.12], 0.035, bikeMetalMat);
    bikeRod(bikeRoot, [0, 1.72, -0.58], [0, 1.92, -0.68], 0.055, bikeMetalMat);
    bikeRoot.add(new T.Mesh(new T.BoxGeometry(0.55, 0.13, 0.24), seatMat));
    bikeRoot.children[bikeRoot.children.length - 1].position.set(0, 1.95, -0.68);
    bikeRod(bikeRoot, [0, 2.48, 0.63], [0, 2.84, 0.78], 0.06, bikeMetalMat);
    const handlebar = new T.Mesh(new T.BoxGeometry(0.86, 0.09, 0.12), bikeMetalMat);
    handlebar.position.set(0, 2.84, 0.78);
    bikeRoot.add(handlebar);
    [-1, 1].forEach(side => {
      const grip = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.22, 10), seatMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(side * 0.48, 2.84, 0.78);
      bikeRoot.add(grip);
    });
    const pedalCrank = bikeRod(bikeRoot, [-0.25, 0.93, 0], [0.25, 0.93, 0], 0.055, bikeMetalMat);
    [-1, 1].forEach(side => {
      const pedal = new T.Mesh(new T.BoxGeometry(0.3, 0.07, 0.12), seatMat);
      pedal.position.set(side * 0.34, 0.93, side * 0.1);
      bikeRoot.add(pedal);
    });
    bikeRoot.position.set(bikeState.x, 0.06, bikeState.z);
    mapGroup.add(bikeRoot);
    registerInteractive(bikeRoot, {
      name: "Ahaan's bike",
      onInteract: () => bikeState.riding ? dismountBike() : mountBike()
    });

    // Reuse Vihaan's red quad at a clear outer parking spot.
    const quadState = { x: 23, z: 20, heading: 0, speed: 0, riding: false, wheels: [], target: null };
    const quadKeys = { up: false, down: false, left: false, right: false };
    const quadRoot = new T.Group();
    const quadRedMat = new T.MeshStandardMaterial({ color: 0xc92f38, roughness: 0.62, metalness: 0.08 });
    const quadDarkMat = new T.MeshStandardMaterial({ color: 0x282721, roughness: 0.88 });
    const quadMetalMat = new T.MeshStandardMaterial({ color: 0x514b43, roughness: 0.52, metalness: 0.62 });
    const quadBody = new T.Mesh(new T.BoxGeometry(1.25, 0.28, 1.7), quadRedMat);
    quadBody.position.set(0, 0.78, 0);
    quadBody.castShadow = true;
    quadRoot.add(quadBody);
    const quadSeat = new T.Mesh(new T.BoxGeometry(0.62, 0.16, 0.62), seatMat);
    quadSeat.position.set(0, 1.02, -0.12);
    quadRoot.add(quadSeat);
    [-1, 1].forEach(side => [-1, 1].forEach(front => {
      const wheel = new T.Group();
      wheel.position.set(side * 0.76, 0.48, front * 0.76);
      wheel.rotation.z = Math.PI / 2;
      const tire = new T.Mesh(new T.CylinderGeometry(0.48, 0.48, 0.3, 12), quadDarkMat);
      tire.castShadow = true;
      wheel.add(tire);
      const hub = new T.Mesh(new T.CylinderGeometry(0.19, 0.19, 0.32, 10), quadMetalMat);
      wheel.add(hub);
      quadRoot.add(wheel);
      quadState.wheels.push(wheel);
    }));
    [-1, 1].forEach(side => {
      const fender = new T.Mesh(new T.BoxGeometry(0.34, 0.12, 0.94), quadRedMat);
      fender.position.set(side * 0.76, 0.99, 0);
      quadRoot.add(fender);
    });
    bikeRod(quadRoot, [-0.38, 1.28, 0.48], [0.38, 1.28, 0.48], 0.055, quadMetalMat);
    quadRoot.position.set(quadState.x, 0.02, quadState.z);
    mapGroup.add(quadRoot);
    registerInteractive(quadRoot, { name: "Vihaan's quad", onInteract: () => { if (togetherEnabled) toggleQuadRide(); } });

    const eBikeParking = { x: -13, z: 7, heading: Math.PI / 2 };
    const eBikeState = { ...eBikeParking, speed: 0, rider: null, wheels: [], target: null };
    const eBikeKeys = { up: false, down: false, left: false, right: false };
    const eBikeRoot = new T.Group();
    const eBikeFrameMat = new T.MeshStandardMaterial({ color: 0x315d63, roughness: 0.62, metalness: 0.22 });
    const eBikeDarkMat = new T.MeshStandardMaterial({ color: 0x272a29, roughness: 0.9 });
    const eBikeBatteryMat = new T.MeshStandardMaterial({ color: 0x456c70, roughness: 0.55, metalness: 0.16 });
    const eBikeWheelRadius = 0.66;
    [-0.94, 0.94].forEach(z => {
      const wheel = new T.Group();
      wheel.position.set(0, eBikeWheelRadius + 0.04, z);
      wheel.rotation.y = Math.PI / 2;
      wheel.rotation.order = "YXZ";
      wheel.add(new T.Mesh(new T.TorusGeometry(eBikeWheelRadius, 0.065, 9, 24), eBikeDarkMat));
      wheel.add(new T.Mesh(new T.TorusGeometry(eBikeWheelRadius - 0.09, 0.025, 6, 20), eBikeFrameMat));
      const hub = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.25, 12), eBikeBatteryMat);
      hub.rotation.z = Math.PI / 2;
      wheel.add(hub);
      eBikeRoot.add(wheel);
      eBikeState.wheels.push(wheel);
    });
    bikeRod(eBikeRoot, [0, 0.78, -0.94], [0, 0.9, -0.08], 0.065, eBikeFrameMat);
    bikeRod(eBikeRoot, [0, 0.9, -0.08], [0, 1.58, -0.48], 0.065, eBikeFrameMat);
    bikeRod(eBikeRoot, [0, 1.58, -0.48], [0, 0.78, -0.94], 0.065, eBikeFrameMat);
    bikeRod(eBikeRoot, [0, 0.9, -0.08], [0, 1.45, 0.50], 0.065, eBikeFrameMat);
    bikeRod(eBikeRoot, [0, 1.45, 0.50], [0, 0.78, 0.94], 0.065, eBikeFrameMat);
    bikeRod(eBikeRoot, [0, 0.78, 0.94], [0, 0.9, -0.08], 0.065, eBikeFrameMat);
    const eBikeBattery = new T.Mesh(new T.BoxGeometry(0.34, 0.62, 0.50), eBikeBatteryMat);
    eBikeBattery.position.set(0, 1.22, 0.12);
    eBikeBattery.castShadow = true;
    eBikeRoot.add(eBikeBattery);
    const eBikeSeat = new T.Mesh(new T.BoxGeometry(0.42, 0.12, 0.48), seatMat);
    eBikeSeat.position.set(0, 1.65, -0.52);
    eBikeRoot.add(eBikeSeat);
    bikeRod(eBikeRoot, [0, 1.48, 0.50], [0, 2.25, 0.63], 0.055, eBikeFrameMat);
    const eBikeHandlebar = new T.Mesh(new T.BoxGeometry(0.78, 0.08, 0.11), bikeMetalMat);
    eBikeHandlebar.position.set(0, 2.25, 0.63);
    eBikeRoot.add(eBikeHandlebar);
    const eBikeLight = new T.Mesh(new T.SphereGeometry(0.13, 10, 8), new T.MeshStandardMaterial({ color: 0xf5e8bb, emissive: 0x6d5c30, emissiveIntensity: 0.2 }));
    eBikeLight.position.set(0, 2.03, 0.68);
    eBikeRoot.add(eBikeLight);
    eBikeRoot.position.set(eBikeState.x, 0.06, eBikeState.z);
    eBikeRoot.rotation.y = eBikeState.heading;
    mapGroup.add(eBikeRoot);
    registerInteractive(eBikeRoot, {
      name: "E-bike",
      onInteract: () => {
        const rider = togetherEnabled && Math.hypot(V.rig.position.x - eBikeState.x, V.rig.position.z - eBikeState.z) < Math.hypot(A.rig.position.x - eBikeState.x, A.rig.position.z - eBikeState.z) ? V : A;
        mountEbike(rider);
      }
    });

    const carParking = { x: -20, z: -14, heading: 0 };
    const carState = { ...carParking, speed: 0, driver: null, passenger: null, wheels: [], target: null };
    const carKeys = { up: false, down: false, left: false, right: false };
    const carRoot = new T.Group();
    const carBodyMat = new T.MeshStandardMaterial({ color: 0xc57a45, roughness: 0.58, metalness: 0.18 });
    const carTrimMat = new T.MeshStandardMaterial({ color: 0x343637, roughness: 0.82 });
    const carGlassMat = new T.MeshStandardMaterial({ color: 0x8fb5bd, roughness: 0.28, metalness: 0.08, transparent: true, opacity: 0.62 });
    const carSeatMat = new T.MeshStandardMaterial({ color: 0x51463c, roughness: 0.9 });
    const carBody = new T.Mesh(new T.BoxGeometry(1.76, 0.62, 3.25), carBodyMat);
    carBody.position.set(0, 0.72, 0);
    carBody.castShadow = true;
    carRoot.add(carBody);
    const carHood = new T.Mesh(new T.BoxGeometry(1.58, 0.34, 0.9), carBodyMat);
    carHood.position.set(0, 1.12, 1.02);
    carHood.castShadow = true;
    carRoot.add(carHood);
    const carRearDeck = new T.Mesh(new T.BoxGeometry(1.56, 0.28, 0.62), carBodyMat);
    carRearDeck.position.set(0, 1.05, -1.15);
    carRoot.add(carRearDeck);
    const carRoof = new T.Mesh(new T.BoxGeometry(1.48, 0.13, 1.45), carBodyMat);
    carRoof.position.set(0, 2.0, -0.1);
    carRoot.add(carRoof);
    [-0.68, 0.68].forEach(side => {
      bikeRod(carRoot, [side, 1.0, 0.72], [side * 0.82, 1.95, 0.55], 0.055, carBodyMat);
      bikeRod(carRoot, [side, 1.0, -0.83], [side * 0.82, 1.95, -0.72], 0.055, carBodyMat);
      const window = new T.Mesh(new T.BoxGeometry(0.035, 0.72, 1.18), carGlassMat);
      window.position.set(side * 0.72, 1.52, -0.08);
      carRoot.add(window);
    });
    const carWindshield = new T.Mesh(new T.BoxGeometry(1.28, 0.65, 0.05), carGlassMat);
    carWindshield.position.set(0, 1.55, 0.65);
    carWindshield.rotation.x = -0.18;
    carRoot.add(carWindshield);
    [-0.43, 0.43].forEach(side => {
      const seat = new T.Mesh(new T.BoxGeometry(0.58, 0.62, 0.58), carSeatMat);
      seat.position.set(side, 1.18, -0.05);
      carRoot.add(seat);
      const headrest = new T.Mesh(new T.BoxGeometry(0.4, 0.26, 0.16), carSeatMat);
      headrest.position.set(side, 1.58, -0.32);
      carRoot.add(headrest);
    });
    const carSteeringWheel = new T.Mesh(new T.TorusGeometry(0.22, 0.035, 8, 18), carTrimMat);
    carSteeringWheel.position.set(-0.43, 1.67, 0.58);
    carSteeringWheel.rotation.x = Math.PI / 2;
    carRoot.add(carSteeringWheel);
    [-1, 1].forEach(side => [-1, 1].forEach(front => {
      const wheel = new T.Group();
      wheel.position.set(side * 0.91, 0.48, front * 1.08);
      wheel.rotation.z = Math.PI / 2;
      const tire = new T.Mesh(new T.CylinderGeometry(0.36, 0.36, 0.22, 12), carTrimMat);
      tire.castShadow = true;
      wheel.add(tire);
      const hub = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 0.24, 10), bikeMetalMat);
      wheel.add(hub);
      carRoot.add(wheel);
      carState.wheels.push(wheel);
    }));
    [-0.56, 0.56].forEach(side => {
      const lamp = new T.Mesh(new T.BoxGeometry(0.32, 0.18, 0.08), new T.MeshStandardMaterial({ color: 0xf3e6bb, emissive: 0x554522, emissiveIntensity: 0.18 }));
      lamp.position.set(side, 1.0, 1.64);
      carRoot.add(lamp);
    });
    carRoot.position.set(carState.x, 0.06, carState.z);
    mapGroup.add(carRoot);
    registerInteractive(carRoot, {
      name: "Two-seat car",
      onInteract: () => {
        const actor = togetherEnabled && Math.hypot(V.rig.position.x - carState.x, V.rig.position.z - carState.z) < Math.hypot(A.rig.position.x - carState.x, A.rig.position.z - carState.z) ? V : A;
        mountCar(actor);
      }
    });

    const trainRoute = new T.CatmullRomCurve3([
      [5, -17], [11, -25], [24, -31], [34, -22], [36, -5],
      [34, 12], [27, 20], [20, 16], [18, 9], [22, 17],
      [29, 25], [20, 32], [10, 36], [-8, 36], [-24, 30],
      [-34, 17], [-36, 2], [-34, -14], [-25, -29], [-10, -36], [2, -35]
    ].map(([x, z]) => new T.Vector3(x, 0.48, z)), true, "centripetal", 0.5);
    const trainRouteLength = trainRoute.getLength();
    const trainStationSpecs = [
      { name: "Ice Cream Stop", x: 5, z: -17 },
      { name: "Bridge Stop", x: 18, z: 9 },
      { name: "South Grove", x: 10, z: 36 },
      { name: "West Grove", x: -36, z: 2 }
    ];
    const trainStationProgress = (x, z) => {
      let closest = { progress: 0, distance: Infinity };
      for (let i = 0; i <= 800; i++) {
        const progress = i / 800;
        const point = trainRoute.getPointAt(progress);
        const distance = Math.hypot(point.x - x, point.z - z);
        if (distance < closest.distance) closest = { progress, distance };
      }
      return closest.progress;
    };
    const trainStations = trainStationSpecs.map(station => ({
      ...station,
      progress: trainStationProgress(station.x, station.z)
    })).sort((a, b) => a.progress - b.progress);
    const trainState = { progress: trainStations[0].progress, speed: 0, currentStation: 0, nextStation: 1, dwell: 8, ahaan: false, vihaan: false, dinoSounds: 0 };
    const trainTrackGroup = new T.Group();
    const trainRailMat = new T.MeshStandardMaterial({ color: 0x514b43, roughness: 0.55, metalness: 0.56 });
    const sleeperGeometry = new T.BoxGeometry(1.55, 0.13, 0.32);
    const sleepers = new T.InstancedMesh(sleeperGeometry, new T.MeshStandardMaterial({ color: 0x765333, roughness: 0.88 }), 320);
    const sleeperPose = new T.Object3D();
    for (let i = 0; i < sleepers.count; i++) {
      const progress = i / sleepers.count;
      const point = trainRoute.getPointAt(progress);
      const tangent = trainRoute.getTangentAt(progress);
      sleeperPose.position.set(point.x, 0.34, point.z);
      sleeperPose.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
      sleeperPose.updateMatrix();
      sleepers.setMatrixAt(i, sleeperPose.matrix);
    }
    sleepers.castShadow = true;
    sleepers.receiveShadow = true;
    trainTrackGroup.add(sleepers);
    [-0.65, 0.65].forEach(offset => {
      const railPoints = [];
      for (let i = 0; i < 320; i++) {
        const progress = i / 320;
        const point = trainRoute.getPointAt(progress);
        const tangent = trainRoute.getTangentAt(progress);
        railPoints.push(new T.Vector3(point.x + tangent.z * offset, 0.49, point.z - tangent.x * offset));
      }
      const railCurve = new T.CatmullRomCurve3(railPoints, true, "centripetal", 0.5);
      const rail = new T.Mesh(new T.TubeGeometry(railCurve, 360, 0.075, 6, true), trainRailMat);
      rail.castShadow = true;
      trainTrackGroup.add(rail);
    });
    const trestleMat = new T.MeshStandardMaterial({ color: 0x765333, roughness: 0.85 });
    for (let z = 33; z <= 38; z += 1.6) {
      const riverX = Math.sin(z * 0.08) * 3 + Math.cos(z * 0.05) * 1.5 + 11.2;
      const pier = new T.Mesh(new T.BoxGeometry(0.34, 0.52, 0.34), trestleMat);
      pier.position.set(riverX, 0.05, z);
      pier.castShadow = true;
      trainTrackGroup.add(pier);
    }
    mapGroup.add(trainTrackGroup);

    const trainStationsGroup = new T.Group();
    const stationPlatformMat = new T.MeshStandardMaterial({ color: 0xcdbd9e, roughness: 0.92 });
    const stationPostMat = new T.MeshStandardMaterial({ color: 0x765333, roughness: 0.88 });
    trainStations.forEach(station => {
      const point = trainRoute.getPointAt(station.progress);
      const tangent = trainRoute.getTangentAt(station.progress);
      const heading = Math.atan2(tangent.x, tangent.z);
      const sideX = Math.cos(heading), sideZ = -Math.sin(heading);
      const platform = new T.Group();
      platform.position.set(point.x + sideX * 2.05, 0, point.z + sideZ * 2.05);
      platform.rotation.y = heading;
      const deck = new T.Mesh(new T.BoxGeometry(2.45, 0.28, 5.4), stationPlatformMat);
      deck.position.y = 0.2;
      deck.receiveShadow = true;
      platform.add(deck);
      [-0.88, 0.88].forEach(x => {
        const post = new T.Mesh(new T.BoxGeometry(0.12, 1.5, 0.12), stationPostMat);
        post.position.set(x, 0.94, -1.95);
        platform.add(post);
      });
      const signCanvas = document.createElement("canvas");
      signCanvas.width = 320;
      signCanvas.height = 96;
      const signContext = signCanvas.getContext("2d");
      signContext.fillStyle = "#f6eddc";
      signContext.fillRect(0, 0, signCanvas.width, signCanvas.height);
      signContext.fillStyle = "#553726";
      signContext.font = "bold 30px Georgia";
      signContext.textAlign = "center";
      signContext.textBaseline = "middle";
      signContext.fillText(station.name, signCanvas.width / 2, signCanvas.height / 2, 300);
      const signTexture = new T.CanvasTexture(signCanvas);
      signTexture.encoding = T.sRGBEncoding;
      const sign = new T.Mesh(new T.PlaneGeometry(2.1, 0.64), new T.MeshBasicMaterial({ map: signTexture, side: T.DoubleSide }));
      sign.position.set(0, 1.45, -1.95);
      sign.rotation.y = Math.PI / 2;
      platform.add(sign);
      trainStationsGroup.add(platform);
    });
    mapGroup.add(trainStationsGroup);

    const trainRoot = new T.Group();
    const trainBodyMats = [
      new T.MeshStandardMaterial({ color: 0x287fc0, roughness: 0.62 }),
      new T.MeshStandardMaterial({ color: 0xc27746, roughness: 0.68 })
    ];
    const trainRoofMat = new T.MeshStandardMaterial({ color: 0x315b79, roughness: 0.78 });
    const trainWindowMat = new T.MeshStandardMaterial({ color: 0xa9d2d8, roughness: 0.3, metalness: 0.08 });
    const trainWheelMat = new T.MeshStandardMaterial({ color: 0x343535, roughness: 0.82 });
    const trainSmokePuffs = [];
    let trainSmokeTime = 0;
    function makeTrainCarriage(engine = false) {
      const carriage = new T.Group();
      const body = new T.Mesh(new T.BoxGeometry(engine ? 1.28 : 1.48, 0.86, engine ? 2.0 : 3.2), trainBodyMats[engine ? 0 : 1]);
      body.position.y = 0.78;
      body.castShadow = true;
      carriage.add(body);
      const roof = new T.Mesh(new T.BoxGeometry(engine ? 1.34 : 1.56, 0.18, engine ? 1.75 : 2.9), trainRoofMat);
      roof.position.set(0, 1.28, engine ? -0.1 : 0);
      carriage.add(roof);
      if (engine) {
        const chimney = new T.Mesh(new T.CylinderGeometry(0.16, 0.2, 0.58, 8), trainRoofMat);
        chimney.position.set(0, 1.62, 0.48);
        carriage.add(chimney);
        const dinoHead = new T.Mesh(new T.SphereGeometry(0.44, 14, 11), trainBodyMats[0]);
        dinoHead.scale.set(1.25, 1.05, 1.35);
        dinoHead.position.set(0, 1.52, 1.03);
        dinoHead.castShadow = true;
        carriage.add(dinoHead);
        const dinoSnout = new T.Mesh(new T.SphereGeometry(0.3, 12, 9), new T.MeshStandardMaterial({ color: 0x58a8d6, roughness: 0.68 }));
        dinoSnout.scale.set(0.95, 0.62, 1.28);
        dinoSnout.position.set(0, 1.43, 1.4);
        carriage.add(dinoSnout);
        const dinoEyeWhite = new T.MeshStandardMaterial({ color: 0xfff8e8, roughness: 0.6 });
        const dinoPupilMat = new T.MeshStandardMaterial({ color: 0x263442, roughness: 0.5 });
        [-1, 1].forEach(side => {
          const eye = new T.Mesh(new T.SphereGeometry(0.115, 10, 8), dinoEyeWhite);
          eye.position.set(side * 0.31, 1.84, 1.12);
          carriage.add(eye);
          const pupil = new T.Mesh(new T.SphereGeometry(0.055, 8, 6), dinoPupilMat);
          pupil.position.set(side * 0.33, 1.89, 1.19);
          carriage.add(pupil);
        });
        const dinoSpikeMat = new T.MeshStandardMaterial({ color: 0x73b5df, roughness: 0.72 });
        [0.36, 0.62, 0.88].forEach((z, index) => {
          const spike = new T.Mesh(new T.ConeGeometry(0.14, 0.3, 5), dinoSpikeMat);
          spike.position.set(0, 1.7, z);
          spike.rotation.x = -0.32;
          carriage.add(spike);
        });
        for (let i = 0; i < 3; i++) {
          const puffMat = new T.MeshBasicMaterial({ color: 0xd8d9d5, transparent: true, opacity: 0, depthWrite: false, fog: true });
          const puff = new T.Mesh(new T.SphereGeometry(0.36, 8, 6), puffMat);
          puff.visible = false;
          carriage.add(puff);
          trainSmokePuffs.push({ mesh: puff, material: puffMat, offset: i / 3 });
        }
        const cowcatcher = new T.Mesh(new T.BoxGeometry(1.3, 0.16, 0.32), trainRoofMat);
        cowcatcher.position.set(0, 0.36, 1.05);
        carriage.add(cowcatcher);
      }
      [-1, 1].forEach(side => [-1, 1].forEach(end => {
        const wheel = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.16, 10), trainWheelMat);
        wheel.position.set(side * 0.72, 0.28, end * (engine ? 0.65 : 1.15));
        wheel.rotation.z = Math.PI / 2;
        carriage.add(wheel);
      }));
      [-1, 1].forEach(side => {
        const window = new T.Mesh(new T.BoxGeometry(0.04, 0.38, engine ? 0.42 : 0.48), trainWindowMat);
        window.position.set(side * (engine ? 0.65 : 0.75), 0.94, engine ? -0.2 : 0);
        carriage.add(window);
      });
      trainRoot.add(carriage);
      return carriage;
    }
    const trainCars = [makeTrainCarriage(true), makeTrainCarriage(), makeTrainCarriage()];
    mapGroup.add(trainRoot);
    function setTrainRider(actor, seated) {
      actor.leftArm.arm.rotation.set(seated ? -0.7 : 0, 0, seated ? 0.12 : actor.leftArm.rest);
      actor.wavingArm.arm.rotation.set(seated ? -0.7 : 0, 0, seated ? -0.12 : actor.wavingArm.rest);
      actor.leftArm.elbow.rotation.set(seated ? 0.45 : 0, 0, 0);
      actor.wavingArm.elbow.rotation.set(seated ? 0.45 : 0, 0, 0);
      actor.leftLeg.hip.rotation.set(seated ? -1.45 : 0, 0, 0);
      actor.rightLeg.hip.rotation.set(seated ? -1.45 : 0, 0, 0);
      actor.leftLeg.knee.rotation.set(seated ? 1.65 : 0, 0, 0);
      actor.rightLeg.knee.rotation.set(seated ? 1.65 : 0, 0, 0);
    }
    function positionTrainRider(actor, coachIndex) {
      const coach = trainCars[coachIndex];
      const heading = coach.rotation.y;
      const seatX = coach.position.x - Math.sin(heading) * 0.12;
      const seatZ = coach.position.z - Math.cos(heading) * 0.12;
      actor.rig.position.set(seatX, 0.52, seatZ);
      actor.rig.rotation.set(0, heading + Math.PI, 0);
    }
    function boardTrain(actor) {
      if (!actor || trainState.dwell <= 0 || (actor === V && !togetherEnabled)) return false;
      const station = trainStations[trainState.currentStation];
      if (Math.hypot(actor.rig.position.x - station.x, actor.rig.position.z - station.z) > 4.8) return false;
      if (actor === A && (bikeState.riding || eBikeState.rider === A || carState.driver === A || carState.passenger === A || chopperState.rider === A || currentActivity)) return false;
      if (actor === V && (eBikeState.rider === V || carState.driver === V || carState.passenger === V || chopperState.rider === V || quadState.riding || currentActivity)) return false;
      trainState[actor === A ? "ahaan" : "vihaan"] = true;
      setTrainRider(actor, true);
      targetPos = null;
      if (actor === A) currentNearbyItem = { id: "trainRide" };
      else vihaanNearbyItem = { id: "trainRide" };
      wake();
      return true;
    }
    function dismountTrain(actor) {
      const key = actor === A ? "ahaan" : "vihaan";
      if (!trainState[key] || trainState.dwell <= 0) return false;
      trainState[key] = false;
      const station = trainStations[trainState.currentStation];
      const actorX = station.x + 2.5;
      const actorZ = station.z;
      actor.rig.position.set(actorX, groundHeightAt(actorX, actorZ, rigBaseY), actorZ);
      actor.rig.rotation.set(0, 0, 0);
      setTrainRider(actor, false);
      if (actor === A) currentNearbyItem = null;
      else vihaanNearbyItem = null;
      wake();
      return true;
    }
    function updateParkTrain(dt) {
      if (!breezeOn()) { trainSmokePuffs.forEach(puff => { puff.mesh.visible = false; }); return false; }
      if (trainState.dwell > 0) trainState.dwell = Math.max(0, trainState.dwell - dt);
      else {
        const station = trainStations[trainState.nextStation];
        const distance = ((station.progress - trainState.progress + 1) % 1) * trainRouteLength;
        const wantedSpeed = Math.min(3.8, Math.sqrt(1.5 * Math.max(0, distance - 0.7)));
        trainState.speed += Math.max(-0.75 * dt, Math.min(0.75 * dt, wantedSpeed - trainState.speed));
        trainState.progress = (trainState.progress + trainState.speed * dt / trainRouteLength) % 1;
        const remaining = ((station.progress - trainState.progress + 1) % 1) * trainRouteLength;
        if (remaining < 1.1 && trainState.speed < 0.12) {
          trainState.progress = station.progress;
          trainState.speed = 0;
          trainState.currentStation = trainState.nextStation;
          trainState.nextStation = (trainState.nextStation + 1) % trainStations.length;
          trainState.dwell = 4.5;
          if (soundOn) { trainState.dinoSounds++; playSound("dino"); }
        }
      }
      trainCars.forEach((carriage, index) => {
        const progress = (trainState.progress - index * 4.2 / trainRouteLength + 1) % 1;
        const point = trainRoute.getPointAt(progress);
        const tangent = trainRoute.getTangentAt(progress);
        carriage.position.set(point.x, 0, point.z);
        carriage.rotation.y = Math.atan2(tangent.x, tangent.z);
      });
      if (trainState.ahaan) positionTrainRider(A, 1);
      if (trainState.vihaan) positionTrainRider(V, 2);
      trainSmokeTime += dt * Math.max(0.45, trainState.speed);
      trainSmokePuffs.forEach(puff => {
        const phase = (trainSmokeTime * 0.72 + puff.offset) % 1;
        const moving = trainState.speed > 0.12;
        puff.mesh.visible = moving;
        puff.mesh.position.set(0, 1.85 + phase * 1.15, 0.48 - phase * 1.35);
        puff.mesh.scale.setScalar(0.7 + phase * 1.1);
        puff.material.opacity = moving ? 0.68 * (1 - phase) : 0;
      });
      return true;
    }
    updateParkTrain(0);
    const chopperParking = { x: 23, z: -20, heading: 0 };
    const chopperSafeAltitude = 10.5;
    const chopperState = { ...chopperParking, altitude: 0, speed: 0, rider: null, riderScale: null, rotorSpeed: 0, target: null };
    const chopperKeys = { up: false, down: false, left: false, right: false, lift: false, descend: false };
    const chopperRoot = new T.Group();
    const chopperBodyMat = new T.MeshStandardMaterial({ color: 0x287ab5, roughness: 0.58, metalness: 0.08 });
    const chopperTrimMat = new T.MeshStandardMaterial({ color: 0x273b4a, roughness: 0.68 });
    const chopperGlassMat = new T.MeshStandardMaterial({ color: 0xa8d6e8, roughness: 0.2, metalness: 0.04, transparent: true, opacity: 0.58 });
    const chopperBody = new T.Mesh(new T.SphereGeometry(0.72, 14, 10), chopperBodyMat);
    chopperBody.scale.set(0.9, 0.76, 1.55);
    chopperBody.position.y = 1.05;
    chopperBody.castShadow = true;
    chopperRoot.add(chopperBody);
    const chopperCabin = new T.Mesh(new T.SphereGeometry(0.52, 14, 10), chopperGlassMat);
    chopperCabin.scale.set(0.9, 0.8, 0.85);
    chopperCabin.position.set(0, 1.42, 0.35);
    chopperRoot.add(chopperCabin);
    [-1, 1].forEach(side => {
      const sideWindow = new T.Mesh(new T.BoxGeometry(0.035, 0.43, 0.62), chopperGlassMat);
      sideWindow.position.set(side * 0.48, 1.35, 0.43);
      sideWindow.rotation.x = -0.08;
      chopperRoot.add(sideWindow);
    });
    const chopperTail = new T.Mesh(new T.CylinderGeometry(0.1, 0.2, 2.35, 8), chopperBodyMat);
    chopperTail.rotation.x = Math.PI / 2;
    chopperTail.position.set(0, 1.12, -1.8);
    chopperRoot.add(chopperTail);
    const tailFin = new T.Mesh(new T.BoxGeometry(0.12, 0.68, 0.52), chopperBodyMat);
    tailFin.position.set(0, 1.48, -2.75);
    tailFin.castShadow = true;
    chopperRoot.add(tailFin);
    const tailPlane = new T.Mesh(new T.BoxGeometry(0.78, 0.12, 0.38), chopperBodyMat);
    tailPlane.position.set(0, 1.18, -2.55);
    chopperRoot.add(tailPlane);
    const rotorMast = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 0.62, 10), chopperTrimMat);
    rotorMast.position.y = 2.12;
    chopperRoot.add(rotorMast);
    const chopperRotor = new T.Group();
    chopperRotor.position.set(0, 2.42, 0);
    chopperRoot.add(chopperRotor);
    const rotorHub = new T.Mesh(new T.SphereGeometry(0.18, 10, 8), chopperTrimMat);
    rotorHub.position.y = 0.04;
    chopperRotor.add(rotorHub);
    [-1, 1].forEach(side => {
      const blade = new T.Mesh(new T.BoxGeometry(0.18, 0.045, 3.15), chopperTrimMat);
      blade.position.z = side * 1.58;
      blade.castShadow = true;
      chopperRotor.add(blade);
    });
    const tailRotor = new T.Group();
    tailRotor.position.set(0, 1.18, -2.93);
    chopperRoot.add(tailRotor);
    [-1, 1].forEach(side => {
      const blade = new T.Mesh(new T.BoxGeometry(0.08, 0.92, 0.12), chopperTrimMat);
      blade.position.y = side * 0.46;
      tailRotor.add(blade);
    });
    [-1, 1].forEach(side => {
      const skid = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 2.05, 8), chopperTrimMat);
      skid.rotation.x = Math.PI / 2;
      skid.position.set(side * 0.58, 0.34, 0.05);
      chopperRoot.add(skid);
      bikeRod(chopperRoot, [side * 0.48, 0.58, 0.65], [side * 0.58, 0.35, 0.75], 0.045, chopperTrimMat);
      bikeRod(chopperRoot, [side * 0.48, 0.58, -0.65], [side * 0.58, 0.35, -0.72], 0.045, chopperTrimMat);
    });
    chopperRoot.position.set(chopperState.x, bikeSurfaceHeightAt(chopperState.x, chopperState.z), chopperState.z);
    mapGroup.add(chopperRoot);
    registerInteractive(chopperRoot, {
      name: "Chopper",
      onInteract: () => {
        const actor = togetherEnabled && Math.hypot(V.rig.position.x - chopperState.x, V.rig.position.z - chopperState.z) < Math.hypot(A.rig.position.x - chopperState.x, A.rig.position.z - chopperState.z) ? V : A;
        mountChopper(actor);
      }
    });

    const shopState = { x: 4.2, z: -13.5 };
    const shopRoot = new T.Group();
    shopRoot.position.set(shopState.x, 0, shopState.z);
    const woodMat = new T.MeshStandardMaterial({ color: 0x79533a, roughness: 0.9 });
    const creamMat = new T.MeshStandardMaterial({ color: 0xf6eddc, roughness: 0.92 });
    const berryMat = new T.MeshStandardMaterial({ color: 0xb54e58, roughness: 0.85 });
    const shopSignCanvas = document.createElement("canvas");
    shopSignCanvas.width = 512; shopSignCanvas.height = 128;
    const shopSignCtx = shopSignCanvas.getContext("2d");
    shopSignCtx.fillStyle = "#f6eddc"; shopSignCtx.fillRect(0, 0, 512, 128);
    shopSignCtx.fillStyle = "#553726"; shopSignCtx.font = "bold 58px Georgia"; shopSignCtx.textAlign = "center";
    shopSignCtx.fillText("Ice Cream", 256, 84);
    const shopSignTex = new T.CanvasTexture(shopSignCanvas);
    shopSignTex.encoding = T.sRGBEncoding;
    const shopPanel = (w, h, d, x, y, z, material) => {
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
      shopRoot.add(mesh); return mesh;
    };
    shopPanel(3.5, 1.35, 0.22, 0, 1.05, -0.15, creamMat);
    shopPanel(3.9, 0.22, 2.05, 0, 2.05, -0.05, woodMat);
    [-1.72, 1.72].forEach(x => shopPanel(0.16, 2.15, 0.16, x, 1.1, 0.42, woodMat));
    shopPanel(4.35, 0.12, 1.05, 0, 2.35, 0.35, creamMat);
    for (let i = 0; i < 8; i++) {
      const stripe = new T.Mesh(new T.BoxGeometry(0.55, 0.10, 1.08), i % 2 ? berryMat : creamMat);
      stripe.position.set(-1.92 + i * 0.55, 2.36, 0.37); shopRoot.add(stripe);
    }
    [-1.55, 1.55].forEach(x => shopPanel(0.13, 2.25, 0.13, x, 3.55, 0.48, woodMat));
    shopPanel(4.0, 0.58, 0.72, 0, 1.18, 1.02, woodMat);
    const signPlane = new T.Mesh(new T.PlaneGeometry(3.0, 0.82), new T.MeshBasicMaterial({ map: shopSignTex }));
    signPlane.position.set(0, 4.72, 0.54); shopRoot.add(signPlane);
    const menuCanvas = document.createElement("canvas");
    menuCanvas.width = 384; menuCanvas.height = 256;
    const menuCtx = menuCanvas.getContext("2d");
    menuCtx.fillStyle = "#fcf8ef"; menuCtx.fillRect(0, 0, 384, 256);
    menuCtx.fillStyle = "#372b23"; menuCtx.font = "bold 30px Georgia"; menuCtx.fillText("Flavours", 22, 42);
    [["Vanilla", "#f2e5bd"], ["Chocolate", "#70452e"], ["Strawberry", "#dc7690"], ["Mango", "#f0ad38"]].forEach(([name, color], i) => {
      const y = 88 + i * 40;
      menuCtx.fillStyle = color; menuCtx.beginPath(); menuCtx.arc(32, y - 8, 11, 0, Math.PI * 2); menuCtx.fill();
      menuCtx.fillStyle = "#372b23"; menuCtx.font = "24px Georgia"; menuCtx.fillText(name, 56, y);
    });
    const menuTex = new T.CanvasTexture(menuCanvas); menuTex.encoding = T.sRGBEncoding;
    const menuBoard = new T.Mesh(new T.PlaneGeometry(1.8, 1.2), new T.MeshBasicMaterial({ map: menuTex }));
    menuBoard.position.set(1.1, 2.05, 0.49); shopRoot.add(menuBoard);
    mapGroup.add(shopRoot);
    parkObstacles.push({ x: shopState.x, z: shopState.z, r: 2.35 }, { x: 8.2, z: 0.8, r: 1.75 }, { x: 7, z: 0.8, r: 1.55 });
    registerInteractive(shopRoot, { name: "Ice Cream", onInteract: () => openIceCreamPicker() });

    const coneGroup = new T.Group();
    const coneMat = new T.MeshStandardMaterial({ color: 0xc78a4b, roughness: 0.93 });
    const cone = new T.Mesh(new T.ConeGeometry(0.28, 0.66, 12), coneMat);
    cone.rotation.x = Math.PI; cone.position.y = -0.33; coneGroup.add(cone);
    const scoopMeshes = [];
    for (let i = 0; i < 3; i++) {
      const scoop = new T.Mesh(new T.SphereGeometry(0.24, 12, 10), new T.MeshStandardMaterial({ color: 0xf2e5bd, roughness: 0.95 }));
      scoop.position.set((i - 1) * 0.13, 0.02 + (i === 1 ? 0.08 : 0), 0.02);
      coneGroup.add(scoop); scoopMeshes.push(scoop);
    }
    coneGroup.position.set(0.82, -2.35, 1.0);
    coneGroup.visible = false;
    A.rig.add(coneGroup);
    const vihaanConeGroup = coneGroup.clone(true);
    vihaanConeGroup.position.copy(coneGroup.position);
    vihaanConeGroup.children.forEach(child => { if (child.material) child.material = child.material.clone(); });
    V.rig.add(vihaanConeGroup);
    vihaanConeGroup.visible = false;
    const vihaanScoopMeshes = vihaanConeGroup.children.filter(child => child.geometry && child.geometry.type === "SphereGeometry");
    let eatingTimer = 0;
    let vihaanEatingTimer = 0;
    let eatingRunId = 0;
    let lastPickerFocus = null;
    let pickerActor = A;
    const iceCreamPicker = document.getElementById("iceCreamPicker");
    const iceCreamStatus = document.getElementById("iceCreamStatus");
    const flavorButtons = iceCreamPicker ? [...iceCreamPicker.querySelectorAll("[data-flavor]")] : [];
    const flavorColors = { Vanilla: 0xf2e5bd, Chocolate: 0x70452e, Strawberry: 0xdc7690, Mango: 0xf0ad38 };
    function openIceCreamPicker(actor = A) {
      if (actor === A && bikeState.riding) dismountBike();
      if (eBikeState.rider === actor) dismountEbike();
      if (carState.driver === actor || carState.passenger === actor) dismountCar(actor);
      if (!iceCreamPicker) return;
      pickerActor = actor;
      const live = iceCreamPicker.querySelector(".icecream-live");
      if (live) live.textContent = "Choose Vanilla, Chocolate, Strawberry, or Mango.";
      lastPickerFocus = document.activeElement;
      iceCreamPicker.hidden = false;
      requestAnimationFrame(() => flavorButtons[0] && flavorButtons[0].focus());
      wake();
    }
    function closeIceCreamPicker(restoreFocus = true) {
      if (!iceCreamPicker) return;
      iceCreamPicker.hidden = true;
      if (restoreFocus && lastPickerFocus && lastPickerFocus.focus) lastPickerFocus.focus();
      lastPickerFocus = null;
    }
    function eatIceCream(flavor) {
      if (!flavorColors[flavor]) return;
      const actor = pickerActor;
      const actorScoops = actor === A ? scoopMeshes : vihaanScoopMeshes;
      actorScoops.forEach(scoop => {
        scoop.material.color.setHex(flavorColors[flavor]); scoop.scale.setScalar(1);
      });
      (actor === A ? coneGroup : vihaanConeGroup).visible = true;
      if (actor === A) eatingTimer = 4.5; else vihaanEatingTimer = 4.5;
      closeIceCreamPicker(true);
      eatingRunId += 1;
      const runId = eatingRunId;
      actor.leftArm.arm.rotation.set(-1.05, 0, 0.25);
      actor.leftArm.elbow.rotation.set(0.85, 0, 0);
      if (actor === A) sayAhaan("Yum! " + flavor + " ice cream!", "The scoops taste delicious.", "🍦", "Ice Cream");
      if (iceCreamStatus) iceCreamStatus.textContent = `${actor === A ? "Ahaan" : "Vihaan"} eats ${flavor} ice cream.`;
      if (calm()) {
        setTimeout(() => {
          if (runId !== eatingRunId) return;
          if (actor === A) eatingTimer = 0; else vihaanEatingTimer = 0;
          (actor === A ? coneGroup : vihaanConeGroup).visible = false;
          actor.leftArm.arm.rotation.set(0, 0, actor.leftArm.rest);
          actor.leftArm.elbow.rotation.set(0, 0, 0);
        }, 4500);
      }
      wake();
    }
    flavorButtons.forEach(button => button.addEventListener("click", () => eatIceCream(button.dataset.flavor)));
    const pickerClose = iceCreamPicker && iceCreamPicker.querySelector("[data-close-picker]");
    if (pickerClose) pickerClose.addEventListener("click", () => closeIceCreamPicker());
    if (iceCreamPicker) iceCreamPicker.addEventListener("click", e => { if (e.target === iceCreamPicker) closeIceCreamPicker(); });
    if (iceCreamPicker) iceCreamPicker.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const focusable = [...iceCreamPicker.querySelectorAll("button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener("keydown", e => {
      if (iceCreamPicker && !iceCreamPicker.hidden && e.key === "Escape") closeIceCreamPicker();
    });

    function mountBike() {
      if (bikeState.riding || currentActivity || eatingTimer > 0) return;
      bikeState.riding = true; bikeState.speed = 0;
      bikeState.boostHeld = false;
      bikeState.target = null;
      targetPos = null;
      Object.keys(bikeKeys).forEach(key => { bikeKeys[key] = false; });
      currentNearbyItem = null;
      if (actionPrompt) actionPrompt.hidden = true;
      A.leftArm.arm.rotation.set(-1.45, 0, 0.18);
      A.leftArm.elbow.rotation.set(1.2, 0, 0);
      A.wavingArm.arm.rotation.set(-1.45, 0, -0.18);
      A.wavingArm.elbow.rotation.set(1.2, 0, 0);
      A.leftLeg.hip.rotation.set(-1.25, 0, 0);
      A.rightLeg.hip.rotation.set(-1.25, 0, 0);
      A.leftLeg.knee.rotation.set(1.55, 0, 0);
      A.rightLeg.knee.rotation.set(1.55, 0, 0);
      wake();
    }
    function dismountBike() {
      if (!bikeState.riding) return;
      bikeState.riding = false; bikeState.speed = 0;
      bikeState.boostHeld = false;
      bikeState.target = null;
      Object.keys(bikeKeys).forEach(key => { bikeKeys[key] = false; });
      const sideX = Math.cos(bikeState.heading) * 1.55;
      const sideZ = -Math.sin(bikeState.heading) * 1.55;
      A.rig.position.set(bikeState.x + sideX, groundHeightAt(bikeState.x + sideX, bikeState.z + sideZ, rigBaseY), bikeState.z + sideZ);
      A.rig.rotation.y = bikeState.heading;
      A.leftArm.arm.rotation.set(0, 0, A.leftArm.rest); A.leftArm.elbow.rotation.set(0, 0, 0);
      A.wavingArm.arm.rotation.set(0, 0, A.wavingArm.rest); A.wavingArm.elbow.rotation.set(0, 0, 0);
      A.leftLeg.hip.rotation.set(0, 0, 0); A.rightLeg.hip.rotation.set(0, 0, 0);
      A.leftLeg.knee.rotation.set(0, 0, 0); A.rightLeg.knee.rotation.set(0, 0, 0);
      wake();
    }
    function mountEbike(actor) {
      if (!actor || eBikeState.rider || currentActivity || (actor === A && (bikeState.riding || eatingTimer > 0)) || (actor === V && (!togetherEnabled || quadState.riding || vihaanEatingTimer > 0))) return;
      eBikeState.rider = actor;
      eBikeState.speed = 0;
      eBikeState.target = null;
      Object.keys(eBikeKeys).forEach(key => { eBikeKeys[key] = false; });
      if (actor === A) Object.keys(bikeKeys).forEach(key => { bikeKeys[key] = false; });
      else Object.keys(vihaanKeys).forEach(key => { vihaanKeys[key] = false; });
      targetPos = null;
      currentNearbyItem = null;
      vihaanNearbyItem = null;
      actor.leftArm.arm.rotation.set(-1.35, 0, 0.18);
      actor.leftArm.elbow.rotation.set(1.05, 0, 0);
      actor.wavingArm.arm.rotation.set(-1.35, 0, -0.18);
      actor.wavingArm.elbow.rotation.set(1.05, 0, 0);
      actor.leftLeg.hip.rotation.set(-1.05, 0, 0);
      actor.rightLeg.hip.rotation.set(-1.05, 0, 0);
      actor.leftLeg.knee.rotation.set(1.25, 0, 0);
      actor.rightLeg.knee.rotation.set(1.25, 0, 0);
      wake();
    }
    function dismountEbike() {
      const actor = eBikeState.rider;
      if (!actor) return;
      eBikeState.rider = null;
      eBikeState.speed = 0;
      eBikeState.target = null;
      Object.keys(eBikeKeys).forEach(key => { eBikeKeys[key] = false; });
      const sideX = Math.cos(eBikeState.heading) * 1.35;
      const sideZ = -Math.sin(eBikeState.heading) * 1.35;
      actor.rig.position.set(eBikeState.x + sideX, groundHeightAt(eBikeState.x + sideX, eBikeState.z + sideZ, rigBaseY), eBikeState.z + sideZ);
      actor.rig.rotation.y = eBikeState.heading;
      actor.leftArm.arm.rotation.set(0, 0, actor.leftArm.rest); actor.leftArm.elbow.rotation.set(0, 0, 0);
      actor.wavingArm.arm.rotation.set(0, 0, actor.wavingArm.rest); actor.wavingArm.elbow.rotation.set(0, 0, 0);
      actor.leftLeg.hip.rotation.set(0, 0, 0); actor.rightLeg.hip.rotation.set(0, 0, 0);
      actor.leftLeg.knee.rotation.set(0, 0, 0); actor.rightLeg.knee.rotation.set(0, 0, 0);
      wake();
    }
    function parkEbike() {
      if (eBikeState.rider) dismountEbike();
      eBikeState.x = eBikeParking.x;
      eBikeState.z = eBikeParking.z;
      eBikeState.heading = eBikeParking.heading;
      eBikeState.speed = 0;
      eBikeRoot.position.set(eBikeState.x, bikeSurfaceHeightAt(eBikeState.x, eBikeState.z), eBikeState.z);
      eBikeRoot.rotation.y = eBikeState.heading;
      const item = INTERACTABLES.find(entry => entry.id === "ebike");
      if (item) { item.x = eBikeState.x; item.z = eBikeState.z; }
    }
    function carSeatPosition(actor) {
      const side = carState.driver === actor ? -0.43 : 0.43;
      const cos = Math.cos(carState.heading), sin = Math.sin(carState.heading);
      return { x: carState.x + side * cos, z: carState.z - side * sin };
    }
    function positionCarRider(actor) {
      const seat = carSeatPosition(actor);
      actor.rig.position.set(seat.x, groundHeightAt(seat.x, seat.z, rigBaseY) - 0.12, seat.z);
      actor.rig.rotation.set(0, carState.heading, 0);
    }
    function setCarRiderPose(actor) {
      actor.leftArm.arm.rotation.set(-1.05, 0, 0.20);
      actor.leftArm.elbow.rotation.set(0.82, 0, 0);
      actor.wavingArm.arm.rotation.set(-1.05, 0, -0.20);
      actor.wavingArm.elbow.rotation.set(0.82, 0, 0);
      actor.leftLeg.hip.rotation.set(-0.55, 0, 0);
      actor.rightLeg.hip.rotation.set(-0.55, 0, 0);
      actor.leftLeg.knee.rotation.set(0.55, 0, 0);
      actor.rightLeg.knee.rotation.set(0.55, 0, 0);
      if (actor.stopWave) actor.stopWave();
      if (actor === A) waveTimer = 0;
      else vihaanWaveTimer = 0;
    }
    function resetCarRiderPose(actor) {
      actor.leftArm.arm.rotation.set(0, 0, actor.leftArm.rest); actor.leftArm.elbow.rotation.set(0, 0, 0);
      actor.wavingArm.arm.rotation.set(0, 0, actor.wavingArm.rest); actor.wavingArm.elbow.rotation.set(0, 0, 0);
      actor.leftLeg.hip.rotation.set(0, 0, 0); actor.rightLeg.hip.rotation.set(0, 0, 0);
      actor.leftLeg.knee.rotation.set(0, 0, 0); actor.rightLeg.knee.rotation.set(0, 0, 0);
    }
    function mountCar(actor) {
      if (!actor) return;
      if (carState.driver === actor || carState.passenger === actor) { dismountCar(actor); return; }
      if (currentActivity || (actor === A && (bikeState.riding || eBikeState.rider === A || eatingTimer > 0)) || (actor === V && (!togetherEnabled || quadState.riding || eBikeState.rider === V || vihaanEatingTimer > 0))) return;
      if (carState.driver && carState.passenger) return;
      const wasEmpty = !carState.driver;
      if (wasEmpty) carState.driver = actor;
      else carState.passenger = actor;
      if (wasEmpty) {
        carState.target = null;
        Object.keys(carKeys).forEach(key => { carKeys[key] = false; });
      }
      targetPos = null;
      currentNearbyItem = null;
      vihaanNearbyItem = null;
      if (actor === A) Object.keys(keys).forEach(key => { keys[key] = false; });
      else Object.keys(vihaanKeys).forEach(key => { vihaanKeys[key] = false; });
      setCarRiderPose(actor);
      positionCarRider(actor);
      wake();
    }
    function dismountCar(actor) {
      const isDriver = carState.driver === actor;
      const isPassenger = carState.passenger === actor;
      if (!isDriver && !isPassenger) return;
      const side = isDriver ? -1.42 : 1.42;
      const exitX = carState.x + side * Math.cos(carState.heading);
      const exitZ = carState.z - side * Math.sin(carState.heading);
      actor.rig.position.set(exitX, groundHeightAt(exitX, exitZ, rigBaseY), exitZ);
      actor.rig.rotation.y = carState.heading;
      resetCarRiderPose(actor);
      if (isDriver) {
        carState.speed = 0;
        carState.driver = carState.passenger;
        carState.passenger = null;
        if (!carState.driver) carState.target = null;
        Object.keys(carKeys).forEach(key => { carKeys[key] = false; });
        if (carState.driver) { setCarRiderPose(carState.driver); positionCarRider(carState.driver); }
        else carState.speed = 0;
      } else carState.passenger = null;
      wake();
    }
    function parkCar() {
      if (carState.passenger) dismountCar(carState.passenger);
      if (carState.driver) dismountCar(carState.driver);
      carState.x = carParking.x;
      carState.z = carParking.z;
      carState.heading = carParking.heading;
      carState.speed = 0;
      Object.keys(carKeys).forEach(key => { carKeys[key] = false; });
      carRoot.position.set(carState.x, bikeSurfaceHeightAt(carState.x, carState.z), carState.z);
      carRoot.rotation.y = carState.heading;
      const item = INTERACTABLES.find(entry => entry.id === "car");
      if (item) { item.x = carState.x; item.z = carState.z; }
    }
    function mountChopper(actor) {
      if (!actor || chopperState.rider || chopperState.altitude > 0.05 || currentActivity || (actor === A && (bikeState.riding || eBikeState.rider === A || carState.driver === A || carState.passenger === A || eatingTimer > 0)) || (actor === V && (!togetherEnabled || quadState.riding || eBikeState.rider === V || carState.driver === V || carState.passenger === V || vihaanEatingTimer > 0))) return;
      chopperState.rider = actor;
      chopperState.riderScale = actor.rig.scale.clone();
      actor.rig.scale.multiplyScalar(0.55);
      chopperState.speed = 0;
      chopperState.altitude = chopperSafeAltitude;
      chopperState.target = null;
      chopperSoundActive = true;
      if (soundOn && window.AhaanAudio) window.AhaanAudio.startRotor();
      Object.keys(chopperKeys).forEach(key => { chopperKeys[key] = false; });
      targetPos = null;
      currentNearbyItem = null;
      vihaanNearbyItem = null;
      actor.leftArm.arm.rotation.set(-1.5, 0, 0.25);
      actor.leftArm.elbow.rotation.set(1.3, 0, 0);
      actor.wavingArm.arm.rotation.set(-1.5, 0, -0.25);
      actor.wavingArm.elbow.rotation.set(1.3, 0, 0);
      actor.leftLeg.hip.rotation.set(-1.55, 0, 0);
      actor.rightLeg.hip.rotation.set(-1.55, 0, 0);
      actor.leftLeg.knee.rotation.set(1.55, 0, 0);
      actor.rightLeg.knee.rotation.set(1.55, 0, 0);
      wake();
    }
    function dismountChopper() {
      const actor = chopperState.rider;
      if (!actor || chopperState.altitude > 0.05 || chopperState.speed > 0.25) return;
      chopperState.rider = null;
      if (chopperState.riderScale) actor.rig.scale.copy(chopperState.riderScale);
      chopperState.riderScale = null;
      chopperState.speed = 0;
      chopperState.target = null;
      chopperSoundActive = false;
      if (window.AhaanAudio) window.AhaanAudio.stopRotor();
      Object.keys(chopperKeys).forEach(key => { chopperKeys[key] = false; });
      const sideX = Math.cos(chopperState.heading) * 1.5;
      const sideZ = -Math.sin(chopperState.heading) * 1.5;
      let exitX = chopperState.x + sideX, exitZ = chopperState.z + sideZ;
      if (blockedBikePosition(exitX, exitZ)) { exitX = chopperState.x - sideX; exitZ = chopperState.z - sideZ; }
      actor.rig.position.set(exitX, groundHeightAt(exitX, exitZ, rigBaseY), exitZ);
      actor.rig.rotation.y = chopperState.heading;
      actor.leftArm.arm.rotation.set(0, 0, actor.leftArm.rest); actor.leftArm.elbow.rotation.set(0, 0, 0);
      actor.wavingArm.arm.rotation.set(0, 0, actor.wavingArm.rest); actor.wavingArm.elbow.rotation.set(0, 0, 0);
      actor.leftLeg.hip.rotation.set(0, 0, 0); actor.rightLeg.hip.rotation.set(0, 0, 0);
      actor.leftLeg.knee.rotation.set(0, 0, 0); actor.rightLeg.knee.rotation.set(0, 0, 0);
      wake();
    }
    function parkChopper() {
      if (chopperState.rider) {
        chopperState.altitude = 0;
        chopperState.speed = 0;
        chopperRoot.position.y = bikeSurfaceHeightAt(chopperState.x, chopperState.z);
        dismountChopper();
      }
      chopperState.x = chopperParking.x;
      chopperState.z = chopperParking.z;
      chopperState.heading = chopperParking.heading;
      chopperState.altitude = 0;
      chopperState.speed = 0;
      chopperRoot.position.set(chopperState.x, bikeSurfaceHeightAt(chopperState.x, chopperState.z), chopperState.z);
      chopperRoot.rotation.y = chopperState.heading;
      const item = INTERACTABLES.find(entry => entry.id === "chopper");
      if (item) { item.x = chopperState.x; item.z = chopperState.z; }
    }

    // Activity control buttons state
    const activityHud = document.getElementById("activityHud");
    const actBoostBtn = document.getElementById("actBoostBtn");
    const actBoostLabel = document.getElementById("actBoostLabel");
    const actDismountBtn = document.getElementById("actDismountBtn");
    const actionBoostHint = document.getElementById("actionBoostHint");

    if (actionPromptBtn) {
      actionPromptBtn.addEventListener("click", () => {
        if (currentNearbyItem && currentNearbyItem.onActivate) {
          currentNearbyItem.onActivate();
        }
        actionPromptBtn.blur();
      });
    }

    if (actBoostBtn) {
      actBoostBtn.addEventListener("click", () => {
        if (!bikeState.riding) boostCurrentActivity();
      });
      const releaseBikeBoost = () => { bikeState.boostHeld = false; };
      actBoostBtn.addEventListener("pointerdown", e => {
        if (!bikeState.riding) return;
        e.preventDefault();
        bikeState.boostHeld = true;
        if (actBoostBtn.setPointerCapture) actBoostBtn.setPointerCapture(e.pointerId);
      });
      actBoostBtn.addEventListener("pointerup", releaseBikeBoost);
      actBoostBtn.addEventListener("pointercancel", releaseBikeBoost);
      actBoostBtn.addEventListener("lostpointercapture", releaseBikeBoost);
      window.addEventListener("blur", releaseBikeBoost);
    }

    if (actDismountBtn) {
      actDismountBtn.addEventListener("click", () => {
        stopPlayActivity();
      });
    }

    // List of interactive locations and prompts
    const INTERACTABLES = [
      {
        id: "bike",
        name: "Ahaan's bike",
        x: bikeState.x,
        z: bikeState.z,
        approachRadius: 3.8,
        actionLabel: "Ride the bike 🚲",
        promptText: "Press E to ride the bike.",
        onActivate: () => bikeState.riding ? dismountBike() : mountBike()
      },
      {
        id: "ebike",
        name: "E-bike",
        x: eBikeState.x,
        z: eBikeState.z,
        approachRadius: 3.8,
        actionLabel: "Ride the e-bike ⚡",
        promptText: "Press E to ride the e-bike.",
        onActivate: () => mountEbike(A)
      },
      {
        id: "car",
        name: "Two-seat car",
        x: carState.x,
        z: carState.z,
        approachRadius: 4.2,
        actionLabel: "Ride in the car 🚙",
        promptText: "Press E to ride in the car.",
        onActivate: () => mountCar(A)
      },
      {
        id: "chopper",
        name: "Chopper",
        x: chopperState.x,
        z: chopperState.z,
        approachRadius: 4.2,
        actionLabel: "Ride the chopper 🚁",
        promptText: "Press E to ride the chopper.",
        onActivate: () => mountChopper(A)
      },
      {
        id: "icecream",
        name: "Ice Cream",
        x: shopState.x,
        z: shopState.z + 1.0,
        approachRadius: 3.2,
        actionLabel: "Choose ice cream 🍦",
        promptText: "Press E to choose ice cream.",
        onActivate: openIceCreamPicker
      },
      {
        id: "trampoline",
        name: "Spring Trampoline",
        x: -4.3,
        z: 0.2,
        approachRadius: 3.4,
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
        approachRadius: 3.4,
        actionLabel: "Slide! 🛝",
        promptText: "Press Enter to Slide! 🛝",
        onActivate: () => startPlayActivity("slide")
      },
      {
        id: "lazyriver",
        name: "Lazy River Float",
        x: 7.0,
        z: 0.8,
        approachRadius: 3.5,
        actionLabel: "Float in Lazy River! 🍩",
        promptText: "Press Enter to Float in Lazy River! 🍩",
        onActivate: () => startPlayActivity("lazyriver")
      },
      // Zoo animal pens (northwest section)
      ...zooInteractables,
      // State landmarks generated dynamically from STATES
      ...STATES.map(st => ({
        id: st.id,
        name: st.name,
        city: st.city,
        x: st.x,
        z: st.z,
        approachRadius: st.id === "AR" ? 3.5 : st.rad * 0.95,
        actionLabel: st.actionLabel || `Explore ${st.city}! ${st.icon}`,
        promptText: `Press Enter: ${st.actionLabel || `Explore ${st.city}! ${st.icon}`}`,
        onActivate: () => exploreLandmark(st)
      }))
    ];

    let vihaanNearbyItem = null;
    let vihaanBounceTime = 0;
    const vihaanActionPrompt = document.getElementById("vihaanActionPrompt");
    const vihaanActionPromptBtn = document.getElementById("vihaanActionPromptBtn");
    const vihaanActionPromptText = document.getElementById("vihaanActionPromptText");
    function toggleQuadRide() {
      if (!togetherEnabled) return;
      quadState.riding = !quadState.riding;
      quadState.speed = 0;
      quadState.target = null;
      Object.keys(quadKeys).forEach(key => { quadKeys[key] = false; });
      if (quadState.riding) {
        V.rig.position.set(quadState.x, groundHeightAt(quadState.x, quadState.z, rigBaseY) - 0.12, quadState.z);
        V.rig.rotation.y = quadState.heading;
        V.leftArm.arm.rotation.set(-1.25, 0, 0.18);
        V.wavingArm.arm.rotation.set(-1.25, 0, -0.18);
        vihaanNearbyItem = { id: "quad" };
      } else {
        V.rig.position.set(quadState.x + Math.cos(quadState.heading) * 1.25, groundHeightAt(quadState.x, quadState.z, rigBaseY), quadState.z - Math.sin(quadState.heading) * 1.25);
        V.leftArm.arm.rotation.set(0, 0, V.leftArm.rest);
        V.wavingArm.arm.rotation.set(0, 0, V.wavingArm.rest);
        vihaanNearbyItem = null;
      }
      if (vihaanActionPromptText) vihaanActionPromptText.textContent = quadState.riding ? "Enter: park the quad" : "Press Enter to ride the quad.";
      if (vihaanActionPrompt) vihaanActionPrompt.hidden = !quadState.riding;
      wake();
    }
    function activateVihaanItem() {
      if (!vihaanNearbyItem) return;
      if (vihaanNearbyItem.id === "trainRide") dismountTrain(V);
      if (vihaanNearbyItem.id === "train") boardTrain(V);
      if (vihaanNearbyItem.id === "chopper") mountChopper(V);
      if (vihaanNearbyItem.id === "chopperRide") dismountChopper();
      if (vihaanNearbyItem.id === "ebike") mountEbike(V);
      if (vihaanNearbyItem.id === "ebikeRide") dismountEbike();
      if (vihaanNearbyItem.id === "car") mountCar(V);
      if (vihaanNearbyItem.id === "carRide") dismountCar(V);
      if (vihaanNearbyItem.id === "icecream") openIceCreamPicker(V);
      if (vihaanNearbyItem.onVihaan) vihaanNearbyItem.onVihaan();
      if (vihaanNearbyItem.id === "trampoline") {
        vihaanBounceTime = 5;
        moveActor(V, -4.85 - V.rig.position.x, 0.2 - V.rig.position.z);
        wake();
      }
    }
    if (vihaanActionPromptBtn) vihaanActionPromptBtn.addEventListener("click", () => {
      activateVihaanItem();
      vihaanActionPromptBtn.blur();
    });

    function withinBridge(x, z, bridges, span, width) {
      return bridges.some(([cx, cz, rotation]) => {
        const dx = x - cx, dz = z - cz;
        const along = dx * Math.sin(rotation) + dz * Math.cos(rotation);
        const across = Math.abs(dx * Math.cos(rotation) - dz * Math.sin(rotation));
        return Math.abs(along) <= span / 2 + 0.25 && across <= width;
      });
    }
    function blockedBikePosition(x, z) {
      if (Math.abs(x) > 44 || Math.abs(z) > 44) return true;
      if (parkObstacles.some(obstacle => Math.hypot(x - obstacle.x, z - obstacle.z) < obstacle.r + 0.55)) return true;
      const lazyBridge = withinBridge(x, z, [[0,-8.8,0],[8.8,0,Math.PI/2],[0,8.8,0],[-8.8,0,Math.PI/2]], 4.6, 0.92);
      const riverBridges = [[11.5,-4.9,1.98],[14.2,8.15,1.05]];
      const onRiverBridge = withinBridge(x, z, riverBridges, 6.8, 1.2);
      const lazyRadius = Math.hypot(x, z);
      if (!lazyBridge && !onRiverBridge && lazyRadius >= 7.15 && lazyRadius <= 10.4) return true;
      if (!onRiverBridge && Math.abs(z) <= 39) {
        const riverX = Math.sin(z * 0.08) * 3.0 + Math.cos(z * 0.05) * 1.5 + 11.2;
        if (Math.abs(x - riverX) <= 2.95) return true;
      }
      return false;
    }
    function bikePositionAllowed(x, z) {
      return !blockedBikePosition(x, z) && (!togetherEnabled || Math.hypot(x - V.rig.position.x, z - V.rig.position.z) <= maxPlayerSeparation());
    }
    function eBikePositionAllowed(x, z) {
      const otherRider = eBikeState.rider === A ? V : A;
      return !blockedBikePosition(x, z) && (!togetherEnabled || Math.hypot(x - otherRider.rig.position.x, z - otherRider.rig.position.z) <= maxPlayerSeparation());
    }
    function blockedCarPosition(x, z) {
      return blockedBikePosition(x, z) || parkObstacles.some(obstacle => Math.hypot(x - obstacle.x, z - obstacle.z) < obstacle.r + 1.15);
    }
    function carPositionAllowed(x, z) {
      if (Math.abs(x) > 42 || Math.abs(z) > 42 || blockedCarPosition(x, z)) return false;
      if (!togetherEnabled || (carState.driver && carState.passenger)) return true;
      const otherActor = carState.driver === A || carState.passenger === A ? V : A;
      return Math.hypot(x - otherActor.rig.position.x, z - otherActor.rig.position.z) <= maxPlayerSeparation();
    }

    function checkVihaanProximity() {
      let closest = null;
      let minDistance = Infinity;
      if (trainState.vihaan) {
        closest = { id: "trainRide" };
        minDistance = 0;
      } else if (togetherEnabled && chopperState.rider === V) {
        closest = { id: "chopperRide", x: chopperState.x, z: chopperState.z, approachRadius: Infinity };
        minDistance = 0;
      } else if (togetherEnabled && (carState.driver === V || carState.passenger === V)) {
        closest = { id: "carRide", x: carState.x, z: carState.z, approachRadius: Infinity };
        minDistance = 0;
      } else if (togetherEnabled && eBikeState.rider === V) {
        closest = { id: "ebikeRide", x: eBikeState.x, z: eBikeState.z, approachRadius: Infinity };
        minDistance = 0;
      } else if (togetherEnabled && !quadState.riding) {
        const quadDistance = Math.hypot(V.rig.position.x - quadState.x, V.rig.position.z - quadState.z);
        if (quadDistance < 2.2) { closest = { id: "quad", x: quadState.x, z: quadState.z }; minDistance = quadDistance; }
      }
      if (togetherEnabled && !trainState.vihaan && !quadState.riding && eBikeState.rider !== V && carState.driver !== V && carState.passenger !== V && !chopperState.rider) INTERACTABLES.filter(item => ["icecream", "trampoline"].includes(item.id) || item.onVihaan || (item.id === "ebike" && !eBikeState.rider) || (item.id === "car" && (!carState.driver || !carState.passenger)) || item.id === "chopper").forEach(item => {
        const distance = Math.hypot(V.rig.position.x - item.x, V.rig.position.z - item.z);
        if (distance <= item.approachRadius && distance < minDistance) { closest = item; minDistance = distance; }
      });
      if (togetherEnabled && !trainState.vihaan && trainState.dwell > 0) {
        const station = trainStations[trainState.currentStation];
        const distance = Math.hypot(V.rig.position.x - station.x, V.rig.position.z - station.z);
        if (distance <= 4.8 && distance < minDistance) { closest = { id: "train" }; minDistance = distance; }
      }
      if (closest !== vihaanNearbyItem) {
        vihaanNearbyItem = closest;
        if (closest && vihaanActionPrompt && vihaanActionPromptText) {
          vihaanActionPromptText.textContent = closest.vihaanPromptText || (closest.id === "trainRide" ? (trainState.dwell > 0 ? "Enter: leave the train." : "Wait for the next station to leave the train.") : closest.id === "train" ? "Press Enter to ride the train." : closest.id === "quad" ? "Press Enter to ride the quad." : closest.id === "chopper" ? "Press Enter to ride the chopper." : closest.id === "chopperRide" ? (chopperState.altitude > 0.05 ? "Land to leave the chopper." : "Enter: leave the chopper.") : closest.id === "ebike" ? "Press Enter to ride the e-bike." : closest.id === "ebikeRide" ? "Enter: park the e-bike." : closest.id === "car" ? "Press Enter to ride in the car." : closest.id === "carRide" ? "Enter: leave the car." : closest.id === "icecream" ? "Enter: choose ice cream 🍦" : "Enter: Jump! 🤸");
          vihaanActionPrompt.hidden = false;
          requestAnimationFrame(() => vihaanActionPrompt.classList.add("show"));
        } else if (vihaanActionPrompt) {
          vihaanActionPrompt.classList.remove("show");
          vihaanActionPrompt.hidden = true;
        }
      }
    }

    // Detect nearby playground items and landmarks
    function checkProximity() {
      if (trainState.ahaan) {
        currentNearbyItem = { id: "trainRide", promptText: trainState.dwell > 0 ? "Press E to leave the train." : "Wait for the next station to leave the train.", onActivate: () => dismountTrain(A) };
        if (actionPrompt && actionPromptText) { actionPromptText.textContent = currentNearbyItem.promptText; actionPrompt.hidden = false; }
        return;
      }
      if (bikeState.riding || eBikeState.rider === A || carState.driver === A || carState.passenger === A || chopperState.rider === A) {
        const ridingBike = bikeState.riding;
        const ridingEbike = eBikeState.rider === A;
        const ridingChopper = chopperState.rider === A;
        const rideItem = {
          id: ridingBike ? "bikeRide" : ridingEbike ? "ebikeRide" : ridingChopper ? "chopperRide" : "carRide",
          promptText: ridingBike ? "Press E to park the bike." : ridingEbike ? "Press E to park the e-bike." : ridingChopper ? (chopperState.altitude > 0.05 ? "Land to leave the chopper." : "Press E to leave the chopper.") : "Press E to leave the car.",
          onActivate: ridingBike ? dismountBike : ridingEbike ? dismountEbike : ridingChopper ? dismountChopper : () => dismountCar(A)
        };
        currentNearbyItem = rideItem;
        if (actionPrompt && actionPromptText) {
          actionPromptText.textContent = rideItem.promptText;
          if (actionKeyBadge) actionKeyBadge.textContent = "E";
          if (actionBoostHint) actionBoostHint.hidden = !bikeState.riding;
          actionPrompt.hidden = false;
          actionPrompt.classList.add("show");
        }
        return;
      }
      if (actionBoostHint) actionBoostHint.hidden = true;
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
        if (item.id === "ebike" && eBikeState.rider) continue;
        if (item.id === "car" && carState.driver && carState.passenger) continue;
        if (item.id === "chopper" && chopperState.rider) continue;
        const d = Math.hypot(px - item.x, pz - item.z);
        if (d <= item.approachRadius && d < minD) {
          minD = d;
          closest = item;
        }
      }
      if (!trainState.ahaan && trainState.dwell > 0) {
        const station = trainStations[trainState.currentStation];
        const d = Math.hypot(px - station.x, pz - station.z);
        if (d <= 4.8 && d < minD) { minD = d; closest = { id: "train", promptText: "Press E to ride the train.", onActivate: () => boardTrain(A) }; }
      }

      if (closest !== currentNearbyItem) {
        currentNearbyItem = closest;
        if (currentNearbyItem && actionPrompt && actionPromptText) {
          actionPromptText.textContent = togetherEnabled ? currentNearbyItem.promptText.replace("Press Enter", "Press E") : currentNearbyItem.promptText;
          if (actionKeyBadge) actionKeyBadge.textContent = ["bike", "ebike", "car", "chopper", "icecream", "train"].includes(currentNearbyItem.id) ? "E or tap" : (togetherEnabled ? "E" : "Enter");
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

    // Zoom into landmark and animate 3D landmark directly without blocking modal
    function exploreLandmark(st) {
      if (!st) return;
      if (currentActivity) stopPlayActivity();

      if (st.onInteract) {
        st.onInteract();
      } else {
        cameraMode = "landmark";
        actionCamTarget.set(st.x, 2.2, st.z);
        actionCamPos.set(st.x + 5.5, 7.8, st.z + 11.5);

        A.rig.rotation.y = Math.atan2(st.x - A.rig.position.x, st.z - A.rig.position.z);
        if (A.startWave) A.startWave();

        playSound("bell");
        sayAhaan("Welcome to " + (st.city || st.name) + "! 🌍", st.fact, st.icon || "📍", st.name);
        wake();
      }
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
        trampY = 0.56;
        trampVy = 7.0;
        trampBounceApex = 2.4;
        trampDeflection = 0;
        trampIsFlipping = false;
        trampFlip = 0;
        cameraMode = "action";
        // Wide-angle zoomed out camera framing trampoline, ladder, full bounce arc & headroom
        actionCamTarget.set(-4.3, 3.8, 0.2);
        actionCamPos.set(-4.3 + 12.2, 11.2, 0.2 + 15.6);
        sayAhaan("Trampoline time! 🤸", "Boing! Let us bounce high! Press Space to jump higher!", "🤸", "Spring Trampoline");
      } else if (type === "lazyriver") {
        targetPos = new T.Vector3(7.0, rigBaseY, 0.8);
        marker.position.set(7.0, 0.52, 0.8);
        markerMat.opacity = 0.95;
        lazyRiverAngle = 0.08;
        lazyRiverSpeed = 0.35;
        cameraMode = "action";
        actionCamTarget.set(7.0, 1.8, 0.8);
        actionCamPos.set(7.0 + 8.2, 8.5, 0.8 + 10.5);
        sayAhaan("Lazy River Float! 🍩", "Hop into the tube and relax! Water ripples around Arkansas!", "🍩", "Lazy River");
      }

      if (type === "trampoline" || type === "swing" || type === "lazyriver") {
        if (activityHud) {
          if (actBoostLabel) {
            actBoostLabel.textContent = type === "trampoline" ? "Bounce Higher! ⬆️" : (type === "swing" ? "Swing Higher! 🪁" : "Paddle Faster! 🍩");
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
      } else if (prev === "lazyriver") {
        A.rig.position.set(7.0, rigBaseY, 0.8);
        A.rig.rotation.set(0, -Math.PI / 2, 0);
        if (A.updateWalk) A.updateWalk(false, 0, 0);
      }

      sayAhaan("That was great fun! ✨", "Walk around the park to explore more.", "🎈", "Park");
      wake();
    }

    // Boost bounce height, swing momentum, or lazy river speed
    function boostCurrentActivity() {
      if (!currentActivity) return;
      if (currentActivity === "trampoline") {
        trampBounceApex = Math.min(4.2, trampBounceApex + 0.7);
        if (trampVy < 0) {
          trampVy = Math.max(3.8, trampVy + 4.2);
        } else {
          trampVy = Math.min(11.5, Math.max(trampVy + 2.8, Math.sqrt(2 * 17.5 * trampBounceApex)));
        }
        trampY = Math.max(trampY, 0.56);
        playSound("bounce");
        spawnTrampParticles();
        sayAhaan("Boing! Higher! 🤸", "Jumping to the stars! Wheeeee!", "🤸", "Spring Trampoline");
        wake();
      } else if (currentActivity === "swing") {
        const dir = Math.sign(swingVelocity) || 1;
        swingVelocity += dir * 1.6;
        if (Math.abs(swingVelocity) > 4.6) swingVelocity = Math.sign(swingVelocity) * 4.6;
        playSound("breeze");
        sayAhaan("Wheeee! Swing higher! 🪁", "Fly high into the sky!", "🪁", "Cedar Swings");
        wake();
      } else if (currentActivity === "lazyriver") {
        lazyRiverSpeed = Math.min(1.2, lazyRiverSpeed + 0.35);
        playSound("riverboat");
        sayAhaan("Splash! Paddle faster! 🍩", "Wheee! Floating down the lazy river!", "🍩", "Lazy River");
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
            A.head.rotation.set(-0.06, 0, 0);
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

          // Head looks forward into the wind naturally tracking swing arc
          A.head.rotation.set(-0.06 - swingAngle * 0.18, 0, 0);

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
          if (dist < 0.95 || !targetPos) {
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
          const hopTime = 0.50;
          const t = Math.min(1, activityTimer / hopTime);
          const curX = -2.95 + t * (-4.3 - (-2.95));
          const arcY = Math.sin(t * Math.PI) * 0.45;
          A.rig.position.set(curX, rigBaseY + t * 0.54 + arcY, 0.2);
          A.rig.rotation.y = 0;

          if (t >= 1) {
            activityPhase = 2;
            activityTimer = 0;
            trampY = 0.56;
            trampVy = 7.0;
            A.rig.position.set(-4.3, rigBaseY + 0.54, 0.2);
            playSound("bounce");
            spawnTrampParticles();
            sayAhaan("Boing! Boing! 🤸", "I can touch the clouds!", "🤸", "Spring Trampoline");
          }
        }
        // Phase 2: Real spring bouncing physics
        else if (activityPhase === 2) {
          activityTimer += dt;
          const gravity = 17.5;
          const MAT_BASE_Y = 0.54;

          if (trampBounceApex > 1.8) {
            trampBounceApex = Math.max(1.8, trampBounceApex - dt * 0.12);
          }

          if (trampY > MAT_BASE_Y) {
            // Airborne flight
            trampVy -= gravity * dt;
            trampY += trampVy * dt;

            // Free-flight limbs: arms up/out for balance
            A.leftArm.arm.rotation.z = 2.1;
            A.wavingArm.arm.rotation.z = -2.1;
            A.leftArm.arm.rotation.x = -0.3;
            A.wavingArm.arm.rotation.x = -0.3;
            A.leftLeg.knee.rotation.x = 0.15;
            A.rightLeg.knee.rotation.x = 0.15;

            // Stretch during fast ascent / descent
            const stretch = Math.min(0.22, Math.abs(trampVy) / 20 * 0.22);
            A.rig.scale.set(
              ahaanScale * (1 - stretch * 0.35),
              ahaanScale * (1 + stretch * 0.65),
              ahaanScale * (1 - stretch * 0.35)
            );

            // 360 flip rotation during high bounces
            if (trampIsFlipping) {
              trampFlip += dt * 8.5;
              if (trampFlip >= Math.PI * 2) {
                trampFlip = 0;
                trampIsFlipping = false;
              }
              A.rig.rotation.x = trampFlip;
            } else {
              A.rig.rotation.x = 0;
            }

            // Descending touchdown trigger
            if (trampY <= MAT_BASE_Y && trampVy < 0) {
              trampY = MAT_BASE_Y;
              playSound("bounce");
              spawnTrampParticles();
            }
          } else {
            // Mat compression and elastic rebound
            const trampDeflection = Math.min(0.28, Math.max(0, MAT_BASE_Y - trampY));
            const springK = 260.0;
            const springDamping = 3.2;
            const springForce = springK * trampDeflection - springDamping * trampVy;

            trampVy += springForce * dt;
            trampY += trampVy * dt;

            // Visual mat deformation (mat stretches downward)
            const currentDeflection = Math.min(0.28, Math.max(0, MAT_BASE_Y - trampY));
            if (trampMat) trampMat.position.y = MAT_BASE_Y - currentDeflection;

            // Squash on impact (knees bend, torso compresses)
            const squash = Math.min(0.35, currentDeflection * 1.5);
            A.rig.scale.set(
              ahaanScale * (1 + squash * 0.7),
              ahaanScale * (1 - squash * 0.85),
              ahaanScale * (1 + squash * 0.7)
            );
            A.rig.rotation.x = 0;

            A.leftLeg.knee.rotation.x = squash * 4.2;
            A.rightLeg.knee.rotation.x = squash * 4.2;
            A.leftLeg.hip.rotation.x = -squash * 2.0;
            A.rightLeg.hip.rotation.x = -squash * 2.0;
            A.leftArm.arm.rotation.x = 0.4;
            A.wavingArm.arm.rotation.x = 0.4;
            A.leftArm.arm.rotation.z = 0.3;
            A.wavingArm.arm.rotation.z = -0.3;

            // When rebounding upward and crossing baseline, launch into air!
            if (trampVy > 0 && trampY >= MAT_BASE_Y) {
              trampY = MAT_BASE_Y + 0.015; // Set strictly above mat baseline so airborne flight activates!
              if (trampMat) trampMat.position.y = MAT_BASE_Y;
              playSound("bounce");
              spawnTrampParticles();

              // High bounce initiates front flip
              if (trampBounceApex >= 2.2) {
                trampIsFlipping = true;
                trampFlip = 0;
              }
            }
          }

          A.rig.position.set(-4.3, rigBaseY + (trampY - MAT_BASE_Y) + 0.54, 0.2);
          A.rig.rotation.y = 0;
        }
      } else if (currentActivity === "lazyriver") {
        const canalR = 8.8;

        // Phase 0: Approach wooden float dock
        if (activityPhase === 0) {
          const dist = Math.hypot(A.rig.position.x - 7.0, A.rig.position.z - 0.8);
          if (dist < 0.85 || !targetPos) {
            activityPhase = 1;
            activityTimer = 0;
            targetPos = null;
            isWalking = false;
            markerMat.opacity = 0;
            A.rig.position.set(7.0, rigBaseY, 0.8);
            A.rig.rotation.y = -Math.PI / 2;
          }
        }
        // Phase 1: Hop onto circular inflatable tube
        else if (activityPhase === 1) {
          activityTimer += dt;
          const hopTime = 0.55;
          const t = Math.min(1, activityTimer / hopTime);
          const targetX = Math.cos(lazyRiverAngle) * canalR;
          const targetZ = Math.sin(lazyRiverAngle) * canalR;
          const curX = 7.0 + t * (targetX - 7.0);
          const curZ = 0.8 + t * (targetZ - 0.8);
          const arcY = Math.sin(t * Math.PI) * 0.45;
          A.rig.position.set(curX, rigBaseY + arcY, curZ);

          if (t >= 1) {
            activityPhase = 2;
            activityTimer = 0;
            if (lazyRiverInflatable) {
              lazyRiverInflatable.add(A.rig);
              A.rig.position.set(0, 1.48, -0.52);
              A.rig.rotation.set(-0.36, 0, 0);
              A.rig.scale.setScalar(ahaanScale);
            }
            playSound("riverboat");
            sayAhaan("Floating smoothly! 🍩", "Gentle water ripples around Arkansas!", "🍩", "Lazy River");
          }
        }
        // Phase 2: Gentle circular floating along the canal on top of the tube
        else if (activityPhase === 2) {
          activityTimer += dt;
          const baseSpd = calm() ? 0.22 : 0.38;
          lazyRiverAngle += (baseSpd + (lazyRiverSpeed - 0.35)) * dt;
          if (lazyRiverSpeed > 0.35) {
            lazyRiverSpeed = Math.max(0.35, lazyRiverSpeed - dt * 0.2);
          }

          const fx = Math.cos(lazyRiverAngle) * canalR;
          const fz = Math.sin(lazyRiverAngle) * canalR;
          const bob = Math.sin(activityTimer * 2.8) * 0.04;
          const roll = Math.sin(activityTimer * 1.6) * 0.035;
          const pitch = Math.cos(activityTimer * 2.2) * 0.025;
          const waterY = 0.22 + bob;

          if (lazyRiverInflatable) {
            lazyRiverInflatable.position.set(fx, waterY, fz);
            lazyRiverInflatable.rotation.y = -lazyRiverAngle + Math.PI / 2;
            lazyRiverInflatable.rotation.z = roll;
            lazyRiverInflatable.rotation.x = pitch;

            // Ensure Ahaan is mounted on top of the inflatable tube
            if (A.rig.parent !== lazyRiverInflatable) {
              lazyRiverInflatable.add(A.rig);
              A.rig.scale.setScalar(ahaanScale);
            }
            // Position Ahaan lounging comfortably on top of the tube
            A.rig.position.set(0, 1.48, -0.52);
            A.rig.rotation.set(-0.36, 0, 0);
          }

          // Relaxed sunbather lazy river posture:
          // Legs kicked forward resting over the front tube cushion into the breeze
          const legKick = Math.sin(activityTimer * 3.0) * 0.05;
          A.leftLeg.hip.rotation.set(-1.24 + legKick, 0, -0.10);
          A.rightLeg.hip.rotation.set(-1.24 - legKick, 0, 0.10);
          A.leftLeg.knee.rotation.set(0.42, 0, 0);
          A.rightLeg.knee.rotation.set(0.42, 0, 0);

          // Arms resting comfortably on the sides of the inflatable ring
          A.leftArm.arm.rotation.set(-0.18, 0, 0.76);
          A.wavingArm.arm.rotation.set(-0.18, 0, -0.76);
          A.leftArm.elbow.rotation.set(0.62, 0, 0);
          A.wavingArm.elbow.rotation.set(0.62, 0, 0);

          // Head tilted naturally in line with relaxed spine
          A.head.rotation.set(-0.06, 0, 0);

          // Camera smoothly tracks Ahaan floating in circular canal
          actionCamTarget.set(fx, 1.2, fz);
          actionCamPos.set(fx + Math.cos(lazyRiverAngle + 0.6) * 9.5, 6.8, fz + Math.sin(lazyRiverAngle + 0.6) * 9.5);
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
      if (togetherEnabled) {
        const targetX = (A.rig.position.x + V.rig.position.x) * 0.5;
        const targetZ = (A.rig.position.z + V.rig.position.z) * 0.5;
        const targetY = (A.rig.position.y + V.rig.position.y) * 0.5;
        const separation = Math.hypot(A.rig.position.x - V.rig.position.x, A.rig.position.z - V.rig.position.z);
        const duoZoom = Math.min(1.45, Math.max(1, 1 + separation * 0.035));
        normalCamTarget.set(targetX, targetY, targetZ);
        normalCamPos.set(targetX, targetY + baseCamY * duoZoom, targetZ + baseCamZ * duoZoom);
        desiredTarget = normalCamTarget;
        desiredPos = normalCamPos;
      } else if (cameraMode === "action" || cameraMode === "landmark" || cameraMode === "custom") {
        desiredTarget = actionCamTarget;
        desiredPos = actionCamPos;
      } else {
        const targetX = A.rig.position.x * 0.78 + panOffset.x;
        const targetZ = A.rig.position.z * 0.78 + panOffset.y;
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
    function findVehicleRoute(state, x, z, vehicle) {
      const blocked = vehicle === carState ? blockedCarPosition : blockedBikePosition;
      const step = 0.8, minimum = -43.2, count = 109, total = count * count;
      const nodeX = index => minimum + (index % count) * step;
      const nodeZ = index => minimum + Math.floor(index / count) * step;
      const indexAt = (px, pz) => {
        const ix = Math.max(0, Math.min(count - 1, Math.round((px - minimum) / step)));
        const iz = Math.max(0, Math.min(count - 1, Math.round((pz - minimum) / step)));
        return iz * count + ix;
      };
      const nearestOpenNode = (px, pz) => {
        const direct = indexAt(px, pz);
        if (!blocked(nodeX(direct), nodeZ(direct))) return direct;
        let nearest = -1, distance = Infinity;
        for (let index = 0; index < total; index++) {
          const nx = nodeX(index), nz = nodeZ(index);
          if (blocked(nx, nz)) continue;
          const nextDistance = Math.hypot(nx - px, nz - pz);
          if (nextDistance < distance) { nearest = index; distance = nextDistance; }
        }
        return nearest;
      };
      const start = nearestOpenNode(state.x, state.z);
      const end = nearestOpenNode(x, z);
      if (start < 0 || end < 0) return null;
      if (start === end) return { x: nodeX(end), z: nodeZ(end), path: [{ x: nodeX(end), z: nodeZ(end) }], pathIndex: 0 };

      const parent = new Int32Array(total);
      parent.fill(-2);
      parent[start] = -1;
      const queue = new Int32Array(total);
      let read = 0, write = 0;
      queue[write++] = start;
      const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      while (read < write && parent[end] === -2) {
        const current = queue[read++], cx = current % count, cz = Math.floor(current / count);
        for (const [dx, dz] of directions) {
          const ix = cx + dx, iz = cz + dz;
          if (ix < 0 || ix >= count || iz < 0 || iz >= count) continue;
          const next = iz * count + ix;
          if (parent[next] !== -2 || blocked(nodeX(next), nodeZ(next))) continue;
          if (dx && dz && (blocked(nodeX(cz * count + ix), nodeZ(cz * count + ix)) || blocked(nodeX(iz * count + cx), nodeZ(iz * count + cx)))) continue;
          parent[next] = current;
          queue[write++] = next;
        }
      }
      if (parent[end] === -2) return null;
      const raw = [];
      for (let node = end; node !== -1; node = parent[node]) raw.push({ x: nodeX(node), z: nodeZ(node) });
      raw.reverse();
      const path = [raw[0]];
      let previousX = 0, previousZ = 0;
      for (let i = 1; i < raw.length; i++) {
        const nextX = Math.sign(raw[i].x - raw[i - 1].x), nextZ = Math.sign(raw[i].z - raw[i - 1].z);
        if (i > 1 && (nextX !== previousX || nextZ !== previousZ)) path.push(raw[i - 1]);
        previousX = nextX; previousZ = nextZ;
      }
      const destination = raw[raw.length - 1];
      if (path.length === 1 || path[path.length - 1].x !== destination.x || path[path.length - 1].z !== destination.z) path.push(destination);
      return { x: destination.x, z: destination.z, path, pathIndex: path.length > 1 ? 1 : 0 };
    }
    function setRiddenVehicleTarget(x, z) {
      let target = { x, z };
      if (chopperState.rider) {
        chopperState.target = target;
        targetPos = null;
        return target;
      }
      const riddenVehicles = [
        bikeState.riding && bikeState,
        eBikeState.rider && eBikeState,
        carState.driver && carState,
        togetherEnabled && quadState.riding && quadState,
        chopperState.rider && chopperState
      ].filter(Boolean).sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
      if (!riddenVehicles.length) return false;
      const vehicle = riddenVehicles[0];
      target = findVehicleRoute(vehicle, x, z, vehicle);
      if (!target) return null;
      vehicle.target = target;
      vehicle.targetStep = null;
      targetPos = null;
      return target;
    }

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
          const riddenVehicleName = bikeState.riding ? "Ahaan's bike" : eBikeState.rider ? "E-bike" : carState.driver ? "Two-seat car" : quadState.riding ? "Vihaan's quad" : chopperState.rider ? "Chopper" : null;
          if (riddenVehicleName && data && data.name !== riddenVehicleName) {
            const groundHit = raycaster.intersectObjects(walkableSurfaces)[0];
            if (groundHit) {
              const target = setRiddenVehicleTarget(groundHit.point.x, groundHit.point.z);
              if (!target) return;
              marker.position.set(target.x, 0.52, target.z);
              markerMat.opacity = 0.95;
              isDragging = false;
              wake();
              return;
            }
          }
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
          const vehicleTarget = setRiddenVehicleTarget(hit.point.x, hit.point.z);
          if (vehicleTarget === false) {
            if (currentActivity) stopPlayActivity();
            targetPos = new T.Vector3(hit.point.x, rigBaseY, hit.point.z);
          } else if (!vehicleTarget) {
            return;
          } else {
            marker.position.set(vehicleTarget.x, 0.52, vehicleTarget.z);
          }
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
    function advanceVehicleTarget(state, dt, topSpeed, acceleration, braking, turnRate) {
      if (!state.target) return false;
      const path = state.target.path || [state.target];
      const pathIndex = Math.min(state.target.pathIndex || 0, path.length - 1);
      const waypoint = path[pathIndex];
      const dx = waypoint.x - state.x;
      const dz = waypoint.z - state.z;
      const distance = Math.hypot(dx, dz);
      state.targetStep = null;
      if (distance < 0.8) {
        const desiredHeading = Math.atan2(dx, dz);
        const headingDiff = Math.atan2(Math.sin(desiredHeading - state.heading), Math.cos(desiredHeading - state.heading));
        state.heading += Math.max(-turnRate * dt, Math.min(turnRate * dt, headingDiff));
        state.speed = Math.max(0, state.speed - dt * braking);
        const travel = Math.min(distance, state.speed * dt);
        if (distance > 0) state.targetStep = { x: state.x + dx / distance * travel, z: state.z + dz / distance * travel };
        if (state.speed < 0.12) {
          state.x = waypoint.x;
          state.z = waypoint.z;
          state.targetStep = { x: waypoint.x, z: waypoint.z };
          if (pathIndex < path.length - 1) state.target.pathIndex = pathIndex + 1;
          else { state.target = null; markerMat.opacity = 0; }
        }
        return true;
      }
      const desiredHeading = Math.atan2(dx, dz);
      const headingDiff = Math.atan2(Math.sin(desiredHeading - state.heading), Math.cos(desiredHeading - state.heading));
      state.heading += Math.max(-turnRate * dt, Math.min(turnRate * dt, headingDiff));
      const nextWaypoint = path[pathIndex + 1];
      let turnSpeed = topSpeed / (1 + Math.abs(headingDiff) * 2 / Math.max(0.2, turnRate));
      turnSpeed = Math.max(1.4, turnSpeed);
      if (nextWaypoint && pathIndex > 0) {
        const incoming = Math.atan2(waypoint.x - path[pathIndex - 1].x, waypoint.z - path[pathIndex - 1].z);
        const outgoing = Math.atan2(nextWaypoint.x - waypoint.x, nextWaypoint.z - waypoint.z);
        const corner = Math.abs(Math.atan2(Math.sin(outgoing - incoming), Math.cos(outgoing - incoming)));
        if (corner > 0.25) turnSpeed = Math.max(1.8, topSpeed * (1 - corner / Math.PI));
      }
      const wantedSpeed = Math.min(topSpeed, turnSpeed, Math.sqrt(2 * braking * Math.max(0, distance - 0.35)));
      state.speed += Math.max(-braking * dt, Math.min(acceleration * dt, wantedSpeed - state.speed));
      const travel = Math.min(distance, state.speed * dt);
      if (distance > 0) state.targetStep = { x: state.x + dx / distance * travel, z: state.z + dz / distance * travel };
      markerMat.opacity = Math.max(0.25, markerMat.opacity - dt * 0.08);
      return true;
    }

    // ---- Top-View Keyboard Navigation (Up=North, Down=South, Left=West, Right=East) ----
    function handleKey(e, isDown) {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") shiftHeld = isDown;
      const flightActor = chopperState.rider;
      if (flightActor) {
        const playerKeys = togetherEnabled && flightActor === V
          ? { up: e.key === "ArrowUp", down: e.key === "ArrowDown", left: e.key === "ArrowLeft", right: e.key === "ArrowRight" }
          : togetherEnabled && flightActor === A
            ? { up: e.code === "KeyW", down: e.code === "KeyS", left: e.code === "KeyA", right: e.code === "KeyD" }
            : { up: e.code === "KeyW" || e.key === "ArrowUp", down: e.code === "KeyS" || e.key === "ArrowDown", left: e.code === "KeyA" || e.key === "ArrowLeft", right: e.code === "KeyD" || e.key === "ArrowRight" };
        const flightKey = playerKeys.up ? "up" : playerKeys.down ? "down" : playerKeys.left ? "left" : playerKeys.right ? "right" : e.code === "Space" ? "lift" : e.code === "ShiftLeft" || e.code === "ShiftRight" ? "descend" : null;
        const ownExit = flightActor === A ? e.code === "KeyE" || (e.key || "").toLowerCase() === "e" : e.code === "Enter" || e.key === "Enter";
        if (isDown && ownExit) { e.preventDefault(); dismountChopper(); return; }
        if (flightKey) {
          if (isDown && ["up", "down", "left", "right"].includes(flightKey)) { chopperState.target = null; markerMat.opacity = 0; }
          chopperKeys[flightKey] = isDown;
          if (isDown) e.preventDefault();
          wake();
          return;
        }
      }
      if (calm()) {
        if (isDown && trainState.ahaan && ((e.code || "") === "KeyE" || (e.key || "").toLowerCase() === "e")) { e.preventDefault(); dismountTrain(A); }
        if (isDown && trainState.vihaan && (e.code === "Enter" || e.key === "Enter")) { e.preventDefault(); dismountTrain(V); }
        if (isDown && bikeState.riding && ((e.code || "") === "KeyE" || (e.key || "").toLowerCase() === "e")) {
          e.preventDefault();
          dismountBike();
        }
        if (isDown && ((eBikeState.rider === A && ((e.code || "") === "KeyE" || (e.key || "").toLowerCase() === "e")) || (eBikeState.rider === V && (e.code === "Enter" || e.key === "Enter")))) {
          e.preventDefault();
          dismountEbike();
        }
        if (isDown && (carState.driver === A || carState.passenger === A) && ((e.code || "") === "KeyE" || (e.key || "").toLowerCase() === "e")) {
          e.preventDefault();
          dismountCar(A);
        }
        if (isDown && (carState.driver === V || carState.passenger === V) && (e.code === "Enter" || e.key === "Enter")) {
          e.preventDefault();
          dismountCar(V);
        }
        return;
      }
      if (isDown && hero.classList.contains("scn-paused")) return;
      const focusedControl = isDown && e.key !== "Escape" && e.target.closest && e.target.closest("button, a, input, select, textarea, [contenteditable]");
      if (focusedControl && focusedControl !== togetherBtn) return;
      const code = e.code || "";
      const key = e.key || "";
      let handled = false;

      if (e.target === togetherBtn && (code === "Space" || key === " " || (!togetherEnabled && (code === "Enter" || key === "Enter")))) return;

      if (togetherEnabled && /^Arrow(Up|Down|Left|Right)$/.test(key)) {
        const direction = key.slice(5).toLowerCase();
        if (chopperState.rider === V) { if (isDown) { chopperState.target = null; markerMat.opacity = 0; } chopperKeys[direction] = isDown; }
        else if (carState.driver === V) { if (isDown) { carState.target = null; markerMat.opacity = 0; } carKeys[direction] = isDown; }
        else if (carState.passenger === V) { if (isDown) e.preventDefault(); return; }
        else if (eBikeState.rider === V) { if (isDown) { eBikeState.target = null; markerMat.opacity = 0; } eBikeKeys[direction] = isDown; }
        else if (quadState.riding) { if (isDown) { quadState.target = null; markerMat.opacity = 0; } quadKeys[direction] = isDown; }
        else vihaanKeys[direction] = isDown;
        if (isDown) e.preventDefault();
        wake();
        return;
      }
      if (togetherEnabled && (code === "Enter" || key === "Enter")) {
        if (isDown) {
          e.preventDefault();
          if (trainState.vihaan) dismountTrain(V);
          else if (vihaanNearbyItem && vihaanNearbyItem.id === "train") boardTrain(V);
          else if (chopperState.rider === V) dismountChopper();
          else if (vihaanNearbyItem && vihaanNearbyItem.id === "chopper") mountChopper(V);
          else if (carState.driver === V || carState.passenger === V) dismountCar(V);
          else if (vihaanNearbyItem && vihaanNearbyItem.id === "car") mountCar(V);
          else if (eBikeState.rider === V) dismountEbike();
          else if (vihaanNearbyItem && vihaanNearbyItem.id === "ebike") mountEbike(V);
          else if (quadState.riding) toggleQuadRide();
          else if (vihaanNearbyItem && vihaanNearbyItem.id === "quad") toggleQuadRide();
          else if (!quadState.riding && Math.hypot(V.rig.position.x - quadState.x, V.rig.position.z - quadState.z) <= 2.2) toggleQuadRide();
          else if (vihaanBounceTime > 0) vihaanBounceTime = Math.min(vihaanBounceTime, 0.5);
          else activateVihaanItem();
        }
        return;
      }

      if (isDown && (code === "KeyE" || key.toLowerCase() === "e")) {
        if (trainState.ahaan) { e.preventDefault(); dismountTrain(A); return; }
        if (chopperState.rider === A) { e.preventDefault(); dismountChopper(); return; }
        if (currentNearbyItem && currentNearbyItem.id === "chopper") { e.preventDefault(); mountChopper(A); return; }
        if (carState.driver === A || carState.passenger === A) {
          e.preventDefault();
          dismountCar(A);
          return;
        }
        if (bikeState.riding) {
          e.preventDefault();
          dismountBike();
          return;
        }
        if (eBikeState.rider === A) {
          e.preventDefault();
          dismountEbike();
          return;
        }
        if (currentNearbyItem && currentNearbyItem.id === "train") { e.preventDefault(); boardTrain(A); return; }
        if (currentNearbyItem && (togetherEnabled || ["bike", "ebike", "car", "icecream"].includes(currentNearbyItem.id))) {
          e.preventDefault();
          currentNearbyItem.onActivate();
          return;
        }
      }

      if (carState.driver === A) {
        const rideKey =
          code === "KeyW" || key.toLowerCase() === "w" ? "up" :
          code === "KeyS" || key.toLowerCase() === "s" ? "down" :
          code === "KeyA" || key.toLowerCase() === "a" ? "left" :
          code === "KeyD" || key.toLowerCase() === "d" ? "right" : null;
        if (rideKey) {
          if (isDown) { carState.target = null; markerMat.opacity = 0; }
          carKeys[rideKey] = isDown;
          if (isDown) e.preventDefault();
          wake();
        }
        return;
      }
      if (carState.passenger === A) return;

      if (eBikeState.rider === A) {
        const rideKey =
          code === "KeyW" || key.toLowerCase() === "w" ? "up" :
          code === "KeyS" || key.toLowerCase() === "s" ? "down" :
          code === "KeyA" || key.toLowerCase() === "a" ? "left" :
          code === "KeyD" || key.toLowerCase() === "d" ? "right" : null;
        if (rideKey) {
          if (isDown) { eBikeState.target = null; markerMat.opacity = 0; }
          eBikeKeys[rideKey] = isDown;
          if (isDown) e.preventDefault();
          wake();
        }
        return;
      }

      if (bikeState.riding) {
        const rideKey =
          code === "KeyW" || key.toLowerCase() === "w" ? "up" :
          code === "KeyS" || key.toLowerCase() === "s" ? "down" :
          code === "KeyA" || key.toLowerCase() === "a" ? "left" :
          code === "KeyD" || key.toLowerCase() === "d" ? "right" :
          !togetherEnabled && (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") ? key.slice(5).toLowerCase() : null;
        if (rideKey) {
          if (isDown) { bikeState.target = null; markerMat.opacity = 0; }
          bikeKeys[rideKey] = isDown;
          if (isDown) e.preventDefault();
          wake();
        }
        if (code === "Space" || key === " " || key === "Spacebar") {
          bikeState.boostHeld = isDown;
          e.preventDefault();
          wake();
        }
        return;
      }

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

      // Space key to boost bounce or swing or lazy river float
      if (isDown && (code === "Space" || key === " " || key === "Spacebar")) {
        if (discModal && !discModal.hidden) {
          closeDiscoveryModal();
          return;
        }
        if (currentActivity === "trampoline" || currentActivity === "swing" || currentActivity === "lazyriver") {
          e.preventDefault();
          boostCurrentActivity();
          return;
        } else if (currentNearbyItem && !currentActivity) {
          e.preventDefault();
          currentNearbyItem.onActivate();
          return;
        }
      }

      // Escape key to dismount from playground equipment or close modal
      if (isDown && (code === "Escape" || key === "Escape")) {
        if (discModal && !discModal.hidden) {
          e.preventDefault();
          closeDiscoveryModal();
          return;
        }
        if (currentActivity) {
          e.preventDefault();
          stopPlayActivity();
          return;
        }
      }

      // Close modal on movement keys
      if (isDown && discModal && !discModal.hidden) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(key)) {
          closeDiscoveryModal();
        }
      }

      // Up = North (towards Missouri, -Z) or boost active equipment
      if (code === "ArrowUp" || key === "ArrowUp" || code === "KeyW" || key === "w" || key === "W") {
        if (isDown && (currentActivity === "trampoline" || currentActivity === "swing" || currentActivity === "lazyriver")) {
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
          closeDiscoveryModal();
          if (item.onInteract) item.onInteract();
        };
      }

      if (discBackdrop) {
        discBackdrop.onclick = () => closeDiscoveryModal();
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
    function motionPaused() { return calm() || document.hidden || hero.classList.contains("scn-paused"); }
    function breezeOn() { return !hero.classList.contains("breeze-off"); }
    function wake() { if (!raf && !motionPaused()) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    // Apply motion changes to an active loop as well as new interactions.
    function syncMotion() {
      if (motionPaused()) {
        cancelAnimationFrame(raf);
        raf = 0;
        Object.keys(keys).forEach(key => { keys[key] = false; });
        Object.keys(bikeKeys).forEach(key => { bikeKeys[key] = false; });
        Object.keys(eBikeKeys).forEach(key => { eBikeKeys[key] = false; });
        Object.keys(carKeys).forEach(key => { carKeys[key] = false; });
        bikeState.boostHeld = false;
        if (calm()) {
          bikeState.speed = 0;
          eBikeState.speed = 0;
          carState.speed = 0;
          eatingTimer = 0;
          coneGroup.visible = false;
        }
      } else {
        wake();
      }
    }
    new MutationObserver(syncMotion).observe(hero, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(syncMotion).observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    function frame(now) {
      raf = 0;
      if (motionPaused()) return;

      const elapsed = Math.min(0.2, (now - last) / 1000);
      const dt = Math.min(0.05, elapsed);
      const walkDt = elapsed;
      last = now;
      const trainActive = updateParkTrain(elapsed);

      // Ride the bike or walk through the park.
      if (bikeState.riding) {
        const normalTopSpeed = 5.5;
        const boostTopSpeed = 8;
        const topSpeed = bikeState.boostHeld ? boostTopSpeed : normalTopSpeed;
        const autoTarget = advanceVehicleTarget(bikeState, dt, topSpeed, bikeState.boostHeld ? 3.2 : 2.6, 5.5, 0.55 + Math.min(1, bikeState.speed / topSpeed) * 1.05);
        if (!autoTarget) {
          if (bikeKeys.down) bikeState.speed = Math.max(0, bikeState.speed - dt * 2.4);
          else if (!bikeState.boostHeld && bikeState.speed > normalTopSpeed) bikeState.speed = Math.max(normalTopSpeed, bikeState.speed - dt * 0.65);
          else if (bikeKeys.up) bikeState.speed = Math.min(topSpeed, bikeState.speed + dt * (bikeState.boostHeld ? 3.2 : 2.6));
          else bikeState.speed = Math.max(0, bikeState.speed - dt * 0.48);
        }
        const steer = autoTarget ? 0 : (bikeKeys.right ? 1 : 0) - (bikeKeys.left ? 1 : 0);
        const turnRate = 0.55 + Math.min(1, bikeState.speed / topSpeed) * 1.05;
        if (!autoTarget) bikeState.heading += steer * turnRate * dt;
        const bikeStep = autoTarget ? bikeState.targetStep : null;
        const nextX = bikeStep ? bikeStep.x : bikeState.x + Math.sin(bikeState.heading) * bikeState.speed * dt;
        const nextZ = bikeStep ? bikeStep.z : bikeState.z + Math.cos(bikeState.heading) * bikeState.speed * dt;
        if (bikePositionAllowed(nextX, nextZ)) {
          bikeState.x = nextX;
          bikeState.z = nextZ;
        } else {
          const slideCandidates = [
            { x: nextX, z: bikeState.z, distance: Math.abs(nextX - bikeState.x) },
            { x: bikeState.x, z: nextZ, distance: Math.abs(nextZ - bikeState.z) }
          ].sort((a, b) => b.distance - a.distance);
          const slide = slideCandidates.find(candidate => candidate.distance > 0 && bikePositionAllowed(candidate.x, candidate.z));
          if (slide) {
            bikeState.x = slide.x;
            bikeState.z = slide.z;
            bikeState.speed = Math.max(0, bikeState.speed - dt * 1.8);
          } else {
            bikeState.speed = Math.max(0, bikeState.speed - dt * 5.5);
            if (bikeState.target) { bikeState.target = null; markerMat.opacity = 0; }
          }
        }
        const bikeGround = bikeSurfaceHeightAt(bikeState.x, bikeState.z);
        const riderGround = groundHeightAt(bikeState.x, bikeState.z, rigBaseY);
        bikeRoot.position.set(bikeState.x, bikeGround, bikeState.z);
        bikeRoot.rotation.y = bikeState.heading;
        bikeState.wheels.forEach(wheel => { wheel.rotation.x += bikeState.speed * dt / bikeWheelRadius; });
        const movingBike = INTERACTABLES.find(item => item.id === "bike");
        if (movingBike) { movingBike.x = bikeState.x; movingBike.z = bikeState.z; }
        pedalCrank.rotation.x += bikeState.speed * dt * 2.4;
        const pedalPhase = Math.sin(pedalCrank.rotation.x) * 0.12;
        A.leftLeg.hip.rotation.x = -1.25 + pedalPhase;
        A.rightLeg.hip.rotation.x = -1.25 - pedalPhase;
        A.leftLeg.knee.rotation.x = 1.55 - pedalPhase * 1.4;
        A.rightLeg.knee.rotation.x = 1.55 + pedalPhase * 1.4;
        bikeState.lean += (steer * Math.min(0.16, bikeState.speed * 0.035) - bikeState.lean) * Math.min(1, dt * 4);
        A.rig.position.set(bikeState.x, riderGround - 0.12, bikeState.z);
        A.rig.rotation.set(0, bikeState.heading, bikeState.lean);
        isWalking = bikeState.speed > 0.06;
        targetPos = null;
        markerMat.opacity = 0;
      } else if (chopperState.rider !== A && !trainState.ahaan) {
        let moveX = 0, moveZ = 0;
        if (keys.up) moveZ -= 1;
        if (keys.down) moveZ += 1;
        if (keys.left) moveX -= 1;
        if (keys.right) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
          const len = Math.hypot(moveX, moveZ);
          moveX /= len; moveZ /= len;
          ahaanAngle = Math.atan2(moveX, moveZ);
          isWalking = moveActor(A, moveX * walkSpeed * walkDt, moveZ * walkSpeed * walkDt);
        } else if (targetPos) {
          const dx = targetPos.x - A.rig.position.x;
          const dz = targetPos.z - A.rig.position.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.4) {
            ahaanAngle = Math.atan2(dx / dist, dz / dist);
            isWalking = moveActor(A, (dx / dist) * walkSpeed * walkDt, (dz / dist) * walkSpeed * walkDt);
            markerMat.opacity = Math.max(0.2, markerMat.opacity - dt * 0.4);
          } else {
            isWalking = false;
            targetPos = null;
            markerMat.opacity = 0;
          }
        } else {
          isWalking = false;
        }
      } else {
        isWalking = false;
        targetPos = null;
      }

      if (chopperState.rider) {
        const rider = chopperState.rider;
        const rotorTarget = 18;
        chopperState.rotorSpeed += (rotorTarget - chopperState.rotorSpeed) * Math.min(1, dt * 2);
        const climb = (chopperKeys.lift ? 1 : 0) - (chopperKeys.descend ? 1 : 0);
        chopperState.altitude = Math.max(0, Math.min(12.5, chopperState.altitude + climb * 4.2 * dt));
        const topSpeed = 12;
        let chopperSteer = (chopperKeys.right ? 1 : 0) - (chopperKeys.left ? 1 : 0);
        let chopperUp = chopperKeys.up, chopperDown = chopperKeys.down;
        if (chopperState.target) {
          const dx = chopperState.target.x - chopperState.x;
          const dz = chopperState.target.z - chopperState.z;
          const distance = Math.hypot(dx, dz);
          if (distance < 0.25) {
            chopperUp = false;
            chopperDown = true;
            if (chopperState.speed < 0.12) {
              chopperState.target = null;
              markerMat.opacity = 0;
            }
          } else {
            const desiredHeading = Math.atan2(dx, dz);
            const headingDiff = Math.atan2(Math.sin(desiredHeading - chopperState.heading), Math.cos(desiredHeading - chopperState.heading));
            const turnRate = 0.55 + Math.min(1, chopperState.speed / topSpeed) * 0.7;
            chopperSteer = Math.max(-1, Math.min(1, headingDiff / Math.max(0.001, turnRate * dt)));
            chopperUp = true;
            chopperDown = false;
            chopperState.speed = Math.min(chopperState.speed, Math.sqrt((distance - 0.15) * 9));
            markerMat.opacity = Math.max(0.25, markerMat.opacity - dt * 0.08);
          }
        }
        if (chopperDown) chopperState.speed = Math.max(0, chopperState.speed - dt * 4.5);
        else if (chopperUp) chopperState.speed = Math.min(topSpeed, chopperState.speed + dt * 3.8);
        else chopperState.speed = Math.max(0, chopperState.speed - dt * 1.6);
        chopperState.heading += chopperSteer * (0.55 + Math.min(1, chopperState.speed / topSpeed) * 0.7) * dt;
        const nextX = chopperState.x + Math.sin(chopperState.heading) * chopperState.speed * dt;
        const nextZ = chopperState.z + Math.cos(chopperState.heading) * chopperState.speed * dt;
        if (chopperState.altitude >= chopperSafeAltitude || !blockedBikePosition(nextX, nextZ)) { chopperState.x = nextX; chopperState.z = nextZ; }
        else chopperState.speed = Math.max(0, chopperState.speed - dt * 5.5);
        const baseY = bikeSurfaceHeightAt(chopperState.x, chopperState.z);
        chopperRoot.position.set(chopperState.x, baseY + chopperState.altitude, chopperState.z);
        chopperRoot.rotation.y = chopperState.heading;
        chopperRotor.rotation.y += chopperState.rotorSpeed * dt;
        tailRotor.rotation.z += chopperState.rotorSpeed * dt * 1.7;
        rider.rig.position.set(chopperState.x, chopperRoot.position.y + 1.35, chopperState.z + 0.3);
        rider.rig.rotation.set(0, chopperState.heading, 0);
        if (rider === A) { isWalking = false; targetPos = null; }
        else vihaanWalking = false;
        const item = INTERACTABLES.find(entry => entry.id === "chopper");
        if (item) { item.x = chopperState.x; item.z = chopperState.z; }
      } else {
        chopperState.rotorSpeed = Math.max(0, chopperState.rotorSpeed - dt * 5);
        chopperRotor.rotation.y += chopperState.rotorSpeed * dt;
        tailRotor.rotation.z += chopperState.rotorSpeed * dt * 1.7;
      }

      if (eBikeState.rider) {
        const topSpeed = 10.4;
        const autoTarget = advanceVehicleTarget(eBikeState, dt, topSpeed, 3.2, 3, 0.55 + Math.min(1, eBikeState.speed / topSpeed) * 0.9);
        if (!autoTarget) {
          if (eBikeKeys.down) eBikeState.speed = Math.max(0, eBikeState.speed - dt * 3);
          else if (eBikeKeys.up) eBikeState.speed = Math.min(topSpeed, eBikeState.speed + dt * 3.2);
          else eBikeState.speed = Math.max(0, eBikeState.speed - dt * 0.65);
        }
        const steer = autoTarget ? 0 : (eBikeKeys.right ? 1 : 0) - (eBikeKeys.left ? 1 : 0);
        if (!autoTarget) eBikeState.heading += steer * (0.55 + Math.min(1, eBikeState.speed / topSpeed) * 0.9) * dt;
        const eBikeStep = autoTarget ? eBikeState.targetStep : null;
        const nextX = eBikeStep ? eBikeStep.x : eBikeState.x + Math.sin(eBikeState.heading) * eBikeState.speed * dt;
        const nextZ = eBikeStep ? eBikeStep.z : eBikeState.z + Math.cos(eBikeState.heading) * eBikeState.speed * dt;
        if (eBikePositionAllowed(nextX, nextZ)) {
          eBikeState.x = nextX;
          eBikeState.z = nextZ;
        } else {
          const slideCandidates = [
            { x: nextX, z: eBikeState.z, distance: Math.abs(nextX - eBikeState.x) },
            { x: eBikeState.x, z: nextZ, distance: Math.abs(nextZ - eBikeState.z) }
          ].sort((a, b) => b.distance - a.distance);
          const slide = slideCandidates.find(candidate => candidate.distance > 0 && eBikePositionAllowed(candidate.x, candidate.z));
          if (slide) {
            eBikeState.x = slide.x;
            eBikeState.z = slide.z;
            eBikeState.speed = Math.max(0, eBikeState.speed - dt * 1.8);
          } else {
            eBikeState.speed = Math.max(0, eBikeState.speed - dt * 5.5);
            if (eBikeState.target) { eBikeState.target = null; markerMat.opacity = 0; }
          }
        }
        eBikeRoot.position.set(eBikeState.x, bikeSurfaceHeightAt(eBikeState.x, eBikeState.z), eBikeState.z);
        eBikeRoot.rotation.y = eBikeState.heading;
        eBikeState.wheels.forEach(wheel => { wheel.rotation.x += eBikeState.speed * dt / eBikeWheelRadius; });
        const rider = eBikeState.rider;
        const riderGround = groundHeightAt(eBikeState.x, eBikeState.z, rigBaseY);
        rider.rig.position.set(eBikeState.x, riderGround - 0.12, eBikeState.z);
        rider.rig.rotation.set(0, eBikeState.heading, steer * Math.min(0.12, eBikeState.speed * 0.018));
        if (rider === A) { isWalking = eBikeState.speed > 0.06; targetPos = null; }
        else vihaanWalking = eBikeState.speed > 0.06;
        const item = INTERACTABLES.find(entry => entry.id === "ebike");
        if (item) { item.x = eBikeState.x; item.z = eBikeState.z; }
      }

      if (carState.driver) {
        const topSpeed = 16;
        const autoTarget = advanceVehicleTarget(carState, dt, topSpeed, 4.5, 5.5, 0.32 + Math.min(1, carState.speed / topSpeed) * 0.42);
        if (!autoTarget) {
          if (carKeys.down) carState.speed = Math.max(0, carState.speed - dt * 5.5);
          else if (carKeys.up) carState.speed = Math.min(topSpeed, carState.speed + dt * 4.5);
          else carState.speed = Math.max(0, carState.speed - dt * 0.8);
        }
        const steer = autoTarget ? 0 : (carKeys.right ? 1 : 0) - (carKeys.left ? 1 : 0);
        if (!autoTarget) carState.heading += steer * (0.32 + Math.min(1, carState.speed / topSpeed) * 0.42) * dt;
        const carStep = autoTarget ? carState.targetStep : null;
        const nextX = carStep ? carStep.x : carState.x + Math.sin(carState.heading) * carState.speed * dt;
        const nextZ = carStep ? carStep.z : carState.z + Math.cos(carState.heading) * carState.speed * dt;
        if (carPositionAllowed(nextX, nextZ)) {
          carState.x = nextX;
          carState.z = nextZ;
        } else {
          const slideCandidates = [
            { x: nextX, z: carState.z, distance: Math.abs(nextX - carState.x) },
            { x: carState.x, z: nextZ, distance: Math.abs(nextZ - carState.z) }
          ].sort((a, b) => b.distance - a.distance);
          const slide = slideCandidates.find(candidate => candidate.distance > 0 && carPositionAllowed(candidate.x, candidate.z));
          if (slide) {
            carState.x = slide.x;
            carState.z = slide.z;
            carState.speed = Math.max(0, carState.speed - dt * 1.8);
          } else {
            carState.speed = Math.max(0, carState.speed - dt * 5.5);
            if (carState.target) { carState.target = null; markerMat.opacity = 0; }
          }
        }
        carRoot.position.set(carState.x, bikeSurfaceHeightAt(carState.x, carState.z), carState.z);
        carRoot.rotation.y = carState.heading;
        carState.wheels.forEach(wheel => { wheel.rotation.x += carState.speed * dt / 0.36; });
        if (carState.driver === A || carState.passenger === A) isWalking = carState.driver === A && carState.speed > 0.06;
        if (carState.driver === V || carState.passenger === V) vihaanWalking = carState.driver === V && carState.speed > 0.06;
        positionCarRider(carState.driver);
        if (carState.passenger) positionCarRider(carState.passenger);
        const item = INTERACTABLES.find(entry => entry.id === "car");
        if (item) { item.x = carState.x; item.z = carState.z; }
      }

      if (togetherEnabled) {
        if (quadState.riding) {
          const topSpeed = 12;
          const autoTarget = advanceVehicleTarget(quadState, dt, topSpeed, 2.2, 3.2, 0.48 + Math.min(1, quadState.speed / topSpeed) * 0.8);
          if (!autoTarget) {
            if (quadKeys.down) quadState.speed = Math.max(0, quadState.speed - dt * 3.2);
            else if (quadKeys.up) quadState.speed = Math.min(topSpeed, quadState.speed + dt * 2.2);
            else quadState.speed = Math.max(0, quadState.speed - dt * 0.55);
          }
          const steer = autoTarget ? 0 : (quadKeys.right ? 1 : 0) - (quadKeys.left ? 1 : 0);
          if (!autoTarget) quadState.heading += steer * (0.48 + Math.min(1, quadState.speed / topSpeed) * 0.8) * dt;
        const quadStep = autoTarget ? quadState.targetStep : null;
        const nextX = quadStep ? quadStep.x : quadState.x + Math.sin(quadState.heading) * quadState.speed * dt;
        const nextZ = quadStep ? quadStep.z : quadState.z + Math.cos(quadState.heading) * quadState.speed * dt;
          if (!blockedBikePosition(nextX, nextZ)) { quadState.x = nextX; quadState.z = nextZ; }
          else {
            quadState.speed = Math.max(0, quadState.speed - dt * 3.4);
            if (quadState.target) { quadState.target = null; markerMat.opacity = 0; }
          }
          quadRoot.position.set(quadState.x, bikeSurfaceHeightAt(quadState.x, quadState.z), quadState.z);
          quadRoot.rotation.y = quadState.heading;
          quadState.wheels.forEach(wheel => { wheel.rotation.x += quadState.speed * dt / 0.48; });
          V.rig.position.set(quadState.x, groundHeightAt(quadState.x, quadState.z, rigBaseY) - 0.12, quadState.z);
          V.rig.rotation.set(0, quadState.heading, steer * Math.min(0.08, quadState.speed * 0.012));
          vihaanWalking = quadState.speed > 0.06;
          targetPos = null;
        }
        let moveX = (vihaanKeys.right ? 1 : 0) - (vihaanKeys.left ? 1 : 0);
        let moveZ = (vihaanKeys.down ? 1 : 0) - (vihaanKeys.up ? 1 : 0);
        const vihaanInCar = carState.driver === V || carState.passenger === V;
        const vihaanInChopper = chopperState.rider === V;
        vihaanWalking = trainState.vihaan || vihaanInChopper ? false : vihaanInCar ? carState.driver === V && carState.speed > 0.06 : !quadState.riding && eBikeState.rider !== V && (moveX !== 0 || moveZ !== 0);
        if (!vihaanInCar && !vihaanInChopper && vihaanWalking) {
          const length = Math.hypot(moveX, moveZ);
          moveX /= length; moveZ /= length;
          vihaanAngle = Math.atan2(moveX, moveZ);
          vihaanWalking = moveActor(V, moveX * walkSpeed * (shiftHeld ? 1.55 : 1) * walkDt, moveZ * walkSpeed * (shiftHeld ? 1.55 : 1) * walkDt);
          let diff = vihaanAngle - V.rig.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          V.rig.rotation.y += diff * Math.min(1, dt * 14);
        }
        if (V.updateWalk && eBikeState.rider !== V && !vihaanInCar && !vihaanInChopper && !trainState.vihaan) V.updateWalk(vihaanWalking, shiftHeld ? 11 : 8.5, walkDt);
      }
      if (vihaanWaveTimer > 0) {
        vihaanWaveTimer = Math.max(0, vihaanWaveTimer - dt);
        if (!vihaanWaveTimer) {
          if (V.stopWave) V.stopWave();
          if (vihaanExiting) { V.rig.visible = false; vihaanExiting = false; }
        }
      }
      if (V.rig.visible) {
        if (vihaanWaveTimer > 0 && eBikeState.rider !== V && carState.driver !== V && carState.passenger !== V && V.updateWave) V.updateWave(dt, vihaanWalking, calm());
        const vihaanGround = groundHeightAt(V.rig.position.x, V.rig.position.z, rigBaseY);
        if (trainState.vihaan) positionTrainRider(V, 2);
        else if (vihaanBounceTime > 0) {
          vihaanBounceTime = Math.max(0, vihaanBounceTime - dt);
          const bounceProgress = 5 - vihaanBounceTime;
          V.rig.position.y = vihaanGround + Math.max(0, Math.sin(bounceProgress * Math.PI * 1.6)) * 1.8;
        } else if (!vihaanExiting) V.rig.position.y = vihaanGround;
        if (vihaanEatingTimer > 0) {
          vihaanEatingTimer = Math.max(0, vihaanEatingTimer - dt);
          vihaanScoopMeshes.forEach(scoop => scoop.scale.setScalar(Math.max(0.02, vihaanEatingTimer / 4.5)));
          if (!vihaanEatingTimer) {
            vihaanConeGroup.visible = false;
            V.leftArm.arm.rotation.set(0, 0, V.leftArm.rest);
            V.leftArm.elbow.rotation.set(0, 0, 0);
          }
        }
      }
      if (trainState.ahaan) positionTrainRider(A, 1);
      if (!trainState.ahaan && !trainState.vihaan) clampPlayerSeparation();

      // Smoothly rotate Ahaan towards heading
      const ahaanInCar = carState.driver === A || carState.passenger === A;
      const ahaanInChopper = chopperState.rider === A;
      if (isWalking && !bikeState.riding && eBikeState.rider !== A && !ahaanInCar && !ahaanInChopper && (!currentActivity || activityPhase === 0)) {
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
      if (!bikeState.riding && eBikeState.rider !== A && !ahaanInCar && !ahaanInChopper && A.updateWave && (!currentActivity || activityPhase === 0)) {
        wavingActive = A.updateWave(dt, isWalking, calm());
      }

      // Update leg and arm walk cycle
      if (!bikeState.riding && eBikeState.rider !== A && !ahaanInCar && !ahaanInChopper && A.updateWalk && (!currentActivity || activityPhase === 0)) {
        A.updateWalk(isWalking, 8.5, walkDt);
      }

      if (eatingTimer > 0) {
        eatingTimer = Math.max(0, eatingTimer - dt);
        const size = Math.max(0.02, eatingTimer / 4.5);
        scoopMeshes.forEach(scoop => scoop.scale.setScalar(size));
        if (!eatingTimer) {
          coneGroup.visible = false;
          A.leftArm.arm.rotation.set(0, 0, A.leftArm.rest);
          A.leftArm.elbow.rotation.set(0, 0, 0);
        }
      }

      // Update playground activity
      if (currentActivity) {
        updatePlayActivity(dt);
      }

      if (!bikeState.riding && eBikeState.rider !== A && !ahaanInCar && !ahaanInChopper && (!currentActivity || activityPhase === 0)) {
        A.rig.position.y = groundHeightAt(A.rig.position.x,A.rig.position.z,rigBaseY);
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
      checkVihaanProximity();

      // Check current state boundary
      checkCurrentState(A.rig.position.x, A.rig.position.z);

      // Update camera in top view or close-up action view
      updateCameraPosition(dt);
      updatePlayerLabels();

      // Update trampoline sparkle particles
      const anyParticlesActive = updateParticles(dt);

      // Drift storybook clouds if motion is allowed
      if (breezeOn() && clouds) {
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

      if (cameraMoving || trainActive || isWalking || vihaanWalking || vihaanWaveTimer > 0 || vihaanBounceTime > 0 || vihaanEatingTimer > 0 || targetPos || Object.values(keys).some(v => v) || Object.values(vihaanKeys).some(v => v) || Object.values(bikeKeys).some(v => v) || Object.values(eBikeKeys).some(v => v) || Object.values(carKeys).some(v => v) || Object.values(chopperKeys).some(v => v) || chopperState.rider || chopperState.rotorSpeed > 0.02 || (bikeState.riding && bikeState.speed > 0.02) || (eBikeState.rider && eBikeState.speed > 0.02) || (carState.driver && carState.speed > 0.02) || eatingTimer > 0 || markerMat.opacity > 0 || isDragging || anyAnimActive || wavingActive || waveTimer > 0 || currentActivity || anyParticlesActive) {
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
      clampPlayerSeparation();
      updateCameraPosition(1);
      updateBubblePosition();
      render();
    }
    window.addEventListener("resize", () => {
      resize();
      if (typeof raf !== "undefined") wake();
    });
    resize();
    render();
    wake();

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
      startPlayActivity,
      stopPlayActivity,
      boostCurrentActivity,
      getA: () => A,
      getV: () => V,
      isTogetherEnabled: () => togetherEnabled,
      teleportVihaan: (x, z) => {
        vihaanBounceTime = 0;
        V.rig.position.set(x, groundHeightAt(x, z, rigBaseY), z);
        checkVihaanProximity();
        wake();
      },
      getVihaanBounceTime: () => vihaanBounceTime,
      getVihaanExitState: () => ({ timer: vihaanWaveTimer, exiting: vihaanExiting, visible: V.rig.visible }),
      getBikeState: () => ({ riding: bikeState.riding, x: bikeState.x, z: bikeState.z, speed: bikeState.speed, target: bikeState.target && { ...bikeState.target } }),
      getQuadState: () => ({ riding: quadState.riding, x: quadState.x, z: quadState.z, speed: quadState.speed, target: quadState.target && { ...quadState.target } }),
      getEbikeState: () => ({ riding: !!eBikeState.rider, x: eBikeState.x, z: eBikeState.z, speed: eBikeState.speed, target: eBikeState.target && { ...eBikeState.target } }),
      getCarState: () => ({ driving: !!carState.driver, x: carState.x, z: carState.z, speed: carState.speed, target: carState.target && { ...carState.target } }),
      getTrainState: () => ({ progress: trainState.progress, speed: trainState.speed, dwell: trainState.dwell, riders: { ahaan: trainState.ahaan, vihaan: trainState.vihaan }, dinoSounds: trainState.dinoSounds, smokePuffs: trainSmokePuffs.filter(puff => puff.mesh.visible).length, engineColor: trainBodyMats[0].color.getHex(), enginePosition: { x: trainCars[0].position.x, z: trainCars[0].position.z }, engineHeading: trainCars[0].rotation.y, currentStation: trainStations[trainState.currentStation]?.name || null, nextStation: trainStations[trainState.nextStation]?.name || null, stationCount: trainStations.length, stations: trainStations.map(station => station.name), routeLength: trainRouteLength, tieCount: sleepers.count, railCount: 2, carriageCount: trainCars.length }),
      getChopperState: () => ({ riding: !!chopperState.rider, x: chopperState.x, z: chopperState.z, heading: chopperState.heading, altitude: chopperState.altitude, speed: chopperState.speed, rotorSpeed: chopperState.rotorSpeed, target: chopperState.target && { ...chopperState.target } }),
      getVihaanNearbyItem: () => vihaanNearbyItem && vihaanNearbyItem.id,
      getSeparationLimit: maxPlayerSeparation,
      getGroundHeight: (x, z) => groundHeightAt(x, z, rigBaseY),
      attemptVihaanMove: (dx, dz) => moveActor(V, dx, dz),
      projectPlayers: () => {
        const project = actor => {
          const point = actor.rig.position.clone().project(camera);
          return { x: point.x, y: point.y };
        };
        return { ahaan: project(A), vihaan: project(V) };
      },
      getSwingPivot: () => swingPivot,
      setCustomCamera: (pos, target) => {
        if (pos && target) {
          cameraMode = "custom";
          actionCamPos.set(pos.x, pos.y, pos.z);
          actionCamTarget.set(target.x, target.y, target.z);
        } else {
          cameraMode = "normal";
        }
        wake();
      }
    };

    // The "Ahaan's Zoo" menu link (index.html#zoo) starts Ahaan at the zoo gate.
    function visitZooFromHash() {
      if (location.hash !== "#zoo") return;
      if (bikeState.riding || eBikeState.rider === A || carState.driver === A || carState.passenger === A || chopperState.rider === A) return;
      window.Park3D.teleportAhaan(-36.5, 36.5);
      const top = document.getElementById("top");
      if (top) top.scrollIntoView({ block: "start" });
    }
    window.addEventListener("hashchange", visitZooFromHash);
    visitZooFromHash();

    hero.classList.add("park-ready");
    greetRandom(true);
    updateBubblePosition();
  }
})();
