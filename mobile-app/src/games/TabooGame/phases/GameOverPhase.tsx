import React from 'react';

import { GameOverLeaderboard } from '@/shared/components/GameOverLeaderboard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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

  return (
    <GameOverLeaderboard
      playerNames={playerNames}
      scores={scores}
      titleLabel={t(`${NS.TABOO}.gameEnded`)}
      winnerLabel={(player) => t(`${NS.TABOO}.playerWon`, { player })}
      drawLabel={`${t(`${NS.COMMON}.draw`)}!`}
      onRematch={onRematch}
      rematchLabel={t(`${NS.COMMON}.rematch`).toUpperCase()}
      onBack={onBack}
      backLabel={t(`${NS.TABOO}.backToMenu`)}
    />
  );
};
