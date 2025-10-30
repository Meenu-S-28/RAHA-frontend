import { useState } from "react";
import docRural1 from "../assets/ruralDoc1.png";

export default function Login() {
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image Section */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-gradient-to-br from-[#e6f7f0] to-[#cce5ff]">
        <img
          src={docRural1}
          alt="Healthcare Providers"
          className="max-w-md object-contain drop-shadow-lg"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
          <h1 className="text-2xl font-bold text-[#005086] mb-6">
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

          <p className="text-sm text-gray-600 mt-6 text-center">
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
    </div>
  );
}
