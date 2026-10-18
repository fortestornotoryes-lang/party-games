// Ложное срабатывание @typescript-eslint/no-deprecated на x/y пропсах <Rect>: RectProps.x/.y
// (позиция, react-native-svg) переопределяют собственным объявлением унаследованный из
// TransformProps.x/.y (устаревший shorthand трансформации) в цепочке extends
// CommonPathProps → TransformProps. К трансформациям это не относится — см. gotchas.md.
/* eslint-disable @typescript-eslint/no-deprecated */
import React, { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, G, Rect, Text as SvgText } from 'react-native-svg';

import { BOARD_SZ, CELL, GAP, PLAYER_COLOR, STEP } from '../constants';
import { canPlaceWall } from '../helpers';
import { ActionMode, type Pos, type WallGrid } from '../types';

// Пустой интерфейс сохранён для совместимости сигнатуры пропсов — hover в RN не применим (нет мыши)
export interface HoveredSlot { r: number; c: number; o: 'H' | 'V' }

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
  onCellClick: (row: number, col: number) => void;
  onWallClick: (r: number, c: number, o: 'H' | 'V') => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

/** Пешка на пружинной анимации позиции (веб-аналог motion.g animate={{x,y}}) */
const Pawn: React.FC<{ pos: Pos; color: string; label: string }> = ({ pos, color, label }) => {
  const cx = pos.col * STEP + CELL / 2;
  const cy = pos.row * STEP + CELL / 2;
  const x = useSharedValue(cx);
  const y = useSharedValue(cy);

  useEffect(() => {
    // react-hooks/immutability не распознаёт reanimated SharedValue — presence-мутация `.value`
    // это штатный API, а не изменение возвращённого хуком значения.
    // eslint-disable-next-line react-hooks/immutability
    x.value = withSpring(cx, { stiffness: 380, damping: 32 });
    // eslint-disable-next-line react-hooks/immutability
    y.value = withSpring(cy, { stiffness: 380, damping: 32 });
  }, [cx, cy, x, y]);

  const circleProps = useAnimatedProps(() => ({ cx: x.value, cy: y.value }));
  const textProps = useAnimatedProps(() => ({ x: x.value, y: y.value }));

  return (
    <>
      <AnimatedCircle
        animatedProps={circleProps}
        r={15}
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={2}
      />
      <AnimatedText
        animatedProps={textProps}
        textAnchor="middle"
        dy={4}
        fontSize={10}
        fontWeight="900"
        fill="rgba(0,0,0,0.72)"
      >
        {label}
      </AnimatedText>
    </>
  );
};

/**
 * Доска Corridor на react-native-svg. Hover-подсветка слотов стены (веб onMouseEnter)
 * не переносится — на тач-устройствах её нет; слоты стены показаны единым полупрозрачным цветом.
 */
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
  onCellClick,
  onWallClick,
}) => {
  const wallOrientation =
    actionMode === ActionMode.WallH ? 'H' : actionMode === ActionMode.WallV ? 'V' : null;

  return (
    <Svg viewBox={`0 0 ${BOARD_SZ} ${BOARD_SZ}`} width="100%" height="100%">
      {/* ── Клетки ── */}
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => {
          const x = c * STEP,
            y = r * STEP;
          const isGoal1 = r === 0,
            isGoal2 = r === 8;
          const isValidMove =
            actionMode === ActionMode.Move && moves.some((m) => m.row === r && m.col === c);
          return (
            <G key={`c${r}${c}`}>
              <Rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={4}
                fill={isGoal1 ? '#14b8a618' : isGoal2 ? '#ff8a1f18' : 'rgba(255,255,255,0.055)'}
                stroke={isGoal1 ? '#14b8a645' : isGoal2 ? '#ff8a1f45' : 'rgba(255,255,255,0.07)'}
                strokeWidth={1}
                onPress={() => {
                  onCellClick(r, c);
                }}
              />
              {!!isValidMove && (
                <Rect
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
            </G>
          );
        })
      )}

      {/* ── Слоты установки стены (в режиме стены) ── */}
      {!winner &&
        !!wallOrientation &&
        wallsLeft[current] > 0 &&
        Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => {
            if (!canPlaceWall(r, c, wallOrientation, hWalls, vWalls)) return null;
            if (wallOrientation === 'H') {
              return (
                <Rect
                  key={`hs${r}${c}`}
                  x={c * STEP}
                  y={r * STEP + CELL}
                  width={2 * CELL + GAP}
                  height={GAP}
                  rx={3}
                  fill={`${curColor}35`}
                  onPress={() => {
                    onWallClick(r, c, 'H');
                  }}
                />
              );
            }
            return (
              <Rect
                key={`vs${r}${c}`}
                x={c * STEP + CELL}
                y={r * STEP}
                width={GAP}
                height={2 * CELL + GAP}
                rx={3}
                fill={`${curColor}35`}
                onPress={() => {
                  onWallClick(r, c, 'V');
                }}
              />
            );
          })
        )}

      {/* ── Установленные стены ── */}
      {hWalls.flatMap((row, r) =>
        row.map((placed, c) =>
          placed ? (
            <Rect
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
            <Rect
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

      {/* ── Пешки (пружинная анимация) ── */}
      <Pawn pos={pawns[1]} color={PLAYER_COLOR[1]} label={p1.slice(0, 2).toUpperCase()} />
      <Pawn pos={pawns[2]} color={PLAYER_COLOR[2]} label={p2.slice(0, 2).toUpperCase()} />
    </Svg>
  );
};
