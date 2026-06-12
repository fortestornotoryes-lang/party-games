import { ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
  const { t } = useTranslation();
  const isGood = score > 0;

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex h-full flex-col space-y-6"
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          {t(`${NS.WAVELENGTH}.result`)}
        </h2>
        <div className="flex items-center justify-center gap-1.5 text-sm font-black tracking-widest text-white/45 uppercase">
          <span>{currentPair[0]}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{currentPair[1]}</span>
        </div>
      </div>

      {/* Scale + score */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-8">
        {/* Scale bar */}
        <div className="relative w-full px-6">
          <div className="relative h-8 w-full overflow-visible rounded-full border border-white/8 bg-white/5">
            {/* Overflow clip wrapper */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {/* Purple target zone */}
              <div
                style={{ left: `${Math.max(0, targetValue - 5)}%`, width: '10%' }}
                className="bg-premium-purple/40 rounded-premium-xs absolute top-0 h-full"
              />
            </div>

            {/* Target center line */}
            <div
              style={{ left: `${targetValue}%` }}
              className="absolute top-1/2 z-10 h-12 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            />

            {/* Guess marker */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '200%' }}
              transition={{ delay: 0.2, duration: 0.35, type: 'spring', damping: 20 }}
              style={{ left: `${guessValue}%` }}
              className="bg-premium-yellow absolute top-[-50%] z-20 w-1 -translate-x-1/2 rounded-full"
              aria-label={t(`${NS.WAVELENGTH}.answerLabel`)}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 12px 3px rgba(255,204,31,0.55)' }}
              />
            </motion.div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex justify-between">
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-3 bg-white/70" />
              <span className="text-micro font-black tracking-[0.2em] text-white/45 uppercase">
                {t(`${NS.WAVELENGTH}.targetLabel`)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-premium-yellow h-0.5 w-3" />
              <span className="text-micro font-black tracking-[0.2em] text-white/45 uppercase">
                {t(`${NS.WAVELENGTH}.answerLabel`)}
              </span>
            </div>
          </div>
        </div>

        {/* Score display */}
        <div className="w-full space-y-3 text-center">
          <div className="text-tag font-black tracking-[0.4em] text-white/35 uppercase">
            {t(`${NS.WAVELENGTH}.yourScore`)}
          </div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', damping: 18, stiffness: 220 }}
            className={`text-7xl font-black tracking-tighter italic ${
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
              <GameCard className="border-premium-purple/40 bg-premium-purple/10 inline-flex items-center gap-2 border px-5 py-2">
                <span className="text-premium-yellow text-sm font-black tracking-widest uppercase italic">
                  {t(`${NS.WAVELENGTH}.perfect`)}
                </span>
              </GameCard>
            </motion.div>
          )}
        </div>
      </div>

      <PrimaryButton onClick={onNext} variant="purple" icon={RotateCcw}>
        {t(`${NS.WAVELENGTH}.nextRound`)}
      </PrimaryButton>
    </motion.div>
  );
};
