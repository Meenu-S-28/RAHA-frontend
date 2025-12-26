// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import CampMapView from "../components/CampMapView";
// import CampTableView from "../components/CampTableView";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function CampRecommendationPage() {
//   const [camps, setCamps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTable, setShowTable] = useState(false);
//   const [focusedCampId, setFocusedCampId] = useState(null);
//   const [mapView, setMapView] = useState("camps"); // camps | heatmap | connections

//   const mapRef = useRef(null);

//   /* -------- LOAD CAMPS -------- */
//   async function loadCamps() {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_URL}/camps`);
//       setCamps(res.data);
//     } catch (err) {
//       console.error("Failed to load camps", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadCamps();
//   }, []);

//   /* -------- VIEW ON MAP -------- */
//   function handleViewOnMap(campId) {
//     setFocusedCampId(campId);
//     setShowTable(false);
//     mapRef.current?.focusCamp(campId);
//   }

//   return (
//     <div className="relative w-full h-screen">
//       {/* ---------- TOP TOGGLE ---------- */}
//       <div
//         className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]
//         bg-white rounded-xl shadow flex overflow-hidden"
//       >
//         {[
//           { id: "camps", label: "Camps" },
//           { id: "heatmap", label: "Heatmap" },
//           { id: "connections", label: "Connections" },
//         ].map((b) => (
//           <button
//             key={b.id}
//             onClick={() => setMapView(b.id)}
//             className={`px-6 py-2 text-sm font-semibold ${
//               mapView === b.id
//                 ? "bg-[#005086] text-white"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             {b.label}
//           </button>
//         ))}
//       </div>

//       {/* ---------- TABLE TOGGLE ---------- */}
//       <button
//         onClick={() => setShowTable((s) => !s)}
//         className="absolute top-4 right-4 z-[1000]
//         bg-[#005086] text-white px-4 py-2 rounded-lg shadow"
//       >
//         {showTable ? "Hide Table" : "View Table"}
//       </button>

//       {/* ---------- MAP ---------- */}
//       <div className="w-full h-full">
//         <CampMapView
//           ref={mapRef}
//           camps={camps}
//           loading={loading}
//           focusCampId={focusedCampId}
//           onUpdate={loadCamps}
//           viewMode={mapView}
//         />
//       </div>

//       {/* ---------- TABLE ---------- */}
//       {showTable && (
//         <div className="absolute bottom-0 left-0 right-0 h-[45%]
//           bg-white shadow-2xl z-[1000] overflow-auto">
//           <CampTableView
//             camps={camps}
//             loading={loading}
//             onViewOnMap={handleViewOnMap}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CampMapView from "../components/CampMapView";
import CampTableView from "../components/CampTableView";

const API_URL = import.meta.env.VITE_API_URL;

export default function CampRecommendationPage() {
  const [view, setView] = useState("camps"); // camps | heatmap | connections
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const mapRef = useRef(null);

  async function loadCamps() {
    try {
      const res = await axios.get(`${API_URL}/camps`);
      setCamps(res.data);
    } catch (err) {
      console.error("Failed to load camps", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCamps();
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Toggle buttons */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]
                      bg-white rounded-xl shadow flex overflow-hidden">
        {["camps", "heatmap", "connections"].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-6 py-2 font-semibold text-sm ${
              view === v
                ? "bg-[#005086] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* View Table */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="absolute top-4 right-4 z-[1000] bg-[#005086] text-white px-4 py-2 rounded"
      >
        {showTable ? "Hide Table" : "View Table"}
      </button>

      {/* MAP */}
      <CampMapView
        ref={mapRef}
        camps={camps}
        view={view}
        loading={loading}
        onUpdate={loadCamps}
      />

      {/* TABLE */}
      {showTable && (
        <div className="absolute bottom-0 left-0 right-0 max-h-[45%] bg-white shadow-xl overflow-auto z-[1000]">
          <CampTableView
            camps={camps}
            loading={loading}
            onViewOnMap={(id) => mapRef.current?.focusCamp(id)}
          />
        </div>
      )}
    </div>
  );
}

