import { renderPluckedString } from "./pluckedString";
import { buildClippingCurve, type ClippingTopology } from "./waveshaping";

// WaveShaperNode#curve is typed against an ArrayBuffer-backed Float32Array;
// our curve builder returns a generically-backed one, so the assignment
// needs a cast on lib types that will always be compatible at runtime.
function asShaperCurve(curve: Float32Array): Float32Array<ArrayBuffer> {
  return curve as Float32Array<ArrayBuffer>;
}

export type SourceKind = "sine" | "string";

const SINE_FREQUENCY = 220;
const STRING_FREQUENCY = 110;
const STRING_DURATION_SECONDS = 1.6;
const BASE_OUTPUT_GAIN = 0.2;

export interface ClippingGraphOptions {
  source: SourceKind;
  topology: ClippingTopology;
  drive: number;
  /** Called when a one-shot source (the plucked string) finishes on its own. */
  onEnded?: () => void;
}

/**
 * An oscillator-or-buffer -> gain -> waveshaper chain for the "Hear It" /
 * "Try It" clipping demo. The waveshaper curve is the same function that
 * draws the paired waveform/spectrum diagrams, so what a visitor sees and
 * hears always describe the same transformation.
 *
 * For the GUITAR SOURCE input, the audible path adds a small fixed
 * monitoring chain after the clipping stage (see `buildListeningChain`) —
 * a stand-in for "how distorted guitar is normally heard through something",
 * not a taught cabinet model. The LAB TONE path stays raw so the transfer-
 * function demonstration isn't softened by that chain.
 */
export class ClippingGraph {
  private readonly drive: GainNode;
  private readonly shaper: WaveShaperNode;
  private readonly output: GainNode;
  private sourceNode: OscillatorNode | AudioBufferSourceNode | null = null;
  private started = false;

  constructor(
    private readonly context: AudioContext,
    private readonly options: ClippingGraphOptions,
  ) {
    this.drive = context.createGain();
    this.drive.gain.value = options.drive;

    this.shaper = context.createWaveShaper();
    this.shaper.curve = asShaperCurve(buildClippingCurve(options.topology, options.drive));

    this.output = context.createGain();
    this.output.gain.value = BASE_OUTPUT_GAIN;

    this.drive.connect(this.shaper);

    if (options.source === "string") {
      const chain = buildListeningChain(context);
      this.shaper.connect(chain.input);
      chain.output.connect(this.output);
    } else {
      this.shaper.connect(this.output);
    }

    this.output.connect(context.destination);
  }

  start(): void {
    if (this.started) return;
    this.started = true;

    if (this.options.source === "sine") {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = SINE_FREQUENCY;
      oscillator.connect(this.drive);
      oscillator.start();
      this.sourceNode = oscillator;
      return;
    }

    const samples = renderPluckedString({
      sampleRate: this.context.sampleRate,
      frequency: STRING_FREQUENCY,
      durationSeconds: STRING_DURATION_SECONDS,
    });
    const buffer = this.context.createBuffer(1, samples.length, this.context.sampleRate);
    buffer.copyToChannel(Float32Array.from(samples), 0);

    const bufferSource = this.context.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this.drive);
    bufferSource.onended = () => {
      if (this.sourceNode === bufferSource) {
        this.sourceNode = null;
        this.started = false;
        this.options.onEnded?.();
      }
    };
    bufferSource.start();
    this.sourceNode = bufferSource;
  }

  stop(): void {
    if (!this.started || !this.sourceNode) return;
    this.sourceNode.onended = null;
    try {
      this.sourceNode.stop();
    } catch {
      // Already stopped (e.g. a one-shot buffer that just finished).
    }
    this.sourceNode = null;
    this.started = false;
  }

  setCurve(topology: ClippingTopology, drive: number): void {
    this.drive.gain.value = drive;
    this.shaper.curve = asShaperCurve(buildClippingCurve(topology, drive));
  }

  /** Scale the output stage to roughly match another topology's loudness. */
  setLevelCompensation(factor: number): void {
    this.output.gain.value = BASE_OUTPUT_GAIN * factor;
  }
}

/**
 * A small fixed post-clipping monitoring chain for the GUITAR SOURCE path:
 * a gentle presence-shaping lowpass, then a second, softer lowpass standing
 * in for "played through something" rather than straight into the ear. This
 * is deliberately not a cabinet model — cabinet response is a later week's
 * topic — it exists only so this week's listening example doesn't present
 * raw full-band waveshaper output as "what distorted guitar sounds like".
 */
function buildListeningChain(context: AudioContext): { input: AudioNode; output: AudioNode } {
  const toneShaping = context.createBiquadFilter();
  toneShaping.type = "lowpass";
  toneShaping.frequency.value = 5200;
  toneShaping.Q.value = 0.7;

  const monitoring = context.createBiquadFilter();
  monitoring.type = "lowpass";
  monitoring.frequency.value = 3200;
  monitoring.Q.value = 0.6;

  toneShaping.connect(monitoring);
  return { input: toneShaping, output: monitoring };
}
