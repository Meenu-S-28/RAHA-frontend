import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Modal Component
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
          🌍 {hospital.location}, {hospital.district}, {hospital.state}
        </p>
        <p className="text-gray-600 mb-1">👨‍⚕️ Doctors: {hospital.doctors}</p>
        <p className="text-gray-600 mb-3">📞 {hospital.contact}</p>
        <p className="text-gray-600 text-sm">
          🕓 Open: 8 AM – 8 PM <br />
          🧾 Services: Emergency, OPD, Pharmacy
        </p>
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

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});

// --- STATES & DISTRICTS DATA ---
const stateDistrictMap = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Upper Siang", "Lower Siang", "Siang", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kanker", "Kabirdham", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  // You can add the rest following this pattern...
};

export default function NearestFacilityFinder() {
  const allHospitals = [
    {
      name: "Green Valley Clinic",
      lat: 10.98,
      lng: 76.96,
      specialty: "Cardiology",
      location: "Coimbatore",
      district: "Coimbatore",
      state: "Tamil Nadu",
      contact: "+91 98765 43210",
      doctors: 12,
      address: "12, Health Street, Coimbatore",
    },
  ];

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Dermatology",
    "General Medicine",
  ];

  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [activeHospital, setActiveHospital] = useState(null);

  const states = ["All States", ...Object.keys(stateDistrictMap)];
  const districts =
    selectedState !== "All States"
      ? ["All Districts", ...stateDistrictMap[selectedState]]
      : ["All Districts"];

  const filteredHospitals = allHospitals.filter((h) => {
    const matchesName = h.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" || h.specialty === selectedSpecialty;
    const matchesDistrict =
      selectedDistrict === "All Districts" || h.district === selectedDistrict;
    const matchesState =
      selectedState === "All States" || h.state === selectedState;
    return matchesName && matchesSpecialty && matchesDistrict && matchesState;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-[#005086] mb-6">
        Hospitals Nearby
      </h1>

      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search by hospital name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-[#005086] transition-all duration-200"
        />

        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict("All Districts");
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 w-60 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086] transition-all duration-200"
        >
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-60 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086] transition-all duration-200"
        >
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-56 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086] transition-all duration-200"
        >
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>


      {/* MAP */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border">
        <MapContainer
          center={[10.98, 76.96]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {filteredHospitals.map((h, i) => (
            <Marker key={i} position={[h.lat, h.lng]} icon={hospitalIcon}>
              <Popup>
                <div className="text-sm">
                  <strong className="text-[#005086] text-base">{h.name}</strong>
                  <p className="text-gray-600 mt-1">🏥 {h.specialty}</p>
                  <p className="text-gray-600">📍 {h.address}</p>
                  <p className="text-gray-600">
                    🌍 {h.location}, {h.district}, {h.state}
                  </p>
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
        </MapContainer>
      </div>

      <HospitalModal
        hospital={activeHospital}
        onClose={() => setActiveHospital(null)}
      />
    </div>
  );
}
