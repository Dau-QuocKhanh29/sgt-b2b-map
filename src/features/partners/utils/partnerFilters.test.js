import { describe, expect, it } from "vitest";
import mockPartners from "../data/mockPartners.json";
import {
  DEFAULT_FILTERS,
  deduplicatePartners,
  filterPartners,
  isMapped,
  summarizePartners,
} from "./partnerFilters.js";

describe("partner filtering and statistics", () => {
  it("preserves the 200 = 180 + 20 invariant from the SQL development seed", () => {
    const summary = summarizePartners(mockPartners);
    expect(summary).toEqual({ totalMatched: 200, totalMapped: 180, totalUnmapped: 20 });
  });

  it("combines groups with AND and values in one group with OR", () => {
    const results = filterPartners(mockPartners, {
      ...DEFAULT_FILTERS,
      countries: ["Vietnam", "Singapore"],
      relationshipStatuses: ["LEAD"],
      tags: ["Priority", "Strategic"],
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((partner) => ["Vietnam", "Singapore"].includes(partner.country))).toBe(true);
    expect(results.every((partner) => partner.relationshipStatus === "LEAD")).toBe(true);
    expect(results.every((partner) => partner.tags.some((tag) => ["Priority", "Strategic"].includes(tag)))).toBe(true);
  });

  it("does not count duplicate partner rows caused by joins", () => {
    const repeated = [mockPartners[0], mockPartners[0], mockPartners[1]];
    expect(deduplicatePartners(repeated)).toHaveLength(2);
    expect(summarizePartners(repeated).totalMatched).toBe(2);
  });

  it("keeps unmapped partners in list statistics but not map points", () => {
    const unmapped = filterPartners(mockPartners, { ...DEFAULT_FILTERS, geocodeStatuses: ["UNMAPPED"] });
    expect(unmapped).toHaveLength(20);
    expect(unmapped.every((partner) => !isMapped(partner))).toBe(true);
  });

  it("supports separate partners sharing the same coordinates", () => {
    const first = { ...mockPartners[0], id: 990001, latitude: 10, longitude: 106 };
    const second = { ...mockPartners[1], id: 990002, latitude: 10, longitude: 106 };
    const result = filterPartners([first, second], DEFAULT_FILTERS);
    expect(result).toHaveLength(2);
    expect(result.every(isMapped)).toBe(true);
  });
});
