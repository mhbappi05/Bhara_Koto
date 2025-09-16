import React, { useEffect, useMemo, useState } from "react";
import { LANGS, t } from "./i18n";
import LocationSelect from "./components/LocationSelect.jsx";
import { loadBusRoutes, loadFareChart } from "./lib/data.js";
import { calcFare, findDirect, findTwoBus } from "./lib/logic.js";
import { BDT } from "./lib/utils.js";
import Footer from "./components/Footer.jsx";
import Tabs from "./components/Tabs.jsx";
import FareTable from "./components/FareTable.jsx";
import Notices from "./components/Notices.jsx";



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
  const WHATSAPP_NUMBER = "8801679861740"; // e.g., 8801712345678
  const [tab, setTab] = useState("home"); // "home" | "fare" | "notices"



  const [loaded, setLoaded] = useState(false);
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

    const f = await calcFare({ chart, from, to, isStudent: student });
    if (f?.error) {
      setFare({ error: f.error });
      return;
    }
    setFare(f);

    const d = findDirect({ routes, from, to });
    setDirect(d);
    if (d.length === 0) setTransfers(findTwoBus({ routes, from, to }));
  }


  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 18px" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo-bharakoto.jpg"   // <-- your uploaded logo
            alt="ভাড়া কত?"
            style={{
              height: 56,
              width: 56,
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>ভাড়া কত?</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>আর নয় ভাড়া নিয়ে মারামারি</div>
          </div>
        </div>

        <button
          onClick={() => setLang(lang === LANGS.BN ? LANGS.EN : LANGS.BN)}
          style={{
            border: "none",
            background: "transparent",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
          aria-label="Toggle language"
        >
          ({tr.language})
        </button>
      </div>


      {/* Title */}

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <h1 style={{ fontSize: 72, margin: "16px 0 6px", letterSpacing: 2 }}>{tr.title}</h1>
        <p style={{ color: "#4b5563", fontSize: 18, marginTop: 0 }}>{tr.tagline}</p>
      </div>

      <Tabs active={tab} onChange={setTab} tr={tr} />
      {tab === "home" && (
        <>
          {/* Form */}
          <div style={{ marginTop: 18 }}>
            <LocationSelect
              id="from"
              label={tr.from}
              placeholder={`"${tr.choose}"`}
              value={from}
              onChange={setFrom}
              options={stations}
            />

            <LocationSelect
              id="to"
              label={tr.to}
              placeholder={`"${tr.choose}"`}
              value={to}
              onChange={setTo}
              options={stations}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 24px" }}>
              <input
                id="student"
                type="checkbox"
                checked={student}
                onChange={(e) => setStudent(e.target.checked)}
              />
              <label htmlFor="student">{tr.student}</label>
            </div>

            <button
              onClick={onGo}
              style={{
                width: "100%",
                background: "#0a8f3d",
                color: "#fff",
                padding: "18px 24px",
                borderRadius: 28,
                fontSize: 22,
                border: "none",
                cursor: "pointer",
              }}
            >
              {tr.go}
            </button>
          </div>

          {fare && fare.error === "empty-input" && (
            <Notice text="From/To পূরণ করুন।" />
          )}

          {fare && fare.error === "no-source" && (
            <div style={{ marginTop: 16 }}>
              <Notice text="এই জোড়ার জন্য চার্টে ভাড়া/দূরত্ব নেই। অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।" />
              <a
                href={`https://wa.me/8801679861740?text=ভাড়া%20ডেটা%20মিসিং:%20${from}%20থেকে%20${to}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  background: "#25D366",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: 24,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                📲 WhatsApp এ যোগাযোগ করুন
              </a>
            </div>
          )}



          {/* Results */}
          {fare && (
            <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,.06)" }}>
              <h3 style={{ marginTop: 0 }}>{tr.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{tr.standardFare}</div>
                  <div style={{ fontSize: 28 }}>{BDT(fare.standard)}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{tr.studentFare}</div>
                  <div style={{ fontSize: 28 }}>{BDT(fare.student)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Direct routes */}
          <Section title={tr.directRoutes}>
            {direct.length === 0 ? (
              <Empty text={tr.noRoutes} />
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {direct.map((r, i) => (
                  <li key={i} style={card}>
                    <div><strong>{tr.englishBus}:</strong> {r.busEn || "-"}</div>
                    <div><strong>{tr.banglaBus}:</strong> {r.busBn || "-"}</div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Two-bus transfers */}
          <Section title={tr.transfers}>
            {transfers.length === 0 ? (
              <Empty text={tr.noRoutes} />
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
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

      {tab === "fare" && (
        <FareTable chart={chart} tr={tr} />
      )}

      {tab === "notices" && (
        <Notices tr={tr} />
      )}


      <Footer tr={tr} />

      <div style={{ height: 32 }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ margin: "12px 0" }}>{title}</h3>
      {children}
    </section>
  );
}

const card = {
  padding: 14,
  borderRadius: 14,
  background: "#fff",
  boxShadow: "0 2px 12px rgba(0,0,0,.05)",
};

function Empty({ text }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#f1f5f9", color: "#475569" }}>
      {text}
    </div>
  );
}

function Notice({ text }) {
  return (
    <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "#fff3cd", color: "#7a5d00" }}>
      {text}
    </div>
  );
}
