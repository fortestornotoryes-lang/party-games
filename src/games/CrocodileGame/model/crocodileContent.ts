import { LEVEL_ORDER, poolGameId } from '../constants';
import { CROCODILE_WORDS } from '../content';
import type { WordOption } from '../types';

import { GameKey } from '@/entities/game/types';
import { drawFromPool } from '@/shared/helpers/contentPool';
import type { Difficulty } from '@/shared/types';

/** Пул слов сложности. */
export const getCrocodileWordPool = (difficulty: Difficulty): string[] => CROCODILE_WORDS[difficulty];

/**
 * Три слова — по одному каждой сложности. У каждой сложности свой used-пул
 * (`crocodile_<difficulty>`): показанное слово не повторяется, пока есть другие,
 * а при исчерпании сбрасывается только пул этой сложности.
 */
export const drawWordOptions = (): WordOption[] =>
  LEVEL_ORDER.map((difficulty) => ({
    difficulty,
    word: drawFromPool(poolGameId(GameKey.Crocodile, difficulty), getCrocodileWordPool(difficulty)),
  }));
