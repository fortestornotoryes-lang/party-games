import { Flame } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import { URGENT_SECONDS } from './constants';
import { renderCard } from './helpers';
import { drawPenaltyTemplate, drawTruthOrDareTemplate } from './model/truthOrDareContent';
import { ActionPhase } from './phases/ActionPhase';
import { ChoicePhase } from './phases/ChoicePhase';
import { PassPhase } from './phases/PassPhase';
import { PenaltyPhase } from './phases/PenaltyPhase';
import type {
  CardTimerStatus,
  ChoiceType,
  RefusalCounts,
  TruthOrDareCard,
  TruthOrDarePhase,
} from './types';
import { CARD_TIMER_STATUS, TRUTH_OR_DARE_PHASE } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface TruthOrDareGameProps {
  playerNames: string[];
  onBack: () => void;
}

const EMPTY_CARD: TruthOrDareCard = { text: '', timerSeconds: 0 };

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const key = GameKey.TruthOrDare;

  const [phase, setPhase] = usePersistedState<TruthOrDarePhase>(
    key,
    'phase',
    TRUTH_OR_DARE_PHASE.PASS
  );
  const playerIdxState = usePersistedState(key, 'playerIdx', 0);
  const { current: currentPlayer, next: nextPlayer } = usePlayerCycle(playerNames, playerIdxState);
  const [choice, setChoice] = usePersistedState<ChoiceType | null>(key, 'choice', null);
  const [card, setCard] = usePersistedState<TruthOrDareCard>(key, 'card', EMPTY_CARD);
  const [timerStatus, setTimerStatus] = usePersistedState<CardTimerStatus>(
    key,
    'timerStatus',
    CARD_TIMER_STATUS.IDLE
  );
  const [refusals, setRefusals] = usePersistedState<RefusalCounts>(key, 'refusals', {});

  const isCardPhase = phase === TRUTH_OR_DARE_PHASE.ACTION || phase === TRUTH_OR_DARE_PHASE.PENALTY;

  const timer = useTimer({
    initialTime: card.timerSeconds,
    onTimeUp: () => {
      // Страховка: таймер живёт вне React и мог дотикать после смены фазы
      if (!isCardPhase) return;
      setTimerStatus(CARD_TIMER_STATUS.DONE);
      feedbackService.playSound('timeout');
      feedbackService.vibrate(VIBRATE.timeout);
    },
  });
  usePersistedTimer(
    key,
    'timer',
    timer,
    isCardPhase && timerStatus === CARD_TIMER_STATUS.RUNNING
  );

  // Тиканье в последние секунды — подпиской, без перерисовки игры
  useEffect(
    () =>
      timer.subscribe((timeLeft) => {
        if (timer.isActive() && timeLeft > 0 && timeLeft <= URGENT_SECONDS) {
          feedbackService.playSound('tickUrgent');
        }
      }),
    [timer]
  );

  const formatSeconds = (n: number) => t(`${NS.TRUTH_OR_DARE}.seconds`, { n });

  const showCard = (template: string) => {
    const next = renderCard(template, currentPlayer, playerNames, formatSeconds);
    timer.reset(next.timerSeconds);
    setCard(next);
    setTimerStatus(CARD_TIMER_STATUS.IDLE);
  };

  const handleChoice = (type: ChoiceType) => {
    showCard(drawTruthOrDareTemplate(type, difficulty, playerNames.length));
    setChoice(type);
    setPhase(TRUTH_OR_DARE_PHASE.ACTION);
  };

  const handleStartTimer = () => {
    timer.reset(card.timerSeconds);
    timer.start();
    setTimerStatus(CARD_TIMER_STATUS.RUNNING);
    feedbackService.playSound('start');
  };

  const handleRefuse = () => {
    setRefusals((prev) => ({ ...prev, [currentPlayer]: (prev[currentPlayer] ?? 0) + 1 }));
    showCard(drawPenaltyTemplate(difficulty, playerNames.length));
    setPhase(TRUTH_OR_DARE_PHASE.PENALTY);
    feedbackService.playSound('error');
    feedbackService.vibrate(VIBRATE.error);
  };

  const handleDone = () => {
    timer.reset(0);
    nextPlayer();
    setChoice(null);
    setCard(EMPTY_CARD);
    setTimerStatus(CARD_TIMER_STATUS.IDLE);
    setPhase(TRUTH_OR_DARE_PHASE.PASS);
  };

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.truth_or_dare.title')}
        subtitle={t(`${NS.TRUTH_OR_DARE}.subtitle`)}
        icon={Flame}
        theme="red"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === TRUTH_OR_DARE_PHASE.PASS && (
            <PassPhase
              currentPlayer={currentPlayer}
              onPassDone={() => {
                setPhase(TRUTH_OR_DARE_PHASE.CHOICE);
              }}
            />
          )}

          {phase === TRUTH_OR_DARE_PHASE.CHOICE && (
            <ChoicePhase
              currentPlayer={currentPlayer}
              refusals={refusals[currentPlayer] ?? 0}
              onChoice={handleChoice}
            />
          )}

          {phase === TRUTH_OR_DARE_PHASE.ACTION && choice !== null && (
            <ActionPhase
              currentPlayer={currentPlayer}
              choice={choice}
              card={card}
              timer={timer}
              timerStatus={timerStatus}
              onStartTimer={handleStartTimer}
              onDone={handleDone}
              onRefuse={handleRefuse}
            />
          )}

          {phase === TRUTH_OR_DARE_PHASE.PENALTY && (
            <PenaltyPhase
              currentPlayer={currentPlayer}
              card={card}
              timer={timer}
              timerStatus={timerStatus}
              refusals={refusals}
              onStartTimer={handleStartTimer}
              onAccept={handleDone}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
