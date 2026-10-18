import { Play, Trophy, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import { getExplainer } from '../helpers';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface StartPhaseProps {
  teams: Team[];
  currentTeamIdx: number;
  targetScore: number;
  onStart: () => void;
}

export const StartPhase: React.FC<StartPhaseProps> = ({
  teams,
  currentTeamIdx,
  targetScore,
  onStart,
}) => {
  const { t } = useTranslation();
  const currentTeam = teams[currentTeamIdx];
  const style = TEAM_STYLES[currentTeam.color];
  const explainer = getExplainer(currentTeam);
  const guessers = currentTeam.players.filter((p) => p !== explainer);

  const teamName = (team: Team) => t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`);

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-5 overflow-y-auto p-6"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <motion.div
          initial={{ scale: 0.82 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`rounded-premium-xl flex w-full max-w-[280px] flex-col items-center border-2 px-6 py-6 ${style.card}`}
          style={{ boxShadow: style.glow }}
        >
          <Zap className={`mb-3 h-10 w-10 ${style.text}`} />
          <Typography.Heading size="lg" color={style.typo}>
            {teamName(currentTeam)}
          </Typography.Heading>
          <Typography.Caption color="dimmer" className="mt-2">
            {t(`${NS.CROCODILE}.explains`)}
          </Typography.Caption>
          <Typography.Heading size="md" align="center" className="mt-1 wrap-anywhere">
            {explainer}
          </Typography.Heading>
          {guessers.length > 0 && (
            <>
              <Typography.Caption color="dimmer" className="mt-4">
                {t(`${NS.CROCODILE}.guessers`)}
              </Typography.Caption>
              <Typography.Caption color="muted" align="center" className="mt-1 wrap-anywhere">
                {guessers.join(', ')}
              </Typography.Caption>
            </>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team, i) => {
          const s = TEAM_STYLES[team.color];
          return (
            <div
              key={team.color}
              className={`rounded-premium-lg border p-4 ${s.card} ${
                i === currentTeamIdx ? 'ring-1 ring-white/20' : ''
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <Typography.Label
                  size="md"
                  color={s.typo}
                  className="min-w-0 wrap-anywhere opacity-50"
                >
                  {teamName(team)}
                </Typography.Label>
                <Trophy
                  className={`h-3 w-3 shrink-0 ${team.score >= targetScore * 0.66 ? 'text-premium-yellow' : 'text-white/10'}`}
                />
              </div>
              <Typography.Score color={s.typo}>{team.score}</Typography.Score>
              <Typography.Caption color="dimmer" className="mt-0.5">
                / {targetScore}
              </Typography.Caption>
            </div>
          );
        })}
      </div>

      <PrimaryButton onClick={onStart} icon={Play}>
        {t(`${NS.CROCODILE}.toWords`)}
      </PrimaryButton>
    </motion.div>
  );
};
