import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';

interface PassPhaseProps {
  psychic: string;
  onReady: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ psychic, onReady }) => (
  <motion.div
    key="pass"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="h-full flex flex-col items-center justify-center space-y-10 text-center"
  >
    <div className="space-y-4">
      <p className="text-[10px] text-white/80 font-black uppercase tracking-[0.3em]">Новый раунд</p>
      <h3 className="text-xl font-bold uppercase tracking-widest text-white/60">Телепат:</h3>
      <h2 className="text-6xl font-black italic uppercase text-premium-purple tracking-tighter leading-none">
        {psychic}
      </h2>
    </div>
    <div className="p-8 bg-premium-purple/5 border-2 border-premium-purple/10 rounded-[40px] text-sm text-gray-500 max-w-xs transition-all">
      {psychic}, возьми телефон! Только ты должен видеть секретную цель. Убедись, что остальные не смотрят.
    </div>
    <PrimaryButton onClick={onReady} className="bg-premium-purple">Я ГОТОВ</PrimaryButton>
  </motion.div>
);
