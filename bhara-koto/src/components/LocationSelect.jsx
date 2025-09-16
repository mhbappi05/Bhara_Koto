import React from "react";

export default function LocationSelect({ id, label, placeholder, value, onChange, options = [] }) {
  const listId = `${id}-list`;
  return (
    <div style={{ margin: "18px 0" }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 16, marginBottom: 8 }}>{label}</label>
      <input
        id={id}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "16px 18px",
          borderRadius: 12,
          border: "2px solid #cfd8dc",
          background: "#eee",
          fontSize: 18,
        }}
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  );
}
