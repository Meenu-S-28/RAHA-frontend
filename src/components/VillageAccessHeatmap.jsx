// src/components/VillageAccessHeatmap.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const API_URL = import.meta.env.VITE_API_URL;

// Internal component that attaches a Leaflet heat layer to the current map
function HeatmapLayer({ data }) {
  const map = useMap();

  // Convert API objects -> [lat, lng, intensity] for leaflet.heat
  const points = useMemo(
    () =>
      (data || []).map(p => [
        p.lat,
        p.lng,
        // normalize intensity (assuming 0–100 like your comment)
        (p.intensity ?? p.accessScore ?? 0) / 100
      ]),
    [data]
  );

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 18,
      // leaflet.heat supports a gradient; keys are 0–1 range
      gradient: {
        0.2: "red",
        0.5: "yellow",
        0.8: "green"
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function VillageAccessHeatmap() {
  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    async function loadHeatmap() {
      try {
        const res = await axios.get(`${API_URL}/villages/heatmap/access`);
        // Expecting array of { lat, lng, intensity } from your backend
        setHeatData(res.data || []);
      } catch (err) {
        console.error("Heatmap load failed", err);
      }
    }
    loadHeatmap();
  }, []);

  return (
    <div className="w-full h-[80vh]">
      <MapContainer
        center={[11.0168, 76.9558]} // Tamil Nadu default
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Custom heatmap layer compatible with modern React + React-Leaflet */}
        <HeatmapLayer data={heatData} />
      </MapContainer>
    </div>
  );
}
