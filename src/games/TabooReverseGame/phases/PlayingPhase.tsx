import React from 'react';
import { motion } from 'motion/react';
import { SkipForward } from 'lucide-react';
import { PrimaryButton } from '../../../components/UI';
import { TabooCard } from '../../../constants/tabooReverseContent';

interface PlayingPhaseProps {
  card: TabooCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  isBlitz?: boolean;
  blitzStats?: { guessed: number; skipped: number };
  onGuessed: () => void;
  onSkip?: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  isBlitz,
  blitzStats,
  onGuessed,
  onSkip,
}) => {
  const timerPct   = (timeLeft / cardTimer) * 100;
  const timerColor =
    timerPct > 50 ? '#22c55e' :
    timerPct > 25 ? '#eab308' : '#ef4444';

  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col min-h-full"
    >
      {/* Timer bar */}
      <div className="h-1.5 w-full bg-white/10">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
        />
      </div>

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-lg mx-auto w-full">
        {/* Top row: explainer label + timer + blitz stats */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
            {currentExplainer} объясняет
          </span>

          <div className="flex items-center gap-3">
            {/* Blitz counters */}
            {isBlitz && blitzStats && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tabular-nums text-premium-green">
                  ✓{blitzStats.guessed}
                </span>
                <span className="text-[11px] font-black tabular-nums text-premium-red">
                  ✗{blitzStats.skipped}
                </span>
              </div>
            )}
            <span
              className="text-2xl font-black italic tabular-nums"
              style={{ color: timerColor }}
            >
              {timeLeft}с
            </span>
          </div>
        </div>

        {/* Secret word */}
        <div className="p-8 rounded-4xl border-2 border-premium-orange/30 bg-premium-orange/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-orange/50 mb-3">
            Загаданное слово
          </p>
          <h2
            className="font-black italic uppercase tracking-tighter leading-none text-white"
            style={{ fontSize: card.word.length > 8 ? '2.8rem' : '3.5rem' }}
          >
            {card.word}
          </h2>
        </div>

        {/* Required words */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 text-center">
            Обязательные слова — используй все!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {card.required.map((w, i) => (
              <div
                key={i}
                className="px-4 py-2.5 rounded-2xl border border-premium-orange/30 bg-premium-orange/10 font-black italic uppercase text-sm text-premium-orange"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-auto pt-4 space-y-3">
          {isBlitz ? (
            /* Blitz: two buttons side by side */
            <div className="flex gap-3">
              <PrimaryButton
                onClick={onGuessed}
                className="flex-1 bg-premium-green! text-white! shadow-premium-green/30"
              >
                УГАДАНО!
              </PrimaryButton>
              <button
                onClick={onSkip}
                className="flex items-center justify-center gap-2 px-5 py-4 rounded-premium-lg glass-card border border-white/10 text-white/50 active:scale-95 transition-all"
              >
                <SkipForward className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-wider">−1</span>
              </button>
            </div>
          ) : (
            /* Classic / team: single button */
            <PrimaryButton
              onClick={onGuessed}
              className="bg-premium-orange text-white! shadow-premium-orange/30"
            >
              СЛОВО УГАДАНО!
            </PrimaryButton>
          )}

          <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20">
            {isBlitz
              ? 'Пропуск даёт −1 объясняющему'
              : 'Само слово называть нельзя'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
