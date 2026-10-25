import { motion } from 'motion/react';
import React from 'react';

import { MIN_TEAM_SIZE, MIN_TEAMS, TARGET_SCORES, TEAM_NAME_KEY } from '../constants';
import { getMaxTeams } from '../helpers';
import type { Team } from '../types';

import { NeonOption, TeamSetupPhase } from '@/features/team-setup/components/TeamSetupPhase';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { STAGGER_ITEM } from '@/shared/theme/motion';

/** Цвет игры (registry: crocodile) */
const ACCENT = 'lime';

interface SetupPhaseProps {
  teams: Team[];
  playersCount: number;
  targetScore: number;
  onTargetScoreChange: (score: number) => void;
  onTeamsCountChange: (count: number) => void;
  onShuffle: () => void;
  onMovePlayer: (player: string) => void;
  onStart: () => void;
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  teams,
  playersCount,
  targetScore,
  onTargetScoreChange,
  ...handlers
}) => {
  const { t } = useTranslation();
  const maxTeams = getMaxTeams(playersCount);
  const counts = Array.from({ length: maxTeams - MIN_TEAMS + 1 }, (_, i) => MIN_TEAMS + i);

  return (
    <TeamSetupPhase
      teams={teams.map((team) => ({
        color: team.color,
        name: t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`),
        players: team.players,
      }))}
      teamCounts={counts}
      minTeamSize={MIN_TEAM_SIZE}
      accent={ACCENT}
      layoutIdPrefix="croc"
      labels={{
        teamsCount: t(`${NS.CROCODILE}.teamsCount`),
        moveHint: t(`${NS.CROCODILE}.moveHint`),
        teamTooSmall: t(`${NS.CROCODILE}.teamTooSmall`, { n: MIN_TEAM_SIZE }),
        shuffle: t(`${NS.CROCODILE}.shuffleTeams`),
        start: t(`${NS.CROCODILE}.startGame`),
      }}
      {...handlers}
    >
      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-2">
        <Typography.Label size="md" color="muted">
          {t(`${NS.CROCODILE}.targetScore`)}
        </Typography.Label>
        <div className="-ml-1.5 flex flex-wrap" role="group">
          {TARGET_SCORES.map((score) => (
            <NeonOption
              key={score}
              active={score === targetScore}
              accent={ACCENT}
              layoutId="croc-target-score"
              onClick={() => {
                onTargetScoreChange(score);
              }}
            >
              {score}
            </NeonOption>
          ))}
        </div>
      </motion.div>
    </TeamSetupPhase>
  );
};
