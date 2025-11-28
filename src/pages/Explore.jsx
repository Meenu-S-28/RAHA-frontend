import { Link } from "react-router-dom";

export default function Explore() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-bold text-[#005086] mb-8">
        Explore Data
      </h1>

      {/* container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

        {/* Hospitals Card */}
        <Link
          to="/explore/hospitals"
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition cursor-pointer border border-gray-200"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2972/2972128.png"
            alt="Hospitals"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-[#005086]">
            Explore Hospitals
          </h2>
          <p className="text-sm text-gray-600 mt-2 text-center">
            View all registered medical facilities, filter by state, district, type and more.
          </p>
        </Link>

        {/* Villages Card */}
        <Link
          to="/explore/villages"
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition cursor-pointer border border-gray-200"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995516.png"
            alt="Villages"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-[#005086]">
            Explore Villages
          </h2>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Browse rural settlements, population details, access scores, and nearest hospitals.
          </p>
        </Link>

      </div>
    </div>
  );
}
