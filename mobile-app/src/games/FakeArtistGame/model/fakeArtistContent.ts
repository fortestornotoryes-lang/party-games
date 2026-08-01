import { FAKE_ARTIST_DATA_BY_DIFFICULTY, type FakeArtistCategory } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
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
  return drawFromPool(GameKey.FakeArtist, getFakeArtistPool(difficulty), {
    keyOf: (item) => item.word,
  });
}
