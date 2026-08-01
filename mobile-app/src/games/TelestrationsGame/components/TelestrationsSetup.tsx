import { ArrowRight, Pencil } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { DIFFICULTY_CONFIG } from '../constants';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

interface Props {
  playerCount: number;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: () => void;
}

export const TelestrationsSetup: React.FC<Props> = ({
  playerCount,
  difficulty,
  onDifficultyChange,
  onStart,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="setup"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 250 }}
      className="absolute inset-0"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 }}>
        <View className="items-center gap-2">
          <View className="rounded-premium-md bg-premium-orange/10 border-premium-orange/20 mb-1 h-14 w-14 items-center justify-center border">
            <Pencil size={28} color="#FF8A1F" />
          </View>
          <Text className="text-center text-3xl font-black uppercase italic text-white">
            {t(`${NS.TELESTRATIONS}.settingsTitle`)}
          </Text>
          <Text className="text-sm text-white/30">
            {t(`${NS.TELESTRATIONS}.playerCount`, { n: playerCount })}
          </Text>
        </View>

        <View className="w-full max-w-sm gap-3">
          <Text
            className="text-micro mb-3 text-center font-black uppercase text-white/25"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TELESTRATIONS}.difficultyLabel`)}
          </Text>
          {(Object.values(DIFFICULTY) as Difficulty[]).map((diff) => {
            const cfg = DIFFICULTY_CONFIG[diff];
            const isSelected = difficulty === diff;
            return (
              <Pressable
                key={diff}
                onPress={() => {
                  onDifficultyChange(diff);
                }}
                className={`rounded-premium-md w-full flex-row items-center gap-4 border p-4 ${
                  isSelected ? `${cfg.border} ${cfg.bg}` : 'border-white/10 bg-white/5 opacity-50'
                }`}
                style={({ pressed }) => (pressed ? { transform: [{ scale: 0.97 }] } : undefined)}
              >
                <Text className="text-2xl">{cfg.emoji}</Text>
                <View className="flex-1">
                  <Text
                    className={`text-base font-black uppercase italic ${
                      isSelected ? cfg.text : 'text-white/40'
                    }`}
                  >
                    {t(`${NS.TELESTRATIONS}.difficultyLabels.${diff}`)}
                  </Text>
                  <Text className="mt-0.5 text-xs text-white/30">
                    {t(`${NS.TELESTRATIONS}.difficultyDescriptions.${diff}`)}
                  </Text>
                </View>
                <View className="shrink-0 items-end">
                  <Text
                    className={`text-base font-black ${isSelected ? cfg.text : 'text-white/25'}`}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {t(`${NS.TELESTRATIONS}.timerSeconds`, { n: cfg.drawTime })}
                  </Text>
                  <Text
                    className="text-micro font-bold uppercase text-white/25"
                    style={{ letterSpacing: 1 }}
                  >
                    {t(`${NS.TELESTRATIONS}.drawingTimerLabel`)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={onStart}
          className="rounded-premium-md w-full max-w-sm flex-row items-center justify-center gap-3 bg-white py-5"
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.97 }] } : undefined)}
        >
          <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
            {t(`${NS.COMMON}.start`)}
          </Text>
          <ArrowRight size={20} color="#000" />
        </Pressable>
      </ScrollView>
    </MotiView>
  );
};
