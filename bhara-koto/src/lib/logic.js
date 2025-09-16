import { findFareRow } from "./data";
import { googleDistanceKm } from "./utils";

const RATE = 2.45; // BDT/km
const MIN_STD = 10;
const MIN_STU = 10;

/** Calculate fare following the spec:
 * 1) Use predefined fare if available
 * 2) Else, query Google Distance Matrix (if API key provided)
 * 3) Apply min fares and student discount
 */
export async function calcFare({ chart, from, to, isStudent }) {
    if (!from || !to) return { error: "empty-input" };

    // try fare_chart first (spec FR1.1) 
    const row = findFareRow(chart, from, to);
    let base;

    if (row?.fareBDT) {
        base = Number(row.fareBDT);
    } else {
        // if fare not present, try distance column in fare_chart (fallback if provided)
        let distance =
            (row && typeof row.distanceKm === "number" ? row.distanceKm : null) ??
            (await googleDistanceKm(from, to));

        if (distance == null || Number.isNaN(distance)) {
            return { error: "no-source" }; // neither fare nor distance available
        }
        base = distance * RATE; // FR1.3
    }

    base = Math.max(base, MIN_STD); // FR1.4
    const standard = Math.round(base);
    const student = Math.round(Math.max(base / 2, MIN_STU)); // FR1.5/FR1.6

    return { standard, student, usedPredefined: !!row?.fareBDT };
}

/** Direct routes: buses that contain both stations in order */
export function findDirect({ routes, from, to }) {
    const res = [];
    for (const r of routes) {
        const i = r.stations.findIndex((s) => s && s.trim() === from);
        const j = r.stations.findIndex((s) => s && s.trim() === to);
        if (i >= 0 && j >= 0 && i < j) res.push(r);
    }
    return res;
}

/** Two-bus options: pick a transfer station T where a bus goes from from->T and another T->to */
export function findTwoBus({ routes, from, to, limit = 12 }) {
    const options = [];
    const stationsSet = new Set(
        routes.flatMap((r) => r.stations.filter(Boolean).map((s) => s.trim()))
    );

    for (const T of stationsSet) {
        if (T === from || T === to) continue;

        const A = findDirect({ routes, from, to: T });
        if (A.length === 0) continue;
        const B = findDirect({ routes, from: T, to });
        if (B.length === 0) continue;

        for (const a of A) {
            for (const b of B) {
                if (a.busEn === b.busEn && a.busBn === b.busBn) continue; // avoid same bus trivially
                options.push({ transfer: T, busA: a, busB: b });
                if (options.length >= limit) return options;
            }
        }
    }
    return options;
}
