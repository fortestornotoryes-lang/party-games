import { Check, UserX, Vote } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ResourceContribRow } from '../components/ResourceContribRow';
import { getPlayerResourceContribution, getRevealedTrait } from '../helpers';
import { type BunkerCharacter, type DifficultyLevel } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface VotingPhaseProps {
  characters: BunkerCharacter[];
  bunkerCapacity: number;
  totalRounds: number;
  difficulty: DifficultyLevel;
  directorName?: string | null;
  onConfirm: (eliminatedNames: string[]) => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  characters,
  bunkerCapacity,
  totalRounds,
  difficulty,
  directorName,
  onConfirm,
}) => {
  const { t } = useTranslation();

  // Диктатор занимает гарантированное место — исключён из голосования
  const votable = directorName
    ? characters.filter((c) => c.playerName !== directorName)
    : characters;
  const toEliminate = Math.max(0, characters.length - bunkerCapacity);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    feedbackService.vibrate(VIBRATE.tap);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < toEliminate) {
        next.add(name);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selected.size !== toEliminate) return;
    feedbackService.vibrate(VIBRATE.win);
    onConfirm(Array.from(selected));
  };

  const remaining = toEliminate - selected.size;

  return (
    <MotiView
      key="voting"
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-5 px-5 py-6"
    >
      {/* Шапка */}
      <View className="items-center gap-1">
        <View className="flex-row items-center justify-center gap-2">
          <Vote size={16} color={rgba('red', 1)} />
          <Typography.Label size="sm" color="red">
            {t(`${NS.BUNKER}.votingLabel`)}
          </Typography.Label>
        </View>
        <Typography.Title size="sm" color="white" align="center">
          {t(`${NS.BUNKER}.whoWontEnter`)}
        </Typography.Title>
      </View>

      {/* Счётчик */}
      <View
        className="rounded-premium-md items-center p-3"
        style={{
          backgroundColor: remaining > 0 ? 'rgba(255,46,77,0.08)' : 'rgba(0,216,138,0.08)',
          borderWidth: 1,
          borderColor: remaining > 0 ? 'rgba(255,46,77,0.25)' : 'rgba(0,216,138,0.25)',
        }}
      >
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={remaining}
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'timing', duration: 200 }}
          >
            {remaining > 0 ? (
              <Typography.Body size="sm" color="body" align="center">
                {t(`${NS.BUNKER}.selectMore`, { n: remaining })}
              </Typography.Body>
            ) : (
              <Typography.Body size="sm" color="green" align="center">
                {t(`${NS.BUNKER}.selectionDone`, { n: toEliminate })}
              </Typography.Body>
            )}
          </MotiView>
        </AnimatePresence>
      </View>

      {/* Бейдж защищённого диктатора */}
      {!!directorName && (
        <View
          className="rounded-premium-md flex-row items-center gap-3 px-4 py-3"
          style={{
            backgroundColor: rgba('yellow', 0.07),
            borderWidth: 1,
            borderColor: rgba('yellow', 0.25),
          }}
        >
          <Text className="text-lg">👑</Text>
          <View className="flex-1 flex-row items-center gap-2">
            <Text className="font-black uppercase italic text-white">{directorName}</Text>
            <Text
              className="text-tag font-black uppercase"
              style={{ color: rgba('yellow', 1), letterSpacing: 1 }}
            >
              {t(`${NS.BUNKER}.directorProtected`)}
            </Text>
          </View>
        </View>
      )}

      {/* Список игроков */}
      <View className="gap-2">
        {votable.map((char) => {
          const isSelected = selected.has(char.playerName);
          const revealed = Array.from({ length: totalRounds }, (_, i) => i + 1)
            .map((r) => getRevealedTrait(char, r))
            .filter(Boolean) as { entry: { emoji: string; name: string } }[];
          const contrib =
            difficulty === DIFFICULTY.EASY ? getPlayerResourceContribution(char) : null;

          return (
            <Pressable
              key={char.playerName}
              onPress={() => {
                toggle(char.playerName);
              }}
              className="rounded-premium-md w-full"
              style={({ pressed }) => [
                {
                  backgroundColor: isSelected ? 'rgba(255,46,77,0.1)' : 'rgba(255,255,255,0.04)',
                  borderWidth: isSelected ? 1.5 : 1,
                  borderColor: isSelected ? 'rgba(255,46,77,0.4)' : 'rgba(255,255,255,0.08)',
                },
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
            >
              <View className="p-3.5">
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2">
                    <View
                      className="rounded-premium-xs h-5 w-5 shrink-0 items-center justify-center"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected ? 'rgba(255,46,77,0.8)' : 'rgba(255,255,255,0.2)',
                        backgroundColor: isSelected ? 'rgba(255,46,77,0.8)' : 'transparent',
                      }}
                    >
                      {!!isSelected && <Check size={12} color="#fff" />}
                    </View>
                    <Text className="text-lg font-black uppercase italic text-white">
                      {char.playerName}
                    </Text>
                    {!!isSelected && (
                      <View className="flex-row items-center gap-1">
                        <UserX size={14} color={rgba('red', 1)} />
                        <Text
                          className="text-tag text-premium-red font-black uppercase"
                          style={{ letterSpacing: 1 }}
                        >
                          {t(`${NS.BUNKER}.eliminatedBadge`)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-bold text-white/30">
                    {char.gender} · {char.age}
                  </Text>
                </View>

                {/* Раскрытые характеристики */}
                <View className="flex-row flex-wrap gap-1.5">
                  {revealed.map((rev, i) => (
                    <View
                      key={i}
                      className="rounded-premium-xs bg-white/5 px-2 py-0.5"
                    >
                      <Text
                        className="text-tag font-bold"
                        style={{
                          color: isSelected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
                        }}
                      >
                        {rev.entry.emoji} {rev.entry.name}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Вклад в ресурсы (только лёгкая сложность) */}
                {!!contrib && (
                  <ResourceContribRow contrib={contrib} className="mt-1.5 flex-row flex-wrap gap-2" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Подтверждение */}
      <PrimaryButton
        onClick={handleConfirm}
        disabled={selected.size !== toEliminate}
        variant="red"
        icon={UserX}
      >
        {t(`${NS.BUNKER}.confirmVoteBtn`)}
      </PrimaryButton>
    </MotiView>
  );
};
