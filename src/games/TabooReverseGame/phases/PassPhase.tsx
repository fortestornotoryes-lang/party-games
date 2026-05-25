import React from 'react';
import { motion } from 'motion/react';
import { ListChecks } from 'lucide-react';
import { PassPhoneCard } from '../../../components/PassPhoneCard';

interface PassPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  currentExplainer: string;
  teams?: [string[], string[]];
  onStart: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({
  playerNames,
  scores,
  currentExplainer,
  teams,
  onStart,
}) => {
  const getTeamIdx = (player: string): 0 | 1 | null => {
    if (!teams) return null;
    if (teams[0].includes(player)) return 0;
    if (teams[1].includes(player)) return 1;
    return null;
  };

  const teamBadge = (player: string) => {
    const idx = getTeamIdx(player);
    if (idx === null) return null;
    return (
      <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
        idx === 0
          ? 'text-premium-orange/80 bg-premium-orange/10'
          : 'text-premium-sky/80 bg-premium-sky/10'
      }`}>
        {idx === 0 ? 'Команда 1' : 'Команда 2'}
      </span>
    );
  };

  return (
    <motion.div
      key="pass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-full flex flex-col items-center justify-center p-6 gap-8"
    >
      <PassPhoneCard
          playerName={currentExplainer}
          badge="Объяснять"
          badgeColor="orange"
          instruction="Только ты должен видеть загаданное слово"
          icon={ListChecks}
          accentColor="orange"
          onClick={onStart}
      />
      {/* Scoreboard */}
      <div className="w-full max-w-sm space-y-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 text-center mb-3">
          Счёт
        </p>
        {[...playerNames]
          .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
          .map(player => (
            <div
              key={player}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                player === currentExplainer
                  ? 'border-premium-orange/50 bg-premium-orange/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-black truncate ${
                  player === currentExplainer ? 'text-premium-orange' : 'text-white/70'
                }`}>
                  {player}
                </span>
                {player === currentExplainer && (
                  <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-premium-orange/70 bg-premium-orange/10 px-2 py-0.5 rounded-full">
                    объясняет
                  </span>
                )}
                {player !== currentExplainer && teamBadge(player)}
              </div>
              <span className={`text-2xl font-black italic ml-3 tabular-nums ${
                player === currentExplainer ? 'text-premium-orange' : 'text-white'
              }`}>
                {scores[player] ?? 0}
              </span>
            </div>
          ))}
      </div>


    </motion.div>
  );
};
