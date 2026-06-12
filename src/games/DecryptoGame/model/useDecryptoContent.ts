import {WORDS_BY_DIFFICULTY as DECRYPTO_WORDS} from '@/constants/decryptoWords.ts';
import {shuffle} from '@/shared/helpers/random';
import {storageService} from '@/shared/services/storageService';
import type {Difficulty} from '@/shared/types';
import {GameKey} from '@/types/games';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; called twice per init — write/read order must be preserved)
export function useDecryptoContent(difficulty: Difficulty, count = 4): string[] {
    const pool = DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium;
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.Decrypto),
        ...storageService.getCustomWordsByKey(`${GameKey.Decrypto}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Decrypto);
    const all = [...pool, ...custom];

    let available = all.filter((w) => !used.includes(w));
    if (available.length < count) {
        storageService.resetUsedWords(GameKey.Decrypto);
        available = all;
    }

    const selected = shuffle(available).slice(0, count);
    selected.forEach((w) => {
        storageService.markWordAsUsed(GameKey.Decrypto, w);
    });
    return selected;
}
