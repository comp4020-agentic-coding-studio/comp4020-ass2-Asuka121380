export interface SpectrumStyle {
  fill: string;
  background?: string;
}

/** Draw a magnitude spectrum (each value in [0, 1]) as vertical bars. */
export function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  magnitudes: ArrayLike<number>,
  style: SpectrumStyle,
): void {
  const { width, height } = ctx.canvas;
  if (style.background) {
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  const barWidth = width / magnitudes.length;
  ctx.fillStyle = style.fill;
  for (let i = 0; i < magnitudes.length; i++) {
    const magnitude = Math.max(0, Math.min(1, magnitudes[i]));
    const barHeight = magnitude * height * 0.95;
    ctx.fillRect(i * barWidth + 1, height - barHeight, Math.max(1, barWidth - 2), barHeight);
  }
}
