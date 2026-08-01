import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Snowflake } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ChoiceType } from '../types';

import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ChoicePhaseProps {
  currentPlayer: string;
  onChoice: (type: ChoiceType) => void;
}

/** Конфиг большой кнопки выбора: цвета от PREMIUM_RGB sky/red */
const CHOICE_STYLES = {
  truth: {
    rgb: '31,182,255',
    textClass: 'text-premium-sky',
    icon: Snowflake,
    iconRotateFrom: '-25deg',
  },
  dare: {
    rgb: '255,46,77',
    textClass: 'text-premium-red',
    icon: Flame,
    iconRotateFrom: '25deg',
  },
} as const;

const ChoiceButton: React.FC<{
  type: ChoiceType;
  title: string;
  hint: string;
  delay: number;
  onPress: () => void;
}> = ({ type, title, hint, delay, onPress }) => {
  const s = CHOICE_STYLES[type];
  const Icon = s.icon;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28, delay }}
      className="flex-1"
    >
      <Pressable
        onPress={onPress}
        className="rounded-premium-2xl flex-1 items-center justify-center gap-4 overflow-hidden"
        style={({ pressed }) => [
          { borderWidth: 1, borderColor: `rgba(${s.rgb},0.26)` },
          pressed && { transform: [{ scale: 0.975 }] },
        ]}
      >
        {/* Веб-версия: linear-gradient(160deg) + radial-подсветки + text-shadow — здесь один диагональный градиент */}
        <LinearGradient
          colors={[`rgba(${s.rgb},0.17)`, 'rgba(11,9,21,0.5)', `rgba(${s.rgb},0.05)`]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <MotiView
          from={{ scale: 0.3, opacity: 0, rotate: s.iconRotateFrom }}
          animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
          transition={{ type: 'spring', stiffness: 380, damping: 20, delay: delay + 100 }}
        >
          <Icon size={64} color={`rgba(${s.rgb},1)`} />
        </MotiView>

        <View className="items-center px-6">
          <Text
            className={`font-black uppercase italic ${s.textClass}`}
            style={{ fontSize: 52, lineHeight: 52, letterSpacing: -2 }}
          >
            {title}
          </Text>
          <Typography.Label
            color={type === 'truth' ? 'sky' : 'red'}
            className="mt-2 opacity-45"
            style={{ letterSpacing: 5 }}
          >
            {hint}
          </Typography.Label>
        </View>
      </Pressable>
    </MotiView>
  );
};

export const ChoicePhase: React.FC<ChoicePhaseProps> = ({ currentPlayer, onChoice }) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="choice"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 150 }}
      className="flex-1"
    >
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 200, delay: 50 }}
        className="items-center justify-center px-6 py-4"
      >
        <Typography.Label color="faint" className="mb-1.5">
          {t(`${NS.TRUTH_OR_DARE}.choosing`)}
        </Typography.Label>
        <Typography.Display size="md" align="center">
          {currentPlayer}
        </Typography.Display>
      </MotiView>

      <View className="flex-1 gap-3 px-4 pb-5">
        <ChoiceButton
          type="truth"
          title={t(`${NS.TRUTH_OR_DARE}.truthTitle`)}
          hint={t(`${NS.TRUTH_OR_DARE}.truthHint`)}
          delay={100}
          onPress={() => {
            onChoice('truth');
          }}
        />
        <ChoiceButton
          type="dare"
          title={t(`${NS.TRUTH_OR_DARE}.dareTitle`)}
          hint={t(`${NS.TRUTH_OR_DARE}.dareHint`)}
          delay={170}
          onPress={() => {
            onChoice('dare');
          }}
        />
      </View>
    </MotiView>
  );
};
