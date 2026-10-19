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
      { id: "AR", name: "Arkansas", capital: "Little Rock", motto: "The Natural State", color: 0x5a9e4d, x: 0, z: 0, rad: 6.2, icon: "⭐" },
      { id: "MO", name: "Missouri", capital: "Jefferson City", motto: "Show-Me State", color: 0x4d8a54, x: 0, z: -13.5, rad: 5.6, icon: "🏛️" },
      { id: "TN", name: "Tennessee", capital: "Nashville", motto: "Volunteer State", color: 0x487d85, x: 13.5, z: -5.8, rad: 5.4, icon: "🎶" },
      { id: "MS", name: "Mississippi", capital: "Jackson", motto: "Magnolia State", color: 0x498a67, x: 12.8, z: 7.2, rad: 5.4, icon: "🌊" },
      { id: "LA", name: "Louisiana", capital: "Baton Rouge", motto: "Pelican State", color: 0x3d7b73, x: 0, z: 13.5, rad: 5.6, icon: "🌿" },
      { id: "TX", name: "Texas", capital: "Austin", motto: "The Lone Star State", color: 0xa4793f, x: -13.8, z: 7.2, rad: 6.2, icon: "🤠" },
      { id: "OK", name: "Oklahoma", capital: "Oklahoma City", motto: "Sooner State", color: 0x9c5f42, x: -13.8, z: -7.2, rad: 5.6, icon: "🌻" }
    ];

    const mapGroup = new T.Group();
    scene.add(mapGroup);

    // Surrounding grassy terrain
    const groundGeo = new T.PlaneGeometry(180, 180, 48, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new T.MeshStandardMaterial({ color: 0xb5cca8, roughness: 0.95 });
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

    function buildLandmark(st, parent, T) {
      if (st.id === "AR") {
        const bench = new T.Group(); bench.position.set(st.x, 0.45, st.z - 2.8);
        const wood = new T.MeshStandardMaterial({ color: 0x8a532d });
        const seat = new T.Mesh(new T.BoxGeometry(2.4, 0.15, 0.7), wood); seat.position.y = 0.55;
        const back = new T.Mesh(new T.BoxGeometry(2.4, 0.6, 0.12), wood); back.position.set(0, 0.9, -0.32);
        bench.add(seat, back);
        bench.traverse(o => { o.castShadow = true; });
        parent.add(bench);
      } else if (st.id === "MO") {
        const arch = new T.Mesh(
          new T.TorusGeometry(3.6, 0.42, 12, 32, Math.PI),
          new T.MeshStandardMaterial({ color: 0xdce2ea, metalness: 0.45, roughness: 0.25 })
        );
        arch.position.set(st.x, 0.45, st.z);
        arch.castShadow = true;
        parent.add(arch);
      } else if (st.id === "TX") {
        const star = new T.Group(); star.position.set(st.x, 0.45, st.z);
        const starMesh = new T.Mesh(
          new T.ConeGeometry(1.8, 2.4, 5),
          new T.MeshStandardMaterial({ color: 0xffcf40, roughness: 0.35 })
        );
        starMesh.position.y = 1.4;
        starMesh.rotation.y = Math.PI / 5;
        star.add(starMesh);
        star.traverse(o => { o.castShadow = true; });
        parent.add(star);
      } else if (st.id === "TN") {
        const guitar = new T.Group(); guitar.position.set(st.x, 0.45, st.z);
        const body = new T.Mesh(new T.CylinderGeometry(1.1, 1.4, 0.35, 16), new T.MeshStandardMaterial({ color: 0xb5632d }));
        body.position.y = 0.8; body.rotation.z = 0.35;
        const neck = new T.Mesh(new T.BoxGeometry(0.25, 2.6, 0.2), new T.MeshStandardMaterial({ color: 0x3d2314 }));
        neck.position.set(-0.55, 1.9, 0); neck.rotation.z = 0.35;
        guitar.add(body, neck);
        guitar.traverse(o => { o.castShadow = true; });
        parent.add(guitar);
      } else if (st.id === "LA") {
        const boat = new T.Group(); boat.position.set(st.x, 0.45, st.z);
        const hull = new T.Mesh(new T.BoxGeometry(3.0, 0.65, 1.3), new T.MeshStandardMaterial({ color: 0xffffff })); hull.position.y = 0.4;
        const cabin = new T.Mesh(new T.BoxGeometry(1.8, 0.85, 0.85), new T.MeshStandardMaterial({ color: 0xd9534f })); cabin.position.y = 0.95;
        boat.add(hull, cabin);
        boat.traverse(o => { o.castShadow = true; });
        parent.add(boat);
      } else if (st.id === "OK") {
        const turbine = new T.Group(); turbine.position.set(st.x, 0.45, st.z);
        const pole = new T.Mesh(new T.CylinderGeometry(0.14, 0.25, 4.0, 12), new T.MeshStandardMaterial({ color: 0xf5f5f5 })); pole.position.y = 2.0;
        const blades = new T.Mesh(new T.BoxGeometry(2.6, 0.16, 0.05), new T.MeshStandardMaterial({ color: 0xffffff })); blades.position.y = 4.0;
        turbine.add(pole, blades);
        turbine.traverse(o => { o.castShadow = true; });
        parent.add(turbine);
      } else if (st.id === "MS") {
        const light = new T.Group(); light.position.set(st.x, 0.45, st.z);
        const tower = new T.Mesh(new T.CylinderGeometry(0.55, 0.95, 3.4, 12), new T.MeshStandardMaterial({ color: 0xffffff })); tower.position.y = 1.7;
        const top = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 0.45, 12), new T.MeshStandardMaterial({ color: 0x2b4c7e })); top.position.y = 3.4;
        light.add(tower, top);
        light.traverse(o => { o.castShadow = true; });
        parent.add(light);
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
    const ahaanScale = 0.54;
    A.rig.scale.setScalar(ahaanScale);

    // Baseline height so Ahaan stands upright on the state tile
    const groundLevelY = 0.45;
    const rigBaseY = groundLevelY - (A.footY * ahaanScale); // ~ 0.45 - (-6.95 * 0.54) ≈ 4.2
    A.rig.position.set(0, rigBaseY, 0);

    let ahaanAngle = 0; // 0 = facing forward/down
    A.rig.rotation.y = ahaanAngle;
    scene.add(A.rig);

    // Walking State
    let targetPos = null;
    let isWalking = false;
    const walkSpeed = 6.8;
    const keys = { up: false, down: false, left: false, right: false };
    let currentStateId = "AR";

    // ==========================================
    // Top-View Camera & Interactive Controls
    // ==========================================
    let zoomLevel = 1.0; // 0.7 = close-up, 1.0 = normal, 1.4 = wide
    const baseCamY = 28;
    const baseCamZ = 22;
    let panOffset = new T.Vector2(0, 0);
    const cameraTarget = new T.Vector3(0, 0, 0);

    function updateCameraPosition() {
      const targetX = A.rig.position.x * 0.45 + panOffset.x;
      const targetZ = A.rig.position.z * 0.45 + panOffset.y;
      cameraTarget.set(targetX, 0.5, targetZ);
      camera.position.set(targetX, baseCamY * zoomLevel, targetZ + baseCamZ * zoomLevel);
      camera.lookAt(cameraTarget);
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
      if (e.target.closest && e.target.closest(".candy-blanket, .nav, .breeze-pill, .map-controls, button, a")) return;

      isPointerDown = true;
      isDragging = false;
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
      downPos.x = e.clientX;
      downPos.y = e.clientY;
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

      // If user tapped without dragging: raycast walk destination
      if (!isDragging && (e.button === 0 || e.button === undefined)) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects([ground, ...stateMeshes]);
        if (hits.length > 0) {
          const hit = hits[0];
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

      // Up = North (towards Missouri, -Z)
      if (code === "ArrowUp" || key === "ArrowUp" || code === "KeyW" || key === "w" || key === "W") {
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
      toast.innerHTML = `<span class="icon">${st.icon}</span> <b>${st.name}</b> · Capital: <u>${st.capital}</u> (${st.motto})`;
      toast.classList.add("show");
      clearTimeout(toast._tid);
      toast._tid = setTimeout(() => toast.classList.remove("show"), 3600);
    }

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
      if (isWalking) {
        const curRot = A.rig.rotation.y;
        let diff = ahaanAngle - curRot;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        A.rig.rotation.y += diff * Math.min(1, dt * 14);
      }

      // Update leg and arm walk cycle
      if (A.updateWalk) A.updateWalk(isWalking, 8.5, dt);

      // Check current state boundary
      checkCurrentState(A.rig.position.x, A.rig.position.z);

      // Update camera in top view
      updateCameraPosition();

      render();

      if (isWalking || targetPos || Object.values(keys).some(v => v) || markerMat.opacity > 0 || isDragging) {
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
