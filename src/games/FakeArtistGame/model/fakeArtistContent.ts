import { FAKE_ARTIST_DATA_BY_DIFFICULTY, type FakeArtistCategory } from '../content';

import { GameKey } from '@/entities/game/types';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

/** Полный пул слов (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getFakeArtistPool(difficulty: Difficulty): FakeArtistCategory[] {
  const custom = storageService.getAllCustomWords(GameKey.FakeArtist, difficulty);
  return [
    ...FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty],
    ...custom.map((w) => ({ word: w, category: 'Своё' })),
  ];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getFakeArtistWord(difficulty: Difficulty): { word: string; category: string } {
  const pool = getFakeArtistPool(difficulty);
  const used = storageService.getUsedWords(GameKey.FakeArtist);

  let available = pool.filter((item) => !used.includes(item.word));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.FakeArtist);
    available = pool;
  }

  const item = pickRandom(available);
  storageService.markWordAsUsed(GameKey.FakeArtist, item.word);
  return item;
}
