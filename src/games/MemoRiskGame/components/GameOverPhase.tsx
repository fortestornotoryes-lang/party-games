import confetti from 'canvas-confetti';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import React, { useEffect } from 'react';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GameOverPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  onRestart: () => void;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  playerNames,
  scores,
  onRestart,
  onBack,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    void confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.45 },
      colors: ['#ff2eb4', '#c77bff', '#ffcc1f', '#ffffff'],
    });
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
      <div className="space-y-2 text-center">
        <Trophy className="text-premium-yellow mx-auto h-12 w-12" />
        <p className="text-2xl font-black text-white uppercase italic">
          {t(`${NS.COMMON}.gameOver`)}
        </p>
        <p className="text-micro font-black tracking-[0.3em] text-white/30 uppercase">
          {t(`${NS.MEMO_RISK}.deckEmpty`)}
        </p>
      </div>

      <LeaderboardList players={playerNames} scores={scores} />

      <div className="w-full space-y-3">
        <PrimaryButton onClick={onRestart} icon={RotateCcw} variant="purple">
          {t(`${NS.MEMO_RISK}.newGame`)}
        </PrimaryButton>
        <PrimaryButton onClick={onBack} icon={Home} variant="outline">
          {t(`${NS.MEMO_RISK}.toMenu`)}
        </PrimaryButton>
      </div>
    </div>
  );
};
