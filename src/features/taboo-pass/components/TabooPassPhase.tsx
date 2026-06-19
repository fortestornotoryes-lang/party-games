import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { PlayerScoreList } from '@/entities/player/components/PlayerScoreList';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

type AccentColor = 'red' | 'orange';

interface TabooPassPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  /** Pass for team mode — shows team badges on non-active players */
  teams?: [string[], string[]];
  accentColor: AccentColor;
  icon: LucideIcon;
  instruction: string;
  onStart: () => void;
}

/**
 * Shared Pass phase for Taboo game family.
 * Shows a PassPhoneCard + sorted scoreboard with accent-color highlighting.
 * Used by TabooGame (red) and TabooReverseGame (orange).
 */
export const TabooPassPhase: React.FC<TabooPassPhaseProps> = ({
  playerNames,
  scores,
  currentExplainer,
  teams,
  accentColor,
  icon,
  instruction,
  onStart,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="pass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex min-h-full flex-col items-center justify-center gap-8 p-6"
    >
      <PassPhoneCard
        playerName={currentExplainer}
        badge={t(`${NS.TABOO}.explainerBadge`)}
        badgeColor={accentColor}
        instruction={instruction}
        icon={icon}
        accentColor={accentColor}
        onClick={onStart}
      />
      <PlayerScoreList
        players={playerNames}
        scores={scores}
        activePlayer={currentExplainer}
        accentColor={accentColor}
        teams={teams}
      />
    </motion.div>
  );
};
