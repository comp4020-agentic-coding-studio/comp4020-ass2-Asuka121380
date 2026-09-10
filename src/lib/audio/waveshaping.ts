// Clipping-curve generators shared by every week's distortion demo.
// Each returns a Float32Array suitable for WaveShaperNode.curve: the input
// domain is fixed at [-1, 1], sampled at `samples` points.

export type ClippingTopology = "symmetric-soft" | "asymmetric-soft" | "hard" | "fuzz";

function sampleCurve(samples: number, shape: (x: number) => number): Float32Array {
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i / (samples - 1)) * 2 - 1;
    curve[i] = shape(x);
  }
  return curve;
}

/** Gradual nonlinear compression near the limit, symmetric about zero. */
function softClip(x: number, drive: number): number {
  return Math.tanh(x * drive) / Math.tanh(drive);
}

/** Abrupt limiting at a fixed threshold. */
function hardClip(x: number, drive: number, threshold: number): number {
  const driven = x * drive;
  return Math.max(-threshold, Math.min(threshold, driven)) / threshold;
}

export function buildClippingCurve(
  topology: ClippingTopology,
  drive: number,
  samples = 1024,
): Float32Array {
  switch (topology) {
    case "symmetric-soft":
      return sampleCurve(samples, (x) => softClip(x, drive));
    case "asymmetric-soft":
      // Positive and negative halves compressed at different rates, the
      // way a single diode conducts more readily in one direction than
      // the other. This is a conceptual model, not a diode's real
      // exponential I-V curve.
      return sampleCurve(samples, (x) =>
        x >= 0 ? softClip(x, drive) : softClip(x, drive * 0.5) * 0.8,
      );
    case "hard":
      return sampleCurve(samples, (x) => hardClip(x, drive, 0.6));
    case "fuzz":
      // Stronger nonlinearity than a single diode pair: a steeper curve
      // that saturates earlier and adds a slight asymmetric bias.
      return sampleCurve(samples, (x) => {
        const biased = x * drive + 0.15;
        return Math.tanh(biased * 3) * 0.9;
      });
  }
}
