import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GameOverPhaseProps {
  winner: Team;
  onRematch: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ winner, onRematch }) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="game_over"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 items-center justify-center gap-8"
    >
      <View className="items-center gap-4">
        <Text
          className="text-premium-green text-center text-sm font-bold uppercase"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.COMMON}.gameOver`)}
        </Text>
        <Text
          className={`text-center font-black uppercase ${
            winner === 'red' ? 'text-premium-red' : 'text-premium-blue'
          }`}
          style={{ fontSize: 48, lineHeight: 52 }}
        >
          {winner === 'red' ? t(`${NS.CODENAMES}.redWins`) : t(`${NS.CODENAMES}.blueWins`)}
        </Text>
      </View>
      <PrimaryButton onClick={onRematch} variant="white">
        {t(`${NS.COMMON}.rematch`)}
      </PrimaryButton>
    </MotiView>
  );
};
