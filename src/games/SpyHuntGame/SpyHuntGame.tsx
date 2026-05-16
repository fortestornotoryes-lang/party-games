import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, List, RotateCcw, HelpCircle, MessageSquare, ChevronDown, ChevronUp, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '../../types';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { LOCATIONS, QUESTION_IDEAS, GAME_DURATION } from '../../constants/spyHuntContent';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton, GameCard } from '../../components/UI';

interface GameProps {
  players: Player[];
  location: string;
  onRestart: () => void;
  onFinish: () => void;
}

export const SpyHuntGame: React.FC<GameProps> = ({ players, location, onRestart, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showLocations, setShowLocations] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'reveal'>('playing');

  useEffect(() => {
    if (timeLeft <= 0 || phase === 'reveal') return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const settings = storageService.getSettings();
      feedbackService.playSound('success');
      feedbackService.vibrate([50, 30, 50]);

      if (settings.visualEffects) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#ffffff']
        });
      }
    }
  }, [phase]);

  const spy = players.find(p => p.isSpy);

  return (
    <div className="flex flex-col min-h-screen bg-[#060807] text-[#e5e7eb] font-sans pb-10">
      <GameHeader 
        title="SPY HUNT" 
        subtitle={phase === 'playing' ? "Идет поиск..." : "Результаты"} 
        icon={Skull} 
        themeColor="border-red-500/50 text-red-400"
        onBack={onRestart}
      />

      <AnimatePresence mode="wait">
        {phase === 'playing' ? (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6 flex-1 overflow-y-auto max-w-2xl mx-auto w-full"
          >
            <div className="flex justify-center">
              <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${timeLeft < 60 ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 shadow-2xl shadow-red-500/10'}`}>
                <Timer className={`w-6 h-6 mb-1 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                <span className="text-3xl font-black italic tracking-tighter">
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => setShowQuestions(!showQuestions)} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl active:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Идеи для вопросов</span>
                </div>
                {showQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showQuestions && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-1 gap-2">
                      {QUESTION_IDEAS.map((q, i) => <div key={i} className="p-4 bg-white/5 rounded-2xl text-xs text-gray-400 italic border border-white/5">"{q}"</div>)}
                  </motion.div>
              )}

              <button onClick={() => setShowLocations(!showLocations)} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl active:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                    <List className="w-4 h-4 text-sky-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Возможные локации</span>
                </div>
                {showLocations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showLocations && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-2 gap-2">
                      {LOCATIONS.map((loc, i) => (
                        <div key={i} className={`p-3 rounded-xl text-[10px] font-bold text-center border transition-all bg-white/5 border-white/10 text-gray-500`}>
                          {loc}
                        </div>
                      ))}
                  </motion.div>
              )}
            </div>

            <div className="pt-6">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 text-center">Агенты под подозрением</h4>
              <div className="grid grid-cols-2 gap-3">
                {players.map((p) => (
                    <GameCard key={p.id} className="p-4 flex items-center space-x-3 border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500/40" />
                        <span className="text-sm font-black italic uppercase tracking-tight truncate">{p.name}</span>
                    </GameCard>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <PrimaryButton onClick={() => setPhase('reveal')} icon={Skull} className="bg-red-600 !text-white shadow-red-900/40">
                РАЗОБЛАЧИТЬ
              </PrimaryButton>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="reveal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 flex-1 flex flex-col items-center justify-center space-y-12 max-w-md mx-auto w-full"
          >
            <div className="text-center space-y-4">
               <Skull className="w-24 h-24 text-red-600 mx-auto animate-pulse" />
               <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">Шпион раскрыт</h2>
            </div>

            <GameCard className="w-full p-10 text-center border-red-500/40 bg-red-500/5 space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Агент 00</p>
                  <h3 className="text-5xl font-black italic text-white uppercase break-words px-4">{spy?.name}</h3>
               </div>
               <div className="pt-6 border-t border-red-500/20">
                  <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Секретная локация</p>
                  <p className="text-2xl font-black italic text-white uppercase">{location}</p>
               </div>
            </GameCard>

            <PrimaryButton onClick={onFinish} icon={RotateCcw} variant="red">
              ВЕРНУТЬСЯ В МЕНЮ
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
