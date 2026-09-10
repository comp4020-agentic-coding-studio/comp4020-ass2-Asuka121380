// Week 10: a simplified, illustrative model of how a signal's level moves
// through a chain of amplifying stages, used by both the static
// GainStagingDiagram and the live AmplifierBench so the picture and the
// sound describe the same numbers. This is a teaching approximation — a
// smooth tanh-based ceiling standing in for "this stage is now driven into
// its own nonlinearity" — not a measured level chain through any real
// amplifier.

export interface GainStageLevel {
  label: string;
  level: number; // 0-1, this stage's output level relative to full scale
  saturated: boolean;
}

const INPUT_LEVEL = 0.3;
const SATURATION_THRESHOLD = 0.92;

function applyGain(level: number, gain: number): number {
  return Math.tanh(level * gain);
}

/**
 * Preamp gain and power-stage saturation each drive their own nonlinearity;
 * the tone stack reshapes frequency content rather than overall level, so it
 * carries the preamp's level through unchanged; master level is a plain
 * output gain applied after both stages have already done whatever
 * saturating they were going to do. That ordering is exactly why, in this
 * model, preamp gain and master level "produce different results": one
 * changes how hard an earlier stage saturates, the other only changes how
 * loud the already-decided result is played back.
 */
export function estimateGainStageLevels(
  preampGain: number,
  powerGain: number,
  masterLevel: number,
): GainStageLevel[] {
  const preampLevel = applyGain(INPUT_LEVEL, preampGain);
  const toneLevel = preampLevel;
  const powerLevel = applyGain(toneLevel, powerGain);
  const masterOut = powerLevel * Math.min(Math.max(masterLevel, 0), 1);

  const stages: Array<[string, number]> = [
    ["Input", INPUT_LEVEL],
    ["Preamp", preampLevel],
    ["Tone stack", toneLevel],
    ["Power amp", powerLevel],
    ["Master out", masterOut],
  ];

  return stages.map(([label, level]) => ({
    label,
    level,
    saturated: level >= SATURATION_THRESHOLD,
  }));
}
