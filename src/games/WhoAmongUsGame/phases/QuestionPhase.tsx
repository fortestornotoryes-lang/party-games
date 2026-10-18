import { Quote } from 'lucide-react';
import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import React from 'react';

import { ROUNDS_COUNT } from '../constants';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { CARD_DEAL_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

// Вопрос проявляется по словам: каждое всплывает из размытия
const wordsVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};

const wordVariants: Variants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: SPRING.soft },
};

interface QuestionPhaseProps {
  roundNo: number;
  question: string;
  onStartVoting: () => void;
}

export const QuestionPhase: React.FC<QuestionPhaseProps> = ({
  roundNo,
  question,
  onStartVoting,
}) => {
  const { t } = useTranslation();
  const words = question.split(' ');

  return (
    <>
      <motion.div variants={STAGGER_ITEM} className="flex flex-col items-center gap-3">
        <ProgressDots count={ROUNDS_COUNT} current={roundNo} activeColor="bg-premium-pink" />
        <Typography.Caption className="tracking-[0.4em]">
          {t(`${NS.WHO_AMONG_US}.roundOf`, { n: roundNo + 1, total: ROUNDS_COUNT })}
        </Typography.Caption>
      </motion.div>

      <motion.div
        variants={CARD_DEAL_VARIANTS}
        className="rounded-premium-2xl relative w-full overflow-hidden border px-6 pt-14 pb-10"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.018) 100%)',
          borderColor: rgba('pink', 0.25),
          boxShadow: `var(--shadow-card), 0 0 60px ${rgba('pink', 0.12)}`,
        }}
      >
        <motion.div
          aria-hidden
          className="absolute top-4 left-5"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...SPRING.pop, delay: 0.2 }}
        >
          <Quote className="text-premium-pink/40 h-8 w-8" />
        </motion.div>
        <motion.div variants={wordsVariants} initial="initial" animate="animate">
          <Typography.Display size="md" align="center">
            {words.map((word, i) => (
              <React.Fragment key={i}>
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>{' '}
              </React.Fragment>
            ))}
          </Typography.Display>
        </motion.div>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="w-full">
        <PrimaryButton onClick={onStartVoting}>{t(`${NS.WHO_AMONG_US}.startVoting`)}</PrimaryButton>
      </motion.div>
    </>
  );
};
