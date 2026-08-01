import React from 'react';
import { Text, View } from 'react-native';

import { tBadge, tBg, teamLabel, tText } from '../helpers';
import type { TeamColor, TeamState } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ScoreRowProps {
  red: TeamState;
  blue: TeamState;
}

export const ScoreRow: React.FC<ScoreRowProps> = ({ red, blue }) => {
  const { t } = useTranslation();
  return (
    <View className="w-full flex-row gap-3">
      {(
        [
          ['red', red],
          ['blue', blue],
        ] as [TeamColor, TeamState][]
      ).map(([color, state]) => {
        const captain = state.players[state.captainIndex % state.players.length];
        return (
          <View key={color} className={`rounded-premium-sm flex-1 gap-2 border p-3 ${tBg(color)}`}>
            <View className="flex-row items-center justify-between">
              <Text className={`text-micro font-black uppercase ${tText(color)}`}>
                {teamLabel(color, t)}
              </Text>
              <Text className="text-tag font-bold text-white/40">
                {t(`${NS.DECRYPTO}.scoreCompact`, {
                  inter: state.interceptions,
                  fail: state.fails,
                })}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-1">
              {state.players.map((p) => (
                <View
                  key={p}
                  className={`text-micro rounded-premium-xs px-1.5 py-0.5 ${
                    p === captain ? tBadge(color) : 'bg-white/5'
                  }`}
                >
                  <Text
                    className={`text-micro font-bold ${p === captain ? tText(color) : 'text-white/35'}`}
                  >
                    {p === captain ? `★ ${p}` : p}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};
