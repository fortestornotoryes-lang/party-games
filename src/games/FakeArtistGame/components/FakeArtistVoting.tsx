import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Users, Maximize2, X } from 'lucide-react';
import { Player } from '../../../types';

interface FakeArtistVotingProps {
  players: Player[];
  canvasImage: string;
  onReveal: () => void;
}

export const FakeArtistVoting: React.FC<FakeArtistVotingProps> = ({
  players,
  canvasImage,
  onReveal,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const spy = players.find((p) => p.isSpy);

  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      <div className="w-full max-w-md flex flex-col gap-8">
        {canvasImage && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group"
          >
            <img
              src={canvasImage}
              alt="Final"
              className="w-full h-auto max-h-[40vh] object-contain bg-white"
            />
            <button
              onClick={() => setFullscreen(true)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/50 rounded-xl flex items-center justify-center text-white/80 active:scale-90 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {fullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex items-center justify-center"
              onClick={() => setFullscreen(false)}
            >
              <img src={canvasImage} alt="Full" className="w-full h-full object-contain" />
              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-5 right-5 w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center italic text-sm text-white/20 uppercase tracking-widest">
                Голосуйте одновременно
              </div>
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
              <div className="p-10 bg-premium-red/10 border border-premium-red/20 rounded-[40px] space-y-4">
                <Ghost className="w-16 h-16 text-premium-red mx-auto animate-bounce" />
                <h4 className="text-3xl font-black text-premium-red italic uppercase">
                  САМОЗВАНЕЦ
                </h4>
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
