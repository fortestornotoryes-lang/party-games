import React from 'react';
import { View } from 'react-native';

import { MemoCardState, type MemoCard, type MemoShape } from '../types';

import { MemoCardView } from './MemoCardView';

interface MemoBoardProps {
  board: (MemoCard | null)[];
  gridSize: number;
  dangers: MemoShape[];
  disabled: boolean;
  onFlip: (slot: number) => void;
}

/** Сетка gridSize×gridSize: ширина ячейки в %, зазоры через padding (в RN нет CSS grid) */
export const MemoBoard: React.FC<MemoBoardProps> = ({
  board,
  gridSize,
  dangers,
  disabled,
  onFlip,
}) => (
  <View className="w-full flex-row flex-wrap" style={{ margin: -4 }}>
    {board.map((card, slot) => (
      <View
        key={card ? card.id : `empty-${slot}`}
        style={{ width: `${100 / gridSize}%`, padding: 4 }}
      >
        {card ? (
          <MemoCardView
            // id карты, а не слота: новая карта из колоды ремоунтится без флипа,
            // чтобы её лицо не мелькало при анимации переворота
            card={card}
            slot={slot}
            isDangerRevealed={
              card.state === MemoCardState.Revealed &&
              !card.isSuper &&
              dangers.includes(card.shape)
            }
            disabled={disabled}
            onFlip={onFlip}
          />
        ) : (
          <View
            className="rounded-premium-sm border border-dashed border-white/10 bg-white/5"
            style={{ aspectRatio: 1 }}
          />
        )}
      </View>
    ))}
  </View>
);
