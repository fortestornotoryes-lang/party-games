import { ChevronRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { getRevealedTrait } from '../helpers';
import { type BunkerCharacter } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface RevealPhaseProps {
  characters: BunkerCharacter[];
  revealRound: number;
  totalRounds: number;
  onDone: () => void;
}

const ROUND_COLORS: GameTheme[] = ['orange', 'yellow', 'sky', 'green', 'purple', 'red', 'pink'];

export const RevealPhase: React.FC<RevealPhaseProps> = ({
  characters,
  revealRound,
  totalRounds,
  onDone,
}) => {
  const { t } = useTranslation();
  const colorName = ROUND_COLORS[(revealRound - 1) % ROUND_COLORS.length];

  return (
    <MotiView
      key={`reveal-${revealRound}`}
      from={{ opacity: 0, translateX: 40 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: -40 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-1 gap-5 px-5 py-6"
    >
      {/* Прогресс раундов */}
      <View className="flex-row items-center justify-center gap-3">
        <View className="flex-row gap-1.5">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map((r) => (
            <View
              key={r}
              className="h-1.5 rounded-full"
              style={{
                width: r === revealRound ? 32 : 8,
                backgroundColor:
                  r === revealRound
                    ? rgba(colorName, 1)
                    : r < revealRound
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </View>
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.roundOf`, { current: revealRound, total: totalRounds })}
        </Typography.Label>
      </View>

      {/* Раскрытия раунда по всем персонажам */}
      <View className="gap-2">
        <Typography.Label size="xs" color="muted">
          {t(`${NS.BUNKER}.revealedThisRound`)}
        </Typography.Label>
        <View className="gap-2">
          {characters.map((char, idx) => {
            const revealed = getRevealedTrait(char, revealRound);
            if (!revealed) return null;
            return (
              <MotiView
                key={char.playerName}
                from={{ opacity: 0, translateY: 8 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: idx * 40, type: 'spring', stiffness: 260, damping: 24 }}
                className="rounded-premium-sm flex-row items-center gap-3 p-3"
                style={{
                  backgroundColor: rgba(colorName, 0.07),
                  borderWidth: 1,
                  borderColor: rgba(colorName, 0.2),
                }}
              >
                <View
                  className="rounded-premium-sm h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: rgba(colorName, 0.12),
                    borderWidth: 1,
                    borderColor: rgba(colorName, 0.25),
                  }}
                >
                  <Text className="text-xl">{revealed.entry.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-micro font-black uppercase text-white/30"
                    style={{ letterSpacing: 2 }}
                  >
                    {char.playerName} · {t(`${NS.BUNKER}.ageShort`, { n: char.age })} ·{' '}
                    {char.gender}
                  </Text>
                  <Text
                    className="text-micro mt-0.5 font-bold uppercase"
                    style={{ color: rgba(colorName, 0.7), letterSpacing: 2 }}
                  >
                    {t(`${NS.BUNKER}.traitLabels.${revealed.traitKey}`)}
                  </Text>
                  <Text numberOfLines={1} className="mt-0.5 text-sm font-black text-white">
                    {revealed.entry.name}
                  </Text>
                </View>
                {!revealed.entry.isPositive && (
                  <Text className="text-premium-red/60 shrink-0 text-xs">⚠</Text>
                )}
              </MotiView>
            );
          })}
        </View>
      </View>

      <View className="mt-auto">
        <PrimaryButton onClick={onDone} icon={ChevronRight}>
          {t(`${NS.BUNKER}.allAnnouncedBtn`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
