import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, List, Info, Skull, RotateCcw, AlertTriangle, HelpCircle, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Player } from '../types';
import { LOCATIONS, SPY_HUNT_INSTRUCTIONS as INSTRUCTIONS, QUESTION_IDEAS, GAME_DURATION } from '../spyHuntContent';

interface GameProps {
  players: Player[];
  location: string;
  onRestart: () => void;
  onFinish: () => void;
}

export const Game: React.FC<GameProps> = ({ players, location, onRestart, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showLocations, setShowLocations] = useState(false);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans pb-10">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${timeLeft < 60 ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
              <Timer className={`w-5 h-5 mb-0.5 ${timeLeft < 60 ? 'text-red-500' : 'text-red-400'}`} />
              <span className="text-[10px] font-mono font-bold leading-none">{formatTime(timeLeft)}</span>
            </div>
            {timeLeft < 60 && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter sm:text-2xl">Signal <span className="text-red-500">Live</span></h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Активная фаза операции</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowInstructions(true)}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 transition-all"
            title="Инструкции"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={onRestart}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 transition-all"
            title="Сброс"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto relative z-10 max-w-2xl mx-auto w-full">
        {/* Question Ideas Toggle */}
        <div className="space-y-4">
          <button 
            onClick={() => setShowQuestions(!showQuestions)}
            className="w-full flex items-center justify-between p-4 bg-red-950/20 border border-red-500/20 rounded-2xl hover:bg-red-950/30 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 leading-none mb-1">Генератор зацепок</p>
                <p className="text-xs font-bold text-white">Идеи для вопросов</p>
              </div>
            </div>
            {showQuestions ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>

          <AnimatePresence>
            {showQuestions && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                  {QUESTION_IDEAS.map((q, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-400 italic"
                    >
                      "{q}"
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Players List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Агенты в сети</h3>
            <div className="flex items-center space-x-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Secure</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {players.map((player, idx) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-3 group hover:border-red-500/30 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                  {idx + 1}
                </div>
                <span className="text-sm font-bold tracking-tight">{player.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Locations List */}
        <section className="space-y-4">
          <button 
            onClick={() => setShowLocations(!showLocations)}
            className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                <List className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Список всех локаций</span>
            </div>
            {showLocations ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>

          <AnimatePresence>
            {showLocations && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-black/40 border border-white/5 rounded-2xl"
              >
                <div className="grid grid-cols-2 gap-px bg-white/5">
                  {LOCATIONS.map((loc) => (
                    <div key={loc} className="p-4 bg-black/40 text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10 mr-3" />
                      {loc}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Action Footer */}
      <div className="px-6 relative z-10 max-w-2xl mx-auto w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRevealConfirm(true)}
          className="w-full py-6 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all italic"
        >
          <Skull className="w-6 h-6" />
          <span>Разоблачить</span>
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRevealConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a0a0a] border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Эвакуация?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Внимание! Это действие раскроет все карты и завершит текущий протокол миссии.</p>
              </div>
              <div className="flex flex-col space-y-4 pt-2">
                <button
                  onClick={onFinish}
                  className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all italic shadow-lg shadow-red-900/20"
                >
                  Конец связи
                </button>
                <button
                  onClick={() => setShowRevealConfirm(false)}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold uppercase tracking-widest transition-all"
                >
                  Вернуться в игру
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y:-20 }}
              className="bg-[#120a0a] border border-red-500/20 p-8 rounded-[2.5rem] max-w-lg w-full relative"
            >
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="p-3 bg-white/5 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Протоколы</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {INSTRUCTIONS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest"
                >
                  Понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
