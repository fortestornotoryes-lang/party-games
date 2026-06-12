import { Flame, Snowflake } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { ChoiceType } from '../types';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ChoicePhaseProps {
  currentPlayer: string;
  onChoice: (type: ChoiceType) => void;
}

export const ChoicePhase: React.FC<ChoicePhaseProps> = ({ currentPlayer, onChoice }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="choice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="flex flex-col items-center justify-center px-6 py-4"
      >
        <Typography.Label color="faint" className="mb-1.5">
          {t(`${NS.TRUTH_OR_DARE}.choosing`)}
        </Typography.Label>
        <Typography.Display size="md" className="text-center">
          {currentPlayer}
        </Typography.Display>
      </motion.div>

      <div className="h-40" />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-5">
        {/* TRUTH */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 28 }}
          whileTap={{ scale: 0.975, transition: { duration: 0.08 } }}
          onClick={() => {
            onChoice('truth');
          }}
          className="rounded-premium-2xl relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden"
          style={{
            background:
              'linear-gradient(160deg, rgba(31,182,255,0.17) 0%, rgba(11,9,21,0.5) 55%, rgba(31,182,255,0.05) 100%)',
            border: '1px solid rgba(31,182,255,0.26)',
            boxShadow:
              '0 30px 90px -15px rgba(31,182,255,0.18), inset 0 1px 0 rgba(31,182,255,0.18)',
          }}
        >
          <div className="pointer-events-none absolute top-0 left-0 h-56 w-56 bg-[radial-gradient(circle_at_0%_0%,rgba(31,182,255,0.13),transparent_65%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(31,182,255,0.07),transparent)]" />

          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 20 }}
            className="relative z-10"
          >
            <Snowflake
              className="text-premium-sky h-16 w-16"
              style={{ filter: 'drop-shadow(0 0 22px rgba(31,182,255,0.6))' }}
            />
          </motion.div>

          <div className="relative z-10 px-6 text-center">
            <div
              className="text-premium-sky leading-none font-black tracking-tighter uppercase italic"
              style={{ fontSize: 52, textShadow: '0 0 40px rgba(31,182,255,0.4)' }}
            >
              {t(`${NS.TRUTH_OR_DARE}.truthTitle`)}
            </div>
            <Typography.Label color="sky" className="mt-2 tracking-[0.5em] opacity-45" as="div">
              {t(`${NS.TRUTH_OR_DARE}.truthHint`)}
            </Typography.Label>
          </div>
        </motion.button>

        {/* DARE */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17, type: 'spring', stiffness: 360, damping: 28 }}
          whileTap={{ scale: 0.975, transition: { duration: 0.08 } }}
          onClick={() => {
            onChoice('dare');
          }}
          className="rounded-premium-2xl relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden"
          style={{
            background:
              'linear-gradient(160deg, rgba(255,46,77,0.17) 0%, rgba(11,9,21,0.5) 55%, rgba(255,46,77,0.05) 100%)',
            border: '1px solid rgba(255,46,77,0.26)',
            boxShadow: '0 30px 90px -15px rgba(255,46,77,0.18), inset 0 1px 0 rgba(255,46,77,0.18)',
          }}
        >
          <div className="pointer-events-none absolute top-0 right-0 h-56 w-56 bg-[radial-gradient(circle_at_100%_0%,rgba(255,46,77,0.13),transparent_65%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(255,46,77,0.07),transparent)]" />

          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: 25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.27, type: 'spring', stiffness: 380, damping: 20 }}
            className="relative z-10"
          >
            <Flame
              className="text-premium-red h-16 w-16"
              style={{ filter: 'drop-shadow(0 0 22px rgba(255,46,77,0.6))' }}
            />
          </motion.div>

          <div className="relative z-10 px-6 text-center">
            <div
              className="text-premium-red leading-none font-black tracking-tighter uppercase italic"
              style={{ fontSize: 52, textShadow: '0 0 40px rgba(255,46,77,0.4)' }}
            >
              {t(`${NS.TRUTH_OR_DARE}.dareTitle`)}
            </div>
            <Typography.Label color="red" className="mt-2 tracking-[0.5em] opacity-45" as="div">
              {t(`${NS.TRUTH_OR_DARE}.dareHint`)}
            </Typography.Label>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
