import type {Difficulty} from "@/shared/types";

export const ALIAS_DIFFICULTY_CONFIG: Record<Difficulty, { roundTime: number }> = {
    easy: {roundTime: 90},
    medium: {roundTime: 60},
    hard: {roundTime: 40},
};
export const WIN_SCORE = 30;
export const TROPHY_THRESHOLD = 20;