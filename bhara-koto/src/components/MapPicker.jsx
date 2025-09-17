import React, { useCallback, useMemo, useRef, useState } from "react";
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api";

const CENTER_DHAKA = { lat: 23.780573, lng: 90.279239 };
const LIBRARIES = ["places"];

export default function MapPicker({ from, to, setFrom, setTo }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return (
            <div style={wrap}>
                <Notice text=".env এ VITE_GOOGLE_MAPS_API_KEY সেট করুন, তাহলেই মানচিত্র চালু হবে।" />
            </div>
        );
    }

    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);
    const fromAutoRef = useRef(null);
    const toAutoRef = useRef(null);

    const onLoadMap = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const geocodeLatLng = useCallback(async (latLng) => {
        return new Promise((resolve) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                    resolve(results[0].formatted_address);
                } else resolve("");
            });
        });
    }, []);

    const onMapClick = useCallback(
        async (e) => {
            const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            const label = markers.length % 2 === 0 ? "from" : "to";

            const address = await geocodeLatLng(latLng);
            if (label === "from") {
                setFrom(address || `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`);
                setMarkers([{ pos: latLng, label: "A" }, ...(markers[1] ? [markers[1]] : [])]);
            } else {
                setTo(address || `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`);
                const mA = markers[0] ? [markers[0]] : [];
                setMarkers([...mA, { pos: latLng, label: "B" }]);
            }
        },
        [markers, setFrom, setTo, geocodeLatLng]
    );

    const onPlaceChanged = useCallback(
        async (which) => {
            const auto = which === "from" ? fromAutoRef.current : toAutoRef.current;
            if (!auto) return;
            const place = auto.getPlace();
            const name =
                place?.formatted_address || place?.name || place?.vicinity || "";
            if (!place?.geometry?.location) {
                if (which === "from") setFrom(name);
                else setTo(name);
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            if (which === "from") {
                setFrom(name);
                setMarkers([{ pos: { lat, lng }, label: "A" }, ...(markers[1] ? [markers[1]] : [])]);
                mapRef.current?.panTo({ lat, lng });
            } else {
                setTo(name);
                const mA = markers[0] ? [markers[0]] : [];
                setMarkers([...mA, { pos: { lat, lng }, label: "B" }]);
                mapRef.current?.panTo({ lat, lng });
            }
        },
        [markers, setFrom, setTo]
    );

    const clearAll = () => {
        setMarkers([]);
        setFrom("");
        setTo("");
    };

    const swap = () => {
        const f = from, t = to;
        setFrom(t);
        setTo(f);
        setMarkers((m) => (m.length === 2 ? [{ ...m[1], label: "A" }, { ...m[0], label: "B" }] : m));
    };

    const containerStyle = useMemo(
        () => ({ width: "100%", height: "360px", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,.06)" }),
        []
    );

    return (
        <div style={wrap}>
            <div style={toolbar}>
                <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES}>
                    <div style={searchRow}>
                        <Autocomplete onLoad={(ac) => (fromAutoRef.current = ac)} onPlaceChanged={() => onPlaceChanged("from")}>
                            <input
                                placeholder="Search From…"
                                defaultValue={from}
                                style={input}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </Autocomplete>
                        <Autocomplete onLoad={(ac) => (toAutoRef.current = ac)} onPlaceChanged={() => onPlaceChanged("to")}>
                            <input
                                placeholder="Search To…"
                                defaultValue={to}
                                style={input}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </Autocomplete>

                        <button onClick={swap} style={btnGhost} title="Swap A↔B">⇄</button>
                        <button onClick={clearAll} style={btnDanger}>Clear</button>
                    </div>

                    <GoogleMap
                        onLoad={onLoadMap}
                        mapContainerStyle={containerStyle}
                        center={CENTER_DHAKA}
                        zoom={12}
                        onClick={onMapClick}
                        options={{
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: false,
                            clickableIcons: false,
                        }}
                    >
                        {markers.map((m, i) => (
                            <Marker key={i} position={m.pos} label={m.label} />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
            <small style={{ color: "#64748b" }}>
                টিপ: প্রথম ক্লিক “From (A)”, দ্বিতীয় ক্লিক “To (B)” সেট করে।
            </small>
        </div>
    );
}

function Notice({ text }) {
    return (
        <div style={{ padding: 14, borderRadius: 12, background: "#fff3cd", color: "#7a5d00" }}>
            {text}
        </div>
    );
}

const wrap = { marginTop: 16 };
const toolbar = { marginBottom: 8 };
const searchRow = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" };
const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid #cfd8dc", minWidth: 240 };
const btnGhost = { border: "1px solid #cbd5e1", background: "#fff", padding: "10px 12px", borderRadius: 10, cursor: "pointer" };
const btnDanger = { border: "1px solid #ef4444", background: "#ef4444", color: "#fff", padding: "10px 12px", borderRadius: 10, cursor: "pointer" };
