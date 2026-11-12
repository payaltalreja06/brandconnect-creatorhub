import { describe, expect, it } from "vitest";
import { formatEngagementRate } from "./formatters";

describe("formatEngagementRate", () => {
  it("formats engagement rates to one decimal place", () => {
    expect(formatEngagementRate(2.18)).toBe("2.2%");
    expect(formatEngagementRate(4)).toBe("4.0%");
  });

  it("formats missing or invalid rates consistently as zero", () => {
    expect(formatEngagementRate(undefined)).toBe("0.0%");
    expect(formatEngagementRate(Number.NaN)).toBe("0.0%");
  });
});
