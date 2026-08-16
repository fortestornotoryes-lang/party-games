import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  psychic: string;
  onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ psychic, onReady }) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="pass"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 items-center justify-center gap-10"
    >
      <View className="items-center gap-4">
        <Typography.Label size="sm" color="body">
          {t(`${NS.WAVELENGTH}.newRound`)}
        </Typography.Label>
        <Typography.Heading size="sm" color="muted">
          {t(`${NS.WAVELENGTH}.psychicLabel`)}:
        </Typography.Heading>
        <Typography.Display size="lg" color="purple">
          {psychic}
        </Typography.Display>
      </View>
      <View className="bg-premium-purple/5 border-premium-purple/10 rounded-premium-3xl max-w-xs border-2 p-8">
        <Typography.Body color="muted" align="center">
          {t(`${NS.WAVELENGTH}.psychicInstruction`, { psychic })}
        </Typography.Body>
      </View>
      <PrimaryButton onClick={onReady} variant="purple">
        {t(`${NS.WAVELENGTH}.iAmReady`)}
      </PrimaryButton>
    </MotiView>
  );
};
