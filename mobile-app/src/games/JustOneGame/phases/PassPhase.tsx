import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  guesser: string;
  onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ guesser, onReady }) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="pass"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 items-center justify-center gap-8 p-6"
    >
      <View className="items-center gap-3">
        <Text
          className="text-micro text-center font-black uppercase text-white/25"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.JUST_ONE}.newRound`)}
        </Text>
        <Text
          className="text-center text-base font-black uppercase text-white/50"
          style={{ letterSpacing: 4.8 }}
        >
          {t(`${NS.JUST_ONE}.guessing`)}:
        </Text>
        <Text
          className="text-premium-yellow text-center font-black uppercase italic"
          style={{
            fontSize: 48,
            lineHeight: 50,
            letterSpacing: -1.9,
            textShadowColor: 'rgba(255,204,31,0.3)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          }}
        >
          {guesser}
        </Text>
      </View>

      <View className="bg-premium-yellow/[0.05] border-premium-yellow/15 rounded-premium-xl w-full max-w-sm border p-6">
        <Text className="text-sm font-medium text-white/40" style={{ lineHeight: 22 }}>
          {t(`${NS.JUST_ONE}.passInstruction`, { guesser })}
        </Text>
      </View>

      <PrimaryButton onClick={onReady}>{t(`${NS.JUST_ONE}.weTookPhone`)}</PrimaryButton>
    </MotiView>
  );
};
