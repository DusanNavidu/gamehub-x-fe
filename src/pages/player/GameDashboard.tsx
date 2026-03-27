import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize, Loader2 } from "lucide-react"; // Loader2 import කළා
import { Game } from "./PlayerDashboard";

interface LocationState {
  gameData?: Game;
}

export default function GameDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as LocationState;
  const gameData = state?.gameData;

  // 🔴 අලුත් State ටික (HTML එකයි Loading එකයි තියාගන්න)
  const [gameHtml, setGameHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  // 🔴 Game URL එකෙන් HTML කෝඩ් එක Fetch කරන කොටස 🔴
  useEffect(() => {
    const fetchGameContent = async () => {
      if (!gameData?.gameUrl) return;

      try {
        setLoading(true);
        // Cloudinary ලින්ක් එකෙන් file එක text එකක් විදිහට ගන්නවා
        const response = await fetch(gameData.gameUrl);
        const htmlText = await response.text();
        
        setGameHtml(htmlText);
      } catch (error) {
        console.error("Failed to load game content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameContent();
  }, [gameData?.gameUrl]);

  if (!gameData || !gameData.gameUrl) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-mono p-4">
        <p className="text-red-500 mb-4 border border-red-500/30 bg-red-500/10 p-4 rounded uppercase">
          ERROR: MODULE_DATA_NOT_FOUND
        </p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-green-500 border border-green-500/50 hover:bg-green-500/10 px-6 py-2 rounded transition-all uppercase"
        >
          RETURN_TO_NEXUS
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col font-mono text-white overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="p-4 border-b border-green-500/20 flex items-center justify-between shrink-0 bg-[#0a0a0a]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors uppercase text-sm md:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">EXIT_MODULE</span>
        </button>
        
        <h1 className="text-lg md:text-xl font-bold tracking-widest uppercase text-green-500 text-center flex-grow">
          {gameData.title}
        </h1>
        
        <button 
          onClick={handleFullscreen}
          className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 uppercase text-sm md:text-base"
        >
          <Maximize className="w-5 h-5" />
          <span className="hidden sm:inline">FULLSCREEN</span>
        </button>
      </header>

      {/* Game Iframe Container */}
      <div className="flex-1 w-full bg-black relative min-h-0">
        
        {/* 🔴 Loading Screen එක 🔴 */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 bg-[#050505] z-10">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-mono text-sm tracking-widest uppercase">Initializing Nexus Module...</p>
          </div>
        )}
        
        {/* 🔴 srcDoc පාවිච්චි කරන අලුත් Iframe එක 🔴 */}
        {gameHtml && !loading && (
          <iframe
            srcDoc={gameHtml}
            className="absolute inset-0 w-full h-full border-none"
            title={gameData.title}
            allow="fullscreen; autoplay"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
      
    </div>
  );
}