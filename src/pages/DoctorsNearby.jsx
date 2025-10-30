import { useState } from "react";
import { FaUserMd } from "react-icons/fa";

export default function DoctorsNearby() {
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Pediatrics",
    "General Medicine",
    "Orthopedics",
    "Gynecology",
    "Dentistry",
    "Dermatology",
  ];

  const doctors = [
    {
      name: "Dr. Ananya Sharma",
      specialty: "Cardiology",
      regNo: "TNMC 2021/04567",
      hospital: "City Heart Hospital",
      description: "Expert in cardiac care with 10+ years of experience.",
      image: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
    },
    {
      name: "Dr. Ramesh Kumar",
      specialty: "Orthopedics",
      regNo: "TNMC 2019/03211",
      hospital: "Green Valley Clinic",
      description: "Specialist in bone and joint treatments.",
      image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    },
    {
      name: "Dr. Priya Iyer",
      specialty: "Gynecology",
      regNo: "TNMC 2020/05672",
      hospital: "Sunrise Health Centre",
      description: "Focused on women’s health and prenatal care.",
      image: "https://cdn-icons-png.flaticon.com/512/921/921077.png",
    },
    {
      name: "Dr. Arjun Nair",
      specialty: "Pediatrics",
      regNo: "TNMC 2022/06651",
      hospital: "Happy Kids Hospital",
      description: "Dedicated pediatrician with compassion for child health.",
      image: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
    },
  ];

  const filteredDoctors = doctors.filter(
    (doc) =>
      (selectedSpecialty === "All Specialties" ||
        doc.specialty === selectedSpecialty) &&
      doc.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-[#005086] mb-6 text-center">
        Nearest Doctor Finder
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Find doctors near you based on specialty or hospital name.
      </p>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10 flex flex-wrap justify-center gap-4">
        <input
          type="text"
          placeholder="Search by doctor or hospital name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-72 focus:outline-none focus:ring-2 focus:ring-[#005086]"
        />
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-60 bg-white focus:outline-none focus:ring-2 focus:ring-[#005086]"
        >
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Doctor Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {filteredDoctors.map((doc, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 w-72 hover:shadow-lg transition duration-300"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-[#10A245]"
            />
            <h3 className="text-xl font-semibold text-[#005086]">{doc.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{doc.specialty}</p>
            <p className="text-sm text-gray-500 mb-2">{doc.hospital}</p>
            <p className="text-sm text-gray-500 italic mb-2">{doc.regNo}</p>
            <p className="text-sm text-gray-600">{doc.description}</p>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No doctors found matching your criteria.
        </p>
      )}
    </div>
  );
}
