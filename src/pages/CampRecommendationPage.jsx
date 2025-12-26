// // CampRecommendationPage.jsx
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import CampMapView from "../components/CampMapView";
// import CampTableView from "../components/CampTableView";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function CampRecommendationPage() {
//   const [camps, setCamps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [panelOpen, setPanelOpen] = useState(false);
//   const [focusedCampId, setFocusedCampId] = useState(null);
//   const mapRef = useRef(null); // will be populated by CampMapView via callback

//   // fetch camps (GET /api/camps)
//   async function loadCamps() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_URL}/camps`);
//       // expected shape: camp.targetVillageId populated (name, district, population, location)
//       setCamps(res.data || []);
//     } catch (err) {
//       console.error("Failed to load camps", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadCamps();
//   }, []);

//   // expose a small API to child to refetch
//   async function refresh() {
//     await loadCamps();
//   }

//   // open panel fullscreen
//   function openPanel() {
//     setPanelOpen(true);
//     // optional: lock body scroll
//     document.body.style.overflow = "hidden";
//   }

//   function closePanel() {
//     setPanelOpen(false);
//     document.body.style.overflow = "";
//   }

//   // request center on a camp (table -> map)
//   function viewOnMap(campId) {
//     setFocusedCampId(campId);
//     setPanelOpen(false); // close table panel and reveal map
//     // small delay to ensure map is visible
//     setTimeout(() => {
//       if (mapRef.current?.focusCamp) mapRef.current.focusCamp(campId);
//     }, 200);
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* top bar */}
//       <div className="bg-white shadow px-6 py-3 flex items-center justify-between">
//         <h1 className="text-xl md:text-2xl font-bold text-[#005086]">
//           Camp Recommendations
//         </h1>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => openPanel()}
//             className="bg-[#B91C1C] text-white px-3 py-2 rounded-md shadow hover:bg-[#991717]"
//             title="Open table / panel"
//           >
//             View Recommendations (Table)
//           </button>
//           <button
//             onClick={() => loadCamps()}
//             className="border px-3 py-2 rounded-md"
//             title="Refresh"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="w-full h-[78vh] rounded-xl overflow-hidden shadow relative">
//           <CampMapView
//             ref={mapRef}
//             camps={camps}
//             loading={loading}
//             focusCampId={focusedCampId}
//             onUpdate={refresh}
//           />
//         </div>
//       </div>

//       {/* Sliding full screen panel */}
//       <div
//         className={`fixed inset-0 z-[9999] transition-transform duration-300 ease-in-out ${
//           panelOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         aria-hidden={!panelOpen}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closePanel} />
//         <div className="absolute right-0 top-0 bottom-0 w-full md:w-[880px] bg-white overflow-auto">
//           <div className="p-4 flex items-center justify-between border-b">
//             <div className="flex items-center gap-3">
//               <button
//                 className="text-xl px-2"
//                 onClick={closePanel}
//                 aria-label="Back to map"
//               >
//                 ←
//               </button>
//               <h2 className="text-lg font-semibold">Recommendations Table</h2>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   // export CSV quickie
//                   const csv = csvFromCamps(camps);
//                   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//                   const url = URL.createObjectURL(blob);
//                   const a = document.createElement("a");
//                   a.href = url;
//                   a.download = `camp_recommendations_${Date.now()}.csv`;
//                   a.click();
//                 }}
//                 className="border px-3 py-2 rounded"
//               >
//                 Export CSV
//               </button>
//               <button
//                 onClick={() => refresh()}
//                 className="bg-[#005086] text-white px-3 py-2 rounded"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>

//           <div className="p-4">
//             <CampTableView
//               camps={camps}
//               loading={loading}
//               onViewOnMap={(id) => viewOnMap(id)}
//               onStatusUpdated={refresh}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* small CSV helper */
// function csvFromCamps(camps) {
//   const headers = [
//     "villageId",
//     "villageName",
//     "district",
//     "population",
//     "accessScore",
//     "severityScore",
//     "reasons",
//     "servicesRecommended",
//     "nearestHospitals",
//     "status",
//     "createdAt",
//   ];
//   const rows = camps.map((c) => {
//     const v = c.targetVillageId || {};
//     return [
//       v._id || "",
//       v.name || "",
//       v.district || "",
//       v.population ?? "",
//       v.accessScore ?? "",
//       c.severityScore ?? "",
//       (c.reasons || []).join("; "),
//       (c.servicesRecommended || []).join("; "),
//       (c.nearestHospitals || []).map(h => (h.name || h)).join("; "),
//       c.status || "",
//       c.createdAt || "",
//     ];
//   });
//   return [headers.join(","), ...rows.map(r => r.map(cellEscape).join(","))].join("\n");
// }
// function cellEscape(s) {
//   if (s == null) return "";
//   const str = String(s).replace(/"/g, '""');
//   return `"${str}"`;
// }
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CampMapView from "../components/CampMapView";
import CampTableView from "../components/CampTableView";

const API_URL = import.meta.env.VITE_API_URL;

export default function CampRecommendationPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [focusedCampId, setFocusedCampId] = useState(null);
  const [mapView, setMapView] = useState("camps"); // camps | heatmap | connections

  const mapRef = useRef(null);

  /* -------- LOAD CAMPS -------- */
  async function loadCamps() {
    try {
      setLoading(true);
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

  /* -------- VIEW ON MAP -------- */
  function handleViewOnMap(campId) {
    setFocusedCampId(campId);
    setShowTable(false);
    mapRef.current?.focusCamp(campId);
  }

  return (
    <div className="relative w-full h-screen">
      {/* ---------- TOP TOGGLE ---------- */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]
        bg-white rounded-xl shadow flex overflow-hidden"
      >
        {[
          { id: "camps", label: "Camps" },
          { id: "heatmap", label: "Heatmap" },
          { id: "connections", label: "Connections" },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => setMapView(b.id)}
            className={`px-6 py-2 text-sm font-semibold ${
              mapView === b.id
                ? "bg-[#005086] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* ---------- TABLE TOGGLE ---------- */}
      <button
        onClick={() => setShowTable((s) => !s)}
        className="absolute top-4 right-4 z-[1000]
        bg-[#005086] text-white px-4 py-2 rounded-lg shadow"
      >
        {showTable ? "Hide Table" : "View Table"}
      </button>

      {/* ---------- MAP ---------- */}
      <div className="w-full h-full">
        <CampMapView
          ref={mapRef}
          camps={camps}
          loading={loading}
          focusCampId={focusedCampId}
          onUpdate={loadCamps}
          viewMode={mapView}
        />
      </div>

      {/* ---------- TABLE ---------- */}
      {showTable && (
        <div className="absolute bottom-0 left-0 right-0 h-[45%]
          bg-white shadow-2xl z-[1000] overflow-auto">
          <CampTableView
            camps={camps}
            loading={loading}
            onViewOnMap={handleViewOnMap}
          />
        </div>
      )}
    </div>
  );
}
