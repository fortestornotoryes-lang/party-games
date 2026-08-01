export const CorridorPhase = {
  Playing: 'playing',
  GameOver: 'game_over',
} as const;

export type CorridorPhase = (typeof CorridorPhase)[keyof typeof CorridorPhase];

export interface Pos {
  row: number;
  col: number;
}

export type WallGrid = (0 | 1 | 2)[][];

export const ActionMode = {
  Move: 'move',
  WallH: 'wall_h',
  WallV: 'wall_v',
} as const;

export type ActionMode = (typeof ActionMode)[keyof typeof ActionMode];
