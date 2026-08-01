import { MotiView } from 'moti';
import React from 'react';
import { Text, TextInput as RNTextInput, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GuessingPhaseProps {
  guesser: string;
  visibleHints: string[];
  guess: string;
  onGuessChange: (val: string) => void;
  onGuess: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  guesser,
  visibleHints,
  guess,
  onGuessChange,
  onGuess,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="guessing"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gap-8 p-6"
    >
      <View className="items-center gap-1 pt-2">
        <Text
          className="text-premium-yellow text-center font-black uppercase italic"
          style={{ fontSize: 24, lineHeight: 26, letterSpacing: -1 }}
        >
          {guesser}
        </Text>
        <Text className="text-center text-sm font-medium text-white/40">
          {t(`${NS.JUST_ONE}.guessInstruction`)}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-center gap-3">
        {visibleHints.map((hint, i) => (
          <MotiView
            key={i}
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 70, type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-premium-yellow/[0.07] border-premium-yellow/20 rounded-premium-md border px-5 py-3"
          >
            <Text
              className="text-premium-yellow text-xl font-black uppercase italic"
              style={{ letterSpacing: -0.4 }}
            >
              {hint}
            </Text>
          </MotiView>
        ))}
        {visibleHints.length === 0 && (
          <Text className="text-sm italic text-white/25">{t(`${NS.JUST_ONE}.allHintsClashed`)}</Text>
        )}
      </View>

      <View className="gap-3 pt-2">
        {/* Крупный инпут ответа — не общий TextInput: свой размер и центрирование */}
        <RNTextInput
          value={guess}
          onChangeText={onGuessChange}
          placeholder={t(`${NS.JUST_ONE}.guessPlaceholder`)}
          placeholderTextColor="rgba(255,255,255,0.15)"
          onSubmitEditing={() => {
            if (guess.trim()) onGuess();
          }}
          className="rounded-premium-lg w-full border border-white/10 bg-white/5 py-5 text-center font-black uppercase italic text-white"
          style={{ fontSize: 30 }}
        />
        <PrimaryButton onClick={onGuess} disabled={!guess.trim()}>
          {t(`${NS.JUST_ONE}.submitAnswer`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
