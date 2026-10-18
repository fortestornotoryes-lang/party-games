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
  winner: Team;
  teams: Team[];
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ winner, teams, onBack }) => {
  const { t } = useTranslation();
  const style = TEAM_STYLES[winner.color];
  const teamName = (team: Team) => t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`);

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto p-6 text-center"
    >
      <div className="relative">
        <div
          className="absolute -inset-16 rounded-full blur-3xl"
          style={{ backgroundColor: style.confetti, opacity: 0.15 }}
        />
        <Trophy className={`relative mx-auto mb-5 h-24 w-24 ${style.text}`} />
        <Typography.Display size="xl" align="center" className="relative mb-2">
          {t(`${NS.CROCODILE}.victory`)}
        </Typography.Display>
        <Typography.Label size="md" color={style.typo} align="center" className="relative">
          {t(`${NS.CROCODILE}.winningTeam`, { name: teamName(winner) })}
        </Typography.Label>
      </div>

      <div className="flex w-full flex-col gap-2">
        {[...teams]
          .sort((a, b) => b.score - a.score)
          .map((team) => (
            <div
              key={team.color}
              className={`rounded-premium-lg flex items-center justify-between gap-3 border px-4 py-3 ${TEAM_STYLES[team.color].card}`}
            >
              <Typography.Label size="md" color={TEAM_STYLES[team.color].typo} className="min-w-0">
                {teamName(team)}
              </Typography.Label>
              <Typography.Score color={TEAM_STYLES[team.color].typo}>{team.score}</Typography.Score>
            </div>
          ))}
      </div>

      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={style.button}>
        {t(`${NS.CROCODILE}.mainMenu`)}
      </PrimaryButton>
    </motion.div>
  );
};
