import { AlertTriangle, Skull, Trophy, Zap } from 'lucide-react';
import type { CSSProperties, FC } from 'react';

import type { BunkerResources, DifficultyLevel, ResourceKey, SurvivalOutcome } from './types';
import { ALL_TRAIT_KEYS } from './types';

export type Step = 'team' | 'events' | 'resources' | 'results';
export const STEP_ORDER: Step[] = ['team', 'events', 'resources', 'results'];

export const CAPACITY_PCT: Record<string, number> = { easy: 0.8, medium: 0.6, hard: 0.4 };

export const OUTCOME_CONFIG: Record<
  SurvivalOutcome,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    shadow: string;
    emoji: string;
    icon: FC<{ className?: string; style?: CSSProperties }>;
  }
> = {
  full_victory: {
    label: 'Победа',
    color: '#00D88A',
    bgColor: 'rgba(0,216,138,0.1)',
    borderColor: 'rgba(0,216,138,0.5)',
    shadow: '0 0 80px rgba(0,216,138,0.3)',
    emoji: '🏆',
    icon: Trophy,
  },
  partial: {
    label: 'Частичная',
    color: '#FFCC1F',
    bgColor: 'rgba(255,204,31,0.1)',
    borderColor: 'rgba(255,204,31,0.4)',
    shadow: '0 0 60px rgba(255,204,31,0.2)',
    emoji: '⚠️',
    icon: AlertTriangle,
  },
  pyrrhic: {
    label: 'Пиррова',
    color: '#FF8A1F',
    bgColor: 'rgba(255,138,31,0.1)',
    borderColor: 'rgba(255,138,31,0.4)',
    shadow: '0 0 60px rgba(255,138,31,0.2)',
    emoji: '💀',
    icon: Zap,
  },
  defeat: {
    label: 'Поражение',
    color: '#FF2E4D',
    bgColor: 'rgba(255,46,77,0.1)',
    borderColor: 'rgba(255,46,77,0.45)',
    shadow: '0 0 80px rgba(255,46,77,0.3)',
    emoji: '☠️',
    icon: Skull,
  },
};

export const OUTCOME_COLOR_MAP: Record<SurvivalOutcome, 'green' | 'yellow' | 'orange' | 'red'> = {
  full_victory: 'green',
  partial: 'yellow',
  pyrrhic: 'orange',
  defeat: 'red',
};
export const BUNKER_BASE_RESOURCES: BunkerResources = {
  food: 45,
  water: 50,
  medicine: 50,
  energy: 65,
  morale: 65,
};
export const BUNKER_DIFFICULTY_OFFSET: Record<DifficultyLevel, number> = {
  easy: 10,
  medium: 0,
  hard: -8,
};
export const BUNKER_DIFFICULTY_SCALE: Record<DifficultyLevel, number> = {
  easy: 0.65,
  medium: 1.0,
  hard: 1.35,
};
export const RESOURCE_KEYS_CALC: ResourceKey[] = ['food', 'water', 'medicine', 'energy', 'morale'];
export const RESOURCE_META: { key: keyof BunkerResources; emoji: string; label: string }[] = [
  { key: 'food', emoji: '🍎', label: 'Еда' },
  { key: 'water', emoji: '💧', label: 'Вода' },
  { key: 'medicine', emoji: '💊', label: 'Медицина' },
  { key: 'energy', emoji: '⚡', label: 'Энергия' },
  { key: 'morale', emoji: '🧠', label: 'Мораль' },
];
export const BUNKER_MODES = {
  CLASSIC: 'classic',
  DICTATOR: 'dictator',
  TRIBUNAL: 'tribunal',
} as const; // How many traits to reveal after round 1 (rounds 2…N).
// Must be ≤ ALL_TRAIT_KEYS.length (6). Currently 4 → 5 total rounds.
export const TRAITS_TO_REVEAL = ALL_TRAIT_KEYS.length;
