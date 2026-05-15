import React from 'react';
import { motion } from 'motion/react';
import { Ghost, Palette, RotateCcw, Skull } from 'lucide-react';
import { Player } from '../types';

interface FakeArtistResultProps {
  players: Player[];
  word: string;
  onRestart: () => void;
  onPlayAgain: () => void;
}

export const FakeArtistResult: React.FC<FakeArtistResultProps> = ({ players, word, onRestart, onPlayAgain }) => {
  const spy = players.find(p => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden">
       <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#450a0a,transparent_70%)] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-10 relative z-10"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-24 bg-red-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_20px_50px_rgba(220,38,38,0.4)] rotate-12 relative"
          >
            <Palette className="w-12 h-12 text-white" />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 p-2 bg-black rounded-full border border-red-500"
            >
              <Skull className="w-4 h-4 text-red-500" />
            </motion.div>
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-6xl font-black uppercase tracking-tight italic leading-none">Вердикт<br/><span className="text-red-500">Вынесен</span></h1>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className="h-px w-6 bg-red-500/30" />
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Разоблачение самозванца</p>
              <span className="h-px w-6 bg-red-500/30" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group"
          >
            <p className="text-[10px] uppercase text-red-500 font-black tracking-[0.2em] mb-2">Самозванец среди нас:</p>
            <h2 className="text-4xl font-black text-white italic">{spy?.name}</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-sky-500/5 border border-sky-500/20 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-2 text-sky-500/60 mb-2">
              <p className="text-[10px] uppercase font-black tracking-[0.2em]">Секретное слово:</p>
            </div>
            <h2 className="text-4xl font-black text-white italic">{word}</h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-4"
        >
          <div className="space-y-3">
            <button
              onClick={onPlayAgain}
              className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-red-500 hover:text-white transition-all shadow-2xl"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">Те же игроки, другое слово</span>
            </button>
            <button
              onClick={onRestart}
              className="w-full py-4 bg-white/5 border border-white/10 text-gray-500 rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center"
            >
              <span className="text-xs">Сменить состав</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
