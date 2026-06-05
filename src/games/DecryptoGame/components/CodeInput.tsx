import React from 'react';
import {TeamColor} from '../types';
import {tFocus} from '../helpers';

interface CodeInputProps {
    value: (number | '')[];
    onChange: (v: (number | '')[]) => void;
    max: number;
    team: TeamColor;
}

export const CodeInput: React.FC<CodeInputProps> = ({value, onChange, max, team}) => (
    <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
            <input
                key={i}
                type="number"
                min="1"
                max={max}
                required
                value={value[i] === '' ? '' : value[i]}
                onChange={(e) => {
                    const g = [...value] as (number | '')[];
                    if (e.target.value === '') {
                        g[i] = '';
                    } else {
                        const v = parseInt(e.target.value);
                        if (v >= 1 && v <= max) g[i] = v;
                    }
                    onChange(g);
                }}
                className={`h-16 text-2xl font-black text-center rounded-premium-sm bg-white/5 border border-white/10 outline-none transition-colors ${tFocus(team)}`}
            />
        ))}
    </div>
);
