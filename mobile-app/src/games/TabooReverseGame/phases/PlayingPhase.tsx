import { SkipForward } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { TabooCard } from '../content';

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
  card: TabooCard;
  currentExplainer: string;
  timeLeft: number;
  cardTimer: number;
  isBlitz?: boolean;
  blitzStats?: { guessed: number; skipped: number };
  onGuessed: () => void;
  onSkip?: () => void;
}

interface CardContentProps {
  card: TabooCard;
  isBlitz?: boolean;
  onGuessed: () => void;
  onSkip?: () => void;
}

/**
 * Слово + обязательные слова + кнопки — вынесены в memo-компонент: card/isBlitz/
 * onGuessed/onSkip не меняются каждую секунду (в отличие от timeLeft у родителя),
 * поэтому 1Hz-тик таймера не должен их перерендеривать.
 */
const CardContent = React.memo(function CardContent({
  card,
  isBlitz,
  onGuessed,
  onSkip,
}: CardContentProps) {
  const { t } = useTranslation();
  const fs = wordFontSize(card.word);

  return (
    <>
      {/* Секретное слово */}
      <View className="rounded-premium-2xl border-premium-orange/30 bg-premium-orange/5 border-2 p-8">
        <Text
          className="text-micro text-premium-orange/50 mb-3 text-center font-black uppercase"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.TABOO_REVERSE}.secretWord`)}
        </Text>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: fs, lineHeight: fs * 1.15, letterSpacing: fs * -0.04 }}
        >
          {card.word}
        </Text>
      </View>

      {/* Обязательные слова */}
      <View>
        <Text
          className="text-micro mb-3 text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO_REVERSE}.requiredWords`)}
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {card.required.map((w, i) => (
            <View
              key={i}
              className="rounded-premium-md border-premium-orange/30 bg-premium-orange/10 border px-4 py-2.5"
            >
              <Text className="text-premium-orange text-sm font-black uppercase italic">{w}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Кнопки действий */}
      <View className="mt-auto gap-3 pt-4">
        {isBlitz ? (
          /* Блиц: две кнопки рядом */
          <View className="flex-row gap-3">
            <View className="flex-1">
              <PrimaryButton onClick={onGuessed} variant="emerald">
                {t(`${NS.TABOO_REVERSE}.guessed`)}
              </PrimaryButton>
            </View>
            <Pressable
              onPress={onSkip}
              className="rounded-premium-lg flex-row items-center justify-center gap-2 border border-white/10 bg-white/5 px-5 py-4"
              style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
            >
              <SkipForward size={20} color="rgba(255,255,255,0.5)" />
              <Text
                className="text-label font-black uppercase text-white/50"
                style={{ letterSpacing: 1 }}
              >
                −1
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Классика / команды: одна кнопка */
          <PrimaryButton onClick={onGuessed} variant="orange">
            {t(`${NS.TABOO_REVERSE}.wordGuessed`)}
          </PrimaryButton>
        )}

        <Text
          className="text-micro text-center font-black uppercase text-white/20"
          style={{ letterSpacing: 2 }}
        >
          {isBlitz
            ? t(`${NS.TABOO_REVERSE}.skipPenaltyHint`)
            : t(`${NS.TABOO_REVERSE}.noWordAllowed`)}
        </Text>
      </View>
    </>
  );
});

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  card,
  currentExplainer,
  timeLeft,
  cardTimer,
  isBlitz,
  blitzStats,
  onGuessed,
  onSkip,
}) => {
  const timerPct = (timeLeft / cardTimer) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#eab308' : '#ef4444';

  return (
    <MotiView
      key="playing"
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1"
    >
      <TimerBar pct={timerPct} color={timerColor} />

      <View className="mx-auto w-full max-w-lg flex-1 gap-6 p-6">
        <PlayingHeader
          explainer={currentExplainer}
          timeLeft={timeLeft}
          timerColor={timerColor}
          extra={
            !!isBlitz && !!blitzStats ? (
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-label text-premium-green font-black"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  ✓{blitzStats.guessed}
                </Text>
                <Text
                  className="text-label text-premium-red font-black"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  ✗{blitzStats.skipped}
                </Text>
              </View>
            ) : undefined
          }
        />

        <CardContent card={card} isBlitz={isBlitz} onGuessed={onGuessed} onSkip={onSkip} />
      </View>
    </MotiView>
  );
};
