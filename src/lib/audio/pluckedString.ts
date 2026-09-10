// A lightweight, teaching-only plucked-string source, built with the
// Karplus-Strong algorithm: a short burst of noise circulates through a
// delay line of length sampleRate/frequency, averaged and damped on each
// pass. That averaging removes energy fastest at high frequencies, which is
// why the result has a bright, noisy attack that settles into a decaying
// tone at the target pitch — a plausible plucked-string *shape*, not a
// physical model of a specific guitar or string material.
//
// The noise burst is generated from a small seeded PRNG rather than
// `Math.random`, so the "See It" waveform for this source is exactly
// reproducible, matching every other diagram on the page.

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

export interface PluckedStringOptions {
  sampleRate: number;
  frequency: number;
  durationSeconds: number;
  damping?: number;
  seed?: number;
}

/**
 * Render a plucked-string pluck as a Float64Array of `durationSeconds *
 * sampleRate` samples in roughly [-1, 1], via Karplus-Strong synthesis.
 */
export function renderPluckedString({
  sampleRate,
  frequency,
  durationSeconds,
  damping = 0.996,
  seed = 1,
}: PluckedStringOptions): Float64Array {
  const period = Math.max(2, Math.round(sampleRate / frequency));
  const random = mulberry32(seed);
  const ring = new Float64Array(period);
  for (let i = 0; i < period; i++) ring[i] = random() * 2 - 1;

  const totalSamples = Math.max(1, Math.round(durationSeconds * sampleRate));
  const out = new Float64Array(totalSamples);
  let index = 0;
  for (let n = 0; n < totalSamples; n++) {
    const current = ring[index];
    const next = ring[(index + 1) % period];
    out[n] = current;
    ring[index] = damping * 0.5 * (current + next);
    index = (index + 1) % period;
  }

  const peak = Math.max(...out.map(Math.abs), 1e-9);
  return out.map((sample) => sample / peak) as Float64Array;
}

/** A short excerpt suitable for the static "input waveform" diagram. */
export function pluckedStringExcerpt(frequency = 110): Float64Array {
  return renderPluckedString({
    sampleRate: 8000,
    frequency,
    durationSeconds: 0.045,
    seed: 7,
  });
}
