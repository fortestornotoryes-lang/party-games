import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EyeOff, MapPin, Ghost, Shield } from 'lucide-react';
import { Player } from '../../../types';
import { useGameSettings } from '../../../contexts/GameSettingsContext';

interface RoleDistributionProps {
  players: Player[];
  location: string;
  onFinish: () => void;
}

export const RoleDistribution: React.FC<RoleDistributionProps> = ({ players, location, onFinish }) => {
  const { difficulty } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  const nextPlayer = () => {
    if (isLastPlayer) onFinish();
    else {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-[#e5e7eb] font-sans selection:bg-red-500/30 overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-8 flex flex-col items-center"
        >
          <div className="text-center space-y-1">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Личный доступ</p>
              <h3 className="text-2xl font-black text-white/50 italic tracking-tighter uppercase">{currentPlayer.name}</h3>
          </div>

          <div className="w-full aspect-[4/5] bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl" onClick={() => setIsRevealed(true)}>
            {!isRevealed ? (
              <div className="text-center space-y-6 px-10">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto">
                   <EyeOff className="w-10 h-10 text-red-500/40 animate-pulse" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] uppercase font-black text-red-500 tracking-[0.2em]">Передай устройство</p>
                   <h4 className="text-3xl font-black text-white italic">{currentPlayer.name}</h4>
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest leading-relaxed">Нажми, когда будешь один, чтобы увидеть роль</p>
              </div>
            ) : (
                <div className="p-8 text-center space-y-8 relative z-10 w-full">
                  {currentPlayer.isSpy ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          <Ghost className="w-20 h-20 text-red-500 mx-auto" />
                          <h4 className="text-6xl font-black text-red-600 italic leading-none">
                             {"ШПИОН".split('').map((char, i) => (
                               <motion.span
                                 key={i}
                                 initial={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                                 animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                 transition={{ delay: 0.1 + i * 0.05, type: 'spring' }}
                                 className="inline-block"
                               >
                                 {char}
                               </motion.span>
                             ))}
                          </h4>
                          <p className="text-gray-400 text-sm">Локация неизвестна. Твоя задача — не выдать себя и узнать место.</p>
                          {difficulty === 'easy' && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="text-[8px] font-black uppercase text-red-400 mb-1">Легкий уровень (подсказка):</p>
                              <p className="text-xs text-red-300 font-bold">Букв в названии: {location.length}</p>
                            </div>
                          )}
                      </motion.div>
                  ) : currentPlayer.role === 'Предатель' ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="space-y-2">
                             <Shield className="w-12 h-12 text-sky-500 mx-auto" />
                             <p className="text-[10px] uppercase text-sky-500/50 font-black">Твой секрет:</p>
                             <h2 className="text-5xl font-black text-white italic leading-none uppercase">
                                {"ПРЕДАТЕЛЬ".split('').map((char, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.03 }}
                                    className="inline-block"
                                  >
                                    {char}
                                  </motion.span>
                                ))}
                             </h2>
                          </div>
                          <div className="pt-6 border-t border-white/5 space-y-4">
                              <div>
                                <p className="text-[10px] uppercase text-emerald-500/50 font-black mb-1">Локация (ты ее знаешь):</p>
                                <h3 className="text-2xl font-black text-white italic underline">
                                   {location.split(' ').map((word, i) => (
                                     <motion.span
                                       key={i}
                                       initial={{ opacity: 0, y: 10 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ delay: 0.5 + i * 0.1 }}
                                       className="inline-block mr-2"
                                     >
                                       {word}
                                     </motion.span>
                                   ))}
                                </h3>
                              </div>
                              <p className="text-gray-400 text-[10px] font-medium leading-relaxed">Помогай шпиону! Твоя задача — отводить подозрения от него и запутать остальных.</p>
                          </div>
                      </motion.div>
                  ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="space-y-2">
                             <MapPin className="w-12 h-12 text-emerald-500 mx-auto" />
                             <p className="text-[10px] uppercase text-emerald-500/50 font-black">Локация:</p>
                             <h2 className="text-4xl font-black text-white uppercase italic leading-none">
                                {location.split(' ').map((word, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="inline-block mr-2"
                                  >
                                    {word}
                                  </motion.span>
                                ))}
                             </h2>
                          </div>
                          <div className="pt-6 border-t border-white/5">
                              <p className="text-[10px] uppercase text-gray-500 font-black mb-1">Твоя роль:</p>
                              <h3 className="text-2xl font-black text-emerald-400 italic uppercase">
                                 {currentPlayer.role.split(' ').map((word, i) => (
                                   <motion.span
                                     key={i}
                                     initial={{ opacity: 0, scale: 0.8 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                                     className="inline-block mr-2"
                                   >
                                     {word}
                                   </motion.span>
                                 ))}
                              </h3>
                          </div>
                      </motion.div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); nextPlayer(); }} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all">Усвоено</button>
                </div>
              )}
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
};
