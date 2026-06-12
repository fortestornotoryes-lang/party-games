import { CONNECT_FOUR_MODES } from './constants';
import type { BoardConfig, C4Player, Cell, WinResult } from './types';

export const emptyBoard = (rows: number, cols: number): Cell[][] =>
  Array.from({ length: rows }, () => Array<Cell>(cols).fill(0));

export function getBoardConfig(mode: string): BoardConfig {
  const isLarge = mode === CONNECT_FOUR_MODES.LARGE || mode === CONNECT_FOUR_MODES.CONNECT_FIVE;
  return {
    rows: isLarge ? 7 : 6,
    cols: isLarge ? 9 : 7,
    winLen: mode === CONNECT_FOUR_MODES.CONNECT_FIVE ? 5 : 4,
    isPopOut: mode === CONNECT_FOUR_MODES.POP_OUT,
  };
}

export function findWinner(board: Cell[][], winLength: number): WinResult | null {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const dirs: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = board[r][c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells: [number, number][] = [[r, c]];
        for (let i = 1; i < winLength; i++) {
          const nr = r + dr * i,
            nc = c + dc * i;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== p) break;
          cells.push([nr, nc]);
        }
        if (cells.length === winLength) return { player: p, cells };
      }
    }
  }
  return null;
}

// Bottom-most empty row in the column, or -1 if the column is full
export function findDropRow(board: Cell[][], col: number): number {
  for (let r = board.length - 1; r >= 0; r--) {
    if (!board[r][col]) return r;
  }
  return -1;
}

// Pop Out: remove the bottom-most piece of `player` in the column,
// shifting everything above it down. Returns null if the player has
// no piece in this column.
export function popOutPiece(board: Cell[][], col: number, player: C4Player): Cell[][] | null {
  let bottomRow = -1;
  for (let r = board.length - 1; r >= 0; r--) {
    if (board[r][col] === player) {
      bottomRow = r;
      break;
    }
  }
  if (bottomRow === -1) return null;

  const next = board.map((r) => [...r]);
  for (let r = bottomRow; r > 0; r--) {
    next[r][col] = next[r - 1][col];
  }
  next[0][col] = 0;
  return next;
}

// Pop Out is only allowed when the lowest piece in the column is yours
export function canPopColumn(board: Cell[][], col: number, player: C4Player): boolean {
  for (let r = board.length - 1; r >= 0; r--) {
    if (board[r][col] !== 0) return board[r][col] === player;
  }
  return false;
}

export function isBoardFull(board: Cell[][]): boolean {
  return board.flat().every((c) => c !== 0);
}
