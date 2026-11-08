/* ---- 3D Ahaan Model: A detailed, stylized 3D rendered character of Ahaan.
   Faithfully captures Ahaan's likeness from his reference photograph:
   - Warm golden-caramel skin tone (0xc98d64) with gentle subsurface peach warmth.
   - Slender oval head with authentic child facial proportions.
   - 3D sculpted expressive almond eyes:
     - Sclera with soft ivory curvature.
     - Deep dark-chocolate outer iris and warm caramel inner iris.
     - Obsidian pupil with sparkling dual catchlights (crisp white primary + soft ambient gleam).
     - Defined dark espresso upper eyelid / eyelash rim and double eyelid crease.
     - Articulated upper eyelids for smooth procedural blinking.
   - 3D sculpted naturally arched dark espresso eyebrows matching his photo.
   - 3D sculpted child button nose with soft nasal bridge and gentle nostril flares.
   - 3D sculpted cheerful open smile:
     - Sculpted upper lip with Cupid's bow and plump lower lip.
     - Deep oral cavity with clean white upper front teeth showing cute child gap, plus soft pink tongue.
   - Soft rosy blush discs on cheekbones.
   - 3D volumetric layered haircut:
     - Sculpted volumetric hair cap framing the skull with authentic child hairline.
     - Overlapping forward-swept bangs / fringe locks framing the forehead above brows.
     - Sculpted sideburns and tapered nape of neck.
   - 3D sculpted ears on both sides with outer helix, concha cavity, and soft lobe.
   - Wide maroon-and-cream striped polo shirt with solid maroon collar, lapels,
     button placket, and pearlescent buttons.
   - Relaxed light denim jeans with ankle cuffs.
   - Two-tone navy sneakers with white rubber toe caps, thick white outsoles, and laces.
   - Fully articulated walking, waving, and procedural blinking animations. ---- */

