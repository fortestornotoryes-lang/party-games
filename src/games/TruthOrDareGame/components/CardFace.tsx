import { motion } from 'motion/react';
import React from 'react';

import { rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface CardFaceProps {
  text: string;
  accent: GameTheme;
}

/** Карточка с текстом вопроса / задания / штрафа в цвете типа */
export const CardFace: React.FC<CardFaceProps> = ({ text, accent }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
    className="rounded-premium-xl relative w-full overflow-hidden p-8 text-center"
    style={{
      background: `linear-gradient(145deg, ${rgba(accent, 0.1)} 0%, ${rgba(accent, 0.04)} 100%)`,
      border: `1.5px solid ${rgba(accent, 0.2)}`,
      boxShadow: `0 0 80px ${rgba(accent, 0.07)}`,
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)',
      }}
    />
    <p className="relative z-10 text-xl leading-snug font-black text-white">{text}</p>
  </motion.div>
);
