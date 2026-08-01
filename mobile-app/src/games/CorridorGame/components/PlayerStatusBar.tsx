import React from 'react';
import { Text, View } from 'react-native';

import { PLAYER_COLOR } from '../constants';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  p1: string;
  p2: string;
  current: 1 | 2;
  winner: 1 | 2 | null;
  wallsLeft: Record<1 | 2, number>;
}

export const PlayerStatusBar: React.FC<Props> = ({ p1, p2, current, winner, wallsLeft }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row border-b border-white/5">
      {([1, 2] as const).map((p) => {
        const isActive = current === p && !winner;
        const name = p === 1 ? p1 : p2;
        const goalArrow = p === 1 ? '↑' : '↓';
        return (
          <View
            key={p}
            className={`flex-1 flex-row items-center gap-2.5 px-3 py-2.5 ${isActive ? 'bg-white/5' : ''}`}
            style={{ opacity: isActive ? 1 : 0.4 }}
          >
            <View
              className="h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: PLAYER_COLOR[p] }}
            >
              <Text className="text-sm font-black text-black">{goalArrow}</Text>
            </View>
            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="text-xs font-black uppercase text-white"
                style={{ letterSpacing: -0.3 }}
              >
                {name}
              </Text>
              <Text
                className="text-micro mt-0.5 font-black uppercase text-white/35"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.CORRIDOR}.wallsLeft`, { n: wallsLeft[p] })}
              </Text>
            </View>
            {!!isActive && (
              <View
                className="ml-auto shrink-0 rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${PLAYER_COLOR[p]}22` }}
              >
                <Text
                  className="text-tag font-black uppercase"
                  style={{ color: PLAYER_COLOR[p], letterSpacing: 2.5 }}
                >
                  {t(`${NS.CORRIDOR}.turn`)}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
