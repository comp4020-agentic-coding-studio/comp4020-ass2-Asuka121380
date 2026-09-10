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

export type ModulationEffect = "tremolo" | "vibrato" | "chorus" | "flanger" | "phaser";

const MODULATION_SOURCE_FREQUENCY = 110;
const MODULATION_SOURCE_DURATION_SECONDS = 3.2;
const MODULATION_OUTPUT_GAIN = 0.5;
const PHASER_STAGES = 4;
const PHASER_POLE_HZ = 800;

export interface ModulationGraphOptions {
  effect: ModulationEffect;
  rateHz: number;
  depth: number;
  mix: number;
  onEnded?: () => void;
}

/**
 * What the shared LFO drives for one effect: the node the source feeds to
 * produce the "wet" copy, the AudioParam(s) the LFO's output connects to,
 * the value those params sit at with zero depth, how many of their own
 * units one unit of `depth` swings them by, and whether the LFO swings
 * symmetrically around `baseValue` (delay- and phase-based effects) or only
 * downward from it (tremolo, so depth=1 reaches exactly zero gain at the
 * gain-swing's low point rather than going negative).
 */
interface ModulationTarget {
  wetInput: AudioNode;
  params: AudioParam[];
  baseValue: number;
  depthScale: number;
  centered: boolean;
}

/**
 * A one-shot plucked-string source run through a shared dry/wet modulation
 * network: an LFO (a plain OscillatorNode used purely as a control signal,
 * never connected to the destination) drives whichever parameter the
 * selected effect modulates — a GainNode's gain for tremolo, a DelayNode's
 * delayTime for vibrato/chorus/flanger, or a cascade of allpass
 * BiquadFilterNodes' frequency for phaser. Rate and Depth always mean "how
 * fast" and "how far" the LFO swings that parameter; Mix always means "how
 * much of the modulated copy blends back with the plain original" — the
 * same three controls, reused across five otherwise-different node graphs.
 */
export class ModulationGraph {
  private readonly output: GainNode;
  private readonly dryGain: GainNode;
  private readonly wetGain: GainNode;
  private readonly lfo: OscillatorNode;
  private readonly lfoDepthGain: GainNode;
  private readonly target: ModulationTarget;
  private source: AudioBufferSourceNode | null = null;
  private started = false;

  constructor(
    private readonly context: AudioContext,
    private readonly options: ModulationGraphOptions,
  ) {
    this.output = context.createGain();
    this.output.gain.value = MODULATION_OUTPUT_GAIN;
    this.output.connect(context.destination);

    this.dryGain = context.createGain();
    this.wetGain = context.createGain();
    this.dryGain.connect(this.output);
    this.wetGain.connect(this.output);

    this.lfo = context.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = options.rateHz;
    this.lfoDepthGain = context.createGain();
    this.lfo.connect(this.lfoDepthGain);
    this.lfo.start();

    this.target = this.buildTarget(options.effect);
    this.setParams(options.rateHz, options.depth, options.mix);
  }

  private buildTarget(effect: ModulationEffect): ModulationTarget {
    const { context, wetGain, lfoDepthGain } = this;

    if (effect === "tremolo") {
      const tremGain = context.createGain();
      tremGain.gain.value = 1;
      lfoDepthGain.connect(tremGain.gain);
      tremGain.connect(wetGain);
      return { wetInput: tremGain, params: [tremGain.gain], baseValue: 1, depthScale: 0.5, centered: false };
    }

    if (effect === "vibrato" || effect === "chorus" || effect === "flanger") {
      const baseDelaySeconds = effect === "vibrato" ? 0.006 : effect === "chorus" ? 0.02 : 0.003;
      const depthScale = effect === "vibrato" ? 0.003 : effect === "chorus" ? 0.008 : 0.002;
      const delay = context.createDelay(0.05);
      delay.delayTime.value = baseDelaySeconds;
      lfoDepthGain.connect(delay.delayTime);
      delay.connect(wetGain);
      return { wetInput: delay, params: [delay.delayTime], baseValue: baseDelaySeconds, depthScale, centered: true };
    }

    // phaser: a cascade of first-order allpass stages, every stage's corner
    // frequency driven by the same LFO so the whole cascade's notches sweep
    // together.
    const stageInput = context.createGain();
    stageInput.gain.value = 1;
    let node: AudioNode = stageInput;
    const params: AudioParam[] = [];
    for (let i = 0; i < PHASER_STAGES; i++) {
      const stage = context.createBiquadFilter();
      stage.type = "allpass";
      stage.frequency.value = PHASER_POLE_HZ;
      lfoDepthGain.connect(stage.frequency);
      params.push(stage.frequency);
      node.connect(stage);
      node = stage;
    }
    node.connect(wetGain);
    return { wetInput: stageInput, params, baseValue: PHASER_POLE_HZ, depthScale: 500, centered: true };
  }

