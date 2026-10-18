import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { rgba } from '@/shared/theme/colors';

interface UrgencyVignetteProps {
  active: boolean;
}

/**
 * Красная пульсирующая виньетка по краям экрана — последние секунды раунда.
 * Родителю нужен `relative`; клики проходят насквозь.
 */
export const UrgencyVignette: React.FC<UrgencyVignetteProps> = ({ active }) => (
  <AnimatePresence>
    {active ? (
      <motion.div
        key="urgency"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, ${rgba('red', 0.24)} 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
    ) : null}
  </AnimatePresence>
);
