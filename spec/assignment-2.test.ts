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

  it("runs across twelve dated teaching weeks", () => {
    const weeks = byType("sessions")
      .map((node) => node.meta?.week)
      .sort((a, b) => (a as number) - (b as number));
    expect(weeks, "one session per week, weeks 1 through 12").toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
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
