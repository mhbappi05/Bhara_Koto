import React from "react";

export default function AboutPage({ tr }) {
  // Styles for the About page
  const pageContainerStyle = {
    padding: "2rem",
    lineHeight: 1.6,
    color: "#333",
    backgroundColor: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 4px 18px rgba(0,0,0,.06)",
    marginTop: "1.5rem",
  };

  const sectionHeadingStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0a8f3d",
    marginBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.5rem",
  };

  const paragraphStyle = {
    marginBottom: "1.25rem",
    fontSize: "1rem",
  };

  const teamListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const linkStyle = {
    color: "#0d9488",
    fontWeight: 600,
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  return (
    <div style={pageContainerStyle}>
      <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "2rem", color: "#1f2937" }}>
        {tr.aboutPageTitle}
      </h2>

      <h3 style={sectionHeadingStyle}>{tr.aboutSectionTitle}</h3>
      <p style={paragraphStyle}>{tr.aboutDescription}</p>

      <h3 style={sectionHeadingStyle}>{tr.featuresSectionTitle}</h3>
      <p style={paragraphStyle}>
        <strong>{tr.featureFareCalculation}</strong> {tr.featureFareDescription}
      </p>
      <p style={paragraphStyle}>
        <strong>{tr.featureRoutePlanning}</strong> {tr.featureRouteDescription}
      </p>
      <p style={paragraphStyle}>
        <strong>{tr.featureLocalization}</strong> {tr.featureLocalizationDescription}
      </p>
      <p style={paragraphStyle}>
        <strong>{tr.featureData}</strong> {tr.featureDataDescription}
      </p>

      <h3 style={sectionHeadingStyle}>{tr.teamSectionTitle}</h3>
      <ul style={teamListStyle}>
        <li>
          <strong>{tr.designerLabel}:</strong> {tr.designerName}
        </li>
        <li>
          <strong>{tr.developerLabel}:</strong> {tr.developerName}
        </li>
      </ul>
    </div>
  );
}