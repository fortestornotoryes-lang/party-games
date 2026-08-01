import { RotateCcw, Trophy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface GameOverPhaseProps {
  currentTeam: Team;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ currentTeam, onBack }) => {
  const { t } = useTranslation();
  const isRed = currentTeam.color === 'red';
  const teamName = isRed ? t(`${NS.ALIAS}.teamRed`) : t(`${NS.ALIAS}.teamBlue`);

  return (
    <MotiView
      key="game_over"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 items-center justify-center gap-10 p-6"
    >
      <View className="items-center">
        {/* Веб-глоу (blur-3xl подложка) в RN недоступен — мягкий цветной круг */}
        <View
          className={`absolute -inset-16 rounded-full ${
            isRed ? 'bg-premium-red/15' : 'bg-premium-blue/15'
          }`}
        />
        <Trophy size={96} color={rgba(isRed ? 'red' : 'blue', 1)} style={{ marginBottom: 20 }} />
        <Typography.Display size="xl" align="center" className="mb-2">
          {t(`${NS.ALIAS}.victory`)}
        </Typography.Display>
        <Typography.Label size="md" color={isRed ? 'red' : 'blue'} align="center">
          {t(`${NS.ALIAS}.winningTeam`, { name: teamName })}
        </Typography.Label>
      </View>
      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={isRed ? 'red' : 'blue'}>
        {t(`${NS.ALIAS}.mainMenu`)}
      </PrimaryButton>
    </MotiView>
  );
};
