import { DARES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

export type TruthOrDareType = 'truth' | 'dare';

/** Полный пул вопросов одного типа (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getTruthOrDarePool(type: TruthOrDareType, difficulty: Difficulty): string[] {
  const staticPool =
    type === 'truth' ? TRUTHS_BY_DIFFICULTY[difficulty] : DARES_BY_DIFFICULTY[difficulty];
  return [...staticPool, ...storageService.getCustomWordsByKey(`tod_${type}_${difficulty}`)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getTruthOrDareQuestion(type: TruthOrDareType, difficulty: Difficulty): string {
  const all = getTruthOrDarePool(type, difficulty);
  const used = storageService.getUsedWords(GameKey.TruthOrDare);

  let available = all.filter((q) => !used.includes(q));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.TruthOrDare);
    available = all;
  }

  const question = pickRandom(available);
  storageService.markWordAsUsed(GameKey.TruthOrDare, question);
  return question;
}
