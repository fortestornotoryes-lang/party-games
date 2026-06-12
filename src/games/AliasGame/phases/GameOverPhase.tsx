import { RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

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
  const isRed = currentTeam.color === 'red';
  const teamColor = isRed ? 'text-premium-red' : 'text-premium-blue';
  const teamName = isRed ? t(`${NS.ALIAS}.teamRed`) : t(`${NS.ALIAS}.teamBlue`);

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center gap-10 p-6 text-center"
    >
      <div className="relative">
        <div
          className={`absolute -inset-16 rounded-full blur-3xl ${isRed ? 'bg-premium-red/15' : 'bg-premium-blue/15'}`}
        />
        <Trophy className={`relative mx-auto mb-5 h-24 w-24 ${teamColor}`} />
        <Typography.Display size="xl" align="center" className="relative mb-2">
          {t(`${NS.ALIAS}.victory`)}
        </Typography.Display>
        <Typography.Label
          size="md"
          color={isRed ? 'red' : 'blue'}
          align="center"
          className="relative"
        >
          {t(`${NS.ALIAS}.winningTeam`, { name: teamName })}
        </Typography.Label>
      </div>
      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={isRed ? 'red' : 'blue'}>
        {t(`${NS.ALIAS}.mainMenu`)}
      </PrimaryButton>
    </motion.div>
  );
};
