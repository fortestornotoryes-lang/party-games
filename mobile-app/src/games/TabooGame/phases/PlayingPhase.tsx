import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { TabooClassicCard } from '../content';

import { PlayingHeader } from '@/shared/components/PlayingHeader';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TimerBar } from '@/shared/components/TimerBar';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

/** Плавное уменьшение шрифта по длине слова + перенос как запасной вариант (веб-rem → px) */
const wordFontSize = (word: string): number => {
  const n = word.length;
  if (n <= 6) return 56;
  if (n <= 8) return 45;
  if (n <= 10) return 37;
  if (n <= 13) return 30;
  return 24;
};

interface PlayingPhaseProps {
  card: TabooClassicCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  onGuessed: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  onGuessed,
}) => {
  const { t } = useTranslation();
  const timerPct = (timeLeft / cardTimer) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#eab308' : '#ef4444';
  const fs = wordFontSize(card.word);

  return (
    <MotiView
      key="playing"
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1"
    >
      <TimerBar pct={timerPct} color={timerColor} />

      <View className="mx-auto w-full max-w-lg flex-1 gap-5 p-6">
        <PlayingHeader explainer={currentExplainer} timeLeft={timeLeft} timerColor={timerColor} />

        {/* Запрещённые слова — первыми, чтобы объясняющий сразу видел ограничения */}
        <View className="rounded-premium-lg border-premium-red/30 bg-premium-red/5 border-2 p-5">
          <Text
            className="text-micro text-premium-red/60 mb-3 text-center font-black uppercase"
            style={{ letterSpacing: 5 }}
          >
            🚫 {t(`${NS.TABOO}.forbiddenWords`)}
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {card.forbidden.map((w, i) => (
              <View
                key={i}
                className="rounded-premium-md border-premium-red/40 bg-premium-red/10 border px-4 py-2"
              >
                <Text className="text-premium-red text-sm font-black uppercase italic">{w}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Загаданное слово */}
        <View className="flex-1 items-center justify-center">
          <View className="rounded-premium-2xl w-full border-2 border-white/15 bg-white/5 p-8">
            <Text
              className="text-micro mb-3 text-center font-black uppercase text-white/30"
              style={{ letterSpacing: 5 }}
            >
              {t(`${NS.TABOO}.wordToGuess`)}
            </Text>
            <Text
              className="text-center font-black uppercase italic text-white"
              style={{ fontSize: fs, lineHeight: fs * 1.15, letterSpacing: fs * -0.04 }}
            >
              {card.word}
            </Text>
          </View>
        </View>

        {/* Действие */}
        <View className="gap-2">
          <PrimaryButton onClick={onGuessed} variant="emerald">
            {t(`${NS.TABOO}.wordGuessed`)}
          </PrimaryButton>
          <Text
            className="text-micro text-center font-black uppercase text-white/20"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TABOO}.forbiddenHint`)}
          </Text>
        </View>
      </View>
    </MotiView>
  );
};
