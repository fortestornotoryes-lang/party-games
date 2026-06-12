import { RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { PLAYER_COLOR } from '../constants';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  winner: 1 | 2 | null;
  p1: string;
  p2: string;
  onRestart: () => void;
  onBack: () => void;
}

export const GameOverOverlay: React.FC<Props> = ({ winner, p1, p2, onRestart, onBack }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!!winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(11,9,21,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="glass-card rounded-premium-2xl mx-6 w-full p-8 text-center"
            style={{ borderColor: `${PLAYER_COLOR[winner]}35` }}
          >
            <div
              className="font-display leading-none font-black tracking-tighter uppercase italic"
              style={{ fontSize: '4rem', color: PLAYER_COLOR[winner] }}
            >
              {t(`${NS.CORRIDOR}.victory`)}
            </div>
            <div className="mt-2 text-2xl leading-none font-black tracking-tighter text-white uppercase">
              {winner === 1 ? p1 : p2}
            </div>
            <div className="mt-1.5 text-xs font-black tracking-[0.3em] text-white/35 uppercase">
              {t(`${NS.CORRIDOR}.reachedFinish`)}
            </div>

            <div className="mt-8 space-y-2">
              <PrimaryButton variant="white" icon={RotateCcw} onClick={onRestart}>
                {t(`${NS.CORRIDOR}.playAgain`)}
              </PrimaryButton>
              <PrimaryButton variant="outline" onClick={onBack}>
                {t(`${NS.CORRIDOR}.toMenu`)}
              </PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
