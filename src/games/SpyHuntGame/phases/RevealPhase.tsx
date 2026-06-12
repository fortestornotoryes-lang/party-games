import { RotateCcw, Skull } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import type { Player } from '@/entities/player/types';
import { GameCard } from '@/shared/components/GameCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface RevealPhaseProps {
  spy: Player | undefined;
  location: string;
  onBack: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({ spy, location, onBack }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="reveal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center space-y-12 p-6"
    >
      <div className="space-y-4 text-center">
        <Skull className="text-premium-red mx-auto h-24 w-24 animate-pulse" />
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          {t(`${NS.SPY_HUNT}.spyRevealed`)}
        </h2>
      </div>

      <GameCard className="border-premium-red/40 bg-premium-red/5 w-full space-y-6 p-10 text-center">
        <div className="space-y-2">
          <p className="text-tag text-premium-red/60 font-black tracking-widest uppercase">
            {t(`${NS.SPY_HUNT}.agent00`)}
          </p>
          <h3 className="px-4 text-5xl font-black wrap-break-word text-white uppercase italic">
            {spy?.name}
          </h3>
        </div>
        <div className="border-premium-red/20 border-t pt-6">
          <p className="text-tag text-premium-green/60 font-black tracking-widest uppercase">
            {t(`${NS.SPY_HUNT}.secretLocation`)}
          </p>
          <p className="text-2xl font-black text-white uppercase italic">{location}</p>
        </div>
      </GameCard>

      <PrimaryButton onClick={onBack} icon={RotateCcw} variant="red">
        {t(`${NS.SPY_HUNT}.backToMenu`)}
      </PrimaryButton>
    </motion.div>
  );
};
