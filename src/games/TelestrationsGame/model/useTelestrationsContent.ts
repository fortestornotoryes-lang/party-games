import {WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS} from '@/constants/telestrationsContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';
import {pickRandom} from '@/utils/random';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useTelestrationsContent(difficulty: Difficulty): string {
    const pool = TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium;
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.Telestrations),
        ...storageService.getCustomWordsByKey(`${GameKey.Telestrations}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Telestrations);
    const all = [...pool, ...custom];

    let available = all.filter((w) => !used.includes(w));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.Telestrations);
        available = all;
    }

    const word = pickRandom(available);
    storageService.markWordAsUsed(GameKey.Telestrations, word);
    return word;
}
