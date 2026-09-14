# Photography sources

Real macro photography used on the Homepage and Week 3, per CLAUDE.md's
"Visual material" policy (real structure teaches better as a real photograph
than a from-scratch illustration; record source and licence next to it).

## `hero-guitar-strings.jpg`

- **Source**: [Wikimedia Commons — "Close-up view of guitar strings showcasing
  details.jpg"](https://commons.wikimedia.org/wiki/File:Close-up_view_of_guitar_strings_showcasing_details.jpg)
- **Author**: Shixart1985
- **Licence**: Creative Commons Attribution 2.0 Generic (CC BY 2.0) — credit
  required, link to licence, indicate changes.
- **What was kept/modified**: downscaled from the original 4016×6016 to
  1201×1800 (no crop, no colour grading) to keep the shipped asset a
  reasonable size; Astro's image pipeline further resizes/re-encodes it to
  AVIF at build time. Displayed in `RigHero.astro`.
- **Why this one**: a real macro shot of an electric guitar's fretboard and
  strings in shallow depth of field — the "physical, tactile, editorial"
  photography the homepage brief asks for, replacing the previous abstract
  vector-arc hero graphic (`hero-home.avif`, no longer used), which read as
  decorative rather than as the actual instrument.

## `week3-pickup-anatomy.jpg`

- **Source**: [Wikimedia Commons — "Pickups_Humb_2Single.jpg"](https://commons.wikimedia.org/wiki/File:Pickups_Humb_2Single.jpg)
- **Author**: Feitscherg
- **Licence**: Public domain (author's own dedication) — no attribution
  legally required; credited anyway as a courtesy.
- **What was kept/modified**: used unmodified (569×395, the original
  resolution). Displayed in `PickupDiagram.astro` as the "what physically
  exists" figure, with STRING / POLE PIECE / COIL / MAGNET labels layered
  over it in CSS — the accompanying hand-drawn flux/motion diagram stays
  separate and answers "what changes dynamically," per CLAUDE.md's guidance
  not to make one image answer both questions.
- **Why this one**: a real, crisply-lit top-down photo showing a humbucker
  and two single-coils on the same pickguard — real pole pieces, coil
  bobbins and mounting hardware, not a schematic cross-section.
