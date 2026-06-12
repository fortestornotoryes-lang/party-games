import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface GuessingPhaseProps {
  guesser: string;
  visibleHints: string[];
  guess: string;
  onGuessChange: (val: string) => void;
  onGuess: () => void;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  guesser,
  visibleHints,
  guess,
  onGuessChange,
  onGuess,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="guessing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 p-6"
    >
      <div className="space-y-1 pt-2 text-center">
        <h3 className="text-premium-yellow text-2xl font-black tracking-tighter uppercase italic">
          {guesser}
        </h3>
        <p className="text-sm font-medium text-white/40">{t(`${NS.JUST_ONE}.guessInstruction`)}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {visibleHints.map((hint, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-premium-yellow/[0.07] border-premium-yellow/20 rounded-premium-md border px-5 py-3"
          >
            <span className="text-premium-yellow text-xl font-black tracking-tight uppercase italic">
              {hint}
            </span>
          </motion.div>
        ))}
        {visibleHints.length === 0 && (
          <p className="text-sm text-white/25 italic">{t(`${NS.JUST_ONE}.allHintsClashed`)}</p>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => {
            onGuessChange(e.target.value);
          }}
          placeholder={t(`${NS.JUST_ONE}.guessPlaceholder`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && guess.trim()) onGuess();
          }}
          className="rounded-premium-lg focus:border-premium-yellow/40 w-full border border-white/8 bg-white/4 py-5 text-center text-3xl font-black uppercase italic transition-all outline-none placeholder:text-white/15"
        />
        <PrimaryButton onClick={onGuess} disabled={!guess.trim()}>
          {t(`${NS.JUST_ONE}.submitAnswer`)}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};
