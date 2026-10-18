/** Количество раундов в одной партии */
export const ROUNDS_COUNT = 5;

/** Очки игрокам, набравшим больше всего голосов в раунде */
export const POINTS_FOR_TOP = 1;

/** Пауза между выбором игрока и переходом дальше — успевает сыграть анимация выбора, мс */
export const PICK_DELAY_MS = 380;

/** Тайминги экрана итогов (с): полосы голосов растут по очереди, затем объявляются лидеры */
export const RESULT_TIMING = {
  barsStart: 0.25,
  barStep: 0.09,
  barDuration: 0.8,
} as const;
