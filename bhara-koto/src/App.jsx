import React, { useEffect, useMemo, useState } from "react";
import { LANGS, t } from "./i18n";
import LocationSelect from "./components/LocationSelect.jsx";
import { loadBusRoutes, loadFareChart } from "./lib/data.js";
import { calcFare, findDirect, findTwoBus } from "./lib/logic.js";
import { BDT } from "./lib/utils.js";
import Footer from "./components/Footer.jsx";
import Tabs from "./components/Tabs.jsx"; // Assuming this is a horizontal tab component
import FareTable from "./components/FareTable.jsx";
import Notices from "./components/Notices.jsx";


// Reusable components
function Section({ title, children }) {
  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h3 style={{ margin: "0.75rem 0", fontSize: "1.125rem", color: "#333", fontWeight: 600 }}>{title}</h3>
      {children}
    </section>
  );
}

const card = {
  padding: "1rem",
  borderRadius: "0.875rem",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,.05)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
};

function Empty({ text }) {
  return (
    <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "#eef2f5", color: "#475569", textAlign: "center", fontStyle: "italic" }}>
      {text}
    </div>
  );
}

function Notice({ text }) {
  return (
    <div style={{ marginTop: "1rem", padding: "0.875rem", borderRadius: "0.75rem", background: "#fff3cd", color: "#7a5d00" }}>
      {text}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(LANGS.BN);
  const tr = useMemo(() => t(lang), [lang]);

  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [chart, setChart] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [student, setStudent] = useState(false);

  const [fare, setFare] = useState(null);
  const [direct, setDirect] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);

  // New state for the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { routes, stations } = await loadBusRoutes();
      setRoutes(routes);
      setStations(stations.sort());
      setChart(await loadFareChart());
      setLoaded(true);
    })();
  }, []);

  async function onGo() {
    if (!loaded) return;
    setFare(null);
    setDirect([]);
    setTransfers([]);

    const f = await calcFare({ chart, from, to, isStudent: false });
    if (f?.error) {
      setFare({ error: f.error });
      return;
    }
    setFare(f);

    const d = findDirect({ routes, from, to });
    setDirect(d);
    if (d.length === 0) setTransfers(findTwoBus({ routes, from, to }));
  }

  // Function to handle tab changes and close the menu
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setIsMenuOpen(false); // Close menu when a tab is selected
  };

  // --- Reusable Styles (Updated for Responsiveness) ---
  const containerStyle = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "sans-serif",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    flexWrap: "wrap",
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const appTitleStyle = {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    fontWeight: 800,
    color: "#333",
  };

  const taglineStyle = {
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    opacity: 0.7,
    color: "#555",
  };

  const languageButtonStyle = {
    border: "1px solid #ddd",
    background: "#f0f0f0",
    fontWeight: 700,
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    cursor: "pointer",
    padding: "0.5rem 0.75rem",
    borderRadius: 8,
    transition: "background 0.2s",
  };

  const menuButtonStyle = {
    display: "none", // Hidden by default, shown via media query
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  };

  const mainTitleContainerStyle = {
    textAlign: "center",
    marginTop: "0.5rem",
  };

  const mainTitleStyle = {
    fontSize: "clamp(3rem, 10vw, 4.5rem)",
    margin: "10px 0 4px",
    letterSpacing: 2,
    color: "#0a8f3d",
  };

  const formSectionStyle = {
    marginTop: "1rem",
    background: "#f9f9f9",
    padding: "1rem",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  };

  const goButtonStyle = {
    width: "80%",
    background: "#0a8f3d",
    color: "#fff",
    padding: "1rem 1.25rem",
    borderRadius: 28,
    fontSize: "clamp(1rem, 4vw, 1.4rem)",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(10,143,61,0.3)",
    transition: "background 0.2s, transform 0.2s",
  };

  const whatsappButtonStyle = {
    display: "inline-block",
    marginTop: "0.75rem",
    background: "#25D366",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: 24,
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
    transition: "background 0.2s",
  };

  const resultsSectionStyle = {
    marginTop: "1.5rem",
    background: "#fff",
    borderRadius: 16,
    padding: "1.25rem",
    boxShadow: "0 4px 18px rgba(0,0,0,.06)",
  };

  const resultTitleStyle = {
    marginTop: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
    borderBottom: "1px solid #eee",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  };

  const fareGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "0.75rem",
    textAlign: "center",
  };
  const fareBoxStyle = {
    background: "#f8f8f8",
    borderRadius: 12,
    padding: "1rem",
  };

  const fareLabelStyle = {
    fontWeight: 600,
    color: "#555",
    marginBottom: "0.25rem",
  };

  const fareValueStyle = {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0a8f3d",
  };

  // Styles for the mobile dropdown menu
  const mobileMenuStyle = {
    position: "absolute",
    top: "100%",
    right: "0",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
    minWidth: "150px",
    padding: "0.5rem",
    display: isMenuOpen ? "block" : "none",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const mobileMenuItemStyle = {
    padding: "0.75rem",
    background: "#f0f0f0",
    borderRadius: "6px",
    textAlign: "left",
    fontWeight: "bold",
    cursor: "pointer",
  };

  // Apply the responsive styles using a style tag or a separate CSS file
  const responsiveStyles = `
    .app-container {
      padding: 1rem;
    }
    .tabs-desktop {
      display: flex;
      justify-content: center; /* Center the tabs on desktop */
    }
    .top-bar-container {
      position: relative;
    }
    .lang-and-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .lang-button, .menu-button {
      display: block;
    }
    .tabs-mobile {
      display: none;
    }
    
    @media (max-width: 600px) {
      .app-container {
        padding: 0.5rem;
      }
      .tabs-desktop {
        display: none;
      }
      .tabs-mobile {
        display: block;
      }
      .menu-button {
        display: block !important; /* Force show the menu button */
      }
    }
  `;

  return (
    <div style={containerStyle} className="app-container">
      <style>{responsiveStyles}</style>
      {/* Top bar */}
      <div style={topBarStyle}>
        <div style={logoContainerStyle}>
          <img
            src="/logo-bharakoto.jpg"
            alt="ভাড়া কত?"
            style={{
              height: "3rem",
              width: "3rem",
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,.08)",
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={appTitleStyle}>ভাড়া কত?</div>
            <div style={taglineStyle}>{tr.tagline}</div>
          </div>
        </div>
        <div style={{ position: "relative" }} className="top-bar-container">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="lang-and-menu">
            <button
              onClick={() => setLang(lang === LANGS.BN ? LANGS.EN : LANGS.BN)}
              style={languageButtonStyle}
              aria-label="Toggle language"
              className="lang-button"
            >
              {tr.language}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={menuButtonStyle}
              className="menu-button"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
          <div style={mobileMenuStyle} className="tabs-mobile">
            <div style={mobileMenuItemStyle} onClick={() => handleTabChange("home")}>
              {tr.home}
            </div>
            <div style={mobileMenuItemStyle} onClick={() => handleTabChange("fare")}>
              {tr.fareChart}
            </div>
            <div style={mobileMenuItemStyle} onClick={() => handleTabChange("notices")}>
              {tr.notices}
            </div>
          </div>
        </div>
      </div>

      <div style={mainTitleContainerStyle}>
        <h1 style={mainTitleStyle}>{tr.title}</h1>
        <p style={{ color: "#4b5563", fontSize: "clamp(0.9rem, 3vw, 1.2rem)", marginTop: 0 }}>{tr.tagline}</p>
      </div>

      {/* Desktop Tabs */}
      <div className="tabs-desktop">
        <Tabs active={tab} onChange={setTab} tr={tr} />
      </div>

      {tab === "home" && (
        <>
          {/* Form */}
          <div style={formSectionStyle}>
            <LocationSelect
              id="from"
              label={tr.from}
              placeholder={tr.choose}
              value={from}
              onChange={setFrom}
              options={stations}
            />
            <LocationSelect
              id="to"
              label={tr.to}
              placeholder={tr.choose}
              value={to}
              onChange={setTo}
              options={stations}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={onGo} style={goButtonStyle}>
                {tr.go}
              </button>
            </div>
          </div>
          {fare && fare.error === "empty-input" && <Notice text="From/To পূরণ করুন।" />}
          {fare && fare.error === "no-source" && (
            <div style={{ marginTop: 12 }}>
              <Notice text="এই জোড়ার জন্য চার্টে ভাড়া/দূরত্ব নেই। অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।" />
              <a
                href={`https://wa.me/8801679861740?text=ভাড়া%20ডেটা%20মিসিং:%20${from}%20থেকে%20${to}`}
                target="_blank"
                rel="noopener noreferrer"
                style={whatsappButtonStyle}
              >
                📲 WhatsApp এ যোগাযোগ করুন
              </a>
            </div>
          )}
          {/* Results */}
          {fare && (
            <div style={resultsSectionStyle}>
              <h3 style={resultTitleStyle}>{tr.title}</h3>
              <div style={fareGridStyle} className="fare-grid">
                <div style={fareBoxStyle}>
                  <div style={fareLabelStyle}>{tr.standardFare}</div>
                  <div style={fareValueStyle}>{BDT(fare.standard)}</div>
                </div>
                <div style={fareBoxStyle}>
                  <div style={fareLabelStyle}>{tr.studentFare}</div>
                  <div style={fareValueStyle}>{BDT(fare.student)}</div>
                </div>
              </div>
            </div>
          )}
          <Section title={tr.directRoutes}>
            {direct.length === 0 ? (
              <Empty text={tr.noRoutes} />
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.75rem" }}>
                {direct.map((r, i) => (
                  <li key={i} style={card}>
                    <div><strong>{tr.englishBus}:</strong> {r.busEn || "-"}</div>
                    <div><strong>{tr.banglaBus}:</strong> {r.busBn || "-"}</div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section title={tr.transfers}>
            {transfers.length === 0 ? (
              <Empty text={tr.noRoutes} />
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.75rem" }}>
                {transfers.map((o, i) => (
                  <li key={i} style={card}>
                    <div><strong>A:</strong> {o.busA.busEn || "-"} / {o.busA.busBn || "-"}</div>
                    <div><strong>{tr.transferAt}:</strong> {o.transfer}</div>
                    <div><strong>B:</strong> {o.busB.busEn || "-"} / {o.busB.busBn || "-"}</div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </>
      )}
      {tab === "fare" && <FareTable chart={chart} tr={tr} />}
      {tab === "notices" && <Notices tr={tr} />}
      <Footer tr={tr} />
      <div style={{ height: "2rem" }} />
    </div>
  );
}