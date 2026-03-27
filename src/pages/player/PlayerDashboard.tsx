import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Play, Loader2 } from "lucide-react";
import { useAuth } from "../../context/authContext"; 

export interface Game {
  id?: string; // Spring Boot එකෙන් එන්නේ id කියලා
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  thumbnailUrl: string;
  gameUrl: string;
}

export default function PlayerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Backend එකේ URL එක (ඔයාගේ port එක වෙනස් නම් මෙතන හදන්න)
  const API_BASE_URL = "http://localhost:8080"; 

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // ඔයාගේ token එකක් තියෙනවා නම් ඒක යවන්න ඕනේ (Security configuration අනුව)
        const token = localStorage.getItem("accessToken"); // Auth token එක තියෙන තැනින් ගන්න

        const response = await fetch(`${API_BASE_URL}/api/v1/games`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }); 

        if (!response.ok) throw new Error("Failed to fetch games");
        
        const result = await response.json();
        
        // Spring Boot එකේ APIResponse එකේ 'data' කියන field එක ඇතුලේ තමයි array එක එන්නේ
        // (ඔයාගේ APIResponse class එකේ නම වෙනස් නම් (උදා: payload), 'result.data' වෙනුවට ඒක දාන්න)
        if (result && result.data) {
          setGames(result.data);
        } else {
          setGames([]);
        }

      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handlePlayGame = (game: Game) => {
    if (game.gameUrl) {
      // URL එක හදාගන්නවා
      const fullGameUrl = game.gameUrl.startsWith("http") 
        ? game.gameUrl 
        : `${API_BASE_URL}${game.gameUrl.startsWith('/') ? '' : '/'}${game.gameUrl}`;

      // අලුත් URL එකත් එක්ක game object එක හදාගන්නවා
      const updatedGame = { ...game, gameUrl: fullGameUrl };
      
      // මෙතන අනිවාර්යයෙන්ම 'gameData' කියන නමම පාවිච්චි කරන්න
      navigate('/player/play', { state: { gameData: updatedGame } }); 
    } else {
      alert("ERROR: Game URL is missing!");
    }
  };

  return (
    <div className="p-4 sm:p-10 font-mono text-white">
      <header className="flex justify-between items-center mb-10 border-b border-green-500/20 pb-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-widest text-green-500 uppercase">
          AVAILABLE_MODULES
        </h2>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          <span className="ml-3 text-green-500">LOADING_MODULES...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <div 
                key={game.id} 
                className="bg-[#0a0a0a] border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group flex flex-col"
              >
                <div className="w-full h-40 bg-green-500/5 rounded-lg mb-4 flex items-center justify-center border border-green-500/10 overflow-hidden relative">
                  {game.thumbnailUrl ? (
                    <img 
                      src={game.thumbnailUrl.startsWith("http") 
                        ? game.thumbnailUrl 
                        // මෙතන අගට තිබ්බ '/' එක අයින් කරා, එතකොට double slash එන්නේ නෑ
                        : `${API_BASE_URL}${game.thumbnailUrl.startsWith('/') ? '' : '/'}${game.thumbnailUrl}`
                      } 
                      alt={game.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                    />
                  ) : (
                    <Gamepad2 className="w-16 h-16 text-green-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1 tracking-tighter uppercase">
                  {game.title}
                </h3>
                <span className="text-xs text-green-500 mb-2">{game.categoryName}</span>
                
                <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3">
                  {game.description}
                </p>
                
                <button 
                  onClick={() => handlePlayGame(game)}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded flex items-center justify-center gap-2 mt-auto transition-colors"
                >
                  <Play className="w-4 h-4 fill-black" /> START_MODULE
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-10">
              NO_MODULES_FOUND_IN_SYSTEM
            </div>
          )}
        </div>
      )}
    </div>
  );
}