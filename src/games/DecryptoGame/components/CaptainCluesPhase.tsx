import { motion } from 'motion/react';
import React from 'react';

import { tBadge, tText } from '../helpers';
import type { TeamColor } from '../types';

import { WordGrid } from './WordGrid';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface CaptainCluesPhaseProps {
  words: string[];
  currentCode: number[];
  clues: string[];
  activeTeam: TeamColor;
  onChange: (clues: string[]) => void;
  onSubmit: () => void;
}

export const CaptainCluesPhase: React.FC<CaptainCluesPhaseProps> = ({
  words,
  currentCode,
  clues,
  activeTeam,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="captain_clues"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-full flex-col space-y-6 overflow-auto pb-8"
    >
      <div className={`sticky top-0 z-10 bg-black/60 py-3 text-center backdrop-blur-md`}>
        <p className={`text-tag font-black tracking-widest uppercase ${tText(activeTeam)}`}>
          {t(`${NS.DECRYPTO}.encryptor`)}
        </p>
        <h3 className="text-3xl font-black tracking-[0.2em] text-white">
          {currentCode.join(' - ')}
        </h3>
      </div>

      <WordGrid words={words} height="h-20" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex-1 space-y-4"
      >
        <p className="text-center text-xs font-bold text-white/40 uppercase">
          {t(`${NS.DECRYPTO}.writeAssociations`)}
        </p>
        {currentCode.map((num, i) => (
          <div key={i} className="flex items-center gap-4">
            <div
              className={`rounded-premium-xs flex h-8 w-8 shrink-0 items-center justify-center font-black ${tBadge(activeTeam)}`}
            >
              {num}
            </div>
            <input
              required
              type="text"
              value={clues[i]}
              onChange={(e) => {
                const c = [...clues];
                c[i] = e.target.value;
                onChange(c);
              }}
              placeholder={t(`${NS.DECRYPTO}.associationFor`, { word: words[num - 1] })}
              className="rounded-premium-sm flex-1 border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors outline-none placeholder:text-white/25 focus:border-white"
            />
          </div>
        ))}
        <PrimaryButton
          type="submit"
          variant={activeTeam}
          className="mt-6 w-full"
          disabled={clues.some((c) => c.trim() === '')}
        >
          {t(`${NS.DECRYPTO}.encrypt`)}
        </PrimaryButton>
      </form>
    </motion.div>
  );
};
