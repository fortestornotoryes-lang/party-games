import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import type { Card, Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface TeamPhaseProps {
  cards: Card[];
  turn: Team;
  clueWord: string;
  clueCount: number;
  guessesLeft: number;
  lastActionMsg: string | null;
  onCardClick: (card: Card) => void;
  onEndTurn: () => void;
}

export const TeamPhase: React.FC<TeamPhaseProps> = ({
  cards,
  turn,
  clueWord,
  clueCount,
  guessesLeft,
  lastActionMsg,
  onCardClick,
  onEndTurn,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="team"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col space-y-4"
    >
      <div className="rounded-premium-md relative flex flex-col items-center justify-center overflow-hidden border border-white/10 bg-white/5 py-3 text-center">
        <div
          className={`absolute top-0 bottom-0 left-0 w-2 ${turn === 'red' ? 'bg-premium-red' : 'bg-premium-blue'}`}
        />
        <p className="text-tag mb-1 font-black tracking-widest text-white/40 uppercase">
          {t(`${NS.CODENAMES}.clueLabel`)}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black tracking-widest text-white uppercase">{clueWord}</h3>
          <span className="text-xl font-bold text-white/30">{clueCount}</span>
        </div>
        <p className="mt-2 text-xs text-white/30">
          {t(`${NS.CODENAMES}.guessesLeft`, { n: guessesLeft })}
        </p>
      </div>

      <div className="relative grid flex-1 grid-cols-5 items-center gap-1.5">
        <AnimatePresence>
          {!!lastActionMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-4"
            >
              <div className="rounded-premium-lg border border-white/20 bg-black/90 px-6 py-4 shadow-2xl backdrop-blur-md">
                <p className="text-center text-xl font-black tracking-widest text-white">
                  {lastActionMsg}
                </p>
                <p className="text-tag mt-2 text-center font-bold text-white/30 uppercase">
                  {t(`${NS.CODENAMES}.turnPassing`)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              onCardClick(card);
            }}
            disabled={card.revealed}
            className={`flex aspect-4/3 items-center justify-center rounded p-1 text-center transition-all ${!card.revealed ? 'cursor-pointer border-b-2 border-stone-400 bg-stone-200 text-stone-800 shadow-md hover:bg-stone-300 active:scale-95' : ''} ${card.revealed && card.color === 'red' ? 'bg-premium-red pointer-events-none border border-red-700 text-white opacity-80' : ''} ${card.revealed && card.color === 'blue' ? 'bg-premium-blue pointer-events-none border border-blue-700 text-white opacity-80' : ''} ${card.revealed && card.color === 'neutral' ? 'pointer-events-none border border-stone-500 bg-stone-400 text-stone-800 opacity-80' : ''} ${card.revealed && card.color === 'assassin' ? 'pointer-events-none border border-black bg-stone-900 text-white opacity-90' : ''} `}
          >
            <span
              className={`text-tag leading-tight font-black wrap-break-word uppercase sm:text-xs ${!card.revealed ? 'text-stone-800' : ''}`}
            >
              {card.word}
            </span>
          </button>
        ))}
      </div>

      <PrimaryButton onClick={onEndTurn} variant="outline" className="mt-4">
        {t(`${NS.CODENAMES}.passTurn`)}
      </PrimaryButton>
    </motion.div>
  );
};
