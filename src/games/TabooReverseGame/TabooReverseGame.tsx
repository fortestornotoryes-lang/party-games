import confetti from 'canvas-confetti';
import { ListChecks } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect, useMemo } from 'react';


import { TABOO_REVERSE_MODES } from './constants';
import type { TabooCard } from './content';
import { getNextTabooCard, TABOO_REVERSE_CARDS } from './content';
import { BlitzVerdictPhase } from './phases/BlitzVerdictPhase';
import { GameOverPhase } from './phases/GameOverPhase';
import { PassPhase } from './phases/PassPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { VerdictPhase } from './phases/VerdictPhase';
import type { BlitzResult } from './types';
import { TabooReversePhase } from './types';

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

interface TabooReverseGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TabooReverseGame: React.FC<TabooReverseGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, timerSeconds, mode } = useGameSettings();
  const cardTimer = timerSeconds;
  const isBlitz = mode === TABOO_REVERSE_MODES.BLITZ;
  const isTeam = mode === TABOO_REVERSE_MODES.TEAM;

  // ── Teams (team mode) ──────────────────────────────────────────────────────
  // Even-index players → team 1 (orange), odd-index → team 2 (sky)
  const teams = useMemo<[string[], string[]]>(() => {
    if (!isTeam) return [[], []];
    return [playerNames.filter((_, i) => i % 2 === 0), playerNames.filter((_, i) => i % 2 !== 0)];
  }, [isTeam, playerNames]);

  // ── Players & scores ───────────────────────────────────────────────────────
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    GameKey.TabooReverse,
    'scores',
    () => Object.fromEntries(playerNames.map((p) => [p, 0]))
  );
  const [explainerIdx, setExplainerIdx] = usePersistedState(
    GameKey.TabooReverse,
    'explainerIdx',
    0
  );
  const currentExplainer = playerNames[explainerIdx % playerNames.length];

  // In team mode, only the explainer's teammates can guess
  const otherPlayers = useMemo(() => {
    if (isTeam) {
      const explainerTeam = teams[0].includes(currentExplainer) ? teams[0] : teams[1];
      return explainerTeam.filter((p) => p !== currentExplainer);
    }
    return playerNames.filter((p) => p !== currentExplainer);
  }, [isTeam, teams, currentExplainer, playerNames]);

  // ── Round counter ──────────────────────────────────────────────────────────
  const [roundNum, setRoundNum] = usePersistedState(GameKey.TabooReverse, 'roundNum', 1);

  // ── Card ───────────────────────────────────────────────────────────────────
  const buildUsedIds = (): Set<number> =>
    buildUsedCardIds(GameKey.TabooReverse, TABOO_REVERSE_CARDS, difficulty);

  const [usedCardIds, setUsedCardIds] = usePersistedState<ReadonlySet<number>>(
    GameKey.TabooReverse,
    'usedCardIds',
    buildUsedIds,
    { save: (s) => [...s], load: (raw) => new Set(raw as number[]) }
  );
  const [card, setCard] = usePersistedState<TabooCard>(GameKey.TabooReverse, 'card', () =>
    getNextTabooCard(difficulty, buildUsedIds())
  );

  // ── Phase ─────────────────────────────────────────────────────────────────
  const [phase, setPhase] = usePersistedState<TabooReversePhase>(
    GameKey.TabooReverse,
    'phase',
    TabooReversePhase.Pass
  );

  // ── Playing state ──────────────────────────────────────────────────────────
  const [timedOut, setTimedOut] = usePersistedState(GameKey.TabooReverse, 'timedOut', false);

  // ── Verdict state (classic / team) ────────────────────────────────────────
  const [usedWordIdxs, setUsedWordIdxs] = usePersistedState<Set<number>>(
    GameKey.TabooReverse,
    'usedWordIdxs',
    new Set(),
    { save: (s) => [...s], load: (raw) => new Set(raw as number[]) }
  );

  // ── Blitz state ───────────────────────────────────────────────────────────
  const [blitzResults, setBlitzResults] = usePersistedState<BlitzResult[]>(
    GameKey.TabooReverse,
    'blitzResults',
    []
  );

  // ── Card-cycling helper (blitz) ────────────────────────────────────────────
  // Marks the card as used and loads the next one.
  const cycleCard = useCallback(
    (prevCard: TabooCard, prevUsed: ReadonlySet<number>) => {
      const effectiveUsed = advanceUsedDeck(
        GameKey.TabooReverse,
        TABOO_REVERSE_CARDS,
        difficulty,
        prevUsed,
        prevCard
      );
      setUsedCardIds(effectiveUsed);
      setCard(getNextTabooCard(difficulty, effectiveUsed));
    },
    [difficulty]
  );

  // ── Timer ─────────────────────────────────────────────────────────────────
  const handleTimeUp = useCallback(() => {
    feedbackService.vibrate(VIBRATE.timeout);
    setTimedOut(true);
    setPhase(isBlitz ? TabooReversePhase.BlitzVerdict : TabooReversePhase.Verdict);
  }, [isBlitz]);

  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useTimer({
    initialTime: cardTimer,
    onTimeUp: handleTimeUp,
  });

  // После перезагрузки страницы в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.TabooReverse,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === TabooReversePhase.Playing
  );

  // ── Confetti on game over ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === TabooReversePhase.GameOver) {
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
    setUsedWordIdxs(new Set());
    setBlitzResults([]);
    resetTimer(cardTimer);
    startTimer();
    setPhase(TabooReversePhase.Playing);
  }, [cardTimer, resetTimer, startTimer]);

  // Called when "УГАДАНО!" is pressed during Playing.
  // Classic/team → go to Verdict.  Blitz → record and load next card.
  const handleGuessed = useCallback(() => {
    if (isBlitz) {
      setBlitzResults((prev) => [...prev, { card, status: 'guessed' }]);
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.correct);
      cycleCard(card, usedCardIds);
    } else {
      setPhase(TabooReversePhase.Verdict);
    }
  }, [isBlitz, card, usedCardIds, cycleCard]);

  // Blitz only: skip current card (−1 to explainer)
  const handleSkip = useCallback(() => {
    setBlitzResults((prev) => [...prev, { card, status: 'skipped' }]);
    feedbackService.vibrate(VIBRATE.error);
    cycleCard(card, usedCardIds);
  }, [card, usedCardIds, cycleCard]);

  const handleToggleWord = useCallback((i: number) => {
    setUsedWordIdxs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  // Classic / team mode verdict
  const handleVerdict = useCallback(
    (guesser: string | null, penalty = false) => {
      const newScores = { ...scores };

      if (penalty) {
        newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
        feedbackService.playSound('error');
        feedbackService.vibrate(VIBRATE.error);
      } else if (guesser) {
        const allWordsUsed = usedWordIdxs.size === card.required.length;
        const points = allWordsUsed ? 2 : 1;
        newScores[guesser] = (newScores[guesser] ?? 0) + points;
        feedbackService.playSound('success');
        const settings = storageService.getSettings();
        if (settings.visualEffects) {
          confetti({
            particleCount: allWordsUsed ? 150 : 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ffffff'],
          });
        }
      }

      const effectiveUsed = advanceUsedDeck(
        GameKey.TabooReverse,
        TABOO_REVERSE_CARDS,
        difficulty,
        usedCardIds,
        card
      );

      setUsedCardIds(effectiveUsed);
      setScores(newScores);
      setCard(getNextTabooCard(difficulty, effectiveUsed));
      setRoundNum((r) => r + 1);
      setExplainerIdx((i) => i + 1);
      setUsedWordIdxs(new Set());
      setPhase(TabooReversePhase.Pass);
    },
    [card, currentExplainer, difficulty, scores, usedCardIds, usedWordIdxs]
  );

  // Blitz verdict: guessers[i] = player name or null for each blitzResult
  const handleBlitzVerdict = useCallback(
    (guessers: (string | null)[]) => {
      const newScores = { ...scores };
      let anySuccess = false;

      blitzResults.forEach((result, i) => {
        if (result.status === 'guessed') {
          const guesser = guessers[i] ?? null;
          if (guesser) {
            newScores[guesser] = (newScores[guesser] ?? 0) + 1;
            anySuccess = true;
          }
        } else {
          // skipped → penalty for explainer
          newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
        }
      });

      if (anySuccess) {
        feedbackService.playSound('success');
        const settings = storageService.getSettings();
        if (settings.visualEffects) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ffffff'],
          });
        }
      }

      setScores(newScores);
      setBlitzResults([]);
      setRoundNum((r) => r + 1);
      setExplainerIdx((i) => i + 1);
      setPhase(TabooReversePhase.Pass);
    },
    [blitzResults, currentExplainer, scores]
  );

  const handleStopGame = useCallback(() => {
    setPhase(TabooReversePhase.GameOver);
  }, []);

  const handleRematch = useCallback(() => {
    setScores(Object.fromEntries(playerNames.map((p) => [p, 0])));
    setExplainerIdx(0);
    setRoundNum(1);
    setBlitzResults([]);
    setCard(getNextTabooCard(difficulty, usedCardIds));
    setPhase(TabooReversePhase.Pass);
  }, [difficulty, playerNames, usedCardIds]);

  // ── Blitz stats (shown inside PlayingPhase) ────────────────────────────────
  const blitzStats = {
    guessed: blitzResults.filter((r) => r.status === 'guessed').length,
    skipped: blitzResults.filter((r) => r.status === 'skipped').length,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="safe-top safe-bottom flex min-h-screen flex-col">
      <GameHeader
        title={GAMES_REGISTRY.taboo_reverse.title}
        subtitle={t(`${NS.COMMON}.roundN`, { n: roundNum })}
        icon={ListChecks}
        theme="orange"
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === TabooReversePhase.Pass && (
            <PassPhase
              key="pass"
              playerNames={playerNames}
              scores={scores}
              currentExplainer={currentExplainer}
              teams={isTeam ? teams : undefined}
              onStart={handleStart}
            />
          )}

          {phase === TabooReversePhase.Playing && (
            <PlayingPhase
              key="playing"
              card={card}
              currentExplainer={currentExplainer}
              timeLeft={timeLeft}
              cardTimer={cardTimer}
              isBlitz={isBlitz}
              blitzStats={blitzStats}
              onGuessed={handleGuessed}
              onSkip={isBlitz ? handleSkip : undefined}
            />
          )}

          {phase === TabooReversePhase.Verdict && (
            <VerdictPhase
              key="verdict"
              card={card}
              timedOut={timedOut}
              currentExplainer={currentExplainer}
              otherPlayers={otherPlayers}
              usedWordIdxs={usedWordIdxs}
              onToggleWord={handleToggleWord}
              onVerdict={handleVerdict}
              onStopGame={handleStopGame}
            />
          )}

          {phase === TabooReversePhase.BlitzVerdict && (
            <BlitzVerdictPhase
              key="blitz-verdict"
              results={blitzResults}
              currentExplainer={currentExplainer}
              otherPlayers={otherPlayers}
              onConfirm={handleBlitzVerdict}
              onStopGame={handleStopGame}
            />
          )}

          {phase === TabooReversePhase.GameOver && (
            <GameOverPhase
              key="game-over"
              playerNames={playerNames}
              scores={scores}
              teams={isTeam ? teams : undefined}
              onRematch={handleRematch}
              onBack={onBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
