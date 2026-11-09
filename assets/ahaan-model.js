/* ---- 3D Ahaan Model: A detailed, stylized 3D character of Ahaan.
   The model matches Ahaan's reference photograph:
   - Warm golden-caramel skin tone with subtle peach warmth.
   - Slender oval head with child facial proportions.
   - 3D sculpted expressive almond eyes:
     - Sclera with soft ivory curvature.
     - Dark-chocolate outer limbal ring and warm amber iris.
     - Obsidian pupil with sparkling dual catchlights.
     - Defined dark espresso upper eyelash rim and double eyelid crease.
     - Articulated upper eyelids for smooth procedural blinking.
   - 3D sculpted naturally arched dark espresso eyebrows.
   - 3D sculpted child button nose with soft bridge and sculpted alar wings.
   - 3D sculpted cheerful open smile:
     - Sculpted upper lip with Cupid's bow and plump lower lip.
     - Deep oral cavity with white teeth showing child central incisor gap.
     - Soft pink tongue and smile dimples.
   - Soft peach blush discs on cheekbones.
   - 3D volumetric layered haircut:
     - Volumetric hair cap framing the skull.
     - Forward-swept fringe bangs framing the forehead above brows.
     - Sideburns framing ears and tapered nape of neck.
   - 3D sculpted anatomical ears:
     - Outer C-shaped helix rim, inner antihelix ridge, concha cavum, tragus flap, and fleshy lobule.
     - Angled 12 degrees back and flared 18 degrees from skull.
   - 3D sculpted child hands:
     - Palm with thenar and hypothenar eminences, palmar crease, and knuckle arch.
     - 5 distinct articulated digits in a relaxed natural resting pose.
     - Fingernail plates on fingertips.
   - Wide maroon-and-cream striped polo shirt with collar and buttons.
   - Relaxed light denim jeans with ankle cuffs.
   - Two-tone navy sneakers with white rubber toe caps and sleek contoured dark rubber outsoles.
   - Fully articulated walking, waving, and procedural blinking animations. ---- */

