import { WORDS_BY_DIFFICULTY as DECRYPTO_WORDS } from '../content.ts';

import { GameKey } from '@/entities/game/types';
import { shuffle } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getDecryptoWordPool(difficulty: Difficulty): string[] {
  const pool = DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium;
  return [...pool, ...storageService.getAllCustomWords(GameKey.Decrypto, difficulty)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; called twice per init — write/read order must be preserved)
export function useDecryptoContent(difficulty: Difficulty, count = 4): string[] {
  const all = getDecryptoWordPool(difficulty);
  const used = storageService.getUsedWords(GameKey.Decrypto);

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
