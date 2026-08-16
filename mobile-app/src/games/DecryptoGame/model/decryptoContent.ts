import { WORDS_BY_DIFFICULTY as DECRYPTO_WORDS } from '../content.ts';

import { GameKey } from '@/entities/game/types';
import { drawBatchFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getDecryptoWordPool(difficulty: Difficulty): string[] {
  const pool = DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.Decrypto, difficulty)];
}

// Вызывается дважды за инициализацию раунда — порядок запись/чтение важен, оставаться синхронной (см. gotchas.md)
export function getDecryptoWords(difficulty: Difficulty, count = 4): string[] {
  return drawBatchFromPool(GameKey.Decrypto, getDecryptoWordPool(difficulty), count);
}
