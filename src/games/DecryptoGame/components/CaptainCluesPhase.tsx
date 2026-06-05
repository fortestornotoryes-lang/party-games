import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';
import { TeamColor } from '../types';
import { tText, tBadge } from '../helpers';
import { WordGrid } from './WordGrid';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';

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
      className="space-y-6 flex flex-col overflow-auto pb-8 relative h-full"
    >
      <div className={`text-center sticky top-0 bg-black/60 backdrop-blur-md py-3 z-10`}>
        <p className={`text-tag tracking-widest uppercase font-black ${tText(activeTeam)}`}>
          {t(`${NS.DECRYPTO}.encryptor`)}
        </p>
        <h3 className="text-3xl text-white font-black tracking-[0.2em]">
          {currentCode.join(' - ')}
        </h3>
      </div>

      <WordGrid words={words} height="h-20" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4 flex-1"
      >
        <p className="text-xs font-bold text-white/40 text-center uppercase">
          {t(`${NS.DECRYPTO}.writeAssociations`)}
        </p>
        {currentCode.map((num, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center font-black rounded-premium-xs shrink-0 ${tBadge(activeTeam)}`}
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
              className="flex-1 bg-white/5 border border-white/10 rounded-premium-sm px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder:text-white/25"
            />
          </div>
        ))}
        <PrimaryButton
          type="submit"
          variant={activeTeam}
          className="w-full mt-6"
          disabled={clues.some((c) => c.trim() === '')}
        >
          {t(`${NS.DECRYPTO}.encrypt`)}
        </PrimaryButton>
      </form>
    </motion.div>
  );
};
