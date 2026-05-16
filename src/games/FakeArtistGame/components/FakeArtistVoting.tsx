import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Users, Eye } from 'lucide-react';
import { Player } from '../../../types';

interface FakeArtistVotingProps {
  players: Player[];
  canvasImage: string;
  onReveal: () => void;
}

export const FakeArtistVoting: React.FC<FakeArtistVotingProps> = ({ players, canvasImage, onReveal }) => {
  const [voted, setVoted] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.08),transparent_65%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col gap-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-20 h-20 mx-auto rounded-[1.5rem] bg-violet-500/10 border border-violet-500/30 flex items-center justify-center"
          >
            <Users className="w-10 h-10 text-violet-400" />
          </motion.div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
            Обсуж<span className="text-violet-400">дение</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Рисование закончено. Обсудите между собой — кто из вас самозванец?
          </p>
        </div>

        {/* Drawing */}
        {canvasImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-lg"
          >
            <img
              src={canvasImage}
              alt=""
              draggable={false}
              className="w-full block select-none"
              style={{ maxHeight: '42vh', objectFit: 'contain' }}
            />
          </motion.div>
        )}

        {/* Players to vote on */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ваш подозреваемый</p>
          <div className="grid grid-cols-2 gap-2">
            {players.map((player, idx) => {
              const isSelected = voted === player.id;
              const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
              const color = colors[idx % colors.length];
              return (
                <motion.button
                  key={player.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setVoted(isSelected ? null : player.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white/10 border-white/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {player.name}
                  </span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="ml-auto"
                      >
                        <Ghost className="w-4 h-4 text-red-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
          <p className="text-xs text-gray-500 leading-relaxed text-center">
            Это только для обсуждения — настоящий результат откроется следующим экраном
          </p>
        </div>

        {/* Reveal button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReveal}
          className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl"
        >
          <Eye className="w-5 h-5" />
          <span>Разоблачить самозванца</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
