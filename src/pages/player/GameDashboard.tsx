import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize } from "lucide-react";
import { Game } from "./PlayerDashboard"; // PlayerDashboard එකෙන් Game interface එක import කරගන්නවා

// Router එකෙන් එන state එකේ type එක define කරනවා
interface LocationState {
  gameData?: Game;
}

export default function GameDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Location state එක type cast කරනවා
  const state = location.state as LocationState;
  const gameData = state?.gameData;

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

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
      {/* වෙනස් කළේ: flex-grow h-full අයින් කරලා flex-1 දැම්මා */}
      <div className="flex-1 w-full bg-black relative min-h-0">
        <iframe
          src={gameData.gameUrl}
          className="absolute inset-0 w-full h-full border-none"
          title={gameData.title}
          allow="fullscreen; autoplay"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
      
    </div>
  );
}