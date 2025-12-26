import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------- ICONS ---------- */
const campIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [24, 24],
});

const villageIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [24, 24],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [26, 26],
});

/* ---------- HELPERS ---------- */
function colorForAccess(score = 0) {
  if (score < 0.3) return "red";
  if (score < 0.6) return "orange";
  return "green";
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 7);
  }, [center]);
  return null;
}

/* ---------- MAIN ---------- */
const CampMapView = forwardRef(({ camps, view, onUpdate }, ref) => {
  const mapRef = useRef(null);
  const [heatData, setHeatData] = useState([]);
  const [connections, setConnections] = useState([]);

  /* expose focusCamp */
  useImperativeHandle(ref, () => ({
    focusCamp(id) {
  const camp = camps.find(c => c._id === id);
  if (!camp) return;

  const [lng, lat] = camp.targetVillageId.location.coordinates;
  const map = mapRef.current;
  if (!map) return;

  map.flyTo([lat, lng], 12, { duration: 0.8 });
}
  }));

  /* load heatmap */
  useEffect(() => {
    if (view === "heatmap") {
      axios.get(`${API_URL}/villages/heatmap/access`)
        .then(res => setHeatData(res.data));
    }
  }, [view]);

  /* load connections */
  useEffect(() => {
    if (view === "connections") {
      axios.get(`${API_URL}/villages/connections`)
        .then(res => setConnections(res.data));
    }
  }, [view]);

  /* attach heat layer */
  function HeatLayer() {
    const map = useMap();
    useEffect(() => {
      if (!map || heatData.length === 0) return;

      const layer = L.heatLayer(
                    heatData.map(d => [
                    d.lat,
                    d.lng,
                    Math.max(0.2, d.intensity * 5) // 🔥 SCALE UP
                    ]),
                    {
                      radius: 45,          // bigger spread
                      blur: 30,            // smoother blending
                      minOpacity: 0.4,
                      maxZoom: 9,
                      gradient: {
                      0.1: "#7f1d1d",   // dark red (very poor access)
                      0.3: "#dc2626",
                      0.5: "#f97316",
                      0.7: "#facc15",
                      0.9: "#16a34a"    // green (good access)
                      }
                    }).addTo(map);

      return () => map.removeLayer(layer);
    }, [map, heatData]);

    return null;
  }

  return (
    <MapContainer
      center={[11.0168, 76.9558]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(m) => (mapRef.current = m)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={[11.0168, 76.9558]} />

      {/* HEATMAP */}
      {view === "heatmap" && <HeatLayer />}

      {/* CAMPS */}
      {view === "camps" &&
        camps.map(c => {
          const [lng, lat] = c.targetVillageId.location.coordinates;
          return (
            <React.Fragment key={c._id}>
              <Circle
                center={[lat, lng]}
                radius={c.severityScore * 8000}
                pathOptions={{ color: "red", fillOpacity: 0.1 }}
              />
              <Marker position={[lat, lng]} icon={campIcon}>
                <Popup>
                  <strong>{c.targetVillageId.name}</strong><br />
                  Severity: {c.severityScore}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() =>
                        axios.put(`${API_URL}/camps/${c._id}`, { status: "Approved" }).then(onUpdate)
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        axios.put(`${API_URL}/camps/${c._id}`, { status: "Completed" }).then(onUpdate)
                      }
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Complete
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

      {/* CONNECTIONS */}
      {view === "connections" &&
        connections.map((v, i) => (
          <React.Fragment key={i}>
            <Marker position={v.village.coordinates} icon={villageIcon}>
              <Popup>{v.village.name}</Popup>
            </Marker>

            {v.hospitals.map((h, j) => (
              <React.Fragment key={j}>
                <Marker position={h.coordinates} icon={hospitalIcon}>
                  <Popup>{h.name}</Popup>
                </Marker>
                <Polyline
                  positions={[v.village.coordinates, h.coordinates]}
                  color={j === 0 ? "green" : j === 1 ? "orange" : "red"}
                />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
    </MapContainer>
  );
});

export default CampMapView;
