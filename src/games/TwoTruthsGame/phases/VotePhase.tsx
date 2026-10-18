import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { PICK_DELAY_MS } from '../constants';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

interface VotePhaseProps {
  statements: string[];
  onPick: (index: number) => void;
}

/** Голосующий выбирает ложь: выбранная карточка подсвечивается, остальные гаснут. */
export const VotePhase: React.FC<VotePhaseProps> = ({ statements, onPick }) => {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (picked === null) return;
    const id = window.setTimeout(() => {
      onPick(picked);
    }, PICK_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [picked, onPick]);

  const pick = (index: number) => {
    if (picked !== null) return;
    feedbackService.vibrate(VIBRATE.tap);
    setPicked(index);
  };

  return (
    <>
      <motion.div variants={STAGGER_ITEM}>
        <Typography.Body align="center" color="faint">
          {t(`${NS.TWO_TRUTHS}.voteQuestion`)}
        </Typography.Body>
      </motion.div>
      {statements.map((s, i) => {
        const isPicked = picked === i;
        const isDimmed = picked !== null && !isPicked;
        return (
          <motion.div key={i} variants={STAGGER_ITEM}>
            <motion.button
              type="button"
              whileTap={picked === null ? { scale: 0.97 } : undefined}
              animate={{
                scale: isPicked ? 1.03 : isDimmed ? 0.97 : 1,
                opacity: isDimmed ? 0.3 : 1,
                borderColor: isPicked ? rgba('teal', 0.7) : 'rgba(255,255,255,0.08)',
                boxShadow: isPicked ? `0 0 40px ${rgba('teal', 0.3)}` : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={SPRING.pop}
              onClick={() => {
                pick(i);
              }}
              className="glass-card rounded-premium-xl relative flex w-full items-start gap-2 p-4 text-left text-base leading-relaxed"
            >
              <span className="text-micro mt-1.5 shrink-0 font-black text-white/40">{i + 1}.</span>
              <span className="min-w-0 flex-1 wrap-anywhere">{s}</span>
              <AnimatePresence>
                {isPicked ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={SPRING.pop}
                    className="bg-premium-teal flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        );
      })}
    </>
  );
};
