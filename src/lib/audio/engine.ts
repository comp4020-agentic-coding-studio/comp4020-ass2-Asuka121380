import { buildClippingCurve, type ClippingTopology } from "./waveshaping";

// WaveShaperNode#curve is typed against an ArrayBuffer-backed Float32Array;
// our curve builder returns a generically-backed one, so the assignment
// needs a cast on lib types that will always be compatible at runtime.
function asShaperCurve(curve: Float32Array): Float32Array<ArrayBuffer> {
  return curve as Float32Array<ArrayBuffer>;
}

export interface ClippingGraphOptions {
  frequency: number;
  topology: ClippingTopology;
  drive: number;
}

/**
 * A minimal oscillator -> gain -> waveshaper chain for the "Hear It" / "Try
 * It" clipping demo. The waveshaper curve is the same function that draws
 * the paired waveform/spectrum diagrams, so what a visitor sees and hears
 * always describe the same transformation.
 */
export class ClippingGraph {
  private readonly oscillator: OscillatorNode;
  private readonly drive: GainNode;
  private readonly shaper: WaveShaperNode;
  private readonly output: GainNode;
  private started = false;

  constructor(context: AudioContext, options: ClippingGraphOptions) {
    this.oscillator = context.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.frequency.value = options.frequency;

    this.drive = context.createGain();
    this.drive.gain.value = options.drive;

    this.shaper = context.createWaveShaper();
    this.shaper.curve = asShaperCurve(buildClippingCurve(options.topology, options.drive));

    this.output = context.createGain();
    this.output.gain.value = 0.2;

    this.oscillator.connect(this.drive);
    this.drive.connect(this.shaper);
    this.shaper.connect(this.output);
    this.output.connect(context.destination);
  }

  start(): void {
    if (this.started) return;
    this.oscillator.start();
    this.started = true;
  }

  stop(): void {
    if (!this.started) return;
    this.oscillator.stop();
    this.started = false;
  }

  setCurve(topology: ClippingTopology, drive: number): void {
    this.drive.gain.value = drive;
    this.shaper.curve = asShaperCurve(buildClippingCurve(topology, drive));
  }
}
