import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, EyeOff, CheckCircle2, Skull, Users } from 'lucide-react';
import { Player } from '../../../types';

interface ResistanceDistributionProps {
  players: Player[];
  onFinish: () => void;
}

export const ResistanceDistribution: React.FC<ResistanceDistributionProps> = ({ players, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayer = players[currentIndex];
  const spies = players.filter(p => p.isSpy).map(p => p.name);
  const otherSpies = spies.filter(name => name !== currentPlayer.name);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0502] text-[#e5e7eb] font-sans select-none">
       <div className={`fixed inset-0 transition-colors duration-1000 pointer-events-none opacity-20 ${isRevealed && currentPlayer.isSpy ? 'bg-red-900' : isRevealed ? 'bg-blue-900' : 'bg-transparent'}`} />

      <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm space-y-4 sm:space-y-8 flex flex-col items-center relative z-10"
      >
        <div className="text-center space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">Секретная роль</p>
          <h2 className="text-2xl font-light tracking-tight text-gray-400">Смотрит:</h2>
          <motion.h3 className="text-5xl font-black text-white mt-1 italic tracking-tighter">
            {currentPlayer.name}
          </motion.h3>
        </div>

        <div className="relative w-full aspect-[4/5] max-h-[58vh] [perspective:2000px]">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="hidden"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                className="w-full h-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 cursor-pointer hover:border-blue-500/40 transition-all group shadow-2xl"
                onClick={() => !isTransitioning && setIsRevealed(true)}
              >
                <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center animate-pulse border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <EyeOff className="w-10 h-10 text-blue-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="uppercase text-[10px] font-black tracking-[0.4em] text-blue-500">Засекречено</p>
                  <p className="text-xs font-bold text-gray-500 px-8">Нажми, чтобы узнать свою роль</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.45, type: "spring", bounce: 0.1 }}
                className={`w-full h-full rounded-[2.5rem] p-8 flex flex-col items-center justify-between text-center border-2 shadow-2xl ${currentPlayer.isSpy ? 'bg-gradient-to-br from-red-950/40 to-black border-red-500' : 'bg-gradient-to-br from-blue-950/40 to-black border-blue-500'}`}
              >
                <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                  {currentPlayer.isSpy ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                      <div className="w-28 h-28 rounded-3xl bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40 rotate-12">
                        <Skull className="w-14 h-14 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-4xl font-black uppercase tracking-tighter text-red-600 italic leading-none">Шпион</h4>
                        <div className="h-px w-12 bg-red-500/30 mx-auto" />
                        <p className="text-gray-400 text-sm leading-relaxed">Твоя задача — завалить 3 миссии.</p>
                        {otherSpies.length > 0 && (
                          <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                            <p className="text-[9px] uppercase text-gray-500 tracking-widest font-black mb-2">Твои сообщники:</p>
                            <p className="text-white font-bold">{otherSpies.join(', ')}</p>
                          </div>
                        )}
                        {otherSpies.length === 0 && (
                          <p className="text-xs text-gray-500 mt-2">Ты действуешь в одиночку.</p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                      <div className="w-28 h-28 rounded-3xl bg-blue-600 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 -rotate-12">
                        <Shield className="w-14 h-14 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-4xl font-black uppercase tracking-tighter text-blue-500 italic leading-none">Сопротивление</h4>
                        <div className="h-px w-12 bg-blue-500/30 mx-auto" />
                        <p className="text-gray-400 text-sm leading-relaxed">Успешно выполните 3 миссии. Вычисляйте шпионов по их голосованию!</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPlayer}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs">Понятно</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
};
