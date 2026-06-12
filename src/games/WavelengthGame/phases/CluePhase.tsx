import { ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CluePhaseProps {
  psychic: string;
  currentPair: string[];
  targetValue: number;
  onDone: () => void;
}

export const CluePhase: React.FC<CluePhaseProps> = ({
  psychic,
  currentPair,
  targetValue,
  onDone,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="clue"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex h-full flex-col space-y-6"
    >
      {/* Psychic identity */}
      <div className="space-y-2 text-center">
        <div className="text-tag font-black tracking-[0.4em] text-white/35 uppercase">
          {t(`${NS.WAVELENGTH}.currentPsychic`)}
        </div>
        <h3 className="text-premium-purple text-4xl font-black tracking-tighter uppercase italic">
          {psychic}
        </h3>
        <p className="mx-auto max-w-xs text-sm font-medium text-white/50">
          {t(`${NS.WAVELENGTH}.onlyYouSeeTarget`)}
        </p>
      </div>

      {/* Scale card */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-6">
        <GameCard className="relative w-full overflow-hidden">
          {/* Top accent line */}
          <div
            className="absolute top-0 right-0 left-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(199,123,255,0.4) 50%, transparent 100%)',
            }}
          />

          <div className="pointer-events-none relative w-full px-8 py-8">
            {/* Scale track */}
            <div className="relative h-5 w-full overflow-visible rounded-full border border-white/8 bg-black/40">
              {/* Purple target zone */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{ left: `${Math.max(0, targetValue - 5)}%`, width: '10%' }}
                className="bg-premium-purple/70 rounded-premium-xs absolute top-0 h-full"
                aria-hidden="true"
              >
                {/* Glow */}
                <div
                  className="rounded-premium-xs absolute inset-0"
                  style={{ boxShadow: '0 0 18px 4px rgba(199,123,255,0.45)' }}
                />
              </motion.div>

              {/* Center tick */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.45, duration: 0.25 }}
                style={{ left: `${targetValue}%` }}
                className="absolute top-1/2 z-10 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/70"
              />
            </div>

            {/* Pair labels */}
            <div className="mt-3 flex justify-between">
              <span className="text-tag text-premium-purple/80 font-black tracking-[0.2em] uppercase">
                {currentPair[0]}
              </span>
              <span className="text-tag text-premium-purple/80 font-black tracking-[0.2em] uppercase">
                {currentPair[1]}
              </span>
            </div>
          </div>
        </GameCard>

        {/* Clue instruction */}
        <div className="w-full space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/35">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t(`${NS.WAVELENGTH}.giveClueHint`)}</span>
          </div>

          {/* Pair display */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-black tracking-tight text-white/50 uppercase italic">
              {currentPair[0]}
            </span>
            <ChevronRight className="text-premium-purple h-4 w-4" />
            <span className="text-base font-black tracking-tight text-white uppercase italic">
              {currentPair[1]}
            </span>
          </div>
        </div>
      </div>

      <PrimaryButton onClick={onDone} variant="purple">
        {t(`${NS.WAVELENGTH}.iGaveClue`)}
      </PrimaryButton>
    </motion.div>
  );
};
