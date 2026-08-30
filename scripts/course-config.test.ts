import { describe, expect, it } from "vitest";
import { slopCourseMetaSchema } from "../src/course-config";

const valid = {
  code: "SLOP2713",
  title: "Small Machines for Large Puddles",
  session: "Semester 2",
  year: 2027,
  level: 2 as const,
  startDate: "2027-07-26",
  endDate: "2027-10-29",
  description:
    "A focused course for students who want to build, observe and explain tiny machines working in inconveniently large puddles.",
  tags: ["puddles", "machines"],
};

describe("Slop course record", () => {
  it("accepts a complete record", () => {
    expect(slopCourseMetaSchema.safeParse(valid).success).toBe(true);
  });

  it.each(["SLOP0713", "SLOP5713", "SLOP7713", "SLOP9713", "SLOP271", "COMP2713"])(
    "rejects invalid code %s",
    (code) => expect(slopCourseMetaSchema.safeParse({ ...valid, code }).success).toBe(false),
  );

  it("takes any session name and a period that crosses the year", () => {
    const record = {
      ...valid,
      session: "The Long Dark",
      startDate: "2027-11-01",
      endDate: "2028-02-12",
    };
    expect(slopCourseMetaSchema.safeParse(record).success).toBe(true);
  });

  it("requires the level to match the code", () => {
    expect(slopCourseMetaSchema.safeParse({ ...valid, level: 3 }).success).toBe(false);
  });

  it("bounds descriptions and tags", () => {
    expect(slopCourseMetaSchema.safeParse({ ...valid, description: "Too short" }).success).toBe(
      false,
    );
    expect(slopCourseMetaSchema.safeParse({ ...valid, tags: [] }).success).toBe(false);
    expect(
      slopCourseMetaSchema.safeParse({ ...valid, tags: ["one", "two", "three", "four"] }).success,
    ).toBe(false);
  });
});
