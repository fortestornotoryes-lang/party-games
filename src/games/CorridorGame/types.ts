export enum CorridorPhase {
    Playing = 'playing',
    GameOver = 'game_over',
}

export interface Pos {
    row: number;
    col: number;
}

export type WallGrid = boolean[][];

export type ActionMode = 'move' | 'wall_h' | 'wall_v';
