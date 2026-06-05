import React from 'react';
import { motion } from 'motion/react';
import { XCircle, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';

interface GameOverPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  correctAnswer: string | undefined;
  guaranteed: string;
  playerScores: Record<string, string>;
  onNextPlayer: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  currentPlayer,
  questionIndex,
  correctAnswer,
  guaranteed,
  playerScores,
  onNextPlayer,
}) => {
  return (
    <motion.div
      key="gameover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-between p-6 overflow-y-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full">
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <div className="w-24 h-24 rounded-full bg-premium-red/15 border-2 border-premium-red/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,46,77,0.2)]">
            <XCircle className="w-12 h-12 text-premium-red" />
          </div>
        </motion.div>

        {/* Result info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-1"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-premium-red/70">
            Неверно!
          </p>
          <p className="text-[15px] font-bold text-white/70">{currentPlayer}</p>
          <p className="text-[12px] text-white/35">Вопрос {questionIndex + 1} из 15</p>
        </motion.div>

        {/* Correct answer */}
        {correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full glass-card rounded-premium-lg p-4"
            style={{ borderColor: 'rgba(0,216,138,0.25)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-premium-green" />
              <span className="text-[10px] font-black uppercase tracking-widest text-premium-green">
                Правильный ответ
              </span>
            </div>
            <p className="text-[15px] font-bold text-white text-center">{correctAnswer}</p>
          </motion.div>
        )}

        {/* Guaranteed amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full glass-card rounded-premium-lg p-4 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
            Гарантированная сумма
          </p>
          <p className="text-[36px] font-black font-display italic tracking-tighter text-white/60 leading-none">
            {guaranteed}
          </p>
        </motion.div>

        {/* Scoreboard */}
        {Object.keys(playerScores).length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                        className={`text-[13px] font-semibold ${name === currentPlayer ? 'text-white' : 'text-white/55'}`}
                      >
                        {name}
                      </span>
                    </div>
                    <span
                      className={`text-[13px] font-black ${name === currentPlayer ? 'text-white/60' : 'text-white/40'}`}
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
        transition={{ delay: 0.5 }}
        className="w-full pt-4"
      >
        <PrimaryButton variant="white" icon={ChevronRight} onClick={onNextPlayer}>
          Следующий игрок
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
