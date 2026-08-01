import { CheckCircle, RotateCcw, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface ResultPhaseProps {
  isCorrect: boolean;
  word: string;
  guess: string;
  onNext: () => void;
}

export const ResultPhase: React.FC<ResultPhaseProps> = ({ isCorrect, word, guess, onNext }) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="result"
      from={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex-1 items-center justify-center gap-8 p-6"
    >
      <View className="items-center gap-4">
        <View className="items-center">
          {/* Веб-глоу (blur-подложка) в RN недоступен — мягкий цветной круг */}
          <View
            className={`absolute -inset-12 rounded-full ${
              isCorrect ? 'bg-premium-green/15' : 'bg-premium-red/15'
            }`}
          />
          {isCorrect ? (
            <CheckCircle size={80} color={rgba('green', 1)} />
          ) : (
            <XCircle size={80} color={rgba('red', 1)} />
          )}
        </View>
        <Typography.Display size="lg" color={isCorrect ? 'green' : 'red'} glow align="center">
          {isCorrect ? t(`${NS.JUST_ONE}.correctDisplay`) : t(`${NS.JUST_ONE}.wrongDisplay`)}
        </Typography.Display>

        <View className="items-center gap-1">
          <Typography.Caption style={{ letterSpacing: 4 }}>
            {t(`${NS.JUST_ONE}.secretWord`)}
          </Typography.Caption>
          <Typography.Display size="md" align="center">
            {word}
          </Typography.Display>
          {!isCorrect && (
            <Typography.Body color="faint" align="center" className="mt-1">
              {t(`${NS.JUST_ONE}.answerLabel`)} <Text className="italic">{guess}</Text>
            </Typography.Body>
          )}
        </View>
      </View>

      <PrimaryButton onClick={onNext} icon={RotateCcw}>
        {t(`${NS.JUST_ONE}.nextRound`)}
      </PrimaryButton>
    </MotiView>
  );
};
