import { WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getTelestrationsWordPool(difficulty: Difficulty): string[] {
  const pool = TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.Telestrations, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getTelestrationsWord(difficulty: Difficulty): string {
  return drawFromPool(GameKey.Telestrations, getTelestrationsWordPool(difficulty));
}
