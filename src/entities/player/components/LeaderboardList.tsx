import { motion } from 'motion/react';
import React from 'react';

import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { SPRING } from '@/shared/theme/motion';

/** Пауза между строками при каскадном появлении, с */
const ROW_STAGGER = 0.12;

interface LeaderboardListProps {
  players: string[];
  scores: Record<string, number>;
  className?: string;
  /**
   * Каскадное появление снизу вверх (последнее место первым, победитель — в конце
   * с «попом»), очки прокручиваются от нуля. Задержка старта — `animationDelay`, с.
   */
  animated?: boolean;
  animationDelay?: number;
}

/**
 * Ranked score list for GameOver screens.
 * Sorts players by score, highlights the winner in yellow.
 */
export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  players,
  scores,
  className,
  animated = false,
  animationDelay = 0,
}) => {
  const sorted = [...players].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const topScore = scores[sorted[0]] ?? 0;
  const secondScore = sorted.length > 1 ? (scores[sorted[1]] ?? 0) : -1;
  const hasWinner = topScore > 0 && topScore > secondScore;

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {sorted.map((player, idx) => {
        const sc = scores[player] ?? 0;
        const isWinner = idx === 0 && hasWinner;
        const delay = animationDelay + (sorted.length - 1 - idx) * ROW_STAGGER;
        return (
          <motion.div
            key={player}
            initial={animated ? { opacity: 0, y: 24, scale: isWinner ? 0.8 : 0.95 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...(isWinner ? SPRING.pop : SPRING.soft), delay }}
            className={`rounded-premium-md flex items-center justify-between border-2 p-5 ${
              isWinner
                ? 'border-premium-yellow/60 bg-premium-yellow/10 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`w-8 shrink-0 text-xl font-black italic ${isWinner ? 'text-premium-yellow' : 'text-white/20'}`}
              >
                #{idx + 1}
              </span>
              <p
                className={`truncate text-base font-black ${isWinner ? 'text-premium-yellow' : 'text-white/70'}`}
              >
                {isWinner ? '🏆 ' : ''}
                {player}
              </p>
            </div>
            <span
              className={`ml-3 shrink-0 text-4xl font-black italic tabular-nums ${isWinner ? 'text-premium-yellow' : 'text-white/50'}`}
            >
              {animated ? <AnimatedNumber value={sc} from={0} delay={delay} /> : sc}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
