import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';
import { Typography } from '@/components/Typography';
import { ChoiceType } from '../types';

interface ActionPhaseProps {
  currentPlayer: string;
  choice: ChoiceType;
  content: string;
  onDone: () => void;
}

export const ActionPhase: React.FC<ActionPhaseProps> = ({
  currentPlayer,
  choice,
  content,
  onDone,
}) => {
  const isTruth = choice === 'truth';

  return (
    <motion.div
      key="action"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="h-full flex flex-col p-5 gap-6"
    >
      <div className="flex flex-col items-center gap-2 pt-2">
        <div
          className={`px-4 py-1.5 rounded-full border ${
            isTruth
              ? 'bg-premium-sky/10 border-premium-sky/25'
              : 'bg-premium-red/10 border-premium-red/25'
          }`}
        >
          <Typography.Label color={isTruth ? 'sky' : 'red'} as="span">
            {isTruth ? 'Правда' : 'Действие'}
          </Typography.Label>
        </div>
        <Typography.Title className="text-center">{currentPlayer}</Typography.Title>
      </div>

      <div className="flex-1 flex items-center justify-center px-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
          className="w-full rounded-[28px] p-8 text-center relative overflow-hidden"
          style={{
            background: isTruth
              ? 'linear-gradient(145deg, rgba(31,182,255,0.1) 0%, rgba(31,182,255,0.04) 100%)'
              : 'linear-gradient(145deg, rgba(255,46,77,0.1) 0%, rgba(255,46,77,0.04) 100%)',
            border: isTruth
              ? '1.5px solid rgba(31,182,255,0.2)'
              : '1.5px solid rgba(255,46,77,0.2)',
            boxShadow: isTruth ? '0 0 80px rgba(31,182,255,0.07)' : '0 0 80px rgba(255,46,77,0.07)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)',
            }}
          />
          <p className="text-xl font-black leading-snug relative z-10 text-white">{content}</p>
        </motion.div>
      </div>

      <PrimaryButton onClick={onDone} icon={CheckCircle} variant={isTruth ? 'blue' : 'red'}>
        ВЫПОЛНЕНО
      </PrimaryButton>
    </motion.div>
  );
};
