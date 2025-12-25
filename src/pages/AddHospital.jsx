import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// SAME list you used earlier
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
    "Bagalkote","Ballari","Belagavi","Benghirur Rural","Bengaluru Urban","Bidar",
    "Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga","Dakshina Kannada",
    "Davangere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar",
    "Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru",
    "Udupi","Uttara Kannada","Vijayapura","Yadgir"
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
    "Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Perambalur",
    "Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivagangai","Tenkasi",
    "Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupattur",
    "Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram",
    "Virudhunagar"
  ],
  "Telangana": [
    "All Districts",
    "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon",
    "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
    "Komaram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak",
    "Medchal–Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal",
    "Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet",
    "Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"
  ]
};

const typesList = ["Clinic", "PHC", "District Hospital", "Charitable Hospital"];

const facilitiesList = [
  "OPD","Emergency","X-Ray","Maternity","ICU","Surgery","Diagnostics","Pharmacy",
  "Pediatrics","Obstetrics","Radiology","Laboratory","Ambulance","Blood Bank",
  "Telemedicine","Mental Health","Physiotherapy","Dental","Vaccination","Dialysis"
];

export default function AddHospital() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Clinic");
  const [state, setState] = useState("All States");
  const [district, setDistrict] = useState("All Districts");
  const [doctors, setDoctors] = useState("");
  const [beds, setBeds] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");
  const [services, setServices] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [successPopup, setSuccessPopup] = useState(false);

  const districtOptions = stateDistrictMap[state] || ["All Districts"];

  function toggleService(f) {
    setServices(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  }

  // Auto ID generator
  const generateHospitalId = () => "H" + Date.now();

  function detectLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      }
    );
  }

  function resetForm() {
    setName("");
    setType("Clinic");
    setState("All States");
    setDistrict("All Districts");
    setDoctors("");
    setBeds("");
    setAdmissionFee("");
    setServices([]);
    setLat("");
    setLng("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      hospitalId: generateHospitalId(),
      name,
      type,
      district,
      doctors: Number(doctors),
      beds: Number(beds),
      admissionFee: Number(admissionFee),
      services,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)]
      }
    };

    try {
      await axios.post(`${API_URL}/hospitals`, payload);

      resetForm();                  // Clear everything
      setSuccessPopup(true);        // Show popup

      setTimeout(() => setSuccessPopup(false), 2000); // Auto-close
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">

      {/* Success Popup */}
      {successPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
          <div className="bg-white px-8 py-6 rounded-xl shadow-xl text-center text-[#005086] text-xl font-semibold">
            Facility Added Successfully!
          </div>
        </div>
      )}

      {/* Back + Title */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/explore" className="text-[#005086] font-medium text-lg">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-[#005086]">Add Your Facility</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Facility Name</label>
          <input
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Type</label>
          <select
            className="border w-full p-2 rounded"
            value={type}
            onChange={(e)=>setType(e.target.value)}
            required
          >
            {typesList.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* State + District */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-medium block mb-1">State</label>
            <select
              className="border w-full p-2 rounded"
              value={state}
              onChange={(e)=>{
                setState(e.target.value);
                setDistrict("All Districts");
              }}
            >
              {Object.keys(stateDistrictMap).map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium block mb-1">District</label>
            <select
              className="border w-full p-2 rounded"
              value={district}
              onChange={(e)=>setDistrict(e.target.value)}
            >
              {districtOptions.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Doctors / Beds / Fee */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="font-medium block mb-1">Doctors</label>
            <input
              type="number"
              className="border w-full p-2 rounded"
              value={doctors}
              onChange={(e)=>setDoctors(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium block mb-1">Beds</label>
            <input
              type="number"
              className="border w-full p-2 rounded"
              value={beds}
              onChange={(e)=>setBeds(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium block mb-1">Admission Fee</label>
            <input
              type="number"
              className="border w-full p-2 rounded"
              value={admissionFee}
              onChange={(e)=>setAdmissionFee(e.target.value)}
            />
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <label className="font-medium block mb-2">Facilities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {facilitiesList.map(f => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={services.includes(f)}
                  onChange={()=>toggleService(f)}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="font-medium block mb-2">Location</label>

          <button
            type="button"
            onClick={detectLocation}
            className="bg-[#005086] text-white px-4 py-2 rounded mb-3 hover:bg-[#003f63]"
          >
            Use My Current Location
          </button>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Latitude"
              className="border p-2 rounded"
              value={lat}
              onChange={(e)=>setLat(e.target.value)}
              required
            />
            <input
              placeholder="Longitude"
              className="border p-2 rounded"
              value={lng}
              onChange={(e)=>setLng(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#005086] text-white py-3 rounded-lg font-medium text-lg hover:bg-[#003f63]"
        >
          Submit Facility
        </button>
      </form>
    </div>
  );
}
