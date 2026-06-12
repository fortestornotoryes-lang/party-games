import { motion } from 'motion/react';
import React from 'react';

import { teamLabel, tText } from '../helpers';
import type { RoundData, TeamColor } from '../types';

import { CodeInput } from './CodeInput';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface EnemyInterceptPhaseProps {
  enemyHistory: RoundData[];
  clues: string[];
  interceptGuess: (number | '')[];
  wordCount: number;
  enemyColor: TeamColor;
  onChange: (v: (number | '')[]) => void;
  onSubmit: () => void;
}

export const EnemyInterceptPhase: React.FC<EnemyInterceptPhaseProps> = ({
  enemyHistory,
  clues,
  interceptGuess,
  wordCount,
  enemyColor,
  onChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="enemy_intercept"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col space-y-4 overflow-auto"
    >
      <p
        className={`text-tag text-center font-black tracking-widest uppercase ${tText(enemyColor)}`}
      >
        {t(`${NS.DECRYPTO}.interceptTime`, { name: teamLabel(enemyColor, t) })}
      </p>

      <div className="rounded-premium-sm border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-bold text-white/30 uppercase">
          {t(`${NS.DECRYPTO}.enemyCurrentClues`)}
        </p>
        <ul className="space-y-1">
          {clues.map((c, i) => (
            <li key={i} className="font-bold text-white">
              {i + 1}. {c}
            </li>
          ))}
        </ul>
      </div>

      {enemyHistory.length > 0 && (
        <div className="rounded-premium-sm border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs font-bold text-white/30 uppercase">
            {t(`${NS.DECRYPTO}.enemyHistory`)}
          </p>
          <div className="space-y-2">
            {enemyHistory.map((h, i) => (
              <div key={i} className="text-xs">
                <span className="text-premium-purple font-bold">
                  {t(`${NS.DECRYPTO}.codeLabel`, { code: h.code.join('-') })}
                </span>
                : {h.clues.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mt-2 flex-1 space-y-4"
      >
        <p className="text-tag text-center font-bold text-white/40 uppercase">
          {t(`${NS.DECRYPTO}.enterInterceptedCode`)}
        </p>
        <CodeInput value={interceptGuess} onChange={onChange} max={wordCount} team={enemyColor} />
        <PrimaryButton type="submit" variant={enemyColor} className="w-full">
          {t(`${NS.DECRYPTO}.confirmIntercept`)}
        </PrimaryButton>
      </form>
    </motion.div>
  );
};
