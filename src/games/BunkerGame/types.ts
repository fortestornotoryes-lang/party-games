import type {Difficulty} from '@/shared/types';

export enum BunkerPhase {
    Briefing = 'briefing',
    DictatorReveal = 'dictator_reveal',
    RevealPass = 'reveal_pass',
    Discussion = 'discussion',
    Voting = 'voting',
    Tribunal = 'tribunal',
    FullReveal = 'full_reveal',
    SurvivalSim = 'survival_sim',
}

export type ResourceKey = 'food' | 'water' | 'medicine' | 'energy' | 'morale';

export type DifficultyLevel = Difficulty;

export type ResourceBonus = Partial<Record<ResourceKey, number>>;

export interface AttributeEntry {
    name: string;
    emoji: string;
    bonus: ResourceBonus;
    tier?: 'S' | 'A' | 'B' | 'C';
    isPositive?: boolean;
}

export type TraitKey = 'health' | 'hobby' | 'phobia' | 'trait' | 'item' | 'specialFact';

export interface BunkerCharacter {
    playerName: string;
    age: number;
    gender: 'Мужчина' | 'Женщина';
    profession: AttributeEntry;
    health: AttributeEntry;
    hobby: AttributeEntry;
    phobia: AttributeEntry;
    trait: AttributeEntry;
    item: AttributeEntry;
    specialFact: AttributeEntry;
    /**
     * Shuffled order of trait keys to reveal in rounds 2, 3, 4, 5…
     * revealOrder[0] → round 2, revealOrder[1] → round 3, etc.
     * Length = TOTAL_REVEAL_ROUNDS - 1
     */
    revealOrder: readonly TraitKey[];
}

export interface CatastropheScenario {
    title: string;
    emoji: string;
    description: string;
    resourcePenalty: ResourceBonus;
}

export interface SurvivalEvent {
    title: string;
    description: string;
    emoji: string;
    effect: ResourceBonus;
    positive: boolean;
}

export interface BunkerResources {
    food: number;
    water: number;
    medicine: number;
    energy: number;
    morale: number;
}

export type SurvivalOutcome = 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';

export const TRAIT_LABELS: Record<string, string> = {
    profession: 'Профессия',
    health: 'Здоровье',
    hobby: 'Хобби',
    phobia: 'Фобия',
    trait: 'Черта характера',
    item: 'Предмет',
    specialFact: 'Особый факт',
};

export const ALL_TRAIT_KEYS: readonly TraitKey[] = [
    'health',
    'hobby',
    'phobia',
    'trait',
    'item',
    'specialFact',
];

export interface CalculateSurvivalOptions {
    revealedTraitsOnly?: boolean;
    totalRounds?: number;
    difficulty?: DifficultyLevel;
}