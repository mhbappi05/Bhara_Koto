import React from "react";

export default function Tabs({ active, onChange, tr }) {
  const items = [
    { id: "home", label: tr.tabHome },
    { id: "fare", label: tr.tabFare },
    { id: "notices", label: tr.tabNotices },
  ];
  return (
    <nav
      aria-label="Main"
      style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}
    >
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            type="button"
            className="tab-btn"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(it.id)}
            style={{
              padding: "10px 16px",
              minHeight: 44,
              minWidth: 110,
              borderRadius: 999,
              border: `2px solid ${isActive ? "#0a8f3d" : "#cfd8dc"}`,
              background: isActive ? "#0a8f3d" : "#fff",
              color: isActive ? "#fff" : "#0a8f3d",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}