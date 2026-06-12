import { CheckCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface HintingPhaseProps {
  word: string;
  guesser: string;
  hinters: string[];
  hints: Record<string, string>;
  onSubmitHint: (player: string, hint: string) => void;
  onStartGuessing: () => void;
}

export const HintingPhase: React.FC<HintingPhaseProps> = ({
  word,
  guesser,
  hinters,
  hints,
  onSubmitHint,
  onStartGuessing,
}) => {
  const { t } = useTranslation();
  const [localHints, setLocalHints] = useState<Record<string, string>>({});
  const allHinted = Object.keys(hints).length === hinters.length;

  return (
    <motion.div
      key="hinting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 p-5"
    >
      <div className="space-y-2 pt-2 text-center">
        <p className="text-micro text-premium-yellow/40 font-black tracking-[0.5em] uppercase">
          {t(`${NS.JUST_ONE}.secretWord`)}
        </p>
        <h2 className="text-5xl leading-none font-black tracking-tighter text-white uppercase italic">
          {word}
        </h2>
      </div>

      <div className="rounded-premium-md bg-premium-yellow/[0.05] border-premium-yellow/15 border p-4 text-center">
        <p className="text-micro mb-1 font-black tracking-[0.3em] text-white/30 uppercase">
          {t(`${NS.JUST_ONE}.guessing`)}
        </p>
        <h3 className="text-premium-yellow text-xl font-black uppercase italic">{guesser}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-micro font-black tracking-[0.4em] text-white/35 uppercase">
            {t(`${NS.JUST_ONE}.hintsLabel`)}
          </span>
          <span className="text-micro rounded-full border border-white/6 bg-white/4 px-3 py-1 font-black text-white/30">
            {Object.keys(hints).length}/{hinters.length}
          </span>
        </div>

        <div className="space-y-2">
          {hinters.map((player) => (
            <div
              key={player}
              className="rounded-premium-md flex items-center gap-3 border border-white/8 bg-white/3 p-3"
            >
              <span className="min-w-[72px] shrink-0 text-sm font-black text-white/70 italic">
                {player}
              </span>
              {hints[player] ? (
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-premium-yellow/70 text-sm font-black tracking-tight uppercase italic">
                    {hints[player]}
                  </span>
                  <CheckCircle className="text-premium-green h-4 w-4 shrink-0" />
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={localHints[player] || ''}
                    onChange={(e) => {
                      setLocalHints((prev) => ({ ...prev, [player]: e.target.value }));
                    }}
                    placeholder={t(`${NS.JUST_ONE}.hintPlaceholder`)}
                    className="rounded-premium-sm focus:border-premium-yellow/40 h-9 flex-1 border border-white/8 bg-white/4 px-3 text-sm transition-colors outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSubmitHint(player, localHints[player] || '');
                    }}
                  />
                  <button
                    onClick={() => {
                      onSubmitHint(player, localHints[player] || '');
                    }}
                    className="bg-premium-yellow rounded-premium-sm flex h-9 w-9 shrink-0 items-center justify-center text-black transition-transform active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!!allHinted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <PrimaryButton onClick={onStartGuessing}>
            {t(`${NS.JUST_ONE}.readyShowGuesser`, { guesser })}
          </PrimaryButton>
        </motion.div>
      )}
    </motion.div>
  );
};
