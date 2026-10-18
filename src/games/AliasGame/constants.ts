import type { TeamColor } from './types';

import type { ButtonVariant } from '@/shared/components/PrimaryButton';
import type { TypoColor } from '@/shared/components/Typography';
import type { Difficulty } from '@/shared/types';

export const ALIAS_DIFFICULTY_CONFIG: Record<Difficulty, { roundTime: number }> = {
  easy: { roundTime: 90 },
  medium: { roundTime: 60 },
  hard: { roundTime: 40 },
};
export const WIN_SCORE = 30;
export const TROPHY_THRESHOLD = 20;

/** Ключ перевода названия команды по цвету (alias.<ключ>). */
export const TEAM_NAME_KEY: Record<TeamColor, string> = {
  red: 'teamRed',
  blue: 'teamBlue',
  green: 'teamGreen',
  yellow: 'teamYellow',
};

export const MIN_TEAMS = 2;
export const MAX_TEAMS = 4;
/** Минимум в команде: один объясняет, остальные угадывают. */
export const MIN_TEAM_SIZE = 2;

// Tailwind видит только литеральные классы — динамически собирать `text-premium-${c}` нельзя.
export const TEAM_STYLES: Record<
  TeamColor,
  {
    typo: TypoColor;
    button: ButtonVariant;
    text: string;
    card: string;
    chip: string;
    glow: string;
    confetti: string;
  }
> = {
  red: {
    typo: 'red',
    button: 'red',
    text: 'text-premium-red',
    card: 'bg-premium-red/[0.07] border-premium-red/20',
    chip: 'bg-premium-red/10 border-premium-red/25 text-premium-red',
    glow: '0 0 60px rgba(255,46,77,0.12)',
    confetti: '#FF2E4D',
  },
  blue: {
    typo: 'blue',
    button: 'blue',
    text: 'text-premium-blue',
    card: 'bg-premium-blue/[0.07] border-premium-blue/20',
    chip: 'bg-premium-blue/10 border-premium-blue/25 text-premium-blue',
    glow: '0 0 60px rgba(63,123,255,0.12)',
    confetti: '#3F7BFF',
  },
  green: {
    typo: 'green',
    button: 'emerald',
    text: 'text-premium-green',
    card: 'bg-premium-green/[0.07] border-premium-green/20',
    chip: 'bg-premium-green/10 border-premium-green/25 text-premium-green',
    glow: '0 0 60px rgba(0,216,138,0.12)',
    confetti: '#00D88A',
  },
  yellow: {
    typo: 'yellow',
    button: 'white',
    text: 'text-premium-yellow',
    card: 'bg-premium-yellow/[0.07] border-premium-yellow/20',
    chip: 'bg-premium-yellow/10 border-premium-yellow/25 text-premium-yellow',
    glow: '0 0 60px rgba(255,204,31,0.12)',
    confetti: '#FFCC1F',
  },
};
