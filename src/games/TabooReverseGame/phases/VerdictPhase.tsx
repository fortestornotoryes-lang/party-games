import { motion } from 'motion/react';
import React from 'react';

import type { TabooCard } from '../content';

import { StopGameButton } from '@/components/StopGameButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface VerdictPhaseProps {
  card: TabooCard;
  timedOut: boolean;
  currentExplainer: string;
  otherPlayers: string[];
  usedWordIdxs: Set<number>;
  onToggleWord: (i: number) => void;
  onVerdict: (guesser: string | null, penalty?: boolean) => void;
  onStopGame: () => void;
}

export const VerdictPhase: React.FC<VerdictPhaseProps> = ({
  card,
  timedOut,
  currentExplainer,
  otherPlayers,
  usedWordIdxs,
  onToggleWord,
  onVerdict,
  onStopGame,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="verdict"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6"
    >
      {/* Word reveal */}
      <div className="space-y-2 pt-2 text-center">
        {timedOut && (
          <p className="text-micro text-premium-red/70 font-black tracking-widest uppercase">
            {t(`${NS.TABOO_REVERSE}.timeUp`)}
          </p>
        )}
        <p className="text-micro font-black tracking-[0.4em] text-white/30 uppercase">
          {t(`${NS.TABOO_REVERSE}.secretWord`)}
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          {card.word}
        </h2>
      </div>

      {/* Mark used words */}
      <div>
        <p className="text-micro mb-3 text-center font-black tracking-[0.4em] text-white/30 uppercase">
          {t(`${NS.TABOO_REVERSE}.markUsedWords`)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {card.required.map((w, i) => (
            <button
              key={i}
              onClick={() => {
                onToggleWord(i);
              }}
              className={`rounded-premium-md border px-4 py-2.5 text-sm font-black uppercase italic transition-all active:scale-95 ${
                usedWordIdxs.has(i)
                  ? 'bg-premium-green/20 border-premium-green/50 text-premium-green line-through opacity-70'
                  : 'border-white/15 bg-white/5 text-white/50'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
        <p className="text-micro mt-3 text-center font-black tracking-widest text-white/20 uppercase">
          {t(`${NS.TABOO_REVERSE}.usedCount`, {
            n: usedWordIdxs.size,
            total: card.required.length,
          })}
        </p>
      </div>

      <div className="border-t border-white/10" />

      {/* Who guessed? */}
      <div className="space-y-3">
        <p className="text-micro text-center font-black tracking-[0.4em] text-white/30 uppercase">
          {t(`${NS.TABOO_REVERSE}.whoGuessed`)}
        </p>

        {otherPlayers.map((player) => {
          const allWordsUsed = usedWordIdxs.size === card.required.length;
          const points = allWordsUsed ? 2 : 1;
          return (
            <button
              key={player}
              onClick={() => {
                onVerdict(player);
              }}
              className="bg-premium-green/10 border-premium-green/40 rounded-premium-md flex w-full items-center justify-between border-2 p-4 transition-all active:scale-95"
            >
              <div className="text-left">
                <p className="text-premium-green text-base leading-tight font-black italic">
                  {player}
                </p>
                <p className="text-tag mt-0.5 text-white/30">
                  {allWordsUsed
                    ? t(`${NS.TABOO_REVERSE}.allWordsUsed`)
                    : t(`${NS.TABOO_REVERSE}.wordsUsedOf`, {
                        n: usedWordIdxs.size,
                        total: card.required.length,
                      })}
                </p>
              </div>
              <span className="text-premium-green ml-4 text-3xl font-black italic">+{points}</span>
            </button>
          );
        })}

        <button
          onClick={() => {
            onVerdict(null);
          }}
          className="rounded-premium-md flex w-full items-center justify-between border-2 border-white/10 bg-white/5 p-4 transition-all active:scale-95"
        >
          <p className="text-base font-black text-white/50 italic">
            {t(`${NS.TABOO_REVERSE}.nobodyGuessed`)}
          </p>
          <span className="ml-4 text-3xl font-black text-white/30 italic">0</span>
        </button>

        <button
          onClick={() => {
            onVerdict(null, true);
          }}
          className="bg-premium-red/10 border-premium-red/30 rounded-premium-md flex w-full items-center justify-between border-2 p-4 transition-all active:scale-95"
        >
          <div className="text-left">
            <p className="text-premium-red text-base leading-tight font-black italic">
              {t(`${NS.TABOO_REVERSE}.explainerSaidWord`, { player: currentExplainer })}
            </p>
            <p className="text-tag mt-0.5 text-white/30">
              {t(`${NS.TABOO_REVERSE}.penaltyForExplainer`)}
            </p>
          </div>
          <span className="text-premium-red ml-4 text-3xl font-black italic">−1</span>
        </button>
      </div>

      <div className="border-t border-white/10" />

      <StopGameButton onClick={onStopGame} />
    </motion.div>
  );
};
