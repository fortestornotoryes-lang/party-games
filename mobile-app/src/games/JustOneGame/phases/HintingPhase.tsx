import { CheckCircle, Send } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextInput } from '@/shared/components/TextInput';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface HintingPhaseProps {
  word: string;
  guesser: string;
  hinters: string[];
  hints: Record<string, string>;
  onSubmitHint: (player: string, hint: string) => void;
  onStartGuessing: () => void;
}

export const HintingPhase: React.FC<HintingPhaseProps> = ({
  word,
  guesser,
  hinters,
  hints,
  onSubmitHint,
  onStartGuessing,
}) => {
  const { t } = useTranslation();
  const [localHints, setLocalHints] = useState<Record<string, string>>({});
  const allHinted = Object.keys(hints).length === hinters.length;

  return (
    <MotiView
      key="hinting"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gap-6 p-5"
    >
      <View className="items-center gap-2 pt-2">
        <Text
          className="text-micro text-premium-yellow/40 font-black uppercase"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.JUST_ONE}.secretWord`)}
        </Text>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 48, lineHeight: 50, letterSpacing: -1.9 }}
        >
          {word}
        </Text>
      </View>

      <View className="rounded-premium-md bg-premium-yellow/[0.05] border-premium-yellow/15 items-center border p-4">
        <Text
          className="text-micro mb-1 font-black uppercase text-white/30"
          style={{ letterSpacing: 3.6 }}
        >
          {t(`${NS.JUST_ONE}.guessing`)}
        </Text>
        <Text className="text-premium-yellow text-xl font-black uppercase italic">{guesser}</Text>
      </View>

      <View className="gap-4">
        <View className="flex-row items-center justify-between px-1">
          <Text
            className="text-micro font-black uppercase text-white/35"
            style={{ letterSpacing: 4 }}
          >
            {t(`${NS.JUST_ONE}.hintsLabel`)}
          </Text>
          <View className="rounded-full border border-white/5 bg-white/5 px-3 py-1">
            <Text className="text-micro font-black text-white/30">
              {Object.keys(hints).length}/{hinters.length}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          {hinters.map((player) => (
            <View
              key={player}
              className="rounded-premium-md flex-row items-center gap-3 border border-white/10 bg-white/5 p-3"
            >
              <Text
                className="shrink-0 text-sm font-black italic text-white/70"
                style={{ minWidth: 72 }}
              >
                {player}
              </Text>
              {hints[player] ? (
                <View className="flex-1 flex-row items-center justify-between">
                  <Text
                    className="text-premium-yellow/70 text-sm font-black uppercase italic"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {hints[player]}
                  </Text>
                  <CheckCircle size={16} color={rgba('green', 1)} />
                </View>
              ) : (
                <View className="flex-1 flex-row items-center gap-2">
                  <TextInput
                    value={localHints[player] || ''}
                    onChangeText={(text) => {
                      setLocalHints((prev) => ({ ...prev, [player]: text }));
                    }}
                    placeholder={t(`${NS.JUST_ONE}.hintPlaceholder`)}
                    onSubmitEditing={() => {
                      onSubmitHint(player, localHints[player] || '');
                    }}
                    className="h-9 flex-1 text-sm"
                  />
                  <Pressable
                    onPress={() => {
                      onSubmitHint(player, localHints[player] || '');
                    }}
                    className="bg-premium-yellow rounded-premium-sm h-9 w-9 shrink-0 items-center justify-center"
                    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
                  >
                    <Send size={16} color="#000" />
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {!!allHinted && (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
          <PrimaryButton onClick={onStartGuessing}>
            {t(`${NS.JUST_ONE}.readyShowGuesser`, { guesser })}
          </PrimaryButton>
        </MotiView>
      )}
    </MotiView>
  );
};
