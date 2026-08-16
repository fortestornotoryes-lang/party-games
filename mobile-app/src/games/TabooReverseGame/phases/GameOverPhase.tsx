import { RotateCcw, Trophy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface GameOverPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  teams?: [string[], string[]];
  onRematch: () => void;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  playerNames,
  scores,
  teams,
  onRematch,
  onBack,
}) => {
  const { t } = useTranslation();

  const sorted = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner = topScore > 0 && topScore > secondScore;

  // ── Командный режим ────────────────────────────────────────────────────────
  const team1Score = teams ? teams[0].reduce((s, p) => s + (scores[p] ?? 0), 0) : 0;
  const team2Score = teams ? teams[1].reduce((s, p) => s + (scores[p] ?? 0), 0) : 0;
  // -1 = ничья
  const teamWinner = teams
    ? team1Score > team2Score
      ? 0
      : team2Score > team1Score
        ? 1
        : -1
    : null;

  return (
    <MotiView
      key="game-over"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'timing', duration: 200 }}
      className="mx-auto w-full max-w-sm items-center gap-8 p-6"
    >
      {/* ── Шапка результата ──────────────────────────────────────────────── */}
      <View className="w-full items-center gap-2 pt-4">
        <Trophy size={64} color={rgba('yellow', 1)} style={{ marginBottom: 16 }} />
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.TABOO}.gameEnded`)}
        </Text>

        {teams ? (
          <>
            {teamWinner === -1 ? (
              <Text
                className="text-center font-black uppercase italic text-white/70"
                style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
              >
                {t(`${NS.COMMON}.draw`)}!
              </Text>
            ) : (
              <Text
                className={`text-center font-black uppercase italic ${
                  teamWinner === 0 ? 'text-premium-orange' : 'text-premium-sky'
                }`}
                style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
              >
                {t(`${NS.TABOO_REVERSE}.teamWon`, { n: (teamWinner ?? 0) + 1 })}
              </Text>
            )}

            {/* Карточки счёта команд */}
            <View className="mt-4 w-full flex-row gap-3">
              {([0, 1] as const).map((ti) => {
                const isWinner = teamWinner === ti;
                const tscore = ti === 0 ? team1Score : team2Score;
                return (
                  <View
                    key={ti}
                    className={`rounded-premium-md flex-1 gap-2 border-2 p-4 ${
                      isWinner
                        ? ti === 0
                          ? 'border-premium-orange/60 bg-premium-orange/10'
                          : 'border-premium-sky/60 bg-premium-sky/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <Text
                      className={`text-micro font-black uppercase ${
                        ti === 0 ? 'text-premium-orange/70' : 'text-premium-sky/70'
                      }`}
                      style={{ letterSpacing: 2 }}
                    >
                      {t(`${NS.TABOO_REVERSE}.teamN`, { n: ti + 1 })}
                    </Text>
                    <Text
                      className={`text-3xl font-black italic ${
                        isWinner
                          ? ti === 0
                            ? 'text-premium-orange'
                            : 'text-premium-sky'
                          : 'text-white/50'
                      }`}
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {tscore}
                    </Text>
                    {/* Состав */}
                    <View className="gap-1">
                      {[...teams[ti]]
                        .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
                        .map((p) => (
                          <View key={p} className="flex-row items-center justify-between">
                            <Text
                              numberOfLines={1}
                              className="text-label flex-1 font-bold text-white/50"
                            >
                              {p}
                            </Text>
                            <Text
                              className="text-label ml-2 font-black text-white/40"
                              style={{ fontVariant: ['tabular-nums'] }}
                            >
                              {scores[p] ?? 0}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : hasWinner ? (
          <Text
            className="text-premium-yellow text-center font-black uppercase italic"
            style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
          >
            {t(`${NS.TABOO_REVERSE}.playerWon`, { player: sorted[0] })}
          </Text>
        ) : (
          <Text
            className="text-center font-black uppercase italic text-white/70"
            style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
          >
            {t(`${NS.COMMON}.draw`)}!
          </Text>
        )}
      </View>

      {/* Личный зачёт — только вне командного режима */}
      {!teams && <LeaderboardList players={playerNames} scores={scores} />}

      <View className="w-full gap-3">
        <PrimaryButton onClick={onRematch} icon={RotateCcw} variant="outline">
          {t(`${NS.COMMON}.rematch`).toUpperCase()}
        </PrimaryButton>
        <PrimaryButton onClick={onBack} variant="outline">
          {t(`${NS.TABOO}.backToMenu`)}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
