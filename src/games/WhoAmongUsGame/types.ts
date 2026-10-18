/** Фазы игры «Кто из нас» */
export const WhoAmongUsPhase = {
  Question: 'question',
  Voting: 'voting',
  Result: 'result',
  Finish: 'finish',
} as const;

export type WhoAmongUsPhase = (typeof WhoAmongUsPhase)[keyof typeof WhoAmongUsPhase];
