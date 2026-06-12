import { ALIAS_CATEGORIES } from '../content';

import { GameKey } from '@/entities/game/types';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getAliasWordPool(difficulty: Difficulty): string[] {
  const targetCategories = ALIAS_CATEGORIES.filter((c) => {
    if (difficulty === DIFFICULTY.EASY) return c.difficulty === DIFFICULTY.EASY || c.id === 'verbs';
    if (difficulty === DIFFICULTY.HARD)
      return c.difficulty === DIFFICULTY.HARD || c.id === 'emotions';
    return true;
  });

  return [
    ...targetCategories.flatMap((c) => c.words),
    ...storageService.getAllCustomWords(GameKey.Alias, difficulty),
  ];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getAliasWords(difficulty: Difficulty): string[] {
  const all = getAliasWordPool(difficulty);
  const used = storageService.getUsedWords(GameKey.Alias);

  let available = all.filter((w) => !used.includes(w));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.Alias);
    available = all;
  }
  return available;
}
