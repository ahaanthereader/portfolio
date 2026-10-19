/* ---- 3D Ahaan model: a kid-proportioned figure with photo-mapped likeness texture and articulated walking rig.
   Likeness features (derived from Ahaan's reference photo):
   - Warm golden-brown skin, slender oval face, large dark-brown almond eyes, arched dark brows.
   - Neat short black hair with soft forward fringe, ears slightly out, open warm smile.
   - Wide maroon-and-cream striped polo shirt with solid maroon collar, light jeans, navy sneakers.
   - Articulated legs and arms for walking across the state map. ---- */
window.AhaanModel = {
  build(T) {
    const SKIN = 0xc98d64, SKIN_D = 0xb87b53, HAIR = 0x16100d, CREAM = 0xf2ecda, COLLAR = 0x43121f, JEANS = 0x8fb0d4, JEANS_D = 0x7b9cc4, NAVY = 0x24345a;
    const mat = (c, r) => new T.MeshStandardMaterial({ color: c, roughness: r == null ? 0.75 : r });
    const part = (geo, m, x, y, z, sx, sy, sz) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); if (sx) o.scale.set(sx, sy, sz); return o; };
    const sphere = new T.SphereGeometry(1, 32, 24);
    const skin = new T.MeshStandardMaterial({ color: SKIN, roughness: 0.55, emissive: 0x3a1608, emissiveIntensity: 0.16 });
    const skinD = new T.MeshStandardMaterial({ color: SKIN_D, roughness: 0.62, emissive: 0x2a1006, emissiveIntensity: 0.14 });
    const hair = mat(HAIR, 0.72), hair2 = mat(0x241a14, 0.78);

    function stripes(bands) {
      const c = document.createElement("canvas"); c.width = 16; c.height = bands * 32;
      const g = c.getContext("2d");
      for (let i = 0; i < bands; i++) {
        g.fillStyle = i % 2 ? "#f2ecda" : "#5a1d2d";
        g.fillRect(0, i * 32, 16, 32);
      }
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
    }
    const rig = new T.Group();

    // ---- Torso: wide maroon-and-cream striped polo shirt ----
    const prof = [[0.001, -1.40], [0.5, -1.42], [1.0, -1.56], [1.18, -1.84], [1.16, -2.2], [1.06, -2.8], [1.0, -3.4], [1.03, -3.86], [0.001, -3.92]].reverse().map(p => new T.Vector2(p[0], p[1]));
    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), new T.MeshStandardMaterial({ map: stripes(8), roughness: 0.9 }));
    torso.scale.z = 0.72; rig.add(torso);
    const sleeveTex = stripes(6); sleeveTex.repeat.set(1, 1);
    const sleeveMat = new T.MeshStandardMaterial({ map: sleeveTex, roughness: 0.9 });
    rig.add(part(new T.CylinderGeometry(0.36, 0.4, 0.5, 24), skinD, 0, -1.2, 0));
    const collar = part(new T.TorusGeometry(0.42, 0.1, 12, 32), mat(COLLAR, 0.85), 0, -1.45, 0.02, 1.08, 1, 0.78);
    collar.rotation.x = Math.PI / 2; rig.add(collar);
    [-1, 1].forEach(s => {
      const f = part(new T.BoxGeometry(0.34, 0.2, 0.03), mat(COLLAR, 0.85), s * 0.17, -1.6, 0.6);
      f.rotation.set(-0.25, 0, s * 0.55); rig.add(f);
    });
    // white button placket with buttons
    rig.add(part(new T.BoxGeometry(0.16, 0.62, 0.04), mat(CREAM, 0.9), 0, -1.98, 0.79));
    [-1.78, -2.1].forEach(y => rig.add(part(new T.SphereGeometry(0.04, 12, 10), mat(0xffffff, 0.4), 0, y, 0.82)));

    // ---- Arms: articulated shoulders and elbows ----
    function makeArm(side) {
      const arm = new T.Group(); arm.position.set(side * 1.1, -1.76, 0);
      const rest = side * 0.1; arm.rotation.z = rest;
      arm.add(part(new T.CapsuleGeometry(0.3, 0.3, 6, 14), sleeveMat, 0, -0.25, 0));
      arm.add(part(new T.CapsuleGeometry(0.18, 0.5, 6, 12), skin, 0, -0.75, 0));
      const elbow = new T.Group(); elbow.position.set(0, -1.08, 0); arm.add(elbow);
      elbow.add(part(new T.CapsuleGeometry(0.165, 0.7, 6, 12), skin, 0, -0.45, 0));
      const hand = new T.Group(); hand.position.set(0, -0.92, 0.02); elbow.add(hand);
      hand.add(part(sphere, skin, 0, -0.08, 0, 0.15, 0.17, 0.075));
      const finger = new T.CapsuleGeometry(0.038, 0.1, 4, 8);
      for (let f = 0; f < 4; f++) {
        const fg = part(finger, skin, (f - 1.5) * 0.068, -0.26, 0.01);
        fg.rotation.x = 0.35 + f * 0.04; hand.add(fg);
      }
      const thumb = part(new T.CapsuleGeometry(0.042, 0.1, 4, 8), skin, -side * 0.13, -0.1, 0.04);
      thumb.rotation.set(0.3, 0, -side * 0.7); hand.add(thumb);
      rig.add(arm); return { arm, elbow, rest };
    }
    const wavingArm = makeArm(-1), leftArm = makeArm(1);

    // ---- Articulated Legs: hips, knees, feet for walking ----
    // Pelvis base
    rig.add(part(sphere, mat(JEANS, 0.9), 0, -3.98, 0, 0.98, 0.42, 0.66));

    function makeLeg(side) {
      const hip = new T.Group(); hip.position.set(side * 0.45, -4.0, 0); rig.add(hip);
      // Thigh
      const thigh = part(new T.CapsuleGeometry(0.35, 1.25, 8, 14), mat(side < 0 ? JEANS : JEANS_D, 0.9), 0, -0.68, 0);
      hip.add(thigh);
      // Knee & Shin
      const knee = new T.Group(); knee.position.set(0, -1.35, 0); hip.add(knee);
      const shin = part(new T.CapsuleGeometry(0.32, 1.2, 8, 14), mat(side < 0 ? JEANS : JEANS_D, 0.9), 0, -0.65, 0);
      knee.add(shin);
      // Sneaker
      const foot = new T.Group(); foot.position.set(0, -1.35, 0.14); knee.add(foot);
      foot.add(part(sphere, mat(NAVY, 0.6), 0, 0, 0, 0.4, 0.22, 0.66));
      foot.add(part(sphere, mat(0xf4f2ec, 0.7), 0, -0.17, 0, 0.43, 0.08, 0.69));
      foot.add(part(sphere, mat(0xf4f2ec, 0.6), 0, -0.04, 0.46, 0.27, 0.15, 0.2));
      return { hip, knee, foot };
    }
    const rightLeg = makeLeg(-1), leftLeg = makeLeg(1);

    // ---- Head with Photo-Mapped Cartoon Texture ----
    const head = new T.Group(); rig.add(head);
    const HS = new T.Vector3(0.95, 1.07, 0.96);
    const headProf = [[0.001, 1.07], [0.36, 1.0], [0.6, 0.85], [0.8, 0.6], [0.93, 0.25], [0.95, 0.0], [0.92, -0.3], [0.8, -0.6], [0.58, -0.86], [0.3, -1.0], [0.001, -1.04]].reverse().map(p => new T.Vector2(p[0], p[1]));
    const skull = new T.Mesh(new T.LatheGeometry(new T.SplineCurve(headProf).getPoints(40), 48), skin);
    skull.scale.z = HS.z / 0.95; head.add(skull);

    // 3D Ears angled slightly outward as in photo
    [-1, 1].forEach(s => {
      const ear = new T.Group(); ear.position.set(s * 0.94, -0.06, -0.04); ear.rotation.y = s * 0.28; head.add(ear);
      ear.add(part(sphere, skinD, 0, 0, 0, 0.14, 0.28, 0.22));
      ear.add(part(sphere, mat(0x7d4a30), s * 0.04, 0, 0.02, 0.07, 0.16, 0.1));
    });

    // 3D Sculpted Hair cap and natural fringe
    const cap = part(new T.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, 1.78), hair, 0, 0.07, -0.05, 1.03, 1.15, 1.06);
    cap.rotation.x = -0.48; head.add(cap);
    head.add(part(sphere, hair, 0, 0.08, -0.26, 0.97, 1.06, 0.84));

    // Hair clumps for dimensional child haircut
    const crown = new T.Vector3(0.08, 1.05, -0.35), clumpGeo = new T.SphereGeometry(1, 10, 8), tipGeo = new T.ConeGeometry(1, 1, 7);
    const n = new T.Vector3(), tdir = new T.Vector3(), xa = new T.Vector3(), basis = new T.Matrix4();
    let hs = 11; const hr = () => { hs = (hs * 16807) % 2147483647; return (hs - 1) / 2147483646; };
    function clump(theta, phi, front) {
      const d = new T.Vector3(Math.sin(theta) * Math.sin(phi), Math.cos(theta), Math.sin(theta) * Math.cos(phi));
      const p = new T.Vector3(d.x * HS.x, d.y * HS.y, d.z * HS.z).multiplyScalar(1.03 + hr() * 0.04);
      n.copy(d).normalize();
      tdir.copy(p).sub(crown); tdir.addScaledVector(n, -tdir.dot(n)).normalize();
      if (front) tdir.lerp(new T.Vector3(0.35, -1, 0.25), 0.45).addScaledVector(n, -tdir.dot(n)).normalize();
      xa.crossVectors(n, tdir).normalize(); basis.makeBasis(xa, n, tdir);
      const m = new T.Mesh(front ? tipGeo : clumpGeo, hr() < 0.5 ? hair : hair2);
      if (front) m.scale.set(0.06 + hr() * 0.025, 0.28 + hr() * 0.1, 0.05);
      else m.scale.set(0.07 + hr() * 0.03, 0.05, 0.27 + hr() * 0.1);
      m.quaternion.setFromRotationMatrix(basis);
      if (front) m.quaternion.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), Math.PI / 2));
      m.position.copy(p).addScaledVector(tdir, front ? 0.12 : 0.1);
      head.add(m);
    }
    for (let k = 0; k < 120; k++) {
      const phi = (k / 120) * Math.PI * 2 * 11.3, theta = 0.15 + (k % 11) / 11 * 1.4;
      if (Math.cos(phi) > 0.55 && theta > 0.95) continue;
      clump(theta, phi + (hr() - 0.5) * 0.3, false);
    }
    for (let k = 0; k < 14; k++) clump(0.86 + hr() * 0.2, -0.75 + k * 0.11, true); // forward fringe

    // ---- Mapped Cartoon Face Texture from Ahaan's Photo ----
    const faceTex = new T.TextureLoader().load("assets/ahaan-face.png");
    faceTex.encoding = T.sRGBEncoding;
    const faceMat = new T.MeshStandardMaterial({
      map: faceTex,
      transparent: true,
      roughness: 0.6,
      metalness: 0.05,
      alphaTest: 0.05
    });
    // Curved face shield matching skull curvature
    const faceGeo = new T.CylinderGeometry(0.92, 0.94, 1.5, 32, 1, true, -Math.PI * 0.38, Math.PI * 0.76);
    faceGeo.rotateY(Math.PI);
    const faceMesh = new T.Mesh(faceGeo, faceMat);
    faceMesh.position.set(0, -0.06, 0.06);
    faceMesh.scale.set(1.01, 1.02, 1.01);
    head.add(faceMesh);

    // Dynamic eyes & brows reference for cursor tracking
    const eyes = [], brows = [];
    [-1, 1].forEach(s => {
      const eye = new T.Group(); eye.position.set(s * 0.335, 0.05, 0.88); head.add(eye);
      const iris = new T.Group(); iris.position.set(0, 0, 0.02); eye.add(iris);
      eyes.push({ eye, iris });
      const brow = new T.Group(); brow.position.set(s * 0.36, 0.31, 0.88); head.add(brow);
      brows.push(brow);
    });

    const mouth = new T.Group(); mouth.position.set(0, -0.47, 0.9); head.add(mouth);

    rig.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
    const b3 = new T.Box3().setFromObject(rig);

    // ---- Walk Cycle Handler ----
    let walkPhase = 0;
    function updateWalk(isWalking, speed, dt) {
      if (isWalking) {
        walkPhase += dt * (speed || 8);
        const swing = Math.sin(walkPhase) * 0.55;
        leftLeg.hip.rotation.x = swing;
        rightLeg.hip.rotation.x = -swing;
        leftLeg.knee.rotation.x = Math.max(0, -swing * 0.75);
        rightLeg.knee.rotation.x = Math.max(0, swing * 0.75);
        leftArm.arm.rotation.x = -swing * 0.45;
        wavingArm.arm.rotation.x = swing * 0.45;
        // energetic child bounce
        rig.position.y = -6.95 + Math.abs(Math.sin(walkPhase * 2)) * 0.16;
      } else {
        leftLeg.hip.rotation.x *= 0.82;
        rightLeg.hip.rotation.x *= 0.82;
        leftLeg.knee.rotation.x *= 0.82;
        rightLeg.knee.rotation.x *= 0.82;
        leftArm.arm.rotation.x *= 0.82;
        wavingArm.arm.rotation.x *= 0.82;
        rig.position.y += (-6.95 - rig.position.y) * 0.2;
      }
    }

    return {
      rig, head, eyes, brows, mouth, wavingArm, leftArm, leftLeg, rightLeg,
      updateWalk,
      footY: b3.min.y,
      height: b3.max.y - b3.min.y
    };
  }
};
