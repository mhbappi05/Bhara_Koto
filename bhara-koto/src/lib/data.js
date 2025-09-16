import Papa from "papaparse";
import { normalize, unique } from "./utils";

import { parse } from "papaparse";

export async function loadCSV(path) {
  const text = await fetch(path).then(r => r.text());
  const { data } = parse(text, { header: true, skipEmptyLines: true });
  return data;
}

/** Returns { routes: [{busEn, busBn, stations:[...]}], stations:[...] } */
export async function loadBusRoutes() {
  const rows = await loadCSV("/data/bus_routes.csv");
  const routes = rows.map((r) => {
    const busEn = r["Bus Name (English)"] || r["Bus Name English"] || r["Bus Name"];
    const busBn = r["Bus Name (Bangla)"] || r["Bus Name Bangla"] || r["Bus Name BN"];
    const stations = Object.keys(r)
      .filter((k) => /^Station\s*\d+/i.test(k))
      .map((k) => r[k])
      .filter(Boolean);
    return { busEn, busBn, stations };
  });
  const stations = unique(
    routes.flatMap((r) => r.stations.map((s) => s?.trim())).filter(Boolean)
  );
  return { routes, stations };
}

/** Returns list with {from, to, distanceKm?, fareBDT?} */
export async function loadFareChart() {
  const rows = await loadCSV("/data/fare_chart.csv");
  return rows.map((r) => ({
    from: r["From Point"]?.trim(),
    to: r["To Point"]?.trim(),
    distanceKm: Number(r["Distance (km)"] || r["Distance"]) || null,
    fareBDT: Number(r["Fare (BDT)"] || r["Fare"]) || null,
  }));
}

/** Try to find a predefined fare (order-insensitive) */
export function findFareRow(chart, from, to) {
  const f = normalize(from), t = normalize(to);
  return (
    chart.find((r) => normalize(r.from) === f && normalize(r.to) === t) ||
    chart.find((r) => normalize(r.from) === t && normalize(r.to) === f) ||
    null
  );
}
