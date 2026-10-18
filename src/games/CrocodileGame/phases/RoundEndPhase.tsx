import { motion } from 'motion/react';
import React from 'react';

import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface RoundEndPhaseProps {
  chosen: WordOption;
  /** Очки, которые команда получит за раунд (0 при неудаче). */
  roundPoints: number;
  guessed: boolean;
  timedOut: boolean;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({
  chosen,
  roundPoints,
  guessed,
  timedOut,
  onContinue,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="round_end"
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex h-full flex-col items-center justify-center gap-8 p-6 text-center"
    >
      <div className="w-full space-y-3">
        <p className="text-micro font-black tracking-[0.5em] text-white/30 uppercase">
          {timedOut && !guessed ? t(`${NS.CROCODILE}.timeUp`) : ''}
        </p>
        <h3 className="text-sm font-black tracking-tight text-white/60 uppercase italic">
          {guessed ? t(`${NS.CROCODILE}.roundGuessed`) : t(`${NS.CROCODILE}.roundFailed`)}
        </h3>
        <div
          className={`text-8xl leading-none font-black tracking-tighter italic ${
            guessed ? 'text-premium-green' : 'text-white/30'
          }`}
        >
          {guessed ? `+${roundPoints}` : '0'}
        </div>
        <p className="text-micro font-black tracking-[0.3em] text-white/30 uppercase">
          {t(`${NS.CROCODILE}.pointsPerRound`)}
        </p>
        <div className="px-4 pt-2">
          <p className="text-xs text-white/40">
            {t(`${NS.CROCODILE}.wordWas`)}
          </p>
          <FitText as="p" className="text-3xl leading-tight font-black text-white uppercase">
            {chosen.word}
          </FitText>
        </div>
      </div>
      <PrimaryButton onClick={onContinue}>{t(`${NS.CROCODILE}.continueBtn`)}</PrimaryButton>
    </motion.div>
  );
};
