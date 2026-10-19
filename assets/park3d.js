/* ---- Home: 3D Arkansas and Neighbor States Interactive Map with Ahaan walking exploration.
   MVP Scope:
   - Arkansas (Center / Home) surrounded by Missouri, Tennessee, Mississippi, Louisiana, Texas, and Oklahoma.
   - Ahaan 3D model with photo-mapped likeness texture and articulated walk cycle.
   - Fixed-angle Follow Camera: intuitive isometric adventure view that tracks Ahaan as he walks.
   - Click-to-walk navigation + robust keyboard arrow controls (prevents page scrolling).
   - Sensory-friendly: motion only on user interaction; still in Calm mode. ---- */
(function () {
  const hero = document.querySelector(".home-hero"),
        canvas = document.getElementById("parkCanvas"),
        figBox = document.getElementById("ahaanFigure");
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
    scene.fog = new T.Fog(HORIZON, 45, 160);

    const camera = new T.PerspectiveCamera(40, 1, 0.1, 400);

    // ---- Sky Dome ----
    scene.add(new T.Mesh(new T.SphereGeometry(180, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new T.Color("#2072c7") },
        mid: { value: new T.Color("#6bb2e8") },
        bottom: { value: HORIZON }
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.06 ? mix(mid, top, smoothstep(0.06, 0.55, h)) : mix(bottom, mid, smoothstep(-0.04, 0.06, h)); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}"
    })));

    // ---- Lighting ----
    scene.add(new T.HemisphereLight(0xe4f2ff, 0x6e8a56, 0.9));
    const sun = new T.DirectionalLight(0xfff6e3, 1.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 90 });
    sun.shadow.bias = -0.0003;
    sun.position.set(-18, 28, 22);
    scene.add(sun);

    // ==========================================
    // 3D Arkansas & Neighboring States Map Data
    // ==========================================
    const STATES = [
      { id: "AR", name: "Arkansas", capital: "Little Rock", motto: "The Natural State", color: 0x5a9e4d, x: 0, z: 0, rad: 6.5, icon: "⭐" },
      { id: "MO", name: "Missouri", capital: "Jefferson City", motto: "Show-Me State", color: 0x4d8a54, x: 0, z: -15, rad: 6.2, icon: "🏛️" },
      { id: "TN", name: "Tennessee", capital: "Nashville", motto: "Volunteer State", color: 0x487d85, x: 15, z: -6, rad: 6.0, icon: "🎶" },
      { id: "MS", name: "Mississippi", capital: "Jackson", motto: "Magnolia State", color: 0x498a67, x: 14, z: 8, rad: 5.8, icon: "🌊" },
      { id: "LA", name: "Louisiana", capital: "Baton Rouge", motto: "Pelican State", color: 0x3d7b73, x: 0, z: 15, rad: 6.0, icon: "🌿" },
      { id: "TX", name: "Texas", capital: "Austin", motto: "The Lone Star State", color: 0xa4793f, x: -16, z: 8, rad: 7.2, icon: "🤠" },
      { id: "OK", name: "Oklahoma", capital: "Oklahoma City", motto: "Sooner State", color: 0x9c5f42, x: -16, z: -8, rad: 6.2, icon: "🌻" }
    ];

    const mapGroup = new T.Group();
    scene.add(mapGroup);

    // Surrounding grassy terrain
    const groundGeo = new T.PlaneGeometry(160, 160, 48, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new T.MeshStandardMaterial({ color: 0xb5cca8, roughness: 0.95 });
    const ground = new T.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    ground.position.y = 0;
    mapGroup.add(ground);

    // Build state parcel tiles and 3D landmarks
    const stateMeshes = [];
    STATES.forEach(st => {
      const tileGeo = new T.CylinderGeometry(st.rad, st.rad * 1.04, 0.35, 32);
      const tileMat = new T.MeshStandardMaterial({
        color: st.color,
        roughness: 0.8,
        flatShading: true
      });
      const tile = new T.Mesh(tileGeo, tileMat);
      tile.position.set(st.x, 0.18, st.z);
      tile.receiveShadow = true;
      tile.userData = st;
      mapGroup.add(tile);
      stateMeshes.push(tile);

      // Elevated border outline
      const ringGeo = new T.RingGeometry(st.rad * 0.97, st.rad * 1.03, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.position.set(st.x, 0.37, st.z);
      mapGroup.add(ring);

      // 3D Landmark & State Pin
      buildLandmark(st, mapGroup, T);
      createStatePin(st, mapGroup, T);
    });

    function buildLandmark(st, parent, T) {
      if (st.id === "AR") {
        // Arkansas: Home bench & tree
        const bench = new T.Group(); bench.position.set(st.x, 0.35, st.z - 3.2);
        const wood = new T.MeshStandardMaterial({ color: 0x8a532d });
        const seat = new T.Mesh(new T.BoxGeometry(2.4, 0.12, 0.7), wood); seat.position.y = 0.55;
        const back = new T.Mesh(new T.BoxGeometry(2.4, 0.6, 0.1), wood); back.position.set(0, 0.9, -0.32);
        bench.add(seat, back);
        bench.traverse(o => { o.castShadow = true; });
        parent.add(bench);
      } else if (st.id === "MO") {
        // Missouri: Gateway Arch
        const arch = new T.Mesh(
          new T.TorusGeometry(3.6, 0.38, 12, 28, Math.PI),
          new T.MeshStandardMaterial({ color: 0xd4d8de, metalness: 0.4, roughness: 0.3 })
        );
        arch.position.set(st.x, 0.35, st.z);
        arch.castShadow = true;
        parent.add(arch);
      } else if (st.id === "TX") {
        // Texas: Lone Star 3D monument
        const star = new T.Group(); star.position.set(st.x, 0.35, st.z);
        const starMesh = new T.Mesh(
          new T.ConeGeometry(1.6, 2.2, 5),
          new T.MeshStandardMaterial({ color: 0xffcf40, roughness: 0.4 })
        );
        starMesh.position.y = 1.3;
        starMesh.rotation.y = Math.PI / 5;
        star.add(starMesh);
        star.traverse(o => { o.castShadow = true; });
        parent.add(star);
      } else if (st.id === "TN") {
        // Tennessee: Acoustic Guitar landmark
        const guitar = new T.Group(); guitar.position.set(st.x, 0.35, st.z);
        const body = new T.Mesh(new T.CylinderGeometry(1.1, 1.4, 0.35, 16), new T.MeshStandardMaterial({ color: 0xb5632d }));
        body.position.y = 0.8; body.rotation.z = 0.4;
        const neck = new T.Mesh(new T.BoxGeometry(0.24, 2.4, 0.18), new T.MeshStandardMaterial({ color: 0x3d2314 }));
        neck.position.set(-0.5, 1.8, 0); neck.rotation.z = 0.4;
        guitar.add(body, neck);
        guitar.traverse(o => { o.castShadow = true; });
        parent.add(guitar);
      } else if (st.id === "LA") {
        // Louisiana: Riverboat paddle landmark
        const boat = new T.Group(); boat.position.set(st.x, 0.35, st.z);
        const hull = new T.Mesh(new T.BoxGeometry(2.8, 0.6, 1.2), new T.MeshStandardMaterial({ color: 0xffffff })); hull.position.y = 0.4;
        const cabin = new T.Mesh(new T.BoxGeometry(1.6, 0.8, 0.8), new T.MeshStandardMaterial({ color: 0xd9534f })); cabin.position.y = 0.9;
        boat.add(hull, cabin);
        boat.traverse(o => { o.castShadow = true; });
        parent.add(boat);
      } else if (st.id === "OK") {
        // Oklahoma: Wind turbine
        const turbine = new T.Group(); turbine.position.set(st.x, 0.35, st.z);
        const pole = new T.Mesh(new T.CylinderGeometry(0.12, 0.22, 3.8, 12), new T.MeshStandardMaterial({ color: 0xf0f0f0 })); pole.position.y = 1.9;
        const blades = new T.Mesh(new T.BoxGeometry(2.4, 0.15, 0.05), new T.MeshStandardMaterial({ color: 0xffffff })); blades.position.y = 3.8;
        turbine.add(pole, blades);
        turbine.traverse(o => { o.castShadow = true; });
        parent.add(turbine);
      } else if (st.id === "MS") {
        // Mississippi: River Lighthouse
        const light = new T.Group(); light.position.set(st.x, 0.35, st.z);
        const tower = new T.Mesh(new T.CylinderGeometry(0.5, 0.9, 3.2, 12), new T.MeshStandardMaterial({ color: 0xffffff })); tower.position.y = 1.6;
        const top = new T.Mesh(new T.CylinderGeometry(0.65, 0.65, 0.4, 12), new T.MeshStandardMaterial({ color: 0x2b4c7e })); top.position.y = 3.3;
        light.add(tower, top);
        light.traverse(o => { o.castShadow = true; });
        parent.add(light);
      }
    }

    function createStatePin(st, parent, T) {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(255, 255, 255, 0.95)";
      g.roundRect(4, 4, 248, 120, 20);
      g.fill();
      g.strokeStyle = "#2f7fcf"; g.lineWidth = 6;
      g.stroke();
      g.fillStyle = "#1b2a4a"; g.font = "bold 32px sans-serif"; g.textAlign = "center";
      g.fillText(st.name, 128, 52);
      g.fillStyle = "#4a6b82"; g.font = "600 24px sans-serif";
      g.fillText(st.capital, 128, 92);

      const tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      const pinMat = new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide });
      const pin = new T.Mesh(new T.PlaneGeometry(2.6, 1.3), pinMat);
      pin.position.set(st.x, 3.2, st.z + st.rad * 0.45);
      parent.add(pin);
    }

    // Target Click Marker
    const markerGeo = new T.RingGeometry(0.3, 0.65, 24);
    markerGeo.rotateX(-Math.PI / 2);
    const markerMat = new T.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0 });
    const marker = new T.Mesh(markerGeo, markerMat);
    marker.position.y = 0.4;
    scene.add(marker);

    // ==========================================
    // 3D Ahaan Character Setup
    // ==========================================
    const A = window.AhaanModel.build(T);
    const ahaanScale = 0.52;
    A.rig.scale.setScalar(ahaanScale);

    // Compute ground surface height so Ahaan's shoes rest ON the ground (not buried)
    const groundLevelY = 0.35; // top of state tile
    const rigBaseY = groundLevelY - (A.footY * ahaanScale); // ~ 0.35 - (-6.95 * 0.52) ≈ 3.96
    A.rig.position.set(0, rigBaseY, 0);

    // Initially face towards user / camera (rotation = Math.PI)
    let ahaanAngle = Math.PI;
    A.rig.rotation.y = ahaanAngle;
    scene.add(A.rig);

    // Walking and Camera State
    let targetPos = null;
    let isWalking = false;
    const walkSpeed = 6.2;
    const keys = { up: false, down: false, left: false, right: false };
    let currentStateId = "AR";

    // Camera setup: elevated isometric-style follow view
    const camDistance = 14;
    const camHeight = 7.5;
    const cameraTarget = new T.Vector3(0, 2.2, 0);
    camera.position.set(0, rigBaseY + camHeight, camDistance);
    camera.lookAt(cameraTarget);

    // ---- Raycasting for Click-to-Walk ----
    const raycaster = new T.Raycaster();
    const mouse = new T.Vector2();

    function onPointerDown(e) {
      if (calm() || e.button !== 0) return;
      if (e.target.closest && e.target.closest(".candy-blanket, .nav, .breeze-pill, button, a")) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects([ground, ...stateMeshes]);
      if (hits.length > 0) {
        const hit = hits[0];
        targetPos = new T.Vector3(hit.point.x, rigBaseY, hit.point.z);
        marker.position.set(hit.point.x, 0.4, hit.point.z);
        markerMat.opacity = 0.9;
        wake();
      }
    }
    // Listen on hero element so clicks anywhere on the background register
    hero.addEventListener("pointerdown", onPointerDown);

    // ---- Keyboard Navigation (Robust across all platforms) ----
    function handleKey(e, isDown) {
      if (calm()) return;
      const code = e.code || "";
      const key = e.key || "";
      let handled = false;

      if (code === "ArrowUp" || key === "ArrowUp" || code === "KeyW" || key === "w" || key === "W") {
        keys.up = isDown; handled = true;
      }
      if (code === "ArrowDown" || key === "ArrowDown" || code === "KeyS" || key === "s" || key === "S") {
        keys.down = isDown; handled = true;
      }
      if (code === "ArrowLeft" || key === "ArrowLeft" || code === "KeyA" || key === "a" || key === "A") {
        keys.left = isDown; handled = true;
      }
      if (code === "ArrowRight" || key === "ArrowRight" || code === "KeyD" || key === "d" || key === "D") {
        keys.right = isDown; handled = true;
      }

      if (handled) {
        if (isDown) e.preventDefault(); // Prevent page scrolling!
        targetPos = null;
        wake();
      }
    }
    window.addEventListener("keydown", e => handleKey(e, true));
    window.addEventListener("keyup", e => handleKey(e, false));

    // ---- State Detection & Toast Notification ----
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
      toast.innerHTML = `<span class="icon">${st.icon}</span> <b>${st.name}</b> · Capital: <u>${st.capital}</u> (${st.motto})`;
      toast.classList.add("show");
      clearTimeout(toast._tid);
      toast._tid = setTimeout(() => toast.classList.remove("show"), 3600);
    }

    // ==========================================
    // Main Animation & Follow Camera Loop
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

      // Rotate Ahaan smoothly towards moving heading
      if (isWalking) {
        const curRot = A.rig.rotation.y;
        let diff = ahaanAngle - curRot;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        A.rig.rotation.y += diff * Math.min(1, dt * 12);
      }

      // Update leg and arm walk cycle
      if (A.updateWalk) A.updateWalk(isWalking, 8.5, dt);

      // Check state boundary
      checkCurrentState(A.rig.position.x, A.rig.position.z);

      // ---- Follow Camera ----
      const desiredCamPos = new T.Vector3(
        A.rig.position.x,
        A.rig.position.y + camHeight,
        A.rig.position.z + camDistance
      );
      camera.position.lerp(desiredCamPos, Math.min(1, dt * 3.5));
      cameraTarget.lerp(new T.Vector3(A.rig.position.x, A.rig.position.y + 1.2, A.rig.position.z), Math.min(1, dt * 4.5));
      camera.lookAt(cameraTarget);

      render();

      if (isWalking || targetPos || Object.values(keys).some(v => v) || markerMat.opacity > 0) {
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

    hero.classList.add("park-ready");
  }
})();
