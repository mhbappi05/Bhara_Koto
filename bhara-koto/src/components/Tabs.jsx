import React from "react";

export default function Tabs({ active, onChange, tr }) {
  const items = [
    { id: "home", label: tr.tabHome },
    { id: "fare", label: tr.tabFare },
    { id: "notices", label: tr.tabNotices },
  ];
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: `2px solid ${isActive ? "#0a8f3d" : "#cfd8dc"}`,
              background: isActive ? "#0a8f3d" : "#fff",
              color: isActive ? "#fff" : "#0a8f3d",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: 110,
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
