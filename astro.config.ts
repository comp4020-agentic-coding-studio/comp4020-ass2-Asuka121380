import { defineConfig, fontProviders } from "astro/config";
import courseGraph from "astro-course-university";
import universityTheme from "astro-theme-university";
import { astromotion, deckRemarkPlugins } from "astromotion";
import { courseMeta } from "./src/course-config.ts";
import { courseApiCollections } from "./src/site-config.ts";
import { gitOrigin, resolveDeployment } from "./scripts/pages-base.ts";

// Derived, never hardcoded --- see scripts/pages-base.ts for why.
const { site, base } = resolveDeployment(process.env, gitOrigin);

export default defineConfig({
  site,
  base,
  // Pages build as directories, so every route URL ends in a slash. Saying so
  // explicitly makes Astro emit matching links, which keeps the canonical URL
  // and what a visitor clicks in agreement --- otherwise each click costs a
  // 301 on GitHub Pages.
  trailingSlash: "always",
  // The course's own typeface pair, registered alongside (not instead of) the
  // theme's Public Sans / Roboto Mono, which the pages still on the theme's
  // register keep using. Archivo is an industrial grotesque with a full
  // variable weight axis and tabular lining figures — it carries display
  // headlines at 700-800 and reads cleanly as body text at 400, so the TONE
  // pages need only one text family. IBM Plex Mono handles technical
  // metadata: units, axis labels, signal-path labels, instrument readouts.
  fonts: [
    {
      name: "Archivo",
      cssVariable: "--font-archivo",
      provider: fontProviders.google(),
      weights: ["100 900"],
    },
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      provider: fontProviders.google(),
      weights: ["400", "500", "600"],
      styles: ["normal"],
      fallbacks: ["monospace"],
    },
  ],
  integrations: [
    universityTheme({
      defaultLayout: "src/layouts/PageLayout.astro",
      // The whole brand choice: three colour tokens and a set of lockups. Keep
      // institutional brand packages and assets out of this fictional site.
      brandCss: "astro-theme-slop/slop.css",
      imageFormat: "avif",
      llmsTxt: true,
      // The theme owns the markdown plugin chain, so astromotion's slide
      // plugins (slide breaks, classes, backgrounds, notes, QR codes) are
      // handed to it rather than registered separately. Each one gates on
      // `.deck.mdx`, so ordinary pages are untouched.
      extraRemarkPlugins: deckRemarkPlugins,
    }),
    courseGraph({
      collections: courseApiCollections,
      timezone: "Australia/Canberra",
      course: courseMeta,
      canonicalUrl: `https://courses.slop.university/${courseMeta.code}/`,
    }),
    // Slide decks: every `.deck.mdx` under src/decks/ becomes a Reveal.js page
    // at /decks/<name>/. The theme's deck stylesheet reads the same brand
    // tokens the site does, so a deck arrives already wearing the Slop palette
    // --- see src/decks/theme.css. `fontVariables` makes the deck page emit the
    // @font-face for the theme's body font, which the deck styles ask for by
    // name.
    astromotion({
      theme: "./src/decks/theme.css",
      fontVariables: ["--font-public-sans"],
    }),
  ],
});
