import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const DHAKA_CENTER = [23.8103, 90.4125];
const DHAKA_DIVISION_BOUNDS = [
  [23.0, 89.5], // south-west
  [24.9, 91.4], // north-east
];
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng);
    },
  });
  return null;
}

function MapFlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    const { lat, lng, zoom } = target;
    map.flyTo([lat, lng], zoom ?? 15, { duration: 0.55 });
  }, [target, map]);
  return null;
}

async function searchPlaces(query) {
  const q = query.trim();
  if (!q) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=bd&limit=8&q=${encodeURIComponent(q)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("search-failed");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function getRouteBetweenPoints(fromPoint, toPoint) {
  const from = `${fromPoint.lng},${fromPoint.lat}`;
  const to = `${toPoint.lng},${toPoint.lat}`;
  const url = `${OSRM_BASE_URL}/${from};${to}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) return null;

  const distanceKm = route.distance / 1000;
  const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  return { distanceKm, coordinates };
}

async function reverseGeocode(point) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  return data?.display_name || null;
}

export default function RouteMapPicker({ tr, onRouteReady }) {
  const [fromPoint, setFromPoint] = useState(null);
  const [toPoint, setToPoint] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchError, setMapSearchError] = useState("");
  const [flyToTarget, setFlyToTarget] = useState(null);

  const markers = useMemo(() => {
    if (!fromPoint && !toPoint) return [];
    return [
      fromPoint ? { key: "from", position: [fromPoint.lat, fromPoint.lng] } : null,
      toPoint ? { key: "to", position: [toPoint.lat, toPoint.lng] } : null,
    ].filter(Boolean);
  }, [fromPoint, toPoint]);

  const clearRoute = () => {
    setFromPoint(null);
    setToPoint(null);
    setRoutePoints([]);
    setStatus("");
    setLoading(false);
    setMapSearchResults([]);
    setMapSearchError("");
    onRouteReady(null);
  };

  async function runMapSearch() {
    setMapSearchError("");
    setMapSearchResults([]);
    const q = mapSearchQuery.trim();
    if (!q) return;
    setMapSearchLoading(true);
    try {
      const results = await searchPlaces(q);
      setMapSearchResults(results);
      if (results.length === 0) {
        setMapSearchError(tr.mapSearchNoResults || "No places found");
      }
    } catch {
      setMapSearchError(tr.mapSearchFailed || "Search failed");
    } finally {
      setMapSearchLoading(false);
    }
  }

  function onPickSearchResult(item) {
    const lat = Number(item.lat);
    const lng = Number(item.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    setFlyToTarget({ lat, lng, zoom: 16, id: `${lat},${lng},${Date.now()}` });
    setMapSearchResults([]);
    setMapSearchError("");
  }

  const handlePointPick = async (point) => {
    if (!fromPoint || (fromPoint && toPoint)) {
      setFromPoint(point);
      setToPoint(null);
      setRoutePoints([]);
      setStatus("Pick destination point");
      onRouteReady(null);
      return;
    }

    setToPoint(point);
    setLoading(true);
    setStatus("Calculating route...");
    const route = await getRouteBetweenPoints(fromPoint, point);
    if (!route) {
      setLoading(false);
      setStatus("Could not calculate route. Try nearby points.");
      onRouteReady(null);
      return;
    }

    setRoutePoints(route.coordinates);
    const [fromName, toName] = await Promise.all([
      reverseGeocode(fromPoint),
      reverseGeocode(point),
    ]);
    setLoading(false);
    setStatus(`Distance: ${route.distanceKm.toFixed(2)} km`);
    onRouteReady({
      distanceKm: route.distanceKm,
      fromLabel: fromName || `${fromPoint.lat.toFixed(5)}, ${fromPoint.lng.toFixed(5)}`,
      toLabel: toName || `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
    });
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "0.85rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.55rem" }}>
          {tr.mapInstructionTitle || "How to use map route picker"}
        </div>
        <div style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.45 }}>
          {tr.mapHint || "Click start point first, then destination"}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
          <span
            style={{
              padding: "0.3rem 0.6rem",
              borderRadius: 999,
              background: fromPoint ? "#dcfce7" : "#e2e8f0",
              color: fromPoint ? "#166534" : "#475569",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {fromPoint ? (tr.mapStartSet || "Start selected") : (tr.mapStartPending || "Pick start")}
          </span>
          <span
            style={{
              padding: "0.3rem 0.6rem",
              borderRadius: 999,
              background: toPoint ? "#dcfce7" : "#e2e8f0",
              color: toPoint ? "#166534" : "#475569",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {toPoint ? (tr.mapDestinationSet || "Destination selected") : (tr.mapDestinationPending || "Pick destination")}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "0.65rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={clearRoute}
          disabled={loading}
          style={{
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#be123c",
            padding: "0.5rem 0.9rem",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {tr.mapReset || "Reset route"}
        </button>
        <span style={{ color: "#334155", fontSize: "0.92rem", alignSelf: "center", fontWeight: 600 }}>
          {status || (tr.mapHint || "Click map to set start and destination")}
        </span>
      </div>

      <div
        style={{
          marginBottom: "0.75rem",
          padding: "0.75rem",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          background: "#ffffff",
        }}
      >
        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.45rem", fontSize: "0.9rem" }}>
          {tr.mapSearchLabel || "Find a place on the map"}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="search"
            value={mapSearchQuery}
            onChange={(e) => setMapSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runMapSearch();
              }
            }}
            placeholder={tr.mapSearchPlaceholder || "Search address or place…"}
            disabled={mapSearchLoading}
            aria-label={tr.mapSearchLabel || "Find a place on the map"}
            style={{
              flex: "1 1 180px",
              minWidth: 0,
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="button"
            onClick={runMapSearch}
            disabled={mapSearchLoading || !mapSearchQuery.trim()}
            style={{
              border: "none",
              background: mapSearchLoading || !mapSearchQuery.trim() ? "#94a3b8" : "#0a8f3d",
              color: "#fff",
              padding: "0.55rem 1rem",
              borderRadius: 8,
              cursor: mapSearchLoading || !mapSearchQuery.trim() ? "not-allowed" : "pointer",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {mapSearchLoading ? "…" : (tr.mapSearchButton || "Search")}
          </button>
        </div>
        {mapSearchError && (
          <div style={{ marginTop: "0.5rem", color: "#b45309", fontSize: "0.88rem", fontWeight: 600 }}>
            {mapSearchError}
          </div>
        )}
        {mapSearchResults.length > 0 && (
          <ul
            style={{
              margin: "0.55rem 0 0",
              padding: 0,
              listStyle: "none",
              maxHeight: 200,
              overflowY: "auto",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            {mapSearchResults.map((item) => (
              <li key={item.place_id}>
                <button
                  type="button"
                  onClick={() => onPickSearchResult(item)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.55rem 0.65rem",
                    border: "none",
                    borderBottom: "1px solid #e2e8f0",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "#1e293b",
                    lineHeight: 1.35,
                  }}
                >
                  {item.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
        }}
      >
        <MapContainer
          center={DHAKA_CENTER}
          zoom={12}
          minZoom={9}
          maxBounds={DHAKA_DIVISION_BOUNDS}
          maxBoundsViscosity={1}
          style={{ height: 320, width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />
          <MapFlyTo target={flyToTarget} />
          <MapClickHandler onPick={handlePointPick} />
          {markers.map((marker) => (
            <Marker key={marker.key} position={marker.position} icon={new L.Icon.Default()} />
          ))}
          {routePoints.length > 0 && <Polyline positions={routePoints} color="#0a8f3d" weight={5} />}
        </MapContainer>
      </div>
    </div>
  );
}
