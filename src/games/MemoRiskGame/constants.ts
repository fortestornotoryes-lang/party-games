import type {LucideIcon} from 'lucide-react';
import {Circle, Heart, Hexagon, Square, Star, Triangle} from 'lucide-react';

import {MemoRarity, MemoShape} from './types';

import {DIFFICULTY, type Difficulty, type GameTheme} from '@/types';

export interface MemoRiskDifficultyConfig {
    /** Поле gridSize × gridSize */
    gridSize: number;
    /** Сколько видов фигур в партии */
    shapeCount: number;
    /** Время на ход в режиме «На время» */
    turnSeconds: number;
    /** Открытий за ход в режиме «Ограниченные ходы» */
    flipLimit: number;
}

export const MEMO_RISK_DIFFICULTY_CONFIG: Record<Difficulty, MemoRiskDifficultyConfig> = {
    [DIFFICULTY.EASY]: {gridSize: 4, shapeCount: 4, turnSeconds: 20, flipLimit: 4},
    [DIFFICULTY.MEDIUM]: {gridSize: 5, shapeCount: 5, turnSeconds: 25, flipLimit: 5},
    [DIFFICULTY.HARD]: {gridSize: 6, shapeCount: 6, turnSeconds: 30, flipLimit: 6},
};

/** Размер колоды на партию (включая стартовое поле) */
export const DECK_SIZE = 100;

/** Супер-карт в колоде */
export const SUPER_CARDS_COUNT = 3;

/** Множитель супер-карты к очкам хода */
export const SUPER_MULTIPLIER = 2;

/** Стартовый уровень риска: столько целевых и столько опасных фигур в ходе */
export const INITIAL_ESCALATION = 1;

/** Пауза перед авто-передачей хода — игроки видят вердикт и открытые карты */
export const TURN_END_DELAY_MS = 2000;

export interface RarityMeta {
    points: number;
    /** Вес при генерации колоды (доли нормируются суммой) */
    weight: number;
    /** Классы рамки лица карты */
    border: string;
    /** Класс цвета текста ценности */
    text: string;
    /** Цвет свечения рамки для inline boxShadow (null — без свечения) */
    glowColor: GameTheme | null;
}

export const RARITY_META: Record<MemoRarity, RarityMeta> = {
    [MemoRarity.Common]: {
        points: 1,
        weight: 50,
        border: 'border-white/25',
        text: 'text-white/50',
        glowColor: null,
    },
    [MemoRarity.Uncommon]: {
        points: 5,
        weight: 27,
        border: 'border-premium-green/60',
        text: 'text-premium-green',
        glowColor: 'green',
    },
    [MemoRarity.Rare]: {
        points: 10,
        weight: 15,
        border: 'border-premium-sky/70',
        text: 'text-premium-sky',
        glowColor: 'sky',
    },
    [MemoRarity.Epic]: {
        points: 20,
        weight: 8,
        border: 'border-premium-purple/80',
        text: 'text-premium-purple',
        glowColor: 'purple',
    },
};

/** Порядок фигур: первые shapeCount участвуют в партии */
export const SHAPE_ORDER: MemoShape[] = [
    MemoShape.Circle,
    MemoShape.Square,
    MemoShape.Triangle,
    MemoShape.Star,
    MemoShape.Heart,
    MemoShape.Hexagon,
];

export const SHAPE_META: Record<MemoShape, {icon: LucideIcon; color: GameTheme}> = {
    [MemoShape.Circle]: {icon: Circle, color: 'sky'},
    [MemoShape.Square]: {icon: Square, color: 'green'},
    [MemoShape.Triangle]: {icon: Triangle, color: 'indigo'},
    [MemoShape.Star]: {icon: Star, color: 'red'},
    [MemoShape.Heart]: {icon: Heart, color: 'pink'},
    [MemoShape.Hexagon]: {icon: Hexagon, color: 'purple'},
};
