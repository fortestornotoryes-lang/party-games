export const TRUTH_OR_DARE_PHASE = {
  /** Передача телефона следующему игроку */
  PASS: 'pass',
  /** Выбор: правда или действие */
  CHOICE: 'choice',
  /** Карточка с вопросом/заданием */
  ACTION: 'action',
  /** Игрок слился — выпал штраф */
  PENALTY: 'penalty',
} as const;
export type TruthOrDarePhase = (typeof TRUTH_OR_DARE_PHASE)[keyof typeof TRUTH_OR_DARE_PHASE];

export const CHOICE_TYPE = {
  TRUTH: 'truth',
  DARE: 'dare',
} as const;
export type ChoiceType = (typeof CHOICE_TYPE)[keyof typeof CHOICE_TYPE];

/** Состояние таймера карточки (у карточек без `{t:N}` всегда IDLE и не показывается) */
export const CARD_TIMER_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  DONE: 'done',
} as const;
export type CardTimerStatus = (typeof CARD_TIMER_STATUS)[keyof typeof CARD_TIMER_STATUS];

/** Карточка после подстановки шаблонов — то, что видит игрок */
export interface TruthOrDareCard {
  text: string;
  /** 0 — карточка без таймера */
  timerSeconds: number;
}

/** Счёт сливов: имя игрока → сколько раз отказался */
export type RefusalCounts = Record<string, number>;
