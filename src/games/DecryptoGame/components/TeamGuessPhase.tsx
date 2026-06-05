import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';
import { TeamColor } from '../types';
import { WordGrid } from './WordGrid';
import { CodeInput } from './CodeInput';

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
}) => (
  <motion.div
    key="team_guess"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4 flex flex-col h-full overflow-auto"
  >
    <WordGrid words={words} height="h-16" />

    <div className="bg-white/5 p-4 rounded-premium-sm">
      <p className="text-xs text-white/30 font-bold uppercase mb-2">Подсказки капитана</p>
      <ul className="space-y-1 text-lg font-black uppercase tracking-wider text-center">
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
      className="mt-2 space-y-4 flex-1"
    >
      <p className="text-tag font-bold text-center text-white/40 uppercase">Введите ваш код</p>
      <CodeInput value={teamGuess} onChange={onChange} max={wordCount} team={activeTeam} />
      <PrimaryButton type="submit" variant={activeTeam} className="w-full">
        РАЗГАДАТЬ
      </PrimaryButton>
    </form>
  </motion.div>
);
