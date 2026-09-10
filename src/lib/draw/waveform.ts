export interface WaveformStyle {
  stroke: string;
  background?: string;
  lineWidth?: number;
  /** Draw a faint zero-crossing reference line and amplitude ticks. */
  gridColor?: string;
  labelColor?: string;
  labelFont?: string;
}

/** Draw one cycle (or one analyser frame) of samples in [-1, 1] as a trace. */
export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  samples: ArrayLike<number>,
  style: WaveformStyle,
): void {
  const { width, height } = ctx.canvas;
  if (style.background) {
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
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
