// Turns sampled signal data into SVG path strings, so diagrams can render
// the exact same arrays the audio engine and canvas plots use — one source
// of truth, three presentations.

export interface Viewport {
  width: number;
  height: number;
  /** Inset from the edges, so strokes and dashed reference lines don't clip. */
  padding?: number;
}

function toPath(points: Array<[number, number]>): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
}

/**
 * Path for a curve sampled over domain [-1, 1] on both axes (e.g. a
 * WaveShaperNode-style transfer curve), mapped into an SVG viewport with
 * (-1,-1) at bottom-left and (1,1) at top-right.
 */
export function transferCurvePath(curve: ArrayLike<number>, viewport: Viewport): string {
  const { width, height, padding = 0 } = viewport;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const points: Array<[number, number]> = [];
  for (let i = 0; i < curve.length; i++) {
    const x = padding + (i / (curve.length - 1)) * innerWidth;
    const y = padding + innerHeight / 2 - (curve[i] / 1) * (innerHeight / 2);
    points.push([x, y]);
  }
  return toPath(points);
}

/**
 * Path for a time-domain signal sampled over [-1, 1] amplitude, spread
 * evenly across the viewport width — used for the small waveform sketches
 * inside diagrams (not the full canvas "See It" plots).
 */
export function waveformPath(samples: ArrayLike<number>, viewport: Viewport): string {
  const { width, height, padding = 0 } = viewport;
  const innerWidth = width - padding * 2;
  const mid = height / 2;
  const amplitude = (height / 2 - padding) * 0.9;
  const points: Array<[number, number]> = [];
  for (let i = 0; i < samples.length; i++) {
    const x = padding + (i / (samples.length - 1)) * innerWidth;
    const y = mid - samples[i] * amplitude;
    points.push([x, y]);
  }
  return toPath(points);
}
