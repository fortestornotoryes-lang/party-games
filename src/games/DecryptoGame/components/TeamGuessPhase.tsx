import { motion } from 'motion/react';
import React from 'react';

import type { TeamColor } from '../types';

import { CodeInput } from './CodeInput';
import { WordGrid } from './WordGrid';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface TeamGuessPhaseProps {
  words: string[];
  clues: string[];
  teamGuess: (number | '')[];
  wordCount: number;
  activeTeam: TeamColor;
  onChange: (v: (number | '')[]) => void;
  onSubmit: () => void;
}

export const TeamGuessPhase: React.FC<TeamGuessPhaseProps> = ({
  words,
  clues,
  teamGuess,
  wordCount,
  activeTeam,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="team_guess"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col space-y-4 overflow-auto"
    >
      <WordGrid words={words} height="h-16" />

      <div className="rounded-premium-sm bg-white/5 p-4">
        <p className="mb-2 text-xs font-bold text-white/30 uppercase">
          {t(`${NS.DECRYPTO}.captainClues`)}
        </p>
        <ul className="space-y-1 text-center text-lg font-black tracking-wider uppercase">
          {clues.map((c, i) => (
            <li key={i} className="text-white">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mt-2 flex-1 space-y-4"
      >
        <p className="text-tag text-center font-bold text-white/40 uppercase">
          {t(`${NS.DECRYPTO}.enterYourCode`)}
        </p>
        <CodeInput value={teamGuess} onChange={onChange} max={wordCount} team={activeTeam} />
        <PrimaryButton type="submit" variant={activeTeam} className="w-full">
          {t(`${NS.DECRYPTO}.decode`)}
        </PrimaryButton>
      </form>
    </motion.div>
  );
};
