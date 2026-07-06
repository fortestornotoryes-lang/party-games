import { motion } from 'motion/react';
import React from 'react';

import { BOARD_SZ, CELL, GAP, PLAYER_COLOR, STEP } from '../constants';
import { canPlaceWall } from '../helpers';
import { ActionMode, type Pos, type WallGrid } from '../types';

export interface HoveredSlot {
  r: number;
  c: number;
  o: 'H' | 'V';
}

interface Props {
  pawns: { 1: Pos; 2: Pos };
  hWalls: WallGrid;
  vWalls: WallGrid;
  moves: Pos[];
  actionMode: ActionMode;
  current: 1 | 2;
  winner: 1 | 2 | null;
  wallsLeft: Record<1 | 2, number>;
  curColor: string;
  p1: string;
  p2: string;
  hovered: HoveredSlot | null;
  onHover: (slot: HoveredSlot | null) => void;
  onCellClick: (row: number, col: number) => void;
  onWallClick: (r: number, c: number, o: 'H' | 'V') => void;
}

export const CorridorBoard: React.FC<Props> = ({
  pawns,
  hWalls,
  vWalls,
  moves,
  actionMode,
  current,
  winner,
  wallsLeft,
  curColor,
  p1,
  p2,
  hovered,
  onHover,
  onCellClick,
  onWallClick,
}) => {
  const wallOrientation =
    actionMode === ActionMode.WallH ? 'H' : actionMode === ActionMode.WallV ? 'V' : null;

  return (
    <svg
      viewBox={`0 0 ${BOARD_SZ} ${BOARD_SZ}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none' }}
    >
      {/* ── Cells ── */}
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => {
          const x = c * STEP,
            y = r * STEP;
          const isGoal1 = r === 0,
            isGoal2 = r === 8;
          const isValidMove =
            actionMode === ActionMode.Move && moves.some((m) => m.row === r && m.col === c);
          return (
            <g key={`c${r}${c}`}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={4}
                fill={isGoal1 ? '#14b8a618' : isGoal2 ? '#ff8a1f18' : 'rgba(255,255,255,0.055)'}
                stroke={isGoal1 ? '#14b8a645' : isGoal2 ? '#ff8a1f45' : 'rgba(255,255,255,0.07)'}
                strokeWidth={1}
                onClick={() => {
                  onCellClick(r, c);
                }}
                style={{ cursor: isValidMove ? 'pointer' : 'default' }}
              />
              {isValidMove && (
                <rect
                  x={x + 4}
                  y={y + 4}
                  width={CELL - 8}
                  height={CELL - 8}
                  rx={3}
                  fill={`${curColor}28`}
                  stroke={`${curColor}b0`}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })
      )}

      {/* ── Wall slots (interactive, shown in wall mode) ── */}
      {!winner &&
        !!wallOrientation &&
        wallsLeft[current] > 0 &&
        Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => {
            if (!canPlaceWall(r, c, wallOrientation, hWalls, vWalls)) return null;
            const isHov = hovered?.r === r && hovered?.c === c && hovered?.o === wallOrientation;
            if (wallOrientation === 'H') {
              return (
                <rect
                  key={`hs${r}${c}`}
                  x={c * STEP}
                  y={r * STEP + CELL}
                  width={2 * CELL + GAP}
                  height={GAP}
                  rx={3}
                  fill={isHov ? `${curColor}bb` : `${curColor}35`}
                  onClick={() => {
                    onWallClick(r, c, 'H');
                  }}
                  onMouseEnter={() => {
                    onHover({ r, c, o: 'H' });
                  }}
                  onMouseLeave={() => {
                    onHover(null);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              );
            }
            return (
              <rect
                key={`vs${r}${c}`}
                x={c * STEP + CELL}
                y={r * STEP}
                width={GAP}
                height={2 * CELL + GAP}
                rx={3}
                fill={isHov ? `${curColor}bb` : `${curColor}35`}
                onClick={() => {
                  onWallClick(r, c, 'V');
                }}
                onMouseEnter={() => {
                  onHover({ r, c, o: 'V' });
                }}
                onMouseLeave={() => {
                  onHover(null);
                }}
                style={{ cursor: 'pointer' }}
              />
            );
          })
        )}

      {/* ── Placed walls ── */}
      {hWalls.flatMap((row, r) =>
        row.map((placed, c) =>
          placed ? (
            <rect
              key={`hw${r}${c}`}
              x={c * STEP}
              y={r * STEP + CELL}
              width={2 * CELL + GAP}
              height={GAP}
              rx={3}
              fill={PLAYER_COLOR[placed]}
              pointerEvents="none"
            />
          ) : null
        )
      )}
      {vWalls.flatMap((row, r) =>
        row.map((placed, c) =>
          placed ? (
            <rect
              key={`vw${r}${c}`}
              x={c * STEP + CELL}
              y={r * STEP}
              width={GAP}
              height={2 * CELL + GAP}
              rx={3}
              fill={PLAYER_COLOR[placed]}
              pointerEvents="none"
            />
          ) : null
        )
      )}

      {/* ── Pawns (spring-animated) ── */}
      {([1, 2] as const).map((p) => {
        const cx = pawns[p].col * STEP + CELL / 2;
        const cy = pawns[p].row * STEP + CELL / 2;
        const color = PLAYER_COLOR[p];
        const label = (p === 1 ? p1 : p2).slice(0, 2).toUpperCase();
        return (
          <motion.g
            key={`pawn${p}`}
            animate={{ x: cx, y: cy }}
            initial={false}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <circle r={15} fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10}
              fontWeight="900"
              fill="rgba(0,0,0,0.72)"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};
