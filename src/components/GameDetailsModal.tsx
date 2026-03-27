import React from 'react';
import { X, Play, Terminal } from 'lucide-react';
import Button from './Button';
import { Game } from '../pages/player/PlayerDashboard'; // ඔයාගේ path එක හරියටම දාගන්න

interface GameDetailsModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (game: Game) => void;
  apiBaseUrl: string;
}

export default function GameDetailsModal({ game, isOpen, onClose, onPlay, apiBaseUrl }: GameDetailsModalProps) {
  if (!isOpen || !game) return null;

  const imageUrl = game.thumbnailUrl?.startsWith("http") 
    ? game.thumbnailUrl 
    : `${apiBaseUrl}${game.thumbnailUrl?.startsWith('/') ? '' : '/'}${game.thumbnailUrl}`;

  return (
    // 🔴 1. Background එකේ click කරාමත් close වෙන්න onClose දැම්මා
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose} 
    >
      {/* 🔴 2. Modal එක ඇතුලේ click කරාම close වෙන එක නවත්වන්න e.stopPropagation() දැම්මා */}
      <div 
        className="bg-[#0a0a0a] border border-green-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)] flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button - 🔴 3. z-index එක z-50 කරලා උඩටම ගත්තා 🔴 */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-black/80 border border-gray-700 p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500/50 hover:border-red-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 h-48 md:h-auto bg-[#050505] relative">
          <img src={imageUrl} alt={game.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative z-10 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Module Intel</span>
          </div>
          
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1 pr-8">{game.title}</h2>
          <span className="text-xs text-gray-400 uppercase tracking-wider mb-6 border border-gray-700 bg-[#111] px-2 py-1 inline-block w-max rounded">
            Class: {game.categoryName || 'Unknown'}
          </span>
          
          <div className="flex-grow">
            <p className="text-gray-300 text-sm leading-relaxed font-mono">
              {game.description}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800">
            <Button variant="primary" className="w-full py-3 text-sm" icon={Play} onClick={() => {
              onClose(); // Play ඔබද්දිත් Modal එක අයින් වෙන්න ඕන නිසා
              onPlay(game);
            }}>
              INITIALIZE_MODULE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}