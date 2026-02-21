import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp }, { withCredentials: true });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Verify Your Email</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          OTP sent to <span className="font-medium text-indigo-600">{email}</span>
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text" required maxLength={6}
              value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full mt-1 px-4 py-2 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Wrong email?{" "}
          <span onClick={() => navigate("/register")} className="text-indigo-600 font-medium cursor-pointer hover:underline">
            Go back
          </span>
        </p>
      </div>
    </div>
  );
}
