import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Text } from 'react-native';

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
        <MotiView
          key="game-over"
          from={{ opacity: 0, translateY: 16, scale: 0.94 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className={`rounded-premium-md items-center border-2 p-6 ${
            win
              ? win.player === 1
                ? 'bg-premium-red/10 border-premium-red/40'
                : 'bg-premium-yellow/10 border-premium-yellow/40'
              : 'border-white/20 bg-white/5'
          }`}
        >
          <Text
            className="text-micro mb-2 font-black uppercase text-white/35"
            style={{ letterSpacing: 5 }}
          >
            {win ? t(`${NS.COMMON}.winner`) : t(`${NS.CONNECT_FOUR}.roundResult`)}
          </Text>
          <Text
            className={`text-center font-black uppercase italic ${
              win ? (win.player === 1 ? 'text-premium-red' : 'text-premium-yellow') : 'text-white/50'
            }`}
            style={{ fontSize: 48, lineHeight: 52 }}
          >
            {win ? (win.player === 1 ? p1 : p2) : t(`${NS.COMMON}.draw`)}
          </Text>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
