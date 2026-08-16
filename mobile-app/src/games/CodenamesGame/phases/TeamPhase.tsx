import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Card, Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const REVEALED_CLASS: Partial<Record<Card['color'], string>> = {
  red: 'bg-premium-red border border-red-700 opacity-80',
  blue: 'bg-premium-blue border border-blue-700 opacity-80',
  neutral: 'border border-stone-500 bg-stone-400 opacity-80',
  assassin: 'border border-black bg-stone-900 opacity-90',
};

interface TeamPhaseProps {
  cards: Card[];
  turn: Team;
  clueWord: string;
  clueCount: number;
  guessesLeft: number;
  lastActionMsg: string | null;
  onCardClick: (card: Card) => void;
  onEndTurn: () => void;
}

export const TeamPhase: React.FC<TeamPhaseProps> = ({
  cards,
  turn,
  clueWord,
  clueCount,
  guessesLeft,
  lastActionMsg,
  onCardClick,
  onEndTurn,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      key="team"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-4"
    >
      <View className="rounded-premium-md relative items-center overflow-hidden border border-white/10 bg-white/5 py-3">
        <View
          className={`absolute bottom-0 left-0 top-0 w-2 ${
            turn === 'red' ? 'bg-premium-red' : 'bg-premium-blue'
          }`}
        />
        <Text className="text-tag mb-1 font-black uppercase text-white/40">
          {t(`${NS.CODENAMES}.clueLabel`)}
        </Text>
        <View className="flex-row items-baseline gap-2">
          <Text className="text-2xl font-black uppercase text-white">{clueWord}</Text>
          <Text className="text-xl font-bold text-white/30">{clueCount}</Text>
        </View>
        <Text className="mt-2 text-xs text-white/30">
          {t(`${NS.CODENAMES}.guessesLeft`, { n: guessesLeft })}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row flex-wrap" style={{ margin: -3 }}>
          {cards.map((card) => (
            <View key={card.id} style={{ width: '20%', padding: 3 }}>
              <Pressable
                onPress={() => {
                  onCardClick(card);
                }}
                disabled={card.revealed}
                className={`items-center justify-center rounded p-1 ${
                  card.revealed ? (REVEALED_CLASS[card.color] ?? '') : 'border-b-2 border-stone-400 bg-stone-200'
                }`}
                style={({ pressed }) => [
                  { aspectRatio: 4 / 3 },
                  pressed && !card.revealed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Text
                  className={`text-tag text-center font-black uppercase ${
                    card.revealed ? 'text-white' : 'text-stone-800'
                  }`}
                >
                  {card.word}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <AnimatePresence>
          {!!lastActionMsg && (
            <MotiView
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 items-center justify-center p-4"
            >
              <View className="rounded-premium-lg border border-white/20 bg-black/90 px-6 py-4">
                <Text className="text-center text-xl font-black uppercase text-white">
                  {lastActionMsg}
                </Text>
                <Text className="text-tag mt-2 text-center font-bold uppercase text-white/30">
                  {t(`${NS.CODENAMES}.turnPassing`)}
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>

      <PrimaryButton onClick={onEndTurn} variant="outline" className="mt-4">
        {t(`${NS.CODENAMES}.passTurn`)}
      </PrimaryButton>
    </MotiView>
  );
};
