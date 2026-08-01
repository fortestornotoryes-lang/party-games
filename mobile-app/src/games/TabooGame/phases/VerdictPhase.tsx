import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { TabooClassicCard } from '../content';

import { StopGameButton } from '@/shared/components/StopGameButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface VerdictPhaseProps {
  card: TabooClassicCard;
  timedOut: boolean;
  currentExplainer: string;
  otherPlayers: string[];
  onVerdict: (guesser: string | null, penalty?: boolean) => void;
  onStopGame: () => void;
}

/** Строка-вердикт: игрок/«никто»/штраф — единый Pressable с прижатием */
const VerdictRow: React.FC<{
  onPress: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onPress, className, children }) => (
  <Pressable
    onPress={onPress}
    className={`rounded-premium-md w-full flex-row items-center justify-between border-2 p-4 ${className}`}
    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
  >
    {children}
  </Pressable>
);

export const VerdictPhase: React.FC<VerdictPhaseProps> = ({
  card,
  timedOut,
  currentExplainer,
  otherPlayers,
  onVerdict,
  onStopGame,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="verdict"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      className="mx-auto w-full max-w-lg gap-6 p-6"
    >
      {/* Раскрытие слова */}
      <View className="items-center gap-2 pt-2">
        {!!timedOut && (
          <Text
            className="text-micro text-premium-red/70 font-black uppercase"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TABOO}.timeOut`)}
          </Text>
        )}
        <Text
          className="text-micro font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO}.wordToGuess`)}
        </Text>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 48, lineHeight: 52, letterSpacing: -1.9 }}
        >
          {card.word}
        </Text>
      </View>

      {/* Напоминание запрещённых слов */}
      <View className="rounded-premium-md border-premium-red/20 bg-premium-red/5 border p-4">
        <Text
          className="text-micro text-premium-red/50 mb-2 text-center font-black uppercase"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO}.forbiddenWords`)}
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {card.forbidden.map((w, i) => (
            <View
              key={i}
              className="rounded-premium-sm border-premium-red/30 bg-premium-red/10 border px-3 py-1"
            >
              <Text className="text-label text-premium-red/70 font-black uppercase italic">{w}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="border-t border-white/10" />

      {/* Кто угадал? */}
      <View className="gap-3">
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO}.whoGuessed`)}
        </Text>

        {otherPlayers.map((player) => (
          <VerdictRow
            key={player}
            onPress={() => {
              onVerdict(player);
            }}
            className="bg-premium-green/10 border-premium-green/40"
          >
            <Text className="text-premium-green text-base font-black italic">{player}</Text>
            <Text className="text-premium-green ml-4 text-3xl font-black italic">+1</Text>
          </VerdictRow>
        ))}

        <VerdictRow
          onPress={() => {
            onVerdict(null);
          }}
          className="border-white/10 bg-white/5"
        >
          <Text className="text-base font-black italic text-white/50">
            {t(`${NS.TABOO}.noOneGuessed`)}
          </Text>
          <Text className="ml-4 text-3xl font-black italic text-white/30">0</Text>
        </VerdictRow>

        <VerdictRow
          onPress={() => {
            onVerdict(null, true);
          }}
          className="bg-premium-red/10 border-premium-red/30"
        >
          <View className="flex-1">
            <Text className="text-premium-red text-base font-black italic">
              {t(`${NS.TABOO}.saidForbidden`, { player: currentExplainer })}
            </Text>
            <Text className="text-tag mt-0.5 text-white/30">{t(`${NS.TABOO}.penaltyHint`)}</Text>
          </View>
          <Text className="text-premium-red ml-4 text-3xl font-black italic">−1</Text>
        </VerdictRow>
      </View>

      <View className="border-t border-white/10" />

      <StopGameButton onClick={onStopGame} />
    </MotiView>
  );
};
