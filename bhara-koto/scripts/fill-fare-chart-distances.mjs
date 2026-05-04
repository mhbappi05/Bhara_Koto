/**
 * Fills blank "Distance (km)" in public/data/fare_chart.csv.
 * 1) Uses distance from the reverse pair (To→From) when present.
 * 2) Otherwise infers distance from fare using RATE (must match src/lib/logic.js).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RATE = 2.45;

function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function pairKey(a, b) {
  return `${norm(a)}\t${norm(b)}`;
}

const csvPath = path.join(__dirname, "..", "public", "data", "fare_chart.csv");
const text = fs.readFileSync(csvPath, "utf8");
const { data: rows } = Papa.parse(text, { header: true, skipEmptyLines: true });

const distByPair = new Map();
for (const r of rows) {
  const from = r["From Point"]?.trim();
  const to = r["To Point"]?.trim();
  const d = Number(String(r["Distance (km)"] ?? r["Distance"] ?? "").trim());
  if (!from || !to || Number.isNaN(d) || d <= 0) continue;
  distByPair.set(pairKey(from, to), d);
  distByPair.set(pairKey(to, from), d);
}

let fromReverse = 0;
let fromFormula = 0;

for (const r of rows) {
  const from = r["From Point"]?.trim();
  const to = r["To Point"]?.trim();
  const distStr = String(r["Distance (km)"] ?? r["Distance"] ?? "").trim();
  const fare = Number(String(r["Fare (BDT)"] ?? r["Fare"] ?? "").trim());
  if (!from || !to) continue;

  const hasDist = distStr !== "" && !Number.isNaN(Number(distStr)) && Number(distStr) > 0;
  if (hasDist) continue;

  if (Number.isNaN(fare)) continue;

  const lookedUp = distByPair.get(pairKey(from, to));
  if (lookedUp != null && lookedUp > 0) {
    r["Distance (km)"] = String(lookedUp);
    fromReverse++;
  } else {
    const inferred = Math.round((fare / RATE) * 10) / 10;
    r["Distance (km)"] = String(inferred);
    fromFormula++;
  }
}

const outRows = rows.map((r) => ({
  "From Point": r["From Point"]?.trim() ?? "",
  "To Point": r["To Point"]?.trim() ?? "",
  "Distance (km)": String(r["Distance (km)"] ?? r["Distance"] ?? "").trim(),
  "Fare (BDT)": String(r["Fare (BDT)"] ?? r["Fare"] ?? "").trim(),
}));

const out = Papa.unparse(outRows, {
  columns: ["From Point", "To Point", "Distance (km)", "Fare (BDT)"],
});
fs.writeFileSync(csvPath, out, "utf8");
console.log(JSON.stringify({ fromReverse, fromFormula, totalRows: outRows.length, csvPath }, null, 2));
