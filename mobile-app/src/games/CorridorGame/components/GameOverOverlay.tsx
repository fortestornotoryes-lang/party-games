import { RotateCcw } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { PLAYER_COLOR } from '../constants';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  winner: 1 | 2 | null;
  p1: string;
  p2: string;
  onRestart: () => void;
  onBack: () => void;
}

export const GameOverOverlay: React.FC<Props> = ({ winner, p1, p2, onRestart, onBack }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!!winner && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 items-center justify-center"
          style={{ backgroundColor: 'rgba(11,9,21,0.92)' }}
        >
          <MotiView
            from={{ scale: 0.85, translateY: 24 }}
            animate={{ scale: 1, translateY: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="rounded-premium-2xl mx-6 w-full items-center border bg-white/5 p-8"
            style={{ borderColor: `${PLAYER_COLOR[winner]}35` }}
          >
            <Text
              className="text-center font-black uppercase italic"
              style={{ fontSize: 56, lineHeight: 58, color: PLAYER_COLOR[winner] }}
            >
              {t(`${NS.CORRIDOR}.victory`)}
            </Text>
            <Text className="mt-2 text-center text-2xl font-black uppercase text-white">
              {winner === 1 ? p1 : p2}
            </Text>
            <Text
              className="mt-1.5 text-center text-xs font-black uppercase text-white/35"
              style={{ letterSpacing: 3 }}
            >
              {t(`${NS.CORRIDOR}.reachedFinish`)}
            </Text>

            <View className="mt-8 w-full gap-2">
              <PrimaryButton variant="white" icon={RotateCcw} onClick={onRestart}>
                {t(`${NS.CORRIDOR}.playAgain`)}
              </PrimaryButton>
              <PrimaryButton variant="outline" onClick={onBack}>
                {t(`${NS.CORRIDOR}.toMenu`)}
              </PrimaryButton>
            </View>
          </MotiView>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
