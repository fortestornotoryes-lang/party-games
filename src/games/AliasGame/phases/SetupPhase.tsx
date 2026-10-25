import React from 'react';

import { MIN_TEAM_SIZE, MIN_TEAMS, TEAM_NAME_KEY } from '../constants';
import { getMaxTeams } from '../helpers';
import type { Team } from '../types';

import { TeamSetupPhase } from '@/features/team-setup/components/TeamSetupPhase';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface SetupPhaseProps {
  teams: Team[];
  playersCount: number;
  onTeamsCountChange: (count: number) => void;
  onShuffle: () => void;
  onMovePlayer: (player: string) => void;
  onStart: () => void;
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({ teams, playersCount, ...handlers }) => {
  const { t } = useTranslation();
  const maxTeams = getMaxTeams(playersCount);
  const counts = Array.from({ length: maxTeams - MIN_TEAMS + 1 }, (_, i) => MIN_TEAMS + i);

  return (
    <TeamSetupPhase
      teams={teams.map((team) => ({
        color: team.color,
        name: t(`${NS.ALIAS}.${TEAM_NAME_KEY[team.color]}`),
        players: team.players,
      }))}
      teamCounts={counts}
      minTeamSize={MIN_TEAM_SIZE}
      accent="red"
      layoutIdPrefix="alias"
      labels={{
        teamsCount: t(`${NS.ALIAS}.teamsCount`),
        moveHint: t(`${NS.ALIAS}.moveHint`),
        teamTooSmall: t(`${NS.ALIAS}.teamTooSmall`, { n: MIN_TEAM_SIZE }),
        shuffle: t(`${NS.ALIAS}.shuffleTeams`),
        start: t(`${NS.ALIAS}.startGame`),
      }}
      {...handlers}
    />
  );
};
