import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Modal for hospital details
function HospitalModal({ hospital, onClose }) {
  if (!hospital) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-lg font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-[#005086] mb-2">
          {hospital.name}
        </h2>
        <p className="text-gray-600 mb-2">🏥 {hospital.specialty}</p>
        <p className="text-gray-600 mb-1">📍 {hospital.address}</p>
        <p className="text-gray-600 mb-1">
          🌍 {hospital.district}, {hospital.state}
        </p>
        <p className="text-gray-600 mb-1">👨‍⚕️ Doctors: {hospital.doctors}</p>
        <p className="text-gray-600 mb-1">🛏️ Beds: {hospital.beds}</p>
        <p className="text-gray-600 mb-3">📞 {hospital.contact}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#10A245] text-white px-4 py-2 rounded-lg hover:bg-[#0e8d3b]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Icons
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});
const campIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// ✅ Recenter map around user with better zoom
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView(location, 14); // zooms closer than before
  }, [location]);
  return null;
}

const stateDistrictMap = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Salem", "Madurai", "Tirunelveli"],
  Kerala: ["Ernakulam", "Thrissur", "Kozhikode", "Kottayam"],
};

export default function NearestFacilityFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHospital, setActiveHospital] = useState(null);
  const [camps, setCamps] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchingNearby, setSearchingNearby] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(10);

  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Dermatology",
    "General Medicine",
  ];
  const states = ["All States", ...Object.keys(stateDistrictMap)];
  const districts =
    selectedState !== "All States"
      ? ["All Districts", ...stateDistrictMap[selectedState]]
      : ["All Districts"];

  // Fetch hospitals + camps
  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await axios.get("http://localhost:5000/api/hospitals");
        setHospitals(res.data);
      } catch (err) {
        setError("Failed to load hospitals. Showing fallback data.");
        setHospitals([
          {
            name: "Green Valley Clinic",
            lat: 10.98,
            lng: 76.96,
            specialty: "Cardiology",
            district: "Coimbatore",
            state: "Tamil Nadu",
            contact: "+91 98765 43210",
            doctors: 12,
            beds: 30,
            address: "12, Health Street, Coimbatore",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCamps() {
      try {
        const res = await axios.get("http://localhost:5000/api/camps");
        setCamps(res.data || []);
      } catch (err) {
        console.error("Failed to load camps:", err);
      }
    }

    fetchHospitals();
    fetchCamps();
  }, []);

  // ✅ Auto locate and fetch nearby
  useEffect(() => {
    async function autoLocateAndFetch() {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported, using fallback (Coimbatore).");
        setUserLocation([11.0168, 76.9558]);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          try {
            const res = await axios.get(
              `http://localhost:5000/api/hospitals/nearest?lat=${latitude}&lng=${longitude}`
            );
            setNearbyHospitals(res.data.data || []);
          } catch (err) {
            console.error("Nearby hospital fetch failed:", err);
          }
        },
        (err) => {
          console.warn("Location access denied:", err);
          setUserLocation([11.0168, 76.9558]);
        }
      );
    }
    autoLocateAndFetch();
  }, []);

  const filteredHospitals = hospitals.filter((h) => {
    const matchesName = h.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      h.specialty === selectedSpecialty;
    const matchesDistrict =
      selectedDistrict === "All Districts" || h.district === selectedDistrict;
    const matchesState =
      selectedState === "All States" || h.state === selectedState;
    return matchesName && matchesSpecialty && matchesDistrict && matchesState;
  });

  async function findNearbyHospitals() {
    setSearchingNearby(true);
    setNearbyHospitals([]);

    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      setSearchingNearby(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        try {
          const res = await axios.get(
            `http://localhost:5000/api/hospitals/nearest?lat=${latitude}&lng=${longitude}`
          );
          setNearbyHospitals(res.data.data || []);
        } catch (err) {
          console.error(err);
          alert("Could not fetch nearby hospitals.");
        } finally {
          setSearchingNearby(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Could not access your location.");
        setSearchingNearby(false);
      }
    );
  }

  if (loading) return <p className="text-center mt-10">Loading hospitals...</p>;
  if (error) console.warn(error);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-[#005086] mb-6">
        Hospitals Nearby
      </h1>

      {/* ✅ Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-3 items-center justify-center">
        <input
          type="text"
          placeholder="Search by hospital name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-[#005086]"
        />
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict("All Districts");
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 w-60 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086]"
        >
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-60 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086]"
        >
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-56 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086]"
        >
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {/* ✅ single distance slider */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium">Distance:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
            className="w-64 accent-[#005086]"
          />
          <span className="font-semibold text-[#005086]">
            {distanceFilter} km
          </span>
        </div>
        <button
          onClick={findNearbyHospitals}
          disabled={searchingNearby}
          className="bg-[#005086] text-white px-5 py-3 rounded-lg hover:bg-[#003f63] disabled:bg-gray-400"
        >
          {searchingNearby ? "Finding Nearby..." : "Find Nearby Hospitals"}
        </button>
      </div>

      {/* ✅ Map */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border">
        <MapContainer
          center={userLocation || [11.0168, 76.9558]}
          zoom={userLocation ? 14 : 6}
          style={{ height: "100%", width: "100%" }}
        >
          <RecenterMap location={userLocation} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* ✅ user marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here 📍</Popup>
            </Marker>
          )}

          {/* ✅ hospital markers */}
          {(nearbyHospitals.length ? nearbyHospitals : filteredHospitals)
            .filter((h) => {
              if (!userLocation) return true;
              const lat1 = userLocation[0],
                lon1 = userLocation[1];
              const lat2 = h.coordinates ? h.coordinates[1] : h.lat;
              const lon2 = h.coordinates ? h.coordinates[0] : h.lng;
              if (!lat2 || !lon2) return false;

              const R = 6371;
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLon = ((lon2 - lon1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos((lat1 * Math.PI) / 180) *
                  Math.cos((lat2 * Math.PI) / 180) *
                  Math.sin(dLon / 2) ** 2;
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const distance = R * c;
              return distance <= distanceFilter;
            })
            .map((h, i) => (
              <Marker
                key={i}
                position={
                  h.coordinates
                    ? [h.coordinates[1], h.coordinates[0]]
                    : [h.lat, h.lng]
                }
                icon={hospitalIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="text-[#005086] text-base">
                      {h.name}
                    </strong>
                    <p className="text-gray-600 mt-1">🏥 {h.specialty}</p>
                    <p className="text-gray-600">{h.address}</p>
                    <p className="text-gray-600">
                      🌍 {h.district}, {h.state}
                    </p>
                    {h.distanceInKm && (
                      <p className="text-gray-600">
                        📏 {h.distanceInKm} km away
                      </p>
                    )}
                    <button
                      onClick={() => setActiveHospital(h)}
                      className="mt-2 bg-[#10A245] text-white px-3 py-1 rounded-lg hover:bg-[#0d883d]"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* ✅ camp markers */}
          {camps
            .filter((c) => {
              if (!userLocation || !c.targetVillageId?.location?.coordinates)
                return true;
              const [lng, lat] = c.targetVillageId.location.coordinates;
              const lat1 = userLocation[0],
                lon1 = userLocation[1];
              const R = 6371;
              const dLat = ((lat - lat1) * Math.PI) / 180;
              const dLon = ((lng - lon1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos((lat1 * Math.PI) / 180) *
                  Math.cos((lat * Math.PI) / 180) *
                  Math.sin(dLon / 2) ** 2;
              const c2 = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const distance = R * c2;
              return distance <= distanceFilter;
            })
            .map((c, i) => {
              const village = c.targetVillageId;
              if (
                !village ||
                !village.location ||
                !village.location.coordinates
              )
                return null;
              const [lng, lat] = village.location.coordinates;
              return (
                <Marker key={i} position={[lat, lng]} icon={campIcon}>
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-[#B91C1C] text-base">
                        {village.name || "Camp Location"}
                      </strong>
                      <p className="text-gray-600">🏕️ Status: {c.status}</p>
                      <p className="text-gray-600">
                        🌍 {village.district || "Unknown District"}
                      </p>
                      <p className="text-gray-600">
                        ⚙️ Severity:{" "}
                        {c.severityScore?.toFixed(2) || "N/A"}
                      </p>
                      {c.servicesRecommended?.length > 0 && (
                        <p className="text-gray-600">
                          🩺 Services:{" "}
                          {c.servicesRecommended.join(", ")}
                        </p>
                      )}
                      {c.reasons?.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                          ⚠️ {c.reasons.join("; ")}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      <HospitalModal
        hospital={activeHospital}
        onClose={() => setActiveHospital(null)}
      />
    </div>
  );
}
