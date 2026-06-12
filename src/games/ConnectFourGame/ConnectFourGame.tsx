import confetti from 'canvas-confetti';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';


import { Board } from './components/Board';
import { GameOverBanner } from './components/GameOverBanner';
import { PopOutToggle } from './components/PopOutToggle';
import { Scoreboard } from './components/Scoreboard';
import {
  emptyBoard,
  findDropRow,
  findWinner,
  getBoardConfig,
  isBoardFull,
  popOutPiece,
} from './helpers';
import { C4Action, type C4Player, type Cell, type WinResult } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export const ConnectFourGame: React.FC<Props> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { mode } = useGameSettings();

  const p1 = playerNames[0] ?? t(`${NS.CONNECT_FOUR}.player1`);
  const p2 = playerNames[1] ?? t(`${NS.CONNECT_FOUR}.player2`);

  const { rows: ROWS, cols: COLS, winLen: WIN_LEN, isPopOut } = getBoardConfig(mode);
  // Literal class strings — needed for Tailwind v4 static scan
  const colClass = COLS === 9 ? 'grid-cols-9' : 'grid-cols-7';

  const K = GameKey.ConnectFour;
  const [board, setBoard] = usePersistedState<Cell[][]>(K, 'board', () => emptyBoard(ROWS, COLS));
  const [current, setCurrent] = usePersistedState<C4Player>(K, 'current', 1);
  const [win, setWin] = usePersistedState<WinResult | null>(K, 'win', null);
  const [isDraw, setIsDraw] = usePersistedState(K, 'isDraw', false);
  const [lastDrop, setLastDrop] = usePersistedState<{ row: number; col: number } | null>(
    K,
    'lastDrop',
    null
  );
  const [score, setScore] = usePersistedState<Record<C4Player, number>>(K, 'score', { 1: 0, 2: 0 });
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [action, setAction] = usePersistedState<C4Action>(K, 'action', C4Action.Place);

  const gameOver = !!(win || isDraw);
  const showPopToggle = isPopOut && !gameOver;

  // Reset when mode changes (user returned to setup and changed mode).
  // Сравниваем с режимом, сохранённым в сессии, чтобы не сбрасывать
  // восстановленную после перезагрузки партию.
  const [sessionMode, setSessionMode] = usePersistedState(K, 'mode', mode);
  useEffect(() => {
    if (sessionMode === mode) return;
    setSessionMode(mode);
    setBoard(emptyBoard(ROWS, COLS));
    setCurrent(1);
    setWin(null);
    setIsDraw(false);
    setLastDrop(null);
    setScore({ 1: 0, 2: 0 });
    setAction(C4Action.Place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const fireConfetti = (player: C4Player) => {
    const colors =
      player === 1 ? ['#FF2E4D', '#FF5066', '#ffffff'] : ['#FFCC1F', '#FFE066', '#ffffff'];
    confetti({ particleCount: 130, spread: 75, origin: { y: 0.45 }, colors });
  };

  const applyResult = (next: Cell[][], nextCurrent: C4Player) => {
    const result = findWinner(next, WIN_LEN);
    if (result) {
      setWin(result);
      setScore((s) => ({ ...s, [result.player]: s[result.player] + 1 }));
      fireConfetti(result.player);
    } else if (!isPopOut && isBoardFull(next)) {
      setIsDraw(true);
    } else {
      setCurrent(nextCurrent === 1 ? 2 : 1);
    }
  };

  const drop = (col: number) => {
    if (gameOver || action !== C4Action.Place) return;
    const row = findDropRow(board, col);
    if (row === -1) return;

    const next = board.map((r) => [...r]);
    next[row][col] = current;
    setBoard(next);
    setLastDrop({ row, col });
    applyResult(next, current);
  };

  const popOut = (col: number) => {
    if (gameOver || action !== C4Action.Pop) return;
    const next = popOutPiece(board, col, current);
    if (!next) return;

    setBoard(next);
    setLastDrop(null);
    setAction(C4Action.Place);
    applyResult(next, current);
  };

  const handleCellClick = (col: number) => {
    if (action === C4Action.Pop) popOut(col);
    else drop(col);
  };

  const rematch = () => {
    setBoard(emptyBoard(ROWS, COLS));
    setCurrent(win ? (win.player === 1 ? 2 : 1) : current === 1 ? 2 : 1);
    setWin(null);
    setIsDraw(false);
    setLastDrop(null);
    setHoverCol(null);
    setAction(C4Action.Place);
  };

  const subtitle = gameOver
    ? win
      ? t(`${NS.CONNECT_FOUR}.winnerLine`, { player: win.player === 1 ? p1 : p2 })
      : t(`${NS.CONNECT_FOUR}.drawResult`)
    : t(`${NS.CONNECT_FOUR}.currentTurn`, { player: current === 1 ? p1 : p2 });

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <GameHeader
        title={t(`${NS.CONNECT_FOUR}.title`)}
        subtitle={subtitle}
        icon={LayoutGrid}
        theme="red"
        onBack={onBack}
      />

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 p-4">
        <Scoreboard p1={p1} p2={p2} current={current} gameOver={gameOver} score={score} />

        <PopOutToggle show={showPopToggle} action={action} current={current} onChange={setAction} />

        <Board
          board={board}
          rows={ROWS}
          cols={COLS}
          colClass={colClass}
          current={current}
          action={action}
          isPopOut={isPopOut}
          win={win}
          lastDrop={lastDrop}
          gameOver={gameOver}
          hoverCol={hoverCol}
          onHover={setHoverCol}
          onCellClick={handleCellClick}
        />

        <GameOverBanner show={gameOver} win={win} p1={p1} p2={p2} />

        <PrimaryButton onClick={rematch} icon={RotateCcw} variant={gameOver ? 'white' : 'outline'}>
          {gameOver ? t(`${NS.COMMON}.rematch`) : t(`${NS.CONNECT_FOUR}.newGame`)}
        </PrimaryButton>
      </div>
    </div>
  );
};
