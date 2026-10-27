import React, { useEffect, useMemo, useState } from "react";
import { LANGS, t } from "./i18n";
import LocationSelect from "./components/LocationSelect.jsx";
import { loadBusRoutes, loadFareChart } from "./lib/data.js";
import { calcFare, estimateFareByDistance, findDirect, findTwoBus, ZERO_FARE_REASON } from "./lib/logic.js";
import { BDT } from "./lib/utils.js";
import Footer from "./components/Footer.jsx";
import Tabs from "./components/Tabs.jsx"; // Assuming this is a horizontal tab component
import FareTable from "./components/FareTable.jsx";
import Notices from "./components/Notices.jsx";
import RouteMapPicker from "./components/RouteMapPicker.jsx";

const MAJOR_UPDATE_DISMISS_KEY = "bhara-koto-major-update-dismissed";

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
  // const [student, setStudent] = useState(false);

  const [fare, setFare] = useState(null);
  const [direct, setDirect] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [mapMode, setMapMode] = useState(false);

  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);

  // New state for the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showMajorUpdateBanner, setShowMajorUpdateBanner] = useState(() => {
    try {
      return globalThis.localStorage?.getItem(MAJOR_UPDATE_DISMISS_KEY) !== "1";
    } catch {
      return true;
    }
  });

  function dismissMajorUpdate() {
    try {
      globalThis.localStorage?.setItem(MAJOR_UPDATE_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShowMajorUpdateBanner(false);
  }

  useEffect(() => {
    (async () => {
      const { routes, stations } = await loadBusRoutes();
      setRoutes(routes);
      setStations(stations.sort());
      setChart(await loadFareChart());
      setLoaded(true);
    })();
  }, []);

  function clearResults() {
    setFare(null);
    setDirect([]);
    setTransfers([]);
    setSearched(false);
  }

  async function onGo() {
    if (!loaded) return;
    clearResults();                                  // replaces setFare(null); setDirect([]); setTransfers([]);

    const f = await calcFare({ chart, from, to });
    if (f?.error) {
      setFare({ error: f.error });
      return;
    }
    setFare(f);

    const d = findDirect({ routes, from, to });
    setDirect(d);
    if (d.length === 0) setTransfers(findTwoBus({ routes, from, to }));
    setSearched(true);                               // new
  }

  function onMapRouteReady(route) {
    setDirect([]);
    setTransfers([]);
    if (!route) {
      setFare(null);
      return;
    }

    const mappedFare = estimateFareByDistance(route.distanceKm);
    if (!mappedFare) {
      setFare({ error: "no-source" });
      return;
    }

    setFrom(route.fromLabel);
    setTo(route.toLabel);
    setFare({
      ...mappedFare,
      usedPredefined: false,
      mapDistanceKm: route.distanceKm,
    });
  }

  // Function to handle tab changes and close the menu
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setIsMenuOpen(false); // Close menu when a tab is selected
  };

  const switchMode = (toMap) => {
    if (toMap === mapMode) return;
    setMapMode(toMap);
    clearResults();
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

  const formSectionStyle = {
    marginTop: "1rem",
    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    padding: "1.1rem",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  };

  const goButtonStyle = {
    width: "100%",
    maxWidth: 750,
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

  const segmentWrapStyle = {
    display: "flex",
    gap: 4,
    padding: 4,
    background: "#e2e8f0",
    borderRadius: 14,
    marginBottom: "0.5rem",
  };

  const segmentStyle = (active) => ({
    flex: 1,
    minHeight: 44,
    border: "none",
    borderRadius: 10,
    padding: "0.7rem 0.5rem",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    background: active ? "#0a8f3d" : "transparent",
    color: active ? "#ffffff" : "#334155",
    boxShadow: active ? "0 4px 10px rgba(10, 143, 61, 0.25)" : "none",
  });

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

  const zeroFareBannerStyle = {
    marginTop: 0,
    marginBottom: "1rem",
    padding: "0.75rem 1rem",
    borderRadius: 12,
    background: "#e0f2fe",
    color: "#0c4a6e",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    fontWeight: 600,
    border: "1px solid #bae6fd",
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
            <h1 style={{ ...appTitleStyle, margin: 0 }}>{tr.title}</h1>
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

      {/* Desktop Tabs */}
      <div className="tabs-desktop">
        <Tabs active={tab} onChange={setTab} tr={tr} />
      </div>

      {showMajorUpdateBanner && (
        <div
          role="region"
          aria-label={tr.majorUpdateBannerTitle}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem 0.75rem",
            margin: "0.5rem 0 0.25rem",
            padding: "0.5rem 0.5rem 0.5rem 0.75rem",
            borderRadius: 12,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "#047857",
              background: "#a7f3d0",
              padding: "0.15rem 0.5rem",
              borderRadius: 6,
              whiteSpace: "nowrap",
            }}
          >
            {tr.majorUpdateBadge}
          </span>
          <span
            style={{ flex: "1 1 14rem", fontWeight: 700, color: "#065f46", fontSize: "0.92rem", lineHeight: 1.35 }}
          >
            {tr.majorUpdateBannerTitle}
          </span>
          <button
            type="button"
            onClick={() => handleTabChange("notices")}
            style={{
              border: "none",
              background: "transparent",
              color: "#047857",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "underline",
              cursor: "pointer",
              padding: "0.4rem 0.25rem",
              minHeight: 36,
            }}
          >
            {tr.majorUpdateReadNotices}
          </button>
          <button
            type="button"
            onClick={dismissMajorUpdate}
            aria-label={tr.majorUpdateDismissAria}
            style={{
              border: "none",
              background: "transparent",
              color: "#047857",
              fontSize: "1.35rem",
              lineHeight: 1,
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>
      )}

      {tab === "home" && (
        <>
          {/* Form */}
          <div style={formSectionStyle}>
            <div style={segmentWrapStyle} role="group" aria-label={tr.title}>
              <button
                type="button"
                style={segmentStyle(!mapMode)}
                aria-pressed={!mapMode}
                onClick={() => switchMode(false)}
              >
                {tr.modeStation}
              </button>
              <button
                type="button"
                style={segmentStyle(mapMode)}
                aria-pressed={mapMode}
                onClick={() => switchMode(true)}
              >
                {tr.modeMap}
              </button>
            </div>
            <p style={{ margin: "0 0 0.9rem", color: "#475569", fontSize: "0.9rem", textAlign: "center" }}>
              {mapMode
                ? (tr.mapModeCardHint || "Click two points on the map to calculate route distance and fare.")
                : (tr.searchModeCardHint || "Select from and to stations to get fare and matching bus routes.")}
            </p>


            {!mapMode && (
              <>
                <LocationSelect
                  id="from"
                  label={tr.from}
                  placeholder={tr.choose}
                  value={from}
                  onChange={(v) => { setFrom(v); clearResults(); }}
                  options={stations}
                />
                <LocationSelect
                  id="to"
                  label={tr.to}
                  placeholder={tr.choose}
                  value={to}
                  onChange={(v) => { setTo(v); clearResults(); }}
                  options={stations}
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button onClick={onGo} style={goButtonStyle}>
                    {tr.go}
                  </button>
                </div>
              </>
            )}

            {mapMode && (
              <div style={{ marginTop: "0.9rem" }}>
                <RouteMapPicker tr={tr} onRouteReady={onMapRouteReady} />
              </div>
            )}
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
          {fare && !fare.error && (
            <div style={resultsSectionStyle}>
              <h3 style={resultTitleStyle}>{tr.title}</h3>
              {fare.zeroFareReason === ZERO_FARE_REASON.SAME_STATION && (
                <div style={zeroFareBannerStyle} role="status">
                  {tr.zeroFareSameStation}
                </div>
              )}
              {fare.zeroFareReason === ZERO_FARE_REASON.UNDER_1_KM && (
                <div style={zeroFareBannerStyle} role="status">
                  {tr.zeroFareUnder1km}
                </div>
              )}
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
              {fare.mapDistanceKm && (
                <p style={{ marginBottom: 0, color: "#334155", marginTop: "0.75rem", fontWeight: 600 }}>
                  {(tr.colDistance || "Distance (km)")} : {fare.mapDistanceKm.toFixed(2)} km
                </p>
              )}
            </div>
          )}
          {!mapMode && searched && (
            <>
              <Section title={tr.directRoutes}>
                {direct.length === 0 ? (
                  <Empty text={tr.noRoutes} />
                ) : (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.75rem" }}>
                    {direct.map((r, i) => (
                      <li key={i} style={card}>
                        <div><strong>{tr.englishBus}:</strong> {r.busEn || "-"}</div>
                        {r.busBn && <div><strong>{tr.banglaBus}:</strong> {r.busBn}</div>}
                        {/* <div><strong>{tr.banglaBus}:</strong> {r.busBn || "-"}</div> */}
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
                        <div><strong>A:</strong> {[o.busA.busEn, o.busA.busBn].filter(Boolean).join(" / ") || "-"}</div>
                        <div><strong>{tr.transferAt}:</strong> {o.transfer}</div>
                        <div><strong>B:</strong> {[o.busB.busEn, o.busB.busBn].filter(Boolean).join(" / ") || "-"}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </>
          )}
        </>
      )}
      {tab === "fare" && <FareTable chart={chart} tr={tr} />}
      {tab === "notices" && <Notices tr={tr} />}
      <Footer tr={tr} />
      <div style={{ height: "2rem" }} />
    </div>
  );
}