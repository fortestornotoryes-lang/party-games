import { CheckCircle, XCircle } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { TimerRing } from '@/shared/components/TimerRing';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface PlayingPhaseProps {
  currentWord: string;
  roundScore: number;
  timeLeft: number;
  roundTime: number;
  onCorrect: () => void;
  onSkip: () => void;
}

/** Кнопка «пропустить/угадано» — нижняя половина экрана */
const AnswerButton: React.FC<{
  color: 'red' | 'green';
  icon: typeof XCircle;
  label: string;
  onPress: () => void;
}> = ({ color, icon: Icon, label, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`rounded-premium-lg flex-1 items-center justify-center gap-2 border ${
      color === 'red'
        ? 'bg-premium-red/[0.07] border-premium-red/20'
        : 'bg-premium-green/[0.07] border-premium-green/20'
    }`}
    style={({ pressed }) => [{ height: 86 }, pressed && { transform: [{ scale: 0.95 }] }]}
  >
    <Icon size={32} color={rgba(color, 1)} />
    <Text
      className={`text-micro font-black uppercase ${
        color === 'red' ? 'text-premium-red/55' : 'text-premium-green/55'
      }`}
      style={{ letterSpacing: 2 }}
    >
      {label}
    </Text>
  </Pressable>
);

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  currentWord,
  roundScore,
  timeLeft,
  roundTime,
  onCorrect,
  onSkip,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="playing"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1"
    >
      <View className="items-center pb-1 pt-5">
        <TimerRing timeLeft={timeLeft} totalTime={roundTime} />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={currentWord}
            from={{ opacity: 0, translateY: 30, scale: 0.84 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="items-center gap-2"
          >
            <Text
              className="text-micro text-premium-sky/35 text-center font-black uppercase"
              style={{ letterSpacing: 5 }}
            >
              {t(`${NS.ALIAS}.explainWord`)}
            </Text>
            <Text
              className="text-center font-black uppercase italic text-white"
              style={{ fontSize: 60, lineHeight: 62, letterSpacing: -2.4 }}
            >
              {currentWord}
            </Text>
          </MotiView>
        </AnimatePresence>
      </View>

      <View className="flex-row justify-center pb-3">
        <Text
          className="text-micro font-black uppercase text-white/20"
          style={{ letterSpacing: 3 }}
        >
          {t(`${NS.ALIAS}.scoreLabel`)}:{' '}
        </Text>
        <Text
          className={`text-micro font-black uppercase ${
            roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
          }`}
          style={{ letterSpacing: 3 }}
        >
          {fmtScore(roundScore)}
        </Text>
      </View>

      <View className="flex-row gap-3 px-5 pb-8">
        <AnswerButton color="red" icon={XCircle} label={t(`${NS.COMMON}.skip`)} onPress={onSkip} />
        <AnswerButton
          color="green"
          icon={CheckCircle}
          label={t(`${NS.ALIAS}.guessed`)}
          onPress={onCorrect}
        />
      </View>
    </MotiView>
  );
};
