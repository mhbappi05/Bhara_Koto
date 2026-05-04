import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 25;

export default function FareTable({ chart, tr }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = term
      ? chart.filter(
          (r) =>
            (r.from || "").toLowerCase().includes(term) ||
            (r.to || "").toLowerCase().includes(term)
        )
      : chart;

    // stable sort by From, then To
    return [...filtered].sort(
      (a, b) =>
        (a.from || "").localeCompare(b.from || "", "en") ||
        (a.to || "").localeCompare(b.to || "", "en")
    );
  }, [chart, q]);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE) || 1);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const summaryStart = totalRows === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const summaryEnd = totalRows === 0 ? 0 : Math.min(page * PAGE_SIZE, totalRows);
  const summaryText = (tr.farePaginationSummary || "Showing {start}–{end} of {total} rows")
    .replace("{start}", String(summaryStart))
    .replace("{end}", String(summaryEnd))
    .replace("{total}", String(totalRows));

  const placeholder = tr.searchPlaceholder || "Search from/to…";

  const pagerBtnStyle = (disabled) => ({
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: disabled ? "#f1f5f9" : "#fff",
    color: disabled ? "#94a3b8" : "#0f172a",
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div
      style={{
        marginTop: 20,
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,.08)",
      }}
    >
      {/* Header and Search */}
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
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#333" }}>
          {tr.fareTableTitle}
        </h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            minWidth: 150, // Shortened the minimum width
            fontSize: 15,
            flexGrow: 0, // Prevents the input from growing
          }}
        />
      </div>

      {/* Responsive Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <Th>{tr.colFrom}</Th>
              <Th>{tr.colTo}</Th>
              <Th align="right">{tr.colDistance}</Th>
              <Th align="right">{tr.colFare}</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => {
              const rowKey = `${(page - 1) * PAGE_SIZE + i}-${r.from}-${r.to}`;
              return (
                <tr key={rowKey} style={tableRowStyle}>
                  <Td>{r.from || "-"}</Td>
                  <Td>{r.to || "-"}</Td>
                  <Td align="right">{isNum(r.distanceKm) ? Number(r.distanceKm).toFixed(2) : "-"}</Td>
                  <Td align="right">{isNum(r.fareBDT) ? Math.round(r.fareBDT) : "-"}</Td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 14, textAlign: "center", color: "#64748b" }}>
                  {tr.noRoutes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{summaryText}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>
              {tr.farePaginationPage || "Page"} {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={pagerBtnStyle(page <= 1)}
              aria-label={tr.farePaginationPrev || "Previous"}
            >
              {tr.farePaginationPrev || "Previous"}
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={pagerBtnStyle(page >= totalPages)}
              aria-label={tr.farePaginationNext || "Next"}
            >
              {tr.farePaginationNext || "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable components and styles for cleanliness
function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "12px 10px",
        fontSize: 14,
        fontWeight: 600,
        color: "#555",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "12px 10px",
        fontSize: 14,
        color: "#444",
      }}
    >
      {children}
    </td>
  );
}

const isNum = (v) => typeof v === "number" && !Number.isNaN(v);

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
};

const tableHeaderRowStyle = {
  background: "#f8f9fa",
  borderBottom: "2px solid #e9ecef",
};

const tableRowStyle = {
  borderBottom: "1px solid #e9ecef",
  transition: "background 0.2s ease",
  ":hover": {
    background: "#f0f2f5",
  },
};