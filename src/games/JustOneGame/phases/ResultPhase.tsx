import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';

interface ResultPhaseProps {
  isCorrect: boolean;
  word: string;
  guess: string;
  onNext: () => void;
}

export const ResultPhase: React.FC<ResultPhaseProps> = ({ isCorrect, word, guess, onNext }) => (
  <motion.div
    key="result"
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.88 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className="min-h-full flex flex-col p-6 items-center justify-center text-center gap-8"
  >
    <div className="space-y-4">
      {isCorrect ? (
        <>
          <div className="relative">
            <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-green/15" />
            <CheckCircle className="w-20 h-20 text-premium-green mx-auto relative" />
          </div>
          <h2 className="text-[64px] font-black italic uppercase tracking-tighter text-premium-green leading-none">
            ПРАВИЛЬНО!
          </h2>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-red/15" />
            <XCircle className="w-20 h-20 text-premium-red mx-auto relative" />
          </div>
          <h2 className="text-[64px] font-black italic uppercase tracking-tighter text-premium-red leading-none">
            ОШИБКА
          </h2>
        </>
      )}

      <div className="space-y-1">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/25">Загаданное слово</p>
        <div className="text-4xl font-black italic uppercase tracking-tighter text-white">{word}</div>
        {!isCorrect && (
          <p className="text-sm text-white/35 font-medium mt-1">Ответ: <span className="italic">{guess}</span></p>
        )}
      </div>
    </div>

    <PrimaryButton onClick={onNext} icon={RotateCcw}>СЛЕДУЮЩИЙ РАУНД</PrimaryButton>
  </motion.div>
);
