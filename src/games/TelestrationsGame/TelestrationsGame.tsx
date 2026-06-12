import confetti from 'canvas-confetti';
import { Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { TelestrationsGallery } from './components/TelestrationsGallery';
import { TelestrationsGuess } from './components/TelestrationsGuess';
import { TelestrationsSetup } from './components/TelestrationsSetup';
import { TelestrationsStart } from './components/TelestrationsStart';
import { useTelestrationsContent } from './model/useTelestrationsContent';
import type { Step, StepType } from './types';
import { STEP_TYPE, TelestrationsPhase } from './types';

import { GameHeader } from '@/components/GameHeader';
import { PassPhoneCard } from '@/components/PassPhoneCard';
import type { Difficulty } from '@/constants/telestrationsContent';
import { DIFFICULTY_CONFIG } from '@/constants/telestrationsContent';
import { GameKey } from '@/entities/game/types';
import { DrawingCanvas } from '@/shared/components/DrawingCanvas';
import { shuffle } from '@/shared/helpers/random';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { sessionService } from '@/shared/services/sessionService';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY } from '@/shared/types';

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
    const word = useTelestrationsContent(initialDifficulty);
    return { word, difficulty: initialDifficulty };
  });

  const [phase, setPhase] = usePersistedState<TelestrationsPhase>(
    K,
    'phase',
    initState ? TelestrationsPhase.Start : TelestrationsPhase.Setup,
    {
      save: (v) => v,
      // Перезагрузка посреди хода: рисунок на холсте не сохранить,
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
    const settings = storageService.getSettings();
    if (type === STEP_TYPE.Guess) setCurrentWord(content);
    const newSteps: Step[] = [...steps, { type, content, author: currentPlayer }];
    setSteps(newSteps);
    if (currentRound === shuffledPlayers.length - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.celebrate);
      if (settings.visualEffects) {
        void confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#ffffff'],
        });
      }
      setPhase(TelestrationsPhase.Gallery);
    } else {
      feedbackService.playSound('click');
      setCurrentRound((prev) => prev + 1);
      setPhase(TelestrationsPhase.Transition);
    }
  };

  const [timeLeft, setTimeLeft] = useCountdown(phase === TelestrationsPhase.Action, 0, () => {
    if (phase === TelestrationsPhase.Action && !isDrawingRound) {
      finishAction(guess, STEP_TYPE.Guess);
    }
  });

  const handleStartGame = () => {
    const word = useTelestrationsContent(difficulty);
    setInitialWord(word);
    setCurrentWord(word);
    setShuffledPlayers(shuffle(playerNames));
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    setTimeLeft(0);
    setPhase(TelestrationsPhase.Start);
  };

  const startNewGame = () => {
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    setTimeLeft(0);
    setPhase(TelestrationsPhase.Setup);
  };

  const startAction = () => {
    setPhase(TelestrationsPhase.Action);
    setGuess('');
    const cfg = DIFFICULTY_CONFIG[difficulty];
    setTimeLeft(isDrawingRound ? cfg.drawTime : cfg.guessTime);
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
    <div className="flex h-screen flex-col overflow-hidden select-none">
      <GameHeader
        title="TELESTRATIONS"
        subtitle={subtitle}
        icon={Pencil}
        theme="orange"
        onBack={onBack}
      />

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
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
            <motion.div
              key={`transition-${currentRound}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-y-auto p-6"
            >
              <div className="flex items-center gap-1.5">
                {shuffledPlayers.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentRound
                        ? 'bg-premium-orange/40 w-3'
                        : i === currentRound
                          ? 'bg-premium-orange w-6'
                          : 'w-3 bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <div className="w-full max-w-sm">
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
              </div>
            </motion.div>
          )}

          {phase === TelestrationsPhase.Action && (
            <motion.div
              key="action"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col"
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
            </motion.div>
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
      </div>
    </div>
  );
};
