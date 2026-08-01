// ─── Board constants (SVG units) ───────────────────────────────────────────
export const CELL = 40;
export const GAP = 10;
export const STEP = CELL + GAP; // 50
export const BOARD_SZ = 9 * CELL + 8 * GAP; // 440
export const WALLS_INIT = 10;

export const P1_COLOR = '#14b8a6'; // teal  – moves bottom → top
export const P2_COLOR = '#ff8a1f'; // orange – moves top → bottom
export const PLAYER_COLOR: Record<1 | 2, string> = { 1: P1_COLOR, 2: P2_COLOR };
