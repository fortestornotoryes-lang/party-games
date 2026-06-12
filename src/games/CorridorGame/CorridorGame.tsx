import {Route} from 'lucide-react';
import React, {useCallback, useState} from 'react';

import {ActionControls} from './components/ActionControls';
import type {HoveredSlot} from './components/CorridorBoard';
import {CorridorBoard} from './components/CorridorBoard';
import {GameOverOverlay} from './components/GameOverOverlay';
import {PlayerStatusBar} from './components/PlayerStatusBar';
import {PLAYER_COLOR, WALLS_INIT} from './constants';
import {canPlaceWall, canReach, emptyWalls, validMoves} from './helpers';
import {ActionMode, type Pos, type WallGrid} from './types';

import {GameHeader} from '@/components/GameHeader';
import {GameKey} from '@/entities/game/types';
import {usePersistedState} from '@/shared/hooks/usePersistedState';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

interface Props {
    playerNames: string[];
    onBack: () => void;
}

export const CorridorGame: React.FC<Props> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const p1 = playerNames[0] ?? t(`${NS.CORRIDOR}.player1`);
    const p2 = playerNames[1] ?? t(`${NS.CORRIDOR}.player2`);

    const K = GameKey.Corridor;
    const [pawns, setPawns] = usePersistedState<{ 1: Pos; 2: Pos }>(K, 'pawns', {
        1: {row: 8, col: 4},
        2: {row: 0, col: 4},
    });
    const [hWalls, setHWalls] = usePersistedState<WallGrid>(K, 'hWalls', emptyWalls);
    const [vWalls, setVWalls] = usePersistedState<WallGrid>(K, 'vWalls', emptyWalls);
    const [wallsLeft, setWallsLeft] = usePersistedState<Record<1 | 2, number>>(K, 'wallsLeft', {
        1: WALLS_INIT,
        2: WALLS_INIT,
    });
    const [current, setCurrent] = usePersistedState<1 | 2>(K, 'current', 1);
    const [winner, setWinner] = usePersistedState<1 | 2 | null>(K, 'winner', null);
    const [actionMode, setActionMode] = usePersistedState<ActionMode>(K, 'actionMode', ActionMode.Move);
    const [hovered, setHovered] = useState<HoveredSlot | null>(null);

    const moves = winner ? [] : validMoves(current, pawns, hWalls, vWalls);
    const curColor = PLAYER_COLOR[current];

    const nextTurn = useCallback(() => {
        setCurrent(c => (c === 1 ? 2 : 1));
        setActionMode(ActionMode.Move);
    }, []);

    const handleCellClick = useCallback(
        (row: number, col: number) => {
            if (winner || actionMode !== ActionMode.Move) return;
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
            if (actionMode !== (o === 'H' ? ActionMode.WallH : ActionMode.WallV)) return;
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
        setActionMode(ActionMode.Move);
        setHovered(null);
    }, []);

    return (
        <div className="flex flex-col relative" style={{minHeight: '100dvh'}}>
            <GameHeader
                title={t(`${NS.CORRIDOR}.title`)}
                subtitle={t(`${NS.CORRIDOR}.subtitle`)}
                icon={Route}
                theme="teal"
                onBack={onBack}
            />

            <PlayerStatusBar p1={p1} p2={p2} current={current} winner={winner} wallsLeft={wallsLeft}/>

            {/* Board */}
            <div className="flex-1 px-3 py-3">
                <CorridorBoard
                    pawns={pawns}
                    hWalls={hWalls}
                    vWalls={vWalls}
                    moves={moves}
                    actionMode={actionMode}
                    current={current}
                    winner={winner}
                    wallsLeft={wallsLeft}
                    curColor={curColor}
                    p1={p1}
                    p2={p2}
                    hovered={hovered}
                    onHover={setHovered}
                    onCellClick={handleCellClick}
                    onWallClick={handleWallClick}
                />
            </div>

            {!winner && (
                <ActionControls
                    actionMode={actionMode}
                    curColor={curColor}
                    wallsDepleted={wallsLeft[current] === 0}
                    onSelect={setActionMode}
                />
            )}

            <GameOverOverlay winner={winner} p1={p1} p2={p2} onRestart={handleRestart} onBack={onBack}/>
        </div>
    );
};
