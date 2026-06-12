import type { Difficulty } from '@/shared/types';

export interface DifficultySetting {
  readonly emoji: string;
  readonly drawTime: number;
  readonly guessTime: number;
  readonly text: string;
  readonly bg: string;
  readonly border: string;
}

/**
 * UI visual mapping and timer settings per difficulty level.
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultySetting> = {
  easy: {
    emoji: '🌱',
    drawTime: 90,
    guessTime: 45,
    text: 'text-premium-green',
    bg: 'bg-premium-green/10',
    border: 'border-premium-green/30',
  },
  medium: {
    emoji: '🔥',
    drawTime: 60,
    guessTime: 30,
    text: 'text-premium-orange',
    bg: 'bg-premium-orange/10',
    border: 'border-premium-orange/30',
  },
  hard: {
    emoji: '💀',
    drawTime: 45,
    guessTime: 25,
    text: 'text-premium-red',
    bg: 'bg-premium-red/10',
    border: 'border-premium-red/30',
  },
} as const;
