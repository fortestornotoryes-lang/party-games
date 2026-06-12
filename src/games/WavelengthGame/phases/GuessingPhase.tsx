import { motion } from 'motion/react';
import React from 'react';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GuessingPhaseProps {
  currentPair: string[];
  guessValue: number;
  onGuessChange: (val: number) => void;
  onConfirm: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  currentPair,
  guessValue,
  onGuessChange,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="guessing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex h-full flex-col space-y-6"
    >
      {/* Title */}
      <div className="text-center">
        <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">
          {t(`${NS.WAVELENGTH}.adjustWave`)}
        </h3>
      </div>

      {/* Slider section */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-8">
        <div className="w-full space-y-5">
          {/* Pole labels */}
          <div className="flex justify-between px-2">
            <span className="text-tag text-premium-purple font-black tracking-[0.2em] uppercase">
              {currentPair[0]}
            </span>
            <span className="text-tag text-premium-purple font-black tracking-[0.2em] uppercase">
              {currentPair[1]}
            </span>
          </div>

          {/* Custom slider */}
          <div className="relative flex h-12 items-center">
            {/* Track */}
            <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-full border border-white/8 bg-white/5">
              {/* Fill */}
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${guessValue}%`,
                  background:
                    'linear-gradient(90deg, rgba(199,123,255,0.2) 0%, rgba(199,123,255,0.55) 100%)',
                }}
              />
            </div>

            {/* Thumb overlay */}
            <motion.div
              style={{ left: `calc(${guessValue}% - 14px)` }}
              animate={{ left: `calc(${guessValue}% - 14px)` }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="rounded-premium-sm pointer-events-none absolute top-1/2 z-10 flex h-12 w-7 -translate-y-1/2 items-center justify-center bg-white shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <div className="h-6 w-0.5 rounded-full bg-black/15" />
            </motion.div>

            {/* Invisible native input for interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={guessValue}
              onChange={(e) => {
                onGuessChange(parseInt(e.target.value));
              }}
              className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>

        {/* Value display */}
        <GameCard className="border-premium-purple/20 bg-premium-purple/5 w-full border py-6 text-center">
          <div className="text-tag text-premium-purple/60 mb-1 font-black tracking-[0.3em] uppercase">
            {t(`${NS.WAVELENGTH}.valueLabel`)}
          </div>
          <div className="text-5xl font-black tracking-tighter text-white italic">{guessValue}</div>
        </GameCard>
      </div>

      <PrimaryButton onClick={onConfirm} variant="purple">
        {t(`${NS.WAVELENGTH}.confirmChoice`)}
      </PrimaryButton>
    </motion.div>
  );
};