  start(): void {
    if (this.started) return;
    this.started = true;

    const samples = renderPluckedString({
      sampleRate: this.context.sampleRate,
      frequency: MODULATION_SOURCE_FREQUENCY,
      durationSeconds: MODULATION_SOURCE_DURATION_SECONDS,
    });
    const buffer = this.context.createBuffer(1, samples.length, this.context.sampleRate);
    buffer.copyToChannel(Float32Array.from(samples), 0);

    const bufferSource = this.context.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this.dryGain);
    bufferSource.connect(this.target.wetInput);
    bufferSource.onended = () => {
      if (this.source === bufferSource) {
        this.source = null;
        this.started = false;
        this.options.onEnded?.();
      }
    };
    bufferSource.start();
    this.source = bufferSource;
  }

  stop(): void {
    if (!this.started || !this.source) return;
    this.source.onended = null;
    try {
      this.source.stop();
    } catch {
      // Already stopped (e.g. the one-shot pluck just finished on its own).
    }
    this.source = null;
    this.started = false;
  }

  setParams(rateHz: number, depth: number, mix: number): void {
    this.lfo.frequency.value = rateHz;
    this.dryGain.gain.value = 1 - mix;
    this.wetGain.gain.value = mix;

    const swingMagnitude = depth * this.target.depthScale;
    this.lfoDepthGain.gain.value = swingMagnitude;
    const restValue = this.target.centered
      ? this.target.baseValue
      : this.target.baseValue - swingMagnitude;
    for (const param of this.target.params) param.value = restValue;
  }
}

// Week 9: delay as a general mechanism, in two modes built from the same
// dry/wet-mixed feedback-delay idea. "echo" is one delay line with one
// feedback loop — a single, controllable repeat. "reverb" sums several
// such loops at short, deliberately unrelated delay times, each loop
// damped by a lowpass filter in its feedback path (so, like a real space,
// later repeats have lost some high frequency content) — framed generically
// as "a small network of feedback delays of different lengths, summed
// together", not as a specific named algorithm.
export type DelayMode = "echo" | "reverb";

const DELAY_SOURCE_FREQUENCY = 110;
const DELAY_SOURCE_DURATION_SECONDS = 1.1;
const DELAY_OUTPUT_GAIN = 0.5;
const ECHO_MAX_DELAY_SECONDS = 1;
const MAX_FEEDBACK_GAIN = 0.88;
const REVERB_BRANCH_RATIOS = [1, 1.37, 1.81, 2.29];
const REVERB_BASE_DELAY_SECONDS = 0.03;
const REVERB_ROOM_DELAY_RANGE_SECONDS = 0.15;
const REVERB_DAMPING_HZ = 3000;

export interface DelayGraphOptions {
  mode: DelayMode;
  /** echo: delay time in seconds (0-ECHO_MAX_DELAY_SECONDS). reverb: room size, 0-1. */
  time: number;
  /** echo: feedback, 0-1. reverb: decay, 0-1. */
  feedback: number;
  mix: number;
  onEnded?: () => void;
}

interface ReverbBranch {
  delay: DelayNode;
  feedback: GainNode;
  ratio: number;
}

