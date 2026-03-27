import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Filter } from "lucide-react";
import { useAuth } from "../../context/authContext"; 
import GameCard from "../../components/GameCard";
import GameDetailsModal from "../../components/GameDetailsModal";
import { getAllGamesProtocol } from "../../service/game"; // API Protocol ekathu kara
import { toast } from "react-toastify";

// Interface update kara MongoDB structures walata
export interface Game {
  _id?: string;
  title: string;
  description: string;
  categoryId: any; // Populated object or string
  categoryName?: string;
  thumbnailUrl: string;
  gameUrl: string;
  status: string;
}

export default function PlayerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // New States for Search, Filter & Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const result = await getAllGamesProtocol();
      
      if (result && result.data) {
        // Active games vitharak filter karala format karanawa
        const activeGames = result.data
          .filter((game: Game) => game.status === 'ACTIVE')
          .map((game: any) => ({
            ...game,
            // populate wela ena category eken name eka ganna
            categoryName: game.categoryId?.name || "Uncategorized" 
          }));
        setGames(activeGames);
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to establish link with Nexus.");
    } finally {
      setIsLoading(false);
    }
  };

  // Unique Categories hadagannawa
  const categories = useMemo(() => {
    const uniqueCats = new Set(games.map(g => g.categoryName).filter(Boolean));
    return ["ALL", ...Array.from(uniqueCats)] as string[];
  }, [games]);

  // Search saha Category filter
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || game.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  const handlePlayGame = (game: Game) => {
    if (game.gameUrl) {
      // Cloudinary URLs direct use karanawa
      navigate('/player/play', { state: { gameData: game } }); 
    } else {
      toast.error("ERROR: Game payload missing!");
    }
  };

  const openDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 sm:p-8 font-mono text-white selection:bg-green-500/30">
      
      {/* Header & Search Area */}
      <header className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] uppercase mb-6 flex items-center gap-3">
          <span className="w-3 h-8 bg-green-500 inline-block rounded-sm"></span>
          NEXUS_MODULE_LIBRARY
        </h2>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH_MODULES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-gray-600"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            <Filter className="w-4 h-4 text-gray-500 shrink-0 mr-1 hidden sm:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                  : 'bg-[#111] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          <span className="text-green-500/70 uppercase tracking-widest text-sm animate-pulse">Establishing Link...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard 
                  key={game._id} // MongoDB Use _id
                  game={game} 
                  apiBaseUrl="" // API Base oni na Cloudinary nisa
                  onPlay={handlePlayGame} 
                  onDetails={openDetails} 
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#0a0a0a]/50 rounded-xl border border-gray-800 border-dashed">
                <span className="text-gray-500 text-lg uppercase tracking-widest">No Modules Found</span>
                <span className="text-gray-600 text-xs mt-2">Adjust search or classification parameters</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Game Details Modal */}
      <GameDetailsModal 
        game={selectedGame} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPlay={handlePlayGame}
        apiBaseUrl=""
      />
    </div>
  );
}