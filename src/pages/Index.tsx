import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, LogIn, UserPlus } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  
  const [showIntro, setShowIntro] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);

  useEffect(() => {
    setZoomLogo(true);
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // 1. INTRO ANIMATION SCREEN
  // ==========================================
  if (showIntro) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden px-4">
        <div 
          className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${
            zoomLogo ? "scale-100 sm:scale-125 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <Gamepad2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mb-4 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-center">
            GAME<span className="text-green-500">HUB</span><span className="text-gray-600 hidden sm:inline">-X</span>
          </h1>
          <p className="mt-4 text-green-500/70 font-mono tracking-widest text-xs sm:text-sm animate-pulse text-center">
            INITIALIZING SYSTEM...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN LANDING PAGE SCREEN
  // ==========================================
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed relative font-mono transition-opacity duration-1000 ease-in flex items-center"
      style={{
        // METHANATA OYAGE KAMATHI BACKGROUND IMAGE LINK EKA DANNA
        backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')"
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/85 md:bg-black/75 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>

      <div className="relative z-10 flex flex-col w-full min-h-screen justify-center items-center px-4 py-8 sm:p-6 text-center max-w-7xl mx-auto">
        
        {/* Header Logo */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-8 sm:mb-10 animate-[bounce_2s_ease-in-out_infinite]">
          <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
            GAME<span className="text-green-500">HUB</span><span className="text-gray-400 sm:text-white">-X</span>
          </h1>
        </div>

        {/* Site Description Box */}
        <div className="w-full max-w-3xl backdrop-blur-md bg-black/50 border border-green-500/30 p-6 sm:p-8 md:p-12 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] mb-10 sm:mb-12 transform transition-all hover:border-green-500/50">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-wide leading-tight">
            THE ULTIMATE <span className="text-green-400 block sm:inline mt-1 sm:mt-0">GAMING NEXUS</span>
          </h2>
          <p className="text-gray-400 sm:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-0">
            Welcome to the next generation of interactive entertainment. GameHub-X offers a seamless, passwordless gaming experience. Dive into exclusive 2D modules, dominate the leaderboards, and connect with other operatives.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md sm:max-w-lg mx-auto">
          
          {/* Login Button */}
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-4 px-6 rounded-xl font-bold tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)] group active:scale-95"
          >
            <LogIn className="w-5 h-5 group-hover:-translate-y-1 sm:group-hover:translate-x-1 sm:group-hover:-translate-y-0 transition-transform" />
            LOGIN
          </button>

          {/* Register Button */}
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-transparent border-2 border-white/80 hover:border-green-400 hover:text-green-400 text-white py-4 px-6 rounded-xl font-bold tracking-widest transition-all hover:scale-105 hover:bg-white/5 active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            CREATE ID
          </button>
          
        </div>

      </div>
    </div>
  );
}