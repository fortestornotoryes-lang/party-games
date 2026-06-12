import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { RARITY_META, SHAPE_META } from '../constants';
import { MemoCardState, type MemoCard } from '../types';

import { getTheme, rgba } from '@/shared/theme/colors';

interface MemoCardViewProps {
  card: MemoCard;
  /** Позиция на поле — передаётся в onFlip */
  slot: number;
  /** Открытая в этом ходу опасная фигура — красная подсветка */
  isDangerRevealed: boolean;
  disabled: boolean;
  onFlip: (slot: number) => void;
}

export const MemoCardView: React.FC<MemoCardViewProps> = ({
  card,
  slot,
  isDangerRevealed,
  disabled,
  onFlip,
}) => {
  const faceUp = card.state !== MemoCardState.Hidden;
  const meta = SHAPE_META[card.shape];
  const ShapeIcon = meta.icon;
  const tokens = getTheme(meta.color);
  const rarity = RARITY_META[card.rarity];

  const faceShadow = isDangerRevealed
    ? `0 0 18px ${rgba('red', 0.55)}, inset 0 0 12px ${rgba('red', 0.3)}`
    : card.isSuper
      ? `0 0 14px ${rgba('yellow', 0.4)}`
      : rarity.glowColor
        ? `0 0 12px ${rgba(rarity.glowColor, 0.35)}`
        : undefined;

  return (
    <button
      onClick={() => {
        onFlip(slot);
      }}
      disabled={disabled || faceUp}
      className="relative aspect-square select-none"
      style={{ perspective: '600px', touchAction: 'manipulation' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Рубашка */}
        <div
          className="rounded-premium-sm border-premium-pink/15 absolute inset-0 flex items-center justify-center border bg-white/5"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-lg font-black text-white/15">?</span>
        </div>

        {/* Лицо: рамка и ценность — по редкости */}
        <div
          className={`rounded-premium-sm absolute inset-0 flex flex-col items-center justify-center gap-0.5 border-2 ${
            card.isSuper
              ? 'border-premium-yellow/80 bg-premium-yellow/10'
              : `${rarity.border} ${tokens.bg10}`
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: faceShadow,
          }}
        >
          {card.isSuper ? (
            <>
              <Zap className="text-premium-yellow size-10" fill="currentColor" fillOpacity={0.3} />
              <span className="text-label text-premium-yellow leading-none font-black">×2</span>
            </>
          ) : (
            <>
              <ShapeIcon
                className={`size-10 ${tokens.text}`}
                fill="currentColor"
                fillOpacity={0.25}
              />
              <span className={`text- leading-none font-black tabular-nums ${rarity.text}`}>
                +{rarity.points}
              </span>
            </>
          )}
        </div>
      </motion.div>
    </button>
  );
};
