import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '../../../components/UI';
import { TabooCard } from '../../../constants/tabooReverseContent';

interface PlayingPhaseProps {
  card: TabooCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  onEarlySolve: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  onEarlySolve,
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
        {/* Timer number */}
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

        <div className="mt-auto pt-4">
          <PrimaryButton
            onClick={onEarlySolve}
            className="bg-premium-orange text-white! shadow-premium-orange/30"
          >
            СЛОВО УГАДАНО!
          </PrimaryButton>
          <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 mt-3">
            Само слово называть нельзя
          </p>
        </div>
      </div>
    </motion.div>
  );
};
