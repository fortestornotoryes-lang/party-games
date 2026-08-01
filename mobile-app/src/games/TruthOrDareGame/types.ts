// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const TruthOrDarePhase = {
  Pass: 'pass',
  Choice: 'choice',
  Action: 'action',
} as const;
export type TruthOrDarePhase = (typeof TruthOrDarePhase)[keyof typeof TruthOrDarePhase];

export type ChoiceType = 'truth' | 'dare';
