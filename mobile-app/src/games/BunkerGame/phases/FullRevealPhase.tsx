import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import type { BunkerCharacter } from '../types';
import { ALL_TRAIT_KEYS } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface FullRevealPhaseProps {
  characters: BunkerCharacter[];
  eliminatedNames: string[];
  totalRounds: number;
  onContinue: () => void;
}

// Подписи резолвятся в рендере через t(bunker.traitLabels.<key>)
const ALL_TRAIT_ROW_KEYS: ('profession' | (typeof ALL_TRAIT_KEYS)[number])[] = [
  'profession',
  ...ALL_TRAIT_KEYS,
];

function CharacterCard({
  char,
  isEliminated,
  totalRounds,
  animDelay,
}: {
  char: BunkerCharacter;
  isEliminated: boolean;
  totalRounds: number;
  animDelay: number;
}) {
  const { t } = useTranslation();

  const revealedSet = new Set<string>([
    'profession',
    ...char.revealOrder.slice(0, totalRounds - 1),
  ]);

  const borderColor = isEliminated ? 'rgba(255,46,77,0.2)' : 'rgba(255,138,31,0.25)';
  const bgColor = isEliminated ? 'rgba(255,46,77,0.05)' : 'rgba(255,138,31,0.06)';
  const nameColor = isEliminated ? 'rgba(255,100,120,0.9)' : '#fff';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: animDelay, type: 'spring', stiffness: 260, damping: 24 }}
      className="rounded-premium-sm overflow-hidden"
      style={{ borderWidth: 1, borderColor, backgroundColor: bgColor }}
    >
      {/* Шапка карточки */}
      <View className="flex-row items-center gap-3 px-3 pb-2 pt-3">
        <Text className="text-2xl" style={{ opacity: isEliminated ? 0.5 : 1 }}>
          {char.profession.emoji}
        </Text>
        <View className="flex-1">
          <Text numberOfLines={1} className="text-sm font-black" style={{ color: nameColor }}>
            {char.playerName}
          </Text>
          <Text numberOfLines={1} className="text-tag text-white/35">
            {char.profession.name} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} · {char.gender}
          </Text>
        </View>
      </View>

      {/* Характеристики */}
      <View className="gap-1 px-3 pb-3">
        {ALL_TRAIT_ROW_KEYS.map((key) => {
          const entry = char[key as keyof BunkerCharacter] as
            | { name: string; emoji: string }
            | undefined;
          if (!entry || typeof entry !== 'object' || !('emoji' in entry)) return null;

          const isRevealed = revealedSet.has(key);

          return (
            <View
              key={key}
              className="flex-row items-center gap-2"
              style={{ opacity: isRevealed ? 1 : 0.4 }}
            >
              <Text className="w-5 shrink-0 text-center text-sm">{entry.emoji}</Text>
              <Text numberOfLines={1} className="w-20 shrink-0 text-xs text-white/40">
                {t(`${NS.BUNKER}.traitLabels.${key}`)}
              </Text>
              <Text numberOfLines={1} className="flex-1 text-xs font-bold text-white">
                {entry.name}
              </Text>
              {!isRevealed && (
                <View
                  className="shrink-0 rounded px-1.5 py-0.5"
                  style={{
                    backgroundColor: 'rgba(255,138,31,0.12)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,138,31,0.3)',
                  }}
                >
                  <Text className="text-tag" style={{ color: '#FF8A1F' }}>
                    {t(`${NS.BUNKER}.hiddenBadge`)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </MotiView>
  );
}

export const FullRevealPhase: React.FC<FullRevealPhaseProps> = ({
  characters,
  eliminatedNames,
  totalRounds,
  onContinue,
}) => {
  const { t } = useTranslation();

  const survivors = characters.filter((c) => !eliminatedNames.includes(c.playerName));
  const eliminated = characters.filter((c) => eliminatedNames.includes(c.playerName));

  return (
    <MotiView
      key="full-reveal"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 gap-5 px-5 py-6"
    >
      {/* Шапка */}
      <View className="gap-1">
        <Typography.Display size="md" glow align="center" color="orange">
          {t(`${NS.BUNKER}.fullRevealLabel`)}
        </Typography.Display>
        <Typography.Body size="sm" color="muted" align="center">
          {t(`${NS.BUNKER}.fullRevealDesc`)}
        </Typography.Body>
      </View>

      {/* Выжившие */}
      {survivors.length > 0 && (
        <View className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.survivorsLabel`)}
          </Typography.Label>
          <View className="gap-2">
            {survivors.map((char, idx) => (
              <CharacterCard
                key={char.playerName}
                char={char}
                isEliminated={false}
                totalRounds={totalRounds}
                animDelay={100 + idx * 70}
              />
            ))}
          </View>
        </View>
      )}

      {/* Не прошедшие */}
      {eliminated.length > 0 && (
        <View className="gap-2">
          <Typography.Label size="xs" color="muted">
            {t(`${NS.BUNKER}.outsidersLabel`)}
          </Typography.Label>
          <View className="gap-2">
            {eliminated.map((char, idx) => (
              <CharacterCard
                key={char.playerName}
                char={char}
                isEliminated={true}
                totalRounds={totalRounds}
                animDelay={100 + survivors.length * 70 + 100 + idx * 70}
              />
            ))}
          </View>
        </View>
      )}

      {/* Дальше */}
      <View className="mt-auto pt-2">
        <PrimaryButton onClick={onContinue}>{t(`${NS.BUNKER}.toSurvivalBtn`)}</PrimaryButton>
      </View>
    </MotiView>
  );
};
