/**
 * Statistical helpers for mutation and shadow-trial acceptance gating.
 * @see docs/evaluation_and_math.md §2 — Acceptance Criteria
 */

export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function standardDeviation(values: number[]): number {
    if (values.length <= 1) return 0;
    const avg = mean(values);
    const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / (values.length - 1);
    return Math.sqrt(variance);
}

export function lowerConfidenceBound(values: number[], lambda = 1): number {
    const avg = mean(values);
    const sigma = standardDeviation(values);
    return avg - lambda * sigma;
}

interface RankedValue {
    value: number;
    group: "a" | "b";
}

function erf(x: number): number {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * absX);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
}

function normalCdf(z: number): number {
    return 0.5 * (1 + erf(z / Math.SQRT2));
}

/**
 * Mann-Whitney U test (two-sided) with tie correction and normal approximation.
 */
export function mannWhitneyUTest(
    sampleA: number[],
    sampleB: number[],
): { u: number; pValue: number } {
    const n1 = sampleA.length;
    const n2 = sampleB.length;
    if (n1 === 0 || n2 === 0) {
        return { u: 0, pValue: 1 };
    }

    const combined: RankedValue[] = [
        ...sampleA.map(value => ({ value, group: "a" as const })),
        ...sampleB.map(value => ({ value, group: "b" as const })),
    ].sort((x, y) => x.value - y.value);

    let rank = 1;
    let rankSumA = 0;
    let tieCorrection = 0;
    for (let i = 0; i < combined.length;) {
        let j = i + 1;
        while (j < combined.length && combined[j].value === combined[i].value) {
            j++;
        }

        const tieSize = j - i;
        const avgRank = (rank + (rank + tieSize - 1)) / 2;
        for (let k = i; k < j; k++) {
            if (combined[k].group === "a") {
                rankSumA += avgRank;
            }
        }

        if (tieSize > 1) {
            tieCorrection += tieSize ** 3 - tieSize;
        }

        rank += tieSize;
        i = j;
    }

    const u1 = rankSumA - (n1 * (n1 + 1)) / 2;
    const u2 = n1 * n2 - u1;
    const u = Math.min(u1, u2);

    const muU = (n1 * n2) / 2;
    const n = n1 + n2;
    const tieTerm = tieCorrection / (n * (n - 1));
    const sigmaSquared = (n1 * n2 / 12) * ((n + 1) - tieTerm);
    const sigma = Math.sqrt(Math.max(0, sigmaSquared));
    if (sigma === 0) {
        return { u, pValue: 1 };
    }

    const continuity = u < muU ? 0.5 : -0.5;
    const z = (u - muU + continuity) / sigma;
    const pValue = Math.min(1, 2 * (1 - normalCdf(Math.abs(z))));
    return { u, pValue };
}
