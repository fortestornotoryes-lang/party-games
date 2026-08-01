import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { TabooCard } from '../content';

import { StopGameButton } from '@/shared/components/StopGameButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface VerdictPhaseProps {
  card: TabooCard;
  timedOut: boolean;
  currentExplainer: string;
  otherPlayers: string[];
  usedWordIdxs: Set<number>;
  onToggleWord: (i: number) => void;
  onVerdict: (guesser: string | null, penalty?: boolean) => void;
  onStopGame: () => void;
}

export const VerdictPhase: React.FC<VerdictPhaseProps> = ({
  card,
  timedOut,
  currentExplainer,
  otherPlayers,
  usedWordIdxs,
  onToggleWord,
  onVerdict,
  onStopGame,
}) => {
  const { t } = useTranslation();
  const allWordsUsed = usedWordIdxs.size === card.required.length;

  return (
    <MotiView
      key="verdict"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      className="mx-auto w-full max-w-lg gap-6 p-6"
    >
      {/* Раскрытие слова */}
      <View className="items-center gap-2 pt-2">
        {!!timedOut && (
          <Text
            className="text-micro text-premium-red/70 font-black uppercase"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TABOO_REVERSE}.timeUp`)}
          </Text>
        )}
        <Text
          className="text-micro font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO_REVERSE}.secretWord`)}
        </Text>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 48, lineHeight: 52, letterSpacing: -1.9 }}
        >
          {card.word}
        </Text>
      </View>

      {/* Отметить использованные слова */}
      <View>
        <Text
          className="text-micro mb-3 text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO_REVERSE}.markUsedWords`)}
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {card.required.map((w, i) => {
            const used = usedWordIdxs.has(i);
            return (
              <Pressable
                key={i}
                onPress={() => {
                  onToggleWord(i);
                }}
                className={`rounded-premium-md border px-4 py-2.5 ${
                  used
                    ? 'bg-premium-green/20 border-premium-green/50 opacity-70'
                    : 'border-white/15 bg-white/5'
                }`}
                style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
              >
                <Text
                  className={`text-sm font-black uppercase italic ${
                    used ? 'text-premium-green line-through' : 'text-white/50'
                  }`}
                >
                  {w}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text
          className="text-micro mt-3 text-center font-black uppercase text-white/20"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.TABOO_REVERSE}.usedCount`, {
            n: usedWordIdxs.size,
            total: card.required.length,
          })}
        </Text>
      </View>

      <View className="border-t border-white/10" />

      {/* Кто угадал? */}
      <View className="gap-3">
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 4 }}
        >
          {t(`${NS.TABOO_REVERSE}.whoGuessed`)}
        </Text>

        {otherPlayers.map((player) => (
          <Pressable
            key={player}
            onPress={() => {
              onVerdict(player);
            }}
            className="bg-premium-green/10 border-premium-green/40 rounded-premium-md w-full flex-row items-center justify-between border-2 p-4"
            style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
          >
            <View className="flex-1">
              <Text className="text-premium-green text-base font-black italic">{player}</Text>
              <Text className="text-tag mt-0.5 text-white/30">
                {allWordsUsed
                  ? t(`${NS.TABOO_REVERSE}.allWordsUsed`)
                  : t(`${NS.TABOO_REVERSE}.wordsUsedOf`, {
                      n: usedWordIdxs.size,
                      total: card.required.length,
                    })}
              </Text>
            </View>
            <Text className="text-premium-green ml-4 text-3xl font-black italic">
              +{allWordsUsed ? 2 : 1}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => {
            onVerdict(null);
          }}
          className="rounded-premium-md w-full flex-row items-center justify-between border-2 border-white/10 bg-white/5 p-4"
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
        >
          <Text className="text-base font-black italic text-white/50">
            {t(`${NS.TABOO_REVERSE}.nobodyGuessed`)}
          </Text>
          <Text className="ml-4 text-3xl font-black italic text-white/30">0</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            onVerdict(null, true);
          }}
          className="bg-premium-red/10 border-premium-red/30 rounded-premium-md w-full flex-row items-center justify-between border-2 p-4"
          style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
        >
          <View className="flex-1">
            <Text className="text-premium-red text-base font-black italic">
              {t(`${NS.TABOO_REVERSE}.explainerSaidWord`, { player: currentExplainer })}
            </Text>
            <Text className="text-tag mt-0.5 text-white/30">
              {t(`${NS.TABOO_REVERSE}.penaltyForExplainer`)}
            </Text>
          </View>
          <Text className="text-premium-red ml-4 text-3xl font-black italic">−1</Text>
        </Pressable>
      </View>

      <View className="border-t border-white/10" />

      <StopGameButton onClick={onStopGame} />
    </MotiView>
  );
};
