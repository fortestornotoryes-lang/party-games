import React from 'react';

import {tBadge, tBg, teamLabel, tText} from '../helpers';
import type {TeamColor, TeamState} from '../types';

import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';

interface ScoreRowProps {
    red: TeamState;
    blue: TeamState;
}

export const ScoreRow: React.FC<ScoreRowProps> = ({red, blue}) => {
    const {t} = useTranslation();
    return (
        <div className="flex gap-3 w-full">
            {(
                [
                    ['red', red],
                    ['blue', blue],
                ] as [TeamColor, TeamState][]
            ).map(([color, state]) => {
                const captain = state.players[state.captainIndex % state.players.length];
                return (
                    <div
                        key={color}
                        className={`flex-1 p-3 rounded-premium-sm border ${tBg(color)} space-y-2`}
                    >
                        <div className="flex items-center justify-between">
              <span className={`text-micro font-black uppercase tracking-wider ${tText(color)}`}>
                {teamLabel(color, t)}
              </span>
                            <span className="text-tag text-white/40 font-bold">
                {t(`${NS.DECRYPTO}.scoreCompact`, {
                    inter: state.interceptions,
                    fail: state.fails,
                })}
              </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {state.players.map((p) => (
                                <span
                                    key={p}
                                    className={`text-micro px-1.5 py-0.5 rounded-premium-xs font-bold ${
                                        p === captain
                                            ? `${tBadge(color)} border border-current/30`
                                            : 'bg-white/5 text-white/35'
                                    }`}
                                >
                  {p === captain ? `★ ${p}` : p}
                </span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
