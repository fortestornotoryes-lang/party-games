import { MotiView } from 'moti';
import React from 'react';
import { Easing } from 'react-native-reanimated';
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
 *
 * duration:1000 + easing:linear — как веб-`transition-all duration-1000
 * ease-linear`, полоса плавно "утекает" между секундными тиками таймера
 * вместо резкого скачка ширины.
 */
export const TimerBar: React.FC<TimerBarProps> = ({ pct, color, className }) => (
  <View className={`h-1.5 w-full bg-white/10 ${className ?? ''}`}>
    <MotiView
      animate={{ width: `${pct}%`, backgroundColor: color }}
      transition={{ type: 'timing', duration: 1000, easing: Easing.linear }}
      style={{ height: '100%' }}
    />
  </View>
);
