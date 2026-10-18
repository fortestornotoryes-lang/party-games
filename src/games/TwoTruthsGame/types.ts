/** Фазы игры «Две правды и одна ложь» */
export const TwoTruthsPhase = {
  Pass: 'pass',
  Writing: 'writing',
  Voting: 'voting',
  Reveal: 'reveal',
  Finish: 'finish',
} as const;

export type TwoTruthsPhase = (typeof TwoTruthsPhase)[keyof typeof TwoTruthsPhase];
