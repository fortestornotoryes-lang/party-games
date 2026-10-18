import { WHO_AMONG_US_QUESTIONS } from '../content';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';

/** Следующий вопрос раунда; повторы исключаются через пул игры. */
export function getWhoAmongUsQuestion(): string {
  return drawFromPool(GameKey.WhoAmongUs, WHO_AMONG_US_QUESTIONS);
}
