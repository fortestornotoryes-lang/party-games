import { WORDS_BY_DIFFICULTY as CODENAMES_WORDS } from '../content';

import { GameKey } from '@/entities/game/types';
import { shuffle } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getCodenamesWordPool(difficulty: Difficulty): string[] {
  const pool = CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.Codenames, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useCodenamesContent(difficulty: Difficulty): string[] {
  const all = getCodenamesWordPool(difficulty);
  const used = storageService.getUsedWords(GameKey.Codenames);

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
