import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, TrendingUp, Banknote } from 'lucide-react';
import { PRIZE_LADDER } from '@/constants/millionaireContent';
import { PrimaryButton } from '@/components/UI';

interface BetweenPhaseProps {
  currentPlayer: string;
  questionIndex: number;
  onTakeMoney: () => void;
  onContinue: () => void;
}

export const BetweenPhase: React.FC<BetweenPhaseProps> = ({
  currentPlayer,
  questionIndex,
  onTakeMoney,
  onContinue,
}) => {
  const currentPrize = PRIZE_LADDER[questionIndex];
  const nextPrize = PRIZE_LADDER[questionIndex + 1];

  return (
    <motion.div
      key="between"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col items-center justify-center p-6 gap-6"
    >
      {/* Correct badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-20 h-20 rounded-full bg-premium-green/15 border-2 border-premium-green/40 flex items-center justify-center shadow-[0_0_40px_rgba(0,216,138,0.25)]">
          <CheckCircle className="w-10 h-10 text-premium-green" />
        </div>
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-premium-green/70 mb-1">
            Правильно!
          </p>
          <p className="text-[13px] text-white/50 font-semibold">{currentPlayer}</p>
        </div>
      </motion.div>

      {/* Prize won card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full glass-card rounded-premium-lg p-5 text-center"
        style={{ borderColor: 'rgba(255,204,31,0.2)' }}
      >
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
          Вы заработали
        </p>
        <p className="text-[42px] font-black font-display italic tracking-tighter text-premium-yellow leading-none">
          {currentPrize}
        </p>
        <p className="text-[11px] text-white/30 mt-1">Вопрос {questionIndex + 1} из 15</p>
      </motion.div>

      {/* Decision buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full space-y-3"
      >
        <button
          onClick={onContinue}
          className="w-full h-16 rounded-premium-md border border-premium-yellow/30 bg-premium-yellow/10 text-premium-yellow font-black italic text-lg uppercase tracking-tighter flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-premium-yellow/15"
        >
          <TrendingUp className="w-5 h-5" />
          Продолжить за {nextPrize}
        </button>

        <PrimaryButton
          variant="outline"
          icon={Banknote}
          onClick={onTakeMoney}
          className="border-white/10"
        >
          Забрать {currentPrize}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
