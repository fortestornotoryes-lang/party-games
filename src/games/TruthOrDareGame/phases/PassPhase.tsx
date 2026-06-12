import { Flame } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface PassPhaseProps {
  currentPlayer: string;
  onPassDone: () => void;
}

export const PassPhase: React.FC<PassPhaseProps> = ({ currentPlayer, onPassDone }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="pass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-4 p-5"
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <PassPhoneCard
            playerName={currentPlayer}
            badge={t(`${NS.TRUTH_OR_DARE}.subtitle`)}
            badgeColor="red"
            accentColor="red"
            icon={Flame}
            instruction={t(`${NS.TRUTH_OR_DARE}.tapToContinue`)}
            onClick={onPassDone}
          />
        </div>
      </div>
    </motion.div>
  );
};
