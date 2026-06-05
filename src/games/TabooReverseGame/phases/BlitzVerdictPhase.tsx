import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, StopCircle } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { BlitzResult } from '../types';

interface BlitzVerdictPhaseProps {
  results: BlitzResult[];
  currentExplainer: string;
  otherPlayers: string[];
  onConfirm: (guessers: Array<string | null>) => void;
  onStopGame: () => void;
}

export const BlitzVerdictPhase: React.FC<BlitzVerdictPhaseProps> = ({
  results,
  currentExplainer,
  otherPlayers,
  onConfirm,
  onStopGame,
}) => {
  // One slot per result: player name if guessed, null if nobody / skipped
  const [guessers, setGuessers] = useState<Array<string | null>>(() => results.map(() => null));

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
      className="flex flex-col p-6 gap-6 max-w-lg mx-auto w-full"
    >
      {/* Header */}
      <div className="text-center pt-2 space-y-1">
        <p className="text-micro font-black uppercase tracking-[0.5em] text-white/30">Итог хода</p>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          {currentExplainer}
        </h2>
        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="text-sm font-black text-premium-green">
            ✓ {guessedResults.length} угадано
          </span>
          {skippedPenalty > 0 && (
            <span className="text-sm font-black text-premium-red">
              ✗ {skippedPenalty} пропущено
            </span>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8 glass-card rounded-2xl border border-white/10">
          <p className="text-white/30 font-black uppercase tracking-widest text-sm">
            Ни одной карточки
          </p>
          <p className="text-white/20 text-xs mt-1">Время вышло до первого угадывания</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Guessed cards — assign guesser */}
          {results.map((result, idx) => {
            if (result.status === 'skipped') {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-premium-red/20 bg-premium-red/5 flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 shrink-0 text-premium-red/60" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black italic uppercase tracking-tight text-white/50 truncate">
                      {result.card.word}
                    </p>
                    <p className="text-tag text-premium-red/60 mt-0.5">
                      Пропуск — −1 для {currentExplainer}
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
                className="p-4 rounded-2xl border border-premium-green/20 bg-premium-green/5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-premium-green/70" />
                  <p className="font-black italic uppercase tracking-tight text-white truncate">
                    {result.card.word}
                  </p>
                  <span className="ml-auto text-xl font-black italic text-premium-green shrink-0">
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
                        onClick={() => setGuesser(idx, isActive ? null : player)}
                        className={`px-3 py-1.5 rounded-xl border text-label font-black italic uppercase tracking-tight transition-all active:scale-95 ${
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
                    onClick={() => setGuesser(idx, null)}
                    className={`px-3 py-1.5 rounded-xl border text-label font-black italic uppercase tracking-tight transition-all active:scale-95 ${
                      selected === null
                        ? 'bg-white/10 border-white/30 text-white/60'
                        : 'glass-card border-white/5 text-white/20'
                    }`}
                  >
                    Никто
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-white/10" />

      <PrimaryButton
        onClick={() => onConfirm(guessers)}
        className="bg-premium-orange text-white! shadow-premium-orange/30"
      >
        ПОДТВЕРДИТЬ
      </PrimaryButton>

      <button
        onClick={onStopGame}
        className="w-full p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <StopCircle className="w-4 h-4 text-white/30" />
        <span className="font-black uppercase text-sm text-white/30 tracking-widest">
          Завершить игру
        </span>
      </button>
    </motion.div>
  );
};
