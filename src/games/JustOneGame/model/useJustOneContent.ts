import { JUST_ONE_DATA_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getJustOneWordPool(difficulty: Difficulty): string[] {
  const pool = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.JustOne, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useJustOneContent(difficulty: Difficulty): string {
  const all = getJustOneWordPool(difficulty);
  const used = storageService.getUsedWords(GameKey.JustOne);

  let available = all.filter((w) => !used.includes(w));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.JustOne);
    available = all;
  }

  const word = pickRandom(available);
  storageService.markWordAsUsed(GameKey.JustOne, word);
  return word;
}
