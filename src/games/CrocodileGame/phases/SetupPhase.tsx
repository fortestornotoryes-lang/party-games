import { Play, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import {
  MIN_TEAM_SIZE,
  MIN_TEAMS,
  TARGET_SCORES,
  TEAM_NAME_KEY,
  TEAM_STYLES,
} from '../constants';
import { getMaxTeams, isTeamsValid } from '../helpers';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

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

const optionClass = (active: boolean) =>
  `font-display h-11 min-w-11 rounded-full border px-3 text-sm font-black transition-all ${
    active ? 'border-white/30 bg-white/10 text-white' : 'border-white/5 text-white/30'
  }`;

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  teams,
  playersCount,
  targetScore,
  onTargetScoreChange,
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
      <div className="flex flex-col gap-3">
        <Typography.Label size="md" color="faint" className="min-w-0">
          {t(`${NS.CROCODILE}.targetScore`)}
        </Typography.Label>
        <div className="flex flex-wrap gap-2">
          {TARGET_SCORES.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => { onTargetScoreChange(score); }}
              className={optionClass(score === targetScore)}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Typography.Label size="md" color="faint" className="min-w-0">
          {t(`${NS.CROCODILE}.teamsCount`)}
        </Typography.Label>
        <div className="flex gap-2">
          {counts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { onTeamsCountChange(n); }}
              className={optionClass(n === teams.length)}
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
                  {t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`)}
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
        {valid
          ? t(`${NS.CROCODILE}.moveHint`)
          : t(`${NS.CROCODILE}.teamTooSmall`, { n: MIN_TEAM_SIZE })}
      </Typography.Caption>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton onClick={onShuffle} icon={Shuffle} variant="outline">
          {t(`${NS.CROCODILE}.shuffleTeams`)}
        </PrimaryButton>
        <PrimaryButton onClick={onStart} icon={Play} disabled={!valid}>
          {t(`${NS.CROCODILE}.startGame`)}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
