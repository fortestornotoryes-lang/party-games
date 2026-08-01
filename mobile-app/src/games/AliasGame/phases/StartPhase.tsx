import { Play, Trophy, Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import type { Team } from '../types';

import { TROPHY_THRESHOLD, WIN_SCORE } from '@/games/AliasGame/constants';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface StartPhaseProps {
  teams: Team[];
  currentTeamIdx: number;
  onStart: () => void;
}

export const StartPhase: React.FC<StartPhaseProps> = ({ teams, currentTeamIdx, onStart }) => {
  const { t } = useTranslation();
  const currentTeam = teams[currentTeamIdx];
  const isRed = currentTeam.color === 'red';
  const teamBg = isRed
    ? 'bg-premium-red/[0.07] border-premium-red/20'
    : 'bg-premium-blue/[0.07] border-premium-blue/20';

  const teamName = (color: 'red' | 'blue') =>
    color === 'red' ? t(`${NS.ALIAS}.teamRed`) : t(`${NS.ALIAS}.teamBlue`);

  return (
    <MotiView
      key="start"
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -14 }}
      transition={{ type: 'timing', duration: 220 }}
      className="flex-1 gap-5 p-6"
    >
      <View className="flex-1 items-center justify-center gap-5">
        <MotiView
          from={{ scale: 0.82 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className={`rounded-premium-xl w-full max-w-[220px] items-center border-2 px-6 py-8 ${teamBg}`}
          style={{
            shadowColor: rgba(isRed ? 'red' : 'blue', 0.5),
            shadowOpacity: 1,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          }}
        >
          <Zap size={48} color={rgba(isRed ? 'red' : 'blue', 1)} style={{ marginBottom: 12 }} />
          <Typography.Heading size="lg" color={isRed ? 'red' : 'blue'}>
            {teamName(currentTeam.color)}
          </Typography.Heading>
          <Typography.Caption color="dimmer" className="mt-2">
            {t(`${NS.ALIAS}.yourTurn`)}
          </Typography.Caption>
        </MotiView>
      </View>

      <View className="flex-row gap-3">
        {teams.map((team, i) => (
          <View
            key={i}
            className={`rounded-premium-lg flex-1 border p-4 ${
              i === 0
                ? 'bg-premium-red/5 border-premium-red/15'
                : 'bg-premium-blue/5 border-premium-blue/15'
            } ${i === currentTeamIdx ? 'border-white/10' : ''}`}
          >
            <View className="mb-1.5 flex-row items-center justify-between">
              <Typography.Label size="md" color={i === 0 ? 'red' : 'blue'} className="opacity-50">
                {teamName(team.color)}
              </Typography.Label>
              <Trophy
                size={12}
                color={
                  team.score >= TROPHY_THRESHOLD ? rgba('yellow', 1) : 'rgba(255,255,255,0.1)'
                }
              />
            </View>
            <Typography.Score color={i === 0 ? 'red' : 'blue'}>{team.score}</Typography.Score>
            <Typography.Caption color="dimmer" className="mt-0.5">
              / {WIN_SCORE}
            </Typography.Caption>
          </View>
        ))}
      </View>

      <PrimaryButton onClick={onStart} icon={Play}>
        {t(`${NS.ALIAS}.startRound`)}
      </PrimaryButton>
    </MotiView>
  );
};
