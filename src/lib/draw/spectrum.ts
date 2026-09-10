export interface SpectrumStyle {
  fill: string;
  background?: string;
  gridColor?: string;
  labelColor?: string;
  labelFont?: string;
  /** Bar indices (0-based) to render in a highlight colour instead of `fill`. */
  highlightIndices?: number[];
  highlightFill?: string;
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

  const plotHeight = height * 0.95;

  if (style.gridColor) {
    ctx.strokeStyle = style.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const fraction of [0, 0.5, 1]) {
      const y = height - fraction * plotHeight;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    if (style.labelColor) {
      ctx.fillStyle = style.labelColor;
      ctx.font = style.labelFont ?? "10px monospace";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("harmonics →", width - 68, height - 4);
    }
  }

  const highlight = new Set(style.highlightIndices ?? []);
  const barWidth = width / magnitudes.length;
  for (let i = 0; i < magnitudes.length; i++) {
    const magnitude = Math.max(0, Math.min(1, magnitudes[i]));
    const barHeight = magnitude * plotHeight;
    ctx.fillStyle = highlight.has(i) && style.highlightFill ? style.highlightFill : style.fill;
    ctx.fillRect(i * barWidth + 1, height - barHeight, Math.max(1, barWidth - 2), barHeight);
  }
}
