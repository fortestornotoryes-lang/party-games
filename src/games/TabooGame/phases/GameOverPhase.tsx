import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';
import { PrimaryButton } from '../../../components/UI';

interface GameOverPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  onRematch: () => void;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  playerNames,
  scores,
  onRematch,
  onBack,
}) => {
  const sorted      = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore    = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner   = topScore > 0 && topScore > secondScore;

  return (
    <motion.div
      key="game-over"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center p-6 gap-8 max-w-sm mx-auto w-full"
    >
      <div className="text-center space-y-2 pt-4">
        <Trophy className="w-16 h-16 text-premium-yellow mx-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
          Игра завершена
        </p>
        {hasWinner ? (
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-premium-yellow">
            {sorted[0]} победил!
          </h2>
        ) : (
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/70">
            Ничья!
          </h2>
        )}
      </div>

      <div className="w-full space-y-3">
        {sorted.map((player, idx) => {
          const sc       = scores[player] ?? 0;
          const isWinner = idx === 0 && hasWinner;
          return (
            <div
              key={player}
              className={`p-5 rounded-2xl border-2 flex items-center justify-between ${
                isWinner
                  ? 'border-premium-yellow/60 bg-premium-yellow/10 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`shrink-0 text-xl font-black italic w-8 ${
                  isWinner ? 'text-premium-yellow' : 'text-white/20'
                }`}>
                  #{idx + 1}
                </span>
                <p className={`font-black text-base truncate ${
                  isWinner ? 'text-premium-yellow' : 'text-white/70'
                }`}>
                  {isWinner ? '🏆 ' : ''}{player}
                </p>
              </div>
              <span className={`text-4xl font-black italic ml-3 tabular-nums shrink-0 ${
                isWinner ? 'text-premium-yellow' : 'text-white/50'
              }`}>
                {sc}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full space-y-3">
        <PrimaryButton onClick={onRematch} icon={RotateCcw} variant="outline">
          СЫГРАТЬ СНОВА
        </PrimaryButton>
        <PrimaryButton onClick={onBack} variant="outline">
          В МЕНЮ
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
