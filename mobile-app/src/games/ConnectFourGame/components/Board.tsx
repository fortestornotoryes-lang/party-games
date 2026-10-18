import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, View } from 'react-native';

import { canPopColumn } from '../helpers';
import { C4Action, type C4Player, type Cell, type WinResult } from '../types';

interface Props {
  board: Cell[][];
  rows: number;
  cols: number;
  current: C4Player;
  action: C4Action;
  isPopOut: boolean;
  win: WinResult | null;
  lastDrop: { row: number; col: number } | null;
  gameOver: boolean;
  onCellClick: (col: number) => void;
}

/**
 * Доска Connect Four. В RN нет hover — верхняя строка-«призрак» из веба
 * (подсветка колонки при наведении курсора) не переносится, остаётся
 * только индикатор доступных колонок в режиме Pop Out.
 */
export const Board: React.FC<Props> = ({
  board,
  rows,
  cols,
  current,
  action,
  isPopOut,
  win,
  lastDrop,
  gameOver,
  onCellClick,
}) => {
  const colWidth: DimensionValue = `${100 / cols}%`;

  return (
    <>
      {/* Индикатор колонок, доступных для Pop Out */}
      {!!isPopOut && action === C4Action.Pop && !gameOver && (
        <View className="flex-row flex-wrap px-[3px]">
          {Array.from({ length: cols }, (_, c) => {
            const showPopDot = canPopColumn(board, c, current);
            return (
              <View
                key={c}
                className="aspect-square items-center justify-center"
                style={{ width: colWidth }}
              >
                {!!showPopDot && (
                  <View className="aspect-square rounded-full bg-white/65" style={{ width: '45%' }} />
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Доска */}
      <View
        className={`rounded-premium-md border-2 p-[10px] ${
          win
            ? win.player === 1
              ? 'bg-premium-red/5 border-premium-red/25'
              : 'bg-premium-yellow/5 border-premium-yellow/25'
            : 'border-white/10 bg-white/5'
        }`}
      >
        <View className="flex-row flex-wrap">
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const cell = board[r][c];
              const isWinCell = win?.cells.some(([wr, wc]) => wr === r && wc === c) ?? false;
              const isLastDrop = lastDrop?.row === r && lastDrop?.col === c;
              const dimmed = !!(win && !isWinCell);
              const popTarget = isPopOut && action === C4Action.Pop && canPopColumn(board, c, current);

              return (
                <View key={`${r}-${c}`} style={{ width: colWidth, padding: 3 }}>
                  <Pressable
                    onPress={() => {
                      onCellClick(c);
                    }}
                    disabled={gameOver}
                    style={{ aspectRatio: 1 }}
                  >
                    {/* Лунка */}
                    <View
                      className={`absolute inset-0 rounded-full border ${
                        popTarget ? 'border-white/20 bg-black/55' : 'border-white/5 bg-black/80'
                      }`}
                    />

                    {/* Фишка */}
                    <AnimatePresence>
                      {cell !== 0 && (
                        <MotiView
                          key={`p-${r}-${c}-${cell}`}
                          from={
                            isLastDrop
                              ? { translateY: -((r + 1) * 54), scale: 0.88 }
                              : { opacity: 1 }
                          }
                          exit={{ opacity: 0, scale: 0.5 }}
                          animate={{
                            translateY: 0,
                            scale: isWinCell ? 1.12 : 1,
                            opacity: dimmed ? 0.1 : 1,
                          }}
                          transition={
                            isLastDrop
                              ? { type: 'spring', damping: 17, stiffness: 250, mass: 0.9 }
                              : { type: 'timing', duration: 350 }
                          }
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: cell === 1 ? '#FF5570' : '#FFE55C',
                            shadowColor: cell === 1 ? '#FF2E4D' : '#FFCC1F',
                            shadowOpacity: isWinCell ? 0.95 : 0.5,
                            shadowRadius: isWinCell ? 18 : 6,
                            shadowOffset: { width: 0, height: isWinCell ? 0 : 2 },
                            elevation: isWinCell ? 10 : 4,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </View>
    </>
  );
};
