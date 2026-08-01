import { ChevronRight, Star, Trophy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface WinPhaseProps {
  currentPlayer: string;
  prize: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

/** Табло результатов всех игроков (общее с GameOverPhase) */
export const MillionaireScoreboard: React.FC<{
  playerScores: Record<string, string>;
  currentPlayer: string;
  highlightClass?: string;
}> = ({ playerScores, currentPlayer, highlightClass = 'text-premium-yellow' }) => {
  const { t } = useTranslation();
  if (Object.keys(playerScores).length <= 1) return null;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 350 }}
      className="rounded-premium-lg w-full border border-white/10 bg-white/5 p-4"
    >
      <View className="mb-3 flex-row items-center gap-2">
        <Star size={14} color={rgba('yellow', 1)} />
        <Text
          className="text-tag font-black uppercase text-white/35"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.COMMON}.score`)}
        </Text>
      </View>
      <View className="gap-2">
        {Object.entries(playerScores)
          .sort((a, b) => parseFloat(b[1].replace(/\D/g, '')) - parseFloat(a[1].replace(/\D/g, '')))
          .map(([name, score], i) => (
            <View key={name} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-tag w-4 font-black text-white/20">{i + 1}</Text>
                <Text
                  className={`text-label font-semibold ${
                    name === currentPlayer ? highlightClass : 'text-white/60'
                  }`}
                >
                  {name}
                </Text>
              </View>
              <Text
                className={`text-label font-black ${
                  name === currentPlayer ? highlightClass : 'text-white/40'
                }`}
              >
                {score}
              </Text>
            </View>
          ))}
      </View>
    </MotiView>
  );
};

export const WinPhase: React.FC<WinPhaseProps> = ({
  currentPlayer,
  prize,
  playerScores,
  onNextPlayer,
}) => {
  const { t } = useTranslation();
  const isMillion = prize === '1 000 000';

  useEffect(() => {
    if (isMillion) {
      const shoot = () => {
        feedbackService.celebrate('top', {
          particleCount: 120,
          spread: 110,
          origin: { y: 0.2 },
          colors: ['#FFCC1F', '#FFD700', '#fff', '#FFA500'],
          gravity: 0.9,
        });
      };
      shoot();
      const t1 = setTimeout(shoot, 400);
      const t2 = setTimeout(shoot, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      feedbackService.celebrate('top', { colors: ['#00D88A', '#FFCC1F', '#fff'] });
    }
  }, [isMillion]);

  return (
    <MotiView
      key="win"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="flex-1"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="w-full flex-1 items-center justify-center gap-5">
          {/* Трофей */}
          <MotiView
            from={{ scale: 0, rotate: '-20deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 100 }}
          >
            <View
              className={`h-28 w-28 items-center justify-center rounded-full border-2 ${
                isMillion
                  ? 'bg-premium-yellow/20 border-premium-yellow/50'
                  : 'bg-premium-green/10 border-premium-green/40'
              }`}
              style={{
                shadowColor: isMillion ? rgba('yellow', 0.6) : rgba('green', 0.5),
                shadowOpacity: 1,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 0 },
                elevation: 12,
              }}
            >
              <Trophy size={56} color={isMillion ? rgba('yellow', 1) : rgba('green', 1)} />
            </View>

            {/* Расходящиеся кольца для миллиона */}
            {!!isMillion &&
              Array.from({ length: 4 }).map((_, i) => (
                <MotiView
                  key={i}
                  from={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ type: 'timing', duration: 1400, delay: i * 300, loop: true }}
                  className="border-premium-yellow/25 absolute inset-0 rounded-full border"
                />
              ))}
          </MotiView>

          {/* Сумма */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 250 }}
            className="items-center"
          >
            <Text
              className="text-tag mb-1 font-black uppercase text-white/35"
              style={{ letterSpacing: 3 }}
            >
              {isMillion
                ? t(`${NS.MILLIONAIRE}.millionaireLabel`)
                : t(`${NS.MILLIONAIRE}.wonLabel`)}
            </Text>
            <Text className="text-label mb-2 font-bold text-white/65">{currentPlayer}</Text>
            <Text
              className={`font-black italic ${
                isMillion ? 'text-premium-yellow' : 'text-premium-green'
              }`}
              style={{
                fontSize: 48,
                lineHeight: 50,
                letterSpacing: -1.9,
                textShadowColor: isMillion ? 'rgba(255,204,31,0.55)' : 'rgba(0,216,138,0.4)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 25,
              }}
            >
              {prize}
            </Text>
            {!!isMillion && (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 600 }}>
                <Text
                  className="text-label text-premium-yellow/50 mt-2 font-black uppercase"
                  style={{ letterSpacing: 3 }}
                >
                  {t(`${NS.MILLIONAIRE}.congratulations`)}
                </Text>
              </MotiView>
            )}
          </MotiView>

          <MillionaireScoreboard playerScores={playerScores} currentPlayer={currentPlayer} />
        </View>

        {/* Следующий игрок */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 450 }}
          className="w-full pt-4"
        >
          <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
            {t(`${NS.MILLIONAIRE}.nextPlayer`)}
          </PrimaryButton>
        </MotiView>
      </ScrollView>
    </MotiView>
  );
};
