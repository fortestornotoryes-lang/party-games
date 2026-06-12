import { ALIAS_CATEGORIES } from '@/constants/aliasContent';
import { GameKey } from '@/entities/game/types';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useAliasContent(difficulty: Difficulty): string[] {
  const targetCategories = ALIAS_CATEGORIES.filter((c) => {
    if (difficulty === DIFFICULTY.EASY) return c.difficulty === DIFFICULTY.EASY || c.id === 'verbs';
    if (difficulty === DIFFICULTY.HARD)
      return c.difficulty === DIFFICULTY.HARD || c.id === 'emotions';
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
