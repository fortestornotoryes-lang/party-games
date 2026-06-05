import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Send } from 'lucide-react';
import { PrimaryButton } from '@/components/UI';

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
  const [localHints, setLocalHints] = useState<Record<string, string>>({});
  const allHinted = Object.keys(hints).length === hinters.length;

  return (
    <motion.div
      key="hinting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 space-y-6"
    >
      <div className="text-center space-y-2 pt-2">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-yellow/40">
          Загаданное слово
        </p>
        <h2 className="text-[52px] font-black italic uppercase text-white tracking-tighter leading-none">
          {word}
        </h2>
      </div>

      <div className="p-4 rounded-premium-md bg-premium-yellow/[0.05] border border-premium-yellow/15 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">
          Отгадывает
        </p>
        <h3 className="text-xl font-black italic uppercase text-premium-yellow">{guesser}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/35">
            Подсказки
          </span>
          <span className="text-[9px] font-black px-3 py-1 bg-white/4 rounded-full text-white/30 border border-white/6">
            {Object.keys(hints).length}/{hinters.length}
          </span>
        </div>

        <div className="space-y-2">
          {hinters.map((player) => (
            <div
              key={player}
              className="bg-white/3 border border-white/8 rounded-premium-md p-3 flex items-center gap-3"
            >
              <span className="text-sm font-black italic text-white/70 shrink-0 min-w-[72px]">
                {player}
              </span>
              {hints[player] ? (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-black italic uppercase tracking-tight text-premium-yellow/70">
                    {hints[player]}
                  </span>
                  <CheckCircle className="w-4 h-4 text-premium-green shrink-0" />
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={localHints[player] || ''}
                    onChange={(e) =>
                      setLocalHints((prev) => ({ ...prev, [player]: e.target.value }))
                    }
                    placeholder="Подсказка..."
                    className="flex-1 h-9 bg-white/4 border border-white/8 rounded-premium-sm px-3 text-sm focus:border-premium-yellow/40 outline-none transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSubmitHint(player, localHints[player] || '');
                    }}
                  />
                  <button
                    onClick={() => onSubmitHint(player, localHints[player] || '')}
                    className="w-9 h-9 shrink-0 bg-premium-yellow text-black rounded-premium-sm flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {allHinted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <PrimaryButton onClick={onStartGuessing}>
            ГОТОВО! ПОКАЗАТЬ {guesser.toUpperCase()}
          </PrimaryButton>
        </motion.div>
      )}
    </motion.div>
  );
};
