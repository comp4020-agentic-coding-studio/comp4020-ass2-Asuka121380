// Week 12: pure functions shared by the static diagrams and the live
// CompleteChainBench, so the integrated lab and the "See It" pictures
// always describe the same signal chain. Every stage here reuses maths a
// previous week already introduced — a lowpass magnitude response
// (Week 4/7), buildClippingCurve (Week 6), cabinetMagnitudeResponse
// (Week 11) — nothing new is being taught, only recombined, matching the
// curriculum's own instruction that "no major new theory should be
// introduced" this week.
import { harmonicSeriesCycle, applyCurve, magnitudeSpectrum, pluckHarmonicWeights } from "./analysis";
import { cabinetMagnitudeResponse, type CabinetProfile } from "./cabinet";
import { lowpassMagnitudeResponse } from "./filters";
import { buildClippingCurve, type ClippingTopology } from "./waveshaping";

// Pickup position stands in, in simplified form, for Week 3's pickup-
// position idea: a fixed brightness tilt rather than a re-derivation of
// the standing-wave sensitivity model that week already covers in depth.
export type PickupPosition = "neck" | "bridge";

const PICKUP_TILT_HZ: Record<PickupPosition, number> = {
  neck: 2200,
  bridge: 6500,
};

export function pickupTiltCutoffHz(position: PickupPosition): number {
  return PICKUP_TILT_HZ[position];
}

// Where the Tone/EQ stage sits relative to the gain+clipping stage — the
// concrete "effect order" case this week highlights.
export type EQPosition = "pre" | "post";

export type DelayReverbMode = "off" | "echo" | "reverb";

/** A single knob (0-1) driving both the delay/reverb "time" and "feedback" parameters at once, trading a second control for a simpler interaction. */
export function delayReverbParamsFromAmount(amount: number): { time: number; feedback: number; mix: number } {
  const clamped = Math.min(Math.max(amount, 0), 1);
  return {
    time: clamped,
    feedback: 0.25 + clamped * 0.55,
    mix: clamped * 0.6,
  };
}

// The amplifier stage exposes only Drive and Tone as user controls; power-
// stage saturation and master level stay fixed backbone constants (Week
// 10's AmplifierBench already lets a student explore those two directly).
export const AMP_POWER_GAIN = 1.5;
export const AMP_MASTER_LEVEL = 0.7;

export interface CumulativeStage {
  label: string;
  response: Float64Array;
}

/**
 * The linear (filter-only) part of the chain's magnitude response, built up
 * one stage at a time: pickup tilt, then Tone/EQ, then the amplifier's tone
 * stack, then the cabinet. Distortion is left out deliberately — it isn't a
 * linear filter, so it has no single "magnitude response" to layer in here;
 * its effect is instead illustrated separately (see `effectOrderSpectra`).
 * Because all four stages here are ordinary linear filters, multiplying
 * their responses together commutes — unlike the nonlinear case, reordering
 * these four wouldn't change the final curve. That contrast is part of the
 * point: order matters when a nonlinearity is involved, not automatically
 * everywhere.
 */
export function cumulativeChainMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  params: {
    pickupPosition: PickupPosition;
    eqCutoffHz: number;
    ampToneHz: number;
    cabinetProfile: CabinetProfile;
  },
): CumulativeStage[] {
  const pickup = lowpassMagnitudeResponse(frequenciesHz, pickupTiltCutoffHz(params.pickupPosition));
  const eq = lowpassMagnitudeResponse(frequenciesHz, params.eqCutoffHz);
  const amp = lowpassMagnitudeResponse(frequenciesHz, params.ampToneHz);
  const cabinet = cabinetMagnitudeResponse(frequenciesHz, params.cabinetProfile);

  const named: Array<[string, ArrayLike<number>]> = [
    ["Pickup tilt", pickup],
    ["+ Tone/EQ", eq],
    ["+ Amplifier tone stack", amp],
    ["+ Cabinet", cabinet],
  ];

  const stages: CumulativeStage[] = [];
  const cumulative = new Float64Array(frequenciesHz.length).fill(1);
  for (const [label, curve] of named) {
    for (let i = 0; i < cumulative.length; i++) cumulative[i] *= curve[i];
    stages.push({ label, response: Float64Array.from(cumulative) });
  }
  return stages;
}

