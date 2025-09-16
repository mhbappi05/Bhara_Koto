import React from "react";

export default function Notices({ tr }) {
  const notices = [
    { date: "2025-09-10", text: "Initial beta release with fare chart & direct routes." },
    { date: "2025-09-15", text: "Two-bus transfer suggestions added." },
    { date: "2025-09-17", text: "WhatsApp button when fare is missing in chart." },
  ];
  return (
    <div style={{ marginTop: 20, background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 18px rgba(0,0,0,.06)" }}>
      <h3 style={{ marginTop: 0 }}>{tr.noticesTitle}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {notices.map((n, i) => (
          <li key={i} style={{ padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>{n.date}</div>
            <div style={{ fontSize: 15, marginTop: 4 }}>{n.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
