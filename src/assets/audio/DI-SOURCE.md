# `di-guitar-e2.wav` — source and licence

The site's one canonical dry electric-guitar DI recording, per `CLAUDE.md`'s
audio-material policy: every guitar-representing demo (as opposed to an
abstract signal/DSP concept) plays this same performance through different
processing, so a student attributes what they hear to the processing, not to
a different take or instrument.

- **Source**: the FreePats project's "Electric Guitar FSBS (direct)" sound
  bank — <https://freepats.zenvoid.org/ElectricGuitar/clean-electric-guitar.html#FSBS_Direct>
  (direct-download archive:
  <https://github.com/freepats/electric-guitar-FSBS-direct/releases/tag/2022-09-11>).
  A raw, unprocessed DI recording of a Fender-style electric guitar's bridge
  pickup, made specifically to be fed into external amp/effects processing —
  exactly this course's use case.
- **Licence**: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
  (public domain dedication) — the archive's own `LICENSE.txt`, reproduced
  from the same source, confirms this.
- **What was kept**: one sample, the open low-E string (`E2_s1_02.flac` in
  the archive), trimmed to 3.5 seconds with a 0.3s fade-out, resampled to
  44.1kHz/16-bit mono WAV, normalised to a -6dBFS peak (leaving headroom for
  the site's own gain/clipping demos to drive it further). The archive also
  contains the same note at other velocities/positions and the rest of the
  chromatic range — only this one note is used, per the policy's "one
  canonical DI performance" rule.
- **Why the open low E**: guitar's lowest, longest-sustaining string — a
  strong fundamental with rich harmonic content once driven, which reads
  clearly through filtering, clipping, modulation, delay, and cabinet
  demos alike.

Loaded and decoded once per `AudioContext` by
`src/lib/audio/diSample.ts`'s `loadDiGuitarBuffer`; every guitar-specific
demo on the site should source its audio from that function rather than
re-deriving its own copy or a new recording.
