import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';

interface WinPhaseProps {
  currentPlayer: string;
  prize: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

export const WinPhase: React.FC<WinPhaseProps> = ({
  currentPlayer,
  prize,
  playerScores,
  onNextPlayer,
}) => {
  const isMillion = prize === '1 000 000';

  return (
    <motion.div
      key="win"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-between p-6 overflow-y-auto"
    >
      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative"
        >
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center border-2 ${
              isMillion
                ? 'bg-premium-yellow/20 border-premium-yellow/50 shadow-[0_0_60px_rgba(255,204,31,0.4)]'
                : 'bg-premium-green/15 border-premium-green/40 shadow-[0_0_40px_rgba(0,216,138,0.3)]'
            }`}
          >
            <Trophy
              className={`w-14 h-14 ${isMillion ? 'text-premium-yellow' : 'text-premium-green'}`}
            />
          </div>
          {isMillion && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-premium-yellow/30"
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Prize display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
            {isMillion ? '🏆 Миллионер!' : 'Выиграл'}
          </p>
          <p className="text-[15px] font-bold text-white/70 mb-2">{currentPlayer}</p>
          <p
            className={`text-[44px] font-black font-display italic tracking-tighter leading-none ${
              isMillion ? 'text-premium-yellow' : 'text-premium-green'
            }`}
          >
            {prize}
          </p>
        </motion.div>

        {/* Scoreboard */}
        {Object.keys(playerScores).length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full glass-card rounded-premium-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-3.5 h-3.5 text-premium-yellow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Счёт
              </span>
            </div>
            <div className="space-y-2">
              {Object.entries(playerScores)
                .sort(
                  (a, b) =>
                    parseFloat(b[1].replace(/\D/g, '')) - parseFloat(a[1].replace(/\D/g, ''))
                )
                .map(([name, score], i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/20 w-4">{i + 1}</span>
                      <span
                        className={`text-[13px] font-semibold ${name === currentPlayer ? 'text-premium-yellow' : 'text-white/70'}`}
                      >
                        {name}
                      </span>
                    </div>
                    <span
                      className={`text-[13px] font-black ${name === currentPlayer ? 'text-premium-yellow' : 'text-white/50'}`}
                    >
                      {score}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Next player button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full pt-4"
      >
        <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
          Следующий игрок
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
