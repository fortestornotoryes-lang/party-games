import React from 'react';

import { PLAYER_COLOR } from '../constants';

import { FitText } from '@/shared/components/FitText';
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
            className={`flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 transition-all duration-200 ${isActive ? 'bg-white/[0.055]' : 'opacity-40'}`}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-black"
              style={{ background: PLAYER_COLOR[p] }}
            >
              {goalArrow}
            </div>
            <div className="min-w-0 flex-1">
              {/* FitText вместо truncate: имя читается целиком, а не «АЛЕКС…» */}
              <FitText
                className="text-xs leading-tight font-black tracking-tight text-white uppercase"
                minFontSize={9}
              >
                {name}
              </FitText>
              {/* Плашка «ход» — во второй строке, а не сбоку: сбоку она отнимала у имени ~70 px */}
              <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-micro font-black tracking-[0.25em] text-white/35 uppercase">
                  {t(`${NS.CORRIDOR}.wallsLeft`, { n: wallsLeft[p] })}
                </span>
                {isActive && (
                  <span
                    className="text-micro shrink-0 rounded-full px-1.5 py-0.5 font-black tracking-[0.25em] uppercase"
                    style={{ background: `${PLAYER_COLOR[p]}22`, color: PLAYER_COLOR[p] }}
                  >
                    {t(`${NS.CORRIDOR}.turn`)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
