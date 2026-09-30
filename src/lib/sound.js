// Every sound on the Packs page is synthesised here with the Web Audio API, so there
// are no audio files to ship. Nothing plays until the first click (a browser rule), and
// the audio context is only created then.
//
// The aim is the sound of real cards, not of a game awarding points: tearing a foil
// wrapper, paper sliding, a card being laid on a table. Only the rewards carry a note,
// and those are soft glassy bells (a sine plus two quiet, inharmonic overtones), never
// buzzy square or sawtooth tones.

let ctx = null;
let master = null;
let reverb = null;
let volume = 0.7;
let muted = false;

// A pack's worth of cards is a run of "good pulls"; the bells climb a semitone for each
// one in a row, up to a cap, and start over on a common
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

    // a small, soft room, so the bells ring a little without turning into a cathedral
    const length = Math.floor(ctx.sampleRate * 1.4);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    }
    reverb = ctx.createConvolver();
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.4;
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
const between = (low, high) => low + Math.random() * (high - low);

// Crinkling foil or card stock: a scatter of very short, bright noise clicks at random
// moments and pitches, which is what crumpling paper is made of
function crinkle({ at = 0, count = 10, span = 0.25, gain = 0.1, low = 3000, high = 9000 }) {
  for (let i = 0; i < count; i++) {
    const pitch = between(low, high);
    noise({
      at: at + Math.random() * span,
      length: between(0.006, 0.02),
      from: pitch,
      gain: gain * between(0.35, 1),
      q: 1.4
    });
  }
}

// A card laid on a table: a short, dull knock
function thud({ at = 0, gain = 0.3, low = 150 }) {
  tone({ freq: low, glideTo: low * 0.4, at, length: 0.11, gain, type: "sine" });
  noise({ at, length: 0.06, from: 900, to: 250, gain: gain * 0.6, type: "lowpass" });
}

// A glassy bell: a sine, and two quieter overtones that are not whole multiples of it
function bell({ freq, at = 0, length = 1.3, gain = 0.12, wet = 0.5 }) {
  tone({ freq, at, length, gain, wet, attack: 0.003 });
  tone({ freq: freq * 2.76, at, length: length * 0.45, gain: gain * 0.32, wet, attack: 0.002 });
  tone({ freq: freq * 5.4, at, length: length * 0.2, gain: gain * 0.12, wet, attack: 0.002 });
}

// A card turning over: the flap of the paper, then it landing
function flick(gain = 0.2) {
  noise({ length: 0.09, from: 1800, to: 5200, gain, q: 0.7 });
  noise({ at: 0.03, length: 0.05, from: 6500, to: 2800, gain: gain * 0.5, type: "highpass" });
  thud({ at: 0.07, gain: gain * 1.1 });
}

function buzz(pattern) {
  try {
    // browsers refuse (and log) a vibration that no tap has unlocked yet
    if (navigator.userActivation?.isActive !== false) navigator.vibrate?.(pattern);
  } catch {
    // vibration is a bonus; some browsers refuse it
  }
}

// Tearing open the foil wrapper: a ripping hiss that climbs, torn by crackle, then the
// crinkle of the wrapper being pulled apart
export function playRip() {
  if (!context()) return;
  streak = 0;
  noise({ length: 0.5, from: 900, to: 4200, gain: 0.2, q: 0.6 });
  crinkle({ count: 26, span: 0.5, gain: 0.14, low: 2200, high: 8000 });
  noise({ at: 0.4, length: 0.22, from: 5200, to: 2200, gain: 0.1, type: "highpass" });
  crinkle({ at: 0.4, count: 16, span: 0.3, gain: 0.12 });
  thud({ at: 0.55, gain: 0.16, low: 110 });
  buzz(30);
}

// How long the build-up before a flip lasts, in milliseconds. The page waits this long
// before turning the card, so the sound has room to grow.
const BUILD_UP = { common: 0, rare: 0, sticker: 0, epic: 450, legendary: 750, gold: 1100 };

