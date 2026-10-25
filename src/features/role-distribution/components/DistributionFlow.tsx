import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import type { Player } from '@/entities/player/types';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { ProgressDots } from '@/shared/components/ProgressDots';
import type { GameTheme } from '@/shared/types';

export interface CardStyleResult {
  className?: string;
  style?: React.CSSProperties;
  /** Карточка рисует себя сама (SecretWordCard) — без рамки и overflow-hidden обёртки */
  bare?: boolean;
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
  passAccentColor?: GameTheme;
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
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-y-auto p-6 select-none">
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
                  deckDepth={Math.min(2, players.length - currentIndex - 1)}
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
                className={
                  cardMeta.bare
                    ? 'w-full'
                    : `rounded-premium-2xl relative flex w-full flex-col overflow-hidden ${cardMeta.className ?? ''}`
                }
                style={cardMeta.bare ? undefined : cardMeta.style}
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
