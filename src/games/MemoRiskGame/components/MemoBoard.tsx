import React from 'react';

import { MemoCardState, type MemoCard, type MemoShape } from '../types';

import { MemoCardView } from './MemoCardView';

interface MemoBoardProps {
  board: (MemoCard | null)[];
  gridSize: number;
  dangers: MemoShape[];
  disabled: boolean;
  onFlip: (slot: number) => void;
}

export const MemoBoard: React.FC<MemoBoardProps> = ({
  board,
  gridSize,
  dangers,
  disabled,
  onFlip,
}) => (
  <div
    className="grid w-full gap-2"
    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
  >
    {board.map((card, slot) =>
      card ? (
        <MemoCardView
          // id карты, а не слота: новая карта из колоды ремоунтится без флипа,
          // чтобы её лицо не мелькало при анимации переворота
          key={card.id}
          card={card}
          slot={slot}
          isDangerRevealed={
            card.state === MemoCardState.Revealed && !card.isSuper && dangers.includes(card.shape)
          }
          disabled={disabled}
          onFlip={onFlip}
        />
      ) : (
        <div
          key={`empty-${slot}`}
          className="rounded-premium-sm aspect-square border border-dashed border-white/8 bg-white/[0.02]"
        />
      )
    )}
  </div>
);
