import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { Card, Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CaptainPhaseProps {
  cards: Card[];
  turn: Team;
  currentCaptain: string;
  clueWord: string;
  clueCount: number;
  onClueWordChange: (word: string) => void;
  onClueCountChange: (count: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CaptainPhase: React.FC<CaptainPhaseProps> = ({
  cards,
  turn,
  currentCaptain,
  clueWord,
  clueCount,
  onClueWordChange,
  onClueCountChange,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="captain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col space-y-4"
    >
      <div className="text-center">
        <p
          className={`text-sub-heading font-black tracking-widest uppercase ${turn === 'red' ? 'text-premium-red' : 'text-premium-blue'}`}
        >
          {t(`${NS.CODENAMES}.captainTurn`, { name: currentCaptain })}
        </p>
        <div className="text-label mt-3 mb-2 flex flex-wrap justify-center gap-x-3 gap-y-1 font-black tracking-widest uppercase">
          <div className="flex items-center gap-1">
            <span className="border-premium-red h-4 w-4 rounded-full border bg-black"></span>
            {t(`${NS.CODENAMES}.redTeam`)}
          </div>
          <div className="flex items-center gap-1">
            <span className="border-premium-blue h-4 w-4 rounded-full border bg-black"></span>
            {t(`${NS.CODENAMES}.blueTeam`)}
          </div>
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full border bg-stone-400/50"></span>
            {t(`${NS.CODENAMES}.neutralEndTurn`)}
          </div>
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full border border-red-900 bg-red-900"></span>
            {t(`${NS.CODENAMES}.assassinDeath`)}
          </div>
        </div>
        <p className="mt-1 text-xs text-white/40">{t(`${NS.CODENAMES}.makeClueHint`)}</p>
      </div>

      <div className="mb-4 grid grid-cols-5 gap-1.5">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative flex aspect-4/3 items-center justify-center rounded border p-1 text-center ${card.revealed ? 'opacity-30' : ''} ${
              card.color === 'red'
                ? 'border-premium-red/80'
                : card.color === 'blue'
                  ? 'border-premium-blue/80'
                  : card.color === 'neutral'
                    ? 'bg-stone-400/50 text-white'
                    : card.color === 'double_agent'
                      ? 'border-premium-green/80'
                      : 'border-red-900 bg-red-900'
            } `}
          >
            <span className="text-micro leading-tight font-bold wrap-break-word uppercase">
              {card.word}
            </span>
            {card.color === 'double_agent' && (
              <div className="absolute top-1 right-1">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-auto space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={clueWord}
            onChange={(e) => {
              onClueWordChange(e.target.value.replace(/ /g, ''));
            }}
            placeholder={t(`${NS.CODENAMES}.oneWord`)}
            className="rounded-premium-sm focus:border-premium-green/50 flex-1 border border-white/10 bg-white/5 px-4 py-3 text-center font-bold uppercase transition-colors outline-none"
            required
          />
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="9"
            pattern="[0-9]*"
            value={clueCount === 0 ? '' : clueCount}
            onChange={(e) => {
              onClueCountChange(parseInt(e.target.value) || 0);
            }}
            placeholder="0"
            className="rounded-premium-sm focus:border-premium-green/50 w-20 border border-white/10 bg-white/5 px-4 py-3 text-center text-xl font-bold transition-colors outline-none"
            required
          />
        </div>
        <PrimaryButton
          type="submit"
          variant={turn === 'red' ? 'red' : 'blue'}
          disabled={!clueWord || clueCount <= 0}
        >
          {t(`${NS.CODENAMES}.confirm`)}
        </PrimaryButton>
      </form>
    </motion.div>
  );
};
