import { CheckCircle2, StopCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import type { BlitzResult } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface BlitzVerdictPhaseProps {
  results: BlitzResult[];
  currentExplainer: string;
  otherPlayers: string[];
  onConfirm: (guessers: (string | null)[]) => void;
  onStopGame: () => void;
}

export const BlitzVerdictPhase: React.FC<BlitzVerdictPhaseProps> = ({
  results,
  currentExplainer,
  otherPlayers,
  onConfirm,
  onStopGame,
}) => {
  const { t } = useTranslation();
  // One slot per result: player name if guessed, null if nobody / skipped
  const [guessers, setGuessers] = useState<(string | null)[]>(() => results.map(() => null));

  const setGuesser = (idx: number, player: string | null) => {
    setGuessers((prev) => prev.map((g, i) => (i === idx ? player : g)));
  };

  const guessedResults = results.filter((r) => r.status === 'guessed');
  const skippedResults = results.filter((r) => r.status === 'skipped');
  const skippedPenalty = skippedResults.length;

  return (
    <motion.div
      key="blitz-verdict"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6"
    >
      {/* Header */}
      <div className="space-y-1 pt-2 text-center">
        <p className="text-micro font-black tracking-[0.5em] text-white/30 uppercase">
          {t(`${NS.TABOO_REVERSE}.turnResult`)}
        </p>
        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
          {currentExplainer}
        </h2>
        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="text-premium-green text-sm font-black">
            {t(`${NS.TABOO_REVERSE}.guessedCount`, { n: guessedResults.length })}
          </span>
          {skippedPenalty > 0 && (
            <span className="text-premium-red text-sm font-black">
              {t(`${NS.TABOO_REVERSE}.skippedCount`, { n: skippedPenalty })}
            </span>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="glass-card rounded-premium-md border border-white/10 py-8 text-center">
          <p className="text-sm font-black tracking-widest text-white/30 uppercase">
            {t(`${NS.TABOO_REVERSE}.noCards`)}
          </p>
          <p className="mt-1 text-xs text-white/20">{t(`${NS.TABOO_REVERSE}.timeUpBeforeFirst`)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Guessed cards — assign guesser */}
          {results.map((result, idx) => {
            if (result.status === 'skipped') {
              return (
                <div
                  key={idx}
                  className="rounded-premium-md border-premium-red/20 bg-premium-red/5 flex items-center gap-3 border p-4"
                >
                  <XCircle className="text-premium-red/60 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black tracking-tight text-white/50 uppercase italic">
                      {result.card.word}
                    </p>
                    <p className="text-tag text-premium-red/60 mt-0.5">
                      {t(`${NS.TABOO_REVERSE}.skipPenaltyFor`, { player: currentExplainer })}
                    </p>
                  </div>
                </div>
              );
            }

            // guessed card — pick who guessed it
            const selected = guessers[idx];
            return (
              <div
                key={idx}
                className="rounded-premium-md border-premium-green/20 bg-premium-green/5 space-y-3 border p-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-premium-green/70 h-5 w-5 shrink-0" />
                  <p className="truncate font-black tracking-tight text-white uppercase italic">
                    {result.card.word}
                  </p>
                  <span className="text-premium-green ml-auto shrink-0 text-xl font-black italic">
                    {selected ? '+1' : '?'}
                  </span>
                </div>

                {/* Player picker */}
                <div className="flex flex-wrap gap-2">
                  {otherPlayers.map((player) => {
                    const isActive = selected === player;
                    return (
                      <button
                        key={player}
                        onClick={() => {
                          setGuesser(idx, isActive ? null : player);
                        }}
                        className={`rounded-premium-sm text-label border px-3 py-1.5 font-black tracking-tight uppercase italic transition-all active:scale-95 ${
                          isActive
                            ? 'bg-premium-green/20 border-premium-green/60 text-premium-green'
                            : 'glass-card border-white/10 text-white/40'
                        }`}
                      >
                        {player}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setGuesser(idx, null);
                    }}
                    className={`rounded-premium-sm text-label border px-3 py-1.5 font-black tracking-tight uppercase italic transition-all active:scale-95 ${
                      selected === null
                        ? 'border-white/30 bg-white/10 text-white/60'
                        : 'glass-card border-white/5 text-white/20'
                    }`}
                  >
                    {t(`${NS.TABOO_REVERSE}.nobody`)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-white/10" />

      <PrimaryButton
        onClick={() => {
          onConfirm(guessers);
        }}
        className="bg-premium-orange shadow-premium-orange/30 text-white!"
      >
        {t(`${NS.TABOO_REVERSE}.confirm`)}
      </PrimaryButton>

      <button
        onClick={onStopGame}
        className="rounded-premium-md flex w-full items-center justify-center gap-2 border border-white/10 bg-white/5 p-3.5 transition-all active:scale-95"
      >
        <StopCircle className="h-4 w-4 text-white/30" />
        <span className="text-sm font-black tracking-widest text-white/30 uppercase">
          {t(`${NS.COMMON}.stopGame`)}
        </span>
      </button>
    </motion.div>
  );
};
