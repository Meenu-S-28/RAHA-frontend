import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer } from "react-leaflet";

import VillageHeatmap from "./VillageHeatmap";
import VillageHospitalConnections from "./VillageHospitalConnections";

const API_URL = import.meta.env.VITE_API_URL;

export default function VillageAccessMap() {
  const [view, setView] = useState("heatmap"); // heatmap | connections
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/villages`)
      .then(res => setVillages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="relative w-full h-screen">

      {/* 🔘 TOGGLE BUTTONS */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]
                      bg-white rounded-xl shadow flex overflow-hidden">
        <button
          onClick={() => setView("heatmap")}
          className={`px-6 py-2 text-sm font-semibold
            ${view === "heatmap"
              ? "bg-[#005086] text-white"
              : "text-gray-700 hover:bg-gray-100"}`}
        >
          Heatmap
        </button>

        <button
          onClick={() => setView("connections")}
          className={`px-6 py-2 text-sm font-semibold
            ${view === "connections"
              ? "bg-[#005086] text-white"
              : "text-gray-700 hover:bg-gray-100"}`}
        >
          Connections
        </button>
      </div>

      {/* 🗺 MAP */}
      <MapContainer
        center={[11.0168, 76.9558]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        {view === "heatmap" && (
          <VillageHeatmap villages={villages} />
        )}

        {view === "connections" && (
          <VillageHospitalConnections />
        )}
      </MapContainer>
    </div>
  );
}
