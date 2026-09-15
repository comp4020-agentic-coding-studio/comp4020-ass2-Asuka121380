// The twelve teaching weeks read as twelve stages of one signal chain — the
// organising idea behind both the homepage chain and each week's "where this
// sits" marker. The tags and one-line summaries live here rather than in a
// component so the chain can be rendered more than once without the two
// copies drifting apart; the week numbers, titles and URLs always come from
// the lectures collection, never from this file.

export type StageDomain = "physical" | "signal";

export interface StageMeta {
  /** Short all-caps name for the stage, used on the chain rail. */
  tag: string;
  /** Which side of the transduction the stage sits on. */
  domain: StageDomain;
  /** One line: what this stage does to the signal. */
  blurb: string;
}

export const STAGE_META: Record<number, StageMeta> = {
  1: { tag: "INPUT", domain: "physical", blurb: "A player's motion enters the system." },
  2: { tag: "STRING", domain: "physical", blurb: "Motion becomes a standing wave of harmonics." },
  3: { tag: "PICKUP", domain: "signal", blurb: "Motion becomes voltage. Position sets the blend." },
  4: { tag: "CIRCUIT", domain: "signal", blurb: "Passive volume and tone shape it inside the guitar." },
  5: { tag: "DRIVE", domain: "signal", blurb: "Gain pushes the signal toward a nonlinear ceiling." },
  6: { tag: "DISTORTION", domain: "signal", blurb: "Harder clipping squares off the wave." },
  7: { tag: "FILTER", domain: "signal", blurb: "Frequency-selective shaping picks winners." },
  8: { tag: "MODULATION", domain: "signal", blurb: "A slow control vibrates a parameter." },
  9: { tag: "SPACE", domain: "signal", blurb: "Delayed, decaying repeats build distance." },
  10: { tag: "AMP", domain: "signal", blurb: "Preamp and power stages add harmonic density." },
  11: { tag: "SPEAKER", domain: "physical", blurb: "Voltage becomes a filtered pressure wave." },
  12: { tag: "OUTPUT", domain: "physical", blurb: "The pressure wave reaches an ear." },
};

export function stageMeta(week: number): StageMeta {
  return STAGE_META[week] ?? { tag: "STAGE", domain: "signal", blurb: "" };
}
