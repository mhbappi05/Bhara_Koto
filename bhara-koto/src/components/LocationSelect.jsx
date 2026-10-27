import React from "react";

export default function LocationSelect({ id, label, placeholder, value, onChange, options = [] }) {
  const listId = `${id}-list`;

  const styles = `
    .location-select-container {
      max-width: 750px;
      margin: 1rem auto;
    }
    .location-select-label {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.5rem;
    }
    .location-select-input {
      width: 100%;
      box-sizing: border-box;
      min-height: 48px;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      font-family: inherit;
      color: #0f172a;
      background: #ffffff;
      border: 2px solid #94a3b8;
      border-radius: 12px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .location-select-input::placeholder {
      color: #64748b;
      opacity: 1;
    }
    .location-select-input:hover {
      border-color: #64748b;
    }
    .location-select-input:focus {
      border-color: #0a8f3d;
      box-shadow: 0 0 0 3px rgba(10, 143, 61, 0.25);
    }
    @media (max-width: 600px) {
      .location-select-container {
        margin: 0.5rem auto;
      }
      .location-select-input {
        padding: 0.75rem;
        font-size: 16px;
      }
    }
  `;

  return (
    <div className="location-select-container">
      <style>{styles}</style>
      <label htmlFor={id} className="location-select-label">
        {label}
      </label>
      <input
        id={id}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="location-select-input"
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  );
}