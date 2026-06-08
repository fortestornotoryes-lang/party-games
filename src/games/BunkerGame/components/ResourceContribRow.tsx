import React from 'react';

import type {BunkerResources} from '../types';

import {RESOURCE_META} from '@/constants/bunkerContent';

interface Props {
    contrib: BunkerResources;
    className?: string;
}

export const ResourceContribRow: React.FC<Props> = ({contrib, className = 'flex gap-3 mt-2 flex-wrap'}) => {
    const nonZero = RESOURCE_META.filter(({key}) => contrib[key] !== 0);
    if (nonZero.length === 0) return null;
    return (
        <div className={className}>
            {nonZero.map(({key, emoji}) => {
                const val = contrib[key];
                return (
                    <span key={key} className="text-xs font-black tabular-nums" style={{color: val > 0 ? '#00D88A' : '#FF2E4D'}}>
                        {emoji}{val > 0 ? '+' : ''}{val}
                    </span>
                );
            })}
        </div>
    );
};
