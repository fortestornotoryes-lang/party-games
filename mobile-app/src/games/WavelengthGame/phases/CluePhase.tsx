import { ChevronRight, Sparkles } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface CluePhaseProps {
  psychic: string;
  currentPair: string[];
  targetValue: number;
  onDone: () => void;
}

export const CluePhase: React.FC<CluePhaseProps> = ({
  psychic,
  currentPair,
  targetValue,
  onDone,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="clue"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex-1 gap-6"
    >
      {/* Личность ясновидящего */}
      <View className="items-center gap-2">
        <Text
          className="text-tag font-black uppercase text-white/35"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.WAVELENGTH}.currentPsychic`)}
        </Text>
        <Text
          className="text-premium-purple text-center font-black uppercase italic"
          style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
        >
          {psychic}
        </Text>
        <Text className="max-w-xs text-center text-sm font-medium text-white/50">
          {t(`${NS.WAVELENGTH}.onlyYouSeeTarget`)}
        </Text>
      </View>

      {/* Карточка со шкалой */}
      <View className="flex-1 items-center justify-center gap-6">
        <GameCard className="w-full">
          <View className="w-full px-2 py-2">
            {/* Дорожка шкалы */}
            <View className="h-5 w-full overflow-visible rounded-full border border-white/10 bg-black/40">
              {/* Целевая зона */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 300, type: 'timing', duration: 400 }}
                className="bg-premium-purple/70 rounded-premium-xs absolute top-0 h-full"
                style={{
                  left: `${Math.max(0, targetValue - 5)}%`,
                  width: '10%',
                  shadowColor: rgba('purple', 0.45),
                  shadowOpacity: 1,
                  shadowRadius: 9,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 6,
                }}
              />

              {/* Центральная риска */}
              <View
                className="absolute z-10 w-0.5 bg-white/70"
                style={{ left: `${targetValue}%`, top: '50%', height: 32, marginTop: -16, marginLeft: -1 }}
              />
            </View>

            {/* Подписи пары */}
            <View className="mt-3 flex-row justify-between">
              <Text
                className="text-tag text-premium-purple/80 font-black uppercase"
                style={{ letterSpacing: 1.6 }}
              >
                {currentPair[0]}
              </Text>
              <Text
                className="text-tag text-premium-purple/80 font-black uppercase"
                style={{ letterSpacing: 1.6 }}
              >
                {currentPair[1]}
              </Text>
            </View>
          </View>
        </GameCard>

        {/* Подсказка */}
        <View className="w-full items-center gap-3">
          <View className="flex-row items-center justify-center gap-2">
            <Sparkles size={14} color="rgba(255,255,255,0.35)" />
            <Text className="text-sm font-medium text-white/35">
              {t(`${NS.WAVELENGTH}.giveClueHint`)}
            </Text>
          </View>

          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-base font-black uppercase italic text-white/50">
              {currentPair[0]}
            </Text>
            <ChevronRight size={16} color={rgba('purple', 1)} />
            <Text className="text-base font-black uppercase italic text-white">
              {currentPair[1]}
            </Text>
          </View>
        </View>
      </View>

      <PrimaryButton onClick={onDone} variant="purple">
        {t(`${NS.WAVELENGTH}.iGaveClue`)}
      </PrimaryButton>
    </MotiView>
  );
};
