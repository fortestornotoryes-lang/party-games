import {WORDS_BY_DIFFICULTY as DECRYPTO_WORDS} from '@/constants/decryptoContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';
import {shuffle} from '@/utils/random';

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
