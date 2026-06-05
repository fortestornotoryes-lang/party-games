import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { GameCard } from '@/components/GameCard';

interface RevealPhaseProps {
  currentPair: string[];
  targetValue: number;
  guessValue: number;
  score: number;
  onNext: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({
  currentPair,
  targetValue,
  guessValue,
  score,
  onNext,
}) => {
  const isGood = score > 0;

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="h-full flex flex-col space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          РЕЗУЛЬТАТ
        </h2>
        <div className="flex items-center justify-center gap-1.5 text-sm font-black uppercase tracking-widest text-white/45">
          <span>{currentPair[0]}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{currentPair[1]}</span>
        </div>
      </div>

      {/* Scale + score */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Scale bar */}
        <div className="relative w-full px-6">
          <div className="h-8 w-full bg-white/5 rounded-full relative overflow-visible border border-white/8">
            {/* Overflow clip wrapper */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Purple target zone */}
              <div
                style={{ left: `${Math.max(0, targetValue - 5)}%`, width: '10%' }}
                className="absolute top-0 h-full bg-premium-purple/40 rounded-premium-xs"
              />
            </div>

            {/* Target center line */}
            <div
              style={{ left: `${targetValue}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/70 z-10 rounded-full"
            />

            {/* Guess marker */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '200%' }}
              transition={{ delay: 0.2, duration: 0.35, type: 'spring', damping: 20 }}
              style={{ left: `${guessValue}%` }}
              className="absolute top-[-50%] -translate-x-1/2 w-1 bg-premium-yellow rounded-full z-20"
              aria-label="Ваш ответ"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 12px 3px rgba(255,204,31,0.55)' }}
              />
            </motion.div>
          </div>

          {/* Legend */}
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-white/70" />
              <span className="text-micro font-black uppercase tracking-[0.2em] text-white/45">
                Цель
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-premium-yellow" />
              <span className="text-micro font-black uppercase tracking-[0.2em] text-white/45">
                Ответ
              </span>
            </div>
          </div>
        </div>

        {/* Score display */}
        <div className="text-center space-y-3 w-full">
          <div className="text-tag font-black uppercase tracking-[0.4em] text-white/35">
            Твои очки
          </div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', damping: 18, stiffness: 220 }}
            className={`text-7xl font-black italic tracking-tighter ${
              isGood ? 'text-premium-green' : 'text-premium-red'
            }`}
            style={
              isGood
                ? { textShadow: '0 0 40px rgba(0,216,138,0.4)' }
                : { textShadow: '0 0 40px rgba(255,46,77,0.4)' }
            }
          >
            {score}
          </motion.div>

          {/* Perfect badge */}
          {score === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, type: 'spring', damping: 20 }}
            >
              <GameCard className="inline-flex items-center gap-2 px-5 py-2 border border-premium-purple/40 bg-premium-purple/10">
                <span className="text-sm font-black italic uppercase tracking-widest text-premium-yellow">
                  ИДЕАЛЬНО!
                </span>
              </GameCard>
            </motion.div>
          )}
        </div>
      </div>

      <PrimaryButton onClick={onNext} variant="purple" icon={RotateCcw}>
        СЛЕДУЮЩИЙ РАУНД
      </PrimaryButton>
    </motion.div>
  );
};
