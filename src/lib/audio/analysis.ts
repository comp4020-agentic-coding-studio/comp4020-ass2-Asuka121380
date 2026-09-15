// Static (non-realtime) signal maths for the "See It" diagrams: rendered
// once at build/load time, independent of whether the visitor ever presses
// play on the paired "Hear It" demo.

/** One cycle of a unit sine wave, sampled at `count` points. */
export function sineCycle(count = 256): Float64Array {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    samples[i] = Math.sin((i / count) * 2 * Math.PI);
  }
  return samples;
}

/** One cycle of an ideal (unfiltered) unit square wave, sampled at `count` points. */
export function squareCycle(count = 256): Float64Array {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    samples[i] = Math.sin((i / count) * 2 * Math.PI) >= 0 ? 1 : -1;
  }
  return samples;
}

/** One cycle of an ideal (unfiltered) unit sawtooth wave, sampled at `count` points. */
export function sawtoothCycle(count = 256): Float64Array {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const phase = i / count;
    samples[i] = 2 * (phase - Math.floor(phase + 0.5));
  }
  return samples;
}

/**
 * One cycle built from a harmonic series: sum_n amplitudes[n] * sin(2*pi*(n+1)*t),
 * normalised to peak at 1. Used wherever a page needs to render or sonify a
 * specific relative-harmonic-strength profile — e.g. how picking position or
 * pickup position changes which harmonics are strong — rather than one of
 * the three named waveform families above.
 */
export function harmonicSeriesCycle(amplitudes: ArrayLike<number>, count = 256): Float64Array {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    let sum = 0;
    for (let n = 0; n < amplitudes.length; n++) {
      sum += amplitudes[n] * Math.sin(2 * Math.PI * (n + 1) * t);
    }
    samples[i] = sum;
  }
  const peak = Math.max(...samples.map(Math.abs), 1e-9);
  return samples.map((s) => s / peak) as Float64Array;
}

/**
 * Relative harmonic amplitudes for an idealised, lossless string plucked at
 * fraction `position` of its length (0 = at the bridge, 0.5 = the exact
 * middle): the standard triangular-pluck Fourier series, amplitude_n ∝
 * sin(n·π·position) / n². A textbook result (e.g. Fletcher & Rossing, *The
 * Physics of Musical Instruments*), not a fit to any measured instrument.
 */
export function pluckHarmonicWeights(position: number, harmonics = 8): number[] {
  const weights: number[] = [];
  for (let n = 1; n <= harmonics; n++) {
    weights.push(Math.abs(Math.sin(n * Math.PI * position)) / (n * n));
  }
  const peak = Math.max(...weights, 1e-9);
  return weights.map((w) => w / peak);
}

/**
 * Relative sensitivity of a point pickup at fraction `position` of the
 * string's length to each vibration mode: a mode is sampled at whatever
 * displacement it has at that point, so a pickup sitting at a mode's node
 * senses none of it — sensitivity_n ∝ |sin(n·π·position)|. The same
 * standing-wave mode shape as `pluckHarmonicWeights`, applied to sensing
 * rather than exciting the string, without the pluck's extra 1/n² falloff.
 */
export function pickupHarmonicWeights(position: number, harmonics = 8): number[] {
  const weights: number[] = [];
  for (let n = 1; n <= harmonics; n++) {
    weights.push(Math.abs(Math.sin(n * Math.PI * position)));
  }
  const peak = Math.max(...weights, 1e-9);
  return weights.map((w) => w / peak);
}

/**
 * Relative mode amplitudes for a string plucked at fraction `position`,
 * normalised so they sum to 1 — the weights a *spatial* animation needs, as
 * opposed to `pluckHarmonicWeights`, which normalises to a peak of 1 because
 * it feeds a bar chart. Same underlying series: Aₙ ∝ sin(n·π·position) / n².
 */
export function modalWeights(position: number, modes = 12): number[] {
  const weights: number[] = [];
  for (let n = 1; n <= modes; n++) {
    weights.push(Math.abs(Math.sin(n * Math.PI * position)) / (n * n));
  }
  const total = weights.reduce((sum, w) => sum + w, 0) || 1;
  return weights.map((w) => w / total);
}

