import { useState } from "react";
import imagebg from "../assets/imagebg4.jpeg";

export default function Login() {
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imagebg})` }}
    >
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-[400px] backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-[#005086] mb-6 text-center">
          Admin / Provider Login
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded-md focus:outline-[#10A245]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-md focus:outline-[#10A245]"
          />

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 rounded-md focus:outline-[#10A245]"
            />
          )}

          {!otpSent ? (
            <button
              type="button"
              className="w-full bg-[#10A245] text-white py-2 rounded-lg hover:bg-[#0e8d3b]"
              onClick={() => setOtpSent(true)}
            >
              Send OTP
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-[#005086] text-white py-2 rounded-lg hover:bg-[#004070]"
            >
              Login
            </button>
          )}
        </form>

        <p className="text-sm text-gray-700 mt-6 text-center">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-[#005086] font-medium hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
