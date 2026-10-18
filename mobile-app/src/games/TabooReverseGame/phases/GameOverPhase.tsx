import React from 'react';
import { Text, View } from 'react-native';

import { GameOverLeaderboard } from '@/shared/components/GameOverLeaderboard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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
    <GameOverLeaderboard
      playerNames={playerNames}
      scores={scores}
      titleLabel={t(`${NS.TABOO}.gameEnded`)}
      winnerLabel={(player) => t(`${NS.TABOO_REVERSE}.playerWon`, { player })}
      drawLabel={`${t(`${NS.COMMON}.draw`)}!`}
      onRematch={onRematch}
      rematchLabel={t(`${NS.COMMON}.rematch`).toUpperCase()}
      onBack={onBack}
      backLabel={t(`${NS.TABOO}.backToMenu`)}
      hideLeaderboard={!!teams}
      renderResult={
        teams
          ? () => (
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
            )
          : undefined
      }
    />
  );
};
