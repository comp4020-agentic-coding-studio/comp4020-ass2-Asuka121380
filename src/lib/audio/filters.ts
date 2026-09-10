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
