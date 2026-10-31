import { DARES_EASY } from './contents/dares/easy';
import { DARES_HARD } from './contents/dares/hard';
import { DARES_MEDIUM } from './contents/dares/medium';
import { TRUTHS_EASY } from './contents/truths/easy';
import { TRUTHS_HARD } from './contents/truths/hard';
import { TRUTHS_MEDIUM } from './contents/truths/medium';

import type { Difficulty } from '@/shared/types';

export { PENALTIES_BY_DIFFICULTY } from './contents/penalties';

/**
 * Пулы карточек. Уровни сложности в этой игре — острота:
 * easy = «Разогрев», medium = «Остро», hard = «18+».
 * Формат шаблонов — см. helpers.ts (renderCard): {player}, {player2}, {t:N}.
 */
export const TRUTHS_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: TRUTHS_EASY,
  medium: TRUTHS_MEDIUM,
  hard: TRUTHS_HARD,
};

export const DARES_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: DARES_EASY,
  medium: DARES_MEDIUM,
  hard: DARES_HARD,
};
