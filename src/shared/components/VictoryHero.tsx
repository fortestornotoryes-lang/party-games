import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { TypoColor } from '@/shared/components/Typography';
import { Typography } from '@/shared/components/Typography';
import { rgba } from '@/shared/theme/colors';
import { SPRING } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

/** Искры, разлетающиеся от кубка */
const SPARKS_COUNT = 10;
const SPARKS_RADIUS = 120;
const SPARKS = Array.from({ length: SPARKS_COUNT }, (_, i) => {
  const angle = (i / SPARKS_COUNT) * Math.PI * 2;
  return { x: Math.cos(angle) * SPARKS_RADIUS, y: Math.sin(angle) * SPARKS_RADIUS };
});

/** Момент «приземления» кубка — от него отсчитываются искры и текст */
const LANDING_DELAY = 0.35;

interface VictoryHeroProps {
  icon: LucideIcon;
  /** Цвет свечения, лучей и искр */
  color: GameTheme;
  /** Tailwind-класс цвета иконки */
  iconClassName: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  subtitleColor?: TypoColor;
}

/**
 * Победный экран: кубок падает с отскоком, за ним вращаются лучи, разлетаются искры,
 * затем «впечатывается» заголовок.
 */
export const VictoryHero: React.FC<VictoryHeroProps> = ({
  icon: Icon,
  color,
  iconClassName,
  title,
  subtitle,
  subtitleColor = 'muted',
}) => (
  <div className="relative flex flex-col items-center">
    {/* Вращающиеся лучи: появление — motion, бесконечное вращение — CSS (композитор) */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-12 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.6, delay: LANDING_DELAY },
        scale: { ...SPRING.soft, delay: LANDING_DELAY },
      }}
    >
      <div
        className="animate-spin-slow h-full w-full rounded-full"
        style={{
          background: `repeating-conic-gradient(from 0deg, ${rgba(color, 0.22)} 0deg 9deg, transparent 9deg 30deg)`,
          maskImage: 'radial-gradient(circle, black 15%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle, black 15%, transparent 68%)',
        }}
      />
    </motion.div>

    {/* Пульсирующее свечение */}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-12 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ backgroundColor: rgba(color, 0.35) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: LANDING_DELAY }}
    />

    {/* Искры */}
    {SPARKS.map((spark, i) => (
      <motion.span
        key={i}
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-2 w-2 rounded-full"
        style={{ backgroundColor: rgba(color, 1), boxShadow: `0 0 12px ${rgba(color, 0.9)}` }}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
        animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0], scale: [0.4, 1.2, 0.2] }}
        transition={{ duration: 0.9, delay: LANDING_DELAY + 0.05, ease: 'easeOut' }}
      />
    ))}

    {/* Кубок: падение с отскоком, затем лёгкое парение */}
    <motion.div
      className="relative mb-5"
      initial={{ y: -160, scale: 0.4, rotate: -25, opacity: 0 }}
      animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, mass: 0.9 }}
    >
      <div className="animate-bob">
        <Icon
          className={`h-24 w-24 ${iconClassName}`}
          style={{ filter: `drop-shadow(0 0 24px ${rgba(color, 0.6)})` }}
        />
      </div>
    </motion.div>

    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 1.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...SPRING.pop, delay: LANDING_DELAY + 0.1 }}
    >
      <Typography.Display size="xl" align="center" className="mb-2">
        {title}
      </Typography.Display>
    </motion.div>

    {!!subtitle && (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: LANDING_DELAY + 0.35 }}
      >
        <Typography.Label size="md" color={subtitleColor} align="center">
          {subtitle}
        </Typography.Label>
      </motion.div>
    )}
  </div>
);
