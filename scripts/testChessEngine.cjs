const assert = require('node:assert/strict');
const fs = require('node:fs');
const esbuild = require('esbuild');

const source = fs.readFileSync('src/games/ChessGame/engine.ts', 'utf8');
const { code } = esbuild.transformSync(source, { loader: 'ts', format: 'cjs' });
const moduleRef = { exports: {} };
new Function('module', 'exports', code)(moduleRef, moduleRef.exports);
const engine = moduleRef.exports;

function perft(position, depth) {
  if (depth === 0) return 1;
  return engine.legalMoves(position).reduce(
    (total, move) => total + perft(engine.applyMove(position, move), depth - 1), 0,
  );
}

function hasMove(fen, notation) {
  return engine.legalMoves(engine.fromFen(fen)).some(move => engine.moveKey(move) === notation);
}

assert.equal(perft(engine.fromFen(engine.START_FEN), 1), 20);
assert.equal(perft(engine.fromFen(engine.START_FEN), 2), 400);
assert.equal(perft(engine.fromFen(engine.START_FEN), 3), 8902);
assert.equal(perft(engine.fromFen(engine.START_FEN), 4), 197281);
assert.equal(hasMove('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', 'e5d6'), true);
assert.equal(hasMove('4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7a8q'), true);
assert.equal(hasMove('4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7a8n'), true);
assert.equal(engine.gameResult(engine.fromFen('7k/6Q1/5K2/8/8/8/8/8 b - - 0 1')), 'white');
assert.equal(engine.gameResult(engine.fromFen('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')), 'draw');

let position = engine.fromFen(engine.START_FEN);
for (const notation of ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6']) {
  const move = engine.legalMoves(position).find(candidate => engine.moveKey(candidate) === notation);
  assert.ok(move, notation);
  position = engine.applyMove(position, move);
}
assert.equal(engine.legalMoves(position).some(move => engine.moveKey(move) === 'e1g1'), true);
console.log('Chess engine checks passed');
