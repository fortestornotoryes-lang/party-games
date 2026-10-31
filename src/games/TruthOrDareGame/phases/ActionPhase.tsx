import { CheckCircle, Flag } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { CardFace } from '../components/CardFace';
import { CardTimer } from '../components/CardTimer';
import type { CardTimerStatus, ChoiceType, TruthOrDareCard } from '../types';
import { CHOICE_TYPE } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import type { Timer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface ActionPhaseProps {
  currentPlayer: string;
  choice: ChoiceType;
  card: TruthOrDareCard;
  timer: Timer;
  timerStatus: CardTimerStatus;
  onStartTimer: () => void;
  onDone: () => void;
  onRefuse: () => void;
}

export const ActionPhase: React.FC<ActionPhaseProps> = ({
  currentPlayer,
  choice,
  card,
  timer,
  timerStatus,
  onStartTimer,
  onDone,
  onRefuse,
}) => {
  const { t } = useTranslation();
  const isTruth = choice === CHOICE_TYPE.TRUTH;
  const accent = isTruth ? 'sky' : 'red';

  return (
    <motion.div
      key="action"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex h-full flex-col gap-6 p-5"
    >
      <div className="flex flex-col items-center gap-2 pt-2">
        <div
          className={`rounded-full border px-4 py-1.5 ${
            isTruth
              ? 'bg-premium-sky/10 border-premium-sky/25'
              : 'bg-premium-red/10 border-premium-red/25'
          }`}
        >
          <Typography.Label color={accent} as="span">
            {isTruth ? t(`${NS.TRUTH_OR_DARE}.truthBadge`) : t(`${NS.TRUTH_OR_DARE}.dareBadge`)}
          </Typography.Label>
        </div>
        <Typography.Title className="text-center">{currentPlayer}</Typography.Title>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-2">
        <CardFace text={card.text} accent={accent} />
        {card.timerSeconds > 0 && (
          <CardTimer
            timer={timer}
            total={card.timerSeconds}
            status={timerStatus}
            accent={accent}
            onStart={onStartTimer}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton onClick={onDone} icon={CheckCircle} variant={isTruth ? 'blue' : 'red'}>
          {t(`${NS.TRUTH_OR_DARE}.completed`)}
        </PrimaryButton>
        <button
          onClick={onRefuse}
          className="text-tag flex items-center justify-center gap-2 py-3 font-black tracking-[0.3em] text-white/35 uppercase transition-colors active:text-white/60"
        >
          <Flag className="h-3.5 w-3.5" />
          {t(`${NS.TRUTH_OR_DARE}.refuse`)}
        </button>
      </div>
    </motion.div>
  );
};