export interface EffectOrderResult {
  preEQSpectrum: Float64Array;
  postEQSpectrum: Float64Array;
}

/**
 * Illustrates "EQ before vs after distortion" in the harmonic-amplitude
 * domain. Pre-distortion EQ scales the harmonics a plucked string starts
 * with *before* the nonlinearity runs, so the nonlinearity generates its
 * new harmonics from an already-reshaped input. Post-distortion EQ instead
 * runs the nonlinearity on the unfiltered signal first, and only reweights
 * the spectrum bins the nonlinearity already produced. Both start from the
 * same pluck-position harmonic weights (Week 2's pluckHarmonicWeights) and
 * the same clipping curve (Week 6's buildClippingCurve) — only the order of
 * the two operations differs.
 */
export function effectOrderSpectra(
  fundamentalHz: number,
  eqCutoffHz: number,
  topology: ClippingTopology,
  drive: number,
  harmonics = 8,
): EffectOrderResult {
  const baseWeights = pluckHarmonicWeights(0.2, harmonics);
  const curve = buildClippingCurve(topology, drive);
  const spectrumBins = harmonics + 8;

  const harmonicFreqs = baseWeights.map((_, i) => fundamentalHz * (i + 1));
  const eqAtHarmonics = lowpassMagnitudeResponse(harmonicFreqs, eqCutoffHz);
  const preWeights = baseWeights.map((w, i) => w * eqAtHarmonics[i]);
  const preSignal = harmonicSeriesCycle(preWeights);
  const preOutput = applyCurve(preSignal, curve);
  const preEQSpectrum = magnitudeSpectrum(preOutput, spectrumBins);

  const rawSignal = harmonicSeriesCycle(baseWeights);
  const rawOutput = applyCurve(rawSignal, curve);
  const rawSpectrum = magnitudeSpectrum(rawOutput, spectrumBins);
  const binFreqs = Array.from(rawSpectrum, (_, k) => fundamentalHz * k);
  const eqAtBins = lowpassMagnitudeResponse(binFreqs, eqCutoffHz);
  const scaled = rawSpectrum.map((m, k) => m * eqAtBins[k]);
  const peak = Math.max(...scaled, 1e-9);
  const postEQSpectrum = scaled.map((m) => m / peak) as Float64Array;

  return { preEQSpectrum, postEQSpectrum };
}

export interface ChainRecipe {
  label: string;
  description: string;
  pickupPosition: PickupPosition;
  eqCutoffHz: number;
  ampToneHz: number;
  cabinetProfile: CabinetProfile;
}

// Two recipes that reach a broadly similar overall frequency shape through
// opposite individual choices: Recipe A narrows the top end at the
// amplifier while keeping the pickup and EQ bright; Recipe B narrows it at
// the pickup while keeping the EQ and amplifier bright. Illustrates
// "different chains, similar perceptual-shape result" without claiming the
// two are audibly identical.
export const CHAIN_RECIPE_A: ChainRecipe = {
  label: "Recipe A — bright pickup, dark amp and cabinet",
  description:
    "Bridge pickup and an open Tone knob, reined back in by a darker amplifier tone stack and a dark cabinet.",
  pickupPosition: "bridge",
  eqCutoffHz: 6000,
  ampToneHz: 2200,
  cabinetProfile: "dark",
};

export const CHAIN_RECIPE_B: ChainRecipe = {
  label: "Recipe B — dark pickup, bright amp and cabinet",
  description:
    "Neck pickup and a rolled-off Tone knob, opened back up again by a brighter amplifier tone stack and a bright cabinet.",
  pickupPosition: "neck",
  eqCutoffHz: 2500,
  ampToneHz: 5000,
  cabinetProfile: "bright",
};
