// Every sound on the Packs page is synthesised here with the Web Audio API, so
// there are no audio files to ship. Nothing plays until the first click (a browser
// rule), and the audio context is only created then.

let ctx = null;
let master = null;
let reverb = null;
let volume = 0.7;
let muted = false;

// A pack's worth of cards is a run of "good pulls"; the chime climbs a semitone for
// each one in a row, up to a cap, and resets on a common
let streak = 0;

function context() {
  if (!ctx) {
    const Ctx = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume;
    const limiter = ctx.createDynamicsCompressor();
    master.connect(limiter).connect(ctx.destination);

    // a short decaying-noise room, for the shimmer on the good chimes
    const length = Math.floor(ctx.sampleRate * 1.8);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4);
    }
    reverb = ctx.createConvolver();
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    reverb.connect(wet).connect(limiter);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
  if (master) master.gain.value = muted ? 0 : volume;
}

export function setVolume(value) {
  volume = value;
  if (master && !muted) master.gain.value = volume;
}

function noiseBuffer(seconds) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// One oscillator note with an attack/decay envelope
function tone({ freq, at = 0, length = 0.4, type = "sine", gain = 0.2, glideTo, wet = 0, attack = 0.005, detune = 0 }) {
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + length);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(amp).connect(master);
  if (wet) {
    const send = ctx.createGain();
    send.gain.value = wet;
    amp.connect(send).connect(reverb);
  }
  osc.start(start);
  osc.stop(start + length + 0.05);
}

// Filtered noise, optionally sweeping between two cut-off frequencies
function noise({ at = 0, length = 0.3, from = 2000, to = from, gain = 0.2, type = "bandpass", q = 1, rise = false }) {
  const start = ctx.currentTime + at;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(length + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(to, start + length);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(rise ? 0.0001 : gain, start);
  if (rise) amp.gain.exponentialRampToValueAtTime(gain, start + length * 0.95);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  source.connect(filter).connect(amp).connect(master);
  source.start(start);
}

const semitones = n => Math.pow(2, n / 12);

function buzz(pattern) {
  try {
    // browsers refuse (and log) a vibration that no tap has unlocked yet
    if (navigator.userActivation?.isActive !== false) navigator.vibrate?.(pattern);
  } catch {
    // vibration is a bonus; some browsers refuse it
  }
}

// Tearing the pack open
export function playRip() {
  if (!context()) return;
  streak = 0;
  noise({ length: 0.55, from: 700, to: 4200, gain: 0.35, q: 0.9 });
  noise({ at: 0.05, length: 0.4, from: 1500, to: 6000, gain: 0.15, type: "highpass" });
  tone({ freq: 110, glideTo: 38, length: 0.35, gain: 0.5, type: "triangle" });
  buzz(30);
}

// How long the build-up before a flip lasts, in milliseconds. The page waits this
// long before turning the card, so the sound has room to climb.
const BUILD_UP = { common: 0, rare: 0, sticker: 0, epic: 450, legendary: 750, gold: 1100 };

export function anticipation(tier) {
  const delay = BUILD_UP[tier] ?? 0;
  if (delay && context()) {
    const seconds = delay / 1000;
    noise({ length: seconds, from: 300, to: 5000, gain: 0.32, rise: true, q: 2 });
    tone({ freq: 140, glideTo: tier === "gold" ? 900 : 520, length: seconds, gain: 0.16, type: "sawtooth", attack: seconds * 0.8 });
    buzz(tier === "gold" ? [40, 40, 60, 40, 90] : 25);
  }
  return delay;
}

const CHORDS = {
  rare: [523.25, 659.25, 783.99],
  epic: [523.25, 659.25, 783.99, 1046.5],
  legendary: [392, 523.25, 659.25, 783.99, 1046.5],
  gold: [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
};

// The moment the card turns face up
export function playReveal(tier) {
  if (!context()) return;

  if (tier === "sticker") {
    tone({ freq: 320, glideTo: 940, length: 0.16, gain: 0.25, type: "square", wet: 0.1 });
    noise({ length: 0.12, from: 4000, to: 9000, gain: 0.1, type: "highpass" });
    tone({ freq: 1200, at: 0.1, length: 0.18, gain: 0.12, wet: 0.2 });
    return;
  }

  // a card turning over, on top of whatever else plays
  noise({ length: 0.08, from: 3000, to: 1500, gain: 0.15, type: "highpass" });

  if (tier === "common") {
    streak = 0;
    tone({ freq: 392, length: 0.18, gain: 0.14, type: "triangle" });
    return;
  }

  streak = Math.min(streak + 1, 7);
  const lift = semitones(streak - 1);
  const chord = CHORDS[tier];

  if (tier === "rare") {
    chord.forEach((freq, i) => tone({ freq: freq * lift, at: i * 0.07, length: 0.45, gain: 0.16, type: "triangle", wet: 0.35 }));
    noise({ at: 0.05, length: 0.5, from: 6000, to: 12000, gain: 0.06, type: "highpass" });
    return;
  }

  // Epic and up: an impact, then a chord that blooms into reverb, then sparkles
  const big = tier !== "epic";
  tone({ freq: 90, glideTo: 30, length: 0.7, gain: big ? 0.75 : 0.55, type: "sine" });
  noise({ length: 0.45, from: 5000, to: 400, gain: big ? 0.5 : 0.35, type: "lowpass" });
  chord.forEach((freq, i) => {
    tone({ freq: freq * lift, at: 0.03 + i * 0.05, length: 1.6, gain: 0.13, type: "sawtooth", wet: 0.6, detune: -6 });
    tone({ freq: freq * lift, at: 0.03 + i * 0.05, length: 1.6, gain: 0.1, type: "sawtooth", wet: 0.6, detune: 7 });
  });
  const sparkles = tier === "gold" ? 14 : tier === "legendary" ? 9 : 5;
  for (let i = 0; i < sparkles; i++) {
    tone({
      freq: 1568 * semitones([0, 4, 7, 12, 16][i % 5]) * (tier === "gold" ? 1 : lift),
      at: 0.25 + i * 0.075,
      length: 0.35,
      gain: 0.07,
      wet: 0.5
    });
  }
  if (tier === "gold") {
    // coin-like pings on top
    [0, 0.12, 0.24].forEach(at => tone({ freq: 2093, at: 0.4 + at, length: 0.5, gain: 0.1, type: "square", wet: 0.4 }));
  }
  buzz(tier === "gold" ? [120, 40, 120, 40, 200] : big ? [90, 30, 90] : 60);
}

// A small tick for a UI control
export function playTick() {
  if (!context()) return;
  tone({ freq: 880, length: 0.05, gain: 0.08, type: "square" });
}
