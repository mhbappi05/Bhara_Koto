import React, { useState } from "react";

export default function Notices({ tr }) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const notices = [
    {
      date: "2025-09-19",
      text: tr.notice1Text,
      link: "https://brta.gov.bd/site/page/2c13b3f1-d5ec-4405-a146-825a14fb3877/Public-Bus-Fare-of-Dhaka-Metro",
      linkText: tr.notice1Link,
    },
    {
      date: "2025-09-19",
      text: tr.notice2Text,
      link: "https://wa.me/8801679861740",
      linkText: tr.notice2Link,
    },
    {
      date: "2025-09-19",
      text: tr.notice3Text,
    },
    {
      date: "2025-09-19",
      text: tr.notice4Text,
      buttonAction: () => setShowPaymentInfo(true),
      buttonText: tr.notice4Link,
    },
    {
      date: "2025-09-19",
      text: tr.notice5Text,
    },
    {
      date: "2025-09-19",
      text: tr.notice6Text,
      link: "https://wa.me/8801679861740",
      linkText: tr.notice2Link,
    },
    {
      date: "2025-09-19",
      text: tr.notice7Text,
    },
    {
      date: "2025-09-19",
      text: tr.notice8Text,
    },
    {
      date: "2025-09-19",
      text: tr.notice9Text,
      link: "https://wa.me/8801679861740",
      linkText: tr.notice2Link,
    },
  ];

  const paymentDetails = {
    bkash: "01679861740",
    nagad: "01679861740",
    rocket: "01679861740",
  };

  return (
    <div style={{
      marginTop: 20,
      background: "#fff",
      borderRadius: 16,
      padding: "24px 20px",
      boxShadow: "0 8px 30px rgba(0,0,0,.08)",
    }}>
      <h3 style={{ marginTop: 0, fontSize: 22, color: "#333", fontWeight: 600, borderBottom: "1px solid #e5e5e5", paddingBottom: 10, marginBottom: 20 }}>{tr.noticesTitle}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 15 }}>
        {notices.map((n, i) => (
          <li
            key={i}
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#fafafa",
              border: "1px solid #ededed",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: 13, color: "#777", fontWeight: 500 }}>{n.date}</div>
            <div style={{ fontSize: 16, marginTop: 8, lineHeight: 1.5, color: "#444" }}>
              {n.text}
              {n.link && (
                <a
                  href={n.link}
                  style={{ color: "#3182CE", textDecoration: "none", fontWeight: 600, marginLeft: 4 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {n.linkText}
                </a>
              )}
              {n.buttonAction && (
                <button
                  onClick={n.buttonAction}
                  style={{
                    marginLeft: 5,
                    border: "1px solid #3182CE",
                    background: "#3182CE",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#2b6cb0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#3182CE"}
                >
                  {n.buttonText}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showPaymentInfo && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: 12, textAlign: "center", position: "relative", maxWidth: "90%", boxShadow: "0 10px 30px rgba(0,0,0,.2)" }}>
            <button onClick={() => setShowPaymentInfo(false)} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#666" }}>&times;</button>
            <h4 style={{ fontSize: 20, margin: "0 0 15px", color: "#444" }}>{tr.paymentTitle}</h4>
            <p style={{ margin: "0 0 20px", color: "#666" }}>{tr.paymentInfoText}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}><strong>bKash:</strong> {paymentDetails.bkash}</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}><strong>Nagad:</strong> {paymentDetails.nagad}</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#333" }}><strong>Rocket:</strong> {paymentDetails.rocket}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}