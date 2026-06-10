import {RotateCcw, Route} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useCallback, useState} from 'react';

import type {ActionMode, Pos, WallGrid} from './types';

import {GameHeader} from '@/components/GameHeader';
import {PrimaryButton} from '@/components/PrimaryButton';

// ─── Board constants (SVG units) ───────────────────────────────────────────
const CELL = 40;
const GAP = 10;
const STEP = CELL + GAP; // 50
const BOARD_SZ = 9 * CELL + 8 * GAP; // 440
const WALLS_INIT = 10;

const P1_COLOR = '#14b8a6'; // teal  – moves bottom → top
const P2_COLOR = '#ff8a1f'; // orange – moves top → bottom
const PLAYER_COLOR: Record<1 | 2, string> = {1: P1_COLOR, 2: P2_COLOR};

// ─── Pure helpers ──────────────────────────────────────────────────────────

function emptyWalls(): WallGrid {
    return Array.from({length: 8}, () => new Array<0 | 1 | 2>(8).fill(0));
}

// Is the passage between adjacent cells (r1,c1)→(r2,c2) blocked by a wall?
// hWalls[r][c] = horizontal wall between rows r↔r+1, spanning cols c and c+1
// vWalls[r][c] = vertical wall between cols c↔c+1, spanning rows r and r+1
function isBlocked(
    r1: number, c1: number,
    r2: number, c2: number,
    hW: WallGrid, vW: WallGrid,
): boolean {
    if (r2 === r1 - 1) // up
        return !!(hW[r2]?.[c1]) || !!(c1 > 0 && hW[r2]?.[c1 - 1]);
    if (r2 === r1 + 1) // down
        return !!(hW[r1]?.[c1]) || !!(c1 > 0 && hW[r1]?.[c1 - 1]);
    if (c2 === c1 - 1) // left
        return !!(vW[r1]?.[c2]) || !!(r1 > 0 && vW[r1 - 1]?.[c2]);
    if (c2 === c1 + 1) // right
        return !!(vW[r1]?.[c1]) || !!(r1 > 0 && vW[r1 - 1]?.[c1]);
    return true;
}

// Valid pawn destinations including jump-over-opponent rule
function validMoves(
    player: 1 | 2,
    pawns: { 1: Pos; 2: Pos },
    hW: WallGrid, vW: WallGrid,
): Pos[] {
    const {row: r, col: c} = pawns[player];
    const opp = pawns[player === 1 ? 2 : 1];
    const result: Pos[] = [];

    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr > 8 || nc < 0 || nc > 8) continue;
        if (isBlocked(r, c, nr, nc, hW, vW)) continue;

        if (nr !== opp.row || nc !== opp.col) {
            result.push({row: nr, col: nc});
        } else {
            // Jump straight over opponent
            const jr = nr + dr, jc = nc + dc;
            if (jr >= 0 && jr <= 8 && jc >= 0 && jc <= 8 && !isBlocked(nr, nc, jr, jc, hW, vW)) {
                result.push({row: jr, col: jc});
            } else {
                // Wall/edge behind opponent → diagonal jumps
                const perp: [number, number][] = dc === 0 ? [[0, -1], [0, 1]] : [[-1, 0], [1, 0]];
                for (const [pdr, pdc] of perp) {
                    const pr = nr + pdr, pc = nc + pdc;
                    if (pr >= 0 && pr <= 8 && pc >= 0 && pc <= 8 && !isBlocked(nr, nc, pr, pc, hW, vW)) {
                        result.push({row: pr, col: pc});
                    }
                }
            }
        }
    }
    return result;
}

// BFS: can `start` reach goalRow ignoring pawn positions?
function canReach(start: Pos, goalRow: number, hW: WallGrid, vW: WallGrid): boolean {
    const seen = Array.from({length: 9}, () => new Array<boolean>(9).fill(false));
    const q: Pos[] = [start];
    seen[start.row][start.col] = true;
    while (q.length) {
        const {row, col} = q.shift()!;
        if (row === goalRow) return true;
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
            const nr = row + dr, nc = col + dc;
            if (nr < 0 || nr > 8 || nc < 0 || nc > 8 || seen[nr][nc]) continue;
            if (isBlocked(row, col, nr, nc, hW, vW)) continue;
            seen[nr][nc] = true;
            q.push({row: nr, col: nc});
        }
    }
    return false;
}

