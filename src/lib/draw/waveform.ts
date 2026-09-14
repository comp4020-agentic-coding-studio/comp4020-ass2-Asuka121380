export interface WaveformStyle {
  stroke: string;
  background?: string;
  lineWidth?: number;
  /** Draw a faint zero-crossing reference line and amplitude ticks. */
  gridColor?: string;
  labelColor?: string;
  labelFont?: string;
  /**
   * Stroke colour for `previousSamples` (see `drawWaveform`). Only drawn
   * when both this and `previousSamples` are given — omitting either keeps
   * the canvas showing only the current trace.
   */
  previousStroke?: string;
}

/**
 * Draw one cycle (or one analyser frame) of samples in [-1, 1] as a trace.
 * Always erases the previous frame first, regardless of `style.background`
 * — a transparent background is a real background (paint nothing), not "no
 * background" (skip clearing), so clearing and filling are separate steps.
 * Pass `previousSamples` + `style.previousStroke` for an explicit "compare"
 * trace (drawn dashed, behind the current one); without them, only the
 * current state ever shows.
 */
export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  samples: ArrayLike<number>,
  style: WaveformStyle,
  previousSamples?: ArrayLike<number>,
): void {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  if (style.background) {
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, width, height);
  }

  const mid = height / 2;
  const amplitude = mid * 0.85;

  if (style.gridColor) {
    ctx.strokeStyle = style.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.moveTo(0, mid - amplitude);
    ctx.lineTo(width, mid - amplitude);
    ctx.moveTo(0, mid + amplitude);
    ctx.lineTo(width, mid + amplitude);
    ctx.stroke();

    if (style.labelColor) {
      ctx.fillStyle = style.labelColor;
      ctx.font = style.labelFont ?? "10px monospace";
      ctx.textBaseline = "middle";
      ctx.fillText("+1", 4, mid - amplitude + 8);
      ctx.fillText("0", 4, mid);
      ctx.fillText("-1", 4, mid + amplitude - 8);
    }
  }

  if (previousSamples && style.previousStroke) {
    ctx.save();
    ctx.strokeStyle = style.previousStroke;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let i = 0; i < previousSamples.length; i++) {
      const x = (i / (previousSamples.length - 1)) * width;
      const y = mid - previousSamples[i] * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.lineWidth ?? 2;
  ctx.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const x = (i / (samples.length - 1)) * width;
    const y = mid - samples[i] * amplitude;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