// Holding a good card back: the paper rustles faster and faster under a soft rush of
// air and a low swell, instead of a synthesiser climbing
export function anticipation(tier) {
  const delay = BUILD_UP[tier] ?? 0;
  if (delay && context()) {
    const seconds = delay / 1000;
    noise({ length: seconds, from: 250, to: 3000, gain: 0.16, rise: true, q: 1.1 });
    tone({ freq: 55, glideTo: tier === "gold" ? 110 : 82, length: seconds, gain: 0.2, attack: seconds * 0.9 });
    // the rustle thickens as the moment comes
    const grains = Math.round(seconds * 26);
    for (let i = 0; i < grains; i++) {
      const progress = Math.pow(i / grains, 0.6);
      noise({
        at: progress * seconds,
        length: between(0.006, 0.016),
        from: between(3500, 8500),
        gain: 0.03 + progress * 0.07,
        q: 1.4
      });
    }
    buzz(tier === "gold" ? [40, 40, 60, 40, 90] : 25);
  }
  return delay;
}

// The notes of each reward, as a bell chord
const CHORDS = {
  rare: [659.25, 987.77],
  epic: [523.25, 659.25, 783.99, 1046.5],
  legendary: [392, 523.25, 659.25, 783.99, 1046.5],
  gold: [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
};

// A little foil glitter after the chord: small high glass ticks at random moments
function glitter(count, from, lift) {
  for (let i = 0; i < count; i++) {
    bell({
      freq: 1568 * semitones([0, 4, 7, 12, 16][i % 5]) * lift,
      at: from + Math.random() * 0.5,
      length: 0.5,
      gain: 0.035,
      wet: 0.6
    });
  }
  crinkle({ at: from, count: count * 2, span: 0.5, gain: 0.05, low: 5000, high: 11000 });
}

// The moment the card turns face up
export function playReveal(tier) {
  if (!context()) return;

  if (tier === "sticker") {
    // a sticker peeling off its backing, then pressed down
    noise({ length: 0.28, from: 5200, to: 1400, gain: 0.16, q: 0.9 });
    crinkle({ count: 6, span: 0.22, gain: 0.07 });
    thud({ at: 0.3, gain: 0.14, low: 200 });
    return;
  }

  if (tier === "common") {
    streak = 0;
    flick(0.2);
    return;
  }

  streak = Math.min(streak + 1, 7);
  const lift = semitones(streak - 1);
  const chord = CHORDS[tier];

  if (tier === "rare") {
    flick(0.2);
    chord.forEach((freq, i) => bell({ freq: freq * lift, at: 0.06 + i * 0.09, length: 1.1, gain: 0.1 }));
    crinkle({ at: 0.05, count: 8, span: 0.3, gain: 0.05, low: 5500, high: 11000 });
    return;
  }

  // Epic and up: the card lands hard, a warm low chord swells under a ring of bells,
  // and foil glitter falls after
  const big = tier !== "epic";
  flick(0.28);
  thud({ at: 0.06, gain: big ? 0.5 : 0.38, low: 90 });
  noise({ at: 0.06, length: 0.4, from: 3500, to: 350, gain: big ? 0.2 : 0.14, type: "lowpass" });
  chord.forEach((freq, i) => {
    tone({ freq: (freq / 2) * lift, at: 0.08, length: 1.7, gain: 0.05, wet: 0.5, attack: 0.25 });
    bell({ freq: freq * lift, at: 0.1 + i * 0.07, length: 1.7, gain: 0.11 });
  });
  glitter(tier === "gold" ? 12 : tier === "legendary" ? 8 : 4, 0.3, tier === "gold" ? 1 : lift);
  if (tier === "gold") {
    // a longer, brighter ring, like a coin spun on a table
    [0, 0.14, 0.28].forEach(at =>
      tone({ freq: 2093, at: 0.45 + at, length: 1.4, gain: 0.05, wet: 0.5, attack: 0.002 })
    );
    tone({ freq: 2093 * 2.76, at: 0.45, length: 0.7, gain: 0.025, wet: 0.5, attack: 0.002 });
  }
  buzz(tier === "gold" ? [120, 40, 120, 40, 200] : big ? [90, 30, 90] : 60);
}

// A soft tap for a UI control
export function playTick() {
  if (!context()) return;
  noise({ length: 0.04, from: 2600, to: 1400, gain: 0.12, q: 0.9 });
  thud({ at: 0.02, gain: 0.08, low: 220 });
}
