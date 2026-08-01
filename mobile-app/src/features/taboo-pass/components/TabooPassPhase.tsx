import type { LucideIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { PlayerScoreList } from '@/entities/player/components/PlayerScoreList';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

type AccentColor = 'red' | 'orange';

interface TabooPassPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  /** Командный режим — бейджи команд у неактивных игроков */
  teams?: [string[], string[]];
  accentColor: AccentColor;
  icon: LucideIcon;
  instruction: string;
  onStart: () => void;
}

/**
 * Общая Pass-фаза семейства Taboo: PassPhoneCard + отсортированный
 * скорборд с акцентным цветом. Используется TabooGame (red) и
 * TabooReverseGame (orange).
 */
export const TabooPassPhase: React.FC<TabooPassPhaseProps> = ({
  playerNames,
  scores,
  currentExplainer,
  teams,
  accentColor,
  icon,
  instruction,
  onStart,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="pass"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      className="flex-1 items-center justify-center gap-8 p-6"
    >
      <View className="w-full max-w-xs">
        <PassPhoneCard
          playerName={currentExplainer}
          badge={t(`${NS.TABOO}.explainerBadge`)}
          badgeColor={accentColor}
          instruction={instruction}
          icon={icon}
          accentColor={accentColor}
          onClick={onStart}
        />
      </View>
      <PlayerScoreList
        players={playerNames}
        scores={scores}
        activePlayer={currentExplainer}
        accentColor={accentColor}
        teams={teams}
      />
    </MotiView>
  );
};
