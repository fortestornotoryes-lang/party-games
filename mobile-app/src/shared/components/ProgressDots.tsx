import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

interface ProgressDotsProps {
  /** Общее количество шагов */
  count: number;
  /** Индекс текущего шага (0-based) */
  current: number;
  /** Tailwind-класс цвета активной точки (default: bg-premium-red) */
  activeColor?: string;
  /** Дополнительные классы обёртки */
  className?: string;
}

/**
 * Анимированные точки прогресса для пошаговых экранов (раздача ролей и т.п.).
 *
 * - Активная точка: ширина 24px, opacity 1
 * - Пройденная точка: ширина 6px, opacity 0.2
 * - Будущая точка: ширина 6px, opacity 0.35
 */
export const ProgressDots: React.FC<ProgressDotsProps> = ({
  count,
  current,
  activeColor = 'bg-premium-red',
  className,
}) => (
  <View className={`flex-row gap-2 ${className ?? ''}`}>
    {Array.from({ length: count }).map((_, i) => (
      <MotiView
        key={i}
        animate={{
          width: i === current ? 24 : 6,
          opacity: i < current ? 0.2 : i === current ? 1 : 0.35,
        }}
        transition={{ type: 'timing', duration: 300 }}
        className={`h-1.5 rounded-full ${i === current ? activeColor : 'bg-white/20'}`}
      />
    ))}
  </View>
);
