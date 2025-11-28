import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
   State → District map
   --------------------------- */
const stateDistrictMap = {
  "All States": [],
  "Andhra Pradesh": [
    "All Districts",
    "Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor","East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","Sri Potti Sriramulu Nellore","Sri Sathya Sai","Srikakulam","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"
  ],
  "Karnataka": [
    "All Districts",
    "Bagalkote","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar",
    "Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga","Dakshina Kannada",
    "Davangere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal",
    "Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"
  ],
  "Kerala": [
    "All Districts",
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam",
    "Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram",
    "Thrissur","Wayanad"
  ],
  "Tamil Nadu": [
    "All Districts",
    "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul",
    "Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai",
    "Mayiladuthurai","Nagapattinam","Namakkal","Perambalur","Pudukkottai","Ramanathapuram",
    "Ranipet","Salem","Sivagangai","Tenkasi","Thanjavur","Theni","Thoothukudi",
    "Tiruchirappalli","Tirunelveli","Tirupattur","Tiruppur","Tiruvallur","Tiruvannamalai",
    "Tiruvarur","Vellore","Viluppuram","Virudhunagar"
  ],
  "Telangana": [
    "All Districts",
    "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon",
    "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
    "Komaram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak",
    "Medchal–Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal",
    "Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet",
    "Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"
  ],
};

const typesList = ["All Types", "Clinic", "PHC", "District Hospital", "Charitable Hospital"];
const facilitiesList = [
  "OPD","Emergency","X-Ray","Maternity","ICU","Surgery","Diagnostics","Pharmacy",
  "Pediatrics","Obstetrics","Radiology","Laboratory","Ambulance","Blood Bank",
  "Telemedicine","Mental Health","Physiotherapy","Dental","Vaccination","Dialysis"
];

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
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);
  const [activeHospital, setActiveHospital] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(50);
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const stateOptions = Object.keys(stateDistrictMap);
  const districtOptions = stateDistrictMap[selectedState] || ["All Districts"];

  /* Fetch hospitals */
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:5000/api/hospitals");
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
    load();
  }, []);

  /* Get user location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation([11.0168, 76.9558])
    );
  }, []);

  /* Distance */
  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function toggleFacility(f) {
    setSelectedFacilities(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  }

  function resetFilters() {
    setSearchName("");
    setDistanceFilter(50);
    setSelectedState("All States");
    setSelectedDistrict("All Districts");
    setSelectedType("All Types");
    setSelectedFacilities([]);
  }

  /* Filtering */
  const filteredHospitals = hospitals.filter(h => {

    if (!h._lat || !h._lng) return false;

    if (searchName && !h.name.toLowerCase().includes(searchName.toLowerCase()))
      return false;

    if (selectedState !== "All States") {
      if (!stateDistrictMap[selectedState]?.includes(h.district)) return false;
    }

    if (selectedDistrict !== "All Districts" && h.district !== selectedDistrict)
      return false;

    if (selectedType !== "All Types" && h.type !== selectedType)
      return false;

    if (selectedFacilities.length > 0) {
      const s = (h.services || []).map(x => x.toLowerCase());
      const ok = selectedFacilities.some(f => s.includes(f.toLowerCase()));
      if (!ok) return false;
    }

    if (userLocation && distanceFilter < 50) {
      const dist = getDistanceKm(userLocation[0], userLocation[1], h._lat, h._lng);
      if (dist > distanceFilter) return false;
    }

    return true;
  });

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  /* ---------------------------
     RENDER
     --------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        
        {/* FILTER BUTTON – now correct */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 bg-[#005086] text-white px-4 py-2 rounded-lg shadow hover:bg-[#003f63]"
        >
          <span className="material-icons">Filters</span>
          
        </button>

        <h1 className="text-2xl font-bold text-[#005086]">Nearest Facility Finder</h1>
      </div>

      <div className="flex">

        {/* SIDEBAR */}
        <aside
          className={`fixed top-24 left-0 bottom-0 z-[9999] w-[350px]
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            bg-white rounded-r-xl shadow-xl p-4 overflow-hidden`}
        >


          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={() => setSidebarOpen(false)} className="text-xl">×</button>
          </div>

          <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 50px)" }}>

            {/* Search */}
            <input
              type="text"
              placeholder="Search hospital…"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            {/* Distance */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Max Distance</label>
              <input
                type="range"
                min="1"
                max="50"
                value={distanceFilter}
                onChange={e => setDistanceFilter(Number(e.target.value))}
                className="
                            w-full
                            accent-[#005086] 
                            cursor-pointer
                          "
              />
              <div className="text-right text-sm">{distanceFilter} km</div>
            </div>

            {/* State */}
            <label className="text-sm font-medium">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("All Districts");
              }}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              {stateOptions.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* District */}
            <label className="text-sm font-medium">District</label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              {districtOptions.map(d => <option key={d}>{d}</option>)}
            </select>

            {/* Type */}
            <label className="text-sm font-medium">Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              {typesList.map(t => <option key={t}>{t}</option>)}
            </select>

            {/* Facilities */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Facilities</p>
              <div className="grid grid-cols-2 gap-2">
                {facilitiesList.map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(f)}
                      onChange={() => toggleFacility(f)}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSidebarOpen(false)} className="flex-1 bg-[#005086] text-white py-2 rounded-lg">Apply</button>
              <button onClick={resetFilters} className="flex-1 border py-2 rounded-lg">Clear</button>
            </div>

          </div>
        </aside>

        {/* Click-out overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAP AREA */}
        <main className="flex-1" style={{ minHeight: "calc(100vh - 96px)" }}>
          <div className="p-4">
            <div className="w-full h-[75vh] rounded-xl overflow-hidden shadow">

              <MapContainer
                center={userLocation || [11.0168, 76.9558]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap location={userLocation} />

                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}

                {filteredHospitals.map((h) => (
                  <Marker
                    key={h._id}
                    position={[h._lat, h._lng]}
                    icon={hospitalIcon}
                    eventHandlers={{ click: () => setActiveHospital(h) }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{h.name}</strong>
                        <div className="text-xs text-gray-600">{h.type} • {h.district}</div>
                        <div className="text-xs">Facilities: {(h.services || []).join(", ")}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              </MapContainer>

            </div>

            <div className="mt-3 text-sm text-gray-600">
              Showing <b>{filteredHospitals.length}</b> facilities
            </div>

          </div>
        </main>
      </div>

      {/* MODAL */}
      {activeHospital && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999] p-4"
          onClick={() => setActiveHospital(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-[400px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute right-4 top-4 text-xl" onClick={() => setActiveHospital(null)}>
              ×
            </button>

            <h2 className="text-2xl font-bold">{activeHospital.name}</h2>
            <p>Type: {activeHospital.type}</p>
            <p>District: {activeHospital.district}</p>
            <p>Facilities: {(activeHospital.services || []).join(", ")}</p>
            <p>Doctors: {activeHospital.doctors}</p>
            <p>Beds: {activeHospital.beds}</p>
            <p className="text-gray-500 mt-2">Admission Fee: ₹{activeHospital.admissionFee}</p>
          </div>
        </div>
      )}

    </div>
  );
}
