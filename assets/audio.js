/* ---- Shared soft-audio helper: one context, a volume ceiling, a limiter, and a mute switch ---- */
window.AhaanAudio = (function () {
  let ctx = null, master = null, volume = 0.5, muted = false;
  const CEILING = 0.3;                                   // loudest the master can ever be
  const level = () => (muted ? 0 : volume * CEILING);
  function ensure() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = level();
    const lim = ctx.createDynamicsCompressor();          // safety net against stacked notes
    lim.threshold.value = -24; lim.knee.value = 12; lim.ratio.value = 12; lim.attack.value = 0.003; lim.release.value = 0.25;
    master.connect(lim); lim.connect(ctx.destination);
    return true;
  }
  function apply() { if (master) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.03); }
  return {
    // A bell with its own timbre. partials: [ratio, gain, decayFactor]. Always soft: capped peak, slow fade-in, fade-out.
    strike(freq, o) {
      o = o || {};
      if (muted || volume === 0 || !ensure()) return;
      const t = ctx.currentTime + (o.when || 0);
      const decay = Math.min(o.decay || 2.2, 4), peak = Math.min(o.peak || 0.1, 0.12), attack = Math.max(o.attack || 0.06, 0.05);
      (o.partials || [[1, 1, 1], [2.76, 0.3, 0.6]]).forEach(function (p) {
        const osc = ctx.createOscillator(), g = ctx.createGain(), end = t + decay * (p[2] || 1);
        osc.type = "sine"; osc.frequency.value = freq * p[0];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak * p[1], t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(g); g.connect(master); osc.start(t); osc.stop(end + 0.1);
      });
    },
    setVolume(v) { volume = Math.max(0, Math.min(1, v)); apply(); },
    setMuted(m) { muted = !!m; apply(); },
    // A soft bell: gentle fade-in, long fade-out, never clicks. Peak per partial stays small.
    bell(freq, when, peak) {
      if (muted || volume === 0 || !ensure()) return;
      const t = ctx.currentTime + (when || 0);
      [[1, 1], [2.76, 0.3]].forEach(function (p) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq * p[0];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime((peak || 0.1) * p[1], t + 0.07);   // 70 ms fade-in
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);             // ~2 s fade-out
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.3);
      });
    }
  };
})();
