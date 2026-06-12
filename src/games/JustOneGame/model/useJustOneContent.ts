import { JUST_ONE_DATA_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useJustOneContent(difficulty: Difficulty): string {
  const pool = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
  // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
  const custom = [
    ...storageService.getCustomWords(GameKey.JustOne),
    ...storageService.getCustomWordsByKey(`${GameKey.JustOne}_${difficulty}`),
  ];
  const used = storageService.getUsedWords(GameKey.JustOne);
  const all = [...pool, ...custom];

  let available = all.filter((w) => !used.includes(w));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.JustOne);
    available = all;
  }

  const word = pickRandom(available);
  storageService.markWordAsUsed(GameKey.JustOne, word);
  return word;
}
