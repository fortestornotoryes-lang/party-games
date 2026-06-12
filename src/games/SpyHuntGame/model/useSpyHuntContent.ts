import type {SpyDifficulty} from '@/constants/spyHuntContent';
import {GameKey} from '@/entities/game/types';
import {LOCATIONS_BY_DIFFICULTY} from "@/games/SpyHuntGame/constants.ts";
import {pickRandom} from '@/shared/helpers/random';
import {storageService} from '@/shared/services/storageService';
import {DIFFICULTY} from '@/shared/types';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useSpyHuntContent(difficulty: string) {
    const defaultRoles = [
        'Агент',
        'Специалист',
        'Наблюдатель',
        'Сотрудник',
        'Гость',
        'Персонал',
        'Охранник',
    ];
    const diffKey =
        (difficulty as SpyDifficulty) in LOCATIONS_BY_DIFFICULTY
            ? (difficulty as SpyDifficulty)
            : DIFFICULTY.MEDIUM;

    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.Spy),
        ...storageService.getCustomWordsByKey(`${GameKey.Spy}_${diffKey}`),
    ];
    const used = storageService.getUsedWords(GameKey.Spy);
    const all = [
        ...LOCATIONS_BY_DIFFICULTY[diffKey],
        ...custom.map((name) => ({name, roles: defaultRoles, difficulty: diffKey})),
    ];

    let available = all.filter((l) => !used.includes(l.name));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.Spy);
        available = all;
    }

    const location = pickRandom(available);
    storageService.markWordAsUsed(GameKey.Spy, location.name);
    return location;
}
