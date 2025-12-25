import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/* -----------------------------------------------
   STATE–DISTRICT MAP
------------------------------------------------ */
const stateDistrictMap = {
  "All States": [],
  "Andhra Pradesh": [
    "All Districts",
    "Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor",
    "East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool",
    "Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam",
    "Sri Potti Sriramulu Nellore","Sri Sathya Sai","Srikakulam","Tirupati",
    "Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"
  ],
  "Karnataka": [
    "All Districts",
    "Bagalkote","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar",
    "Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga",
    "Dakshina Kannada","Davangere","Dharwad","Gadag","Hassan","Haveri",
    "Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur",
    "Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"
  ],
  "Kerala": [
    "All Districts",
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam",
    "Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram",
    "Thrissur","Wayanad"
  ],
  "Tamil Nadu": [
    "All Districts",
    "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri",
    "Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur",
    "Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal",
    "Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem",
    "Sivagangai","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
    "Tirunelveli","Tirupattur","Tiruppur","Tiruvallur","Tiruvannamalai",
    "Tiruvarur","Vellore","Viluppuram","Virudhunagar"
  ],
  "Telangana": [
    "All Districts",
    "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial",
    "Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy",
    "Karimnagar","Khammam","Komaram Bheem Asifabad","Mahabubabad",
    "Mahabubnagar","Mancherial","Medak","Medchal–Malkajgiri","Mulugu",
    "Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
    "Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet",
    "Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"
  ],
};

/* -----------------------------------------------
   MAIN COMPONENT
------------------------------------------------ */
export default function ExploreHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeHospital, setActiveHospital] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [districtFilter, setDistrictFilter] = useState("All Districts");

  const stateOptions = Object.keys(stateDistrictMap);
  const districtOptions = stateDistrictMap[stateFilter] || [];

  /* -----------------------------------------------
     FETCH HOSPITALS
  ------------------------------------------------ */
  useEffect(() => {
  axios
    .get(`${API_URL}/hospitals`)
    .then((res) => setHospitals(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);


  /* -----------------------------------------------
     FILTER PIPELINE
  ------------------------------------------------ */
  const filtered = hospitals.filter((h) => {
    if (search && !h.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (stateFilter !== "All States") {
      if (!stateDistrictMap[stateFilter].includes(h.district)) return false;
    }

    if (districtFilter !== "All Districts" && h.district !== districtFilter) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading hospitals...</div>;
  }

  /* -----------------------------------------------
     UI
  ------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">

        {/* Back + Title */}
        <div className="flex items-center gap-4">
          <Link
            to="/explore"
            className="text-[#005086] font-semibold hover:underline flex items-center gap-1"
          >
            <span className="text-xl">← Back</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#005086]">
            Explore Hospitals
          </h1>
        </div>

        {/* Add hospital button */}
        <Link
          to="/add-hospital"
          className="bg-[#005086] text-white px-4 py-2 rounded-lg shadow hover:bg-[#003f63]"
        >
          Add Hospital
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name"
          className="border rounded-lg px-4 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* State */}
        <select
          className="border rounded-lg px-4 py-2 w-52"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setDistrictFilter("All Districts");
          }}
        >
          {stateOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* District */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 w-52"
        >
          {/* Placeholder when no state */}
          {stateFilter === "All States" && (
            <option value="" disabled>
              Select a State First
            </option>
          )}

          {/* Show All Districts only if state selected */}
          {stateFilter !== "All States" && (
            <option value="All Districts">All Districts</option>
          )}

          {/* District list */}
          {stateFilter !== "All States" &&
            districtOptions
              .filter((d) => d !== "All Districts")
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#005086] text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Facilities</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((h) => (
              <tr key={h._id} className="border-b">
                <td className="px-4 py-3">{h.name}</td>
                <td className="px-4 py-3">{h.type}</td>
                <td className="px-4 py-3">{h.district}</td>
                <td className="px-4 py-3 text-sm">
                  {(h.services || []).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setActiveHospital(h)}
                    className="text-[#005086] underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No hospitals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {activeHospital && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]"
          onClick={() => setActiveHospital(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[420px] shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-3 text-xl"
              onClick={() => setActiveHospital(null)}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">{activeHospital.name}</h2>
            <p className="text-gray-600 mb-1">Type: {activeHospital.type}</p>
            <p className="text-gray-600 mb-1">District: {activeHospital.district}</p>
            <p className="text-gray-600 mb-1">
              Facilities: {(activeHospital.services || []).join(", ")}
            </p>
            <p className="text-gray-600 mb-1">
              Doctors: {activeHospital.doctors ?? "N/A"}
            </p>
            <p className="text-gray-600">
              Beds: {activeHospital.beds ?? "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
