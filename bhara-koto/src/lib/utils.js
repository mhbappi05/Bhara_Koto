export const BDT = (n) => `${Math.round(n)} ৳`;

export const normalize = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const unique = (arr) => Array.from(new Set(arr));
