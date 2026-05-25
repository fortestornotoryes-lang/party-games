import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';

interface RevealPhaseProps {
  currentPair: string[];
  targetValue: number;
  guessValue: number;
  score: number;
  onNext: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({
  currentPair,
  targetValue,
  guessValue,
  score,
  onNext,
}) => (
  <motion.div
    key="reveal"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="h-full flex flex-col space-y-12"
  >
    <div className="text-center">
      <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-2">РЕЗУЛЬТАТ</h2>
      <div className="flex items-center justify-center space-x-2 text-xl font-bold uppercase tracking-widest text-gray-500">
        <span>{currentPair[0]}</span>
        <ChevronRight className="w-4 h-4" />
        <span>{currentPair[1]}</span>
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center space-y-16">
      <div className="relative w-full px-12">
        <div className="h-8 w-full bg-white/5 rounded-full relative overflow-hidden border border-white/10">
          <div
            style={{ left: `${targetValue - 5}%` }}
            className="absolute h-full w-[10%] bg-premium-purple/40 rounded-sm"
          />
          <div
            style={{ left: `${targetValue}%` }}
            className="absolute h-full w-1 bg-white/80"
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '200%' }}
            style={{ left: `${guessValue}%` }}
            className="absolute top-[-50%] w-1 bg-premium-yellow shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10"
          />
        </div>
      </div>

      <div className="text-center space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Твои очки</p>
          <div className={`text-9xl font-black italic transition-colors ${score > 0 ? 'text-premium-green' : 'text-premium-red'}`}>
            {score}
          </div>
        </div>
        {score === 4 && (
          <div className="text-premium-yellow font-black italic uppercase tracking-widest animate-bounce">
            ИДЕАЛЬНО!
          </div>
        )}
      </div>
    </div>

    <PrimaryButton onClick={onNext} icon={RotateCcw}>СЛЕДУЮЩИЙ РАУНД</PrimaryButton>
  </motion.div>
);
