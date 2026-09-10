// Static maths for Week 8's two "moving notch" diagrams. Both describe what
// happens when a dry signal is summed with a phase-shifted copy of itself —
// a feedforward comb filter (flanger: copy delayed by a short, LFO-varied
// time) and a cascaded-allpass phaser (copy phase-shifted by N first-order
// allpass stages whose corner frequency is LFO-varied) — standard,
// textbook DSP results, not fitted to any specific pedal.

/**
 * Magnitude response of a unity dry + unity delayed-copy sum
 * (a feedforward comb filter): |H(f)| = 2|cos(pi * f * delaySeconds)|.
 * Notches sit at f = (k + 0.5) / delaySeconds; a shorter delay spaces them
 * further apart, which is exactly why a flanger's very short, moving delay
 * produces widely-spaced, sweeping notches.
 */
export function combFilterMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  delaySeconds: number,
): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    out[i] = 2 * Math.abs(Math.cos(Math.PI * frequenciesHz[i] * delaySeconds));
  }
  return out;
}

/**
 * Magnitude response of a unity dry signal summed with the same signal run
 * through `stages` cascaded first-order allpass filters, each with corner
 * frequency `poleHz`. Each stage contributes phase shift
 * phi(f) = -2*atan(f / poleHz) (0 at f=0, -pi as f -> infinity), so the
 * cascade's total phase is stages * phi(f), and the sum's magnitude is
 * 2|cos(totalPhase / 2)| — the same "two copies interfering" shape as the
 * comb filter above, but driven by a moving phase rather than a moving
 * delay. This is the standard analogue-phaser mechanism in outline, not a
 * specific circuit's component values.
 */
export function phaserMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  poleHz: number,
  stages: number,
): Float64Array {
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < frequenciesHz.length; i++) {
    const stagePhase = -2 * Math.atan(frequenciesHz[i] / poleHz);
    const totalPhase = stages * stagePhase;
    out[i] = 2 * Math.abs(Math.cos(totalPhase / 2));
  }
  return out;
}
