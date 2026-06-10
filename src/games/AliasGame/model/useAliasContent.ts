import {ALIAS_CATEGORIES} from '@/constants/aliasContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';

export function useAliasContent(difficulty: Difficulty): string[] {
    const targetCategories = ALIAS_CATEGORIES.filter((c) => {
        if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
        if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
        return true;
    });

    const staticWords = targetCategories.flatMap((c) => c.words);
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const customWords = [
        ...storageService.getCustomWords(GameKey.Alias),
        ...storageService.getCustomWordsByKey(`${GameKey.Alias}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Alias);
    const all = [...staticWords, ...customWords];

    let available = all.filter((w) => !used.includes(w));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.Alias);
        available = all;
    }
    return available;
}