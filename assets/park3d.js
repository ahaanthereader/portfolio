/* ---- Home: 3D Arkansas and Neighbor States Interactive Map with Ahaan walking exploration.
   MVP Scope:
   - Arkansas (Center / Home) surrounded by Missouri, Tennessee, Mississippi, Louisiana, Texas, and Oklahoma.
   - Ahaan 3D model with photo-mapped likeness texture and articulated walk cycle.
   - Follow Camera (Option B) smoothly tracking behind Ahaan as he walks.
   - Click-to-walk navigation + keyboard arrow controls.
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
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new T.Scene();
    const HORIZON = new T.Color("#dbeaf2");
    scene.fog = new T.Fog(HORIZON, 35, 120);

    const camera = new T.PerspectiveCamera(38, 1, 0.1, 350);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 1.5, 0);

    // ---- Sky Dome ----
    scene.add(new T.Mesh(new T.SphereGeometry(160, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new T.Color("#2575c9") },
        mid: { value: new T.Color("#6bb2e8") },
        bottom: { value: HORIZON }
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.08 ? mix(mid, top, smoothstep(0.08, 0.6, h)) : mix(bottom, mid, smoothstep(-0.04, 0.08, h)); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}"
    })));

    // ---- Lighting ----
    scene.add(new T.HemisphereLight(0xe4f2ff, 0x6e8a56, 0.85));
    const sun = new T.DirectionalLight(0xfff6e3, 1.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25, near: 1, far: 80 });
    sun.shadow.bias = -0.0003;
    sun.position.set(-15, 25, 20);
    scene.add(sun);

    // ==========================================
    // 3D Arkansas & Neighboring States Map Data
    // ==========================================
    const STATES = [
      { id: "AR", name: "Arkansas", capital: "Little Rock", motto: "The Natural State", color: 0x5a9e4d, x: 0, z: 0, rad: 6.2, icon: "⭐" },
      { id: "MO", name: "Missouri", capital: "Jefferson City", motto: "Show-Me State", color: 0x4d8a54, x: 1, z: -16, rad: 6.0, icon: "🏛️" },
      { id: "TN", name: "Tennessee", capital: "Nashville", motto: "Volunteer State", color: 0x487d85, x: 17, z: -7, rad: 6.0, icon: "🎶" },
      { id: "MS", name: "Mississippi", capital: "Jackson", motto: "Magnolia State", color: 0x498a67, x: 16, z: 9, rad: 5.8, icon: "🌊" },
      { id: "LA", name: "Louisiana", capital: "Baton Rouge", motto: "Pelican State", color: 0x3d7b73, x: 0, z: 17, rad: 6.0, icon: "🌿" },
      { id: "TX", name: "Texas", capital: "Austin", motto: "The Lone Star State", color: 0xa4793f, x: -18, z: 10, rad: 7.2, icon: "🤠" },
      { id: "OK", name: "Oklahoma", capital: "Oklahoma City", motto: "Sooner State", color: 0x9c5f42, x: -18, z: -8, rad: 6.0, icon: "🌻" }
    ];

    // ---- Base Map Terrain ----
    const mapGroup = new T.Group();
    scene.add(mapGroup);

    // Ground plane
    const groundGeo = new T.PlaneGeometry(120, 120, 48, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new T.MeshStandardMaterial({ color: 0xc9dcc2, roughness: 0.95 });
    const ground = new T.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    ground.position.y = -0.05;
    mapGroup.add(ground);

    // Build state parcel tiles and 3D landmarks
    const stateMeshes = [];
    STATES.forEach(st => {
      const tileGeo = new T.CylinderGeometry(st.rad, st.rad * 1.05, 0.22, 28);
      const tileMat = new T.MeshStandardMaterial({
        color: st.color,
        roughness: 0.85,
        flatShading: true
      });
      const tile = new T.Mesh(tileGeo, tileMat);
      tile.position.set(st.x, 0.08, st.z);
      tile.receiveShadow = true;
      tile.userData = st;
      mapGroup.add(tile);
      stateMeshes.push(tile);

      // Border outline
      const ringGeo = new T.RingGeometry(st.rad * 0.98, st.rad * 1.04, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.position.set(st.x, 0.22, st.z);
      mapGroup.add(ring);

      // 3D Landmark per state
      buildLandmark(st, mapGroup, T);

      // State label pin
      createStatePin(st, mapGroup, T);
    });

    function buildLandmark(st, parent, T) {
      const m = new T.MeshStandardMaterial({ roughness: 0.7 });
      if (st.id === "AR") {
        // Arkansas: Home bench & swing
        const bench = new T.Group(); bench.position.set(st.x, 0.2, st.z - 2.5);
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
        arch.position.set(st.x, 0.2, st.z);
        arch.castShadow = true;
        parent.add(arch);
      } else if (st.id === "TX") {
        // Texas: Lone Star 3D monument
        const star = new T.Group(); star.position.set(st.x, 0.2, st.z);
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
        const guitar = new T.Group(); guitar.position.set(st.x, 0.2, st.z);
        const body = new T.Mesh(new T.CylinderGeometry(1.1, 1.4, 0.35, 16), new T.MeshStandardMaterial({ color: 0xb5632d }));
        body.position.y = 0.8; body.rotation.z = 0.4;
        const neck = new T.Mesh(new T.BoxGeometry(0.24, 2.4, 0.18), new T.MeshStandardMaterial({ color: 0x3d2314 }));
        neck.position.set(-0.5, 1.8, 0); neck.rotation.z = 0.4;
        guitar.add(body, neck);
        guitar.traverse(o => { o.castShadow = true; });
        parent.add(guitar);
      } else if (st.id === "LA") {
        // Louisiana: Riverboat paddle landmark
        const boat = new T.Group(); boat.position.set(st.x, 0.2, st.z);
        const hull = new T.Mesh(new T.BoxGeometry(2.8, 0.6, 1.2), new T.MeshStandardMaterial({ color: 0xffffff })); hull.position.y = 0.4;
        const cabin = new T.Mesh(new T.BoxGeometry(1.6, 0.8, 0.8), new T.MeshStandardMaterial({ color: 0xd9534f })); cabin.position.y = 0.9;
        boat.add(hull, cabin);
        boat.traverse(o => { o.castShadow = true; });
        parent.add(boat);
      } else if (st.id === "OK") {
        // Oklahoma: Wind turbine
        const turbine = new T.Group(); turbine.position.set(st.x, 0.2, st.z);
        const pole = new T.Mesh(new T.CylinderGeometry(0.12, 0.22, 3.8, 12), new T.MeshStandardMaterial({ color: 0xf0f0f0 })); pole.position.y = 1.9;
        const blades = new T.Mesh(new T.BoxGeometry(2.4, 0.15, 0.05), new T.MeshStandardMaterial({ color: 0xffffff })); blades.position.y = 3.8;
        turbine.add(pole, blades);
        turbine.traverse(o => { o.castShadow = true; });
        parent.add(turbine);
      } else if (st.id === "MS") {
        // Mississippi: River Lighthouse
        const light = new T.Group(); light.position.set(st.x, 0.2, st.z);
        const tower = new T.Mesh(new T.CylinderGeometry(0.5, 0.9, 3.2, 12), new T.MeshStandardMaterial({ color: 0xffffff })); tower.position.y = 1.6;
        const top = new T.Mesh(new T.CylinderGeometry(0.65, 0.65, 0.4, 12), new T.MeshStandardMaterial({ color: 0x2b4c7e })); top.position.y = 3.3;
        light.add(tower, top);
        light.traverse(o => { o.castShadow = true; });
        parent.add(light);
      }
    }

    function createStatePin(st, parent, T) {
      // Canvas texture for state name & capital
      const c = document.createElement("canvas");
      c.width = 256; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(255, 255, 255, 0.92)";
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
      const pin = new T.Mesh(new T.PlaneGeometry(2.4, 1.2), pinMat);
      pin.position.set(st.x, 2.8, st.z + st.rad * 0.4);
      parent.add(pin);
    }

    // Target Click Marker (pulsing ring where Ahaan is walking)
    const markerGeo = new T.RingGeometry(0.3, 0.6, 24);
    markerGeo.rotateX(-Math.PI / 2);
    const markerMat = new T.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0 });
    const marker = new T.Mesh(markerGeo, markerMat);
    marker.position.y = 0.25;
    scene.add(marker);

    // ==========================================
    // 3D Ahaan Character Setup
    // ==========================================
    const A = window.AhaanModel.build(T);
    A.rig.scale.setScalar(0.72);
    // Start standing in Arkansas (center)
    A.rig.position.set(0, 0, 0);
    scene.add(A.rig);

    // Navigation and Walking State
    let targetPos = null;
    let isWalking = false;
    let ahaanAngle = 0;
    const walkSpeed = 5.8;
    const keys = { forward: false, backward: false, left: false, right: false };
    let currentStateId = "AR";

    // Follow Camera state (Option B)
    const cameraTarget = new T.Vector3(0, 1.8, 0);
    const cameraOffset = new T.Vector3(0, 4.2, 9.2);

    // Raycasting for Click-to-Walk
    const raycaster = new T.Raycaster();
    const mouse = new T.Vector2();

    function onPointerDown(e) {
      if (calm() || e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects([ground, ...stateMeshes]);
      if (hits.length > 0) {
        const hit = hits[0];
        targetPos = new T.Vector3(hit.point.x, 0, hit.point.z);
        marker.position.set(targetPos.x, 0.25, targetPos.z);
        markerMat.opacity = 0.85;
        wake();
      }
    }
    canvas.addEventListener("pointerdown", onPointerDown);

    // Keyboard navigation
    window.addEventListener("keydown", e => {
      if (calm()) return;
      if (["ArrowUp", "KeyW"].includes(e.code)) keys.forward = true;
      if (["ArrowDown", "KeyS"].includes(e.code)) keys.backward = true;
      if (["ArrowLeft", "KeyA"].includes(e.code)) keys.left = true;
      if (["ArrowRight", "KeyD"].includes(e.code)) keys.right = true;
      if (Object.values(keys).some(v => v)) { targetPos = null; wake(); }
    });
    window.addEventListener("keyup", e => {
      if (["ArrowUp", "KeyW"].includes(e.code)) keys.forward = false;
      if (["ArrowDown", "KeyS"].includes(e.code)) keys.backward = false;
      if (["ArrowLeft", "KeyA"].includes(e.code)) keys.left = false;
      if (["ArrowRight", "KeyD"].includes(e.code)) keys.right = false;
    });

    // State Detection & Notification Banner
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
      toast._tid = setTimeout(() => toast.classList.remove("show"), 3800);
    }

    // ==========================================
    // Animation & Follow Camera Loop
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
      if (keys.forward) moveZ -= 1;
      if (keys.backward) moveZ += 1;
      if (keys.left) moveX -= 1;
      if (keys.right) moveX += 1;

      if (moveX !== 0 || moveZ !== 0) {
        // Direct keyboard walk
        isWalking = true;
        const len = Math.hypot(moveX, moveZ);
        moveX /= len; moveZ /= len;
        ahaanAngle = Math.atan2(moveX, moveZ);
        A.rig.position.x += moveX * walkSpeed * dt;
        A.rig.position.z += moveZ * walkSpeed * dt;
      } else if (targetPos) {
        // Walk towards click target
        const dx = targetPos.x - A.rig.position.x;
        const dz = targetPos.z - A.rig.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.4) {
          isWalking = true;
          ahaanAngle = Math.atan2(dx / dist, dz / dist);
          A.rig.position.x += (dx / dist) * walkSpeed * dt;
          A.rig.position.z += (dz / dist) * walkSpeed * dt;
          markerMat.opacity = Math.max(0.2, markerMat.opacity - dt * 0.3);
        } else {
          isWalking = false;
          targetPos = null;
          markerMat.opacity = 0;
        }
      } else {
        isWalking = false;
      }

      // Rotate Ahaan towards heading
      if (isWalking) {
        const curRot = A.rig.rotation.y;
        let diff = ahaanAngle - curRot;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        A.rig.rotation.y += diff * Math.min(1, dt * 10);
      }

      // Update leg and arm walk cycle
      if (A.updateWalk) A.updateWalk(isWalking, 8.5, dt);

      // Check current state border crossing
      checkCurrentState(A.rig.position.x, A.rig.position.z);

      // ---- Follow Camera (Option B) ----
      const desiredCamPos = new T.Vector3(
        A.rig.position.x - Math.sin(A.rig.rotation.y) * 8.5,
        A.rig.position.y + 4.2,
        A.rig.position.z - Math.cos(A.rig.rotation.y) * 8.5
      );
      camera.position.lerp(desiredCamPos, Math.min(1, dt * 3.5));
      cameraTarget.lerp(new T.Vector3(A.rig.position.x, A.rig.position.y + 1.8, A.rig.position.z), Math.min(1, dt * 5));
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
