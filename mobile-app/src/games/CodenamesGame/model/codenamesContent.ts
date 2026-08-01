import { WORDS_BY_DIFFICULTY as CODENAMES_WORDS } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawBatchFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getCodenamesWordPool(difficulty: Difficulty): string[] {
  const pool = CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.Codenames, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getCodenamesWords(difficulty: Difficulty): string[] {
  return drawBatchFromPool(GameKey.Codenames, getCodenamesWordPool(difficulty), 25);
}
