import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface RoundEndPhaseProps {
  roundScore: number;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({ roundScore, onContinue }) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="round_end"
      from={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex-1 items-center justify-center gap-8 p-6"
    >
      <View className="items-center gap-2">
        <Text
          className="text-micro text-center font-black uppercase text-white/20"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.ALIAS}.timeUp`)}
        </Text>
        <Text
          className={`text-center font-black italic ${
            roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
          }`}
          style={{ fontSize: 96, lineHeight: 98, letterSpacing: -3.8 }}
        >
          {fmtScore(roundScore)}
        </Text>
        <Text
          className="text-center text-sm font-black uppercase italic text-white/45"
          style={{ letterSpacing: -0.3 }}
        >
          {t(`${NS.ALIAS}.pointsPerRound`)}
        </Text>
      </View>
      <PrimaryButton onClick={onContinue}>{t(`${NS.ALIAS}.continueBtn`)}</PrimaryButton>
    </MotiView>
  );
};
