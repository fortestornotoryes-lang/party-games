import { Trophy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  currentPlayer: string;
  onPassDone: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ currentPlayer, onPassDone }) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="pass"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 220 }}
      className="flex-1 gap-4 p-5"
    >
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-xs">
          <PassPhoneCard
            playerName={currentPlayer}
            badge={t(`${NS.MILLIONAIRE}.subtitle`)}
            badgeColor="yellow"
            accentColor="yellow"
            icon={Trophy}
            instruction={t(`${NS.MILLIONAIRE}.tapToStart`)}
            onClick={onPassDone}
          />
        </View>
      </View>
    </MotiView>
  );
};
