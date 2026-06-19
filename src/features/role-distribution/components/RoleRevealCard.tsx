import { motion } from 'motion/react';
import React from 'react';

interface RoleRevealCardProps {
  /** Классы градиентной подложки (без `absolute inset-0`), напр. `from-premium-red/[0.20] ... bg-gradient-to-b to-black/70`. */
  gradientClassName: string;
  /** Позиция/прозрачность верхнего свечения, напр. `-top-24 opacity-50`. */
  glowClassName: string;
  /** Цвет верхнего свечения (CSS background), обычно `rgba(...)`. */
  glowColor: string;
  /** Содержимое карточки роли (шапка/тело/кнопка) — специфично для каждой игры. */
  children: React.ReactNode;
}

/**
 * Общий каркас раскрытой карточки роли для экранов раздачи (`DistributionFlow.renderCard`):
 * градиентная подложка + верхнее свечение + контейнер контента.
 * Типографику и содержимое ролей каждая игра передаёт через `children`.
 */
export const RoleRevealCard: React.FC<RoleRevealCardProps> = ({
  gradientClassName,
  glowClassName,
  glowColor,
  children,
}) => (
  <>
    {/* Gradient bg */}
    <div className={`absolute inset-0 ${gradientClassName}`} />

    {/* Top glow */}
    <div
      className={`pointer-events-none absolute left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${glowClassName}`}
      style={{ background: glowColor }}
    />

    <div className="relative z-10 flex flex-1 flex-col items-center p-7 text-center">{children}</div>
  </>
);

interface RoleRevealPanelProps {
  children: React.ReactNode;
}

/** Анимированная панель одной роли внутри `RoleRevealCard` (шапка / тело / кнопка). */
export const RoleRevealPanel: React.FC<RoleRevealPanelProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex w-full flex-1 flex-col items-center justify-between"
  >
    {children}
  </motion.div>
);

interface RoleRevealButtonProps {
  onClick: () => void;
  /** Цветовые классы (фон + текст), напр. `bg-premium-green text-white`. */
  colorClassName: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/** Кнопка «дальше / начать» с общими стилями карточки роли. */
export const RoleRevealButton: React.FC<RoleRevealButtonProps> = ({
  onClick,
  colorClassName,
  style,
  children,
}) => (
  <button
    onClick={onClick}
    className={`rounded-premium-md w-full py-4 font-black tracking-[0.2em] uppercase transition-transform active:scale-95 ${colorClassName}`}
    style={style}
  >
    {children}
  </button>
);
