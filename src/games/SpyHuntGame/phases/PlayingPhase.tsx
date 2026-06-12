import { ChevronDown, ChevronUp, List, MessageSquare, Skull, Timer } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import type { Player } from '@/entities/player/types';
import { LOCATIONS, QUESTION_IDEAS } from '@/games/SpyHuntGame/constants.ts';
import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PlayingPhaseProps {
  players: Player[];
  timeLeft: number;
  onReveal: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({ players, timeLeft, onReveal }) => {
  const { t } = useTranslation();
  const [showQuestions, setShowQuestions] = useState(false);
  const [showLocations, setShowLocations] = useState(false);

  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto min-h-0 w-full max-w-2xl flex-1 space-y-6 overflow-y-auto p-6"
    >
      <div className="flex justify-center">
        <div
          className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 ${
            timeLeft < 60 ? 'border-premium-red/60 bg-premium-red/8' : 'border-white/10 bg-white/5'
          }`}
          style={timeLeft < 60 ? { boxShadow: '0 0 30px rgba(255,46,77,0.2)' } : undefined}
        >
          <Timer
            className={`mb-1 h-6 w-6 ${timeLeft < 60 ? 'text-premium-red animate-pulse' : 'text-white/30'}`}
          />
          <span className="text-3xl font-black tracking-tighter italic">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setShowQuestions((v) => !v);
          }}
          className="rounded-premium-md flex w-full items-center justify-between border border-white/8 bg-white/4 p-4 transition-all active:bg-white/8"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-premium-red h-4 w-4" />
            <span className="text-tag font-black tracking-widest text-white/60 uppercase">
              {t(`${NS.SPY_HUNT}.questionIdeas`)}
            </span>
          </div>
          {showQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {!!showQuestions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-1 gap-2"
          >
            {QUESTION_IDEAS.map((q, i) => (
              <div
                key={i}
                className="rounded-premium-md text-label border border-white/6 bg-white/4 p-4 text-white/55 italic"
              >
                {q}
              </div>
            ))}
          </motion.div>
        )}

        <button
          onClick={() => {
            setShowLocations((v) => !v);
          }}
          className="rounded-premium-md flex w-full items-center justify-between border border-white/8 bg-white/4 p-4 transition-all active:bg-white/8"
        >
          <div className="flex items-center space-x-3">
            <List className="text-premium-sky h-4 w-4" />
            <span className="text-tag font-black tracking-widest text-white/60 uppercase">
              {t(`${NS.SPY_HUNT}.possibleLocations`)}
            </span>
          </div>
          {showLocations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {!!showLocations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-2 gap-2"
          >
            {LOCATIONS.map((loc, i) => (
              <div
                key={i}
                className="rounded-premium-sm text-tag border border-white/6 bg-white/4 p-3 text-center font-bold text-white/45"
              >
                {loc}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="pt-6">
        <h4 className="text-tag mb-4 text-center font-black tracking-[0.3em] text-white/20 uppercase">
          {t(`${NS.SPY_HUNT}.agentsSuspected`)}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {players.map((p) => (
            <GameCard key={p.id} className="flex items-center space-x-3 border-white/5 p-4">
              <div className="bg-premium-red/50 h-2 w-2 rounded-full" />
              <span className="truncate text-sm font-black tracking-tight uppercase italic">
                {p.name}
              </span>
            </GameCard>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <PrimaryButton
          onClick={onReveal}
          icon={Skull}
          className="bg-premium-red shadow-premium-red/30 text-white!"
        >
          {t(`${NS.SPY_HUNT}.reveal`)}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
