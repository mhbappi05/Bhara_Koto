import React from "react";

export default function LocationSelect({ id, label, placeholder, value, onChange, options = [] }) {
  const listId = `${id}-list`;

  // Define responsive styles using a style tag
  const responsiveStyles = `
    .location-select-container {
      margin: 1rem auto;
    }
    .location-select-label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .location-select-input {
      padding: 1rem 1.125rem;
      font-size: 1rem;
    }
    @media (max-width: 600px) {
      .location-select-input {
        padding: 0.75rem 0.5rem;
        font-size: 0.9rem;
      }
      .location-select-container {
        margin: 0.5rem auto;
      }
    }
  `;

  return (
    <div style={{ maxWidth: 750, display: "block" }} className="location-select-container">
      <style>{responsiveStyles}</style>
      <label
        htmlFor={id}
        style={{ display: "block", color: "#4a5568", fontWeight: 500 }}
        className="location-select-label"
      >
        {label}
      </label>
      <input
        id={id}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "95%",
          borderRadius: 12,
          border: "2px solid #e2e8f0",
          background: "#f9f9f9",
          color: "#000000",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
        className="location-select-input"
        onFocus={(e) => {
          e.target.style.borderColor = "#4299e1";
          e.target.style.boxShadow = "0 0 0 2px rgba(66, 153, 225, 0.5)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
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