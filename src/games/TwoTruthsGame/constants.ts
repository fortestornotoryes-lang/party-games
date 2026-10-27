/** Количество утверждений в раунде: две правды и одна ложь */
export const STATEMENTS_COUNT = 3;

/** Максимальная длина одного утверждения */
export const STATEMENT_MAX_LENGTH = 120;

/** Очко угадавшему ложь */
export const POINTS_FOR_CORRECT_GUESS = 1;

/** Очко рассказчику за каждого, кого он обманул */
export const POINTS_FOR_FOOLED = 1;

/** Тайминги раскрытия (с): сначала по очереди переворачиваются правды, после паузы — ложь */
export const REVEAL_TIMING = {
  start: 0.3,
  truthStep: 0.35,
  liePause: 0.55,
  /** Через сколько после переворота лжи выезжают итоги голосования */
  resultsAfterLie: 0.55,
} as const;
