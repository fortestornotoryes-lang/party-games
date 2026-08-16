import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GuessingPhaseProps {
  currentPair: string[];
  guessValue: number;
  onGuessChange: (val: number) => void;
  onConfirm: () => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  currentPair,
  guessValue,
  onGuessChange,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [trackWidth, setTrackWidth] = useState(0);

  const updateFromX = (x: number) => {
    if (trackWidth <= 0) return;
    const pct = clamp(Math.round((x / trackWidth) * 100), 0, 100);
    onGuessChange(pct);
  };

  // Перетаскивание ползунка — прямой аналог веб <input type="range">
  const pan = Gesture.Pan()
    .onChange((e) => {
      scheduleOnRN(updateFromX, e.x);
    })
    .onBegin((e) => {
      scheduleOnRN(updateFromX, e.x);
    });

  return (
    <MotiView
      key="guessing"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-6"
    >
      {/* Заголовок */}
      <View className="items-center">
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 30, lineHeight: 33, letterSpacing: -1.2 }}
        >
          {t(`${NS.WAVELENGTH}.adjustWave`)}
        </Text>
      </View>

      {/* Слайдер */}
      <View className="flex-1 items-center justify-center gap-8">
        <View className="w-full gap-5">
          {/* Подписи полюсов */}
          <View className="flex-row justify-between px-2">
            <Text
              className="text-tag text-premium-purple font-black uppercase"
              style={{ letterSpacing: 1.6 }}
            >
              {currentPair[0]}
            </Text>
            <Text
              className="text-tag text-premium-purple font-black uppercase"
              style={{ letterSpacing: 1.6 }}
            >
              {currentPair[1]}
            </Text>
          </View>

          {/* Дорожка + перетаскиваемый ползунок */}
          <GestureDetector gesture={pan}>
            <View
              className="h-12 justify-center"
              onLayout={(e) => {
                setTrackWidth(e.nativeEvent.layout.width);
              }}
            >
              <View className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <View
                  className="bg-premium-purple/50 absolute left-0 top-0 h-full rounded-full"
                  style={{ width: `${guessValue}%` }}
                />
              </View>
              <View
                className="rounded-premium-sm absolute top-1/2 z-10 h-12 w-7 items-center justify-center bg-white"
                style={{
                  left: `${guessValue}%`,
                  marginLeft: -14,
                  marginTop: -24,
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <View className="h-6 w-0.5 rounded-full bg-black/15" />
              </View>
            </View>
          </GestureDetector>
        </View>

        {/* Значение */}
        <GameCard className="border-premium-purple/20 bg-premium-purple/5 w-full py-6">
          <Text
            className="text-tag text-premium-purple/60 mb-1 text-center font-black uppercase"
            style={{ letterSpacing: 3 }}
          >
            {t(`${NS.WAVELENGTH}.valueLabel`)}
          </Text>
          <Text
            className="text-center font-black italic text-white"
            style={{ fontSize: 48, lineHeight: 50, letterSpacing: -1.9 }}
          >
            {guessValue}
          </Text>
        </GameCard>
      </View>

      <PrimaryButton onClick={onConfirm} variant="purple">
        {t(`${NS.WAVELENGTH}.confirmChoice`)}
      </PrimaryButton>
    </MotiView>
  );
};
