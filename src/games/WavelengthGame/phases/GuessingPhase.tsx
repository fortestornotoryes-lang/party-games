import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';
import { GameCard } from '@/components/GameCard';

interface GuessingPhaseProps {
  currentPair: string[];
  guessValue: number;
  onGuessChange: (val: number) => void;
  onConfirm: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  currentPair,
  guessValue,
  onGuessChange,
  onConfirm,
}) => (
  <motion.div
    key="guessing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col space-y-12"
  >
    <div className="text-center space-y-4">
      <h3 className="text-3xl font-black italic uppercase tracking-tighter">Настройте волну!</h3>
      <p className="text-gray-400 font-medium">Передвиньте рычаг в нужную позицию</p>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center space-y-16">
      <div className="w-full space-y-8">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest px-4">
          <span className="text-premium-purple">{currentPair[0]}</span>
          <span className="text-premium-purple">{currentPair[1]}</span>
        </div>

        <div className="relative h-24 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={guessValue}
            onChange={(e) => onGuessChange(parseInt(e.target.value))}
            className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-premium-purple"
          />
          <div
            style={{ left: `${guessValue}%` }}
            className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-12 bg-white rounded-lg shadow-2xl transition-transform active:scale-110 pointer-events-none flex items-center justify-center"
          >
            <div className="h-8 w-0.5 bg-black/20" />
          </div>
        </div>
      </div>

      <GameCard className="bg-premium-purple/5 border border-premium-purple/20 w-full text-center py-8">
        <div className="text-[10px] font-black uppercase tracking-widest text-premium-purple/60 mb-2">
          Значение
        </div>
        <div className="text-6xl font-black italic tracking-tighter">{guessValue}</div>
      </GameCard>
    </div>

    <PrimaryButton onClick={onConfirm}>ПОДТВЕРДИТЬ ВЫБОР</PrimaryButton>
  </motion.div>
);
