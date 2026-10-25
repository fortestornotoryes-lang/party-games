export type Color = 'w' | 'b';
export type Piece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Cell = string | null;
export type Board = Cell[];

export interface Position {
  board: Board;
  turn: Color;
  castling: string;
  enPassant: number | null;
  halfmove: number;
  fullmove: number;
}

export interface Move {
  from: number;
  to: number;
  promotion?: Piece;
  capture?: string;
  castle?: 'k' | 'q';
  enPassant?: boolean;
}

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const VALUES: Record<Piece, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const KNIGHT_STEPS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING_STEPS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const BISHOP_STEPS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const ROOK_STEPS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export const pieceColor = (piece: string): Color => piece === piece.toUpperCase() ? 'w' : 'b';
export const other = (color: Color): Color => color === 'w' ? 'b' : 'w';
export const squareName = (index: number) => 'abcdefgh'[index % 8] + String(8 - Math.floor(index / 8));
export const squareIndex = (name: string) => (8 - Number(name[1])) * 8 + 'abcdefgh'.indexOf(name[0]);
const row = (index: number) => Math.floor(index / 8);
const col = (index: number) => index % 8;
const inside = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const pieceType = (piece: string) => piece.toLowerCase() as Piece;

export function fromFen(fen: string): Position {
  const [placement, turn, castling, ep, halfmove, fullmove] = fen.split(' ');
  const board: Board = [];
  for (const rank of placement.split('/')) {
    for (const character of rank) {
      if (/\d/.test(character)) board.push(...Array<Cell>(Number(character)).fill(null));
      else board.push(character);
    }
  }
  if (board.length !== 64) throw new Error('Invalid chess position');
  return {
    board,
    turn: turn as Color,
    castling: castling === '-' ? '' : castling,
    enPassant: ep === '-' ? null : squareIndex(ep),
    halfmove: Number(halfmove),
    fullmove: Number(fullmove),
  };
}

export function toFen(position: Position): string {
  const ranks: string[] = [];
  for (let r = 0; r < 8; r++) {
    let rank = '';
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      const piece = position.board[r * 8 + c];
      if (!piece) empty++;
      else {
        if (empty) rank += String(empty);
        empty = 0;
        rank += piece;
      }
    }
    if (empty) rank += String(empty);
    ranks.push(rank);
  }
  return [
    ranks.join('/'),
    position.turn,
    position.castling || '-',
    position.enPassant === null ? '-' : squareName(position.enPassant),
    position.halfmove,
    position.fullmove,
  ].join(' ');
}

