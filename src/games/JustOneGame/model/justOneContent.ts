import { JUST_ONE_DATA_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getJustOneWordPool(difficulty: Difficulty): string[] {
  const pool = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.JustOne, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getJustOneWord(difficulty: Difficulty): string {
  return drawFromPool(GameKey.JustOne, getJustOneWordPool(difficulty));
}
