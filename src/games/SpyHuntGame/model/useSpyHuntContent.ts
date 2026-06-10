import type {SpyDifficulty} from '@/constants/spyHuntContent';
import {LOCATIONS_BY_DIFFICULTY} from '@/constants/spyHuntContent';
import {storageService} from '@/services/storageService';
import {GameKey} from '@/types/games';
import {pickRandom} from '@/utils/random';

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
            : 'medium';

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
