import React from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy, Play } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { WIN_SCORE, TROPHY_THRESHOLD } from '@/constants/aliasContent';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';
import { Team } from '../types';

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
      className="h-full flex flex-col p-6 gap-5"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <motion.div
          initial={{ scale: 0.82 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`w-full max-w-[220px] py-8 px-6 rounded-premium-xl border-2 ${teamBg} flex flex-col items-center`}
          style={{
            boxShadow: isRed ? '0 0 60px rgba(255,46,77,0.12)' : '0 0 60px rgba(63,123,255,0.12)',
          }}
        >
          <Zap className={`w-12 h-12 mb-3 ${teamColor}`} />
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
            className={`p-4 rounded-premium-lg border ${
              i === 0
                ? 'bg-premium-red/5 border-premium-red/15'
                : 'bg-premium-blue/5 border-premium-blue/15'
            } ${i === currentTeamIdx ? 'ring-1 ring-white/10' : ''}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Typography.Label size="md" color={i === 0 ? 'red' : 'blue'} className="opacity-50">
                {teamName(team.color)}
              </Typography.Label>
              <Trophy
                className={`w-3 h-3 ${team.score >= TROPHY_THRESHOLD ? 'text-premium-yellow' : 'text-white/10'}`}
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
