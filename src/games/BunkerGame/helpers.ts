import type {
    Step} from './constants';
import {
    BUNKER_BASE_RESOURCES,
    BUNKER_DIFFICULTY_OFFSET,
    BUNKER_DIFFICULTY_SCALE,
    RESOURCE_KEYS_CALC,
    STEP_ORDER,
    TRAITS_TO_REVEAL
} from './constants';
import type {
    AttributeEntry,
    BunkerCharacter,
    BunkerResources,
    CalculateSurvivalOptions,
    ResourceBonus,
    ResourceKey,
    TraitKey
} from './types';
import {
    ALL_TRAIT_KEYS,
    type CatastropheScenario,
    type SurvivalEvent,
    TRAIT_LABELS
} from './types';

import {PROFESSIONS,HOBBIES,ITEMS,TRAITS,PHOBIAS,CATASTROPHE_SCENARIOS,HEALTH_CONDITIONS,SURVIVAL_EVENTS,SPECIAL_FACTS} from "@/games/BunkerGame/contents";
import {DIFFICULTY} from "@/types";
import {pickRandom, shuffle} from "@/utils/random.ts";


export function barColor(val: number): string {
    if (val >= 60) return '#00D88A';
    if (val >= 35) return '#FFCC1F';
    if (val >= 15) return '#FF8A1F';
    return '#FF2E4D';
}

export const atLeast = (current: Step, min: Step): boolean =>
    STEP_ORDER.indexOf(current) >= STEP_ORDER.indexOf(min);

export function getHiddenTraits(
    char: BunkerCharacter,
    totalRounds: number
): { key: TraitKey; label: string; entry: AttributeEntry }[] {
    const revealedKeys = new Set<TraitKey>(char.revealOrder.slice(0, totalRounds - 1));
    return ALL_TRAIT_KEYS.filter((k) => !revealedKeys.has(k)).map((k) => ({
        key: k,
        label: TRAIT_LABELS[k],
        entry: char[k],
    }));
}

export function getRevealedTrait(
    char: BunkerCharacter,
    round: number
): { traitKey: string; label: string; entry: AttributeEntry } | null {
    if (round === 1)
        return {traitKey: 'profession', label: TRAIT_LABELS.profession, entry: char.profession};
    const key = char.revealOrder[round - 2];
    if (!key) return null;
    return {traitKey: key, label: TRAIT_LABELS[key], entry: char[key]};
}

export function randomAge(): number {
    const ranges = [
        {min: 18, max: 25, weight: 30},
        {min: 25, max: 35, weight: 50},
        {min: 35, max: 45, weight: 40},
        {min: 45, max: 60, weight: 30},
        {min: 60, max: 80, weight: 10},
    ];
    const total = ranges.reduce((s, r) => s + r.weight, 0);
    let rnd = Math.random() * total;
    for (const {min, max, weight} of ranges) {
        rnd -= weight;
        if (rnd <= 0) return Math.floor(min + Math.random() * (max - min));
    }
    return 35;
}

export function generateCharacter(playerName: string): BunkerCharacter {
    const revealOrder = shuffle<TraitKey>([...ALL_TRAIT_KEYS]).slice(0, TRAITS_TO_REVEAL);

    return {
        playerName,
        age: randomAge(),
        gender: Math.random() > 0.5 ? 'Мужчина' : 'Женщина',
        profession: pickRandom(PROFESSIONS),
        health: pickRandom(HEALTH_CONDITIONS),
        hobby: pickRandom(HOBBIES),
        phobia: pickRandom(PHOBIAS),
        trait: pickRandom(TRAITS),
        item: pickRandom(ITEMS),
        specialFact: pickRandom(SPECIAL_FACTS),
        revealOrder,
    };
}

/** Resource bonus derived from age bracket. Applied scaled alongside attribute bonuses. */
export function getAgeBonuses(age: number): ResourceBonus {
    if (age <= 25) return {energy: 5, morale: 5, medicine: -1, water: 3};
    if (age <= 35) return {energy: 3, food: 5, morale: 2};
    if (age <= 45) return {food: 3, water: 2, morale: 3, energy: 1};
    if (age <= 55) return {medicine: 6, morale: 4, energy: -13};
    return {medicine: 5, morale: 7, energy: -25, food: 2};
}

