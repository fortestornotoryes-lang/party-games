import {GripVertical, UserMinus} from "lucide-react";
import {Reorder, useDragControls} from "motion/react";
import React from "react";

import type {PlayerEntry} from "@/entities/player/types";
import {TextInput} from "@/shared/components/TextInput";
import type {ThemeTokens} from "@/shared/theme/colors";

export const DEFAULT_NAMES = ['Дуня', 'Валера', 'Диана', 'Люба', 'Саша'];
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
            className="flex items-center gap-4 list-none group"
            whileDrag={{scale: 1.02, zIndex: 50, rotate: -1}}
        >
            <div
                onPointerDown={(e) => {
                    dragControls.start(e);
                }}
                className="w-5 h-9 shrink-0 flex items-center justify-center text-white/10 hover:text-white/80 cursor-grab active:cursor-grabbing touch-none select-none"
            >
                <GripVertical className="w-5 h-5"/>
            </div>

            <div
                className={`w-9 h-9 shrink-0 rounded-premium-sm border flex items-center justify-center text-xs font-black italic select-none shadow-xl ${config.indexBg}`}
            >
                {index + 1}
            </div>

            <div className="flex-1 relative">
                <TextInput
                    value={player.name}
                    onChange={(e) => {
                        onChange(player.id, e.target.value);
                    }}
                    autoComplete="off"
                    className={`h-9 px-6 glass-card rounded-premium-md w-full text-base font-semibold placeholder:text-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 ${config.focus}`}
                    placeholder={`${placeholder} ${index + 1}`}
                />
            </div>

            {!!canRemove && (
                <button
                    onClick={() => {
                        onRemove(player.id);
                    }}
                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-premium-sm glass-card text-white/20 hover:text-premium-red hover:bg-premium-red/5 hover:border-premium-red/30 active:scale-90 transition-all"
                >
                    <UserMinus className="w-5 h-5"/>
                </button>
              )}
        </Reorder.Item>
    );
};