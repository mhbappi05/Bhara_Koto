import React, { useEffect, useState } from "react";

const WHATSAPP = "https://wa.me/8801679861740";
const BRTA_URL =
  "https://brta.gov.bd/site/page/2c13b3f1-d5ec-4405-a146-825a14fb3877/Public-Bus-Fare-of-Dhaka-Metro";

const PAYMENT_DETAILS = {
  bkash: "01679861740",
  nagad: "01679861740",
  rocket: "01679861740",
};

function formatDate(iso, locale) {
  const d = new Date(`${iso}T00:00:00+06:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default function Notices({ tr, locale = "en-GB" }) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  useEffect(() => {
    if (!showPaymentInfo) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowPaymentInfo(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPaymentInfo]);

  // Newest first
  const updates = [
    { date: "2026-05-05", text: tr.noticeDomainLiveText, link: "https://bharakoto.app", linkText: tr.noticeDomainLiveLink },
    { date: "2026-05-05", text: tr.noticeMajorUpdateText },
  ];

  // Most important facts first, support last
  const info = [
    { text: tr.notice2Text, link: WHATSAPP, linkText: tr.notice2Link }, // fares may differ
    { text: tr.notice3Text }, // toll buses
    { text: tr.notice1Text, link: BRTA_URL, linkText: tr.notice1Link }, // data source
    { text: tr.notice5Text }, // volunteer project, not affiliated
    { text: tr.notice7Text }, // more features planned
    { text: tr.notice8Text }, // built with love
    { text: tr.notice6Text, link: WHATSAPP, linkText: tr.notice2Link }, // questions / suggestions
    { text: tr.notice9Text, link: WHATSAPP, linkText: tr.notice2Link }, // ads
    { text: tr.notice4Text, buttonAction: () => setShowPaymentInfo(true), buttonText: tr.notice4Link }, // coffee
  ];

  const pageStyle = {
    marginTop: 20,
    background: "#fff",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 8px 30px rgba(0,0,0,.08)",
  };
  const sectionTitleStyle = {
    margin: "0 0 12px",
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
  };
  const listStyle = { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 };
  const cardStyle = (highlight) => ({
    padding: "14px 16px",
    borderRadius: 12,
    background: highlight ? "#ecfdf5" : "#f8fafc",
    border: highlight ? "1px solid #6ee7b7" : "1px solid #e2e8f0",
    fontSize: 16,
    lineHeight: 1.6,
    color: "#334155",
  });
  const linkStyle = { color: "#047857", fontWeight: 700, textDecoration: "underline", marginLeft: 4 };

  const renderBody = (n) => (
    <>
      {n.text}
      {n.link && (
        <a href={n.link} style={linkStyle} target="_blank" rel="noopener noreferrer">
          {n.linkText}
        </a>
      )}
      {n.buttonAction && (
        <button
          type="button"
          onClick={n.buttonAction}
          style={{
            marginLeft: 8,
            border: "none",
            background: "#0a8f3d",
            color: "#fff",
            padding: "8px 14px",
            minHeight: 36,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {n.buttonText}
        </button>
      )}
    </>
  );

  return (
    <div style={pageStyle}>
      <h3
        style={{
          marginTop: 0,
          fontSize: 22,
          color: "#333",
          fontWeight: 600,
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: 10,
          marginBottom: 20,
        }}
      >
        {tr.noticesTitle}
      </h3>

      <h4 style={sectionTitleStyle}>{tr.noticesUpdatesTitle}</h4>
      <ul style={{ ...listStyle, marginBottom: 28 }}>
        {updates.map((n, i) => (
          <li key={i} style={cardStyle(true)}>
            <div style={{ fontSize: 13, color: "#047857", fontWeight: 700, marginBottom: 4 }}>
              {formatDate(n.date, locale)}
            </div>
            {renderBody(n)}
          </li>
        ))}
      </ul>

      <h4 style={sectionTitleStyle}>{tr.noticesInfoTitle}</h4>
      <ul style={listStyle}>
        {info.map((n, i) => (
          <li key={i} style={cardStyle(false)}>
            {renderBody(n)}
          </li>
        ))}
      </ul>

      {showPaymentInfo && (
        <div
          onClick={() => setShowPaymentInfo(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={tr.paymentTitle}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              textAlign: "center",
              position: "relative",
              maxWidth: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,.2)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowPaymentInfo(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#666",
              }}
            >
              &times;
            </button>
            <h4 style={{ fontSize: 20, margin: "0 0 15px", color: "#444" }}>{tr.paymentTitle}</h4>
            <p style={{ margin: "0 0 20px", color: "#666" }}>{tr.paymentInfoText}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}>
                <strong>bKash:</strong> {PAYMENT_DETAILS.bkash}
              </p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}>
                <strong>Nagad:</strong> {PAYMENT_DETAILS.nagad}
              </p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}>
                <strong>Rocket:</strong> {PAYMENT_DETAILS.rocket}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}