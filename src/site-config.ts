import { defineSiteConfig } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// Sessions have detail pages and API entries, but no redundant index or
// navigation item. Related-content rendering uses the same routed collections.
export const graphCollections = ["assessments", "lectures", "people"];

export const courseApiCollections = [
  { key: "sessions" },
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "policy-content" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  links: [
    { text: "Lectures", href: "/lectures/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt: `A preview card for ${courseMeta.code}: ${courseMeta.title}`,
});
