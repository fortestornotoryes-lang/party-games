import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { PassPhoneCard } from './PassPhoneCard';

import type { Player } from '@/entities/player/types';
import { ProgressDots } from '@/shared/components/ProgressDots';

type AccentColor = 'green' | 'sky' | 'red' | 'orange' | 'blue' | 'purple' | 'yellow' | 'default';

export interface CardStyleResult {
  className?: string;
  style?: React.CSSProperties;
}

interface DistributionFlowProps {
  players: Player[];
  onFinish: () => void;
  /** Renders the inner content of the revealed card */
  renderCard: (player: Player, isLast: boolean, onNext: () => void) => React.ReactNode;
  /** Card container styling — can vary per player */
  getCardStyle?: (player: Player) => CardStyleResult;
  passInstruction?: string;
  passIcon?: LucideIcon;
  passAccentColor?: AccentColor;
  /** Tailwind class for ProgressDots active dot, e.g. "bg-premium-red" */
  activeColor?: string;
}

export const DistributionFlow: React.FC<DistributionFlowProps> = ({
  players,
  onFinish,
  renderCard,
  getCardStyle,
  passInstruction,
  passIcon,
  passAccentColor,
  activeColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLast = currentIndex === players.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentIndex((i) => i + 1);
      setIsRevealed(false);
    }
  };

  const cardMeta = getCardStyle?.(currentPlayer) ?? {};

  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto p-6 select-none min-h-screen">
      <ProgressDots
        count={players.length}
        current={currentIndex}
        activeColor={activeColor}
        className="mb-8"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              >
                <PassPhoneCard
                  playerName={currentPlayer.name}
                  instruction={passInstruction}
                  icon={passIcon}
                  accentColor={passAccentColor}
                  onClick={() => {
                    setIsRevealed(true);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className={`rounded-premium-2xl relative flex w-full flex-col overflow-hidden ${cardMeta.className ?? ''}`}
                style={cardMeta.style}
              >
                {renderCard(currentPlayer, isLast, handleNext)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
