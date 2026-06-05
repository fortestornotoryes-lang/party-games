import React from 'react';
import { motion } from 'motion/react';
import { Shield, Skull, RotateCcw, Award } from 'lucide-react';
import { Player } from '../../../types';

interface ResistanceResultProps {
  players: Player[];
  winner: 'resistance' | 'spies';
  onRestart: () => void;
}

export const ResistanceResult: React.FC<ResistanceResultProps> = ({
  players,
  winner,
  onRestart,
}) => {
  const spies = players.filter((p) => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6   overflow-hidden">
      <div
        className={`fixed inset-0 pointer-events-none transition-colors duration-2000 ${winner === 'resistance' ? 'bg-premium-blue/10' : 'bg-premium-red/10'}`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-10 relative z-10"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`w-32 h-32 rounded-premium-3xl mx-auto flex items-center justify-center shadow-2xl ${winner === 'resistance' ? 'bg-premium-blue shadow-premium-blue/40' : 'bg-premium-red shadow-premium-red/40'}`}
          >
            {winner === 'resistance' ? (
              <Shield className="w-16 h-16 text-white" />
            ) : (
              <Skull className="w-16 h-16 text-white" />
            )}
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-6xl font-black uppercase tracking-tight italic leading-none">
              Победа
              <br />
              <span className={winner === 'resistance' ? 'text-premium-blue' : 'text-premium-red'}>
                {winner === 'resistance' ? 'Свободы' : 'Хаоса'}
              </span>
            </h1>
            <p className="text-label text-white/30 uppercase tracking-[0.4em] font-black mt-4">
              Мир уже не будет прежним
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-white/5 border border-white/10 rounded-premium-md space-y-4">
            <div className="flex items-center justify-between text-tag uppercase font-black tracking-widest text-white/30">
              <span>Шпионы этой игры</span>
              <Award className="w-4 h-4" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {spies.map((spy) => (
                <motion.div
                  key={spy.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-premium-red/10 border border-premium-red/30 rounded-premium-sm"
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
          className="w-full py-6 bg-white text-black rounded-premium-md font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-zinc-200 transition-all shadow-2xl"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm">В штаб</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
