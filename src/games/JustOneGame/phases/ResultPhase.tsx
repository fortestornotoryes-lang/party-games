import { CheckCircle, RotateCcw, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ResultPhaseProps {
  isCorrect: boolean;
  word: string;
  guess: string;
  onNext: () => void;
}

export const ResultPhase: React.FC<ResultPhaseProps> = ({ isCorrect, word, guess, onNext }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex min-h-full flex-col items-center justify-center gap-8 p-6 text-center"
    >
      <div className="space-y-4">
        {isCorrect ? (
          <>
            <div className="relative">
              <div className="bg-premium-green/15 absolute -inset-12 rounded-full blur-[50px]" />
              <CheckCircle className="text-premium-green relative mx-auto h-20 w-20" />
            </div>
            <Typography.Display size="lg" color="green" glow align="center">
              {t(`${NS.JUST_ONE}.correctDisplay`)}
            </Typography.Display>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="bg-premium-red/15 absolute -inset-12 rounded-full blur-[50px]" />
              <XCircle className="text-premium-red relative mx-auto h-20 w-20" />
            </div>
            <Typography.Display size="lg" color="red" glow align="center">
              {t(`${NS.JUST_ONE}.wrongDisplay`)}
            </Typography.Display>
          </>
        )}

        <div className="space-y-1 text-center">
          <Typography.Caption className="tracking-[0.5em]">
            {t(`${NS.JUST_ONE}.secretWord`)}
          </Typography.Caption>
          <Typography.Display size="md" align="center">
            {word}
          </Typography.Display>
          {!isCorrect && (
            <Typography.Body color="faint" align="center" className="mt-1">
              {t(`${NS.JUST_ONE}.answerLabel`)} <span className="italic">{guess}</span>
            </Typography.Body>
          )}
        </div>
      </div>

      <PrimaryButton onClick={onNext} icon={RotateCcw}>
        {t(`${NS.JUST_ONE}.nextRound`)}
      </PrimaryButton>
    </motion.div>
  );
};
