import React from 'react';

import type { C4Player } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  p1: string;
  p2: string;
  current: C4Player;
  gameOver: boolean;
  score: Record<C4Player, number>;
}

export const Scoreboard: React.FC<Props> = ({ p1, p2, current, gameOver, score }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-1">
      <div
        className={`transition-all duration-300 ${!gameOver && current === 1 ? 'opacity-100' : 'opacity-35'}`}
      >
        <div className="flex items-center gap-2">
          <div className="bg-premium-red h-4 w-4 rounded-full shadow-[0_0_8px_rgba(255,46,77,0.7)]" />
          <span className="text-base leading-none font-black text-white uppercase italic">
            {p1}
          </span>
        </div>
        <p className="text-micro mt-1 pl-6 font-black tracking-widest text-white/40 uppercase">
          {t(`${NS.COMMON}.wins`, { n: score[1] })}
        </p>
      </div>

      <span className="text-tag font-black tracking-widest text-white/20 uppercase">vs</span>

      <div
        className={`text-right transition-all duration-300 ${!gameOver && current === 2 ? 'opacity-100' : 'opacity-35'}`}
      >
        <div className="flex items-center justify-end gap-2">
          <span className="text-base leading-none font-black text-white uppercase italic">
            {p2}
          </span>
          <div className="bg-premium-yellow h-4 w-4 rounded-full shadow-[0_0_8px_rgba(255,204,31,0.7)]" />
        </div>
        <p className="text-micro mt-1 pr-6 font-black tracking-widest text-white/40 uppercase">
          {t(`${NS.COMMON}.wins`, { n: score[2] })}
        </p>
      </div>
    </div>
  );
};
