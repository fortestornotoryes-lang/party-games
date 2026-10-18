import { RotateCcw, Trophy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { getLeaderboardWinner, type LeaderboardWinner } from '@/shared/helpers/scoring';
import { rgba } from '@/shared/theme/colors';

interface GameOverLeaderboardProps {
  playerNames: string[];
  scores: Record<string, number>;
  titleLabel: string;
  winnerLabel: (winnerName: string) => string;
  drawLabel: string;
  onRematch: () => void;
  rematchLabel: string;
  onBack: () => void;
  backLabel: string;
  /** Заменяет стандартный блок «победитель/ничья» — для игр с командным зачётом (см. TabooReverseGame). */
  renderResult?: (winner: LeaderboardWinner) => React.ReactNode;
  /** Скрывает личный зачёт (LeaderboardList) — для командного режима. */
  hideLeaderboard?: boolean;
}

/** Общий экран итогов партии: победитель/ничья по личному зачёту + таблица очков + кнопки rematch/back. */
export const GameOverLeaderboard: React.FC<GameOverLeaderboardProps> = ({
  playerNames,
  scores,
  titleLabel,
  winnerLabel,
  drawLabel,
  onRematch,
  rematchLabel,
  onBack,
  backLabel,
  renderResult,
  hideLeaderboard,
}) => {
  const winner = getLeaderboardWinner(playerNames, scores);

  return (
    <MotiView
      key="game-over"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'timing', duration: 200 }}
      className="mx-auto w-full max-w-sm items-center gap-8 p-6"
    >
      <View className="w-full items-center gap-2 pt-4">
        <Trophy size={64} color={rgba('yellow', 1)} style={{ marginBottom: 16 }} />
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 5 }}
        >
          {titleLabel}
        </Text>

        {renderResult ? (
          renderResult(winner)
        ) : winner.hasWinner ? (
          <Text
            className="text-premium-yellow text-center font-black uppercase italic"
            style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
          >
            {winnerLabel(winner.sorted[0])}
          </Text>
        ) : (
          <Text
            className="text-center font-black uppercase italic text-white/70"
            style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
          >
            {drawLabel}
          </Text>
        )}
      </View>

      {!hideLeaderboard && <LeaderboardList players={playerNames} scores={scores} />}

      <View className="w-full gap-3">
        <PrimaryButton onClick={onRematch} icon={RotateCcw} variant="outline">
          {rematchLabel}
        </PrimaryButton>
        <PrimaryButton onClick={onBack} variant="outline">
          {backLabel}
        </PrimaryButton>
      </View>
    </MotiView>
  );
};
