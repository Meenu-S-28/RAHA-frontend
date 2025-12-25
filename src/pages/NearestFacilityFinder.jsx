// import { useEffect, useState } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const API_URL = import.meta.env.VITE_API_URL;

// /* ---------------------------
//    Icons
// --------------------------- */
// const hospitalIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
//   iconSize: [32, 32],
// });
// const userIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35],
// });

// /* ---------------------------
//    Recenter map
// --------------------------- */
// function RecenterMap({ location }) {
//   const map = useMap();
//   useEffect(() => {
//     if (location) map.setView(location, map.getZoom());
//   }, [location]);
//   return null;
// }

// /* ---------------------------
//    MAIN COMPONENT
// --------------------------- */
// export default function NearestFacilityFinder() {
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [userLocation, setUserLocation] = useState(null);
//   const [activeHospital, setActiveHospital] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [searchName, setSearchName] = useState("");
//   const [selectedFacilities, setSelectedFacilities] = useState([]);

//   /* ---------------------------
//      FETCH ALL HOSPITALS (Browse Mode)
//   --------------------------- */
//   async function loadAllHospitals() {
//     try {
//       const res = await axios.get(`${API_URL}/hospitals`);
//       const normalized = res.data.map(h => ({
//         ...h,
//         _lng: Number(h.location.coordinates[0]),
//         _lat: Number(h.location.coordinates[1]),
//       }));
//       setHospitals(normalized);
//     } catch (err) {
//       console.error("Failed to load hospitals:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadAllHospitals();
//   }, []);

//   /* ---------------------------
//      GET USER LOCATION
//   --------------------------- */
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
//       () => setUserLocation([11.0168, 76.9558])
//     );
//   }, []);

//   /* ---------------------------
//      FIND TOP-3 NEAREST (Smart Mode)
//   --------------------------- */
//   async function findNearestHospitals() {
//     if (!userLocation || selectedFacilities.length === 0) return;

//     try {
//       const res = await axios.get(`${API_URL}/hospitals/nearest`, {
//         params: {
//           lat: userLocation[0],
//           lng: userLocation[1],
//           service: selectedFacilities[0],
//           limit: 3,
//         },
//       });

//       const normalized = res.data.data.map(h => ({
//         ...h,
//         _lat: Number(h.coordinates[1]),
//         _lng: Number(h.coordinates[0]),
//         distanceKm: Number(h.distanceInKm),
//       }));

//       setHospitals(normalized);
//     } catch (err) {
//       console.error("Nearest hospital fetch failed:", err);
//     }
//   }

//   /* Auto-switch to nearest-3 */
//   useEffect(() => {
//     if (userLocation && selectedFacilities.length > 0) {
//       findNearestHospitals();
//     }
//   }, [userLocation, selectedFacilities]);

//   /* ---------------------------
//      FILTERS
//   --------------------------- */
//   function toggleFacility(f) {
//     setSelectedFacilities(prev =>
//       prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
//     );
//   }

//   function resetFilters() {
//     setSearchName("");
//     setSelectedFacilities([]);
//     loadAllHospitals(); // ⬅️ IMPORTANT
//   }

//   const filteredHospitals = hospitals.filter(h => {
//     if (!h._lat || !h._lng) return false;
//     if (searchName && !h.name.toLowerCase().includes(searchName.toLowerCase()))
//       return false;
//     return true;
//   });

//   if (loading)
//     return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

//   /* ---------------------------
//      RENDER
//   --------------------------- */
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="bg-[#005086] text-white px-4 py-2 rounded-lg"
//         >
//           Filters
//         </button>
//         <h1 className="text-2xl font-bold text-[#005086]">
//           Nearest Facility Finder
//         </h1>
//       </div>

