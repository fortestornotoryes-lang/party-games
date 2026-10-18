import { RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { VictoryHero } from '@/shared/components/VictoryHero';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { SPRING } from '@/shared/theme/motion';

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
      className="flex h-full flex-col items-center justify-center gap-10 overflow-hidden p-6 text-center"
    >
      <VictoryHero
        icon={Trophy}
        color={currentTeam.color}
        iconClassName={style.text}
        title={t(`${NS.ALIAS}.victory`)}
        subtitle={t(`${NS.ALIAS}.winningTeam`, { name: teamName })}
        subtitleColor={style.typo}
      />
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: 1 }}
      >
        <PrimaryButton onClick={onBack} icon={RotateCcw} variant={style.button}>
          {t(`${NS.ALIAS}.mainMenu`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
