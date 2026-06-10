import {AnimatePresence, motion} from 'motion/react';
import React from 'react';

import {canPopColumn} from '../helpers';
import {C4Action, type C4Player, type Cell, type WinResult} from '../types';

interface Props {
    board: Cell[][];
    rows: number;
    cols: number;
    colClass: string;
    current: C4Player;
    action: C4Action;
    isPopOut: boolean;
    win: WinResult | null;
    lastDrop: { row: number; col: number } | null;
    gameOver: boolean;
    hoverCol: number | null;
    onHover: (col: number | null) => void;
    onCellClick: (col: number) => void;
}

export const Board: React.FC<Props> = ({
                                           board,
                                           rows,
                                           cols,
                                           colClass,
                                           current,
                                           action,
                                           isPopOut,
                                           win,
                                           lastDrop,
                                           gameOver,
                                           hoverCol,
                                           onHover,
                                           onCellClick,
                                       }) => (
    <>
        {/* Ghost indicator row */}
        <div className={`grid ${colClass} gap-1.5 px-[3px]`}>
            {Array.from({length: cols}, (_, c) => {
                const showGhost =
                    action === C4Action.Place && hoverCol === c && !gameOver && board[0][c] === 0;
                const showPopDot = isPopOut && action === C4Action.Pop && !gameOver && canPopColumn(board, c, current);
                return (
                    <div key={c} className="aspect-square flex items-center justify-center">
                        <AnimatePresence>
                            {!!showGhost && (
                                <motion.div
                                    key="ghost"
                                    initial={{opacity: 0, scale: 0.4}}
                                    animate={{opacity: 0.45, scale: 1}}
                                    exit={{opacity: 0, scale: 0.4}}
                                    transition={{duration: 0.13}}
                                    className={`w-[68%] aspect-square rounded-full ${current === 1 ? 'bg-premium-red' : 'bg-premium-yellow'}`}
                                />
                            )}
                            {!!showPopDot && (
                                <motion.div
                                    key="pop-dot"
                                    initial={{opacity: 0, scale: 0.4}}
                                    animate={{opacity: 0.65, scale: 1}}
                                    exit={{opacity: 0, scale: 0.4}}
                                    transition={{duration: 0.13}}
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
            className={`rounded-premium-md p-[10px] border-2 transition-colors duration-500 ${
                win
                    ? win.player === 1
                        ? 'bg-premium-red/5 border-premium-red/25'
                        : 'bg-premium-yellow/5 border-premium-yellow/25'
                    : 'bg-white/4 border-white/10'
            }`}
        >
            <div className={`grid ${colClass} gap-1.5`}>
                {Array.from({length: rows}, (_, r) =>
                    Array.from({length: cols}, (_, c) => {
                        const cell = board[r][c];
                        const isWinCell = win?.cells.some(([wr, wc]) => wr === r && wc === c) ?? false;
                        const isLastDrop = lastDrop?.row === r && lastDrop?.col === c;
                        const dimmed = !!(win && !isWinCell);
                        const popTarget = isPopOut && action === C4Action.Pop && canPopColumn(board, c, current);

                        return (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => {
                                    onCellClick(c);
                                }}
                                onMouseEnter={() => {
                                    onHover(c);
                                }}
                                onMouseLeave={() => {
                                    onHover(null);
                                }}
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
                                            initial={isLastDrop ? {y: -((r + 1) * 54), scale: 0.88} : false}
                                            exit={{opacity: 0, scale: 0.5}}
                                            animate={{
                                                y: 0,
                                                scale: isWinCell ? [1, 1.12, 1] : 1,
                                                opacity: dimmed ? 0.1 : 1,
                                            }}
                                            transition={
                                                isLastDrop
                                                    ? {type: 'spring', damping: 17, stiffness: 250, mass: 0.9}
                                                    : {
                                                        scale: isWinCell
                                                            ? {delay: 0.1, duration: 0.45, times: [0, 0.5, 1]}
                                                            : {duration: 0},
                                                        opacity: {duration: 0.35},
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
    </>
);
