import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { GameCard } from '@/components/GameCard';

interface CluePhaseProps {
  psychic: string;
  currentPair: string[];
  targetValue: number;
  onDone: () => void;
}

export const CluePhase: React.FC<CluePhaseProps> = ({
  psychic,
  currentPair,
  targetValue,
  onDone,
}) => (
  <motion.div
    key="clue"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="h-full flex flex-col space-y-12"
  >
    <div className="text-center space-y-4">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
        Текущий Телепат
      </div>
      <h3 className="text-4xl font-black italic text-premium-purple tracking-tighter uppercase">
        {psychic}
      </h3>
      <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto">
        Только ты видишь целевую зону на шкале!
      </p>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center space-y-12">
      <GameCard className="relative w-full h-48 flex items-center justify-center overflow-hidden">
        <div className="relative w-full px-12 pointer-events-none">
          <div className="h-4 w-full bg-black/40 rounded-full relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '10%' }}
              style={{ left: `${targetValue - 5}%` }}
              className="absolute h-full bg-premium-purple/80 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center overflow-visible"
            >
              <div className="h-8 w-1 bg-white" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-white/80">
            <span>{currentPair[0]}</span>
            <span>{currentPair[1]}</span>
          </div>
        </div>
      </GameCard>

      <div className="space-y-4 text-center">
        <p className="text-gray-400">Придумай подсказку, чтобы игроки попали в эту зону</p>
        <div className="text-2xl font-black italic uppercase tracking-tight flex items-center justify-center space-x-2">
          <span className="text-gray-500">{currentPair[0]}</span>
          <ChevronRight className="w-4 h-4 text-premium-purple" />
          <span className="text-white">{currentPair[1]}</span>
        </div>
      </div>
    </div>

    <PrimaryButton onClick={onDone}>Я ДАЛ ПОДСКАЗКУ</PrimaryButton>
  </motion.div>
);
