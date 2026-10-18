import { RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GameOverPhaseProps {
  currentTeam: Team;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ currentTeam, onBack }) => {
  const { t } = useTranslation();
  const style = TEAM_STYLES[currentTeam.color];
  const teamName = t(`${NS.ALIAS}.${TEAM_NAME_KEY[currentTeam.color]}`);

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center gap-10 p-6 text-center"
    >
      <div className="relative">
        <div
          className="absolute -inset-16 rounded-full blur-3xl"
          style={{ backgroundColor: style.confetti, opacity: 0.15 }}
        />
        <Trophy className={`relative mx-auto mb-5 h-24 w-24 ${style.text}`} />
        <Typography.Display size="xl" align="center" className="relative mb-2">
          {t(`${NS.ALIAS}.victory`)}
        </Typography.Display>
        <Typography.Label size="md" color={style.typo} align="center" className="relative">
          {t(`${NS.ALIAS}.winningTeam`, { name: teamName })}
        </Typography.Label>
      </div>
      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={style.button}>
        {t(`${NS.ALIAS}.mainMenu`)}
      </PrimaryButton>
    </motion.div>
  );
};
