import { MessageSquare } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { TextInput } from '@/shared/components/TextInput';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  lastDrawing: string;
  timeLeft: number;
  currentRound: number;
  shuffledPlayers: string[];
  guess: string;
  onGuessChange: (v: string) => void;
  onSubmit: () => void;
}

export const TelestrationsGuess: React.FC<Props> = ({
  lastDrawing,
  timeLeft,
  currentRound,
  shuffledPlayers,
  guess,
  onGuessChange,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="absolute inset-0"
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center gap-1">
        <Text
          className="text-tag font-black uppercase text-white/30"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.TELESTRATIONS}.guessDrawing`)}
        </Text>
        <Text
          className={`text-center text-2xl font-black ${
            timeLeft <= 10 ? 'text-premium-red' : 'text-white/40'
          }`}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {t(`${NS.TELESTRATIONS}.timerSeconds`, { n: timeLeft })}
        </Text>
        <Text className="text-xl font-black italic text-white">
          {t(`${NS.TELESTRATIONS}.whatIsDepicted`)}
        </Text>
      </View>

      <View className="flex-row justify-center gap-1.5">
        {shuffledPlayers.map((_, i) => (
          <View
            key={i}
            className={`h-1 rounded-full ${
              i < currentRound
                ? 'w-3 bg-orange-500/30'
                : i === currentRound
                  ? 'w-5 bg-orange-500'
                  : 'w-3 bg-white/10'
            }`}
          />
        ))}
      </View>

      <View className="rounded-premium-md w-full max-w-sm overflow-hidden border border-white/10">
        <Image source={{ uri: lastDrawing }} style={{ width: '100%', aspectRatio: 4 / 3 }} resizeMode="contain" />
      </View>

      <View className="w-full max-w-sm gap-3">
        <TextInput
          value={guess}
          onChangeText={onGuessChange}
          onSubmitEditing={() => {
            if (guess.trim()) onSubmit();
          }}
          placeholder={t(`${NS.TELESTRATIONS}.writePlaceholder`)}
          className="h-14 text-xl"
        />
        <Pressable
          disabled={!guess.trim()}
          onPress={onSubmit}
          className="rounded-premium-md w-full flex-row items-center justify-center gap-2 bg-white py-5"
          style={{ opacity: guess.trim() ? 1 : 0.2 }}
        >
          <MessageSquare size={20} color="#000" />
          <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
            {t(`${NS.COMMON}.done`)}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
