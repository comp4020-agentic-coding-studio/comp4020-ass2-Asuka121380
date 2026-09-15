// A pickup sitting at one point along a string senses each vibration mode in
// proportion to how much that mode actually moves there, so mode n arrives
// scaled by |sin(n·π·p)| for a pickup at fraction p of the string's length.
// `pickupHarmonicWeights` in analysis.ts states that for the harmonics of one
// note; this module states the same thing as a continuous function of
// frequency, which is what audio needs.
//
// Written out over frequency rather than harmonic number:
//
//   |H(f)| = |sin(π · f · p / f₀)|
//
// which is exactly the magnitude response of a feed-forward comb filter
//
//   y(t) = ½·( x(t) − x(t − D) ),   D = p / f₀
//
// since |½(1 − e^{−j2πfD})| = |sin(πfD)|. So the audible model and the drawn
// model are not two approximations of the same idea — they are the same
// function, and a null the graph predicts at 1030 Hz is a null the analyser
// measures at 1030 Hz. That is the whole point: the display is not allowed to
// be a picture of something the sound is not doing.
//
// This is still a teaching model of an idealised point sensor. A real pickup
// senses over the width of its pole pieces rather than at a point (which
// smooths the deepest nulls), its coil and cable form a resonant low-pass on
// top of this, and its output is not linear in string displacement. None of
// that is modelled here.

/** The open low E of the site's canonical DI recording. */
export const DI_FUNDAMENTAL_HZ = 82.41;

/**
 * Comb delay, in seconds, for a pickup at fraction `position` of the string.
 *
 * It depends on the note being played: the same pickup position produces
 * wider comb spacing on a lower note. Tying it to the DI recording's own
 * fundamental is what keeps the audible result aligned with the drawn model
 * for that recording, and is not a general-purpose pickup emulation.
 */
export function pickupCombDelaySeconds(position: number, fundamentalHz = DI_FUNDAMENTAL_HZ): number {
  return position / fundamentalHz;
}

/** Sensitivity at `hz` for a pickup at `position` — the continuous form of
 *  `pickupHarmonicWeights`, in [0, 1]. */
export function pickupResponseAt(
  hz: number,
  position: number,
  fundamentalHz = DI_FUNDAMENTAL_HZ,
): number {
  return Math.abs(Math.sin(Math.PI * hz * pickupCombDelaySeconds(position, fundamentalHz)));
}

/**
 * Make-up gain that keeps overall loudness roughly constant as the pickup
 * moves, so a listener compares harmonic balance rather than volume.
 *
 * Near the bridge the comb attenuates the fundamental heavily — which is
 * true, and is why bridge pickups are wound hotter in practice — but leaving
 * it uncompensated here would mean the most obvious difference between the
 * two presets was "one is quieter", which teaches nothing about harmonic
 * balance. The estimate assumes a plucked-string source falling off as 1/n.
 */
export function pickupMakeupGain(
  position: number,
  harmonics = 24,
  fundamentalHz = DI_FUNDAMENTAL_HZ,
): number {
  let sensed = 0;
  let reference = 0;
  for (let n = 1; n <= harmonics; n++) {
    const sourcePower = 1 / (n * n);
    reference += sourcePower;
    const response = pickupResponseAt(n * fundamentalHz, position, fundamentalHz);
    sensed += sourcePower * response * response;
  }
  if (sensed < 1e-9) return 4;
  return Math.max(1, Math.min(4, Math.sqrt(reference / sensed)));
}

export interface PickupGraphOptions {
  /** Initial pickup position, as a fraction of the string's length. */
  position: number;
  /** A node the output is copied to as well as the destination. */
  tap?: AudioNode;
  onEnded?: () => void;
}

/**
 * The DI recording through the comb above, with the position live-settable
 * so dragging the control while a note is playing sweeps the comb — which is
 * audibly what sliding a pickup along the string would do.
 */
export class PickupGraph {
  private readonly dry: GainNode;
  private readonly delay: DelayNode;
  private readonly invert: GainNode;
  private readonly makeup: GainNode;
  private readonly output: GainNode;
  private source: AudioBufferSourceNode | null = null;
  private cancelled = false;

  constructor(
    private readonly context: AudioContext,
    private readonly options: PickupGraphOptions,
  ) {
    this.dry = context.createGain();
    this.dry.gain.value = 0.5;

    this.delay = context.createDelay(0.05);

    this.invert = context.createGain();
    this.invert.gain.value = -0.5;

    this.makeup = context.createGain();
    this.output = context.createGain();
    this.output.gain.value = 0.34;

    this.dry.connect(this.makeup);
    this.delay.connect(this.invert);
    this.invert.connect(this.makeup);
    this.makeup.connect(this.output);
    this.output.connect(context.destination);
    if (options.tap) this.output.connect(options.tap);

    this.setPosition(options.position, 0);
  }

  /** Move the pickup. Ramped rather than stepped so a drag sweeps instead of
   *  clicking its way across the string. */
  setPosition(position: number, rampSeconds = 0.05): void {
    const now = this.context.currentTime;
    const delaySeconds = pickupCombDelaySeconds(position);
    const gain = pickupMakeupGain(position);
    if (rampSeconds <= 0) {
      this.delay.delayTime.setValueAtTime(delaySeconds, now);
      this.makeup.gain.setValueAtTime(gain, now);
      return;
    }
    this.delay.delayTime.linearRampToValueAtTime(delaySeconds, now + rampSeconds);
    this.makeup.gain.linearRampToValueAtTime(gain, now + rampSeconds);
  }

  async start(buffer: AudioBuffer): Promise<void> {
    if (this.cancelled || this.source) return;
    await this.context.resume();
    if (this.cancelled) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.dry);
    source.connect(this.delay);
    source.onended = () => {
      if (this.source === source) this.source = null;
      this.options.onEnded?.();
    };
    this.source = source;
    source.start();
  }

  stop(): void {
    this.cancelled = true;
    if (this.source) {
      this.source.onended = null;
      this.source.stop();
      this.source = null;
    }
    this.output.disconnect();
  }
}
