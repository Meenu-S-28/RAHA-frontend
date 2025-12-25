import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


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
export default function ExploreVillages() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVillage, setActiveVillage] = useState(null);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [districtFilter, setDistrictFilter] = useState("All Districts");

  const stateOptions = Object.keys(stateDistrictMap);
  const districtOptions =
    stateDistrictMap[stateFilter] || ["All Districts"];

  useEffect(() => {
  axios
    .get(`${API_URL}/villages`)
    .then((res) => setVillages(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);


  const filtered = villages.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (stateFilter !== "All States") {
      const match = stateDistrictMap[stateFilter]?.includes(v.district);
      if (!match) return false;
    }

    if (districtFilter !== "All Districts" && v.district !== districtFilter)
      return false;

    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading villages...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center gap-4 mb-6">
            <Link
                to="/explore"
                className="text-[#005086] font-semibold hover:underline flex items-center gap-1"
            >
                <span className="text-xl">←Back</span> 
            </Link>

            <h1 className="text-3xl font-bold text-[#005086]">
                Explore Villages
            </h1>
        </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by village name"
          className="border rounded-lg px-4 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

        <select
          className="border rounded-lg px-4 py-2 w-52"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          {districtOptions.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#005086] text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Population</th>
              <th className="px-4 py-3">Access Score</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="px-4 py-3">{v.name}</td>
                <td className="px-4 py-3">{v.district}</td>
                <td className="px-4 py-3">{v.population}</td>
                <td className="px-4 py-3">{v.accessScore?.toFixed(4)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setActiveVillage(v)}
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
                  No villages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {activeVillage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]"
          onClick={() => setActiveVillage(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[450px] shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-3 text-xl"
              onClick={() => setActiveVillage(null)}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {activeVillage.name}
            </h2>

            <p className="text-gray-600">
              District: {activeVillage.district}
            </p>
            <p className="text-gray-600">
              Population: {activeVillage.population}
            </p>

            <p className="text-gray-600 mt-2">
              Access Score: {activeVillage.accessScore?.toFixed(6)}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Nearest Hospitals:</h3>

              {activeVillage.nearestHospitals?.length > 0 ? (
                <ul className="text-sm text-gray-700">
                  {activeVillage.nearestHospitals.map((h, i) => (
                    <li key={i}>
                      {h} – {activeVillage.nearestHospitalsDistance?.[i]?.toFixed(2)} km
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
