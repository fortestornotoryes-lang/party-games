export type Cell = 0 | 1 | 2;

export type C4Player = 1 | 2;

export const C4Action = {
  Place: 'place',
  Pop: 'pop',
} as const;

export type C4Action = (typeof C4Action)[keyof typeof C4Action];

export interface WinResult {
  player: C4Player;
  cells: [number, number][];
}

export interface BoardConfig {
  rows: number;
  cols: number;
  winLen: number;
  isPopOut: boolean;
}