export interface ModalMotionOptions {
  /** Fundamental, in Hz. Animations pass a deliberately slowed value. */
  frequency: number;
  /** Time constant of the fundamental's decay, in seconds. */
  decay: number;
  /** Overall scale applied to both outputs. */
  amplitude?: number;
}

/**
 * Transverse displacement and velocity of an idealised string at fraction
 * `x` of its length, `t` seconds after a pluck:
 *
 *   y(x,t) = Σ wₙ · sin(n·π·x) · cos(2π·n·f·t) · e^(−t/τₙ),  τₙ = decay / n^0.7
 *
 * Both outputs land roughly in [−1, 1] for weights from `modalWeights`.
 * Velocity is returned alongside displacement because the two are not
 * interchangeable for this course: a pickup responds to dΦ/dt, so anything
 * showing induced voltage has to read `v`, while anything showing the
 * string's shape reads `y`. Higher modes are given a shorter time constant,
 * which is why a real string's tone darkens as a note sustains.
 *
 * A teaching model of an ideal flexible string, not a measured instrument:
 * no stiffness, no coupling to the body, no sympathetic resonance.
 */
export function modalDisplacement(
  weights: ArrayLike<number>,
  x: number,
  t: number,
  { frequency, decay, amplitude = 1 }: ModalMotionOptions,
): { y: number; v: number } {
  let y = 0;
  let v = 0;
  for (let i = 0; i < weights.length; i++) {
    const n = i + 1;
    const shape = Math.sin(n * Math.PI * x);
    if (shape === 0) continue;
    const omega = 2 * Math.PI * n * frequency;
    const tau = decay / Math.pow(n, 0.7);
    const envelope = Math.exp(-t / tau);
    const phase = omega * t;
    y += weights[i] * shape * Math.cos(phase) * envelope;
    v += weights[i] * shape * -Math.sin(phase) * envelope;
  }
  return { y: y * amplitude, v: v * amplitude };
}

/** Map each sample through a WaveShaperNode-style curve (domain [-1, 1]). */
export function applyCurve(samples: ArrayLike<number>, curve: ArrayLike<number>): Float64Array {
  const out = new Float64Array(samples.length);
  const last = curve.length - 1;
  for (let i = 0; i < samples.length; i++) {
    const x = Math.max(-1, Math.min(1, samples[i]));
    const position = ((x + 1) / 2) * last;
    const lower = Math.floor(position);
    const upper = Math.min(last, lower + 1);
    const frac = position - lower;
    out[i] = curve[lower] * (1 - frac) + curve[upper] * frac;
  }
  return out;
}

/**
 * Magnitude spectrum of one periodic cycle via a direct DFT. The cycle
 * lengths used for these teaching diagrams are small (a few hundred
 * samples), so an O(n^2) DFT is fast enough and needs no FFT library.
 */
export function magnitudeSpectrum(samples: ArrayLike<number>, bins = 24): Float64Array {
  const n = samples.length;
  const magnitudes = new Float64Array(bins);
  for (let k = 0; k < bins; k++) {
    let real = 0;
    let imag = 0;
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * k * i) / n;
      real += samples[i] * Math.cos(angle);
      imag -= samples[i] * Math.sin(angle);
    }
    magnitudes[k] = Math.sqrt(real * real + imag * imag) / n;
  }
  const peak = Math.max(...magnitudes, 1e-9);
  return magnitudes.map((m) => m / peak) as Float64Array;
}

/** Root-mean-square level of a signal, used for rough loudness matching. */
export function rms(samples: ArrayLike<number>): number {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) sumSquares += samples[i] * samples[i];
  return Math.sqrt(sumSquares / Math.max(1, samples.length));
}

/**
 * A gain factor that brings `samples`' RMS level back toward `reference`'s,
 * clamped so a near-silent curve can't demand absurd amplification. This is
 * a rough engineering approximation, not perceptual loudness matching — its
 * only job is to stop "louder" from being mistaken for "more distorted"
 * when comparing clipping topologies back to back.
 */
export function levelCompensation(
  samples: ArrayLike<number>,
  reference: ArrayLike<number>,
): number {
  const target = rms(reference);
  const actual = rms(samples);
  if (actual < 1e-6) return 1;
  return Math.max(0.4, Math.min(2.5, target / actual));
}
