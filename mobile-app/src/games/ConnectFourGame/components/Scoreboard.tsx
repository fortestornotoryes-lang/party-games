import React from 'react';
import { Text, View } from 'react-native';

import type { C4Player } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  p1: string;
  p2: string;
  current: C4Player;
  gameOver: boolean;
  score: Record<C4Player, number>;
}

export const Scoreboard: React.FC<Props> = ({ p1, p2, current, gameOver, score }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between px-1">
      <View style={{ opacity: !gameOver && current === 1 ? 1 : 0.35 }}>
        <View className="flex-row items-center gap-2">
          <View className="bg-premium-red h-4 w-4 rounded-full" />
          <Text className="text-base font-black uppercase italic text-white">{p1}</Text>
        </View>
        <Text
          className="text-micro mt-1 pl-6 font-black uppercase text-white/40"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.COMMON}.wins`, { n: score[1] })}
        </Text>
      </View>

      <Text className="text-tag font-black uppercase text-white/20" style={{ letterSpacing: 2 }}>
        vs
      </Text>

      <View style={{ opacity: !gameOver && current === 2 ? 1 : 0.35 }}>
        <View className="flex-row items-center justify-end gap-2">
          <Text className="text-base font-black uppercase italic text-white">{p2}</Text>
          <View className="bg-premium-yellow h-4 w-4 rounded-full" />
        </View>
        <Text
          className="text-micro mt-1 pr-6 text-right font-black uppercase text-white/40"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.COMMON}.wins`, { n: score[2] })}
        </Text>
      </View>
    </View>
  );
};
