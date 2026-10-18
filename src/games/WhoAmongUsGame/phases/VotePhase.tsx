import { Check } from 'lucide-react';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { PICK_DELAY_MS } from '../constants';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

const gridVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const tileVariants: Variants = {
  initial: { opacity: 0, scale: 0.7, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING.pop },
};

interface VotePhaseProps {
  question: string;
  candidates: string[];
  onPick: (player: string) => void;
}

/** Голосующий выбирает игрока: плитка вспыхивает розовым, остальные гаснут. */
export const VotePhase: React.FC<VotePhaseProps> = ({ question, candidates, onPick }) => {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (picked === null) return;
    const id = window.setTimeout(() => {
      onPick(picked);
    }, PICK_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [picked, onPick]);

  const pick = (player: string) => {
    if (picked !== null) return;
    feedbackService.vibrate(VIBRATE.tap);
    setPicked(player);
  };

  return (
    <>
      <motion.div variants={STAGGER_ITEM}>
        <Typography.Body align="center" color="faint">
          {question}
        </Typography.Body>
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <Typography.Caption className="text-center tracking-[0.3em]">
          {t(`${NS.WHO_AMONG_US}.pickPlayer`)}
        </Typography.Caption>
      </motion.div>
      <motion.div variants={gridVariants} className="grid grid-cols-2 gap-3">
        {candidates.map((p) => {
          const isPicked = picked === p;
          const isDimmed = picked !== null && !isPicked;
          return (
            <motion.div key={p} variants={tileVariants} className="min-w-0">
              <motion.button
                type="button"
                whileTap={picked === null ? { scale: 0.94 } : undefined}
                animate={{
                  scale: isPicked ? 1.06 : isDimmed ? 0.94 : 1,
                  opacity: isDimmed ? 0.3 : 1,
                  borderColor: isPicked ? rgba('pink', 0.75) : 'rgba(255,255,255,0.08)',
                  boxShadow: isPicked ? `0 0 40px ${rgba('pink', 0.35)}` : '0 0 0px rgba(0,0,0,0)',
                }}
                transition={SPRING.pop}
                onClick={() => {
                  pick(p);
                }}
                className="glass-card rounded-premium-xl relative h-full min-h-16 w-full p-4 text-center font-bold wrap-anywhere"
              >
                {p}
                <AnimatePresence>
                  {isPicked ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={SPRING.pop}
                      className="bg-premium-pink absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full"
                    >
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};
