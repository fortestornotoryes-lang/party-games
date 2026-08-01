import {
  EASY_QUESTIONS,
  HARD_QUESTIONS,
  MEDIUM_QUESTIONS,
  type MillionaireQuestion,
} from '../content';

import { GameKey } from '@/entities/game/types';
import { shuffle } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';

export const QUESTIONS_PER_TIER = 5;

const TIERS = [EASY_QUESTIONS, MEDIUM_QUESTIONS, HARD_QUESTIONS];

/** Все вопросы всех уровней — общий источник для игры и contentService.getWordStats. */
export function getMillionaireQuestionPool(): string[] {
  return TIERS.flat().map((q) => q.text);
}

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function getMillionaireQuestions(): MillionaireQuestion[] {
  let used = new Set(storageService.getUsedWords(GameKey.Millionaire));

  // Если в каком-то уровне не хватает свежих вопросов на полную лесенку — сбрасываем историю целиком
  const exhausted = TIERS.some(
    (tier) => tier.filter((q) => !used.has(q.text)).length < QUESTIONS_PER_TIER
  );
  if (exhausted) {
    storageService.resetUsedWords(GameKey.Millionaire);
    used = new Set();
  }

  const selected = TIERS.flatMap((tier) =>
    shuffle(tier.filter((q) => !used.has(q.text))).slice(0, QUESTIONS_PER_TIER)
  );
  selected.forEach((q) => {
    storageService.markWordAsUsed(GameKey.Millionaire, q.text);
  });
  return selected;
}
