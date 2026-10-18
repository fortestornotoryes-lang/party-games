import React from 'react';
import { Text, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

type AccentName = 'red' | 'orange' | 'sky' | 'green' | 'purple' | 'yellow';

const AC: Record<AccentName, { row: string; text: string; badge: string; badgeText: string }> = {
  red: {
    row: 'border-premium-red/50 bg-premium-red/10',
    text: 'text-premium-red',
    badge: 'bg-premium-red/10',
    badgeText: 'text-premium-red/70',
  },
  orange: {
    row: 'border-premium-orange/50 bg-premium-orange/10',
    text: 'text-premium-orange',
    badge: 'bg-premium-orange/10',
    badgeText: 'text-premium-orange/70',
  },
  sky: {
    row: 'border-premium-sky/50 bg-premium-sky/10',
    text: 'text-premium-sky',
    badge: 'bg-premium-sky/10',
    badgeText: 'text-premium-sky/70',
  },
  green: {
    row: 'border-premium-green/50 bg-premium-green/10',
    text: 'text-premium-green',
    badge: 'bg-premium-green/10',
    badgeText: 'text-premium-green/70',
  },
  purple: {
    row: 'border-premium-purple/50 bg-premium-purple/10',
    text: 'text-premium-purple',
    badge: 'bg-premium-purple/10',
    badgeText: 'text-premium-purple/70',
  },
  yellow: {
    row: 'border-premium-yellow/50 bg-premium-yellow/10',
    text: 'text-premium-yellow',
    badge: 'bg-premium-yellow/10',
    badgeText: 'text-premium-yellow/70',
  },
};

interface PlayerScoreListProps {
  players: string[];
  scores: Record<string, number>;
  /** Игрок, подсвеченный акцентным цветом */
  activePlayer?: string;
  /** Бейдж активного игрока, по умолчанию «объясняет» */
  activeLabel?: string;
  accentColor?: AccentName;
  /** Командные бейджи для неактивных игроков */
  teams?: [string[], string[]];
  className?: string;
}

export const PlayerScoreList: React.FC<PlayerScoreListProps> = ({
  players,
  scores,
  activePlayer,
  activeLabel,
  accentColor = 'red',
  teams,
  className,
}) => {
  const { t } = useTranslation();
  const ac = AC[accentColor];

  const teamBadge = (player: string) => {
    if (!teams) return null;
    const idx = teams[0].includes(player) ? 0 : teams[1].includes(player) ? 1 : null;
    if (idx === null) return null;
    return (
      <View
        className={`shrink-0 rounded-full px-2 py-0.5 ${
          idx === 0 ? 'bg-premium-orange/10' : 'bg-premium-sky/10'
        }`}
      >
        <Text
          className={`text-micro font-black uppercase ${
            idx === 0 ? 'text-premium-orange/80' : 'text-premium-sky/80'
          }`}
          style={{ letterSpacing: 1 }}
        >
          {t('common.teamN', { n: idx + 1 })}
        </Text>
      </View>
    );
  };

  const sorted = [...players].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  return (
    <View className={`w-full max-w-sm gap-2 ${className ?? ''}`}>
      <Text
        className="text-micro mb-1 text-center font-black uppercase text-white/30"
        style={{ letterSpacing: 1 }}
      >
        {t('common.scoreTable')}
      </Text>
      {sorted.map((player) => {
        const isActive = player === activePlayer;
        return (
          <View
            key={player}
            className={`rounded-premium-md flex-row items-center justify-between border px-4 py-3 ${
              isActive ? ac.row : 'border-white/10 bg-white/5'
            }`}
          >
            <View className="min-w-0 flex-1 flex-row items-center gap-2">
              <Text
                numberOfLines={1}
                className={`shrink font-black ${isActive ? ac.text : 'text-white/70'}`}
              >
                {player}
              </Text>
              {!!isActive && !!activeLabel && (
                <View className={`shrink-0 rounded-full px-2 py-0.5 ${ac.badge}`}>
                  <Text
                    className={`text-micro font-black uppercase ${ac.badgeText}`}
                    style={{ letterSpacing: 1 }}
                  >
                    {activeLabel}
                  </Text>
                </View>
              )}
              {!isActive && teamBadge(player)}
            </View>
            <Text
              className={`ml-3 text-2xl font-black italic ${isActive ? ac.text : 'text-white'}`}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {scores[player] ?? 0}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
