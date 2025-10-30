import docRural1 from "../assets/ruralDoc1.png";

export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image Section */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-gradient-to-br from-[#e6f7f0] to-[#cce5ff]">
        <img
          src={docRural1}
          alt="Rural Healthcare Team"
          className="max-w-md object-contain drop-shadow-lg"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[450px]">
          <h1 className="text-2xl font-bold text-[#10A245] mb-6">
            Healthcare Provider Signup
          </h1>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Organisation Name"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />
            <input
              type="number"
              placeholder="Number of Doctors"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />
            <input
              type="file"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />

            <button
              type="submit"
              className="w-full bg-[#005086] text-white py-2 rounded-lg hover:bg-[#004070]"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#005086] font-medium hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
