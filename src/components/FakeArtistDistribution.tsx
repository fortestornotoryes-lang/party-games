import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EyeOff, CheckCircle2, MapPin, Ghost, Palette } from 'lucide-react';
import { Player } from '../types';

interface FakeArtistDistributionProps {
  players: Player[];
  word: string;
  category: string;
  onFinish: () => void;
}

export const FakeArtistDistribution: React.FC<FakeArtistDistributionProps> = ({ players, word, category, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  const nextPlayer = () => {
    if (isLastPlayer) {
      onFinish();
    } else {
      setIsTransitioning(true);
      setIsRevealed(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
       <div className={`fixed inset-0 transition-colors duration-1000 pointer-events-none opacity-20 ${isRevealed && currentPlayer.isSpy ? 'bg-red-900' : isRevealed ? 'bg-sky-900' : 'bg-transparent'}`} />

      <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm space-y-8 flex flex-col items-center relative z-10"
      >
        <div className="text-center space-y-2">
          <p className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] font-bold">Художественная мастерская</p>
          <h2 className="text-2xl font-light tracking-tight text-gray-400">Передайте устройство:</h2>
          <motion.h3 className="text-5xl font-black text-white mt-1 italic tracking-tighter">
            {currentPlayer.name}
          </motion.h3>
        </div>

        <div className="relative w-full aspect-[4/5] [perspective:2000px]">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="hidden"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                whileHover={!isTransitioning ? { rotateY: 5, rotateX: -5 } : {}}
                className="w-full h-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 cursor-pointer hover:border-emerald-500/40 transition-all group shadow-2xl relative overflow-hidden"
                onClick={() => !isTransitioning && setIsRevealed(true)}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center animate-pulse border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Palette className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="uppercase text-[10px] font-black tracking-[0.4em] text-emerald-500">Засекречено</p>
                  <p className="text-xs font-bold text-gray-500 px-8">Нажмите, чтобы узнать тему</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                className={`w-full h-full rounded-[2.5rem] p-8 flex flex-col items-center justify-between text-center border-2 shadow-2xl ${currentPlayer.isSpy ? 'bg-gradient-to-br from-red-950/40 to-black border-red-500' : 'bg-gradient-to-br from-sky-950/40 to-black border-sky-500'}`}
              >
                <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                  {currentPlayer.isSpy ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                      <div className="w-28 h-28 rounded-3xl bg-red-500 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40 rotate-12">
                        <Ghost className="w-14 h-14 text-white" />
                      </div>
                      <div>
                        <h4 className="text-4xl font-black uppercase tracking-tighter text-red-600 mb-2 italic leading-none">Самозванец</h4>
                        <div className="h-px w-12 bg-red-500/30 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Слово неизвестно. Тема: <span className="text-white font-bold">{category}</span>. <br/>Подстраивайся под рисунок и пытайся не выдать себя!
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                      <div className="space-y-2">
                        <div className="w-20 h-20 rounded-3xl bg-sky-500/20 flex items-center justify-center mx-auto mb-4 border border-sky-500/30">
                          <Palette className="w-10 h-10 text-sky-500" />
                        </div>
                        <p className="text-[10px] text-sky-500 uppercase font-black tracking-[0.3em]">Задание получено</p>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-tight">{word}</h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold italic">Тема: {category}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPlayer}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-xl"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs">Понятно</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center px-8 leading-relaxed">
          Тебе предстоит нарисовать ровно две линии за всю игру. Будь точен!
        </p>
      </motion.div>
      </AnimatePresence>
    </div>
  );
};
