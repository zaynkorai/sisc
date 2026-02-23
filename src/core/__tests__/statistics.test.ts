import { describe, it, expect } from "vitest";
import { lowerConfidenceBound, mannWhitneyUTest } from "../../core/statistics.js";

describe("statistics", () => {
    it("computes lower confidence bound with variance penalty", () => {
        const lcb = lowerConfidenceBound([5, 5, 4, 6], 1);
        expect(lcb).toBeLessThan(5);
        expect(lcb).toBeGreaterThan(4);
    });

    it("returns low p-value for clearly separated samples", () => {
        const result = mannWhitneyUTest([8, 9, 10, 9, 8], [0, 1, 2, 1, 0]);
        expect(result.pValue).toBeLessThan(0.05);
    });

    it("returns high p-value for similar samples", () => {
        const result = mannWhitneyUTest([1, 2, 3, 4], [1, 2, 3, 4]);
        expect(result.pValue).toBeGreaterThan(0.05);
    });
});
