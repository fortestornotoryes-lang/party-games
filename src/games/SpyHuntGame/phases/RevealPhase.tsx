import React from 'react';
import { motion } from 'motion/react';
import { Skull, RotateCcw } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { GameCard } from '@/components/GameCard';
import { Player } from '@/types';

interface RevealPhaseProps {
  spy: Player | undefined;
  location: string;
  onBack: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({ spy, location, onBack }) => (
  <motion.div
    key="reveal"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="p-6 flex-1 flex flex-col items-center justify-center space-y-12 max-w-md mx-auto w-full"
  >
    <div className="text-center space-y-4">
      <Skull className="w-24 h-24 text-premium-red mx-auto animate-pulse" />
      <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">Шпион раскрыт</h2>
    </div>

    <GameCard className="w-full p-10 text-center border-premium-red/40 bg-premium-red/5 space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-premium-red/60 uppercase tracking-widest">Агент 00</p>
        <h3 className="text-5xl font-black italic text-white uppercase break-words px-4">{spy?.name}</h3>
      </div>
      <div className="pt-6 border-t border-premium-red/20">
        <p className="text-[10px] font-black text-premium-green/60 uppercase tracking-widest">Секретная локация</p>
        <p className="text-2xl font-black italic text-white uppercase">{location}</p>
      </div>
    </GameCard>

    <PrimaryButton onClick={onBack} icon={RotateCcw} variant="red">
      ВЕРНУТЬСЯ В МЕНЮ
    </PrimaryButton>
  </motion.div>
);
