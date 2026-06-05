import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { PassPhoneCard } from './PassPhoneCard';
import { PlayerScoreList } from './PlayerScoreList';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';

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
      className="min-h-full flex flex-col items-center justify-center p-6 gap-8"
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
