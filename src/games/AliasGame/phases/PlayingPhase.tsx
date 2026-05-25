import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

const CIRCUMFERENCE = 2 * Math.PI * 28;

const fmtScore = (n: number) => `${n > 0 ? '+' : ''}${n}`;

interface PlayingPhaseProps {
  currentWord: string;
  roundScore: number;
  timeLeft: number;
  roundTime: number;
  onCorrect: () => void;
  onSkip: () => void;
}

export const PlayingPhase: React.FC<PlayingPhaseProps> = ({
  currentWord,
  roundScore,
  timeLeft,
  roundTime,
  onCorrect,
  onSkip,
}) => (
  <motion.div
    key="playing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col"
  >
    <div className="flex justify-center pt-5 pb-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
          <circle
            cx="32" cy="32" r="28"
            stroke={timeLeft <= 10 ? '#FF2E4D' : '#1FB6FF'}
            strokeWidth="3" fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / roundTime}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          initial={{ opacity: 0, y: 30, scale: 0.84 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="space-y-2"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-sky/35">Объясни слово</p>
          <h2 className="text-[58px] font-black italic uppercase tracking-tighter text-white leading-none break-words">
            {currentWord}
          </h2>
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="text-center pb-3">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Очки: </span>
      <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${roundScore >= 0 ? 'text-premium-green' : 'text-premium-red'}`}>
        {fmtScore(roundScore)}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3 px-5 pb-8">
      <button
        onClick={onSkip}
        className="h-[86px] rounded-[22px] bg-premium-red/[0.07] border border-premium-red/20 flex flex-col items-center justify-center gap-2 active:scale-95 active:bg-premium-red/14 transition-all"
      >
        <XCircle className="w-8 h-8 text-premium-red" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-red/55">Пропустить</span>
      </button>
      <button
        onClick={onCorrect}
        className="h-[86px] rounded-[22px] bg-premium-green/[0.07] border border-premium-green/20 flex flex-col items-center justify-center gap-2 active:scale-95 active:bg-premium-green/14 transition-all"
      >
        <CheckCircle className="w-8 h-8 text-premium-green" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-green/55">Угадано</span>
      </button>
    </div>
  </motion.div>
);
