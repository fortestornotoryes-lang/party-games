import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { ListChecks } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameHeader } from '../../components/GameHeader';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { feedbackService } from '@/services/feedbackService';
import { storageService } from '@/services/storageService';
import { TabooCard, getNextTabooCard, TABOO_REVERSE_CARDS } from '@/constants/tabooReverseContent';
import { TabooReversePhase } from './types';
import { GameKey } from '@/types/games';
import { PassPhase }    from './phases/PassPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { VerdictPhase } from './phases/VerdictPhase';
import { GameOverPhase } from './phases/GameOverPhase';

interface TabooReverseGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TabooReverseGame: React.FC<TabooReverseGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, timerSeconds } = useGameSettings();
  const cardTimer = Math.max(timerSeconds, 20);

  // ── Players & scores ───────────────────────────────────────────────────────
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(playerNames.map(p => [p, 0]))
  );
  const [explainerIdx, setExplainerIdx] = useState(0);
  const currentExplainer = playerNames[explainerIdx % playerNames.length];
  const otherPlayers     = playerNames.filter(p => p !== currentExplainer);

  // ── Round counter (display only — no limit) ────────────────────────────────
  const [roundNum, setRoundNum] = useState(1);

  // ── Card ───────────────────────────────────────────────────────────────────
  const buildUsedIds = (): Set<number> => {
    const usedWords = storageService.getUsedWords(GameKey.TabooReverse);
    if (usedWords.length === 0) return new Set<number>();
    const usedSet = new Set(usedWords);
    return new Set(
      TABOO_REVERSE_CARDS
        .filter(c => c.difficulty === difficulty && usedSet.has(c.word))
        .map(c => c.id),
    );
  };

  const [usedCardIds, setUsedCardIds] = useState<ReadonlySet<number>>(buildUsedIds);
  const [card, setCard]               = useState<TabooCard>(() => getNextTabooCard(difficulty, buildUsedIds()));

  // ── Phase ─────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<TabooReversePhase>(TabooReversePhase.Pass);

  // ── Playing state ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(cardTimer);
  const [timedOut, setTimedOut] = useState(false);

  // ── Verdict state ─────────────────────────────────────────────────────────
  const [usedWordIdxs, setUsedWordIdxs] = useState<Set<number>>(new Set());

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== TabooReversePhase.Playing) return;
    if (timeLeft <= 0) {
      feedbackService.vibrate([80, 40, 80]);
      setTimedOut(true);
      setPhase(TabooReversePhase.Verdict);
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  // ── Confetti on game over ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === TabooReversePhase.GameOver) {
      const settings = storageService.getSettings();
      if (settings.visualEffects) {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 } });
      }
    }
  }, [phase]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setTimeLeft(cardTimer);
    setTimedOut(false);
    setUsedWordIdxs(new Set());
    setPhase(TabooReversePhase.Playing);
  }, [cardTimer]);

  const handleEarlySolve = useCallback(() => {
    setPhase(TabooReversePhase.Verdict);
  }, []);

  const handleToggleWord = useCallback((i: number) => {
    setUsedWordIdxs(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  // guesser = null → nobody guessed; penalty = true → explainer said the word
  const handleVerdict = useCallback((guesser: string | null, penalty = false) => {
    const newScores = { ...scores };

    if (penalty) {
      newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
      feedbackService.playSound('error');
      feedbackService.vibrate(100);
    } else if (guesser) {
      const allWordsUsed = usedWordIdxs.size === card.required.length;
      const points = allWordsUsed ? 2 : 1;
      newScores[guesser] = (newScores[guesser] ?? 0) + points;
      const settings = storageService.getSettings();
      feedbackService.playSound('success');
      if (settings.visualEffects) {
        confetti({
          particleCount: allWordsUsed ? 150 : 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f97316', '#ffffff'],
        });
      }
    }

    // Persist card usage & auto-reset when deck is exhausted
    const afterUsed    = new Set([...usedCardIds, card.id]);
    const totalForDiff = TABOO_REVERSE_CARDS.filter(c => c.difficulty === difficulty).length;
    let effectiveUsed: ReadonlySet<number>;
    if (afterUsed.size >= totalForDiff) {
      storageService.resetUsedWords(GameKey.TabooReverse);
      effectiveUsed = new Set<number>();
    } else {
      storageService.markWordAsUsed(GameKey.TabooReverse, card.word);
      effectiveUsed = afterUsed;
    }

    setUsedCardIds(effectiveUsed);
    setScores(newScores);
    setCard(getNextTabooCard(difficulty, effectiveUsed));
    setRoundNum(r => r + 1);
    setExplainerIdx(i => i + 1);
    setUsedWordIdxs(new Set());
    setPhase(TabooReversePhase.Pass);
  }, [card.id, card.word, card.required.length, currentExplainer, difficulty, scores, usedCardIds, usedWordIdxs]);

  const handleStopGame = useCallback(() => {
    setPhase(TabooReversePhase.GameOver);
  }, []);

  const handleRematch = useCallback(() => {
    setScores(Object.fromEntries(playerNames.map(p => [p, 0])));
    setExplainerIdx(0);
    setRoundNum(1);
    setCard(getNextTabooCard(difficulty, usedCardIds));
    setPhase(TabooReversePhase.Pass);
  }, [difficulty, playerNames, usedCardIds]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen safe-top safe-bottom">
      <GameHeader
        title={GAMES_REGISTRY.taboo_reverse.title}
        subtitle={`Раунд ${roundNum}`}
        icon={ListChecks}
        theme="orange"
        onBack={onBack}
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">

          {phase === TabooReversePhase.Pass && (
            <PassPhase
              playerNames={playerNames}
              scores={scores}
              currentExplainer={currentExplainer}
              onStart={handleStart}
            />
          )}

          {phase === TabooReversePhase.Playing && (
            <PlayingPhase
              card={card}
              currentExplainer={currentExplainer}
              timeLeft={timeLeft}
              cardTimer={cardTimer}
              onEarlySolve={handleEarlySolve}
            />
          )}

          {phase === TabooReversePhase.Verdict && (
            <VerdictPhase
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

          {phase === TabooReversePhase.GameOver && (
            <GameOverPhase
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
