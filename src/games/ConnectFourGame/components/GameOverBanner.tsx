import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import type { WinResult } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  show: boolean;
  win: WinResult | null;
  p1: string;
  p2: string;
}

export const GameOverBanner: React.FC<Props> = ({ show, win, p1, p2 }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!!show && (
        <motion.div
          key="game-over"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className={`rounded-premium-md border-2 p-6 text-center ${
            win
              ? win.player === 1
                ? 'bg-premium-red/10 border-premium-red/40 shadow-[0_0_40px_rgba(255,46,77,0.18)]'
                : 'bg-premium-yellow/10 border-premium-yellow/40 shadow-[0_0_40px_rgba(255,204,31,0.18)]'
              : 'border-white/20 bg-white/5'
          }`}
        >
          <p className="text-micro mb-2 font-black tracking-[0.45em] text-white/35 uppercase">
            {win ? t(`${NS.COMMON}.winner`) : t(`${NS.CONNECT_FOUR}.roundResult`)}
          </p>
          <h3
            className={`text-5xl leading-none font-black uppercase italic ${
              win
                ? win.player === 1
                  ? 'text-premium-red'
                  : 'text-premium-yellow'
                : 'text-white/50'
            }`}
          >
            {win ? (win.player === 1 ? p1 : p2) : t(`${NS.COMMON}.draw`)}
          </h3>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
