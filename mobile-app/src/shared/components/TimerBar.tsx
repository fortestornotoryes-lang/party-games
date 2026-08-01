import React from 'react';
import { View } from 'react-native';

interface TimerBarProps {
  /** Процент оставшегося времени (0–100) */
  pct: number;
  /** Цвет полосы (hex/rgba) */
  color: string;
  /** Дополнительные Tailwind-классы для обёртки */
  className?: string;
}

/**
 * Тонкая полоса прогресса таймера — вверху игрового экрана.
 * Используется в PlayingPhase игр с раундовым таймером.
 */
export const TimerBar: React.FC<TimerBarProps> = ({ pct, color, className }) => (
  <View className={`h-1.5 w-full bg-white/10 ${className ?? ''}`}>
    <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color }} />
  </View>
);
