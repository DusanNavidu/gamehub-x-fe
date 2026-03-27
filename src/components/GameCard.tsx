import React from 'react';
import { Gamepad2, Info, Play } from 'lucide-react';
import Button from './Button';
import { Game } from '../pages/player/PlayerDashboard'; // PlayerDashboard එකෙන් Game type එක import කරගන්න

interface GameCardProps {
  game: Game;
  apiBaseUrl: string;
  onPlay: (game: Game) => void;
  onDetails: (game: Game) => void;
}

export default function GameCard({ game, apiBaseUrl, onPlay, onDetails }: GameCardProps) {
  const imageUrl = game.thumbnailUrl?.startsWith("http") 
    ? game.thumbnailUrl 
    : `${apiBaseUrl}${game.thumbnailUrl?.startsWith('/') ? '' : '/'}${game.thumbnailUrl}`;

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-gray-800 p-4 rounded-xl hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 group flex flex-col h-full">
      <div className="w-full h-48 bg-[#050505] rounded-lg mb-4 flex items-center justify-center border border-gray-800/50 overflow-hidden relative">
        {game.thumbnailUrl ? (
          <img 
            src={imageUrl} 
            alt={game.title} 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
          />
        ) : (
          <Gamepad2 className="w-12 h-12 text-green-500/20 group-hover:text-green-500/50 transition-colors" />
        )}
        {/* Category Badge on Image */}
        <span className="absolute top-2 right-2 bg-black/80 text-green-500 border border-green-500/30 text-[10px] px-2 py-1 rounded backdrop-blur-md font-bold uppercase tracking-wider">
          {game.categoryName || 'Unknown'}
        </span>
      </div>
      
      <h3 className="text-lg font-bold mb-1 tracking-widest uppercase text-white group-hover:text-green-400 transition-colors line-clamp-1">
        {game.title}
      </h3>
      
      <p className="text-gray-500 text-xs mb-4 flex-grow line-clamp-2 leading-relaxed">
        {game.description}
      </p>
      
      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800/50">
        <Button variant="outline" className="flex-1 text-xs py-2" icon={Info} onClick={() => onDetails(game)}>
          INFO
        </Button>
        <Button variant="primary" className="flex-1 text-xs py-2" icon={Play} onClick={() => onPlay(game)}>
          PLAY
        </Button>
      </div>
    </div>
  );
}