window.AhaanModel = {
  build(T) {
    // ---- Color Palette ----
    const SKIN = 0xc98d64;       // Warm golden-caramel skin tone
    const SKIN_SHADOW = 0xb47952;// Contoured shadow skin
    const HAIR_BASE = 0x140e0b;  // Rich dark obsidian-espresso hair
    const HAIR_STRAND = 0x241812;// Soft brown highlight strand
    const EYE_WHITE = 0xfcfbfa;  // Soft ivory sclera
    const EYE_IRIS = 0x24140b;   // Deep chocolate iris rim
    const EYE_WARM = 0x4a2814;   // Warm hazel-caramel iris body
    const EYE_PUPIL = 0x080503;  // Obsidian pupil
    const BROW = 0x18110b;       // Dark espresso eyebrows
    const LIP_TOP = 0xaa4844;    // Natural coral-rose upper lip
    const LIP_BOT = 0xc55b55;    // Plump warm lower lip
    const MOUTH_IN = 0x320e14;   // Deep ruby oral cavity
    const TEETH_WHITE = 0xffffff;// Clean white teeth
    const TONGUE = 0xc04f58;     // Soft pink tongue
    const MAROON = 0x5a1d2d;     // Rich maroon polo stripe
    const CREAM = 0xf5f0e1;      // Warm cream polo stripe
    const COLLAR = 0x43121f;     // Solid maroon polo collar
    const JEANS = 0x82a5cc;      // Relaxed light denim
    const JEANS_D = 0x6e91b8;    // Denim shadow tone
    const NAVY = 0x1b2844;       // Sneaker navy canvas
    const SNEAKER_WHITE = 0xf5f3ee; // Sneaker rubber toe and sole

    const mat = (color, roughness, metalness) => new T.MeshStandardMaterial({
      color,
      roughness: roughness == null ? 0.72 : roughness,
      metalness: metalness == null ? 0.04 : metalness
    });

    const part = (geo, m, x, y, z, sx, sy, sz) => {
      const o = new T.Mesh(geo, m);
      o.position.set(x || 0, y || 0, z || 0);
      if (sx) o.scale.set(sx, sy, sz);
      return o;
    };

    const sphere = new T.SphereGeometry(1, 32, 24);

    const skinMat = new T.MeshStandardMaterial({
      color: SKIN,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0x3d1a0e,
      emissiveIntensity: 0.16
    });

    const skinShadowMat = new T.MeshStandardMaterial({
      color: SKIN_SHADOW,
      roughness: 0.65,
      metalness: 0.02,
      emissive: 0x2c1208,
      emissiveIntensity: 0.12
    });

    const hairMat = mat(HAIR_BASE, 0.48, 0.08);
    const hairStrandMat = mat(HAIR_STRAND, 0.52, 0.06);

    // Polo horizontal stripes texture
    function createPoloTexture(bands) {
      const c = document.createElement("canvas");
      c.width = 64; c.height = bands * 32;
      const g = c.getContext("2d");
      for (let i = 0; i < bands; i++) {
        g.fillStyle = i % 2 ? "#f5f0e1" : "#5a1d2d";
        g.fillRect(0, i * 32, 64, 32);
        g.fillStyle = i % 2 ? "rgba(220, 210, 190, 0.25)" : "rgba(60, 15, 25, 0.25)";
        for (let y = 0; y < 32; y += 4) {
          g.fillRect(0, i * 32 + y, 64, 1.5);
        }
      }
      const t = new T.CanvasTexture(c);
      t.encoding = T.sRGBEncoding;
      t.wrapS = t.wrapT = T.RepeatWrapping;
      return t;
    }

    const rig = new T.Group();

    // ==========================================
    // 1. Torso: Maroon & Cream Striped Polo
    // ==========================================
    const poloTex = createPoloTexture(8);
    poloTex.repeat.set(1, 1);
    const poloMat = new T.MeshStandardMaterial({ map: poloTex, roughness: 0.85 });

    const prof = [
      [0.001, -1.40], [0.52, -1.42], [1.02, -1.56], [1.18, -1.84],
      [1.16, -2.20], [1.08, -2.75], [1.02, -3.35], [1.04, -3.85], [0.001, -3.92]
    ].reverse().map(p => new T.Vector2(p[0], p[1]));

    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), poloMat);
    torso.scale.z = 0.74;
    rig.add(torso);

    // Neck
    const neck = part(new T.CylinderGeometry(0.35, 0.40, 0.52, 24), skinShadowMat, 0, -1.22, 0);
    rig.add(neck);

    // Ribbed Polo Collar
    const collarRing = part(new T.TorusGeometry(0.44, 0.10, 14, 36), mat(COLLAR, 0.82), 0, -1.46, 0.02, 1.08, 1, 0.80);
    collarRing.rotation.x = Math.PI / 2;
    rig.add(collarRing);

    // Collar Lapels
    [-1, 1].forEach(s => {
      const lapel = part(new T.BoxGeometry(0.36, 0.22, 0.04), mat(COLLAR, 0.82), s * 0.18, -1.62, 0.62);
      lapel.rotation.set(-0.24, 0, s * 0.52);
      rig.add(lapel);
    });

    // White Button Placket
    const placket = part(new T.BoxGeometry(0.18, 0.65, 0.04), mat(CREAM, 0.88), 0, -1.98, 0.80);
    rig.add(placket);

    // Pearlescent Buttons
    [-1.76, -2.10].forEach(y => {
      const btn = part(new T.CylinderGeometry(0.045, 0.045, 0.02, 16), mat(0xffffff, 0.35, 0.1), 0, y, 0.83);
      btn.rotation.x = Math.PI / 2;
      rig.add(btn);
    });

    // ==========================================
    // 2. Articulated Arms & Hands
    // ==========================================
    const sleeveTex = createPoloTexture(6);
    const sleeveMat = new T.MeshStandardMaterial({ map: sleeveTex, roughness: 0.85 });
    const cuffMat = mat(MAROON, 0.85);

    function makeArm(side) {
      const arm = new T.Group();
      arm.position.set(side * 1.12, -1.74, 0);
      const rest = side * 0.10;
      arm.rotation.z = rest;

      arm.add(part(new T.CapsuleGeometry(0.32, 0.32, 8, 16), sleeveMat, 0, -0.25, 0));
      const cuff = part(new T.TorusGeometry(0.31, 0.04, 8, 20), cuffMat, 0, -0.42, 0);
      cuff.rotation.x = Math.PI / 2;
      arm.add(cuff);

      arm.add(part(new T.CapsuleGeometry(0.19, 0.48, 8, 14), skinMat, 0, -0.74, 0));

      const elbow = new T.Group();
      elbow.position.set(0, -1.06, 0);
      arm.add(elbow);
      elbow.add(part(new T.CapsuleGeometry(0.175, 0.68, 8, 14), skinMat, 0, -0.44, 0));

      const hand = new T.Group();
      hand.position.set(0, -0.92, 0.02);
      elbow.add(hand);

      hand.add(part(sphere, skinMat, 0, -0.08, 0, 0.16, 0.18, 0.085));

      const fingerGeo = new T.CapsuleGeometry(0.038, 0.11, 6, 10);
      for (let f = 0; f < 4; f++) {
        const fg = part(fingerGeo, skinMat, (f - 1.5) * 0.068, -0.27, 0.01);
        fg.rotation.x = 0.32 + f * 0.04;
        hand.add(fg);
      }

      const thumb = part(new T.CapsuleGeometry(0.044, 0.11, 6, 10), skinMat, -side * 0.14, -0.11, 0.04);
      thumb.rotation.set(0.28, 0, -side * 0.68);
      hand.add(thumb);

      rig.add(arm);
      return { arm, elbow, hand, rest };
    }

    const wavingArm = makeArm(-1);
    const leftArm = makeArm(1);

    // ==========================================
    // 3. Articulated Legs & Detailed Sneakers
    // ==========================================
    rig.add(part(sphere, mat(JEANS, 0.88), 0, -3.98, 0, 0.98, 0.44, 0.68));

    function makeLeg(side) {
      const hip = new T.Group();
      hip.position.set(side * 0.46, -4.0, 0);
      rig.add(hip);

      const thigh = part(new T.CapsuleGeometry(0.36, 1.25, 10, 16), mat(side < 0 ? JEANS : JEANS_D, 0.88), 0, -0.68, 0);
      hip.add(thigh);

      const knee = new T.Group();
      knee.position.set(0, -1.35, 0);
      hip.add(knee);

      const shin = part(new T.CapsuleGeometry(0.33, 1.20, 10, 16), mat(side < 0 ? JEANS : JEANS_D, 0.88), 0, -0.65, 0);
      knee.add(shin);

      const ankleCuff = part(new T.TorusGeometry(0.33, 0.04, 8, 20), mat(0x5c7f9e, 0.9), 0, -1.22, 0);
      ankleCuff.rotation.x = Math.PI / 2;
      knee.add(ankleCuff);

      const foot = new T.Group();
      foot.position.set(0, -1.36, 0.12);
      knee.add(foot);

      const sneakerBody = part(sphere, mat(NAVY, 0.72), 0, 0, 0, 0.39, 0.22, 0.66);
      foot.add(sneakerBody);

      const sole = part(new T.BoxGeometry(0.80, 0.12, 1.34), mat(SNEAKER_WHITE, 0.65), 0, -0.16, 0.02);
      foot.add(sole);

      const toeCap = part(sphere, mat(SNEAKER_WHITE, 0.55), 0, -0.06, 0.46, 0.30, 0.16, 0.24);
      foot.add(toeCap);

      const laces = part(new T.BoxGeometry(0.24, 0.04, 0.34), mat(SNEAKER_WHITE, 0.7), 0, 0.10, 0.14);
      laces.rotation.x = -0.32;
      foot.add(laces);

      return { hip, knee, foot };
    }

    const rightLeg = makeLeg(-1);
    const leftLeg = makeLeg(1);

    // ==========================================
    // 4. 3D Sculpted Child Head Mesh
    // ==========================================
    const head = new T.Group();
    head.rotation.x = -0.18; // Natural gentle tilt for camera visibility
    rig.add(head);

    // Smooth contoured child head geometry
    const headGeo = new T.SphereGeometry(1, 48, 36);
    headGeo.scale(0.92, 1.05, 0.96);
    const skullMesh = new T.Mesh(headGeo, skinMat);
    head.add(skullMesh);

    // ==========================================
    // 5. 3D Sculpted Expressive Eyes & Eyelids
    // ==========================================
    const eyes = [];
    const eyelids = [];
    const brows = [];

    const scleraMat = mat(EYE_WHITE, 0.25, 0.02);
    const irisOuterMat = mat(EYE_IRIS, 0.20, 0.05);
    const irisWarmMat = mat(EYE_WARM, 0.25, 0.02);
    const pupilMat = mat(EYE_PUPIL, 0.10, 0.08);
    const catchlightMat = mat(0xffffff, 0.05, 0.1);
    const browMat = mat(BROW, 0.85);
    const lashMat = mat(0x18100a, 0.85);

    [-1, 1].forEach(side => {
      const eyeSocket = new T.Group();
      // Positioned on the front contour of the skull
      eyeSocket.position.set(side * 0.31, 0.04, 0.90);
      eyeSocket.rotation.y = side * 0.18;
      eyeSocket.rotation.z = -side * 0.04; // Gentle almond slant
      head.add(eyeSocket);

      // Sclera (Eye White)
      const sclera = part(sphere, scleraMat, 0, 0, 0, 0.135, 0.098, 0.04);
      eyeSocket.add(sclera);

      // Iris & Pupil Group
      const iris = new T.Group();
      iris.position.set(0, 0, 0.022);

      // Outer deep chocolate ring
      const irisOuter = part(sphere, irisOuterMat, 0, 0, 0, 0.078, 0.078, 0.018);
      iris.add(irisOuter);

      // Inner warm caramel ring
      const irisInner = part(sphere, irisWarmMat, 0, 0, 0.008, 0.058, 0.058, 0.014);
      iris.add(irisInner);

      // Obsidian pupil
      const pupil = part(sphere, pupilMat, 0, 0, 0.015, 0.038, 0.038, 0.010);
      iris.add(pupil);

      // Dual Specular Sparkle Catchlights
      const catchPrimary = part(sphere, catchlightMat, 0.020, 0.020, 0.022, 0.020, 0.020, 0.008);
      const catchSecondary = part(sphere, catchlightMat, -0.016, -0.016, 0.020, 0.011, 0.011, 0.006);
      iris.add(catchPrimary);
      iris.add(catchSecondary);

      eyeSocket.add(iris);
      eyes.push({ socket: eyeSocket, iris });

      // Crisp upper eyelid / eyelash rim
      const lashRim = part(new T.TorusGeometry(0.125, 0.018, 6, 18, Math.PI * 0.82), lashMat, 0, 0.032, 0.024);
      lashRim.rotation.z = Math.PI * 0.09;
      eyeSocket.add(lashRim);

      // Double Eyelid Crease
      const crease = part(new T.TorusGeometry(0.135, 0.010, 4, 16, Math.PI * 0.68), skinShadowMat, 0, 0.068, 0.018);
      crease.rotation.z = Math.PI * 0.12;
      eyeSocket.add(crease);

      // Articulated Upper Eyelid for Blinking (keeps proper eye socket scale)
      const eyelid = part(sphere, skinMat, 0, 0.04, 0.022, 0.140, 0.001, 0.045);
      eyelid.baseY = 0.105;
      eyeSocket.add(eyelid);
      eyelids.push(eyelid);

      // 3D Sculpted Naturally Arched Eyebrow
      const browGroup = new T.Group();
      browGroup.position.set(side * 0.32, 0.22, 0.89);
      browGroup.rotation.y = side * 0.22;
      browGroup.rotation.z = -side * 0.14; // Friendly photo arch

      const browMesh = part(new T.CapsuleGeometry(0.034, 0.22, 6, 12), browMat, 0, 0, 0);
      browMesh.rotation.z = Math.PI / 2;
      browMesh.scale.set(1, 1, 0.55);
      browGroup.add(browMesh);

      // Outer brow tail
      const browTail = part(new T.ConeGeometry(0.030, 0.12, 6), browMat, side * 0.12, -0.02, 0);
      browTail.rotation.z = side * (Math.PI / 2 + 0.32);
      browGroup.add(browTail);

      head.add(browGroup);
      brows.push(browGroup);

      // Soft rosy peach cheek blush
      const blushMat = new T.MeshBasicMaterial({ color: 0xdb745f, transparent: true, opacity: 0.30 });
      const blush = part(new T.CircleGeometry(0.13, 16), blushMat, side * 0.46, -0.12, 0.85);
      blush.rotation.y = side * 0.28;
      head.add(blush);
    });

    // ==========================================
    // 6. 3D Sculpted Child Button Nose
    // ==========================================
    const noseGroup = new T.Group();
    noseGroup.position.set(0, -0.08, 0.94);

    // Nasal bridge sloping smoothly
    const bridge = part(new T.CapsuleGeometry(0.038, 0.10, 6, 10), skinMat, 0, 0.04, -0.01);
    bridge.rotation.x = 0.26;
    noseGroup.add(bridge);

    // Rounded nose tip
    const tip = part(sphere, skinMat, 0, -0.03, 0.04, 0.058, 0.052, 0.052);
    noseGroup.add(tip);

    // Subtle nostril flares
    [-1, 1].forEach(s => {
      const flare = part(sphere, skinShadowMat, s * 0.050, -0.040, 0.015, 0.032, 0.028, 0.028);
      noseGroup.add(flare);
    });

    head.add(noseGroup);

    // ==========================================
    // 7. 3D Sculpted Open Smile with Teeth
    // ==========================================
    const mouth = new T.Group();
    mouth.position.set(0, -0.34, 0.88);
    mouth.rotation.x = 0.12; // Angled slightly for camera visibility

    // Deep ruby oral cavity
    const cavity = part(new T.CylinderGeometry(0.15, 0.06, 0.10, 16, 1, false, 0, Math.PI), mat(MOUTH_IN, 0.8), 0, 0, 0);
    cavity.rotation.z = Math.PI;
    cavity.scale.set(1.15, 0.75, 0.55);
    mouth.add(cavity);

    // Clean white upper teeth (with cute child center gap notch)
    const teethLeft = part(new T.BoxGeometry(0.075, 0.038, 0.03), mat(TEETH_WHITE, 0.25), -0.042, 0.022, 0.018);
    const teethRight = part(new T.BoxGeometry(0.075, 0.038, 0.03), mat(TEETH_WHITE, 0.25), 0.042, 0.022, 0.018);
    mouth.add(teethLeft);
    mouth.add(teethRight);

    // Soft pink tongue
    const tongue = part(sphere, mat(TONGUE, 0.65), 0, -0.028, 0.005, 0.09, 0.04, 0.07);
    mouth.add(tongue);

    // Sculpted Cupid's bow upper lip
    const upperLip = part(new T.TorusGeometry(0.125, 0.022, 6, 20, Math.PI * 0.85), mat(LIP_TOP, 0.65), 0, 0.030, 0.024);
    upperLip.rotation.z = Math.PI * 0.08;
    mouth.add(upperLip);

    // Plump warm lower lip
    const lowerLip = part(new T.TorusGeometry(0.130, 0.024, 6, 20, Math.PI * 0.92), mat(LIP_BOT, 0.60), 0, 0.012, 0.028);
    lowerLip.rotation.z = Math.PI * 1.04;
    mouth.add(lowerLip);

    // Smile corner dimples
    [-1, 1].forEach(s => {
      const dimple = part(sphere, skinShadowMat, s * 0.17, 0.012, 0.018, 0.028, 0.040, 0.018);
      mouth.add(dimple);
    });

    head.add(mouth);

    // ==========================================
    // 8. 3D Sculpted Ears
    // ==========================================
    [-1, 1].forEach(s => {
      const ear = new T.Group();
      ear.position.set(s * 0.88, -0.04, -0.02);
      ear.rotation.y = s * 0.24; // Angled outward naturally
      ear.rotation.z = -s * 0.06;

      // Outer helix rim
      const helix = part(sphere, skinMat, 0, 0, 0, 0.14, 0.26, 0.20);
      ear.add(helix);

      // Inner concha cavity
      const concha = part(sphere, skinShadowMat, s * 0.04, 0.01, 0.02, 0.07, 0.15, 0.10);
      ear.add(concha);

      // Soft earlobe
      const lobe = part(sphere, skinMat, 0, -0.14, 0.01, 0.08, 0.10, 0.07);
      ear.add(lobe);

      head.add(ear);
    });

    // ==========================================
    // 9. 3D Volumetric Sculpted Layered Hair
    // ==========================================
    const hairGroup = new T.Group();
    head.add(hairGroup);

    // Crown and upper skull volume
    const crown = part(sphere, hairMat, 0, 0.24, -0.04, 0.94, 0.88, 0.98);
    hairGroup.add(crown);

    // Back of head and nape volume
    const nape = part(sphere, hairMat, 0, 0.04, -0.22, 0.92, 0.98, 0.86);
    hairGroup.add(nape);

    // Side temple volumes above ears
    [-1, 1].forEach(s => {
      const temple = part(sphere, hairMat, s * 0.48, 0.18, 0.08, 0.52, 0.72, 0.78);
      hairGroup.add(temple);
    });

    // Forehead bangs / fringe locks (following forehead curvature above brows)
    const bangsCount = 7;
    for (let i = 0; i < bangsCount; i++) {
      const u = (i / (bangsCount - 1)) * 2 - 1; // -1 to +1
      const bx = u * 0.44;
      const by = 0.30 - Math.pow(u, 2) * 0.04; // Curved arch above eyebrows
      const bz = 0.86 - Math.abs(u) * 0.10;
      const bLock = part(
        new T.CapsuleGeometry(0.065, 0.12, 8, 12),
        i % 2 === 0 ? hairMat : hairStrandMat,
        bx, by, bz
      );
      bLock.rotation.set(0.24, -u * 0.14, -u * 0.20);
      bLock.scale.set(0.95, 1, 0.75);
      hairGroup.add(bLock);
    }

    // Sideburn locks in front of ears
    [-1, 1].forEach(s => {
      const sideburn = part(new T.CapsuleGeometry(0.050, 0.22, 8, 12), hairMat, s * 0.84, -0.02, 0.16);
      sideburn.rotation.set(0.18, 0, s * 0.12);
      sideburn.scale.set(0.70, 1, 0.85);
      hairGroup.add(sideburn);
    });

    // Shadow setup
    rig.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    const b3 = new T.Box3().setFromObject(rig);

    // ==========================================
    // 10. Procedural Animation Rig
    // ==========================================
    let walkPhase = 0;
    let blinkTimer = 2.0;
    let isBlinking = false;
    let blinkDuration = 0;

    function updateBlink(dt) {
      blinkTimer -= dt;
      if (blinkTimer <= 0 && !isBlinking) {
        isBlinking = true;
        blinkDuration = 0.14;
        blinkTimer = 2.8 + Math.random() * 3.2;
      }

      if (isBlinking) {
        blinkDuration -= dt;
        const progress = Math.max(0, blinkDuration / 0.14);
        const eyeClose = Math.sin((1 - progress) * Math.PI);
        eyelids.forEach(lid => {
          lid.scale.y = Math.max(0.001, eyeClose * lid.baseY);
        });

        if (blinkDuration <= 0) {
          isBlinking = false;
          eyelids.forEach(lid => { lid.scale.y = 0.001; });
        }
      }
    }

    function updateWalk(isWalking, speed, dt) {
      updateBlink(dt);

      if (isWalking) {
        walkPhase += dt * (speed || 8.5);
        const swing = Math.sin(walkPhase) * 0.58;

        leftLeg.hip.rotation.x = swing;
        rightLeg.hip.rotation.x = -swing;
        leftLeg.knee.rotation.x = Math.max(0, -swing * 0.80);
        rightLeg.knee.rotation.x = Math.max(0, swing * 0.80);

        leftArm.arm.rotation.x = -swing * 0.48;
        wavingArm.arm.rotation.x = swing * 0.48;

        const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.14;
        torso.position.y = bounce;
        head.position.y = bounce;

        rig.rotation.z = Math.sin(walkPhase) * 0.025;
      } else {
        leftLeg.hip.rotation.x *= 0.82;
        rightLeg.hip.rotation.x *= 0.82;
        leftLeg.knee.rotation.x *= 0.82;
        rightLeg.knee.rotation.x *= 0.82;
        leftArm.arm.rotation.x *= 0.82;
        wavingArm.arm.rotation.x *= 0.82;
        torso.position.y *= 0.82;
        head.position.y *= 0.82;
        rig.rotation.z *= 0.82;

        const breath = Math.sin(Date.now() * 0.002) * 0.015;
        torso.scale.x = 1 + breath * 0.02;
        torso.scale.z = 0.74 + breath * 0.02;
      }
    }

    let waveTime = 0;
    let isWavingActive = false;

    function startWave() {
      isWavingActive = true;
      waveTime = 0;
    }

    function stopWave() {
      isWavingActive = false;
    }

    function updateWave(dt, walking, calmMode) {
      if (walking) {
        isWavingActive = false;
      }
      if (isWavingActive) {
        waveTime += dt;
        if (calmMode) {
          const targetArmZ = -2.1;
          const targetElbowZ = -0.4;
          const targetElbowX = 0.25;
          wavingArm.arm.rotation.z += (targetArmZ - wavingArm.arm.rotation.z) * Math.min(1, dt * 8);
          wavingArm.elbow.rotation.z += (targetElbowZ - wavingArm.elbow.rotation.z) * Math.min(1, dt * 8);
          wavingArm.elbow.rotation.x += (targetElbowX - wavingArm.elbow.rotation.x) * Math.min(1, dt * 8);
        } else {
          const waveOsc = Math.sin(waveTime * 11);
          const targetArmZ = -2.35 + waveOsc * 0.12;
          const targetElbowZ = -0.45 + Math.sin(waveTime * 13) * 0.32;
          const targetElbowX = 0.30;
          wavingArm.arm.rotation.z += (targetArmZ - wavingArm.arm.rotation.z) * Math.min(1, dt * 10);
          wavingArm.elbow.rotation.z += (targetElbowZ - wavingArm.elbow.rotation.z) * Math.min(1, dt * 10);
          wavingArm.elbow.rotation.x += (targetElbowX - wavingArm.elbow.rotation.x) * Math.min(1, dt * 10);

          head.rotation.z += (-0.06 * waveOsc - head.rotation.z) * Math.min(1, dt * 8);
        }
      } else {
        wavingArm.arm.rotation.z += (wavingArm.rest - wavingArm.arm.rotation.z) * Math.min(1, dt * 8);
        wavingArm.elbow.rotation.z += (0 - wavingArm.elbow.rotation.z) * Math.min(1, dt * 8);
        wavingArm.elbow.rotation.x += (0 - wavingArm.elbow.rotation.x) * Math.min(1, dt * 8);
        head.rotation.z += (0 - head.rotation.z) * Math.min(1, dt * 8);
      }
      return isWavingActive;
    }

    function resetLimbs() {
      leftLeg.hip.rotation.set(0, 0, 0);
      rightLeg.hip.rotation.set(0, 0, 0);
      leftLeg.knee.rotation.set(0, 0, 0);
      rightLeg.knee.rotation.set(0, 0, 0);
      leftArm.arm.rotation.set(0, 0, leftArm.rest);
      leftArm.elbow.rotation.set(0, 0, 0);
      wavingArm.arm.rotation.set(0, 0, wavingArm.rest);
      wavingArm.elbow.rotation.set(0, 0, 0);
      torso.position.set(0, 0, 0);
      head.position.set(0, 0, 0);
      head.rotation.set(-0.18, 0, 0);
      eyelids.forEach(lid => { lid.scale.y = 0.001; });
      isWavingActive = false;
    }

    return {
      rig, head, torso, mouth, wavingArm, leftArm, leftLeg, rightLeg,
      updateWalk, updateBlink, startWave, stopWave, updateWave, resetLimbs,
      footY: b3.min.y,
      height: b3.max.y - b3.min.y
    };
  }
};
