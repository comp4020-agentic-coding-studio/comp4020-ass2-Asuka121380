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
