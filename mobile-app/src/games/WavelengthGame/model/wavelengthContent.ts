import { WAVELENGTH_DATA_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

const PAIR_SEPARATOR = ' - ';

/** Used-ключ пары: в storageService пара хранится одной строкой. */
export function wavelengthPairKey(pair: string[]): string {
  return pair.join(PAIR_SEPARATOR);
}

/** Полный пул пар (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getWavelengthPairPool(difficulty: Difficulty): string[][] {
  const pool = WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium;
  const custom = storageService.getAllCustomWords(GameKey.Wavelength, difficulty);
  return [
    ...pool,
    ...custom.map((w) =>
      w.split(PAIR_SEPARATOR).length === 2 ? w.split(PAIR_SEPARATOR) : [w, '...']
    ),
  ];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getWavelengthPair(difficulty: Difficulty): string[] {
  return drawFromPool(GameKey.Wavelength, getWavelengthPairPool(difficulty), {
    keyOf: wavelengthPairKey,
  });
}
