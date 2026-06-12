import { ArrowRight, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  currentPlayer: string;
  shuffledPlayers: string[];
  currentWord: string;
  wordRevealed: boolean;
  onReveal: () => void;
  onReady: () => void;
}

export const TelestrationsStart: React.FC<Props> = ({
  currentPlayer,
  shuffledPlayers,
  currentWord,
  wordRevealed,
  onReveal,
  onReady,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto p-6"
    >
      <div className="space-y-3 text-center">
        <div className="bg-premium-orange/10 border-premium-orange/20 inline-block rounded-full border px-4 py-1">
          <span className="text-tag text-premium-orange font-bold tracking-widest uppercase">
            {t(`${NS.TELESTRATIONS}.firstDraws`)}
          </span>
        </div>
        <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
        <p className="text-sm text-white/30">{t(`${NS.TELESTRATIONS}.rememberAndDraw`)}</p>
      </div>

      <div className="rounded-premium-md w-full max-w-sm border border-white/5 bg-white/5 p-4">
        <p className="text-micro mb-3 text-center font-black tracking-widest text-white/25 uppercase">
          {t(`${NS.TELESTRATIONS}.gameOrder`)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {shuffledPlayers.map((name, i) => (
            <div
              key={i}
              className={`text-tag flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-bold ${
                i % 2 === 0
                  ? 'bg-premium-orange/10 border-premium-orange/20 text-premium-orange'
                  : 'border-white/10 bg-white/5 text-white/40'
              }`}
            >
              <span className="opacity-50">{i + 1}.</span>
              <span>{name}</span>
              <span className="opacity-60">{i % 2 === 0 ? '✏️' : '💬'}</span>
            </div>
          ))}
        </div>
      </div>

      {!wordRevealed ? (
        <button
          onClick={onReveal}
          className="border-premium-orange/20 rounded-premium-3xl hover:bg-premium-orange/5 hover:border-premium-orange/40 group w-full max-w-sm border-2 border-dashed bg-white/5 p-8 text-center transition-all"
        >
          <p className="text-micro mb-3 font-black tracking-widest text-white/25 uppercase">
            {t(`${NS.TELESTRATIONS}.makeSureNoOneWatches`)}
          </p>
          <div className="text-premium-orange/50 group-hover:text-premium-orange flex items-center justify-center gap-2 transition-colors">
            <Eye className="h-5 w-5" />
            <span className="text-base font-black">{t(`${NS.TELESTRATIONS}.showWord`)}</span>
          </div>
        </button>
      ) : (
        <div className="bg-premium-orange/10 border-premium-orange/30 rounded-premium-3xl w-full max-w-sm border p-8 text-center">
          <p className="text-tag mb-2 font-black tracking-widest text-white/25 uppercase">
            {t(`${NS.TELESTRATIONS}.yourSecretWord`)}
          </p>
          <h4 className="text-premium-orange text-3xl font-black">{currentWord}</h4>
        </div>
      )}

      <button
        onClick={onReady}
        disabled={!wordRevealed}
        className="rounded-premium-md flex w-full max-w-sm items-center justify-center space-x-3 bg-white py-5 font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      >
        <span>{t(`${NS.TELESTRATIONS}.readyToDraw`)}</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  );
};
