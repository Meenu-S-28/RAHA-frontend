import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import VillageAccessHeatmap from "./VillageAccessHeatmap";
import VillageHospitalConnections from "./VillageHospitalConnections";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- ICONS ---------------- */
const campIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [28, 28],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

/* ---------------- HELPERS ---------------- */
function colorForAccessScore(score) {
  const s = Math.max(0, Math.min(1, Number(score ?? 0)));
  if (s < 0.25) return "#b91c1c";
  if (s < 0.5) return "#f97316";
  if (s < 0.75) return "#facc15";
  return "#10A245";
}

function radiusForSeverity(sev) {
  return Math.max(600, (Number(sev ?? 0) || 0) * 8000);
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, Math.max(map.getZoom(), 9));
  }, [center]);
  return null;
}

/* ---------------- MAIN ---------------- */
const CampMapView = forwardRef(function CampMapView(
  { camps = [], viewMode = "camps", onUpdate },
  ref
) {
  const [userLocation, setUserLocation] = useState(null);
  const [connections, setConnections] = useState([]);
  const mapRef = useRef(null);

  /* -------- GEOLOCATION -------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setUserLocation([p.coords.latitude, p.coords.longitude]),
      () => setUserLocation([11.0168, 76.9558])
    );
  }, []);

  /* -------- LOAD CONNECTION DATA -------- */
  useEffect(() => {
    if (viewMode === "connections") {
      axios
        .get(`${API_URL}/villages/connections`)
        .then((res) => setConnections(res.data))
        .catch((err) => console.error(err));
    }
  }, [viewMode]);

  /* -------- IMPERATIVE HANDLE -------- */
  useImperativeHandle(ref, () => ({
    focusCamp(id) {
      const camp = camps.find((c) => c._id === id);
      if (!camp) return;

      const coords = camp.targetVillageId?.location?.coordinates;
      if (!coords) return;

      const lng = coords[0];
      const lat = coords[1];

      mapRef.current?.setView([lat, lng], 12);
    },
  }));

  /* -------- CENTER -------- */
  const center =
    userLocation ||
    (camps[0]?.targetVillageId?.location?.coordinates
      ? [
          camps[0].targetVillageId.location.coordinates[1],
          camps[0].targetVillageId.location.coordinates[0],
        ]
      : [11.0168, 76.9558]);

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={center} />

      {/* USER LOCATION */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* -------- HEATMAP -------- */}
      {viewMode === "heatmap" && <VillageAccessHeatmap />}

      {/* -------- CONNECTIONS -------- */}
      {viewMode === "connections" && (
        <VillageHospitalConnections data={connections} />
      )}

      {/* -------- CAMPS -------- */}
      {viewMode === "camps" &&
        camps.map((camp) => {
          const v = camp.targetVillageId;
          if (!v?.location?.coordinates) return null;

          const lng = v.location.coordinates[0];
          const lat = v.location.coordinates[1];

          const accessScore = v.accessScore ?? 0;
          const color = colorForAccessScore(accessScore);
          const severityRadius = radiusForSeverity(camp.severityScore);

          return (
            <React.Fragment key={camp._id}>
              <CircleMarker
                center={[lat, lng]}
                radius={18}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.3,
                }}
              >
                <Popup>
                  <strong>{v.name}</strong>
                  <div>District: {v.district}</div>
                  <div>Access Score: {accessScore.toFixed(2)}</div>
                </Popup>
              </CircleMarker>

              <Circle
                center={[lat, lng]}
                radius={severityRadius}
                pathOptions={{
                  color: "#dc2626",
                  fillOpacity: 0.08,
                }}
              />

              <Marker position={[lat, lng]} icon={campIcon}>
                <Popup>
                  <strong>{v.name}</strong>
                  <div>Severity: {camp.severityScore}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                      onClick={async () => {
                        await axios.put(
                          `${API_URL}/camps/${camp._id}`,
                          { status: "Approved" }
                        );
                        onUpdate?.();
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                      onClick={async () => {
                        await axios.put(
                          `${API_URL}/camps/${camp._id}`,
                          { status: "Completed" }
                        );
                        onUpdate?.();
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
    </MapContainer>
  );
});

export default CampMapView;
