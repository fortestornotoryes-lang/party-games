import { motion } from 'motion/react';
import React, { useRef } from 'react';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

interface VotePhaseProps {
  voter: string;
  statements: string[];
  onPick: (index: number) => void;
}

/** Имя текущего голосующего и одинаковые карточки без следов выбора предыдущего игрока. */
export const VotePhase: React.FC<VotePhaseProps> = ({ voter, statements, onPick }) => {
  const { t } = useTranslation();
  const submitted = useRef(false);

  const pick = (index: number) => {
    if (submitted.current) return;
    submitted.current = true;
    feedbackService.vibrate(VIBRATE.tap);
    onPick(index);
  };

  return (
    <>
      <motion.div variants={STAGGER_ITEM}>
        <p className="text-label mb-2 text-center font-black tracking-widest text-white/45 uppercase">
          {t(`${NS.TWO_TRUTHS}.voterLabel`)}
        </p>
        <Typography.Display size="sm" color="white" align="center" className="mb-4">
          {voter}
        </Typography.Display>
        <Typography.Body align="center" color="faint">
          {t(`${NS.TWO_TRUTHS}.voteQuestion`)}
        </Typography.Body>
      </motion.div>
      {statements.map((s, i) => (
        <motion.div key={i} variants={STAGGER_ITEM}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={SPRING.pop}
            onClick={() => {
              pick(i);
            }}
            className="glass-card rounded-premium-xl relative flex w-full items-start gap-2 p-4 text-left text-base leading-relaxed"
          >
            <span className="text-micro mt-1.5 shrink-0 font-black text-white/40">{i + 1}.</span>
            <span className="min-w-0 flex-1 wrap-anywhere">{s}</span>
          </motion.button>
        </motion.div>
      ))}
    </>
  );
};
