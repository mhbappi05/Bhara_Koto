import React, { useMemo, useState } from "react";

export default function FareTable({ chart, tr }) {
  const [q, setQ] = useState("");

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

  const placeholder = tr.searchPlaceholder || "Search from/to…";

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
            {rows.map((r, i) => (
              <tr key={i} style={tableRowStyle}>
                <Td>{r.from || "-"}</Td>
                <Td>{r.to || "-"}</Td>
                <Td align="right">{isNum(r.distanceKm) ? Number(r.distanceKm).toFixed(2) : "-"}</Td>
                <Td align="right">{isNum(r.fareBDT) ? Math.round(r.fareBDT) : "-"}</Td>
              </tr>
            ))}
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