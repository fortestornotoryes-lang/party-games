import type {TeamColor} from './types';

import type {ButtonVariant} from '@/shared/components/PrimaryButton';
import type {TypoColor} from '@/shared/components/Typography';
import type {Difficulty} from '@/shared/types';

/** Награда и время на объяснение по сложности выбранного слова. */
export const CROCODILE_LEVELS: Record<Difficulty, { points: number; time: number }> = {
    easy: {points: 1, time: 60},
    medium: {points: 2, time: 90},
    hard: {points: 3, time: 120},
};

/** Порядок карточек выбора: от лёгкого к сложному. */
export const LEVEL_ORDER: readonly Difficulty[] = ['easy', 'medium', 'hard'];

/** Литеральные классы (Tailwind не видит динамически собранные) для карточек сложности. */
export const LEVEL_STYLES: Record<Difficulty, { card: string; chip: string; text: string }> = {
    easy: {
        card: 'bg-premium-green/[0.07] border-premium-green/20 active:bg-premium-green/14',
        chip: 'bg-premium-green/10 border-premium-green/25 text-premium-green',
        text: 'text-premium-green',
    },
    medium: {
        card: 'bg-premium-yellow/[0.07] border-premium-yellow/20 active:bg-premium-yellow/14',
        chip: 'bg-premium-yellow/10 border-premium-yellow/25 text-premium-yellow',
        text: 'text-premium-yellow',
    },
    hard: {
        card: 'bg-premium-red/[0.07] border-premium-red/20 active:bg-premium-red/14',
        chip: 'bg-premium-red/10 border-premium-red/25 text-premium-red',
        text: 'text-premium-red',
    },
};

/** Цели партии (до скольки очков играем). */
export const TARGET_SCORES = [10, 15, 20, 30, 50, 75, 100] as const;
export const DEFAULT_TARGET_SCORE = 15;

/** Штраф команде за замену всех трёх слов. */
export const REPLACE_PENALTY = 1;

/** Последние секунды раунда: тик становится чаще по тону и таймер краснеет. */
export const URGENT_SECONDS = 10;

/** Цвета конфетти при угаданном слове (canvas-confetti принимает только HEX). */
export const GUESSED_CONFETTI = ['#84CC16', '#00D88A', '#ffffff'];

/** Ключ used-хранилища слов: у каждой сложности свой пул, сброс одного не трогает остальные. */
export const poolGameId = (gameId: string, difficulty: Difficulty): string =>
    `${gameId}_${difficulty}`;

/** Ключ перевода названия команды по цвету (crocodile.<ключ>). */
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
