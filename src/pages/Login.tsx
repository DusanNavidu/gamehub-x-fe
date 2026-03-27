import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestOTP, verifyOTPCode } from "../service/auth";
import { useAuth } from "../context/authContext";
import { Mail, KeyRound, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Toast wenuwata inline error pennamu lassanata

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await requestOTP(email);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          "Connection lost. Cannot reach the server.",
      );
    } finally {
      setLoading(false);
    }
  };

  // handleVerify function eka athule update karanna:

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await verifyOTPCode(email, otp);
      const data = res.data?.data || res.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data.id);

      setUser({ id: data.id, role: data.role, token: data.accessToken });

      toast.success("Access Granted. Booting system...");

      // Role eka anuwa redirect kirima
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/player/dashboard"); // Player dashboard ekata
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Invalid clearance code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Lassan Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-[300px] h-[300px] bg-green-900/20 rounded-full blur-[80px] bottom-10 right-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0a0a0a]/80 border border-green-500/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl z-10 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-black border border-green-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <KeyRound className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest mb-1">
            TERMINAL LOGIN
          </h1>
          <p className="text-gray-500 text-xs tracking-widest">
            AUTHENTICATION REQUIRED
          </p>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded flex items-start gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-green-500 uppercase tracking-widest font-bold">
                Designation (Email)
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-gray-700"
                  placeholder="player@matrix.com"
                />
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "TRANSMITTING..." : "REQUEST ACCESS CODE"}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
            <p className="text-center text-gray-500 text-xs mt-6">
              New Operative?{" "}
              <Link
                to="/register"
                className="text-white hover:text-green-400 border-b border-green-500/30 pb-0.5 ml-1 transition-colors"
              >
                Create Profile
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg text-center mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                Code transmitted to
              </p>
              <p className="text-sm text-green-400 font-bold">{email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-green-500 uppercase tracking-widest font-bold">
                Clearance Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all font-bold"
                placeholder="------"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "ENTER NEXUS"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMsg("");
              }}
              className="w-full text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest mt-2"
            >
              Modify Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
