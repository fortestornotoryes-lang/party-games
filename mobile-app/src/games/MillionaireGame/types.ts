// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const MillionairePhase = {
  Pass: 'pass',
  Question: 'question',
  Reveal: 'reveal',
  Between: 'between',
  Win: 'win',
  GameOver: 'game_over',
} as const;
export type MillionairePhase = (typeof MillionairePhase)[keyof typeof MillionairePhase];

/** Эфемерное состояние текущего вопроса — сбрасывается целиком на новый вопрос (handlePassDone/handleContinue). */
export interface QuestionState {
  selectedAnswer: number | null;
  eliminatedOptions: number[];
  audienceVotes: number[] | null;
  phoneFriendSuggestion: number | null;
}

export const EMPTY_QUESTION_STATE: QuestionState = {
  selectedAnswer: null,
  eliminatedOptions: [],
  audienceVotes: null,
  phoneFriendSuggestion: null,
};