export function calculateSurvival(
    bunkerTeam: BunkerCharacter[],
    scenario: CatastropheScenario,
    events: SurvivalEvent[],
    options?: CalculateSurvivalOptions
): { resources: BunkerResources; outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat' } {
    const base: BunkerResources = {...BUNKER_BASE_RESOURCES};

    // Apply difficulty base offset
    const diffOffset = BUNKER_DIFFICULTY_OFFSET[options?.difficulty ?? DIFFICULTY.MEDIUM];
    if (diffOffset !== 0) {
        RESOURCE_KEYS_CALC.forEach(k => {
            base[k] += diffOffset;
        });
    }

    // Apply difficulty-scaled scenario penalty
    const scenarioScale = BUNKER_DIFFICULTY_SCALE[options?.difficulty ?? DIFFICULTY.MEDIUM];
    (Object.entries(scenario.resourcePenalty) as [ResourceKey, number][])
        .forEach(([k, v]) => {
            base[k] += Math.round(v * scenarioScale);
        });

    // Apply team bonuses (scaled by team size to avoid stacking)
    const teamScale = Math.max(0.4, 1 - (bunkerTeam.length - 2) * 0.08);
    for (const char of bunkerTeam) {
        let attrs: AttributeEntry[];
        if (options?.revealedTraitsOnly) {
            const revealed = new Set<string>(['profession', ...char.revealOrder.slice(0, (options.totalRounds ?? 0) - 1)]);
            attrs = (
                [
                    ['profession', char.profession],
                    ['health', char.health],
                    ['hobby', char.hobby],
                    ['phobia', char.phobia],
                    ['trait', char.trait],
                    ['item', char.item],
                    ['specialFact', char.specialFact],
                ] as [string, AttributeEntry][]
            ).filter(([k]) => revealed.has(k)).map(([, a]) => a);
        } else {
            attrs = [char.profession, char.health, char.hobby, char.trait, char.item, char.specialFact, char.phobia];
        }
        for (const attr of attrs) {
            applyBonusScaled(base, attr.bonus, teamScale);
        }
        applyBonusScaled(base, getAgeBonuses(char.age), teamScale);
    }

    // Apply random events
    for (const event of events) {
        applyBonus(base, event.effect);
    }

    // Clamp to [0, 100]
    (Object.keys(base) as ResourceKey[]).forEach((k) => {
        base[k] = Math.max(0, Math.min(100, Math.round(base[k])));
    });

    // Determine outcome
    const values = Object.values(base);
    const criticalCount = values.filter((v) => v <= 0).length;
    const lowCount = values.filter((v) => v < 25).length;
    const goodCount = values.filter((v) => v >= 40).length;

    let outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';
    if (criticalCount >= 1) {
        outcome = 'defeat';
    } else if (lowCount >= 2) {
        outcome = 'pyrrhic';
    } else if (goodCount >= 5) {
        outcome = 'full_victory';
    } else {
        outcome = 'partial';
    }

    return {resources: base, outcome};
}

/** Returns the raw sum of all attribute resource bonuses for a single character. */
export function getRevealedResourceContribution(char: BunkerCharacter, upToRound: number): BunkerResources {
    const result: BunkerResources = {food: 0, water: 0, medicine: 0, energy: 0, morale: 0};
    const revealed = new Set<string>(['profession', ...char.revealOrder.slice(0, upToRound - 1)]);
    const allAttrs: [string, AttributeEntry][] = [
        ['profession', char.profession], ['health', char.health],
        ['hobby', char.hobby], ['phobia', char.phobia],
        ['trait', char.trait], ['item', char.item],
        ['specialFact', char.specialFact],
    ];
    for (const [key, attr] of allAttrs) {
        if (revealed.has(key)) {
            (Object.entries(attr.bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
                result[k] += v;
            });
        }
    }
    return result;
}

export function getPlayerResourceContribution(char: BunkerCharacter): BunkerResources {
    const result: BunkerResources = {food: 0, water: 0, medicine: 0, energy: 0, morale: 0};
    const attrs = [char.profession, char.health, char.hobby, char.trait, char.item, char.specialFact, char.phobia];
    for (const attr of attrs) {
        (Object.entries(attr.bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
            result[k] += v;
        });
    }
    return result;
}

export function applyBonus(res: BunkerResources, bonus: Partial<BunkerResources>): void {
    (Object.entries(bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
        res[k] += v;
    });
}

export function applyBonusScaled(
    res: BunkerResources,
    bonus: Partial<BunkerResources>,
    scale: number
): void {
    (Object.entries(bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
        res[k] += Math.round(v * scale);
    });
}