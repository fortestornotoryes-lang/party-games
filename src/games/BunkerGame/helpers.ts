import type {AttributeEntry, BunkerCharacter, TraitKey} from './types';
import {ALL_TRAIT_KEYS, TRAIT_LABELS} from './types';
import type {Step} from './constants';
import {STEP_ORDER} from './constants';

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
): {key: TraitKey; label: string; entry: AttributeEntry}[] {
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
): {traitKey: string; label: string; entry: AttributeEntry} | null {
    if (round === 1)
        return {traitKey: 'profession', label: TRAIT_LABELS.profession, entry: char.profession};
    const key = char.revealOrder[round - 2];
    if (!key) return null;
    return {traitKey: key, label: TRAIT_LABELS[key], entry: char[key]};
}
