import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  guesser: string;
  onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ guesser, onReady }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="pass"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex min-h-full flex-col items-center justify-center gap-8 p-6 text-center"
    >
      <div className="space-y-3">
        <p className="text-micro font-black tracking-[0.5em] text-white/25 uppercase">
          {t(`${NS.JUST_ONE}.newRound`)}
        </p>
        <h3 className="text-base font-black tracking-[0.3em] text-white/50 uppercase">
          {t(`${NS.JUST_ONE}.guessing`)}:
        </h3>
        <h2
          className="text-premium-yellow text-5xl leading-none font-black tracking-tighter uppercase italic"
          style={{ textShadow: '0 0 40px rgba(255,204,31,0.3)' }}
        >
          {guesser}
        </h2>
      </div>

      <div className="bg-premium-yellow/[0.05] border-premium-yellow/15 rounded-premium-xl w-full max-w-sm border p-6 text-sm leading-relaxed text-white/40">
        {t(`${NS.JUST_ONE}.passInstruction`, { guesser })}
      </div>

      <PrimaryButton onClick={onReady}>{t(`${NS.JUST_ONE}.weTookPhone`)}</PrimaryButton>
    </motion.div>
  );
};
