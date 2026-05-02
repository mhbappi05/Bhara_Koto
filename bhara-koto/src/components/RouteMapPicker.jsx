import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const DHAKA_CENTER = [23.8103, 90.4125];
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng);
    },
  });
  return null;
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
    onRouteReady(null);
  };

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
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
        }}
      >
        <MapContainer center={DHAKA_CENTER} zoom={12} style={{ height: 320, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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
