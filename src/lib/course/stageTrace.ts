// One cycle of the waveform a given stage of the chain produces, built from
// the same analysis and waveshaping primitives the week's own lab uses — so a
// student who has done Week 6's clipping bench recognises Week 6's trace on
// the homepage rail rather than seeing a decorative squiggle.
//
// These are homepage-scale motifs, not measurements: the signal entering each
// stage is an idealised pluck rather than the real DI recording, and stages 8,
// 9, 11 and 12 have no dedicated lab primitive to reuse and are built from
// plain sine/decay/smoothing maths here instead. Each of those is marked.

import {
  applyCurve,
  harmonicSeriesCycle,
  pickupHarmonicWeights,
  pluckHarmonicWeights,
  sineCycle,
} from "../audio/analysis";
import { buildClippingCurve } from "../audio/waveshaping";

const SAMPLES = 96;

/** Three-point moving average — stands in for the mechanical low-pass a
 *  speaker cone applies. Not a measured driver response. */
function smooth(cycle: Float64Array): Float64Array {
  const out = new Float64Array(cycle.length);
  for (let i = 0; i < cycle.length; i++) {
    const prev = cycle[(i - 1 + cycle.length) % cycle.length];
    const next = cycle[(i + 1) % cycle.length];
    out[i] = (prev + cycle[i] + next) / 3;
  }
  return out;
}

const sensed = () => harmonicSeriesCycle(pickupHarmonicWeights(0.28), SAMPLES);

export function stageCycle(week: number): Float64Array {
  switch (week) {
    case 1:
      return sineCycle(SAMPLES);
    case 2:
      return harmonicSeriesCycle(pluckHarmonicWeights(0.18), SAMPLES);
    case 3:
      return sensed();
    case 4:
      return applyCurve(sensed(), buildClippingCurve("symmetric-soft", 1.15));
    case 5:
      return applyCurve(sensed(), buildClippingCurve("symmetric-soft", 3));
    case 6:
      return applyCurve(sensed(), buildClippingCurve("hard", 4));
    case 7:
      // A low-pass keeps the low-order harmonics and drops the rest.
      return harmonicSeriesCycle(pickupHarmonicWeights(0.28).slice(0, 3), SAMPLES);
    case 8: {
      // No lab primitive for a slow periodic control — a plain amplitude-
      // modulated sine, built here.
      const carrier = sineCycle(SAMPLES);
      return carrier.map(
        (sample, i) => sample * (0.55 + 0.45 * Math.sin((i / SAMPLES) * 2 * Math.PI * 3)),
      ) as Float64Array;
    }
    case 9: {
      // No lab primitive for delay/reverb here — three shifted, shrinking
      // copies of one pluck cycle.
      const base = harmonicSeriesCycle(pluckHarmonicWeights(0.28), SAMPLES);
      const out = new Float64Array(SAMPLES);
      const shift = Math.round(SAMPLES / 6);
      for (let i = 0; i < SAMPLES; i++) {
        out[i] =
          base[i] * 0.9 +
          base[(i - shift + SAMPLES) % SAMPLES] * 0.55 +
          base[(i - shift * 2 + SAMPLES) % SAMPLES] * 0.3;
      }
      const peak = Math.max(...out.map(Math.abs), 1e-9);
      return out.map((sample) => sample / peak) as Float64Array;
    }
    case 10:
      return applyCurve(
        harmonicSeriesCycle(pickupHarmonicWeights(0.28).slice(0, 3), SAMPLES),
        buildClippingCurve("fuzz", 2),
      );
    case 11:
      return smooth(stageCycle(10));
    case 12:
      return smooth(smooth(stageCycle(10)));
    default:
      return sineCycle(SAMPLES);
  }
}
