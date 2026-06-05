import React from 'react';
import { motion } from 'motion/react';
import { PrimaryButton } from '@/components/UI';
import { TeamColor, RoundData } from '../types';
import { tText, teamLabel } from '../helpers';
import { CodeInput } from './CodeInput';
import { useTranslation } from '@/i18n';
import { NS } from '@/i18n/keys';

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
      className="space-y-4 flex flex-col h-full overflow-auto"
    >
      <p
        className={`text-tag tracking-widest uppercase font-black text-center ${tText(enemyColor)}`}
      >
        {t(`${NS.DECRYPTO}.interceptTime`, { name: teamLabel(enemyColor, t) })}
      </p>

      <div className="bg-white/5 border border-white/10 p-4 rounded-premium-sm">
        <p className="text-xs text-white/30 font-bold uppercase mb-2">
          {t(`${NS.DECRYPTO}.enemyCurrentClues`)}
        </p>
        <ul className="space-y-1">
          {clues.map((c, i) => (
            <li key={i} className="text-white font-bold">
              {i + 1}. {c}
            </li>
          ))}
        </ul>
      </div>

      {enemyHistory.length > 0 && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-premium-sm">
          <p className="text-xs text-white/30 font-bold uppercase mb-2">
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
        className="mt-2 space-y-4 flex-1"
      >
        <p className="text-tag font-bold text-center text-white/40 uppercase">
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
