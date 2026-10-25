import { applyMove, bestMove, describeMove, fromFen, legalMoves, moveKey, moveLabel, scoreMove, toFen } from './engine';

interface Request { id: number; fens: string[]; moves: string[] }

self.onmessage = ({ data }: MessageEvent<Request>) => {
  const { id, fens, moves } = data;
  for (let index = 0; index < moves.length; index++) {
    const before = fromFen(fens[index]);
    const after = fens[index + 1];
    const played = legalMoves(before).find(move => toFen(applyMove(before, move)) === after);
    if (!played) continue;
    const strongest = bestMove(before, 3);
    if (!strongest) continue;
    const actual = moveKey(strongest.move) === moveKey(played)
      ? strongest.score : scoreMove(before, played, 3);
    const loss = Math.max(0, strongest.score - actual);
    const kind = moveKey(strongest.move) === moveKey(played) ? 'best'
      : loss < 40 ? 'good' : loss < 100 ? 'inaccuracy' : loss < 250 ? 'mistake' : 'blunder';
    const response = loss >= 100 ? bestMove(fromFen(after), 1) : null;
    self.postMessage({ id, index, item: {
      label: moves[index], kind, best: moveLabel(before, strongest.move), loss,
      reason: describeMove(before, strongest.move),
      reply: response ? moveLabel(fromFen(after), response.move) : undefined,
    } });
  }
  self.postMessage({ id, done: true });
};
