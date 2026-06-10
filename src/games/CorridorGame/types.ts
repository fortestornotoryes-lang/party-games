export enum CorridorPhase {
    Playing = 'playing',
    GameOver = 'game_over',
}

export interface Pos {
    row: number;
    col: number;
}

export type WallGrid = (0 | 1 | 2)[][];

export type ActionMode = 'move' | 'wall_h' | 'wall_v';
