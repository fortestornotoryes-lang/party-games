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
  onRematch: () => void;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  playerNames,
  scores,
  onRematch,
  onBack,
}) => {
  const { t } = useTranslation();
  const sorted = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner = topScore > 0 && topScore > secondScore;

  return (
    <MotiView
      key="game-over"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="mx-auto w-full max-w-sm items-center gap-8 p-6"
    >
      <View className="items-center gap-2 pt-4">
        <Trophy size={64} color={rgba('yellow', 1)} style={{ marginBottom: 16 }} />
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 5 }}
        >
          {t(`${NS.TABOO}.gameEnded`)}
        </Text>
        {hasWinner ? (
          <Text
            className="text-premium-yellow text-center font-black uppercase italic"
            style={{ fontSize: 36, lineHeight: 40, letterSpacing: -1.4 }}
          >
            {t(`${NS.TABOO}.playerWon`, { player: sorted[0] })}
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

      <LeaderboardList players={playerNames} scores={scores} />

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
