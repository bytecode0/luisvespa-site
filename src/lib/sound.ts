/**
 * Opt-in sound design, generated in the browser with the Web Audio API (no audio files, no licences).
 *
 * - Off by default. Only a user gesture can start it (browsers require that anyway).
 * - Ambient: a low, slowly evolving drone with a faint server-room hiss.
 * - Micro sounds: key clicks for decrypting text, a soft tick on menu hover,
 *   a blip when a control-plane node lights up, a short chord for human approvals.
 * - Suspends itself in hidden tabs. Never runs with reduced motion.
 */

type Listener = () => void;

const STORAGE_KEY = "sound";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambientStarted = false;
  private lastClick = 0;
  private listeners = new Set<Listener>();
  enabled = false;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this.enabled = localStorage.getItem(STORAGE_KEY) === "on" && this.allowed();
    } catch {
      this.enabled = false;
    }
    // A stored "on" preference can only start after the first interaction on the page.
    if (this.enabled) {
      const start = () => {
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
        if (this.enabled) this.start();
      };
      window.addEventListener("pointerdown", start);
      window.addEventListener("keydown", start);
    }
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) void this.ctx.suspend();
      else if (this.enabled) void this.ctx.resume();
    });
  }

  /** Sound is never offered to people who asked for reduced motion. */
  allowed() {
    return typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };

  getSnapshot = () => this.enabled;

  toggle() {
    if (this.enabled) this.disable();
    else this.enable();
  }

  enable() {
    if (!this.allowed()) return;
    this.enabled = true;
    this.persist();
    this.start();
    this.emit();
  }

  disable() {
    this.enabled = false;
    this.persist();
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0, now, 0.12);
      window.setTimeout(() => {
        if (!this.enabled) void this.ctx?.suspend();
      }, 600);
    }
    this.emit();
  }

  /* ---------- Micro sounds ---------- */

  /** Mechanical key click, rate-limited so decrypting text never sounds like a machine gun. */
  click() {
    const ctx = this.ready();
    if (!ctx || !this.noise || !this.sfx) return;
    const now = ctx.currentTime;
    if (now - this.lastClick < 0.045) return;
    this.lastClick = now;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.5;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    src.connect(hp).connect(g).connect(this.sfx);
    src.start(now, Math.random() * 0.5, 0.03);
  }

  /** Soft high tick for menu hover. */
  hover() {
    this.tone(1760, 0.04, 0.035, "sine");
  }

  /** Rising blip: a node on the control plane lights up. */
  blip() {
    const ctx = this.ready();
    if (!ctx || !this.sfx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g).connect(this.sfx);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Short warm chord: a human approval gate. */
  chord() {
    const ctx = this.ready();
    if (!ctx || !this.sfx) return;
    const now = ctx.currentTime;
    for (const f of [523.25, 659.25, 783.99]) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.045, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.connect(g).connect(this.sfx);
      osc.start(now);
      osc.stop(now + 1);
    }
  }

  /* ---------- Internals ---------- */

  private ready() {
    if (!this.enabled || !this.ctx || this.ctx.state !== "running") return null;
    return this.ctx;
  }

  private tone(freq: number, dur: number, vol: number, type: OscillatorType) {
    const ctx = this.ready();
    if (!ctx || !this.sfx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g).connect(this.sfx);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  private start() {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      this.sfx = this.ctx.createGain();
      this.sfx.gain.value = 0.9;
      this.sfx.connect(this.master);
      this.noise = this.makeNoise(2);
    }
    void this.ctx.resume().then(() => {
      if (!this.ctx || !this.master) return;
      if (!this.ambientStarted) this.startAmbient();
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(1, now, 0.6);
    });
  }

  private startAmbient() {
    const ctx = this.ctx!;
    this.ambientStarted = true;

    // Drone: detuned low partials through a lowpass whose cutoff drifts slowly.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.8;
    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    filter.connect(drone).connect(this.master!);

    const partials: [number, OscillatorType, number][] = [
      [55, "sine", 0.45],
      [82.41, "triangle", 0.22],
      [110, "sine", 0.28],
      [164.81, "triangle", 0.1],
    ];
    for (const [freq, type, vol] of partials) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 12;
      const g = ctx.createGain();
      g.gain.value = vol;
      osc.connect(g).connect(filter);
      osc.start();
    }

    // Slow movement: cutoff and level breathe over ~20 and ~12 seconds.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 220;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();
    const swell = ctx.createOscillator();
    swell.frequency.value = 0.083;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.015;
    swell.connect(swellDepth).connect(drone.gain);
    swell.start();

    // Faint "server room" air.
    const hiss = ctx.createBufferSource();
    hiss.buffer = this.noise;
    hiss.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 900;
    band.Q.value = 0.6;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.012;
    hiss.connect(band).connect(hissGain).connect(this.master!);
    hiss.start();
  }

  private makeNoise(seconds: number) {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, this.enabled ? "on" : "off");
    } catch {
      // Storage blocked: the choice applies to this visit only.
    }
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }
}

let engine: SoundEngine | null = null;

/** The shared engine (client only). */
export function sound(): SoundEngine {
  if (!engine) engine = new SoundEngine();
  return engine;
}