//       <div className="flex">
//         {/* SIDEBAR */}
//         <aside
//           className={`fixed top-24 left-0 bottom-0 z-[9999] w-[320px]
//           transform transition-transform duration-300
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           bg-white shadow-xl p-4`}
//         >
//           <h3 className="font-semibold mb-2">Facilities</h3>
//           {["OPD","Emergency","ICU","Diagnostics","Ambulance"].map(f => (
//             <label key={f} className="block text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedFacilities.includes(f)}
//                 onChange={() => toggleFacility(f)}
//               />{" "}
//               {f}
//             </label>
//           ))}

//           <div className="flex gap-2 mt-4">
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="flex-1 bg-[#005086] text-white py-2 rounded"
//             >
//               Apply
//             </button>
//             <button
//               onClick={resetFilters}
//               className="flex-1 border py-2 rounded"
//             >
//               Clear
//             </button>
//           </div>
//         </aside>

//         {/* MAP */}
//         <main className="flex-1">
//           <MapContainer
//             center={userLocation || [11.0168, 76.9558]}
//             zoom={12}
//             style={{ height: "80vh", width: "100%" }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <RecenterMap location={userLocation} />

//             {userLocation && (
//               <Marker position={userLocation} icon={userIcon}>
//                 <Popup>You are here</Popup>
//               </Marker>
//             )}

//             {filteredHospitals.map(h => (
//               <Marker
//                 key={h._id}
//                 position={[h._lat, h._lng]}
//                 icon={hospitalIcon}
//                 eventHandlers={{ click: () => setActiveHospital(h) }}
//               >
//                 <Popup>
//                   <strong>{h.name}</strong>
//                   {h.distanceKm && (
//                     <div>{h.distanceKm.toFixed(2)} km away</div>
//                   )}
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </main>
//       </div>

//       {/* MODAL */}
//       {activeHospital && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
//           onClick={() => setActiveHospital(null)}
//         >
//           <div
//             className="bg-white p-6 rounded-lg"
//             onClick={e => e.stopPropagation()}
//           >
//             <h2 className="text-xl font-bold">{activeHospital.name}</h2>
//             <p>Type: {activeHospital.type}</p>
//             <p>District: {activeHospital.district}</p>
//             <p>Facilities: {(activeHospital.services || []).join(", ")}</p>
//             <p>Doctors: {activeHospital.doctors}</p>
//             <p>Beds: {activeHospital.beds}</p>
//             <p className="text-gray-500 mt-2">Admission Fee: ₹{activeHospital.admissionFee}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------------------
   Icons
--------------------------- */
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

/* ---------------------------
   Recenter map
--------------------------- */
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView(location, map.getZoom());
  }, [location]);
  return null;
}

/* ---------------------------
   MAIN COMPONENT
--------------------------- */
export default function NearestFacilityFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);
  const [activeHospital, setActiveHospital] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedFacilities, setSelectedFacilities] = useState([]);

  /* -------- Location mode -------- */
  const [locationMode, setLocationMode] = useState("current"); // current | manual | village
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");

  /* ---------------------------
     LOAD ALL HOSPITALS
  --------------------------- */
  async function loadAllHospitals() {
    try {
      const res = await axios.get(`${API_URL}/hospitals`);
      const normalized = res.data.map(h => ({
        ...h,
        _lng: Number(h.location.coordinates[0]),
        _lat: Number(h.location.coordinates[1]),
      }));
      setHospitals(normalized);
    } catch (err) {
      console.error("Failed to load hospitals:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     LOAD VILLAGES (for dropdown)
  --------------------------- */
  async function loadVillages() {
    try {
      const res = await axios.get(`${API_URL}/villages`);
      setVillages(res.data);
    } catch (err) {
      console.error("Failed to load villages:", err);
    }
  }

  useEffect(() => {
    loadAllHospitals();
    loadVillages();
  }, []);

  /* ---------------------------
     USER LOCATION
  --------------------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation([11.0168, 76.9558])
    );
  }, []);

  /* ---------------------------
     FIND TOP-3 NEAREST
  --------------------------- */
  async function findNearestHospitals() {
    if (selectedFacilities.length === 0) return;

    try {
      const params = {
        service: selectedFacilities[0],
        limit: 3,
      };

      if (locationMode === "current") {
        if (!userLocation) return;
        params.lat = userLocation[0];
        params.lng = userLocation[1];
      }

      if (locationMode === "manual") {
        if (!manualLat || !manualLng) return;
        params.lat = Number(manualLat);
        params.lng = Number(manualLng);
        setUserLocation([Number(manualLat), Number(manualLng)]);
      }

      if (locationMode === "village") {
        if (!selectedVillageId) return;
        params.villageId = selectedVillageId;

        const village = villages.find(v => v.villageId === selectedVillageId);
        if (village) {
          setUserLocation([
            village.location.coordinates[1],
            village.location.coordinates[0],
          ]);
        }
      }

      const res = await axios.get(`${API_URL}/hospitals/nearest`, { params });

      const normalized = res.data.data.map(h => ({
        ...h,
        _lat: Number(h.coordinates[1]),
        _lng: Number(h.coordinates[0]),
        distanceKm: Number(h.distanceInKm),
      }));

      setHospitals(normalized);
    } catch (err) {
      console.error("Nearest hospital fetch failed:", err);
    }
  }

  useEffect(() => {
    findNearestHospitals();
  }, [selectedFacilities, locationMode, selectedVillageId]);

  /* ---------------------------
     HELPERS
  --------------------------- */
  function toggleFacility(f) {
    setSelectedFacilities(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  }

  function resetFilters() {
    setSelectedFacilities([]);
    setLocationMode("current");
    setManualLat("");
    setManualLng("");
    setSelectedVillageId("");
    loadAllHospitals();
  }

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  /* ---------------------------
     RENDER
  --------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#005086] text-white px-4 py-2 rounded-lg"
        >
          Filters
        </button>
        <h1 className="text-2xl font-bold text-[#005086]">
          Nearest Facility Finder
        </h1>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-24 left-0 bottom-0 z-[9999] w-[320px]
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white shadow-xl p-4`}
        >
          <h3 className="font-semibold mb-2">Search Location</h3>

          <select
            value={locationMode}
            onChange={e => setLocationMode(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-3"
          >
            <option value="current">Current Location</option>
            <option value="manual">Latitude & Longitude</option>
            <option value="village">Village</option>
          </select>

          {locationMode === "manual" && (
            <div className="space-y-2 mb-3">
              <input
                type="number"
                placeholder="Latitude"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={manualLng}
                onChange={e => setManualLng(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          )}

          {locationMode === "village" && (
            <select
              value={selectedVillageId}
              onChange={e => setSelectedVillageId(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-3"
            >
              <option value="">Select Village</option>
              {villages.map(v => (
                <option key={v.villageId} value={v.villageId}>
                  {v.name} ({v.district})
                </option>
              ))}
            </select>
          )}

          <h3 className="font-semibold mb-2">Facilities</h3>
          {["OPD", "Emergency", "ICU", "Diagnostics", "Ambulance"].map(f => (
            <label key={f} className="block text-sm">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(f)}
                onChange={() => toggleFacility(f)}
              />{" "}
              {f}
            </label>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex-1 bg-[#005086] text-white py-2 rounded"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 border py-2 rounded"
            >
              Clear
            </button>
          </div>
        </aside>

        {/* MAP */}
        <main className="flex-1">
          <MapContainer
            center={userLocation || [11.0168, 76.9558]}
            zoom={12}
            style={{ height: "80vh", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap location={userLocation} />

            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>Selected Location</Popup>
              </Marker>
            )}

            {hospitals.map(h => (
              <Marker
                key={h.hospitalId || h._id}
                position={[h._lat, h._lng]}
                icon={hospitalIcon}
                eventHandlers={{ click: () => setActiveHospital(h) }}
              >
                <Popup>
                  <strong>{h.name}</strong>
                  {h.distanceKm && <div>{h.distanceKm.toFixed(2)} km away</div>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>
      </div>

      {/* MODAL */}
      {activeHospital && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setActiveHospital(null)}
        >
          <div
            className="bg-white p-6 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">{activeHospital.name}</h2>
            <p>Facilities: {(activeHospital.services || []).join(", ")}</p>
            {activeHospital.distanceKm && (
              <p>{activeHospital.distanceKm.toFixed(2)} km away</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
