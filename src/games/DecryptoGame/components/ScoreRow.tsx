import React from 'react';
import { TeamColor, TeamState } from '../types';
import { tLabel, tText, tBg, tBadge } from '../helpers';

interface ScoreRowProps {
  red: TeamState;
  blue: TeamState;
}

export const ScoreRow: React.FC<ScoreRowProps> = ({ red, blue }) => (
  <div className="flex gap-3 w-full">
    {(
      [
        ['red', red],
        ['blue', blue],
      ] as [TeamColor, TeamState][]
    ).map(([color, state]) => {
      const captain = state.players[state.captainIndex % state.players.length];
      return (
        <div key={color} className={`flex-1 p-3 rounded-xl border ${tBg(color)} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-micro font-black uppercase tracking-wider ${tText(color)}`}>
              {tLabel(color)}
            </span>
            <span className="text-tag text-white/40 font-bold">
              ✗{state.interceptions} · {state.fails}ош
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {state.players.map((p) => (
              <span
                key={p}
                className={`text-micro px-1.5 py-0.5 rounded-md font-bold ${
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
