export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export type GameTheme =
  | 'red'
  | 'green'
  | 'sky'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'blue'
  | 'pink'
  | 'cyan'
  | 'lime'
  | 'teal'
  | 'indigo';
