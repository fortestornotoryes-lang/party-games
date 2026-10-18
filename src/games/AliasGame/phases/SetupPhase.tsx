import { Play, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { MIN_TEAM_SIZE, MIN_TEAMS, TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import { getMaxTeams, isTeamsValid } from '../helpers';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
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

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  teams,
  playersCount,
  onTeamsCountChange,
  onShuffle,
  onMovePlayer,
  onStart,
}) => {
  const { t } = useTranslation();
  const maxTeams = getMaxTeams(playersCount);
  const counts = Array.from({ length: maxTeams - MIN_TEAMS + 1 }, (_, i) => MIN_TEAMS + i);
  const valid = isTeamsValid(teams);

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-4 overflow-y-auto p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Typography.Label size="md" color="faint" className="min-w-0">
          {t(`${NS.ALIAS}.teamsCount`)}
        </Typography.Label>
        <div className="flex gap-2">
          {counts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { onTeamsCountChange(n); }}
              className={`font-display h-11 w-11 rounded-full border text-sm font-black transition-all ${
                n === teams.length
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-white/5 text-white/30'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {teams.map((team) => {
          const style = TEAM_STYLES[team.color];
          const tooSmall = team.players.length < MIN_TEAM_SIZE;
          return (
            <div key={team.color} className={`rounded-premium-lg border p-4 ${style.card}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <Typography.Label size="md" color={style.typo} className="min-w-0">
                  {t(`${NS.ALIAS}.${TEAM_NAME_KEY[team.color]}`)}
                </Typography.Label>
                <span
                  className={`text-xs font-black ${tooSmall ? 'text-premium-red' : 'text-white/30'}`}
                >
                  {team.players.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {team.players.map((player) => (
                  <button
                    key={player}
                    type="button"
                    onClick={() => { onMovePlayer(player); }}
                    className={`min-h-11 max-w-full rounded-full border px-4 text-sm font-bold wrap-anywhere ${style.chip}`}
                  >
                    {player}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Typography.Caption color="dimmer" align="center">
        {valid ? t(`${NS.ALIAS}.moveHint`) : t(`${NS.ALIAS}.teamTooSmall`, { n: MIN_TEAM_SIZE })}
      </Typography.Caption>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton onClick={onShuffle} icon={Shuffle} variant="outline">
          {t(`${NS.ALIAS}.shuffleTeams`)}
        </PrimaryButton>
        <PrimaryButton onClick={onStart} icon={Play} disabled={!valid}>
          {t(`${NS.ALIAS}.startGame`)}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
