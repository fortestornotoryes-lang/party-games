import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';
import { useTranslation } from '@/i18n';
import { Team } from '../types';

interface GameOverPhaseProps {
  winner: Team;
  onRematch: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ winner, onRematch }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
    >
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-premium-green font-bold">
          {t('common.gameOver')}
        </p>
        <h2
          className={`text-5xl font-black uppercase ${winner === 'red' ? 'text-premium-red' : 'text-premium-blue'}`}
        >
          {winner === 'red' ? t('codenames.redWins') : t('codenames.blueWins')}
        </h2>
      </div>
      <PrimaryButton onClick={onRematch} variant="white">
        {t('common.rematch')}
      </PrimaryButton>
    </motion.div>
  );
};
