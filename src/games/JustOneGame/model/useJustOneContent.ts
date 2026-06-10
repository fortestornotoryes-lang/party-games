import {JUST_ONE_DATA_BY_DIFFICULTY} from '@/constants/justOneContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';
import {pickRandom} from '@/utils/random';

export function useJustOneContent(difficulty: Difficulty): string {
    const pool = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.JustOne),
        ...storageService.getCustomWordsByKey(`${GameKey.JustOne}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.JustOne);
    const all = [...pool, ...custom];

    let available = all.filter((w) => !used.includes(w));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.JustOne);
        available = all;
    }

    const word = pickRandom(available);
    storageService.markWordAsUsed(GameKey.JustOne, word);
    return word;
}
