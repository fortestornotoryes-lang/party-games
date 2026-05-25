import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface RoundEndPhaseProps {
  roundScore: number;
  onContinue: () => void;
}

export const RoundEndPhase: React.FC<RoundEndPhaseProps> = ({ roundScore, onContinue }) => (
  <motion.div
    key="round_end"
    initial={{ opacity: 0, scale: 0.84 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className="h-full flex flex-col p-6 items-center justify-center text-center gap-8"
  >
    <div className="space-y-2">
      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Время вышло</p>
      <div className={`text-[96px] font-black italic tracking-tighter leading-none ${
        roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'
      }`}>
        {fmtScore(roundScore)}
      </div>
      <h3 className="text-sm font-black uppercase italic tracking-tight text-white/45">Очков за раунд</h3>
    </div>
    <PrimaryButton onClick={onContinue}>ПРОДОЛЖИТЬ</PrimaryButton>
  </motion.div>
);
