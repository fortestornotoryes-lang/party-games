import { ArrowRight, Eye } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  currentPlayer: string;
  shuffledPlayers: string[];
  currentWord: string;
  wordRevealed: boolean;
  onReveal: () => void;
  onReady: () => void;
}

export const TelestrationsStart: React.FC<Props> = ({
  currentPlayer,
  shuffledPlayers,
  currentWord,
  wordRevealed,
  onReveal,
  onReady,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="start"
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ type: 'timing', duration: 250 }}
      className="absolute inset-0"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 }}>
        <View className="items-center gap-3">
          <View className="bg-premium-orange/10 border-premium-orange/20 rounded-full border px-4 py-1">
            <Text
              className="text-tag text-premium-orange font-bold uppercase"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.TELESTRATIONS}.firstDraws`)}
            </Text>
          </View>
          <Text className="text-center text-4xl font-black italic text-white">
            {currentPlayer}
          </Text>
          <Text className="text-sm text-white/30">{t(`${NS.TELESTRATIONS}.rememberAndDraw`)}</Text>
        </View>

        <View className="rounded-premium-md w-full max-w-sm border border-white/5 bg-white/5 p-4">
          <Text
            className="text-micro mb-3 text-center font-black uppercase text-white/25"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TELESTRATIONS}.gameOrder`)}
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {shuffledPlayers.map((name, i) => (
              <View
                key={i}
                className={`text-tag flex-row items-center gap-1.5 rounded-full border px-2.5 py-1 ${
                  i % 2 === 0
                    ? 'bg-premium-orange/10 border-premium-orange/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <Text
                  className={`text-tag font-bold ${
                    i % 2 === 0 ? 'text-premium-orange' : 'text-white/40'
                  }`}
                >
                  {i + 1}. {name} {i % 2 === 0 ? '✏️' : '💬'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {!wordRevealed ? (
          <Pressable
            onPress={onReveal}
            className="border-premium-orange/20 rounded-premium-3xl w-full max-w-sm items-center border-2 border-dashed bg-white/5 p-8"
          >
            <Text
              className="text-micro mb-3 text-center font-black uppercase text-white/25"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.TELESTRATIONS}.makeSureNoOneWatches`)}
            </Text>
            <View className="flex-row items-center justify-center gap-2">
              <Eye size={20} color="rgba(255,138,31,0.5)" />
              <Text className="text-premium-orange/50 text-base font-black">
                {t(`${NS.TELESTRATIONS}.showWord`)}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View className="bg-premium-orange/10 border-premium-orange/30 rounded-premium-3xl w-full max-w-sm items-center border p-8">
            <Text
              className="text-tag mb-2 text-center font-black uppercase text-white/25"
              style={{ letterSpacing: 2 }}
            >
              {t(`${NS.TELESTRATIONS}.yourSecretWord`)}
            </Text>
            <Text className="text-premium-orange text-center text-3xl font-black">
              {currentWord}
            </Text>
          </View>
        )}

        <Pressable
          onPress={onReady}
          disabled={!wordRevealed}
          className="rounded-premium-md w-full max-w-sm flex-row items-center justify-center gap-3 bg-white py-5"
          style={{ opacity: wordRevealed ? 1 : 0.3 }}
        >
          <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
            {t(`${NS.TELESTRATIONS}.readyToDraw`)}
          </Text>
          <ArrowRight size={20} color="#000" />
        </Pressable>
      </ScrollView>
    </MotiView>
  );
};
