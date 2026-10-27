import React, { useMemo, useRef, useState } from "react";

const PAGE_SIZES = [25, 50, 100];

const isNum = (v) => typeof v === "number" && !Number.isNaN(v);

const byRoute = (a, b) =>
  (a.from || "").localeCompare(b.from || "", "en") ||
  (a.to || "").localeCompare(b.to || "", "en");

const styles = `
  .fare-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .fare-table th {
    text-align: left; padding: 12px 10px; font-size: 14px; font-weight: 600;
    color: #555; background: #f8f9fa; border-bottom: 2px solid #e9ecef;
  }
  .fare-table td { padding: 12px 10px; font-size: 14px; color: #334155; border-bottom: 1px solid #e9ecef; }
  .fare-table tbody tr:hover { background: #f0fdf4; }
  .fare-table .fare-num { text-align: right; white-space: nowrap; }
  .fare-search, .fare-select, .fare-jump {
    border: 2px solid #94a3b8; border-radius: 10px; background: #fff; color: #0f172a;
    font-size: 15px; font-family: inherit; outline: none; min-height: 40px; box-sizing: border-box;
  }
  .fare-search { padding: 8px 14px; flex: 1 1 200px; max-width: 320px; }
  .fare-select { padding: 6px 8px; }
  .fare-jump { padding: 6px 8px; width: 72px; }
  .fare-search::placeholder { color: #64748b; opacity: 1; }
  .fare-search:focus, .fare-select:focus, .fare-jump:focus {
    border-color: #0a8f3d; box-shadow: 0 0 0 3px rgba(10, 143, 61, 0.25);
  }
  @media (max-width: 600px) {
    .fare-table th, .fare-table td { padding: 10px 6px; font-size: 13px; }
    .fare-search { font-size: 16px; max-width: none; }
  }
`;

export default function FareTable({ chart, tr }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [jump, setJump] = useState("");
  const topRef = useRef(null);

  // Sort once when the data arrives, not on every keystroke
  const sorted = useMemo(() => [...chart].sort(byRoute), [chart]);

  // Every typed word must appear in the From or To name
  const rows = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return sorted;
    return sorted.filter((r) => {
      const hay = `${r.from || ""} ${r.to || ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [sorted, q]);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  const summaryText = (tr.farePaginationSummary || "Showing {start}–{end} of {total} rows")
    .replace("{start}", String(totalRows === 0 ? 0 : start + 1))
    .replace("{end}", String(start + pageRows.length))
    .replace("{total}", String(totalRows));

  const goToPage = (p) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onJump = (e) => {
    e.preventDefault();
    const n = parseInt(jump, 10);
    if (Number.isFinite(n)) goToPage(n);
    setJump("");
  };

  const pagerBtnStyle = (disabled) => ({
    padding: "8px 14px",
    minHeight: 40,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: disabled ? "#f1f5f9" : "#fff",
    color: disabled ? "#94a3b8" : "#0f172a",
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const isLoading = chart.length === 0 && q === "";

  return (
    <div
      ref={topRef}
      style={{
        marginTop: 20,
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,.08)",
        scrollMarginTop: 12,
      }}
    >
      <style>{styles}</style>

      {/* Header and search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#333" }}>{tr.fareTableTitle}</h3>
        <input
          type="search"
          className="fare-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder={tr.searchPlaceholder || "Search from/to…"}
          aria-label={tr.searchPlaceholder || "Search from/to…"}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="fare-table">
          <thead>
            <tr>
              <th>{tr.colFrom}</th>
              <th>{tr.colTo}</th>
              <th className="fare-num">{tr.colDistance}</th>
              <th className="fare-num">{tr.colFare}</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={`${start + i}-${r.from}-${r.to}`}>
                <td>{r.from || "-"}</td>
                <td>{r.to || "-"}</td>
                <td className="fare-num">{isNum(r.distanceKm) ? Number(r.distanceKm).toFixed(2) : "-"}</td>
                <td className="fare-num">{isNum(r.fareBDT) ? Math.round(r.fareBDT) : "-"}</td>
              </tr>
            ))}
            {totalRows === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 14, textAlign: "center", color: "#64748b" }}>
                  {isLoading ? tr.loadingData : tr.fareNoResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: summary, page size, pager */}
      {totalRows > 0 && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            paddingTop: 14,
            borderTop: "1px solid #e9ecef",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{summaryText}</span>
            <label style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
              {tr.fareRowsPerPage}
              <select
                className="fare-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>
              {tr.farePaginationPage || "Page"} {current} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(current - 1)}
              disabled={current <= 1}
              style={pagerBtnStyle(current <= 1)}
            >
              {tr.farePaginationPrev || "Previous"}
            </button>
            <button
              type="button"
              onClick={() => goToPage(current + 1)}
              disabled={current >= totalPages}
              style={pagerBtnStyle(current >= totalPages)}
            >
              {tr.farePaginationNext || "Next"}
            </button>
            <form onSubmit={onJump} style={{ display: "flex", gap: 6 }}>
              <input
                className="fare-jump"
                type="number"
                min={1}
                max={totalPages}
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                aria-label={tr.fareGoToPage}
                placeholder="#"
              />
              <button type="submit" style={pagerBtnStyle(false)}>
                {tr.fareJumpGo}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}