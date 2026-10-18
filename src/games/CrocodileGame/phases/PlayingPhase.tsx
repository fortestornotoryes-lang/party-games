import { CheckCircle, Drama, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { CROCODILE_LEVELS, LEVEL_STYLES, URGENT_SECONDS } from '../constants';
import { formatTime } from '../helpers';
import type { WordOption } from '../types';

import { FitText } from '@/shared/components/FitText';
import { FlipCard } from '@/shared/components/FlipCard';
import { RingTimer } from '@/shared/components/RingTimer';
import { UrgencyVignette } from '@/shared/components/UrgencyVignette';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

/** Общий вид обеих сторон карточки слова */
const CARD_FACE =
  'rounded-premium-2xl flex h-full min-h-56 flex-col items-center justify-center gap-2 border-2 px-6 py-10 text-center';

interface PlayingPhaseProps {
  chosen: WordOption;
  timeLeft: number;
  onGuessed: () => void;
  onGiveUp: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  chosen,
  timeLeft,
  onGuessed,
  onGiveUp,
}) => {
  const { t } = useTranslation();
  const { points, time } = CROCODILE_LEVELS[chosen.difficulty];
  const urgent = timeLeft <= URGENT_SECONDS;

  return (
    <motion.div
      key="playing"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex h-full flex-col overflow-hidden"
    >
      <UrgencyVignette active={urgent} />

      <motion.div variants={STAGGER_ITEM} className="relative z-10 flex justify-center pt-5 pb-1">
        <RingTimer
          timeLeft={timeLeft}
          total={time}
          urgent={urgent}
          color="var(--color-premium-lime)"
          label={formatTime(timeLeft)}
          sizeClassName="h-20 w-20"
          textClassName="text-lg"
        />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        {/* Лёгкое парение карточки, пока идёт показ */}
        <motion.div
          className="w-full max-w-sm"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FlipCard
            revealDelay={0.25}
            back={
              <div
                className={`${CARD_FACE} border-premium-lime/30`}
                style={{
                  background: `repeating-linear-gradient(45deg, ${rgba('lime', 0.06)} 0 12px, transparent 12px 24px), #0e0b1c`,
                }}
              >
                <Drama className="text-premium-lime/60 h-16 w-16" />
              </div>
            }
            front={
              <div
                className={`${CARD_FACE} border-white/10`}
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 100%), #0e0b1c',
                  boxShadow: `0 0 50px ${rgba('lime', 0.12)}`,
                }}
              >
                <p className="text-micro text-premium-lime/50 font-black tracking-[0.5em] uppercase">
                  {t(`${NS.CROCODILE}.explainWord`)}
                </p>
                <FitText
                  as="h2"
                  className="text-6xl leading-none font-black tracking-tighter text-white uppercase italic"
                >
                  {chosen.word}
                </FitText>
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING.pop, delay: 0.75 }}
                  className={`text-micro pt-2 font-black tracking-[0.3em] uppercase ${LEVEL_STYLES[chosen.difficulty].text}`}
                >
                  {t(`${NS.CROCODILE}.pointsValue`, { n: points })}
                </motion.p>
              </div>
            }
          />
        </motion.div>
      </div>

      <motion.div
        variants={STAGGER_ITEM}
        className="relative z-10 grid grid-cols-2 gap-3 px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={SPRING.pop}
          onClick={onGiveUp}
          className="rounded-premium-lg bg-premium-red/[0.07] border-premium-red/20 active:bg-premium-red/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-colors"
        >
          <XCircle className="text-premium-red h-8 w-8" />
          <span className="text-micro text-premium-red/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.CROCODILE}.giveUp`)}
          </span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={SPRING.pop}
          onClick={onGuessed}
          className="rounded-premium-lg bg-premium-green/[0.07] border-premium-green/20 active:bg-premium-green/14 flex h-21.5 flex-col items-center justify-center gap-2 border transition-colors"
        >
          <CheckCircle className="text-premium-green h-8 w-8" />
          <span className="text-micro text-premium-green/55 font-black tracking-[0.2em] uppercase">
            {t(`${NS.CROCODILE}.guessed`)}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
