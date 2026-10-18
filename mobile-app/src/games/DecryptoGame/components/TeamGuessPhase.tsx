import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { isCodeComplete } from '../helpers';
import type { TeamColor } from '../types';

import { CodeInput } from './CodeInput';
import { WordGrid } from './WordGrid';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface TeamGuessPhaseProps {
  words: string[];
  clues: string[];
  teamGuess: (number | '')[];
  wordCount: number;
  activeTeam: TeamColor;
  onChange: (v: (number | '')[]) => void;
  onSubmit: () => void;
}

export const TeamGuessPhase: React.FC<TeamGuessPhaseProps> = ({
  words,
  clues,
  teamGuess,
  wordCount,
  activeTeam,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <MotiView
      key="team_guess"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-4"
    >
      <WordGrid words={words} cellHeight={64} />

      <View className="rounded-premium-sm bg-white/5 p-4">
        <Text className="mb-2 text-xs font-bold uppercase text-white/30">
          {t(`${NS.DECRYPTO}.captainClues`)}
        </Text>
        <View className="gap-1">
          {clues.map((c, i) => (
            <Text
              key={i}
              className="text-center text-lg font-black uppercase text-white"
              style={{ letterSpacing: 1.6 }}
            >
              {c}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-2 flex-1 gap-4">
        <Text className="text-tag text-center font-bold uppercase text-white/40">
          {t(`${NS.DECRYPTO}.enterYourCode`)}
        </Text>
        <CodeInput value={teamGuess} onChange={onChange} max={wordCount} team={activeTeam} />
        <PrimaryButton onClick={onSubmit} variant={activeTeam} disabled={!isCodeComplete(teamGuess)}>
          {t(`${NS.DECRYPTO}.decode`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
