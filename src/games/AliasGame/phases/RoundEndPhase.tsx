import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface RoundEndPhaseProps {
  roundScore: number;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({ roundScore, onContinue }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="round_end"
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex h-full flex-col items-center justify-center gap-8 p-6 text-center"
    >
      <div className="space-y-2">
        <p className="text-micro font-black tracking-[0.5em] text-white/20 uppercase">
          {t(`${NS.ALIAS}.timeUp`)}
        </p>
        <div
          className={`text-8xl leading-none font-black tracking-tighter italic ${
            roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
          }`}
        >
          {fmtScore(roundScore)}
        </div>
        <h3 className="text-sm font-black tracking-tight text-white/45 uppercase italic">
          {t(`${NS.ALIAS}.pointsPerRound`)}
        </h3>
      </div>
      <PrimaryButton onClick={onContinue}>{t(`${NS.ALIAS}.continueBtn`)}</PrimaryButton>
    </motion.div>
  );
};
