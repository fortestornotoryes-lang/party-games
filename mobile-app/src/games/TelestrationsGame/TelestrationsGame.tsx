import { Pencil } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TelestrationsGallery } from './components/TelestrationsGallery';
import { TelestrationsGuess } from './components/TelestrationsGuess';
import { TelestrationsSetup } from './components/TelestrationsSetup';
import { TelestrationsStart } from './components/TelestrationsStart';
import { DIFFICULTY_CONFIG } from './constants';
import { getTelestrationsWord } from './model/telestrationsContent';
import type { Step, StepType } from './types';
import { STEP_TYPE, TelestrationsPhase } from './types';

import { GameKey } from '@/entities/game/types';
import { DrawingCanvas } from '@/shared/components/DrawingCanvas';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { shuffle } from '@/shared/helpers/random';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { sessionService } from '@/shared/services/sessionService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

interface TelestrationsGameProps {
  playerNames: string[];
  onBack: () => void;
  initialDifficulty?: Difficulty;
}

export const TelestrationsGame: React.FC<TelestrationsGameProps> = ({
  playerNames,
  onBack,
  initialDifficulty,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const K = GameKey.Telestrations;
  const [shuffledPlayers, setShuffledPlayers] = usePersistedState(K, 'shuffledPlayers', () =>
    shuffle(playerNames)
  );
  const [steps, setSteps] = usePersistedState<Step[]>(K, 'steps', []);
  const [currentRound, setCurrentRound] = usePersistedState(K, 'currentRound', 0);

  const [initState] = useState(() => {
    if (!initialDifficulty) return null;
    // Слово уже восстановлено из сессии — не тратим новое из пула.
    if (sessionService.getField(K, 'initialWord') !== undefined) return null;
    const word = getTelestrationsWord(initialDifficulty);
    return { word, difficulty: initialDifficulty };
  });

  const [phase, setPhase] = usePersistedState<TelestrationsPhase>(
    K,
    'phase',
    initState ? TelestrationsPhase.Start : TelestrationsPhase.Setup,
    {
      save: (v) => v,
      // Перезапуск приложения посреди хода: рисунок на холсте не сохранить,
      // поэтому возвращаемся на экран «передай телефон» — ход начнётся заново.
      load: (raw) =>
        raw === TelestrationsPhase.Action
          ? TelestrationsPhase.Transition
          : (raw as TelestrationsPhase),
    }
  );
  const [difficulty, setDifficulty] = usePersistedState<Difficulty>(
    K,
    'difficulty',
    initState?.difficulty ?? DIFFICULTY.MEDIUM
  );
  const [initialWord, setInitialWord] = usePersistedState(K, 'initialWord', initState?.word ?? '');
  const [currentWord, setCurrentWord] = usePersistedState(K, 'currentWord', initState?.word ?? '');
  const [wordRevealed, setWordRevealed] = usePersistedState(K, 'wordRevealed', false);
  const [guess, setGuess] = useState('');

  const currentPlayer = shuffledPlayers[currentRound % shuffledPlayers.length];
  const isDrawingRound = currentRound % 2 === 0;

  const finishAction = (content: string, type: StepType) => {
    if (type === STEP_TYPE.Guess) setCurrentWord(content);
    const newSteps: Step[] = [...steps, { type, content, author: currentPlayer }];
    setSteps(newSteps);
    if (currentRound === shuffledPlayers.length - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.celebrate);
      feedbackService.celebrate('success', { colors: ['#f97316', '#ffffff'] });
      setPhase(TelestrationsPhase.Gallery);
    } else {
      feedbackService.playSound('click');
      setCurrentRound((prev) => prev + 1);
      setPhase(TelestrationsPhase.Transition);
    }
  };

  const {
    timeLeft,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useTimer({
    initialTime: 0,
    onTimeUp: () => {
      if (phase === TelestrationsPhase.Action && !isDrawingRound) {
        finishAction(guess, STEP_TYPE.Guess);
      }
    },
  });

  // Тикаем только в фазе рисования/угадывания — выход из неё (в т.ч. не через onTimeUp) должен
  // останавливать отсчёт, а не тикать вхолостую в фоне.
  useEffect(() => {
    if (phase === TelestrationsPhase.Action) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [phase, startTimer, pauseTimer]);

  const handleStartGame = () => {
    const word = getTelestrationsWord(difficulty);
    setInitialWord(word);
    setCurrentWord(word);
    setShuffledPlayers(shuffle(playerNames));
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    resetTimer(0);
    setPhase(TelestrationsPhase.Start);
  };

  const startNewGame = () => {
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    resetTimer(0);
    setPhase(TelestrationsPhase.Setup);
  };

  const startAction = () => {
    setPhase(TelestrationsPhase.Action);
    setGuess('');
    const cfg = DIFFICULTY_CONFIG[difficulty];
    resetTimer(isDrawingRound ? cfg.drawTime : cfg.guessTime);
  };

  const diffLabel = t(`${NS.TELESTRATIONS}.difficultyLabels.${difficulty}`);
  const actionLabel = isDrawingRound
    ? t(`${NS.TELESTRATIONS}.draws`)
    : t(`${NS.TELESTRATIONS}.guesses`);
  const subtitle =
    phase === TelestrationsPhase.Setup
      ? t(`${NS.TELESTRATIONS}.playerCount`, { n: playerNames.length })
      : `${currentRound + 1}/${shuffledPlayers.length} · ${diffLabel}${
          phase === TelestrationsPhase.Action || phase === TelestrationsPhase.Transition
            ? ` · ${actionLabel}`
            : ''
        }`;

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title="TELESTRATIONS"
        subtitle={subtitle}
        icon={Pencil}
        theme="orange"
        onBack={onBack}
      />

      <View className="relative flex-1">
        <AnimatePresence exitBeforeEnter>
          {phase === TelestrationsPhase.Setup && (
            <TelestrationsSetup
              playerCount={playerNames.length}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onStart={handleStartGame}
            />
          )}

          {phase === TelestrationsPhase.Start && (
            <TelestrationsStart
              currentPlayer={currentPlayer}
              shuffledPlayers={shuffledPlayers}
              currentWord={currentWord}
              wordRevealed={wordRevealed}
              onReveal={() => {
                setWordRevealed(true);
              }}
              onReady={startAction}
            />
          )}

          {phase === TelestrationsPhase.Transition && (
            <MotiView
              key={`transition-${currentRound}`}
              from={{ opacity: 0, translateX: 60 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -60 }}
              transition={{ type: 'timing', duration: 250 }}
              className="absolute inset-0 items-center justify-center gap-5 p-6"
            >
              <View className="flex-row items-center gap-1.5">
                {shuffledPlayers.map((_, i) => (
                  <View
                    key={i}
                    className={`h-1.5 rounded-full ${
                      i < currentRound
                        ? 'bg-premium-orange/40 w-3'
                        : i === currentRound
                          ? 'bg-premium-orange w-6'
                          : 'w-3 bg-white/10'
                    }`}
                  />
                ))}
              </View>
              <View className="w-full max-w-sm">
                <PassPhoneCard
                  playerName={currentPlayer}
                  badge={
                    isDrawingRound
                      ? t(`${NS.TELESTRATIONS}.draws`)
                      : t(`${NS.TELESTRATIONS}.guesses`)
                  }
                  badgeColor={isDrawingRound ? 'orange' : 'sky'}
                  instruction={
                    isDrawingRound
                      ? t(`${NS.TELESTRATIONS}.tapToSeeWord`)
                      : t(`${NS.TELESTRATIONS}.tapToSeeDrawing`)
                  }
                  onClick={startAction}
                />
              </View>
            </MotiView>
          )}

          {phase === TelestrationsPhase.Action && (
            <MotiView
              key="action"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 200 }}
              className="absolute inset-0"
            >
              {isDrawingRound ? (
                <DrawingCanvas
                  word={currentWord}
                  timeLeft={timeLeft}
                  playerCount={shuffledPlayers.length}
                  currentRound={currentRound}
                  onFinish={(dataUrl) => {
                    finishAction(dataUrl, STEP_TYPE.Draw);
                  }}
                />
              ) : (
                <TelestrationsGuess
                  lastDrawing={steps[steps.length - 1].content}
                  timeLeft={timeLeft}
                  currentRound={currentRound}
                  shuffledPlayers={shuffledPlayers}
                  guess={guess}
                  onGuessChange={setGuess}
                  onSubmit={() => {
                    finishAction(guess, STEP_TYPE.Guess);
                  }}
                />
              )}
            </MotiView>
          )}

          {phase === TelestrationsPhase.Gallery && (
            <TelestrationsGallery
              initialWord={initialWord}
              steps={steps}
              onNewGame={startNewGame}
              onBack={onBack}
            />
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};
