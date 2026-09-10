import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const byType = (type: string) => api.nodes.filter((node) => node.type === type);

describe("assignment 2 spec", () => {
  it("keeps the three digits the repo was provisioned with", () => {
    expect(api.course.code, "the last three digits are fixed by provisioning, only the level changes").toMatch(
      /186$/,
    );
  });

  it("gives every lecture its own week, within the twelve-week course", () => {
    // Sessions are used selectively (a genuinely separate studio activity),
    // not manufactured one per week, so lectures carry the teaching-week
    // invariant instead: each lecture is a distinct week from 1 to 12.
    const weeks = byType("lectures").map((node) => Number(node.meta?.week));
    expect(weeks.length, "at least one lecture exists").toBeGreaterThan(0);
    for (const week of weeks) {
      expect(week, `lecture week ${week} is outside 1-12`).toBeGreaterThanOrEqual(1);
      expect(week, `lecture week ${week} is outside 1-12`).toBeLessThanOrEqual(12);
    }
    expect(new Set(weeks).size, "two lectures claim the same week").toBe(weeks.length);
  });

  it("has at least one lecture with a real deck linked from its page", () => {
    const decked = byType("lectures").filter((node) => typeof node.meta?.slides === "string");
    expect(decked.length, "no lecture links a deck").toBeGreaterThan(0);
    for (const lecture of decked) {
      const slug = String(lecture.meta?.slides).replace(/^\/decks\/|\/$/g, "");
      const deckPath = resolve("src/decks", `${slug}.deck.mdx`);
      expect(existsSync(deckPath), `${lecture.id} links a deck that doesn't exist at ${deckPath}`).toBe(
        true,
      );
    }
  });

  it("assessment weights add up to 100%", () => {
    const total = byType("assessments").reduce(
      (sum, node) => sum + (Number(node.meta?.weight) || 0),
      0,
    );
    expect(total, `assessment weights sum to ${total}, not 100`).toBe(100);
  });
});
