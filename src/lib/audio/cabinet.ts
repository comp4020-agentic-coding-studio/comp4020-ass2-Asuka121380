// Week 11: a conceptual model of how a guitar speaker/cabinet colours
// frequency response, built entirely from the same resonant high-pass and
// low-pass magnitude-response functions Week 7 already introduced
// (filters.ts) — a speaker's response is treated here as a resonant
// high-pass (the cone/enclosure's low-frequency rolloff, with a resonance
// bump near that rolloff) cascaded with a resonant low-pass (the cone's
// high-frequency breakup rolloff). This is not a measured response of any
// real speaker, cabinet, or microphone — it's a teaching approximation
// good enough to show that "speaker + cabinet + mic position" reshapes a
// signal's frequency content, which is the point Week 11 is making.
import {
  highpassResonantMagnitudeResponse,
  lowpassMagnitudeResponse,
  lowpassResonantMagnitudeResponse,
} from "./filters";

export type CabinetProfile = "flat" | "bright" | "dark" | "resonant";
export type MicPosition = "center" | "edge";

interface CabinetProfileParams {
  label: string;
  description: string;
  lowCutoffHz: number;
  lowQ: number;
  highCutoffHz: number;
  highQ: number;
}

const FLAT_Q = 1 / Math.sqrt(2);

const CABINET_PROFILES: Record<CabinetProfile, CabinetProfileParams> = {
  flat: {
    label: "Flat (unfiltered)",
    description: "The amplifier's electrical output, before any speaker or cabinet coloration is applied.",
    lowCutoffHz: 20,
    lowQ: FLAT_Q,
    highCutoffHz: 20000,
    highQ: FLAT_Q,
  },
  bright: {
    label: "Bright small speaker",
    description: "Low end rolls off early; highs extend further before rolling off — a smaller cone's typical character.",
    lowCutoffHz: 110,
    lowQ: 0.9,
    highCutoffHz: 6500,
    highQ: 0.9,
  },
  dark: {
    label: "Darker cabinet",
    description: "Highs rolled off much earlier, so more of the signal's brightness is removed before it reaches the air.",
    lowCutoffHz: 90,
    lowQ: 0.8,
    highCutoffHz: 2600,
    highQ: 0.9,
  },
  resonant: {
    label: "Resonant cabinet",
    description: "Both ends peak rather than rolling off smoothly — a cabinet whose enclosure and cone resonances stand out.",
    lowCutoffHz: 130,
    lowQ: 2.4,
    highCutoffHz: 3800,
    highQ: 2.2,
  },
};

export const CABINET_PROFILE_ORDER: CabinetProfile[] = ["flat", "bright", "dark", "resonant"];

export function cabinetProfileParams(profile: CabinetProfile): CabinetProfileParams {
  return CABINET_PROFILES[profile];
}

/** Cabinet-only magnitude response: a resonant high-pass cascaded with a resonant low-pass. */
export function cabinetMagnitudeResponse(frequenciesHz: ArrayLike<number>, profile: CabinetProfile): Float64Array {
  const { lowCutoffHz, lowQ, highCutoffHz, highQ } = CABINET_PROFILES[profile];
  const low = highpassResonantMagnitudeResponse(frequenciesHz, lowCutoffHz, lowQ);
  const high = lowpassResonantMagnitudeResponse(frequenciesHz, highCutoffHz, highQ);
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < out.length; i++) out[i] = low[i] * high[i];
  return out;
}

// A microphone's position and distance are modelled as nothing more than an
// extra, simple low-pass: moving off-axis (toward the cone's edge) or
// further away removes more high-frequency content. Real microphone
// behaviour depends heavily on the specific microphone and is well beyond
// this course's scope — this is a conceptual illustration only, per the
// curriculum's explicit "goal is conceptual, not perfect physical
// modelling" instruction.
const MIC_ON_AXIS_CUTOFF_HZ = 9000;
const MIC_OFF_AXIS_CUTOFF_HZ = 4000;
const MIC_DISTANCE_ROLLOFF_HZ_PER_CM = 60;
const MIC_MIN_CUTOFF_HZ = 1200;

export function micCutoffHz(position: MicPosition, distanceCm: number): number {
  const base = position === "edge" ? MIC_OFF_AXIS_CUTOFF_HZ : MIC_ON_AXIS_CUTOFF_HZ;
  return Math.max(MIC_MIN_CUTOFF_HZ, base - distanceCm * MIC_DISTANCE_ROLLOFF_HZ_PER_CM);
}

export function micMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  position: MicPosition,
  distanceCm: number,
): Float64Array {
  return lowpassMagnitudeResponse(frequenciesHz, micCutoffHz(position, distanceCm));
}

/** Cabinet response and microphone response combined — what the "virtual cabinet" lab both plots and plays. */
export function virtualCabinetMagnitudeResponse(
  frequenciesHz: ArrayLike<number>,
  profile: CabinetProfile,
  position: MicPosition,
  distanceCm: number,
): Float64Array {
  const cabinet = cabinetMagnitudeResponse(frequenciesHz, profile);
  const mic = micMagnitudeResponse(frequenciesHz, position, distanceCm);
  const out = new Float64Array(frequenciesHz.length);
  for (let i = 0; i < out.length; i++) out[i] = cabinet[i] * mic[i];
  return out;
}
