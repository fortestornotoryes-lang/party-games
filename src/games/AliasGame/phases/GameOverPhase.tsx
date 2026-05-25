import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { Team } from '../types';

interface GameOverPhaseProps {
  currentTeam: Team;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ currentTeam, onBack }) => {
  const isRed    = currentTeam.color === 'red';
  const teamColor = isRed ? 'text-premium-red' : 'text-premium-blue';

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-6 items-center justify-center text-center gap-10"
    >
      <div className="relative">
        <div className={`absolute -inset-16 blur-[70px] rounded-full ${isRed ? 'bg-premium-red/15' : 'bg-premium-blue/15'}`} />
        <Trophy className={`w-24 h-24 mx-auto mb-5 relative ${teamColor}`} />
        <h2 className="text-[70px] font-black italic uppercase tracking-tighter text-white mb-2 relative leading-none">
          ПОБЕДА!
        </h2>
        <p className={`text-lg font-black uppercase tracking-[0.25em] relative ${teamColor}`}>
          Команда {currentTeam.name}
        </p>
      </div>
      <PrimaryButton onClick={onBack} icon={RotateCcw} variant={isRed ? 'red' : 'blue'}>
        В ГЛАВНОЕ МЕНЮ
      </PrimaryButton>
    </motion.div>
  );
};
