import { LinearGradient } from 'expo-linear-gradient';
import { Siren, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { CatastropheScenario } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface BriefingPhaseProps {
  scenario: CatastropheScenario;
  playerCount: number;
  bunkerCapacity: number;
  onStart: () => void;
}

export const BriefingPhase: React.FC<BriefingPhaseProps> = ({
  scenario,
  playerCount,
  bunkerCapacity,
  onStart,
}) => {
  const { t } = useTranslation();

  const handleStart = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onStart();
  };

  return (
    <MotiView
      key="briefing"
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 500 }}
      className="flex-1 gap-6 px-5 py-6"
    >
      {/* Сирена */}
      <View className="flex-row items-center justify-center gap-2">
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 0.4 }}
          transition={{ type: 'timing', duration: 800, loop: true }}
        >
          <Siren size={20} color={rgba('orange', 1)} />
        </MotiView>
        <Typography.Label size="sm" color="orange">
          {t(`${NS.BUNKER}.emergencyAlert`)}
        </Typography.Label>
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 0.4 }}
          transition={{ type: 'timing', duration: 800, loop: true }}
        >
          <Siren size={20} color={rgba('orange', 1)} />
        </MotiView>
      </View>

      {/* Карточка катастрофы */}
      <MotiView
        from={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 200, type: 'spring', stiffness: 260, damping: 22 }}
        className="rounded-premium-md overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: rgba('orange', 0.35) }}
      >
        <LinearGradient
          colors={[rgba('orange', 0.12), rgba('red', 0.08)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="items-center gap-4 p-7">
          <Text style={{ fontSize: 48, lineHeight: 54 }}>{scenario.emoji}</Text>
          <Typography.Display size="sm" color="white" glow align="center">
            {scenario.title.toUpperCase()}
          </Typography.Display>
          <Typography.Body size="sm" color="body" align="center">
            {scenario.description}
          </Typography.Body>
        </View>
      </MotiView>

      {/* Вместимость бункера */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 450 }}
        className="rounded-premium-md border border-white/10 bg-white/5 p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Users size={16} color="rgba(255,255,255,0.4)" />
            <Typography.Label size="xs" color="muted">
              {t(`${NS.BUNKER}.playersInGroup`)}
            </Typography.Label>
          </View>
          <Typography.Heading size="sm" color="white">
            {playerCount}
          </Typography.Heading>
        </View>
        <View className="my-3 h-px bg-white/5" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-base">🏠</Text>
            <Typography.Label size="xs" color="muted">
              {t(`${NS.BUNKER}.bunkerSpots`)}
            </Typography.Label>
          </View>
          <Typography.Heading size="sm" color="orange">
            {bunkerCapacity}
          </Typography.Heading>
        </View>

        {/* Слоты */}
        <View className="mt-3 flex-row flex-wrap gap-1.5">
          {Array.from({ length: playerCount }).map((_, i) => (
            <View
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < bunkerCapacity ? 'bg-premium-orange/70' : 'bg-white/10'
              }`}
              style={{ minWidth: 18 }}
            />
          ))}
        </View>
        <View className="mt-2 flex-row justify-between">
          <Typography.Caption color="faint">
            {t(`${NS.BUNKER}.wontEnter`, { n: playerCount - bunkerCapacity })}
          </Typography.Caption>
          <Typography.Caption color="orange">
            {t(`${NS.BUNKER}.willEnter`, { n: bunkerCapacity })}
          </Typography.Caption>
        </View>
      </MotiView>

      {/* Кнопка старта */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 600 }}
        className="mt-auto"
      >
        <PrimaryButton onClick={handleStart} variant="premium">
          {t(`${NS.BUNKER}.distributeCards`)}
        </PrimaryButton>
      </MotiView>
    </MotiView>
  );
};
