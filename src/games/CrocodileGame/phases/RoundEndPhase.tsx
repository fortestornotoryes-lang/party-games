import { AlarmClock, PartyPopper } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect } from 'react';

import { GUESSED_CONFETTI } from '../constants';
import type { WordOption } from '../types';

import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SHAKE_X, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

/** Волны, расходящиеся от счёта при удаче */
const RIPPLES = [0, 0.25, 0.5];

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

  useEffect(() => {
    if (!guessed) return;
    feedbackService.celebrate('small', {
      colors: GUESSED_CONFETTI,
      origin: { y: 0.45 },
    });
  }, [guessed]);

  return (
    <motion.div
      key="round_end"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col items-center justify-center gap-8 overflow-hidden p-6 text-center"
    >
      <div className="w-full space-y-3">
        <motion.div variants={STAGGER_ITEM} className="flex flex-col items-center gap-3">
          <motion.div
            animate={
              guessed
                ? { scale: [1, 1.3, 1], rotate: [0, -12, 0] }
                : { rotate: [0, -18, 16, -12, 8, 0] }
            }
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {guessed ? (
              <PartyPopper className="text-premium-green h-9 w-9" />
            ) : (
              <AlarmClock className="h-8 w-8 text-white/30" />
            )}
          </motion.div>
          <p className="text-micro font-black tracking-[0.5em] text-white/30 uppercase">
            {timedOut && !guessed ? t(`${NS.CROCODILE}.timeUp`) : ''}
          </p>
          <h3 className="text-sm font-black tracking-tight text-white/60 uppercase italic">
            {guessed ? t(`${NS.CROCODILE}.roundGuessed`) : t(`${NS.CROCODILE}.roundFailed`)}
          </h3>
        </motion.div>

        <div className="relative flex items-center justify-center py-2">
          {guessed
            ? RIPPLES.map((delay) => (
                <motion.span
                  key={delay}
                  aria-hidden
                  className="absolute h-28 w-28 rounded-full border-2"
                  style={{ borderColor: rgba('green', 0.5) }}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 2.4, opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.3, delay: 0.45 + delay, ease: 'easeOut' }}
                />
              ))
            : null}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: guessed ? 0 : SHAKE_X }}
            transition={{
              scale: { ...SPRING.pop, delay: 0.2 },
              opacity: { duration: 0.2, delay: 0.2 },
              x: { duration: 0.5, delay: 0.45 },
            }}
            className={`relative text-8xl leading-none font-black tracking-tighter italic ${
              guessed ? 'text-premium-green' : 'text-white/30'
            }`}
            style={guessed ? { textShadow: `0 0 40px ${rgba('green', 0.45)}` } : undefined}
          >
            {guessed ? (
              <AnimatedNumber value={roundPoints} from={0} delay={0.3} format={(n) => `+${n}`} />
            ) : (
              '0'
            )}
          </motion.div>
        </div>

        <motion.p
          variants={STAGGER_ITEM}
          className="text-micro font-black tracking-[0.3em] text-white/30 uppercase"
        >
          {t(`${NS.CROCODILE}.pointsPerRound`)}
        </motion.p>
        <motion.div
          className="px-4 pt-2"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ ...SPRING.soft, delay: 0.6 }}
        >
          <p className="text-xs text-white/40">{t(`${NS.CROCODILE}.wordWas`)}</p>
          <FitText as="p" className="text-3xl leading-tight font-black text-white uppercase">
            {chosen.word}
          </FitText>
        </motion.div>
      </div>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: 0.85 }}
      >
        <PrimaryButton onClick={onContinue}>{t(`${NS.CROCODILE}.continueBtn`)}</PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
