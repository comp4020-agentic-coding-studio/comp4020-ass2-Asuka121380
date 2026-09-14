import diGuitarUrl from "../../assets/audio/di-guitar-e2.wav";

const bufferCache = new WeakMap<AudioContext, Promise<AudioBuffer>>();

/**
 * The site's one canonical dry guitar DI recording — see
 * src/assets/audio/DI-SOURCE.md for provenance and licence. Every
 * guitar-representing demo (as opposed to an abstract signal/DSP concept,
 * which stays synthetic per CLAUDE.md) should source its audio from here
 * rather than a fresh recording or a fake-guitar oscillator, so a listener
 * always hears the same performance under different processing.
 *
 * Decoded once per `AudioContext` and cached, since `decodeAudioData` is
 * async but every caller wants the same immutable buffer.
 */
export function loadDiGuitarBuffer(context: AudioContext): Promise<AudioBuffer> {
  let pending = bufferCache.get(context);
  if (!pending) {
    pending = fetch(diGuitarUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => context.decodeAudioData(data));
    bufferCache.set(context, pending);
  }
  return pending;
}
