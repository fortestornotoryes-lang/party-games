import { PENALTY_POOL_ID } from '../constants';
import { DARES_BY_DIFFICULTY, PENALTIES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY } from '../content';
import { playableTemplates } from '../helpers';
import type { ChoiceType } from '../types';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

export type TruthOrDareType = ChoiceType;

/** Полный пул вопросов одного типа (пресет + кастомные) — общий источник для игры и contentService.getWordStats. */
export function getTruthOrDarePool(type: TruthOrDareType, difficulty: Difficulty): string[] {
  const staticPool =
    type === 'truth' ? TRUTHS_BY_DIFFICULTY[difficulty] : DARES_BY_DIFFICULTY[difficulty];
  return [...staticPool, ...storageService.getCustomWordsByKey(`tod_${type}_${difficulty}`)];
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
/** Шаблон карточки (с `{player}`/`{t:N}`); карточки, которым не хватает игроков, отфильтрованы */
export function drawTruthOrDareTemplate(
  type: TruthOrDareType,
  difficulty: Difficulty,
  playerCount: number
): string {
  return drawFromPool(
    GameKey.TruthOrDare,
    playableTemplates(getTruthOrDarePool(type, difficulty), playerCount)
  );
}

/** Шаблон штрафа за слив */
export function drawPenaltyTemplate(difficulty: Difficulty, playerCount: number): string {
  return drawFromPool(
    PENALTY_POOL_ID,
    playableTemplates(PENALTIES_BY_DIFFICULTY[difficulty], playerCount)
  );
}