// Can wall be placed without overlapping/crossing an existing wall?
function canPlaceWall(r: number, c: number, o: 'H' | 'V', hW: WallGrid, vW: WallGrid): boolean {
    if (o === 'H') {
        return !(hW[r][c] || vW[r][c] || (c > 0 && hW[r][c - 1]) || (c < 7 && hW[r][c + 1]));
    }
    return !(vW[r][c] || hW[r][c] || (r > 0 && vW[r - 1][c]) || (r < 7 && vW[r + 1][c]));
}

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
    playerNames: string[];
    onBack: () => void;
}

export const CorridorGame: React.FC<Props> = ({playerNames, onBack}) => {
    const p1 = playerNames[0] ?? 'Игрок 1';
    const p2 = playerNames[1] ?? 'Игрок 2';

    const [pawns, setPawns] = useState<{ 1: Pos; 2: Pos }>({1: {row: 8, col: 4}, 2: {row: 0, col: 4}});
    const [hWalls, setHWalls] = useState(emptyWalls);
    const [vWalls, setVWalls] = useState(emptyWalls);
    const [wallsLeft, setWallsLeft] = useState({1: WALLS_INIT, 2: WALLS_INIT});
    const [current, setCurrent] = useState<1 | 2>(1);
    const [winner, setWinner] = useState<1 | 2 | null>(null);
    const [actionMode, setActionMode] = useState<ActionMode>('move');
    const [hovered, setHovered] = useState<{ r: number; c: number; o: 'H' | 'V' } | null>(null);

    const moves = winner ? [] : validMoves(current, pawns, hWalls, vWalls);
    const curColor = PLAYER_COLOR[current];

    const nextTurn = useCallback(() => {
        setCurrent(c => (c === 1 ? 2 : 1));
        setActionMode('move');
    }, []);

    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (winner || actionMode !== 'move') return;
            if (!moves.some(m => m.row === row && m.col === col)) return;
            const newPawns = {...pawns, [current]: {row, col}};
            setPawns(newPawns);
            if ((current === 1 && row === 0) || (current === 2 && row === 8)) {
                setWinner(current);
                return;
            }
            nextTurn();
        },
        [winner, actionMode, moves, current, pawns, nextTurn],
    );

    const handleWallClick = useCallback(
        (r: number, c: number, o: 'H' | 'V') => {
            if (winner) return;
            if (actionMode !== (o === 'H' ? 'wall_h' : 'wall_v')) return;
            if (wallsLeft[current] <= 0) return;
            if (!canPlaceWall(r, c, o, hWalls, vWalls)) return;

            const newH = hWalls.map(row => [...row]);
            const newV = vWalls.map(row => [...row]);
            if (o === 'H') newH[r][c] = current;
            else newV[r][c] = current;

            // Validate both players still have a path
            if (!canReach(pawns[1], 0, newH, newV) || !canReach(pawns[2], 8, newH, newV)) return;

            if (o === 'H') setHWalls(newH);
            else setVWalls(newV);
            setWallsLeft(prev => ({...prev, [current]: prev[current] - 1}));
            nextTurn();
        },
        [winner, actionMode, wallsLeft, current, hWalls, vWalls, pawns, nextTurn],
    );

    const handleRestart = useCallback(() => {
        setPawns({1: {row: 8, col: 4}, 2: {row: 0, col: 4}});
        setHWalls(emptyWalls());
        setVWalls(emptyWalls());
        setWallsLeft({1: WALLS_INIT, 2: WALLS_INIT});
        setCurrent(1);
        setWinner(null);
        setActionMode('move');
        setHovered(null);
    }, []);

    // ─── SVG board ────────────────────────────────────────────────────────

    const renderBoard = () => {
        const wallOrientation = actionMode === 'wall_h' ? 'H' : actionMode === 'wall_v' ? 'V' : null;

        return (
            <svg
                viewBox={`0 0 ${BOARD_SZ} ${BOARD_SZ}`}
                width="100%"
                style={{display: 'block', touchAction: 'none'}}
            >
                {/* ── Cells ── */}
                {Array.from({length: 9}, (_, r) =>
                    Array.from({length: 9}, (_, c) => {
                        const x = c * STEP, y = r * STEP;
                        const isGoal1 = r === 0, isGoal2 = r === 8;
                        const isValidMove = actionMode === 'move' && moves.some(m => m.row === r && m.col === c);
                        return (
                            <g key={`c${r}${c}`}>
                                <rect
                                    x={x} y={y} width={CELL} height={CELL} rx={4}
                                    fill={isGoal1 ? '#14b8a618' : isGoal2 ? '#ff8a1f18' : 'rgba(255,255,255,0.055)'}
                                    stroke={isGoal1 ? '#14b8a645' : isGoal2 ? '#ff8a1f45' : 'rgba(255,255,255,0.07)'}
                                    strokeWidth={1}
                                    onClick={() => { handleCellClick(r, c); }}
                                    style={{cursor: isValidMove ? 'pointer' : 'default'}}
                                />
                                {!!isValidMove && (
                                    <rect
                                        x={x + 4} y={y + 4} width={CELL - 8} height={CELL - 8} rx={3}
                                        fill={`${curColor}28`}
                                        stroke={`${curColor}b0`}
                                        strokeWidth={2}
                                        pointerEvents="none"
                                    />
                                  )}
                            </g>
                        );
                    }),
                )}

                {/* ── Wall slots (interactive, shown in wall mode) ── */}
                {!winner && !!wallOrientation && wallsLeft[current] > 0 && Array.from({length: 8}, (_, r) =>
                        Array.from({length: 8}, (_, c) => {
                            if (!canPlaceWall(r, c, wallOrientation, hWalls, vWalls)) return null;
                            const isHov = hovered?.r === r && hovered?.c === c && hovered?.o === wallOrientation;
                            if (wallOrientation === 'H') {
                                return (
                                    <rect
                                        key={`hs${r}${c}`}
                                        x={c * STEP} y={r * STEP + CELL}
                                        width={2 * CELL + GAP} height={GAP} rx={3}
                                        fill={isHov ? `${curColor}bb` : `${curColor}35`}
                                        onClick={() => { handleWallClick(r, c, 'H'); }}
                                        onMouseEnter={() => { setHovered({r, c, o: 'H'}); }}
                                        onMouseLeave={() => { setHovered(null); }}
                                        style={{cursor: 'pointer'}}
                                    />
                                );
                            }
                            return (
                                <rect
                                    key={`vs${r}${c}`}
                                    x={c * STEP + CELL} y={r * STEP}
                                    width={GAP} height={2 * CELL + GAP} rx={3}
                                    fill={isHov ? `${curColor}bb` : `${curColor}35`}
                                    onClick={() => { handleWallClick(r, c, 'V'); }}
                                    onMouseEnter={() => { setHovered({r, c, o: 'V'}); }}
                                    onMouseLeave={() => { setHovered(null); }}
                                    style={{cursor: 'pointer'}}
                                />
                            );
                        }),
                    )}

                {/* ── Placed walls ── */}
                {hWalls.flatMap((row, r) =>
                    row.map((placed, c) =>
                        placed ? (
                            <rect
                                key={`hw${r}${c}`}
                                x={c * STEP} y={r * STEP + CELL}
                                width={2 * CELL + GAP} height={GAP} rx={3}
                                fill={PLAYER_COLOR[placed as 1 | 2]}
                                pointerEvents="none"
                            />
                        ) : null,
                    ),
                )}
                {vWalls.flatMap((row, r) =>
                    row.map((placed, c) =>
                        placed ? (
                            <rect
                                key={`vw${r}${c}`}
                                x={c * STEP + CELL} y={r * STEP}
                                width={GAP} height={2 * CELL + GAP} rx={3}
                                fill={PLAYER_COLOR[placed as 1 | 2]}
                                pointerEvents="none"
                            />
                        ) : null,
                    ),
                )}

                {/* ── Pawns (spring-animated) ── */}
                {([1, 2] as const).map(p => {
                    const cx = pawns[p].col * STEP + CELL / 2;
                    const cy = pawns[p].row * STEP + CELL / 2;
                    const color = PLAYER_COLOR[p];
                    const label = (p === 1 ? p1 : p2).slice(0, 2).toUpperCase();
                    return (
                        <motion.g
                            key={`pawn${p}`}
                            animate={{x: cx, y: cy}}
                            initial={false}
                            transition={{type: 'spring', stiffness: 380, damping: 32}}
                        >
                            <circle r={15} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={2}/>
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={10}
                                fontWeight="900"
                                fill="rgba(0,0,0,0.72)"
                                style={{userSelect: 'none', pointerEvents: 'none'}}
                            >
                                {label}
                            </text>
                        </motion.g>
                    );
                })}
            </svg>
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col relative" style={{minHeight: '100dvh'}}>
            <GameHeader
                title="КОРИДОР"
                subtitle="Первым пройди на другую сторону"
                icon={Route}
                theme="teal"
                onBack={onBack}
            />

            {/* Player status bar */}
            <div className="flex border-b border-white/6">
                {([1, 2] as const).map(p => {
                    const isActive = current === p && !winner;
                    const name = p === 1 ? p1 : p2;
                    const goalArrow = p === 1 ? '↑' : '↓';
                    return (
                        <div
                            key={p}
                            className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 transition-all duration-200 ${isActive ? 'bg-white/[0.055]' : 'opacity-40'}`}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-black shrink-0"
                                style={{background: PLAYER_COLOR[p]}}
                            >
                                {goalArrow}
                            </div>
                            <div className="min-w-0">
                                <div
                                    className="text-xs font-black uppercase tracking-tight text-white truncate leading-none">
                                    {name}
                                </div>
                                <div className="text-micro text-white/35 font-black uppercase tracking-[0.25em] mt-0.5">
                                    {wallsLeft[p]} стен
                                </div>
                            </div>
                            {!!isActive && (
                                <span
                                    className="ml-auto text-tag font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-full shrink-0"
                                    style={{background: `${PLAYER_COLOR[p]}22`, color: PLAYER_COLOR[p]}}
                                >
                                    ХОД
                                </span>
                              )}
                        </div>
                    );
                })}
            </div>

            {/* Board */}
            <div className="flex-1 px-3 py-3">
                {renderBoard()}
            </div>

            {/* Action controls */}
            {!winner && (
                <div className="px-4 pb-safe-bottom pb-4 pt-1 safe-bottom">
                    <div className="flex gap-2">
                        {(
                            [
                                {m: 'move' as ActionMode, label: 'Ход', hint: 'передвинь фишку'},
                                {m: 'wall_h' as ActionMode, label: 'Стена ─', hint: 'горизонт.'},
                                {m: 'wall_v' as ActionMode, label: 'Стена │', hint: 'вертикал.'},
                            ] as const
                        ).map(({m, label, hint}) => {
                            const isActive = actionMode === m;
                            const isWallBtn = m === 'wall_h' || m === 'wall_v';
                            const disabled = isWallBtn && wallsLeft[current] === 0;
                            return (
                                <button
                                    key={m}
                                    onClick={() => {
                                        if (!disabled) setActionMode(m);
                                    }}
                                    disabled={disabled}
                                    className="flex-1 py-2.5 rounded-premium-sm flex flex-col items-center gap-0.5 transition-all active:scale-95 disabled:opacity-20"
                                    style={{
                                        background: isActive ? `${curColor}22` : 'rgba(255,255,255,0.05)',
                                        border: `1.5px solid ${isActive ? `${curColor}55` : 'rgba(255,255,255,0.08)'}`,
                                        color: isActive ? curColor : 'rgba(255,255,255,0.45)',
                                    }}
                                >
                                    <span className="text-xs font-black uppercase tracking-wide">{label}</span>
                                    <span
                                        className="text-micro font-medium opacity-55 normal-case tracking-normal">{hint}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Game Over overlay */}
            <AnimatePresence>
                {!!winner && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="absolute inset-0 z-50 flex items-center justify-center"
                        style={{
                            background: 'rgba(11,9,21,0.88)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                        }}
                    >
                        <motion.div
                            initial={{scale: 0.85, y: 24}}
                            animate={{scale: 1, y: 0}}
                            transition={{type: 'spring', stiffness: 280, damping: 24}}
                            className="glass-card rounded-premium-2xl p-8 mx-6 text-center w-full"
                            style={{borderColor: `${PLAYER_COLOR[winner]}35`}}
                        >
                            <div
                                className="font-display font-black italic uppercase tracking-tighter leading-none"
                                style={{fontSize: '4rem', color: PLAYER_COLOR[winner]}}
                            >
                                Победа!
                            </div>
                            <div
                                className="text-2xl font-black uppercase tracking-tighter text-white mt-2 leading-none">
                                {winner === 1 ? p1 : p2}
                            </div>
                            <div className="text-xs text-white/35 mt-1.5 uppercase tracking-[0.3em] font-black">
                                достиг финиша
                            </div>

                            <div className="mt-8 space-y-2">
                                <PrimaryButton variant="white" icon={RotateCcw} onClick={handleRestart}>
                                    Играть снова
                                </PrimaryButton>
                                <PrimaryButton variant="outline" onClick={onBack}>
                                    В меню
                                </PrimaryButton>
                            </div>
                        </motion.div>
                    </motion.div>
                  )}
            </AnimatePresence>
        </div>
    );
};
