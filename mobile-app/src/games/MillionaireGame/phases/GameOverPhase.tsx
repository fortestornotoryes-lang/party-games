import { CheckCircle, ChevronRight, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { MillionaireScoreboard } from './WinPhase';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface GameOverPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  correctAnswer: string | undefined;
  guaranteed: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  currentPlayer,
  questionIndex,
  correctAnswer,
  guaranteed,
  playerScores,
  onNextPlayer,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="gameover"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="flex-1"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="w-full flex-1 items-center justify-center gap-5">
          {/* Иконка ошибки (веб-тряска keyframes заменена spring-появлением) */}
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 100 }}
          >
            <View
              className="bg-premium-red/10 border-premium-red/40 h-24 w-24 items-center justify-center rounded-full border-2"
              style={{
                shadowColor: rgba('red', 0.4),
                shadowOpacity: 1,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }}
            >
              <XCircle size={48} color={rgba('red', 1)} />
            </View>
          </MotiView>

          {/* Итог */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 220 }}
            className="items-center gap-1"
          >
            <Text
              className="text-tag text-premium-red/70 font-black uppercase"
              style={{ letterSpacing: 3 }}
            >
              {t(`${NS.MILLIONAIRE}.wrong`)}
            </Text>
            <Text className="text-label font-bold text-white/65">{currentPlayer}</Text>
            <Text className="text-label text-white/30">
              {t(`${NS.MILLIONAIRE}.questionOf15`, { n: questionIndex + 1 })}
            </Text>
          </MotiView>

          {/* Правильный ответ */}
          {!!correctAnswer && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 320 }}
              className="rounded-premium-lg w-full overflow-hidden border bg-white/5"
              style={{ borderColor: 'rgba(0,216,138,0.25)' }}
            >
              <View className="p-4">
                <View className="mb-2 flex-row items-center gap-2">
                  <CheckCircle size={16} color={rgba('green', 1)} />
                  <Text
                    className="text-tag text-premium-green font-black uppercase"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.MILLIONAIRE}.correctAnswer`)}
                  </Text>
                </View>
                <Text className="text-label text-center font-bold text-white">
                  {correctAnswer}
                </Text>
              </View>
            </MotiView>
          )}

          {/* Гарантированная сумма */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 380 }}
            className="rounded-premium-lg w-full items-center border border-white/10 bg-white/5 p-4"
          >
            <Text
              className="text-tag mb-1 font-black uppercase text-white/30"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.MILLIONAIRE}.guaranteedAmount`)}
            </Text>
            <Text
              className="font-black italic text-white/55"
              style={{ fontSize: 36, lineHeight: 38, letterSpacing: -1.4 }}
            >
              {guaranteed === '0' ? '0' : guaranteed}
            </Text>
            {guaranteed === '0' && (
              <Text
                className="text-tag mt-1 font-black uppercase text-white/20"
                style={{ letterSpacing: 1 }}
              >
                {t(`${NS.MILLIONAIRE}.nothingEarned`)}
              </Text>
            )}
          </MotiView>

          <MillionaireScoreboard
            playerScores={playerScores}
            currentPlayer={currentPlayer}
            highlightClass="text-white"
          />
        </View>

        {/* Следующий игрок */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 520 }}
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
