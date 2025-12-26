import { useEffect, useState } from "react";
import axios from "axios";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const API_URL = import.meta.env.VITE_API_URL;

export default function VillageAccessHeatmap() {
  const map = useMap();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/villages/heatmap/access`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!map || data.length === 0) return;

    const points = data.map((v) => [
      v.lat,
      v.lng,
      Math.max(0.05, v.accessScore), // normalize 0–1
    ]);

    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 12,
      gradient: {
        0.1: "red",
        0.4: "orange",
        0.6: "yellow",
        0.9: "green",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
}
