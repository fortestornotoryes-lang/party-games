import { MessageSquare } from 'lucide-react';
import React from 'react';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  lastDrawing: string;
  timeLeft: number;
  currentRound: number;
  shuffledPlayers: string[];
  guess: string;
  onGuessChange: (v: string) => void;
  onSubmit: () => void;
}

export const TelestrationsGuess: React.FC<Props> = ({
  lastDrawing,
  timeLeft,
  currentRound,
  shuffledPlayers,
  guess,
  onGuessChange,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto p-6">
      <div className="space-y-1 text-center">
        <p className="text-tag font-black tracking-widest text-white/30 uppercase">
          {t(`${NS.TELESTRATIONS}.guessDrawing`)}
        </p>
        <span
          className={`block text-2xl font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white/40'}`}
        >
          {t(`${NS.TELESTRATIONS}.timerSeconds`, { n: timeLeft })}
        </span>
        <h3 className="text-xl font-black italic">{t(`${NS.TELESTRATIONS}.whatIsDepicted`)}</h3>
      </div>

      <div className="flex justify-center gap-1.5">
        {shuffledPlayers.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i < currentRound
                ? 'bg-premium-orange/30 w-3'
                : i === currentRound
                  ? 'bg-premium-orange w-5'
                  : 'w-3 bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="rounded-premium-md w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl">
        <img src={lastDrawing} alt="Drawing" className="block h-auto w-full" />
      </div>

      <div className="w-full max-w-sm space-y-3">
        <input
          type="text"
          value={guess}
          onChange={(e) => {
            onGuessChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && guess.trim()) onSubmit();
          }}
          placeholder={t(`${NS.TELESTRATIONS}.writePlaceholder`)}
          className="rounded-premium-md focus:border-premium-orange focus:bg-premium-orange/5 w-full border border-white/10 bg-white/5 p-5 text-xl font-bold transition-all outline-none placeholder:text-white/25"
        />
        <button
          disabled={!guess.trim()}
          onClick={onSubmit}
          className="rounded-premium-md flex w-full items-center justify-center space-x-2 bg-white py-5 font-black tracking-[0.2em] text-black uppercase shadow-2xl transition-all disabled:opacity-20"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{t(`${NS.COMMON}.done`)}</span>
        </button>
      </div>
    </div>
  );
};
