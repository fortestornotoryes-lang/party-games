import { Play, Trophy, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { Team } from '../types';

import { TROPHY_THRESHOLD, WIN_SCORE } from '@/games/AliasGame/constants.ts';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface StartPhaseProps {
  teams: Team[];
  currentTeamIdx: number;
  onStart: () => void;
}

export const StartPhase: React.FC<StartPhaseProps> = ({ teams, currentTeamIdx, onStart }) => {
  const { t } = useTranslation();
  const currentTeam = teams[currentTeamIdx];
  const isRed = currentTeam.color === 'red';
  const teamColor = isRed ? 'text-premium-red' : 'text-premium-blue';
  const teamBg = isRed
    ? 'bg-premium-red/[0.07] border-premium-red/20'
    : 'bg-premium-blue/[0.07] border-premium-blue/20';

  const teamName = (color: 'red' | 'blue') =>
    color === 'red' ? t(`${NS.ALIAS}.teamRed`) : t(`${NS.ALIAS}.teamBlue`);

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-5 p-6"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <motion.div
          initial={{ scale: 0.82 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`rounded-premium-xl w-full max-w-[220px] border-2 px-6 py-8 ${teamBg} flex flex-col items-center`}
          style={{
            boxShadow: isRed ? '0 0 60px rgba(255,46,77,0.12)' : '0 0 60px rgba(63,123,255,0.12)',
          }}
        >
          <Zap className={`mb-3 h-12 w-12 ${teamColor}`} />
          <Typography.Heading size="lg" color={isRed ? 'red' : 'blue'}>
            {teamName(currentTeam.color)}
          </Typography.Heading>
          <Typography.Caption color="dimmer" className="mt-2">
            {t(`${NS.ALIAS}.yourTurn`)}
          </Typography.Caption>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team, i) => (
          <div
            key={i}
            className={`rounded-premium-lg border p-4 ${
              i === 0
                ? 'bg-premium-red/5 border-premium-red/15'
                : 'bg-premium-blue/5 border-premium-blue/15'
            } ${i === currentTeamIdx ? 'ring-1 ring-white/10' : ''}`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <Typography.Label size="md" color={i === 0 ? 'red' : 'blue'} className="opacity-50">
                {teamName(team.color)}
              </Typography.Label>
              <Trophy
                className={`h-3 w-3 ${team.score >= TROPHY_THRESHOLD ? 'text-premium-yellow' : 'text-white/10'}`}
              />
            </div>
            <Typography.Score color={i === 0 ? 'red' : 'blue'}>{team.score}</Typography.Score>
            <Typography.Caption color="dimmer" className="mt-0.5">
              / {WIN_SCORE}
            </Typography.Caption>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={onStart} icon={Play}>
        {t(`${NS.ALIAS}.startRound`)}
      </PrimaryButton>
    </motion.div>
  );
};
