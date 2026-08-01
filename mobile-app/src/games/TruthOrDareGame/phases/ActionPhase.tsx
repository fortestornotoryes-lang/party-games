import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { ChoiceType } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ActionPhaseProps {
  currentPlayer: string;
  choice: ChoiceType;
  content: string;
  onDone: () => void;
}

export const ActionPhase: React.FC<ActionPhaseProps> = ({
  currentPlayer,
  choice,
  content,
  onDone,
}) => {
  const { t } = useTranslation();
  const isTruth = choice === 'truth';
  const rgb = isTruth ? '31,182,255' : '255,46,77';

  return (
    <MotiView
      key="action"
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex-1 gap-6 p-5"
    >
      <View className="items-center gap-2 pt-2">
        <View
          className={`rounded-full border px-4 py-1.5 ${
            isTruth
              ? 'bg-premium-sky/10 border-premium-sky/25'
              : 'bg-premium-red/10 border-premium-red/25'
          }`}
        >
          <Typography.Label color={isTruth ? 'sky' : 'red'}>
            {isTruth ? t(`${NS.TRUTH_OR_DARE}.truthBadge`) : t(`${NS.TRUTH_OR_DARE}.dareBadge`)}
          </Typography.Label>
        </View>
        <Typography.Title align="center">{currentPlayer}</Typography.Title>
      </View>

      <View className="flex-1 items-center justify-center px-2">
        <MotiView
          from={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 80 }}
          className="rounded-premium-xl w-full overflow-hidden p-8"
          style={{ borderWidth: 1.5, borderColor: `rgba(${rgb},0.2)` }}
        >
          {/* Grid-текстура веб-версии (repeating-linear-gradient) в RN невоспроизводима — только градиент */}
          <LinearGradient
            colors={[`rgba(${rgb},0.1)`, `rgba(${rgb},0.04)`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Text
            className="text-center font-black text-white"
            style={{ fontSize: 20, lineHeight: 27 }}
          >
            {content}
          </Text>
        </MotiView>
      </View>

      <PrimaryButton onClick={onDone} icon={CheckCircle} variant={isTruth ? 'blue' : 'red'}>
        {t(`${NS.TRUTH_OR_DARE}.completed`)}
      </PrimaryButton>
    </MotiView>
  );
};
