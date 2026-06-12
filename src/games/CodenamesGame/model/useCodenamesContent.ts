import {WORDS_BY_DIFFICULTY as CODENAMES_WORDS} from '@/constants/codenamesContent';
import {shuffle} from '@/shared/helpers/random';
import {storageService} from '@/shared/services/storageService';
import type {Difficulty} from '@/shared/types';
import {GameKey} from '@/types/games';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useCodenamesContent(difficulty: Difficulty): string[] {
    const pool = CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium;
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.Codenames),
        ...storageService.getCustomWordsByKey(`${GameKey.Codenames}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Codenames);
    const all = [...pool, ...custom];

    let available = all.filter((w) => !used.includes(w));
    if (available.length < 25) {
        storageService.resetUsedWords(GameKey.Codenames);
        available = all;
    }

    const selected = shuffle(available).slice(0, 25);
    selected.forEach((w) => {
        storageService.markWordAsUsed(GameKey.Codenames, w);
    });
    return selected;
}
