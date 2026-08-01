import { RotateCcw, Skull } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { Player } from '@/entities/player/types';
import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface RevealPhaseProps {
  spy: Player | undefined;
  location: string;
  onBack: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({ spy, location, onBack }) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="reveal"
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="mx-auto w-full max-w-md flex-1 items-center justify-center gap-12 p-6"
    >
      <View className="items-center gap-4">
        {/* Пульс черепа (веб-animate-pulse) */}
        <MotiView
          from={{ opacity: 1 }}
          animate={{ opacity: 0.5 }}
          transition={{ type: 'timing', duration: 900, loop: true }}
        >
          <Skull size={96} color={rgba('red', 1)} />
        </MotiView>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 48, lineHeight: 50, letterSpacing: -1.9 }}
        >
          {t(`${NS.SPY_HUNT}.spyRevealed`)}
        </Text>
      </View>

      <GameCard className="border-premium-red/40 bg-premium-red/5 w-full p-10">
        <View className="items-center gap-2">
          <Text
            className="text-tag text-premium-red/60 font-black uppercase"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.SPY_HUNT}.agent00`)}
          </Text>
          <Text
            className="px-4 text-center font-black uppercase italic text-white"
            style={{ fontSize: 48, lineHeight: 52 }}
          >
            {spy?.name}
          </Text>
        </View>
        <View className="border-premium-red/20 mt-6 items-center border-t pt-6">
          <Text
            className="text-tag text-premium-green/60 font-black uppercase"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.SPY_HUNT}.secretLocation`)}
          </Text>
          <Text className="text-center text-2xl font-black uppercase italic text-white">
            {location}
          </Text>
        </View>
      </GameCard>

      <PrimaryButton onClick={onBack} icon={RotateCcw} variant="red">
        {t(`${NS.SPY_HUNT}.backToMenu`)}
      </PrimaryButton>
    </MotiView>
  );
};
