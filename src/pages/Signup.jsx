import imagebg from "../assets/imagebg4.jpeg";

export default function Signup() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imagebg})` }}
    >
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-[450px] backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-[#10A245] mb-6 text-center">
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

        <p className="text-sm text-gray-700 mt-6 text-center">
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
  );
}
