import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { Team } from '../types';

interface GameOverPhaseProps {
  currentTeam: Team;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ currentTeam, onBack }) => {
  const isRed = currentTeam.color === 'red';
  const teamColor = isRed ? 'text-premium-red' : 'text-premium-blue';

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-6 items-center justify-center text-center gap-10"
    >
      <div className="relative">
        <div
          className={`absolute -inset-16 blur-[70px] rounded-full ${isRed ? 'bg-premium-red/15' : 'bg-premium-blue/15'}`}
        />
        <Trophy className={`w-24 h-24 mx-auto mb-5 relative ${teamColor}`} />
        <Typography.Display size="xl" align="center" className="mb-2 relative">
          ПОБЕДА!
        </Typography.Display>
        <Typography.Label
          size="md"
          color={isRed ? 'red' : 'blue'}
          align="center"
          className="relative"
        >
          Команда {currentTeam.name}
        </Typography.Label>
      </div>
      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={isRed ? 'red' : 'blue'}>
        В ГЛАВНОЕ МЕНЮ
      </PrimaryButton>
    </motion.div>
  );
};
