import { CheckCircle2, StopCircle, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { BlitzResult } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface BlitzVerdictPhaseProps {
  results: BlitzResult[];
  currentExplainer: string;
  otherPlayers: string[];
  onConfirm: (guessers: (string | null)[]) => void;
  onStopGame: () => void;
}

export const BlitzVerdictPhase: React.FC<BlitzVerdictPhaseProps> = ({
  results,
  currentExplainer,
  otherPlayers,
  onConfirm,
  onStopGame,
}) => {
  const { t } = useTranslation();
  // Слот на каждый результат: имя угадавшего или null («никто» / пропуск)
  const [guessers, setGuessers] = useState<(string | null)[]>(() => results.map(() => null));

  const setGuesser = (idx: number, player: string | null) => {
    setGuessers((prev) => prev.map((g, i) => (i === idx ? player : g)));
  };

  const guessedResults = results.filter((r) => r.status === 'guessed');
  const skippedPenalty = results.filter((r) => r.status === 'skipped').length;

  return (
    <MotiView
      key="blitz-verdict"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      className="mx-auto w-full max-w-lg gap-6 p-6"
    >
      {/* Шапка */}
      <View className="items-center gap-1 pt-2">
        <Text
          className="text-micro font-black uppercase text-white/30"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.TABOO_REVERSE}.turnResult`)}
        </Text>
        <Text
          className="text-center font-black uppercase italic text-white"
          style={{ fontSize: 30, lineHeight: 33, letterSpacing: -1.2 }}
        >
          {currentExplainer}
        </Text>
        <View className="flex-row items-center justify-center gap-4 pt-1">
          <Text className="text-premium-green text-sm font-black">
            {t(`${NS.TABOO_REVERSE}.guessedCount`, { n: guessedResults.length })}
          </Text>
          {skippedPenalty > 0 && (
            <Text className="text-premium-red text-sm font-black">
              {t(`${NS.TABOO_REVERSE}.skippedCount`, { n: skippedPenalty })}
            </Text>
          )}
        </View>
      </View>

      {results.length === 0 ? (
        <View className="rounded-premium-md items-center border border-white/10 bg-white/5 py-8">
          <Text
            className="text-sm font-black uppercase text-white/30"
            style={{ letterSpacing: 2 }}
          >
            {t(`${NS.TABOO_REVERSE}.noCards`)}
          </Text>
          <Text className="mt-1 text-xs text-white/20">
            {t(`${NS.TABOO_REVERSE}.timeUpBeforeFirst`)}
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {results.map((result, idx) => {
            if (result.status === 'skipped') {
              return (
                <View
                  key={idx}
                  className="rounded-premium-md border-premium-red/20 bg-premium-red/5 flex-row items-center gap-3 border p-4"
                >
                  <XCircle size={20} color={rgba('red', 0.6)} />
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="font-black uppercase italic text-white/50"
                      style={{ letterSpacing: -0.3 }}
                    >
                      {result.card.word}
                    </Text>
                    <Text className="text-tag text-premium-red/60 mt-0.5">
                      {t(`${NS.TABOO_REVERSE}.skipPenaltyFor`, { player: currentExplainer })}
                    </Text>
                  </View>
                </View>
              );
            }

            // Угаданная карточка — выбрать, кто угадал
            const selected = guessers[idx];
            return (
              <View
                key={idx}
                className="rounded-premium-md border-premium-green/20 bg-premium-green/5 gap-3 border p-4"
              >
                <View className="flex-row items-center gap-3">
                  <CheckCircle2 size={20} color={rgba('green', 0.7)} />
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-black uppercase italic text-white"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {result.card.word}
                  </Text>
                  <Text className="text-premium-green ml-auto text-xl font-black italic">
                    {selected ? '+1' : '?'}
                  </Text>
                </View>

                {/* Выбор угадавшего */}
                <View className="flex-row flex-wrap gap-2">
                  {otherPlayers.map((player) => {
                    const isActive = selected === player;
                    return (
                      <Pressable
                        key={player}
                        onPress={() => {
                          setGuesser(idx, isActive ? null : player);
                        }}
                        className={`rounded-premium-sm border px-3 py-1.5 ${
                          isActive
                            ? 'bg-premium-green/20 border-premium-green/60'
                            : 'border-white/10 bg-white/5'
                        }`}
                        style={({ pressed }) =>
                          pressed ? { transform: [{ scale: 0.95 }] } : undefined
                        }
                      >
                        <Text
                          className={`text-label font-black uppercase italic ${
                            isActive ? 'text-premium-green' : 'text-white/40'
                          }`}
                          style={{ letterSpacing: -0.2 }}
                        >
                          {player}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable
                    onPress={() => {
                      setGuesser(idx, null);
                    }}
                    className={`rounded-premium-sm border px-3 py-1.5 ${
                      selected === null ? 'border-white/30 bg-white/10' : 'border-white/5 bg-white/5'
                    }`}
                    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
                  >
                    <Text
                      className={`text-label font-black uppercase italic ${
                        selected === null ? 'text-white/60' : 'text-white/20'
                      }`}
                      style={{ letterSpacing: -0.2 }}
                    >
                      {t(`${NS.TABOO_REVERSE}.nobody`)}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View className="border-t border-white/10" />

      <PrimaryButton
        onClick={() => {
          onConfirm(guessers);
        }}
        variant="orange"
      >
        {t(`${NS.TABOO_REVERSE}.confirm`)}
      </PrimaryButton>

      <Pressable
        onPress={onStopGame}
        className="rounded-premium-md w-full flex-row items-center justify-center gap-2 border border-white/10 bg-white/5 p-3.5"
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
      >
        <StopCircle size={16} color="rgba(255,255,255,0.3)" />
        <Text
          className="text-sm font-black uppercase text-white/30"
          style={{ letterSpacing: 2 }}
        >
          {t(`${NS.COMMON}.stopGame`)}
        </Text>
      </Pressable>
    </MotiView>
  );
};
