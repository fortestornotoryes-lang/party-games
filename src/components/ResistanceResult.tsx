import React from 'react';
import { motion } from 'motion/react';
import { Shield, Skull, RotateCcw, Award } from 'lucide-react';
import { Player } from '../types';

interface ResistanceResultProps {
  players: Player[];
  winner: 'resistance' | 'spies';
  onRestart: () => void;
}

export const ResistanceResult: React.FC<ResistanceResultProps> = ({ players, winner, onRestart }) => {
  const spies = players.filter(p => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden">
       <div className={`fixed inset-0 pointer-events-none transition-colors duration-2000 ${winner === 'resistance' ? 'bg-blue-950/20' : 'bg-red-950/20'}`} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-10 relative z-10"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`w-32 h-32 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl ${winner === 'resistance' ? 'bg-blue-600 shadow-blue-500/40' : 'bg-red-600 shadow-red-500/40'}`}
          >
            {winner === 'resistance' ? <Shield className="w-16 h-16 text-white" /> : <Skull className="w-16 h-16 text-white" />}
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-black uppercase tracking-tight italic leading-none">
              Победа<br/>
              <span className={winner === 'resistance' ? 'text-blue-500' : 'text-red-500'}>
                {winner === 'resistance' ? 'Свободы' : 'Хаоса'}
              </span>
            </h1>
            <p className="text-[12px] text-gray-500 uppercase tracking-[0.4em] font-black mt-4">
              Мир уже не будет прежним
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
             <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-gray-500">
               <span>Шпионы этой игры</span>
               <Award className="w-4 h-4" />
             </div>
             <div className="flex flex-wrap justify-center gap-2">
               {spies.map(spy => (
                 <motion.div 
                   key={spy.id}
                   whileHover={{ scale: 1.05 }}
                   className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl"
                 >
                   <span className="text-white font-bold">{spy.name}</span>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onRestart}
          className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-zinc-200 transition-all shadow-2xl"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm">В штаб</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
