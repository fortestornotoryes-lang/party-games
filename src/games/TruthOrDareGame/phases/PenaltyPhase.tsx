import { Check, Skull } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { CardFace } from '../components/CardFace';
import { CardTimer } from '../components/CardTimer';
import type { CardTimerStatus, RefusalCounts, TruthOrDareCard } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import type { Timer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

const ACCENT = 'orange';

interface PenaltyPhaseProps {
  currentPlayer: string;
  card: TruthOrDareCard;
  timer: Timer;
  timerStatus: CardTimerStatus;
  refusals: RefusalCounts;
  onStartTimer: () => void;
  onAccept: () => void;
}

export const PenaltyPhase: React.FC<PenaltyPhaseProps> = ({
  currentPlayer,
  card,
  timer,
  timerStatus,
  refusals,
  onStartTimer,
  onAccept,
}) => {
  const { t } = useTranslation();
  // Доска позора: только те, кто сливался, по убыванию
  const board = Object.entries(refusals)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      key="penalty"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex h-full flex-col gap-6 p-5"
    >
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="bg-premium-orange/10 border-premium-orange/25 flex items-center gap-2 rounded-full border px-4 py-1.5">
          <Skull className="text-premium-orange h-3.5 w-3.5" />
          <Typography.Label color={ACCENT} as="span">
            {t(`${NS.TRUTH_OR_DARE}.penaltyBadge`)}
          </Typography.Label>
        </div>
        <Typography.Title className="text-center">{currentPlayer}</Typography.Title>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-2">
        <CardFace text={card.text} accent={ACCENT} />
        {card.timerSeconds > 0 && (
          <CardTimer
            timer={timer}
            total={card.timerSeconds}
            status={timerStatus}
            accent={ACCENT}
            onStart={onStartTimer}
          />
        )}
      </div>

      {board.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <Typography.Label color="faint">{t(`${NS.TRUTH_OR_DARE}.shameBoard`)}</Typography.Label>
          <div className="flex flex-wrap justify-center gap-1.5">
            {board.map(([name, n]) => (
              <span
                key={name}
                className={`rounded-full border px-3 py-1 text-sm font-bold ${
                  name === currentPlayer
                    ? 'border-premium-orange/40 bg-premium-orange/10 text-premium-orange'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                {name} · {n}
              </span>
            ))}
          </div>
        </div>
      )}

      <PrimaryButton onClick={onAccept} icon={Check} theme={ACCENT}>
        {t(`${NS.TRUTH_OR_DARE}.accept`)}
      </PrimaryButton>
    </motion.div>
  );
};
