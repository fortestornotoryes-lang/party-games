import type {LocationInfo} from "@/constants/spyHuntContent.ts";
import { LOCATIONS_DATA} from "@/constants/spyHuntContent.ts";
import type {Difficulty} from "@/types.ts";

export const SPY_HUNT_ROLE_IDS = {
    SPY: 'Шпион',
    TRAITOR: 'Предатель',
    PLAYER: 'Игрок',
} as const;
export const SPY_HUNT_MODES = {
    CLASSIC: 'classic',
    DOUBLE_AGENT: 'double_agent',
    MOLE: 'mole',
} as const;
export const LOCATIONS: readonly string[] = LOCATIONS_DATA.map((l) => l.name);
export const LOCATIONS_BY_DIFFICULTY: Record<Difficulty, readonly LocationInfo[]> = {
    easy: LOCATIONS_DATA.filter((l) => l.difficulty === 'easy'),
    medium: LOCATIONS_DATA.filter((l) => l.difficulty === 'medium'),
    hard: LOCATIONS_DATA.filter((l) => l.difficulty === 'hard'),
} as const;
export const GAME_DURATION_BY_DIFFICULTY: Record<Difficulty, number> = {
    easy: 600,
    medium: 480,
    hard: 300,
} as const;
export const QUESTION_IDEAS: readonly string[] = [
    'Как ты сегодня одет?',
    'Какую еду здесь обычно подают?',
    'Тебе здесь комфортно?',
    'Ты здесь часто бываешь?',
    'Что ты делал последние полчаса?',
    'Тебе нравится твоя работа здесь?',
    'Много ли вокруг тебя металлических предметов?',
    'Какое сейчас время суток за твоим окном?',
    'Нужно ли тебе специальное разрешение, чтобы находиться здесь?',
] as const;