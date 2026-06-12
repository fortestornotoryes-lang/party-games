export enum TelestrationsPhase {
  Setup = 'setup',
  Start = 'start',
  Action = 'action',
  Transition = 'transition',
  Gallery = 'gallery',
}

export const STEP_TYPE = {
  Draw: 'draw',
  Guess: 'guess',
} as const;

export type StepType = (typeof STEP_TYPE)[keyof typeof STEP_TYPE];

export interface Step {
  type: StepType;
  content: string;
  author: string;
}
