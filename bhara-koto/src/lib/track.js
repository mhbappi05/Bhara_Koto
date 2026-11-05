// Anonymous usage tracking.
// Sends small events to a private Google Sheet (through a Google Apps Script).
// No cookies, no IP address, no names or locations. Respects "Do Not Track".
//
// Things you can do in the browser console on the live site:
//   localStorage.setItem("bk_ignore", "1")   -> stop counting your own visits on this browser
//   localStorage.removeItem("bk_ignore")     -> count them again
// While developing on localhost nothing is sent, unless you run:
//   localStorage.setItem("bk_force", "1")    -> send from localhost too (for testing)

const TRACK_URL =
  "https://script.google.com/macros/s/AKfycbwLJIZmWZRo866BEzISbuZgOgaid90-2dYJeHUTpFTxfHkQBFzzFJb_aY_iQrGsUhG1KA/exec";

const VISITOR_KEY = "bk_visitor"; // random id kept in this browser (localStorage)
const SESSION_KEY = "bk_session"; // random id for this visit (sessionStorage)

function newId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // fall through to the simple id below
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getId(storage, key) {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = newId();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return "no-storage"; // storage blocked (private mode, etc.)
  }
}

function flag(name) {
  try {
    return localStorage.getItem(name) === "1";
  } catch {
    return false;
  }
}

function deviceType() {
  const w = window.innerWidth;
  if (w < 600) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function referrerHost() {
  try {
    if (!document.referrer) return "direct";
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? "" : host;
  } catch {
    return "";
  }
}

function doNotTrack() {
  return (
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1" ||
    navigator.globalPrivacyControl === true
  );
}

/**
 * track("fare_search", { mode, from, to, result })
 * Events the receiver accepts: page_view, tab_change, fare_search, map_route.
 * Never throws and never blocks the app.
 */
export function track(event, fields = {}) {
  try {
    if (!TRACK_URL || doNotTrack() || flag("bk_ignore")) return;

    const payload = {
      event,
      visitor_id: getId(localStorage, VISITOR_KEY),
      session_id: getId(sessionStorage, SESSION_KEY),
      lang: document.documentElement.lang || "bn",
      device: deviceType(),
      ...fields,
    };
    if (event === "page_view") payload.referrer = referrerHost();

    const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLocal && !flag("bk_force")) {
      console.debug("[track] (not sent on localhost)", payload);
      return;
    }

    fetch(TRACK_URL, {
      method: "POST",
      mode: "no-cors", // we only send; the answer is not needed
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // tracking must never break the site
  }
}