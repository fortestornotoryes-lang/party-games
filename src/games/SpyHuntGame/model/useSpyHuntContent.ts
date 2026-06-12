import type { SpyDifficulty } from '../content';

import { GameKey } from '@/entities/game/types';
import { LOCATIONS_BY_DIFFICULTY } from '@/games/SpyHuntGame/constants.ts';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY } from '@/shared/types';

const DEFAULT_ROLES = [
  'Агент',
  'Специалист',
  'Наблюдатель',
  'Сотрудник',
  'Гость',
  'Персонал',
  'Охранник',
];

/** Полный пул локаций (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getSpyHuntLocationPool(difficulty: string) {
  const diffKey =
    (difficulty as SpyDifficulty) in LOCATIONS_BY_DIFFICULTY
      ? (difficulty as SpyDifficulty)
      : DIFFICULTY.MEDIUM;

  const custom = storageService.getAllCustomWords(GameKey.Spy, diffKey);
  return [
    ...LOCATIONS_BY_DIFFICULTY[diffKey],
    ...custom.map((name) => ({ name, roles: DEFAULT_ROLES, difficulty: diffKey })),
  ];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useSpyHuntContent(difficulty: string) {
  const all = getSpyHuntLocationPool(difficulty);
  const used = storageService.getUsedWords(GameKey.Spy);

  let available = all.filter((l) => !used.includes(l.name));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.Spy);
    available = all;
  }

  const location = pickRandom(available);
  storageService.markWordAsUsed(GameKey.Spy, location.name);
  return location;
}
