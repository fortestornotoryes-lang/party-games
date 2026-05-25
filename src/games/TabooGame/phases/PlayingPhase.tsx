import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '../../../components/UI';
import { TabooClassicCard } from '../../../constants/tabooContent';

interface PlayingPhaseProps {
  card: TabooClassicCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  onGuessed: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  onGuessed,
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

      <div className="flex-1 flex flex-col p-6 gap-5 max-w-lg mx-auto w-full">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
            {currentExplainer} объясняет
          </span>
          <span
            className="text-2xl font-black italic tabular-nums"
            style={{ color: timerColor }}
          >
            {timeLeft}с
          </span>
        </div>

        {/* Forbidden words — shown first so explainer sees the constraints */}
        <div className="p-5 rounded-3xl border-2 border-premium-red/30 bg-premium-red/5">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-red/60 mb-3 text-center">
            🚫 Запрещённые слова
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {card.forbidden.map((w, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-2xl border border-premium-red/40 bg-premium-red/10 font-black italic uppercase text-sm text-premium-red"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Main word */}
        <div className="flex-1 flex items-center justify-center">
          <div className="p-8 rounded-4xl border-2 border-white/15 bg-white/5 text-center w-full">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 mb-3">
              Загаданное слово
            </p>
            <h2
              className="font-black italic uppercase tracking-tighter leading-none text-white"
              style={{ fontSize: card.word.length > 10 ? '2.4rem' : card.word.length > 7 ? '3rem' : '3.8rem' }}
            >
              {card.word}
            </h2>
          </div>
        </div>

        {/* Action */}
        <div className="space-y-2">
          <PrimaryButton
            onClick={onGuessed}
            className="bg-premium-green! text-white! shadow-premium-green/30"
          >
            СЛОВО УГАДАНО!
          </PrimaryButton>
          <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20">
            Запрещённые слова произносить нельзя
          </p>
        </div>
      </div>
    </motion.div>
  );
};
