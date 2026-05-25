import React from 'react';

interface TimerBarProps {
  /** Процент оставшегося времени (0–100) */
  pct: number;
  /** CSS-цвет полосы (hex, rgba, или CSS-переменная) */
  color: string;
  /** Дополнительные Tailwind-классы для обёртки */
  className?: string;
}

/**
 * Тонкая полоса прогресса таймера — вверху игрового экрана.
 * Используется в PlayingPhase игр с раундовым таймером.
 *
 * @example
 * const pct = (timeLeft / cardTimer) * 100;
 * const color = pct > 50 ? '#22c55e' : pct > 25 ? '#eab308' : '#ef4444';
 * <TimerBar pct={pct} color={color} />
 */
export const TimerBar: React.FC<TimerBarProps> = ({ pct, color, className = '' }) => (
  <div className={`h-1.5 w-full bg-white/10 ${className}`}>
    <div
      className="h-full transition-all duration-1000 ease-linear"
      style={{ width: `${pct}%`, backgroundColor: color }}
    />
  </div>
);