function attacked(position: Position, target: number, by: Color): boolean {
  const { board } = position;
  const tr = row(target);
  const tc = col(target);
  const pawnRow = tr + (by === 'w' ? 1 : -1);
  for (const dc of [-1, 1]) {
    if (inside(pawnRow, tc + dc) && board[pawnRow * 8 + tc + dc] === (by === 'w' ? 'P' : 'p')) return true;
  }
  for (const [dr, dc] of KNIGHT_STEPS) {
    const r = tr + dr;
    const c = tc + dc;
    if (inside(r, c) && board[r * 8 + c] === (by === 'w' ? 'N' : 'n')) return true;
  }
  for (const [dr, dc] of KING_STEPS) {
    const r = tr + dr;
    const c = tc + dc;
    if (inside(r, c) && board[r * 8 + c] === (by === 'w' ? 'K' : 'k')) return true;
  }
  for (const [dr, dc] of [...BISHOP_STEPS, ...ROOK_STEPS]) {
    let r = tr + dr;
    let c = tc + dc;
    while (inside(r, c)) {
      const piece = board[r * 8 + c];
      if (piece) {
        if (pieceColor(piece) === by) {
          const type = pieceType(piece);
          if (type === 'q' || (dr && dc ? type === 'b' : type === 'r')) return true;
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return false;
}

export function isInCheck(position: Position, color: Color): boolean {
  const king = position.board.indexOf(color === 'w' ? 'K' : 'k');
  return king < 0 || attacked(position, king, other(color));
}

function pseudoMoves(position: Position): Move[] {
  const result: Move[] = [];
  const { board, turn } = position;
  const add = (from: number, to: number, extra: Partial<Move> = {}) => {
    const target = board[to];
    if (target && pieceColor(target) === turn) return;
    if (target?.toLowerCase() === 'k') return;
    result.push({ from, to, capture: target ?? undefined, ...extra });
  };
  for (let from = 0; from < 64; from++) {
    const piece = board[from];
    if (!piece || pieceColor(piece) !== turn) continue;
    const type = pieceType(piece);
    const r = row(from);
    const c = col(from);
    if (type === 'p') {
      const direction = turn === 'w' ? -1 : 1;
      const next = r + direction;
      const promotionRow = turn === 'w' ? 0 : 7;
      const addPawn = (to: number, extra: Partial<Move> = {}) => {
        if (next === promotionRow) {
          for (const promotion of ['q', 'r', 'b', 'n'] as const) add(from, to, { ...extra, promotion });
        } else add(from, to, extra);
      };
      if (inside(next, c) && !board[next * 8 + c]) {
        addPawn(next * 8 + c);
        const start = turn === 'w' ? 6 : 1;
        if (r === start && !board[(r + 2 * direction) * 8 + c]) add(from, (r + 2 * direction) * 8 + c);
      }
      for (const dc of [-1, 1]) {
        if (!inside(next, c + dc)) continue;
        const to = next * 8 + c + dc;
        if (board[to] && pieceColor(board[to]) !== turn) addPawn(to);
        else if (position.enPassant === to) addPawn(to, { enPassant: true, capture: turn === 'w' ? 'p' : 'P' });
      }
      continue;
    }
    if (type === 'n' || type === 'k') {
      for (const [dr, dc] of type === 'n' ? KNIGHT_STEPS : KING_STEPS) {
        if (inside(r + dr, c + dc)) add(from, (r + dr) * 8 + c + dc);
      }
    } else {
      const directions = type === 'b' ? BISHOP_STEPS : type === 'r' ? ROOK_STEPS : [...BISHOP_STEPS, ...ROOK_STEPS];
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (inside(nr, nc)) {
          const to = nr * 8 + nc;
          const target = board[to];
          if (!target || pieceColor(target) !== turn) add(from, to);
          if (target) break;
          nr += dr;
          nc += dc;
        }
      }
    }
    if (type === 'k' && !isInCheck(position, turn)) {
      const home = turn === 'w' ? 7 : 0;
      const kingSide = turn === 'w' ? 'K' : 'k';
      const queenSide = turn === 'w' ? 'Q' : 'q';
      if (position.castling.includes(kingSide) && board[home * 8 + 7]?.toLowerCase() === 'r'
        && !board[home * 8 + 5] && !board[home * 8 + 6]
        && !attacked(position, home * 8 + 5, other(turn)) && !attacked(position, home * 8 + 6, other(turn))) {
        add(from, home * 8 + 6, { castle: 'k' });
      }
      if (position.castling.includes(queenSide) && board[home * 8]?.toLowerCase() === 'r'
        && !board[home * 8 + 1] && !board[home * 8 + 2] && !board[home * 8 + 3]
        && !attacked(position, home * 8 + 3, other(turn)) && !attacked(position, home * 8 + 2, other(turn))) {
        add(from, home * 8 + 2, { castle: 'q' });
      }
    }
  }
  return result;
}

export function applyMove(position: Position, move: Move): Position {
  const board = [...position.board];
  const piece = board[move.from]!;
  const turn = position.turn;
  board[move.from] = null;
  board[move.to] = move.promotion ? (turn === 'w' ? move.promotion.toUpperCase() : move.promotion) : piece;
  if (move.enPassant) board[move.to + (turn === 'w' ? 8 : -8)] = null;
  if (move.castle) {
    const home = turn === 'w' ? 7 : 0;
    const rookFrom = home * 8 + (move.castle === 'k' ? 7 : 0);
    const rookTo = home * 8 + (move.castle === 'k' ? 5 : 3);
    board[rookTo] = board[rookFrom];
    board[rookFrom] = null;
  }
  let castling = position.castling;
  if (piece === 'K') castling = castling.replace(/[KQ]/g, '');
  if (piece === 'k') castling = castling.replace(/[kq]/g, '');
  for (const [square, right] of [[63, 'K'], [56, 'Q'], [7, 'k'], [0, 'q']] as const) {
    if (move.from === square || move.to === square) castling = castling.replace(right, '');
  }
  return {
    board,
    turn: other(turn),
    castling,
    enPassant: pieceType(piece) === 'p' && Math.abs(move.to - move.from) === 16 ? (move.to + move.from) / 2 : null,
    halfmove: pieceType(piece) === 'p' || move.capture ? 0 : position.halfmove + 1,
    fullmove: position.fullmove + (turn === 'b' ? 1 : 0),
  };
}

export function legalMoves(position: Position): Move[] {
  return pseudoMoves(position).filter(move => !isInCheck(applyMove(position, move), position.turn));
}

export function gameResult(position: Position, repetitionCount = 1): 'white' | 'black' | 'draw' | null {
  const moves = legalMoves(position);
  if (moves.length === 0) return isInCheck(position, position.turn)
    ? position.turn === 'w' ? 'black' : 'white'
    : 'draw';
  if (position.halfmove >= 100 || repetitionCount >= 3) return 'draw';
  const material = position.board.filter(piece => piece && piece.toLowerCase() !== 'k');
  if (material.length === 0 || (material.length === 1 && ['b', 'n'].includes(material[0]!.toLowerCase()))) return 'draw';
  return null;
}

function evaluate(position: Position): number {
  let score = 0;
  for (let square = 0; square < 64; square++) {
    const piece = position.board[square];
    if (!piece) continue;
    const type = pieceType(piece);
    const color = pieceColor(piece);
    const centrality = 3.5 - Math.abs(3.5 - col(square)) + 3.5 - Math.abs(3.5 - row(square));
    const advancement = color === 'w' ? 6 - row(square) : row(square) - 1;
    const positional = type === 'p' ? advancement * 7 + centrality * 3
      : type === 'n' || type === 'b' ? centrality * 8 : type === 'k' ? -centrality * 4 : centrality * 2;
    score += (color === position.turn ? 1 : -1) * (VALUES[type] + positional);
  }
  return score;
}

function order(move: Move): number {
  return (move.capture ? VALUES[pieceType(move.capture)] * 10 : 0) + (move.promotion ? VALUES[move.promotion] : 0);
}

function search(position: Position, depth: number, alpha: number, beta: number): number {
  const moves = legalMoves(position);
  if (!moves.length) return isInCheck(position, position.turn) ? -100000 - depth : 0;
  if (position.halfmove >= 100) return 0;
  if (!depth) return evaluate(position);
  let best = -Infinity;
  moves.sort((a, b) => order(b) - order(a));
  for (const move of moves) {
    const value = -search(applyMove(position, move), depth - 1, -beta, -alpha);
    best = Math.max(best, value);
    alpha = Math.max(alpha, value);
    if (alpha >= beta) break;
  }
  return best;
}

export interface SearchResult { move: Move; score: number; }
export function bestMove(position: Position, depth: number): SearchResult | null {
  const moves = legalMoves(position);
  if (!moves.length) return null;
  moves.sort((a, b) => order(b) - order(a));
  let best: SearchResult | null = null;
  let alpha = -Infinity;
  for (const move of moves) {
    const score = -search(applyMove(position, move), depth - 1, -Infinity, -alpha);
    if (!best || score > best.score) best = { move, score };
    alpha = Math.max(alpha, score);
  }
  return best;
}

export function scoreMove(position: Position, move: Move, depth: number): number {
  return -search(applyMove(position, move), Math.max(0, depth - 1), -Infinity, Infinity);
}

export function moveLabel(position: Position, move: Move): string {
  const next = applyMove(position, move);
  const check = isInCheck(next, next.turn);
  const suffixCheck = check ? legalMoves(next).length === 0 ? '#' : '+' : '';
  if (move.castle) return (move.castle === 'k' ? 'O-O' : 'O-O-O') + suffixCheck;
  const piece = position.board[move.from]!;
  const type = pieceType(piece);
  const names: Record<Piece, string> = { p: '', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' };
  let disambiguation = '';
  if (type !== 'p' && type !== 'k') {
    const peers = legalMoves(position).filter(otherMove =>
      otherMove.to === move.to && otherMove.from !== move.from
      && position.board[otherMove.from]?.toLowerCase() === type,
    );
    if (peers.length) {
      const file = squareName(move.from)[0];
      const rank = squareName(move.from)[1];
      disambiguation = peers.some(peer => squareName(peer.from).startsWith(file)) ? rank : file;
    }
  }
  const prefix = type === 'p' && move.capture ? squareName(move.from)[0] : names[type] + disambiguation;
  const suffix = move.promotion ? '=' + move.promotion.toUpperCase() : '';
  return prefix + (move.capture ? 'x' : '') + squareName(move.to) + suffix + suffixCheck;
}

export function moveKey(move: Move): string {
  return squareName(move.from) + squareName(move.to) + (move.promotion ?? '');
}

export function describeMove(position: Position, move: Move): string {
  const next = applyMove(position, move);
  if (gameResult(next) === (position.turn === 'w' ? 'white' : 'black')) return 'mate';
  if (isInCheck(next, next.turn)) return 'check';
  if (move.castle) return 'castle';
  if (move.promotion) return 'promotion';
  if (move.capture) return 'capture';
  const type = pieceType(position.board[move.from]!);
  if (type === 'n' || type === 'b') return 'development';
  if (type === 'p' && [27, 28, 35, 36].includes(move.to)) return 'center';
  return 'improve';
}
