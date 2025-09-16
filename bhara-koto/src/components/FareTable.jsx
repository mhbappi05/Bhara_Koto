import React, { useMemo, useState } from "react";

export default function FareTable({ chart, tr }) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = term
      ? chart.filter(r =>
          (r.from || "").toLowerCase().includes(term) ||
          (r.to || "").toLowerCase().includes(term)
        )
      : chart;

    // stable sort by From, then To
    return [...filtered].sort((a, b) =>
      (a.from || "").localeCompare(b.from || "", "en") ||
      (a.to || "").localeCompare(b.to || "", "en")
    );
  }, [chart, q]);

  return (
    <div style={{ marginTop: 20, background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 18px rgba(0,0,0,.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>{tr.fareTableTitle}</h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search from/to…"
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cfd8dc", minWidth: 220 }}
        />
      </div>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <Th>{tr.colFrom}</Th>
              <Th>{tr.colTo}</Th>
              <Th align="right">{tr.colDistance}</Th>
              <Th align="right">{tr.colFare}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #eef2f7" }}>
                <Td>{r.from || "-"}</Td>
                <Td>{r.to || "-"}</Td>
                <Td align="right">{isNum(r.distanceKm) ? Number(r.distanceKm).toFixed(2) : "-"}</Td>
                <Td align="right">{isNum(r.fareBDT) ? Math.round(r.fareBDT) : "-"}</Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 14, textAlign: "center", color: "#64748b" }}>
                  No matching rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return <th style={{ textAlign: align, padding: "10px 8px", fontSize: 14 }}>{children}</th>;
}
function Td({ children, align = "left" }) {
  return <td style={{ textAlign: align, padding: "10px 8px", fontSize: 14 }}>{children}</td>;
}
const isNum = (v) => typeof v === "number" && !Number.isNaN(v);
