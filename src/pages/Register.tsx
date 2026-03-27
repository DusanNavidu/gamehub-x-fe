import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service/auth";
import { Mail, User, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      await register(fullName, email);
      setSuccessMsg("Profile created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Thathpara 2kin auto login ekata yanawa
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Connection lost. Cannot reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-green-500 to-transparent opacity-50"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] top-20 right-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#0a0a0a]/80 border border-green-500/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl z-10 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-black border border-green-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <User className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest mb-1">CREATE ID</h1>
          <p className="text-gray-500 text-xs tracking-widest">NEW PLAYER REGISTRATION</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded flex items-start gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-xs text-green-400 font-bold tracking-wide">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Player Tag (Full Name)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-gray-700"
                placeholder="E.g. John Wick"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Communication Link (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-gray-700"
                placeholder="player@matrix.com"
              />
            </div>
          </div>

          <button disabled={loading || !!successMsg} type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 mt-4">
            {loading ? "ENCRYPTING..." : "CREATE PROFILE"}
          </button>

          <p className="text-center text-gray-500 text-xs mt-6">
            Active ID Found? <Link to="/login" className="text-white hover:text-green-400 border-b border-green-500/30 pb-0.5 ml-1 transition-colors">Terminal Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}