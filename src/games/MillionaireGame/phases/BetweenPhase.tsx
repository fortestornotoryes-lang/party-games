import { Banknote, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect } from 'react';

import { PRIZE_LADDER } from '@/games/MillionaireGame/constants.ts';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';

interface BetweenPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  onTakeMoney: () => void;
  onContinue: () => void;
}

export const BetweenPhase: React.FC<BetweenPhaseProps> = ({
  currentPlayer,
  questionIndex,
  onTakeMoney,
  onContinue,
}) => {
  const { t } = useTranslation();
  const currentPrize = PRIZE_LADDER[questionIndex];
  const nextPrize = PRIZE_LADDER[questionIndex + 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      feedbackService.celebrate('top', {
        particleCount: 55,
        spread: 50,
        colors: ['#FFCC1F', '#FFD700', '#FFA500', '#fff'],
        gravity: 1.2,
      });
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      key="between"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col items-center justify-center gap-5 p-6"
    >
      {/* Checkmark + player name */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
        className="flex flex-col items-center gap-3"
      >
        <div
          className="bg-premium-green/12 border-premium-green/40 flex h-20 w-20 items-center justify-center rounded-full border-2"
          style={{ boxShadow: '0 0 40px rgba(0,216,138,0.22)' }}
        >
          <CheckCircle className="text-premium-green h-10 w-10" />
        </div>
        <div className="text-center">
          <p className="text-tag text-premium-green/70 mb-1 font-black tracking-[0.28em] uppercase">
            {t(`${NS.MILLIONAIRE}.correctBadge`)}
          </p>
          <p className="text-label font-semibold text-white/55">{currentPlayer}</p>
        </div>
      </motion.div>

      {/* Prize won */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="glass-card rounded-premium-lg w-full p-5 text-center"
        style={{ borderColor: 'rgba(255,204,31,0.2)' }}
      >
        <div className="via-premium-yellow/40 mb-4 h-px bg-gradient-to-r from-transparent to-transparent" />
        <p className="text-tag mb-1 font-black tracking-[0.22em] text-white/35 uppercase">
          {t(`${NS.MILLIONAIRE}.questionSum`, { n: questionIndex + 1 })}
        </p>
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
          className="font-display text-premium-yellow text-5xl leading-none font-black tracking-tighter italic"
          style={{ textShadow: '0 0 40px rgba(255,204,31,0.5)' }}
        >
          {currentPrize}
        </motion.p>
        <p className="text-tag mt-2 font-black tracking-wider text-white/25 uppercase">
          {t(`${NS.MILLIONAIRE}.inPocket`)}
        </p>
      </motion.div>

      {/* Decision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full space-y-3"
      >
        {/* Primary: continue for next prize */}
        <button
          onClick={onContinue}
          className="rounded-premium-md border-premium-yellow/30 bg-premium-yellow/10 text-premium-yellow hover:bg-premium-yellow/15 flex h-16 w-full items-center justify-center gap-3 border text-lg font-black tracking-tighter uppercase italic transition-all active:scale-95"
          style={{ boxShadow: '0 0 20px rgba(255,204,31,0.08)' }}
        >
          <TrendingUp className="h-5 w-5 shrink-0" />
          <span>{t(`${NS.MILLIONAIRE}.goForPrize`, { prize: nextPrize })}</span>
        </button>

        {/* Secondary: take money */}
        <PrimaryButton variant="outline" icon={Banknote} onClick={onTakeMoney}>
          {t(`${NS.MILLIONAIRE}.takeMoney`, { prize: currentPrize })}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
