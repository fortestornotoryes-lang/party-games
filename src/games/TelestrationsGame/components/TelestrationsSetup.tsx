import { ArrowRight, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { Difficulty } from '@/constants/telestrationsContent';
import { DIFFICULTY_CONFIG } from '@/constants/telestrationsContent';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { DIFFICULTY } from '@/shared/types';

interface Props {
  playerCount: number;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: () => void;
}

export const TelestrationsSetup: React.FC<Props> = ({
  playerCount,
  difficulty,
  onDifficultyChange,
  onStart,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto p-6"
    >
      <div className="space-y-2 text-center">
        <div className="rounded-premium-md bg-premium-orange/10 border-premium-orange/20 mb-1 inline-flex h-14 w-14 items-center justify-center border">
          <Pencil className="text-premium-orange h-7 w-7" />
        </div>
        <h3 className="text-3xl font-black tracking-tighter uppercase italic">
          {t(`${NS.TELESTRATIONS}.settingsTitle`)}
        </h3>
        <p className="text-sm text-white/30">
          {t(`${NS.TELESTRATIONS}.playerCount`, { n: playerCount })}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <p className="text-micro mb-3 text-center font-black tracking-widest text-white/25 uppercase">
          {t(`${NS.TELESTRATIONS}.difficultyLabel`)}
        </p>
        {(Object.values(DIFFICULTY) as Difficulty[]).map((diff) => {
          const cfg = DIFFICULTY_CONFIG[diff];
          const isSelected = difficulty === diff;
          return (
            <motion.button
              key={diff}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onDifficultyChange(diff);
              }}
              className={`rounded-premium-md flex w-full items-center gap-4 border p-4 text-left transition-all ${
                isSelected ? `${cfg.border} ${cfg.bg}` : 'border-white/10 bg-white/5 opacity-50'
              }`}
            >
              <span className="text-2xl leading-none">{cfg.emoji}</span>
              <div className="min-w-0 flex-1">
                <h4
                  className={`text-base font-black uppercase italic ${isSelected ? cfg.text : 'text-white/40'}`}
                >
                  {t(`${NS.TELESTRATIONS}.difficultyLabels.${diff}`)}
                </h4>
                <p className="mt-0.5 text-xs leading-tight text-white/30">
                  {t(`${NS.TELESTRATIONS}.difficultyDescriptions.${diff}`)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-base font-black tabular-nums ${isSelected ? cfg.text : 'text-white/25'}`}
                >
                  {t(`${NS.TELESTRATIONS}.timerSeconds`, { n: cfg.drawTime })}
                </p>
                <p className="text-micro font-bold tracking-widest text-white/25 uppercase">
                  {t(`${NS.TELESTRATIONS}.drawingTimerLabel`)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="rounded-premium-md flex w-full max-w-sm items-center justify-center space-x-3 bg-white py-5 font-black tracking-[0.2em] text-black uppercase shadow-2xl"
      >
        <span>{t(`${NS.COMMON}.start`)}</span>
        <ArrowRight className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
};