window.AhaanModel = {
  build(T) {
    // ---- Color Palette ----
    const SKIN = 0xc98d64;          // Warm golden-caramel skin tone
    const SKIN_SHADOW = 0xb47952;   // Contoured shadow skin
    const SKIN_EMISSIVE = 0x3d1a0e; // Living subsurface warmth
    const HAIR_BASE = 0x140e0b;     // Dark espresso hair
    const HAIR_STRAND = 0x241812;   // Soft brown highlight strand
    const EYE_WHITE = 0xfcfbfa;     // Soft ivory sclera
    const EYE_IRIS = 0x1d1008;      // Dark chocolate limbal ring
    const EYE_WARM = 0x4e2a14;      // Warm amber iris body
    const EYE_PUPIL = 0x0a0604;     // Obsidian pupil
    const BROW = 0x160f09;          // Dark espresso eyebrows
    const LIP_TOP = 0xa84643;       // Natural coral-rose upper lip
    const LIP_BOT = 0xc45c56;       // Plump warm lower lip
    const MOUTH_IN = 0x361016;      // Deep ruby oral cavity
    const TEETH_WHITE = 0xffffff;   // Pearly white teeth
    const TONGUE = 0xbf525c;        // Soft pink tongue
    const MAROON = 0x5a1d2d;        // Rich maroon polo stripe
    const CREAM = 0xf5f0e1;         // Warm cream polo stripe
    const COLLAR = 0x43121f;        // Solid maroon polo collar
    const JEANS = 0x6e91b8;         // Storybook light denim
    const JEANS_D = 0x5a7c9f;       // Denim shadow tone
    const NAVY = 0x1c2b48;          // Sneaker navy canvas
    const SNEAKER_WHITE = 0xf5f3ee; // Sneaker rubber toe cap and laces
    const OUTSOLE = 0x161d2a;       // Charcoal dark navy rubber outsole
    const OUTSOLE_GRIP = 0x101520;  // Rubber outsole grip line
    const NAIL_TONE = 0xf0d6ca;     // Subtle fingernail keratin plate

    const mat = (color, roughness, metalness) => new T.MeshStandardMaterial({
      color,
      roughness: roughness == null ? 0.78 : roughness,
      metalness: metalness == null ? 0.02 : metalness
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
      roughness: 0.90,
      metalness: 0.01,
      emissive: SKIN_EMISSIVE,
      emissiveIntensity: 0.06
    });

    const skinShadowMat = new T.MeshStandardMaterial({
      color: SKIN_SHADOW,
      roughness: 0.92,
      metalness: 0.01,
      emissive: 0x2c1208,
      emissiveIntensity: 0.05
    });

    const hairMat = mat(HAIR_BASE, 0.92, 0.02);
    const hairStrandMat = mat(HAIR_STRAND, 0.92, 0.02);
    const nailMat = mat(NAIL_TONE, 0.60, 0.01);

    // Polo horizontal stripes texture
    function createPoloTexture(bands) {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = bands * 32;
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
    const poloMat = new T.MeshStandardMaterial({ map: poloTex, roughness: 0.94 });

    const prof = [
      [0.001, -1.40], [0.52, -1.42], [1.02, -1.56], [1.18, -1.84],
      [1.16, -2.20], [1.08, -2.75], [1.02, -3.35], [1.04, -3.85], [0.001, -3.92]
    ].reverse().map(p => new T.Vector2(p[0], p[1]));

    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), poloMat);
    torso.scale.z = 0.74;
    rig.add(torso);

    // ==========================================
    // 1b. Seamless Anatomical Neck & Cervical Socket
    // ==========================================
    // Tall neck cylinder extending deeply from inside torso up into skull cavity (height 0.96)
    const neck = part(new T.CylinderGeometry(0.36, 0.42, 0.96, 24), skinMat, 0, -0.98, 0);
    rig.add(neck);

    // Anatomical Cervical Ball Joint: seamless spherical collar bridging neck into skull base
    const neckBall = part(new T.SphereGeometry(0.38, 24, 18), skinMat, 0, -0.74, 0);
    neckBall.scale.set(1.02, 0.90, 1.0);
    rig.add(neckBall);

    // Posterior Nape of Neck (fills rear cervical spine transition into skull base)
    const neckNape = part(new T.CapsuleGeometry(0.28, 0.46, 8, 16), skinMat, 0, -0.88, -0.10);
    neckNape.rotation.x = 0.15;
    rig.add(neckNape);

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
    // 2. Articulated Arms & Realistic Child Hands
    // ==========================================
    const sleeveTex = createPoloTexture(6);
    const sleeveMat = new T.MeshStandardMaterial({ map: sleeveTex, roughness: 0.94 });
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

      // Symmetrical local coordinate frame for the child hand
      // When isRight is true (side < 0), +X points medial (radial/thumb side)
      // When isRight is false (side > 0), -X points medial (radial/thumb side)
      const isRight = side < 0;
      const handLocal = new T.Group();
      handLocal.scale.x = isRight ? 1 : -1;
      hand.add(handLocal);

      // Carpal junction connecting forearm to palm
      handLocal.add(part(sphere, skinMat, 0, -0.015, 0, 0.110, 0.045, 0.065));

      // Central palm body with soft child curvature
      handLocal.add(part(sphere, skinMat, 0, -0.070, 0, 0.125, 0.135, 0.062));

      // Fleshy thenar eminence (thumb mound on radial side)
      handLocal.add(part(sphere, skinMat, 0.070, -0.055, 0.014, 0.060, 0.075, 0.048));

      // Hypothenar eminence (pinky pad on ulnar side)
      handLocal.add(part(sphere, skinMat, -0.070, -0.065, 0.008, 0.050, 0.070, 0.042));

      // Palmar crease indentation
      const palmarCrease = part(new T.BoxGeometry(0.10, 0.012, 0.016), skinShadowMat, 0.01, -0.065, 0.028);
      palmarCrease.rotation.z = 0.22;
      handLocal.add(palmarCrease);

      // Knuckle pads across distal palm arch
      const knuckleDefs = [
        { x: 0.062, y: -0.130, z: -0.004 }, // Index
        { x: 0.021, y: -0.136, z: 0.000 },  // Middle
        { x: -0.021, y: -0.132, z: -0.004 },// Ring
        { x: -0.062, y: -0.122, z: -0.008 } // Pinky
      ];
      knuckleDefs.forEach(kd => {
        handLocal.add(part(sphere, skinMat, kd.x, kd.y, kd.z, 0.030, 0.030, 0.026));
      });

      // Helper function to build an articulated finger
      function buildFinger(cfg) {
        const base = new T.Group();
        base.position.set(cfg.x, cfg.y, cfg.z);
        base.rotation.set(cfg.rx1, 0, cfg.rz);

        // Proximal phalanx
        const prox = part(new T.CapsuleGeometry(cfg.r1, cfg.len1, 6, 10), skinMat, 0, -cfg.len1 * 0.5, 0);
        base.add(prox);

        // Middle joint
        const midJoint = new T.Group();
        midJoint.position.set(0, -cfg.len1, 0);
        midJoint.rotation.x = cfg.rx2;
        base.add(midJoint);

        const mid = part(new T.CapsuleGeometry(cfg.r2, cfg.len2, 6, 10), skinMat, 0, -cfg.len2 * 0.5, 0);
        midJoint.add(mid);

        // Distal joint
        const distJoint = new T.Group();
        distJoint.position.set(0, -cfg.len2, 0);
        distJoint.rotation.x = cfg.rx3;
        midJoint.add(distJoint);

        const dist = part(new T.CapsuleGeometry(cfg.r3, cfg.len3, 6, 10), skinMat, 0, -cfg.len3 * 0.5, 0);
        distJoint.add(dist);

        // Fingernail plate on dorsal aspect
        const nail = part(sphere, nailMat, 0, -cfg.len3 * 0.55, -cfg.r3 * 0.78, cfg.r3 * 0.75, cfg.r3 * 0.95, cfg.r3 * 0.35);
        distJoint.add(nail);

        return base;
      }

      // Index finger (slightly shorter than middle, curved gently inward)
      const indexFinger = buildFinger({
        x: 0.062, y: -0.130, z: -0.004,
        rx1: 0.20, rz: -0.07,
        r1: 0.027, len1: 0.060,
        rx2: 0.22, r2: 0.024, len2: 0.048,
        rx3: 0.16, r3: 0.021, len3: 0.036
      });
      handLocal.add(indexFinger);

      // Middle finger (longest digit)
      const middleFinger = buildFinger({
        x: 0.021, y: -0.136, z: 0.000,
        rx1: 0.18, rz: 0.0,
        r1: 0.028, len1: 0.070,
        rx2: 0.20, r2: 0.025, len2: 0.056,
        rx3: 0.15, r3: 0.022, len3: 0.040
      });
      handLocal.add(middleFinger);

      // Ring finger (slightly shorter than middle)
      const ringFinger = buildFinger({
        x: -0.021, y: -0.132, z: -0.004,
        rx1: 0.19, rz: 0.06,
        r1: 0.026, len1: 0.064,
        rx2: 0.21, r2: 0.023, len2: 0.050,
        rx3: 0.16, r3: 0.020, len3: 0.036
      });
      handLocal.add(ringFinger);

      // Pinky finger (shortest, slighter digit)
      const pinkyFinger = buildFinger({
        x: -0.062, y: -0.122, z: -0.008,
        rx1: 0.24, rz: 0.12,
        r1: 0.022, len1: 0.048,
        rx2: 0.24, r2: 0.019, len2: 0.036,
        rx3: 0.18, r3: 0.017, len3: 0.028
      });
      handLocal.add(pinkyFinger);

      // Opposed thumb (2 articulated segments, angled forward-inward)
      const thumbBase = new T.Group();
      thumbBase.position.set(0.086, -0.058, 0.020);
      thumbBase.rotation.set(0.36, 0.18, -0.46);

      const thumbProx = part(new T.CapsuleGeometry(0.033, 0.064, 6, 10), skinMat, 0, -0.032, 0);
      thumbBase.add(thumbProx);

      const thumbDistJoint = new T.Group();
      thumbDistJoint.position.set(0, -0.064, 0);
      thumbDistJoint.rotation.set(0.15, 0, -0.22);
      thumbBase.add(thumbDistJoint);

      const thumbDist = part(new T.CapsuleGeometry(0.029, 0.054, 6, 10), skinMat, 0, -0.027, 0);
      thumbDistJoint.add(thumbDist);

      const thumbNail = part(sphere, nailMat, 0, -0.030, -0.023, 0.019, 0.023, 0.008);
      thumbDistJoint.add(thumbNail);

      handLocal.add(thumbBase);

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

      // Sneaker navy canvas upper body
      const sneakerBody = part(sphere, mat(NAVY, 0.76), 0, 0, 0, 0.39, 0.22, 0.66);
      foot.add(sneakerBody);

      // Sneaker laces on instep
      const laces = part(new T.BoxGeometry(0.22, 0.035, 0.30), mat(CREAM, 0.75), 0, 0.10, 0.12);
      laces.rotation.x = -0.32;
      foot.add(laces);

      // Sleek contoured dark rubber outsole (matching foot width: width 0.38, length 0.68, height 0.04)
      // Completely removes the oversized white block under the shoe.
      const outsole = part(new T.BoxGeometry(0.38, 0.04, 0.68), mat(OUTSOLE, 0.88, 0.04), 0, -0.20, 0.02);
      foot.add(outsole);

      // Subtle outsole rubber grip lines underneath
      [-0.18, 0.02, 0.22].forEach(gz => {
        const grip = part(new T.BoxGeometry(0.34, 0.012, 0.032), mat(OUTSOLE_GRIP, 0.95), 0, -0.021, gz);
        outsole.add(grip);
      });

      return { hip, knee, foot };
    }

    const rightLeg = makeLeg(-1);
    const leftLeg = makeLeg(1);

    // ==========================================
    // 4. 3D Sculpted Child Head Mesh
    // ==========================================
    const head = new T.Group();
    head.rotation.x = -0.06; // Subtle natural forward head angle
    rig.add(head);

    // Smooth contoured child head geometry
    const headGeo = new T.SphereGeometry(1, 48, 36);
    headGeo.scale(0.92, 0.96, 0.92);
    const skullMesh = new T.Mesh(headGeo, skinMat);
    head.add(skullMesh);

    // Soft child cheeks and rounded jaw contour
    [-1, 1].forEach(s => {
      const cheek = part(sphere, skinMat, s * 0.38, -0.16, 0.44, 0.36, 0.36, 0.32);
      head.add(cheek);
    });
    const chin = part(sphere, skinMat, 0, -0.58, 0.38, 0.30, 0.24, 0.28);
    head.add(chin);

    // Submental Throat Wedge (rotates with head to keep jaw-neck transition solid and closed)
    const throat = part(new T.SphereGeometry(0.36, 24, 16), skinMat, 0, -0.65, 0.12);
    throat.scale.set(0.92, 0.75, 1.15);
    head.add(throat);

    // Mandibular angle transition (under jaw sides bridging to neck)
    [-1, 1].forEach(s => {
      const jawAngle = part(new T.SphereGeometry(0.24, 16, 12), skinMat, s * 0.28, -0.56, 0.08);
      jawAngle.scale.set(0.85, 0.85, 1.0);
      head.add(jawAngle);
    });

    // ==========================================
    // 5. 3D Sculpted Expressive Eyes & Eyelids
    // ==========================================
    const eyes = [];
    const eyelids = [];
    const brows = [];

    const scleraMat = mat(EYE_WHITE, 0.25, 0.02);
    const irisOuterMat = mat(EYE_IRIS, 0.22, 0.04);
    const irisWarmMat = mat(EYE_WARM, 0.25, 0.02);
    const pupilMat = mat(EYE_PUPIL, 0.10, 0.08);
    const catchlightMat = mat(0xffffff, 0.05, 0.1);
    const browMat = mat(BROW, 0.85);
    const lashMat = mat(0x18100a, 0.85);

    [-1, 1].forEach(side => {
      const eyeSocket = new T.Group();
      // Positioned on the front contour of the skull with authentic child proportions
      eyeSocket.position.set(side * 0.30, -0.02, 0.91);
      eyeSocket.rotation.y = side * 0.16;
      eyeSocket.rotation.z = -side * 0.05; // Gentle almond slant matching photo
      head.add(eyeSocket);

      // Sclera (Eye White with authentic curvature)
      const sclera = part(sphere, scleraMat, 0, 0, 0, 0.142, 0.108, 0.038);
      eyeSocket.add(sclera);

      // Iris & Pupil Group positioned clearly on corneal surface
      const iris = new T.Group();
      iris.position.set(0, 0, 0.035);

      // Outer deep chocolate limbal ring matching photo
      const irisOuter = part(sphere, irisOuterMat, 0, 0, 0.002, 0.086, 0.086, 0.008);
      iris.add(irisOuter);

      // Inner warm amber iris body with radial depth
      const irisInner = part(sphere, irisWarmMat, 0, 0, 0.004, 0.066, 0.066, 0.007);
      iris.add(irisInner);

      // Radial warm highlight ring
      const irisGleam = part(sphere, mat(0x6e3d1c, 0.30), 0, 0, 0.006, 0.048, 0.048, 0.006);
      iris.add(irisGleam);

      // Obsidian pupil
      const pupil = part(sphere, pupilMat, 0, 0, 0.008, 0.036, 0.036, 0.006);
      iris.add(pupil);

      // Dual specular sparkle catchlights
      const catchPrimary = part(sphere, catchlightMat, 0.018, 0.018, 0.012, 0.016, 0.016, 0.005);
      const catchSecondary = part(sphere, catchlightMat, -0.014, -0.014, 0.011, 0.009, 0.009, 0.004);
      iris.add(catchPrimary);
      iris.add(catchSecondary);

      eyeSocket.add(iris);
      eyes.push({ socket: eyeSocket, iris });

      // Crisp upper eyelid / eyelash rim framing top of eye
      const lashRim = part(new T.CapsuleGeometry(0.009, 0.20, 6, 12), lashMat, 0, 0.052, 0.038);
      lashRim.rotation.set(0, 0, Math.PI / 2);
      lashRim.scale.set(1.0, 0.70, 0.50);
      eyeSocket.add(lashRim);

      // Double Eyelid Crease matching reference photo
      const crease = part(new T.CapsuleGeometry(0.004, 0.16, 4, 10), skinShadowMat, 0, 0.072, 0.036);
      crease.rotation.set(0, 0, Math.PI / 2);
      crease.scale.set(1.0, 0.60, 0.40);
      eyeSocket.add(crease);

      // Articulated Upper Eyelid for Blinking
      const eyelid = part(sphere, skinMat, 0, 0.070, 0.036, 0.144, 0.001, 0.038);
      eyelid.baseY = 0.105;
      eyeSocket.add(eyelid);
      eyelids.push(eyelid);

      // 3D Sculpted Naturally Arched Eyebrow matching photo
      const browGroup = new T.Group();
      browGroup.position.set(side * 0.30, 0.14, 0.92);
      browGroup.rotation.set(-0.06, side * 0.16, -side * 0.12);

      // Smooth single arched eyebrow body
      const browMesh = part(new T.CapsuleGeometry(0.026, 0.22, 8, 16), browMat, 0, 0, 0);
      browMesh.rotation.set(0, 0, Math.PI / 2);
      browMesh.scale.set(1.0, 0.85, 0.40);
      browGroup.add(browMesh);

      head.add(browGroup);
      brows.push(browGroup);

      // Soft rosy peach cheek blush
      const blushMat = new T.MeshBasicMaterial({ color: 0xdb6b56, transparent: true, opacity: 0.28 });
      const blush = part(new T.CircleGeometry(0.130, 18), blushMat, side * 0.40, -0.15, 0.88);
      blush.rotation.y = side * 0.26;
      head.add(blush);
    });

    // ==========================================
    // 6. 3D Sculpted Child Button Nose
    // ==========================================
    const noseGroup = new T.Group();
    noseGroup.position.set(0, -0.14, 0.94);

    // Nasal bridge sloping smoothly from glabella to tip
    const bridge = part(new T.CapsuleGeometry(0.018, 0.065, 6, 12), skinMat, 0, 0.008, 0.018);
    bridge.rotation.x = 1.15;
    bridge.scale.set(1.0, 1.0, 0.65);
    noseGroup.add(bridge);

    // Soft rounded child button nose tip
    const tip = part(sphere, skinMat, 0, -0.028, 0.040, 0.044, 0.040, 0.042);
    noseGroup.add(tip);

    // Sculpted alar wings and nostril shadows
    [-1, 1].forEach(s => {
      const ala = part(sphere, skinMat, s * 0.034, -0.032, 0.024, 0.024, 0.020, 0.020);
      noseGroup.add(ala);

      const nostril = part(sphere, mat(0x421e14, 0.9), s * 0.018, -0.040, 0.022, 0.010, 0.008, 0.010);
      noseGroup.add(nostril);
    });

    head.add(noseGroup);

    // ==========================================
    // 7. 3D Sculpted Open Smile with Teeth
    // ==========================================
    const mouth = new T.Group();
    mouth.position.set(0, -0.36, 0.88);
    mouth.rotation.x = 0.08; // Angled for camera visibility

    // Recessed warm ruby oral cavity behind teeth
    const cavity = part(sphere, mat(MOUTH_IN, 0.92), 0, -0.006, -0.010, 0.125, 0.048, 0.020);
    mouth.add(cavity);

    // Pearly white upper front teeth showing cute child central incisor gap
    const teethMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.20, metalness: 0.02 });
    const toothL = part(new T.BoxGeometry(0.030, 0.024, 0.014), teethMat, -0.018, 0.004, 0.016);
    const toothR = part(new T.BoxGeometry(0.030, 0.024, 0.014), teethMat, 0.018, 0.004, 0.016);
    mouth.add(toothL);
    mouth.add(toothR);

    // Lateral teeth curving back along dental arch
    [-1, 1].forEach(s => {
      const toothLat = part(new T.BoxGeometry(0.022, 0.018, 0.012), teethMat, s * 0.046, 0.006, 0.012);
      toothLat.rotation.y = -s * 0.35;
      mouth.add(toothLat);
    });

    // Soft pink tongue
    const tongue = part(sphere, mat(TONGUE, 0.55), 0, -0.022, 0.016, 0.065, 0.018, 0.035);
    mouth.add(tongue);

    // Realistic Cupid's bow upper lip
    [-1, 1].forEach(s => {
      const upperHalf = part(new T.CapsuleGeometry(0.016, 0.085, 6, 12), mat(LIP_TOP, 0.65), s * 0.044, 0.018, 0.026);
      upperHalf.rotation.set(0, 0, Math.PI / 2 - s * 0.18);
      upperHalf.scale.set(1.0, 0.70, 0.55);
      mouth.add(upperHalf);
    });

    const philtrumNode = part(sphere, mat(LIP_TOP, 0.65), 0, 0.022, 0.026, 0.014, 0.014, 0.012);
    mouth.add(philtrumNode);

    // Plump warm lower lip
    const lowerLip = part(new T.CapsuleGeometry(0.020, 0.125, 6, 12), mat(LIP_BOT, 0.60), 0, -0.026, 0.026);
    lowerLip.rotation.set(0, 0, Math.PI / 2);
    lowerLip.scale.set(1.0, 0.75, 0.60);
    mouth.add(lowerLip);

    // Smile corner dimples
    [-1, 1].forEach(s => {
      const dimple = part(sphere, skinShadowMat, s * 0.120, -0.002, 0.020, 0.014, 0.018, 0.010);
      mouth.add(dimple);
    });

    head.add(mouth);

    // ==========================================
    // 8. Realistic Sculpted Human Ears
    // ==========================================
    [-1, 1].forEach(s => {
      const ear = new T.Group();
      // Positioned on the lateral skull plane
      ear.position.set(s * 0.88, -0.05, 0.06);
      // Angled 12 degrees back and flared 18 degrees from skull
      ear.rotation.set(-0.21, s * 0.314, -s * 0.06);

      // Symmetric local frame where +X is lateral, +Y is superior, +Z is anterior
      const earLocal = new T.Group();
      earLocal.scale.set(s, 1, 1);
      ear.add(earLocal);

      // Base concha backing blending smoothly into skull
      const backing = part(sphere, skinMat, 0.012, -0.018, -0.010, 0.045, 0.180, 0.120);
      earLocal.add(backing);

      // Outer curved C-shaped helix rim using TorusGeometry
      const helix = part(new T.TorusGeometry(0.120, 0.022, 10, 24, Math.PI * 1.35), skinMat, 0.018, 0.005, 0.005);
      helix.rotation.set(0, -Math.PI / 2, 0.32);
      earLocal.add(helix);

      // Inner antihelix ridge contouring inside the helix
      const antihelix = part(new T.TorusGeometry(0.080, 0.016, 8, 20, Math.PI * 1.05), skinMat, 0.016, -0.008, -0.004);
      antihelix.rotation.set(0, -Math.PI / 2, 0.42);
      earLocal.add(antihelix);

      // Concha cavum depression with deeper shadow skin tone
      const concha = part(sphere, mat(0x945636, 0.75), 0.010, -0.018, 0.012, 0.055, 0.085, 0.055);
      earLocal.add(concha);

      // Acoustic meatus canal depression
      const meatus = part(sphere, mat(0x32160e, 0.95), 0.012, -0.030, 0.042, 0.024, 0.034, 0.020);
      earLocal.add(meatus);

      // Tragus flap shielding acoustic meatus
      const tragus = part(sphere, skinMat, 0.028, -0.030, 0.055, 0.032, 0.044, 0.028);
      tragus.rotation.y = -0.35;
      earLocal.add(tragus);

      // Antitragus prominence
      const antitragus = part(sphere, skinMat, 0.024, -0.080, 0.015, 0.028, 0.028, 0.024);
      earLocal.add(antitragus);

      // Fleshy soft anatomical child lobule (earlobe) at base
      const lobule = part(sphere, skinMat, 0.018, -0.125, 0.006, 0.052, 0.065, 0.046);
      earLocal.add(lobule);

      head.add(ear);
    });

    // ==========================================
    // 9. 3D Volumetric Sculpted Layered Hair
    // ==========================================
    const hairGroup = new T.Group();
    head.add(hairGroup);

    // Smooth volumetric crown and skull volume
    const crown = part(sphere, hairMat, 0, 0.22, -0.06, 0.94, 0.94, 0.98);
    hairGroup.add(crown);

    // Back of head and nape volume
    const nape = part(sphere, hairMat, 0, 0.02, -0.22, 0.91, 0.96, 0.86);
    hairGroup.add(nape);

    // Soft temple taper blending skull contour into sideburns
    [-1, 1].forEach(s => {
      const temple = part(sphere, hairMat, s * 0.44, 0.16, 0.02, 0.44, 0.68, 0.72);
      hairGroup.add(temple);
    });

    // Forehead bangs / fringe locks matching reference photo
    const bangsCount = 9;
    for (let i = 0; i < bangsCount; i++) {
      const u = (i / (bangsCount - 1)) * 2 - 1; // -1 to +1
      const bx = u * 0.40;
      const by = 0.22 - Math.pow(u, 2) * 0.045; // Natural gentle arch
      const bz = 0.88 - Math.abs(u) * 0.07;
      const bLock = part(
        new T.CapsuleGeometry(0.044, 0.15, 8, 12),
        i % 2 === 0 ? hairMat : hairStrandMat,
        bx, by, bz
      );
      bLock.rotation.set(1.15, -u * 0.24, -u * 0.30);
      bLock.scale.set(0.95, 0.65, 0.45);
      hairGroup.add(bLock);
    }

    // Sideburn locks framing front of ears
    [-1, 1].forEach(s => {
      const sideburn = part(new T.CapsuleGeometry(0.045, 0.19, 8, 12), hairMat, s * 0.82, 0.04, 0.14);
      sideburn.rotation.set(0.18, 0, s * 0.12);
      sideburn.scale.set(0.60, 1, 0.75);
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
        neck.position.y = -0.98 + bounce;
        neckBall.position.y = -0.74 + bounce;
        neckNape.position.y = -0.88 + bounce;
        collarRing.position.y = -1.46 + bounce;

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
        neck.position.y = -0.98 + (neck.position.y - (-0.98)) * 0.82;
        neckBall.position.y = -0.74 + (neckBall.position.y - (-0.74)) * 0.82;
        neckNape.position.y = -0.88 + (neckNape.position.y - (-0.88)) * 0.82;
        collarRing.position.y = -1.46 + (collarRing.position.y - (-1.46)) * 0.82;
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
      head.rotation.set(-0.06, 0, 0);
      neck.position.set(0, -0.98, 0);
      neckBall.position.set(0, -0.74, 0);
      neckNape.position.set(0, -0.88, -0.10);
      collarRing.position.set(0, -1.46, 0.02);
      eyelids.forEach(lid => { lid.scale.y = 0.001; });
      isWavingActive = false;
    }

    function chomp() {
      // Gentle animated jaw chomp action
      const origY = mouth.position.y;
      mouth.position.y = origY - 0.035;
      setTimeout(() => {
        mouth.position.y = origY;
      }, 160);
    }

    function pose(name) {
      // Named pose transitions
      if (name === "reach") {
        leftArm.arm.rotation.set(-1.10, 0, 0.20);
        leftArm.elbow.rotation.set(0.40, 0, 0);
      } else if (name === "mouth") {
        leftArm.arm.rotation.set(-1.45, 0, 0.40);
        leftArm.elbow.rotation.set(1.20, 0, 0);
      } else if (name === "rest") {
        resetLimbs();
      }
    }

    return {
      rig, head, torso, neck, neckBall, neckNape, collarRing, mouth, wavingArm, leftArm, leftLeg, rightLeg,
      updateWalk, updateBlink, startWave, stopWave, updateWave, resetLimbs,
      chomp, pose,
      footY: b3.min.y,
      height: b3.max.y - b3.min.y
    };
  }
};
