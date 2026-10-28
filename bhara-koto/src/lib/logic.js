import { findFareRow } from "./data";
import { normalize } from "./utils";

const ZERO_FARE = { standard: 0, student: 0, usedPredefined: false };

/** Shown in UI when fare is forced to 0 */
export const ZERO_FARE_REASON = {
  SAME_STATION: "same-station",
  UNDER_1_KM: "under-1km",
};

const RATE = 2.45; // BDT/km
const MIN_STD = 10;
const MIN_STU = 10;

export function estimateFareByDistance(distanceKm) {
    const numericDistance = Number(distanceKm);
    if (Number.isNaN(numericDistance)) return null;
    if (numericDistance < 1)
        return { standard: 0, student: 0, zeroFareReason: ZERO_FARE_REASON.UNDER_1_KM };

    const base = Math.max(numericDistance * RATE, MIN_STD);
    return {
        standard: Math.round(base),
        student: Math.round(Math.max(base / 2, MIN_STU)),
    };
}

/** Calculate fare following the spec:
 * 1) Use predefined fare if available
 * 2) Else, query Google Distance Matrix (if API key provided)
 * 3) Apply min fares and student discount
 */
export async function calcFare({ chart, from, to }) {
    if (!from || !to) return { error: "empty-input" };
    if (normalize(from) === normalize(to))
        return { ...ZERO_FARE, zeroFareReason: ZERO_FARE_REASON.SAME_STATION };

    // try fare_chart first (spec FR1.1) 
    const row = findFareRow(chart, from, to);
    let base;

    if (row?.fareBDT) {
        const km = row.distanceKm;
        if (typeof km === "number" && !Number.isNaN(km) && km < 1)
            return { ...ZERO_FARE, zeroFareReason: ZERO_FARE_REASON.UNDER_1_KM };
        base = Number(row.fareBDT);
    } else {
        // if fare not present, try distance column in fare_chart (fallback if provided)
        let distance = row && typeof row.distanceKm === "number" ? row.distanceKm : null;

        if (distance == null || Number.isNaN(distance)) {
            return { error: "no-source" }; // neither fare nor distance available
        }
        const estimated = estimateFareByDistance(distance);
        if (!estimated) return { error: "no-source" };
        return { ...estimated, usedPredefined: false };
    }
    base = Math.max(base, MIN_STD); // FR1.4
    const standard = Math.round(base);
    const student = Math.round(Math.max(base / 2, MIN_STU)); // FR1.5/FR1.6

    return { standard, student, usedPredefined: !!row?.fareBDT };
}

const indexOfStation = (route, name) => {
    const n = normalize(name);
    return route.stations.findIndex((s) => normalize(s) === n);
  };
  
  /**
   * Buses serving both stations. Routes are treated as running both ways.
   * Sorted by how many listed stations lie between the two.
   */
  export function findDirect({ routes, from, to }) {
    const res = [];
    for (const r of routes) {
      const i = indexOfStation(r, from);
      const j = indexOfStation(r, to);
      if (i >= 0 && j >= 0 && i !== j) res.push({ ...r, stops: Math.abs(j - i) });
    }
    return res.sort((a, b) => a.stops - b.stops);
  }
  
  /**
   * Two-bus options: a bus from `from` and another to `to` that share a station.
   * One best transfer point per pair of buses, shortest trips first.
   */
  export function findTwoBus({ routes, from, to, limit = 12 }) {
    const nFrom = normalize(from);
    const nTo = normalize(to);
  
    const routesWith = (name) =>
      routes
        .map((r, ri) => ({ r, ri, i: indexOfStation(r, name) }))
        .filter((x) => x.i >= 0);
  
    const fromRoutes = routesWith(from);
    const toRoutes = routesWith(to);
    const best = new Map();
  
    for (const a of fromRoutes) {
      const aNames = a.r.stations.map(normalize);
      for (const b of toRoutes) {
        if (a.ri === b.ri) continue;
        const bPos = new Map(b.r.stations.map((s, k) => [normalize(s), k]));
        for (let k = 0; k < aNames.length; k++) {
          const name = aNames[k];
          if (!name || name === nFrom || name === nTo) continue;
          const kb = bPos.get(name);
          if (kb === undefined) continue;
          const stops = Math.abs(k - a.i) + Math.abs(b.i - kb);
          const key = `${a.ri}|${b.ri}`;
          const prev = best.get(key);
          if (!prev || stops < prev.stops) {
            best.set(key, { transfer: a.r.stations[k].trim(), busA: a.r, busB: b.r, stops });
          }
        }
      }
    }
  
    return [...best.values()].sort((x, y) => x.stops - y.stops).slice(0, limit);
  }