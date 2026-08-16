import { ChevronRight, RotateCcw } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface RevealPhaseProps {
  currentPair: string[];
  targetValue: number;
  guessValue: number;
  score: number;
  onNext: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({
  currentPair,
  targetValue,
  guessValue,
  score,
  onNext,
}) => {
  const { t } = useTranslation();
  const isGood = score > 0;

  return (
    <MotiView
      key="reveal"
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-6"
    >
      {/* Шапка */}
      <View className="items-center gap-2">
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
        >
          {t(`${NS.WAVELENGTH}.result`)}
        </Text>
        <View className="flex-row items-center justify-center gap-1.5">
          <Text
            className="text-sm font-black uppercase text-white/45"
            style={{ letterSpacing: 2 }}
          >
            {currentPair[0]}
          </Text>
          <ChevronRight size={14} color="rgba(255,255,255,0.45)" />
          <Text
            className="text-sm font-black uppercase text-white/45"
            style={{ letterSpacing: 2 }}
          >
            {currentPair[1]}
          </Text>
        </View>
      </View>

      {/* Шкала + счёт */}
      <View className="flex-1 items-center justify-center gap-8">
        <View className="w-full px-2">
          <View className="h-8 w-full overflow-visible rounded-full border border-white/10 bg-white/5">
            <View className="absolute inset-0 overflow-hidden rounded-full">
              <View
                className="bg-premium-purple/40 rounded-premium-xs absolute top-0 h-full"
                style={{ left: `${Math.max(0, targetValue - 5)}%`, width: '10%' }}
              />
            </View>

            {/* Центральная риска цели */}
            <View
              className="absolute z-10 w-0.5 rounded-full bg-white/70"
              style={{ left: `${targetValue}%`, top: '50%', height: 48, marginTop: -24, marginLeft: -1 }}
            />

            {/* Маркер ответа */}
            <MotiView
              from={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 200, type: 'spring', damping: 20 }}
              className="bg-premium-yellow absolute z-20 w-1 rounded-full"
              style={{
                left: `${guessValue}%`,
                top: '-50%',
                height: '200%',
                marginLeft: -2,
                shadowColor: rgba('yellow', 0.55),
                shadowOpacity: 1,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 },
                elevation: 6,
              }}
            />
          </View>

          {/* Легенда */}
          <View className="mt-2 flex-row justify-between">
            <View className="flex-row items-center gap-1">
              <View className="h-0.5 w-3 bg-white/70" />
              <Text
                className="text-micro font-black uppercase text-white/45"
                style={{ letterSpacing: 1.6 }}
              >
                {t(`${NS.WAVELENGTH}.targetLabel`)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="bg-premium-yellow h-0.5 w-3" />
              <Text
                className="text-micro font-black uppercase text-white/45"
                style={{ letterSpacing: 1.6 }}
              >
                {t(`${NS.WAVELENGTH}.answerLabel`)}
              </Text>
            </View>
          </View>
        </View>

        {/* Счёт */}
        <View className="w-full items-center gap-3">
          <Text
            className="text-tag font-black uppercase text-white/35"
            style={{ letterSpacing: 4 }}
          >
            {t(`${NS.WAVELENGTH}.yourScore`)}
          </Text>
          <MotiView
            from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 350, type: 'spring', damping: 18, stiffness: 220 }}
          >
            <Text
              className={`font-black italic ${isGood ? 'text-premium-green' : 'text-premium-red'}`}
              style={{
                fontSize: 88,
                lineHeight: 90,
                letterSpacing: -3.5,
                textShadowColor: isGood ? 'rgba(0,216,138,0.4)' : 'rgba(255,46,77,0.4)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 30,
              }}
            >
              {score}
            </Text>
          </MotiView>

          {score === 4 && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 550, type: 'spring', damping: 20 }}
            >
              <GameCard className="border-premium-purple/40 bg-premium-purple/10 px-5 py-2">
                <Text
                  className="text-premium-yellow text-center text-sm font-black uppercase italic"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.WAVELENGTH}.perfect`)}
                </Text>
              </GameCard>
            </MotiView>
          )}
        </View>
      </View>

      <PrimaryButton onClick={onNext} variant="purple" icon={RotateCcw}>
        {t(`${NS.WAVELENGTH}.nextRound`)}
      </PrimaryButton>
    </MotiView>
  );
};
