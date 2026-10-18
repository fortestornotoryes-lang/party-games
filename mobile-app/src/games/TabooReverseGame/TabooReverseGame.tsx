import { ListChecks } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { advanceUsedDeck, buildUsedCardIds } from '@/shared/helpers/cardDeck';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface TabooReverseGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const TabooReverseGame: React.FC<TabooReverseGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, timerSeconds, mode } = useGameConfig();
  const insets = useSafeAreaInsets();
  const cardTimer = timerSeconds;
  const isBlitz = mode === TABOO_REVERSE_MODES.BLITZ;
  const isTeam = mode === TABOO_REVERSE_MODES.TEAM;

  // ── Команды (командный режим) ──────────────────────────────────────────────
  // Чётные индексы → команда 1 (orange), нечётные → команда 2 (sky)
  const teams = useMemo<[string[], string[]]>(() => {
    if (!isTeam) return [[], []];
    return [playerNames.filter((_, i) => i % 2 === 0), playerNames.filter((_, i) => i % 2 !== 0)];
  }, [isTeam, playerNames]);

  // ── Игроки и очки ──────────────────────────────────────────────────────────
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

  // В командном режиме угадывать могут только сокомандники объясняющего
  const otherPlayers = useMemo(() => {
    if (isTeam) {
      const explainerTeam = teams[0].includes(currentExplainer) ? teams[0] : teams[1];
      return explainerTeam.filter((p) => p !== currentExplainer);
    }
    return playerNames.filter((p) => p !== currentExplainer);
  }, [isTeam, teams, currentExplainer, playerNames]);

  // ── Счётчик раундов ────────────────────────────────────────────────────────
  const [roundNum, setRoundNum] = usePersistedState(GameKey.TabooReverse, 'roundNum', 1);

  // ── Карточка ───────────────────────────────────────────────────────────────
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

  // ── Фаза ───────────────────────────────────────────────────────────────────
  const [phase, setPhase] = usePersistedState<TabooReversePhase>(
    GameKey.TabooReverse,
    'phase',
    TabooReversePhase.Pass
  );

  // ── Состояние раунда ───────────────────────────────────────────────────────
  const [timedOut, setTimedOut] = usePersistedState(GameKey.TabooReverse, 'timedOut', false);

  // ── Вердикт (классика / команды) ───────────────────────────────────────────
  const [usedWordIdxs, setUsedWordIdxs] = usePersistedState<Set<number>>(
    GameKey.TabooReverse,
    'usedWordIdxs',
    new Set(),
    { save: (s) => [...s], load: (raw) => new Set(raw as number[]) }
  );

  // ── Блиц ───────────────────────────────────────────────────────────────────
  const [blitzResults, setBlitzResults] = usePersistedState<BlitzResult[]>(
    GameKey.TabooReverse,
    'blitzResults',
    []
  );

  // ── Прокрутка колоды (блиц): пометить карту использованной и взять следующую
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

  // ── Таймер ─────────────────────────────────────────────────────────────────
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

  // После перезапуска приложения в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.TabooReverse,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === TabooReversePhase.Playing
  );

  // ── Конфетти на финале ─────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === TabooReversePhase.GameOver) {
      feedbackService.playSound('win');
      feedbackService.vibrate(VIBRATE.win);
      feedbackService.celebrate('win');
    }
  }, [phase]);

  // ── Обработчики ────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setTimedOut(false);
    setUsedWordIdxs(new Set());
    setBlitzResults([]);
    resetTimer(cardTimer);
    startTimer();
    setPhase(TabooReversePhase.Playing);
  }, [cardTimer, resetTimer, startTimer]);

  // «УГАДАНО!» во время Playing: классика/команды → Verdict, блиц → следующая карта.
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

  // Только блиц: пропуск карты (−1 объясняющему)
  const handleSkip = useCallback(() => {
    setBlitzResults((prev) => [...prev, { card, status: 'skipped' }]);
    feedbackService.vibrate(VIBRATE.error);
    cycleCard(card, usedCardIds);
  }, [card, usedCardIds, cycleCard]);

  const handleToggleWord = useCallback((i: number) => {
    setUsedWordIdxs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }, []);

  // Вердикт классики / командного режима
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
        feedbackService.celebrate('small', {
          particleCount: allWordsUsed ? 150 : 70,
          colors: ['#f97316', '#ffffff'],
        });
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

  // Вердикт блица: guessers[i] — имя игрока или null для каждого blitzResult
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
          // пропуск → штраф объясняющему
          newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
        }
      });

      if (anySuccess) {
        feedbackService.playSound('success');
        feedbackService.celebrate('small', {
          particleCount: 100,
          colors: ['#f97316', '#ffffff'],
        });
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

  // ── Статистика блица (для PlayingPhase) ────────────────────────────────────
  const blitzStats = {
    guessed: blitzResults.filter((r) => r.status === 'guessed').length,
    skipped: blitzResults.filter((r) => r.status === 'skipped').length,
  };

  // ── Рендер ─────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.taboo_reverse.title')}
        subtitle={t(`${NS.COMMON}.roundN`, { n: roundNum })}
        icon={ListChecks}
        theme="orange"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
      >
        <AnimatePresence exitBeforeEnter>
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
      </ScrollView>
    </View>
  );
};
