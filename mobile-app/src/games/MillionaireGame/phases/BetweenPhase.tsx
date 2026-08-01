import { Banknote, CheckCircle, TrendingUp } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import { PRIZE_LADDER } from '@/games/MillionaireGame/constants';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface BetweenPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  onTakeMoney: () => void;
  onContinue: () => void;
}

export const BetweenPhase: React.FC<BetweenPhaseProps> = ({
  currentPlayer,
  questionIndex,
  onTakeMoney,
  onContinue,
}) => {
  const { t } = useTranslation();
  const currentPrize = PRIZE_LADDER[questionIndex];
  const nextPrize = PRIZE_LADDER[questionIndex + 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      feedbackService.celebrate('top', {
        particleCount: 55,
        spread: 50,
        colors: ['#FFCC1F', '#FFD700', '#FFA500', '#fff'],
        gravity: 1.2,
      });
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <MotiView
      key="between"
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'timing', duration: 250 }}
      className="flex-1 items-center justify-center gap-5 p-6"
    >
      {/* Галочка + имя игрока */}
      <MotiView
        from={{ scale: 0, rotate: '-15deg' }}
        animate={{ scale: 1, rotate: '0deg' }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 100 }}
        className="items-center gap-3"
      >
        <View
          className="bg-premium-green/10 border-premium-green/40 h-20 w-20 items-center justify-center rounded-full border-2"
          style={{
            shadowColor: rgba('green', 0.5),
            shadowOpacity: 1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          }}
        >
          <CheckCircle size={40} color={rgba('green', 1)} />
        </View>
        <View className="items-center">
          <Text
            className="text-tag text-premium-green/70 mb-1 font-black uppercase"
            style={{ letterSpacing: 2.5 }}
          >
            {t(`${NS.MILLIONAIRE}.correctBadge`)}
          </Text>
          <Text className="text-label font-semibold text-white/55">{currentPlayer}</Text>
        </View>
      </MotiView>

      {/* Выигранная сумма */}
      <MotiView
        from={{ opacity: 0, translateY: 24 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 220 }}
        className="rounded-premium-lg w-full items-center border bg-white/5 p-5"
        style={{ borderColor: 'rgba(255,204,31,0.2)' }}
      >
        <Text
          className="text-tag mb-1 font-black uppercase text-white/35"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.MILLIONAIRE}.questionSum`, { n: questionIndex + 1 })}
        </Text>
        <MotiView
          from={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 300 }}
        >
          <Text
            className="text-premium-yellow font-black italic"
            style={{
              fontSize: 48,
              lineHeight: 50,
              letterSpacing: -1.9,
              textShadowColor: 'rgba(255,204,31,0.5)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            }}
          >
            {currentPrize}
          </Text>
        </MotiView>
        <Text
          className="text-tag mt-2 font-black uppercase text-white/25"
          style={{ letterSpacing: 1 }}
        >
          {t(`${NS.MILLIONAIRE}.inPocket`)}
        </Text>
      </MotiView>

      {/* Решение */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 350 }}
        className="w-full gap-3"
      >
        {/* Основная: идти дальше */}
        <Pressable
          onPress={onContinue}
          className="rounded-premium-md border-premium-yellow/30 bg-premium-yellow/10 h-16 w-full flex-row items-center justify-center gap-3 border"
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
        >
          <TrendingUp size={20} color={rgba('yellow', 1)} />
          <Text
            className="text-premium-yellow text-lg font-black uppercase italic"
            style={{ letterSpacing: -0.7 }}
          >
            {t(`${NS.MILLIONAIRE}.goForPrize`, { prize: nextPrize })}
          </Text>
        </Pressable>

        {/* Второстепенная: забрать деньги */}
        <PrimaryButton variant="outline" icon={Banknote} onClick={onTakeMoney}>
          {t(`${NS.MILLIONAIRE}.takeMoney`, { prize: currentPrize })}
        </PrimaryButton>
      </MotiView>
    </MotiView>
  );
};
