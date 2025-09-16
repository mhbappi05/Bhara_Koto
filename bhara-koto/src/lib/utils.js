export const BDT = (n) => `${Math.round(n)} ৳`;

export const normalize = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const unique = (arr) => Array.from(new Set(arr));

export const hasApiKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/** Ask Google Distance Matrix using place text (e.g., "Dhaka, Mirpur 10") */
export async function googleDistanceKm(from, to) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const params = new URLSearchParams({
    origins: `Dhaka, ${from}`,
    destinations: `Dhaka, ${to}`,
    key,
    units: "metric",
  });
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const row = data?.rows?.[0]?.elements?.[0];
  if (row?.status !== "OK") return null;
  return row.distance.value / 1000; // km
}
