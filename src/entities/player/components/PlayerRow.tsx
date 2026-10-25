import { GripVertical, UserMinus } from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';
import React from 'react';

import type { PlayerEntry } from '@/entities/player/types';
import { TextInput } from '@/shared/components/TextInput';
import type { ThemeTokens } from '@/shared/theme/colors';

export const DEFAULT_NAMES = ['Дуня', 'Валера', 'Диана', 'Люба', 'Саша'];
export const DEFAULT_NAMES_EN = ['Alex', 'Sam', 'Kate', 'Max', 'Nick'];
type Config = ThemeTokens;

interface PlayerRowProps {
  player: PlayerEntry;
  index: number;
  canRemove: boolean;
  config: Config;
  placeholder: string;
  onRemove: (id: string) => void;
  onChange: (id: string, name: string) => void;
}

export const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  index,
  canRemove,
  config,
  placeholder,
  onRemove,
  onChange,
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={player}
      dragListener={false}
      dragControls={dragControls}
      layout="position"
      className="group flex list-none items-center gap-2 sm:gap-4"
      whileDrag={{ scale: 1.02, zIndex: 50, rotate: -1 }}
    >
      <div
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
        className="flex h-11 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-white/10 select-none hover:text-white/80 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div
        className={`rounded-premium-sm flex h-11 w-9 shrink-0 items-center justify-center border text-xs font-black italic shadow-xl select-none ${config.indexBg}`}
      >
        {index + 1}
      </div>

      <div className="relative min-w-0 flex-1">
        <TextInput
          value={player.name}
          onChange={(e) => {
            onChange(player.id, e.target.value);
          }}
          autoComplete="off"
          className={`glass-card rounded-premium-md h-11 w-full px-4 text-base font-semibold transition-colors placeholder:text-white/10 focus:ring-1 focus:ring-white/20 focus:outline-none sm:px-6 ${config.focus}`}
          placeholder={`${placeholder} ${index + 1}`}
        />
      </div>

      {canRemove && (
        <button
          onClick={() => {
            onRemove(player.id);
          }}
          className="rounded-premium-sm glass-card hover:text-premium-red hover:bg-premium-red/5 hover:border-premium-red/30 flex h-11 w-11 shrink-0 items-center justify-center text-white/20 transition-[color,background-color,border-color,transform] active:scale-90"
        >
          <UserMinus className="h-5 w-5" />
        </button>
      )}
    </Reorder.Item>
  );
};