export class DelayGraph {
  private readonly output: GainNode;
  private readonly dryGain: GainNode;
  private readonly wetGain: GainNode;
  private readonly input: GainNode;
  private readonly mode: DelayMode;
  private echoDelay: DelayNode | null = null;
  private echoFeedback: GainNode | null = null;
  private reverbBranches: ReverbBranch[] = [];
  private source: AudioBufferSourceNode | null = null;
  private started = false;

  constructor(
    private readonly context: AudioContext,
    private readonly options: DelayGraphOptions,
  ) {
    this.mode = options.mode;

    this.output = context.createGain();
    this.output.gain.value = DELAY_OUTPUT_GAIN;
    this.output.connect(context.destination);

    this.dryGain = context.createGain();
    this.wetGain = context.createGain();
    this.dryGain.connect(this.output);
    this.wetGain.connect(this.output);

    this.input = context.createGain();
    this.input.gain.value = 1;
    this.input.connect(this.dryGain);

    if (this.mode === "echo") {
      const delay = context.createDelay(ECHO_MAX_DELAY_SECONDS + 0.05);
      const feedback = context.createGain();
      this.input.connect(delay);
      delay.connect(this.wetGain);
      delay.connect(feedback);
      feedback.connect(delay);
      this.echoDelay = delay;
      this.echoFeedback = feedback;
    } else {
      const maxRatio = Math.max(...REVERB_BRANCH_RATIOS);
      for (const ratio of REVERB_BRANCH_RATIOS) {
        const delay = context.createDelay(REVERB_BASE_DELAY_SECONDS + REVERB_ROOM_DELAY_RANGE_SECONDS * maxRatio + 0.05);
        const feedback = context.createGain();
        const damping = context.createBiquadFilter();
        damping.type = "lowpass";
        damping.frequency.value = REVERB_DAMPING_HZ;
        this.input.connect(delay);
        delay.connect(this.wetGain);
        delay.connect(damping);
        damping.connect(feedback);
        feedback.connect(delay);
        this.reverbBranches.push({ delay, feedback, ratio });
      }
    }

    this.setParams(options.time, options.feedback, options.mix);
  }

  start(): void {
    if (this.started) return;
    this.started = true;

    const samples = renderPluckedString({
      sampleRate: this.context.sampleRate,
      frequency: DELAY_SOURCE_FREQUENCY,
      durationSeconds: DELAY_SOURCE_DURATION_SECONDS,
    });
    const buffer = this.context.createBuffer(1, samples.length, this.context.sampleRate);
    buffer.copyToChannel(Float32Array.from(samples), 0);

    const bufferSource = this.context.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this.input);
    bufferSource.onended = () => {
      if (this.source === bufferSource) {
        this.source = null;
        this.started = false;
        this.options.onEnded?.();
      }
    };
    bufferSource.start();
    this.source = bufferSource;
  }

  stop(): void {
    if (!this.started || !this.source) return;
    this.source.onended = null;
    try {
      this.source.stop();
    } catch {
      // Already stopped (e.g. the one-shot pluck just finished on its own).
    }
    this.source = null;
    this.started = false;
  }

  setParams(time: number, feedback: number, mix: number): void {
    this.dryGain.gain.value = 1 - mix;
    this.wetGain.gain.value = mix;

    if (this.mode === "echo" && this.echoDelay && this.echoFeedback) {
      this.echoDelay.delayTime.value = Math.min(Math.max(time, 0), ECHO_MAX_DELAY_SECONDS);
      this.echoFeedback.gain.value = Math.min(Math.max(feedback, 0), 1) * MAX_FEEDBACK_GAIN;
      return;
    }

    const roomSize = Math.min(Math.max(time, 0), 1);
    const decay = Math.min(Math.max(feedback, 0), 1);
    for (const branch of this.reverbBranches) {
      branch.delay.delayTime.value = branch.ratio * (REVERB_BASE_DELAY_SECONDS + roomSize * REVERB_ROOM_DELAY_RANGE_SECONDS);
      branch.feedback.gain.value = decay * MAX_FEEDBACK_GAIN;
    }
  }
}
