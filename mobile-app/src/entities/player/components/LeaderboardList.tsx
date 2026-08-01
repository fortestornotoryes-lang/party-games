import React from 'react';
import { Text, View } from 'react-native';

import { rgba } from '@/shared/theme/colors';

interface LeaderboardListProps {
  players: string[];
  scores: Record<string, number>;
  className?: string;
}

/**
 * Ранжированный список очков для GameOver-экранов.
 * Сортирует по очкам, победителя подсвечивает жёлтым.
 */
export const LeaderboardList: React.FC<LeaderboardListProps> = ({ players, scores, className }) => {
  const sorted = [...players].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner = topScore > 0 && topScore > secondScore;

  return (
    <View className={`w-full gap-3 ${className ?? ''}`}>
      {sorted.map((player, idx) => {
        const sc = scores[player] ?? 0;
        const isWinner = idx === 0 && hasWinner;
        return (
          <View
            key={player}
            className={`rounded-premium-md flex-row items-center justify-between border-2 p-5 ${
              isWinner ? 'border-premium-yellow/60 bg-premium-yellow/10' : 'border-white/10 bg-white/5'
            }`}
            style={
              isWinner
                ? {
                    shadowColor: rgba('yellow', 0.5),
                    shadowOpacity: 0.4,
                    shadowRadius: 15,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 6,
                  }
                : undefined
            }
          >
            <View className="min-w-0 flex-1 flex-row items-center gap-3">
              <Text
                className={`w-8 shrink-0 text-xl font-black italic ${
                  isWinner ? 'text-premium-yellow' : 'text-white/20'
                }`}
              >
                #{idx + 1}
              </Text>
              <Text
                numberOfLines={1}
                className={`shrink text-base font-black ${
                  isWinner ? 'text-premium-yellow' : 'text-white/70'
                }`}
              >
                {isWinner ? '🏆 ' : ''}
                {player}
              </Text>
            </View>
            <Text
              className={`ml-3 shrink-0 text-4xl font-black italic ${
                isWinner ? 'text-premium-yellow' : 'text-white/50'
              }`}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {sc}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
