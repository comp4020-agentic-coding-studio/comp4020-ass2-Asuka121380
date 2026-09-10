// Static maths for Week 9's echo and reverb diagrams — a different family
// from Week 8's feedforward comb filter (one dry copy + one delayed copy,
// summed once). Feeding a delayed copy back into its own input before
// summing turns that single notch pattern into an infinite series of
// echoes, which produces a different, IIR magnitude response and is the
// mechanism this week actually teaches (feedback delay, not a one-shot
// delayed copy).

/**
 * Magnitude response of a feedback comb filter — a delay line of
 * `delaySeconds` with its own output fed back into its input at gain
 * `feedback` (0-1), summed with the dry input:
 * |H(f)| = 1 / sqrt(1 - 2*feedback*cos(2*pi*f*delaySeconds) + feedback^2).
 * Higher feedback deepens and sharpens the peaks/notches (more energy
 * recirculates before decaying); the peak spacing is set by delaySeconds
 * alone, same as the feedforward case.
 */
export function feedbackCombFilterMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  delaySeconds: number,
  feedback: number,
): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    const phase = 2 * Math.PI * frequenciesHz[i] * delaySeconds;
    const denominator = 1 - 2 * feedback * Math.cos(phase) + feedback * feedback;
    out[i] = 1 / Math.sqrt(Math.max(denominator, 1e-6));
  }
  return out;
}

// A small seeded PRNG, identical in construction to pluckedString.ts's
// private generator, so the reflection envelope below is exactly
// reproducible — the same "deterministic by construction" requirement
// every other diagram/analysis helper on this site follows.
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ReflectionEvent {
  timeSeconds: number;
  amplitude: number;
}

/**
 * A stylised, deterministic sketch of an acoustic-space impulse response:
 * a direct-sound spike at t=0, a handful of early reflections whose
 * arrival times spread out as `roomSize` (0-1) grows, then a dense,
 * exponentially-decaying tail whose length is set by `decay` (0-1). This
 * is illustrative of the *shape* every real room/reverb impulse response
 * shares (direct, early reflections, dense decaying tail) — not a
 * measured or physically simulated room response.
 */
export function synthesiseReflections(roomSize: number, decay: number): ReflectionEvent[] {
  const clampedRoom = Math.min(Math.max(roomSize, 0), 1);
  const clampedDecay = Math.min(Math.max(decay, 0), 1);
  const random = mulberry32(11);

  const events: ReflectionEvent[] = [{ timeSeconds: 0, amplitude: 1 }];

  const earlySpread = 0.04 + clampedRoom * 0.3;
  const earlyRatios = [0.4, 0.62, 0.85, 1];
  const earlyAmplitudes = [0.62, 0.5, 0.4, 0.32];
  earlyRatios.forEach((ratio, i) => {
    events.push({ timeSeconds: earlySpread * ratio, amplitude: earlyAmplitudes[i] });
  });

  const tailStart = earlySpread;
  const tailDuration = 0.3 + clampedDecay * 1.4;
  const decayRate = 5 / tailDuration;
  const tailCount = 48;
  for (let i = 0; i < tailCount; i++) {
    const t = tailStart + (tailDuration * (i + 1)) / tailCount;
    const envelope = earlyAmplitudes[earlyAmplitudes.length - 1] * Math.exp(-decayRate * (t - tailStart));
    const amplitude = envelope * (0.5 + random() * 0.5);
    events.push({ timeSeconds: t, amplitude });
  }

  return events;
}

/**
 * The "echo" counterpart to `synthesiseReflections`: a regularly-spaced
 * train of repeats at multiples of `delaySeconds`, each quieter than the
 * last by a factor of `feedback` (0-1) — exactly what a single feedback
 * delay loop produces, in contrast to reverb's irregular scatter. Stops
 * once a repeat's amplitude falls below an inaudibly-quiet floor, or a
 * safety cap on the number of repeats is reached (a delay time near zero
 * would otherwise produce an unbounded number of repeats in a fixed time
 * window).
 */
export function synthesiseEchoTrain(delaySeconds: number, feedback: number): ReflectionEvent[] {
  const g = Math.min(Math.max(feedback, 0), 0.98);
  const step = Math.max(delaySeconds, 0.01);
  const amplitudeFloor = 0.03;
  const maxRepeats = 60;
  const events: ReflectionEvent[] = [];
  for (let n = 0; n <= maxRepeats; n++) {
    const amplitude = g ** n;
    if (n > 0 && amplitude < amplitudeFloor) break;
    events.push({ timeSeconds: n * step, amplitude });
  }
  return events;
}
