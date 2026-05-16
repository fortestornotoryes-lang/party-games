import React from 'react';
import { motion } from 'motion/react';
import { Ghost, RotateCcw, Target, MapPin } from 'lucide-react';
import { Player } from '../types';

interface ResultProps {
  players: Player[];
  location: string;
  onRestart: () => void;
  onPlayAgain: () => void;
}

export const Result: React.FC<ResultProps> = ({ players, location, onRestart, onPlayAgain }) => {
  const spy = players.find(p => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-gray-200 overflow-hidden">
      <div className="w-full max-w-md text-center space-y-10">
        <h1 className="text-6xl font-black uppercase italic italic">Миссия окончена</h1>
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative">
            <p className="text-[10px] text-red-500 font-black uppercase mb-2">Шпион:</p>
            <h2 className="text-4xl font-black italic">{spy?.name}</h2>
        </div>
        <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem]">
            <p className="text-[10px] text-emerald-500 font-black uppercase mb-2">Локация:</p>
            <h2 className="text-3xl font-black italic">{location}</h2>
        </div>
        <div className="space-y-3 pt-6">
            <button onClick={onPlayAgain} className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase shadow-2xl">Еще раз</button>
            <button onClick={onRestart} className="w-full py-4 text-gray-500 font-black uppercase">В меню</button>
        </div>
      </div>
    </div>
  );
};
