import confetti from 'canvas-confetti';
import { Ban } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect } from 'react';


import type { TabooClassicCard } from './content';
import { getNextTabooClassicCard, TABOO_CLASSIC_CARDS } from './content';
import { GameOverPhase } from './phases/GameOverPhase';
import { PassPhase } from './phases/PassPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { VerdictPhase } from './phases/VerdictPhase';
import { TabooPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { advanceUsedDeck, buildUsedCardIds } from '@/shared/helpers/cardDeck';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { storageService } from '@/shared/services/storageService';

interface TabooGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TabooGame: React.FC<TabooGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, timerSeconds } = useGameSettings();
  const { t } = useTranslation();
  const cardTimer = timerSeconds;

  // ── Players & scores ───────────────────────────────────────────────────────
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    GameKey.Taboo,
    'scores',
    () => Object.fromEntries(playerNames.map((p) => [p, 0]))
  );
  const [explainerIdx, setExplainerIdx] = usePersistedState(GameKey.Taboo, 'explainerIdx', 0);
  const currentExplainer = playerNames[explainerIdx % playerNames.length];
  const otherPlayers = playerNames.filter((p) => p !== currentExplainer);

  // ── Round counter ──────────────────────────────────────────────────────────
  const [roundNum, setRoundNum] = usePersistedState(GameKey.Taboo, 'roundNum', 1);

  // ── Card ───────────────────────────────────────────────────────────────────
  const buildUsedIds = (): Set<number> =>
    buildUsedCardIds(GameKey.Taboo, TABOO_CLASSIC_CARDS, difficulty);

  const [usedCardIds, setUsedCardIds] = usePersistedState<ReadonlySet<number>>(
    GameKey.Taboo,
    'usedCardIds',
    buildUsedIds,
    { save: (s) => [...s], load: (raw) => new Set(raw as number[]) }
  );
  const [card, setCard] = usePersistedState<TabooClassicCard>(GameKey.Taboo, 'card', () =>
    getNextTabooClassicCard(difficulty, buildUsedIds())
  );

  // ── Phase ─────────────────────────────────────────────────────────────────
  const [phase, setPhase] = usePersistedState<TabooPhase>(GameKey.Taboo, 'phase', TabooPhase.Pass);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const [timedOut, setTimedOut] = usePersistedState(GameKey.Taboo, 'timedOut', false);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useTimer({
    initialTime: cardTimer,
    onTimeUp: () => {
      feedbackService.vibrate(VIBRATE.timeout);
      setTimedOut(true);
      setPhase(TabooPhase.Verdict);
    },
  });

  // После перезагрузки страницы в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.Taboo,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === TabooPhase.Playing
  );

  // ── Confetti on game over ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === TabooPhase.GameOver) {
      feedbackService.playSound('win');
      feedbackService.vibrate(VIBRATE.win);
      const settings = storageService.getSettings();
      if (settings.visualEffects) {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 } });
      }
    }
  }, [phase]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setTimedOut(false);
    resetTimer(cardTimer);
    startTimer();
    setPhase(TabooPhase.Playing);
  }, [cardTimer, resetTimer, startTimer]);

  const handleGuessed = useCallback(() => {
    setPhase(TabooPhase.Verdict);
  }, []);

  const handleVerdict = useCallback(
    (guesser: string | null, penalty = false) => {
      const newScores = { ...scores };

      if (penalty) {
        newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
        feedbackService.playSound('error');
        feedbackService.vibrate(VIBRATE.error);
      } else if (guesser) {
        newScores[guesser] = (newScores[guesser] ?? 0) + 1;
        feedbackService.playSound('success');
        const settings = storageService.getSettings();
        if (settings.visualEffects) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#ffffff'],
          });
        }
      }

      // Mark card as used, auto-reset deck when exhausted
      const effectiveUsed = advanceUsedDeck(
        GameKey.Taboo,
        TABOO_CLASSIC_CARDS,
        difficulty,
        usedCardIds,
        card
      );

      setUsedCardIds(effectiveUsed);
      setScores(newScores);
      setCard(getNextTabooClassicCard(difficulty, effectiveUsed));
      setRoundNum((r) => r + 1);
      setExplainerIdx((i) => i + 1);
      setPhase(TabooPhase.Pass);
    },
    [card, currentExplainer, difficulty, scores, usedCardIds]
  );

  const handleStopGame = useCallback(() => {
    setPhase(TabooPhase.GameOver);
  }, []);

  const handleRematch = useCallback(() => {
    setScores(Object.fromEntries(playerNames.map((p) => [p, 0])));
    setExplainerIdx(0);
    setRoundNum(1);
    setCard(getNextTabooClassicCard(difficulty, usedCardIds));
    setPhase(TabooPhase.Pass);
  }, [difficulty, playerNames, usedCardIds]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="safe-top safe-bottom flex min-h-screen flex-col">
      <GameHeader
        title={GAMES_REGISTRY.taboo.title}
        subtitle={t(`${NS.COMMON}.roundN`, { n: roundNum })}
        icon={Ban}
        theme="red"
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === TabooPhase.Pass && (
            <PassPhase
              key="pass"
              playerNames={playerNames}
              scores={scores}
              currentExplainer={currentExplainer}
              onStart={handleStart}
            />
          )}

          {phase === TabooPhase.Playing && (
            <PlayingPhase
              key="playing"
              card={card}
              currentExplainer={currentExplainer}
              timeLeft={timeLeft}
              cardTimer={cardTimer}
              onGuessed={handleGuessed}
            />
          )}

          {phase === TabooPhase.Verdict && (
            <VerdictPhase
              key="verdict"
              card={card}
              timedOut={timedOut}
              currentExplainer={currentExplainer}
              otherPlayers={otherPlayers}
              onVerdict={handleVerdict}
              onStopGame={handleStopGame}
            />
          )}

          {phase === TabooPhase.GameOver && (
            <GameOverPhase
              key="game-over"
              playerNames={playerNames}
              scores={scores}
              onRematch={handleRematch}
              onBack={onBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
