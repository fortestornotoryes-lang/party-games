import React from 'react';
import { motion } from 'motion/react';
import { Ghost, MapPin, RotateCcw, ShieldCheck, Target } from 'lucide-react';
import { Player } from '../types';

interface ResultProps {
  players: Player[];
  location: string;
  onRestart: () => void;
}

export const Result: React.FC<ResultProps> = ({ players, location, onRestart }) => {
  const spy = players.find(p => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden">
       {/* Background ambient light */}
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
            <Ghost className="w-12 h-12 text-white" />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 p-2 bg-black rounded-full border border-red-500"
            >
              <Target className="w-4 h-4 text-red-500" />
            </motion.div>
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-6xl font-black uppercase tracking-tight italic leading-none">Миссия<br/><span className="text-red-500">Окончена</span></h1>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className="h-px w-6 bg-red-500/30" />
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Архивный отчет</p>
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
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Ghost className="w-20 h-20" />
            </div>
            <p className="text-[10px] uppercase text-red-500 font-black tracking-[0.2em] mb-2">Оперативник в розыске:</p>
            <h2 className="text-4xl font-black text-white italic">{spy?.name}</h2>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Кодовое имя: Шпион</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MapPin className="w-20 h-20" />
            </div>
            <div className="flex items-center justify-center space-x-2 text-emerald-500/60 mb-2">
              <MapPin className="w-4 h-4" />
              <p className="text-[10px] uppercase font-black tracking-[0.2em]">Точка рандеву:</p>
            </div>
            <h2 className="text-4xl font-black text-white italic">{location}</h2>
          </motion.div>

          {/* Player Roles Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 gap-2"
          >
            {players.filter(p => !p.isSpy).map((p, idx) => (
              <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left">
                <p className="text-[8px] text-gray-600 uppercase font-bold truncate">{p.name}</p>
                <p className="text-[10px] text-emerald-500 font-black italic truncate">{p.role}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-4"
        >
          <button
            onClick={onRestart}
            className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-red-500 hover:text-white transition-all shadow-2xl group"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs">Новый протокол</span>
          </button>
          <div className="flex items-center justify-center mt-6 space-x-2 text-gray-700">
            <ShieldCheck className="w-3 h-3" />
            <p className="text-[9px] uppercase font-bold tracking-tighter">Все данные удалены из памяти устройства</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
