export interface WaveformStyle {
  stroke: string;
  background?: string;
  lineWidth?: number;
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
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = style.lineWidth ?? 2;
  ctx.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const x = (i / (samples.length - 1)) * width;
    const y = mid - samples[i] * mid * 0.9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
