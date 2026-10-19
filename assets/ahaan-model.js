/* ---- 3D Ahaan model: a stylised, kid-proportioned figure built from simple shapes (no model files).
   Likeness notes (from the owner's photos, kept local and never uploaded): short black hair with a soft
   fringe, warm brown skin, almond dark-brown eyes, an open smile, ears slightly out; maroon-and-cream
   striped polo, light jeans, navy sneakers. Returns the parts the scene animates. ---- */
window.AhaanModel = {
  build(T) {
    const SKIN = 0xc98d64, SKIN_D = 0xb87b53, HAIR = 0x16100d, CREAM = 0xf2ecda, COLLAR = 0x43121f, JEANS = 0x8fb0d4, JEANS_D = 0x7b9cc4, NAVY = 0x24345a;
    const mat = (c, r) => new T.MeshStandardMaterial({ color: c, roughness: r == null ? 0.75 : r });
    const part = (geo, m, x, y, z, sx, sy, sz) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); if (sx) o.scale.set(sx, sy, sz); return o; };
    const sphere = new T.SphereGeometry(1, 40, 28);
    const skin = new T.MeshStandardMaterial({ color: SKIN, roughness: 0.55, emissive: 0x3a1608, emissiveIntensity: 0.18 });
    const skinD = new T.MeshStandardMaterial({ color: SKIN_D, roughness: 0.62, emissive: 0x2a1006, emissiveIntensity: 0.15 });
    const hair = mat(HAIR, 0.72), hair2 = mat(0x241a14, 0.78), dark = mat(0x1a1210, 0.6);
    function stripes(bands) {
      const c = document.createElement("canvas"); c.width = 8; c.height = bands * 16;
      const g = c.getContext("2d");
      for (let i = 0; i < bands; i++) { g.fillStyle = i % 2 ? "#f2ecda" : "#5a1d2d"; g.fillRect(0, i * 16, 8, 16); }
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
    }
    const rig = new T.Group();

    // ---- polo shirt: a lathe profile from shoulders to hem, a little flatter front to back ----
    const prof = [[0.001, -1.40], [0.5, -1.42], [1.0, -1.56], [1.18, -1.84], [1.16, -2.2], [1.06, -2.8], [1.0, -3.4], [1.03, -3.86], [0.001, -3.92]].reverse().map(p => new T.Vector2(p[0], p[1]));   // bottom-to-top so faces point outward
    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), new T.MeshStandardMaterial({ map: stripes(10), roughness: 0.92 }));
    torso.scale.z = 0.72; rig.add(torso);
    const sleeveTex = stripes(6); sleeveTex.repeat.set(1, 1);
    const sleeveMat = new T.MeshStandardMaterial({ map: sleeveTex, roughness: 0.92 });
    rig.add(part(new T.CylinderGeometry(0.36, 0.4, 0.5, 24), skinD, 0, -1.2, 0));
    const collar = part(new T.TorusGeometry(0.42, 0.1, 12, 32), mat(COLLAR, 0.85), 0, -1.45, 0.02, 1.08, 1, 0.78);
    collar.rotation.x = Math.PI / 2; rig.add(collar);
    [-1, 1].forEach(s => { const f = part(new T.BoxGeometry(0.34, 0.2, 0.03), mat(COLLAR, 0.85), s * 0.17, -1.6, 0.6); f.rotation.set(-0.25, 0, s * 0.55); rig.add(f); });
    rig.add(part(new T.BoxGeometry(0.16, 0.6, 0.04), mat(CREAM, 0.9), 0, -1.98, 0.79));
    [-1.8, -2.1].forEach(y => rig.add(part(new T.SphereGeometry(0.04, 12, 10), mat(0xffffff, 0.4), 0, y, 0.82)));

    // ---- arms (his right arm waves) ----
    function makeArm(side) {
      const arm = new T.Group(); arm.position.set(side * 1.1, -1.76, 0);
      const rest = side * 0.1; arm.rotation.z = rest;
      arm.add(part(new T.CapsuleGeometry(0.3, 0.3, 6, 14), sleeveMat, 0, -0.25, 0));
      arm.add(part(new T.CapsuleGeometry(0.18, 0.5, 6, 12), skin, 0, -0.75, 0));
      const elbow = new T.Group(); elbow.position.set(0, -1.08, 0); arm.add(elbow);
      elbow.add(part(new T.CapsuleGeometry(0.165, 0.7, 6, 12), skin, 0, -0.45, 0));
      const hand = new T.Group(); hand.position.set(0, -0.92, 0.02); elbow.add(hand);
      hand.add(part(sphere, skin, 0, -0.08, 0, 0.15, 0.17, 0.075));                     // palm
      const finger = new T.CapsuleGeometry(0.038, 0.1, 4, 8);
      for (let f = 0; f < 4; f++) { const fg = part(finger, skin, (f - 1.5) * 0.068, -0.26, 0.01); fg.rotation.x = 0.35 + f * 0.04; hand.add(fg); }
      const thumb = part(new T.CapsuleGeometry(0.042, 0.1, 4, 8), skin, -side * 0.13, -0.1, 0.04); thumb.rotation.set(0.3, 0, -side * 0.7); hand.add(thumb);
      rig.add(arm); return { arm, elbow, rest };
    }
    const wavingArm = makeArm(-1), leftArm = makeArm(1);

    // ---- jeans and sneakers ----
    rig.add(part(sphere, mat(JEANS, 0.9), 0, -3.98, 0, 0.98, 0.42, 0.66));
    [-1, 1].forEach(s => {
      rig.add(part(new T.CapsuleGeometry(0.37, 2.3, 8, 16), mat(s < 0 ? JEANS : JEANS_D, 0.9), s * 0.45, -5.3, 0));
      rig.add(part(sphere, mat(NAVY, 0.6), s * 0.46, -6.78, 0.16, 0.4, 0.22, 0.66));
      rig.add(part(sphere, mat(0xf4f2ec, 0.7), s * 0.46, -6.95, 0.16, 0.43, 0.08, 0.69));
      rig.add(part(sphere, mat(0xf4f2ec, 0.6), s * 0.46, -6.82, 0.62, 0.27, 0.15, 0.2));
    });

    // ---- head: round, soft and a little chubby-cheeked ----
    const head = new T.Group(); rig.add(head);
    const HS = new T.Vector3(0.95, 1.07, 0.96);
    // one smooth head shape: a round crown easing into a gentle chin (no seams)
    const headProf = [[0.001, 1.07], [0.36, 1.0], [0.6, 0.85], [0.8, 0.6], [0.93, 0.25], [0.95, 0.0], [0.92, -0.3], [0.8, -0.6], [0.58, -0.86], [0.3, -1.0], [0.001, -1.04]].reverse().map(p => new T.Vector2(p[0], p[1]));   // bottom-to-top so faces point outward
    const skull = new T.Mesh(new T.LatheGeometry(new T.SplineCurve(headProf).getPoints(40), 48), skin); skull.scale.z = HS.z / 0.95; head.add(skull);
    [-1, 1].forEach(s => {
      head.add(part(sphere, skinD, s * 0.94, -0.06, -0.04, 0.13, 0.26, 0.21));            // ears, a little out
      head.add(part(sphere, mat(0x7d4a30), s * 0.98, -0.06, 0.0, 0.06, 0.15, 0.1));
    });

    // ---- hair: thick and black, built from many clumps that flow from the crown, with a choppy fringe ----
    const cap = part(new T.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, 1.78), hair, 0, 0.07, -0.05, 1.03, 1.15, 1.06);
    cap.rotation.x = -0.48; head.add(cap);
    head.add(part(sphere, hair, 0, 0.08, -0.26, 0.97, 1.06, 0.84));
    const crown = new T.Vector3(0.08, 1.05, -0.35), clumpGeo = new T.SphereGeometry(1, 10, 8), tipGeo = new T.ConeGeometry(1, 1, 7);
    const n = new T.Vector3(), tdir = new T.Vector3(), xa = new T.Vector3(), basis = new T.Matrix4();
    let hs = 11; const hr = () => { hs = (hs * 16807) % 2147483647; return (hs - 1) / 2147483646; };
    function clump(theta, phi, front) {
      const d = new T.Vector3(Math.sin(theta) * Math.sin(phi), Math.cos(theta), Math.sin(theta) * Math.cos(phi));   // phi = 0 faces forward
      const p = new T.Vector3(d.x * HS.x, d.y * HS.y, d.z * HS.z).multiplyScalar(1.03 + hr() * 0.04);
      n.copy(d).normalize();
      tdir.copy(p).sub(crown); tdir.addScaledVector(n, -tdir.dot(n)).normalize();
      if (front) tdir.lerp(new T.Vector3(0.35, -1, 0.25), 0.45).addScaledVector(n, -tdir.dot(n)).normalize();   // fringe sweeps down and a little to his right
      xa.crossVectors(n, tdir).normalize(); basis.makeBasis(xa, n, tdir);
      const m = new T.Mesh(front ? tipGeo : clumpGeo, hr() < 0.5 ? hair : hair2);
      if (front) m.scale.set(0.06 + hr() * 0.025, 0.3 + hr() * 0.12, 0.05);            // cone: width, length (its own axis), thickness
      else m.scale.set(0.07 + hr() * 0.03, 0.05, 0.27 + hr() * 0.1);
      m.quaternion.setFromRotationMatrix(basis);
      if (front) m.quaternion.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), Math.PI / 2));   // cone points along the flow
      m.position.copy(p).addScaledVector(tdir, front ? 0.12 : 0.1);
      head.add(m);
    }
    for (let k = 0; k < 170; k++) {                                  // crown, sides and back
      const phi = (k / 170) * Math.PI * 2 * 13.3, theta = 0.15 + (k % 13) / 13 * 1.45;
      const facing = Math.cos(phi);                                     // 1 = front
      if (facing > 0.55 && theta > 0.95) continue;                      // keep the face clear
      clump(theta, phi + (hr() - 0.5) * 0.3, false);
    }
    for (let k = 0; k < 17; k++) clump(0.86 + hr() * 0.22, -0.78 + k * 0.1 + (hr() - 0.5) * 0.06, true);   // fringe over the forehead
    [-1, 1].forEach(s => head.add(part(sphere, hair, s * 0.82, 0.32, -0.12, 0.24, 0.42, 0.55)));        // short sides above the ears

    // ---- eyes: big and sparkly, with a soft lid and a lash line ----
    const eyes = [], brows = [];
    const irisM = mat(0x5a3a22, 0.3), rimM = mat(0x23140b, 0.35), pupilM = mat(0x0b0705, 0.25), shine = new T.MeshBasicMaterial({ color: 0xffffff });
    [-1, 1].forEach(s => {
      const eye = new T.Group(); eye.position.set(s * 0.335, 0.05, 0.86); eye.rotation.y = s * 0.3; head.add(eye);
      eye.add(part(sphere, mat(0xfbf8f2, 0.3), 0, 0, 0, 0.19, 0.145, 0.085));
      const iris = new T.Group(); iris.position.z = 0.045; eye.add(iris);
      iris.add(part(sphere, rimM, 0, 0, 0, 0.122, 0.122, 0.045));
      iris.add(part(sphere, irisM, 0, 0, 0.012, 0.1, 0.1, 0.04));
      iris.add(part(sphere, pupilM, 0, 0, 0.026, 0.056, 0.056, 0.032));
      iris.add(part(sphere, shine, 0.035, 0.04, 0.045, 0.03, 0.03, 0.015));          // catchlights
      iris.add(part(sphere, shine, -0.035, -0.035, 0.044, 0.014, 0.014, 0.01));
      eye.add(part(sphere, skin, 0, 0.16, -0.005, 0.21, 0.055, 0.095));                // a light upper lid: eyes wide open
      const lash = part(new T.CapsuleGeometry(0.02, 0.3, 4, 8), dark, 0, 0.122, 0.06); lash.rotation.z = Math.PI / 2; eye.add(lash);
      eyes.push({ eye, iris });
      const brow = part(new T.CapsuleGeometry(0.034, 0.26, 4, 8), hair, s * 0.36, 0.31, 0.865);
      brow.rotation.z = Math.PI / 2 - s * 0.1; brow.rotation.y = s * 0.3; head.add(brow); brows.push(brow);
    });
    // ---- a small button nose ----
    head.add(part(sphere, skinD, 0, -0.09, 0.93, 0.06, 0.13, 0.07));
    head.add(part(sphere, skin, 0, -0.2, 0.975, 0.115, 0.09, 0.09));
    [-1, 1].forEach(s => head.add(part(sphere, mat(0x6e3f26), s * 0.048, -0.235, 0.985, 0.026, 0.018, 0.02)));
    // ---- a wide, open smile with the top teeth showing ----
    const mouth = new T.Group(); mouth.position.set(0, -0.47, 0.88); head.add(mouth);
    const lip = new T.Shape(); lip.moveTo(-0.24, 0.03); lip.quadraticCurveTo(0, -0.22, 0.24, 0.03); lip.quadraticCurveTo(0, -0.04, -0.24, 0.03);
    mouth.add(new T.Mesh(new T.ShapeGeometry(lip, 18), new T.MeshBasicMaterial({ color: 0x5a1f1a })));
    const teeth = new T.Shape(); teeth.moveTo(-0.18, -0.005); teeth.quadraticCurveTo(0, -0.1, 0.18, -0.005); teeth.quadraticCurveTo(0, -0.04, -0.18, -0.005);
    const tm = new T.Mesh(new T.ShapeGeometry(teeth, 14), new T.MeshBasicMaterial({ color: 0xffffff })); tm.position.z = 0.003; mouth.add(tm);
    const tongue = new T.Shape(); tongue.moveTo(-0.1, -0.12); tongue.quadraticCurveTo(0, -0.17, 0.1, -0.12); tongue.quadraticCurveTo(0, -0.09, -0.1, -0.12);
    const tg = new T.Mesh(new T.ShapeGeometry(tongue, 10), new T.MeshBasicMaterial({ color: 0xc0605a })); tg.position.z = 0.002; mouth.add(tg);
    [-1, 1].forEach(s => mouth.add(part(sphere, mat(0x8c4a3c), s * 0.24, 0.03, 0, 0.024, 0.024, 0.02)));

    rig.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
    const box = new T.Box3().setFromObject(rig);
    return { rig, head, eyes, brows, mouth, wavingArm, leftArm, footY: box.min.y, height: box.max.y - box.min.y };
  }
};
