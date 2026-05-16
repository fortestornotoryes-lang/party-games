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
  const [revealed, setRevealed] = useState(false);
  const spy = players.find(p => p.isSpy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-gray-200 overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-3">
          <Users className="w-12 h-12 text-violet-400 mx-auto" />
          <h1 className="text-4xl font-black italic uppercase">Обсуждение</h1>
          <p className="text-gray-400 text-sm">Кто из вас самозванец?</p>
        </div>

        {canvasImage && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img src={canvasImage} alt="Final" className="w-full h-auto max-h-[40vh] object-contain bg-white" />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center italic text-sm text-white/20 uppercase tracking-widest">Голосуйте одновременно</div>
              <button 
                onClick={() => setRevealed(true)} 
                className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
              >
                Раскрыть самозванца
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-8 text-center"
            >
              <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-[40px] space-y-4">
                <Ghost className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
                <h4 className="text-3xl font-black text-red-500 italic uppercase">САМОЗВАНЕЦ</h4>
                <div className="text-4xl font-black text-white">{spy?.name}</div>
              </div>

              <button 
                onClick={onReveal} 
                className="w-full py-6 bg-white/10 border border-white/20 text-white rounded-3xl font-black uppercase tracking-widest"
              >
                В ГЛАВНОЕ МЕНЮ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
