import React from 'react';

import { PLAYER_COLOR } from '../constants';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  p1: string;
  p2: string;
  current: 1 | 2;
  winner: 1 | 2 | null;
  wallsLeft: Record<1 | 2, number>;
}

export const PlayerStatusBar: React.FC<Props> = ({ p1, p2, current, winner, wallsLeft }) => {
  const { t } = useTranslation();

  return (
    <div className="flex border-b border-white/6">
      {([1, 2] as const).map((p) => {
        const isActive = current === p && !winner;
        const name = p === 1 ? p1 : p2;
        const goalArrow = p === 1 ? '↑' : '↓';
        return (
          <div
            key={p}
            className={`flex flex-1 items-center gap-2.5 px-3 py-2.5 transition-all duration-200 ${isActive ? 'bg-white/[0.055]' : 'opacity-40'}`}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-black"
              style={{ background: PLAYER_COLOR[p] }}
            >
              {goalArrow}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs leading-none font-black tracking-tight text-white uppercase">
                {name}
              </div>
              <div className="text-micro mt-0.5 font-black tracking-[0.25em] text-white/35 uppercase">
                {t(`${NS.CORRIDOR}.wallsLeft`, { n: wallsLeft[p] })}
              </div>
            </div>
            {!!isActive && (
              <span
                className="text-tag ml-auto shrink-0 rounded-full px-2 py-0.5 font-black tracking-[0.3em] uppercase"
                style={{ background: `${PLAYER_COLOR[p]}22`, color: PLAYER_COLOR[p] }}
              >
                {t(`${NS.CORRIDOR}.turn`)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
