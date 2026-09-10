// Static maths for the Week 4 tone-control simulator: a single-pole RC
// low-pass, the same simplification the curriculum reference uses
// (f_c = 1/(2*pi*R*C)). This is deliberately not a full passive tone-stack
// analysis — real guitar tone controls interact with pickup inductance and
// can show resonant peaking, which the reference doc treats as beyond this
// week's scope, and so does this module.

/** Cutoff frequency in Hz for resistance `ohms` and capacitance `farads`. */
export function cutoffFrequency(ohms: number, farads: number): number {
  return 1 / (2 * Math.PI * ohms * farads);
}

/**
 * Relative magnitude response (0-1, not dB) of a single-pole low-pass with
 * cutoff `cutoffHz`, sampled at each frequency in `frequenciesHz`:
 * |H(f)| = 1 / sqrt(1 + (f / f_c)^2).
 */
export function lowpassMagnitudeResponse(frequenciesHz: ArrayLike<number>, cutoffHz: number): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    const ratio = frequenciesHz[i] / cutoffHz;
    out[i] = 1 / Math.sqrt(1 + ratio * ratio);
  }
  return out;
}

/** `count` frequencies log-spaced between `minHz` and `maxHz`, inclusive. */
export function logFrequencyAxis(minHz: number, maxHz: number, count: number): Float64Array {
  const out = new Float64Array(count);
  const logMin = Math.log10(minHz);
  const logMax = Math.log10(maxHz);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    out[i] = 10 ** (logMin + t * (logMax - logMin));
  }
  return out;
}

// Week 7 reuses the same "sample a magnitude response over a log frequency
// axis" pattern for a standard second-order (biquad-style) low-pass and
// high-pass, with an explicit Q term — the same normalised transfer
// function Web Audio's own BiquadFilterNode implements, so the plotted
// curve and the live filter used for playback describe the same maths.
// Q = 1/sqrt(2) is the maximally-flat (no-peaking) case; larger Q produces
// a narrower resonant peak at the cutoff frequency.

/**
 * Relative magnitude response of a second-order low-pass:
 * |H(f)| = 1 / sqrt((1 - x^2)^2 + (x/Q)^2), where x = f / cutoffHz.
 */
export function lowpassResonantMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  cutoffHz: number,
  q: number,
): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    const x = frequenciesHz[i] / cutoffHz;
    const a = 1 - x * x;
    const b = x / q;
    out[i] = 1 / Math.sqrt(a * a + b * b);
  }
  return out;
}

/**
 * Relative magnitude response of a second-order high-pass — the dual of
 * `lowpassResonantMagnitudeResponse`: |H(f)| = x^2 / sqrt((1 - x^2)^2 + (x/Q)^2).
 */
export function highpassResonantMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  cutoffHz: number,
  q: number,
): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    const x = frequenciesHz[i] / cutoffHz;
    const a = 1 - x * x;
    const b = x / q;
    out[i] = (x * x) / Math.sqrt(a * a + b * b);
  }
  return out;
}
