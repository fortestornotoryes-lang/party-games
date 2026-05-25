import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Timer, List, MessageSquare, ChevronDown, ChevronUp, Skull } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { GameCard } from '@/components/GameCard';
import { Player } from '@/types';
import { LOCATIONS, QUESTION_IDEAS } from '@/constants/spyHuntContent';

interface PlayingPhaseProps {
  players: Player[];
  timeLeft: number;
  onReveal: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({ players, timeLeft, onReveal }) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [showLocations, setShowLocations] = useState(false);

  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto max-w-2xl mx-auto w-full"
    >
      <div className="flex justify-center">
        <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${
          timeLeft < 60
            ? 'border-premium-red bg-premium-red/10'
            : 'border-white/10 bg-white/5'
        }`}>
          <Timer className={`w-6 h-6 mb-1 ${timeLeft < 60 ? 'text-premium-red animate-pulse' : 'text-white/30'}`} />
          <span className="text-3xl font-black italic tracking-tighter">
            {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowQuestions(v => !v)}
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl active:bg-white/10 transition-all"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-4 h-4 text-premium-red" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Идеи для вопросов</span>
          </div>
          {showQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showQuestions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-1 gap-2"
          >
            {QUESTION_IDEAS.map((q, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl text-xs text-gray-400 italic border border-white/5">
                "{q}"
              </div>
            ))}
          </motion.div>
        )}

        <button
          onClick={() => setShowLocations(v => !v)}
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl active:bg-white/10 transition-all"
        >
          <div className="flex items-center space-x-3">
            <List className="w-4 h-4 text-premium-sky" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Возможные локации</span>
          </div>
          {showLocations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLocations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-2 gap-2"
          >
            {LOCATIONS.map((loc, i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-[10px] font-bold text-center border bg-white/5 border-white/10 text-gray-500"
              >
                {loc}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="pt-6">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 text-center">
          Агенты под подозрением
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {players.map(p => (
            <GameCard key={p.id} className="p-4 flex items-center space-x-3 border-white/5">
              <div className="w-2 h-2 rounded-full bg-premium-red/40" />
              <span className="text-sm font-black italic uppercase tracking-tight truncate">{p.name}</span>
            </GameCard>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <PrimaryButton
          onClick={onReveal}
          icon={Skull}
          className="bg-premium-red text-white! shadow-premium-red/30"
        >
          РАЗОБЛАЧИТЬ
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
