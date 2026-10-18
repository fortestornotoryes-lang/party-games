import { motion } from 'motion/react';
import React from 'react';

import { SPRING } from '@/shared/theme/motion';

interface FlipCardProps {
  /** Лицевая сторона — открывается после переворота */
  front: React.ReactNode;
  /** Рубашка — видна до переворота */
  back: React.ReactNode;
  /** Через сколько секунд после монтирования перевернуть, с */
  revealDelay?: number;
  onRevealed?: () => void;
  className?: string;
}

/**
 * 3D-карточка, которая монтируется рубашкой вверх и переворачивается лицом.
 * Обе стороны лежат в одной grid-ячейке — высота карточки = высоте большей стороны.
 * Внутри не использовать `.glass-card`: backdrop-filter ломает preserve-3d.
 */
export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  revealDelay = 0,
  onRevealed,
  className,
}) => (
  <div className={`perspective-distant ${className ?? ''}`}>
    <motion.div
      className="grid transform-3d"
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ ...SPRING.flip, delay: revealDelay }}
      onAnimationComplete={onRevealed}
    >
      <div className="[grid-area:1/1] backface-hidden">{front}</div>
      <div className="rotate-y-180 [grid-area:1/1] backface-hidden">{back}</div>
    </motion.div>
  </div>
);
