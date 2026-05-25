import React from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy, Play } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { WIN_SCORE, TROPHY_THRESHOLD } from '@/constants/aliasContent';
import { Team } from '../types';

interface StartPhaseProps {
  teams: Team[];
  currentTeamIdx: number;
  onStart: () => void;
}

export const StartPhase: React.FC<StartPhaseProps> = ({ teams, currentTeamIdx, onStart }) => {
  const currentTeam = teams[currentTeamIdx];
  const isRed       = currentTeam.color === 'red';
  const teamColor   = isRed ? 'text-premium-red' : 'text-premium-blue';
  const teamBg      = isRed
    ? 'bg-premium-red/[0.07] border-premium-red/20'
    : 'bg-premium-blue/[0.07] border-premium-blue/20';

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
          className={`w-full max-w-[220px] py-8 px-6 rounded-[32px] border-2 ${teamBg} flex flex-col items-center`}
          style={{ boxShadow: isRed ? '0 0 60px rgba(255,46,77,0.12)' : '0 0 60px rgba(63,123,255,0.12)' }}
        >
          <Zap className={`w-12 h-12 mb-3 ${teamColor}`} />
          <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${teamColor}`}>
            {currentTeam.name}
          </h3>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mt-2">Твой черёд!</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((t, i) => (
          <div
            key={i}
            className={`p-4 rounded-[20px] border ${
              i === 0
                ? 'bg-premium-red/[0.05] border-premium-red/15'
                : 'bg-premium-blue/[0.05] border-premium-blue/15'
            } ${i === currentTeamIdx ? 'ring-1 ring-white/10' : ''}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                i === 0 ? 'text-premium-red/50' : 'text-premium-blue/50'
              }`}>{t.name}</span>
              <Trophy className={`w-3 h-3 ${t.score >= TROPHY_THRESHOLD ? 'text-premium-yellow' : 'text-white/10'}`} />
            </div>
            <div className={`text-4xl font-black italic ${i === 0 ? 'text-premium-red' : 'text-premium-blue'}`}>
              {t.score}
            </div>
            <div className="text-[9px] text-white/15 font-black uppercase tracking-widest mt-0.5">/ {WIN_SCORE}</div>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={onStart} icon={Play}>НАЧАТЬ РАУНД</PrimaryButton>
    </motion.div>
  );
};
