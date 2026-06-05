import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameHeader } from '@/components/GameHeader';
import { PrimaryButton } from '@/components/UI';
import { useGameSettings } from '../../contexts/GameSettingsContext';

type Cell = 0 | 1 | 2;

const emptyBoard = (rows: number, cols: number): Cell[][] =>
  Array.from({ length: rows }, () => Array<Cell>(cols).fill(0));

interface WinResult {
  player: 1 | 2;
  cells: [number, number][];
}

function findWinner(board: Cell[][], winLength: number): WinResult | null {
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
        if (cells.length === winLength) return { player: p as 1 | 2, cells };
      }
    }
  }
  return null;
}

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export const ConnectFourGame: React.FC<Props> = ({ playerNames, onBack }) => {
  const { mode } = useGameSettings();

  const p1 = playerNames[0] ?? 'Игрок 1';
  const p2 = playerNames[1] ?? 'Игрок 2';

  const isLarge = mode === 'large' || mode === 'connect_five';
  const ROWS = isLarge ? 7 : 6;
  const COLS = isLarge ? 9 : 7;
  const WIN_LEN = mode === 'connect_five' ? 5 : 4;
  const isPopOut = mode === 'pop_out';
  // Literal class strings — needed for Tailwind v4 static scan
  const colClass = COLS === 9 ? 'grid-cols-9' : 'grid-cols-7';

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard(ROWS, COLS));
  const [current, setCurrent] = useState<1 | 2>(1);
  const [win, setWin] = useState<WinResult | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [lastDrop, setLastDrop] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState({ 1: 0, 2: 0 });
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [action, setAction] = useState<'place' | 'pop'>('place');

  const gameOver = !!(win || isDraw);

  // Reset when mode changes (user returned to setup and changed mod)
  useEffect(() => {
    setBoard(emptyBoard(ROWS, COLS));
    setCurrent(1);
    setWin(null);
    setIsDraw(false);
    setLastDrop(null);
    setScore({ 1: 0, 2: 0 });
    setAction('place');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const fireConfetti = (player: 1 | 2) => {
    const colors =
      player === 1 ? ['#FF2E4D', '#FF5066', '#ffffff'] : ['#FFCC1F', '#FFE066', '#ffffff'];
    confetti({ particleCount: 130, spread: 75, origin: { y: 0.45 }, colors });
  };

  const applyResult = (next: Cell[][], nextCurrent: 1 | 2) => {
    const result = findWinner(next, WIN_LEN);
    if (result) {
      setWin(result);
      setScore((s) => ({ ...s, [result.player]: s[result.player as 1 | 2] + 1 }));
      fireConfetti(result.player);
    } else if (!isPopOut && next.flat().every((c) => c !== 0)) {
      setIsDraw(true);
    } else {
      setCurrent(nextCurrent === 1 ? 2 : 1);
    }
  };

  const drop = (col: number) => {
    if (gameOver || action !== 'place') return;
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        row = r;
        break;
      }
    }
    if (row === -1) return;

    const next = board.map((r) => [...r]) as Cell[][];
    next[row][col] = current;
    setBoard(next);
    setLastDrop({ row, col });
    applyResult(next, current);
  };

  const popOut = (col: number) => {
    if (gameOver || action !== 'pop') return;
    // Find bottom-most piece of current player in this column
    let bottomRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === current) {
        bottomRow = r;
        break;
      }
    }
    if (bottomRow === -1) return;

    const next = board.map((r) => [...r]) as Cell[][];
    for (let r = bottomRow; r > 0; r--) {
      next[r][col] = next[r - 1][col];
    }
    next[0][col] = 0;
    setBoard(next);
    setLastDrop(null);
    setAction('place');
    applyResult(next, current);
  };

  const handleCellClick = (col: number) => {
    if (action === 'pop') popOut(col);
    else drop(col);
  };

  const rematch = () => {
    setBoard(emptyBoard(ROWS, COLS));
    setCurrent(win ? (win.player === 1 ? 2 : 1) : current === 1 ? 2 : 1);
    setWin(null);
    setIsDraw(false);
    setLastDrop(null);
    setHoverCol(null);
    setAction('place');
  };

  const canPopCol = (col: number): boolean => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] !== 0) return board[r][col] === current;
    }
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <GameHeader
        title="ЧЕТЫРЕ В РЯД"
        subtitle={
          gameOver
            ? win
              ? `Победил ${win.player === 1 ? p1 : p2}!`
              : 'Ничья!'
            : `Ход: ${current === 1 ? p1 : p2}`
        }
        icon={LayoutGrid}
        theme="red"
        onBack={onBack}
      />

      <div className="p-4 flex-1 flex flex-col max-w-sm mx-auto w-full gap-4">
        {/* Scoreboard */}
        <div className="flex items-center justify-between px-1">
          <div
            className={`transition-all duration-300 ${!gameOver && current === 1 ? 'opacity-100' : 'opacity-35'}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-premium-red shadow-[0_0_8px_rgba(255,46,77,0.7)]" />
              <span className="text-base font-black italic uppercase text-white leading-none">
                {p1}
              </span>
            </div>
            <p className="text-micro font-black text-white/40 mt-1 uppercase tracking-widest pl-6">
              {score[1]} побед
            </p>
          </div>

          <span className="text-tag font-black text-white/20 uppercase tracking-widest">vs</span>

          <div
            className={`text-right transition-all duration-300 ${!gameOver && current === 2 ? 'opacity-100' : 'opacity-35'}`}
          >
            <div className="flex items-center justify-end gap-2">
              <span className="text-base font-black italic uppercase text-white leading-none">
                {p2}
              </span>
              <div className="w-4 h-4 rounded-full bg-premium-yellow shadow-[0_0_8px_rgba(255,204,31,0.7)]" />
            </div>
            <p className="text-micro font-black text-white/40 mt-1 uppercase tracking-widest pr-6">
              {score[2]} побед
            </p>
          </div>
        </div>

        {/* Pop Out action toggle */}
        <AnimatePresence>
          {isPopOut && !gameOver && (
            <motion.div
              key="pop-toggle"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-2"
            >
              <button
                onClick={() => setAction('place')}
                className={`flex-1 py-3 rounded-2xl font-black text-label uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                  action === 'place'
                    ? current === 1
                      ? 'bg-premium-red/15 border-premium-red/50 text-premium-red'
                      : 'bg-premium-yellow/15 border-premium-yellow/50 text-premium-yellow'
                    : 'bg-white/5 border-white/10 text-white/30'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                ПОСТАВИТЬ
              </button>
              <button
                onClick={() => setAction('pop')}
                className={`flex-1 py-3 rounded-2xl font-black text-label uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                  action === 'pop'
                    ? 'bg-white/10 border-white/35 text-white'
                    : 'bg-white/5 border-white/10 text-white/30'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                ВЫТАЩИТЬ
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ghost indicator row */}
        <div className={`grid ${colClass} gap-1.5 px-[3px]`}>
          {Array.from({ length: COLS }, (_, c) => {
            const showGhost =
              action === 'place' && hoverCol === c && !gameOver && board[0][c] === 0;
            const showPopDot = isPopOut && action === 'pop' && !gameOver && canPopCol(c);
            return (
              <div key={c} className="aspect-square flex items-center justify-center">
                <AnimatePresence>
                  {showGhost && (
                    <motion.div
                      key="ghost"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 0.45, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: 0.13 }}
                      className={`w-[68%] aspect-square rounded-full ${current === 1 ? 'bg-premium-red' : 'bg-premium-yellow'}`}
                    />
                  )}
                  {showPopDot && (
                    <motion.div
                      key="pop-dot"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 0.65, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: 0.13 }}
                      className="w-[45%] aspect-square rounded-full bg-white/80"
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Board */}
        <div
          className={`rounded-2xl p-[10px] border-2 transition-colors duration-500 ${
            win
              ? win.player === 1
                ? 'bg-premium-red/5 border-premium-red/25'
                : 'bg-premium-yellow/5 border-premium-yellow/25'
              : 'bg-white/4 border-white/10'
          }`}
        >
          <div className={`grid ${colClass} gap-1.5`}>
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const cell = board[r][c];
                const isWinCell = win?.cells.some(([wr, wc]) => wr === r && wc === c) ?? false;
                const isLastDrop = lastDrop?.row === r && lastDrop?.col === c;
                const dimmed = !!(win && !isWinCell);
                const popTarget = isPopOut && action === 'pop' && canPopCol(c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(c)}
                    onMouseEnter={() => setHoverCol(c)}
                    onMouseLeave={() => setHoverCol(null)}
                    disabled={gameOver}
                    className="relative aspect-square"
                  >
                    {/* hole */}
                    <div
                      className={`absolute inset-[3px] rounded-full border transition-colors duration-200 ${
                        popTarget ? 'bg-black/55 border-white/20' : 'bg-black/80 border-white/6'
                      }`}
                    />

                    {/* piece */}
                    <AnimatePresence>
                      {cell !== 0 && (
                        <motion.div
                          key={`p-${r}-${c}-${cell}`}
                          initial={isLastDrop ? { y: -((r + 1) * 54), scale: 0.88 } : false}
                          exit={{ opacity: 0, scale: 0.5 }}
                          animate={{
                            y: 0,
                            scale: isWinCell ? [1, 1.12, 1] : 1,
                            opacity: dimmed ? 0.1 : 1,
                          }}
                          transition={
                            isLastDrop
                              ? { type: 'spring', damping: 17, stiffness: 250, mass: 0.9 }
                              : {
                                  scale: isWinCell
                                    ? { delay: 0.1, duration: 0.45, times: [0, 0.5, 1] }
                                    : { duration: 0 },
                                  opacity: { duration: 0.35 },
                                }
                          }
                          className={`absolute inset-[3px] rounded-full ${
                            cell === 1
                              ? `bg-gradient-to-br from-[#FF5570] to-premium-red ${isWinCell ? 'shadow-[0_0_18px_rgba(255,46,77,0.95)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.5)]'}`
                              : `bg-gradient-to-br from-[#FFE55C] to-premium-yellow ${isWinCell ? 'shadow-[0_0_18px_rgba(255,204,31,0.95)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.5)]'}`
                          }`}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Game over banner */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className={`p-6 rounded-2xl border-2 text-center ${
                win
                  ? win.player === 1
                    ? 'bg-premium-red/10 border-premium-red/40 shadow-[0_0_40px_rgba(255,46,77,0.18)]'
                    : 'bg-premium-yellow/10 border-premium-yellow/40 shadow-[0_0_40px_rgba(255,204,31,0.18)]'
                  : 'bg-white/5 border-white/20'
              }`}
            >
              <p className="text-micro font-black uppercase tracking-[0.45em] text-white/35 mb-2">
                {win ? 'Победитель' : 'Итог раунда'}
              </p>
              <h3
                className={`text-5xl font-black italic uppercase leading-none ${
                  win
                    ? win.player === 1
                      ? 'text-premium-red'
                      : 'text-premium-yellow'
                    : 'text-white/50'
                }`}
              >
                {win ? (win.player === 1 ? p1 : p2) : 'НИЧЬЯ'}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        <PrimaryButton onClick={rematch} icon={RotateCcw} variant={gameOver ? 'white' : 'outline'}>
          {gameOver ? 'РЕВАНШ' : 'НОВАЯ ИГРА'}
        </PrimaryButton>
      </div>
    </div>
  );
};
