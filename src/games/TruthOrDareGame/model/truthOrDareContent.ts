import { DARES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
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
  return drawFromPool(GameKey.TruthOrDare, getTruthOrDarePool(type, difficulty));
}
