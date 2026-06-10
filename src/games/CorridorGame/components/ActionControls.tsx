import React from 'react';

import {ActionMode} from '../types';

interface Props {
    actionMode: ActionMode;
    curColor: string;
    wallsDepleted: boolean;
    onSelect: (m: ActionMode) => void;
}

export const ActionControls: React.FC<Props> = ({actionMode, curColor, wallsDepleted, onSelect}) => (
    <div className="px-4 pb-safe-bottom pb-4 pt-1 safe-bottom">
        <div className="flex gap-2">
            {(
                [
                    {m: ActionMode.Move, label: 'Ход', hint: 'передвинь фишку'},
                    {m: ActionMode.WallH, label: 'Стена ─', hint: 'горизонт.'},
                    {m: ActionMode.WallV, label: 'Стена │', hint: 'вертикал.'},
                ] as const
            ).map(({m, label, hint}) => {
                const isActive = actionMode === m;
                const isWallBtn = m === ActionMode.WallH || m === ActionMode.WallV;
                const disabled = isWallBtn && wallsDepleted;
                return (
                    <button
                        key={m}
                        onClick={() => {
                            if (!disabled) onSelect(m);
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
);
