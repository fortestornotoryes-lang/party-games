import { AlarmClock } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

/** Волны, расходящиеся от счёта */
const RIPPLES = [0, 0.25, 0.5];

interface RoundEndPhaseProps {
  roundScore: number;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({ roundScore, onContinue }) => {
  const { t } = useTranslation();
  const positive = roundScore >= 0;
  const color = positive ? 'green' : 'red';

  return (
    <motion.div
      key="round_end"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col items-center justify-center gap-8 p-6 text-center"
    >
      <div className="space-y-2">
        <motion.div variants={STAGGER_ITEM} className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -18, 16, -12, 8, 0] }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <AlarmClock className="h-8 w-8 text-white/30" />
          </motion.div>
          <p className="text-micro font-black tracking-[0.5em] text-white/20 uppercase">
            {t(`${NS.ALIAS}.timeUp`)}
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center py-2">
          {RIPPLES.map((delay) => (
            <motion.span
              key={delay}
              aria-hidden
              className="absolute h-28 w-28 rounded-full border-2"
              style={{ borderColor: rgba(color, 0.5) }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 2.4, opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.3, delay: 0.5 + delay, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...SPRING.pop, delay: 0.2 }}
            className={`relative text-8xl leading-none font-black tracking-tighter italic ${
              positive ? 'text-premium-green' : 'text-premium-red'
            }`}
            style={{ textShadow: `0 0 40px ${rgba(color, 0.45)}` }}
          >
            <AnimatedNumber value={roundScore} from={0} delay={0.3} format={fmtScore} />
          </motion.div>
        </div>

        <motion.h3
          variants={STAGGER_ITEM}
          className="text-sm font-black tracking-tight text-white/45 uppercase italic"
        >
          {t(`${NS.ALIAS}.pointsPerRound`)}
        </motion.h3>
      </div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: 0.8 }}
      >
        <PrimaryButton onClick={onContinue}>{t(`${NS.ALIAS}.continueBtn`)}</PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
