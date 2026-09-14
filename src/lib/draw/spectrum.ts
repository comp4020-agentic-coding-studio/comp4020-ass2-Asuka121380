export interface SpectrumStyle {
  fill: string;
  background?: string;
  gridColor?: string;
  labelColor?: string;
  labelFont?: string;
  /** Bar indices (0-based) to render in a highlight colour instead of `fill`. */
  highlightIndices?: number[];
  highlightFill?: string;
  /**
   * Outline colour for `previousMagnitudes` (see `drawSpectrum`). Only drawn
   * when both this and `previousMagnitudes` are given — omitting either
   * keeps the canvas showing only the current bars.
   */
  previousStroke?: string;
}

/**
 * Draw a magnitude spectrum (each value in [0, 1]) as vertical bars. Always
 * erases the previous frame first, regardless of `style.background` — a
 * transparent background is a real background (paint nothing), not "no
 * background" (skip clearing), so clearing and filling are separate steps.
 * Pass `previousMagnitudes` + `style.previousStroke` for an explicit
 * "compare" outline (drawn behind the current bars); without them, only the
 * current state ever shows.
 */
export function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  magnitudes: ArrayLike<number>,
  style: SpectrumStyle,
  previousMagnitudes?: ArrayLike<number>,
): void {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  if (style.background) {
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, width, height);
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

  if (previousMagnitudes && style.previousStroke) {
    ctx.save();
    ctx.strokeStyle = style.previousStroke;
    ctx.lineWidth = 1;
    const previousBarWidth = width / previousMagnitudes.length;
    for (let i = 0; i < previousMagnitudes.length; i++) {
      const magnitude = Math.max(0, Math.min(1, previousMagnitudes[i]));
      const barHeight = magnitude * plotHeight;
      ctx.strokeRect(i * previousBarWidth + 1, height - barHeight, Math.max(1, previousBarWidth - 2), barHeight);
    }
    ctx.restore();
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
