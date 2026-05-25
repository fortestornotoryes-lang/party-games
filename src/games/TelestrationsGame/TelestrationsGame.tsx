import React, { useState, useEffect } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService, VIBRATE } from '../../services/feedbackService';
import { contentService } from '../../services/contentService';
import { DIFFICULTY_CONFIG, Difficulty } from '../../constants/telestrationsContent';
import { shuffle } from '../../utils/random';
import { GameHeader } from '../../components/GameHeader';
import { DrawingCanvas } from '../../components/DrawingCanvas';
import { PassPhoneCard } from '../../components/PassPhoneCard';
import { TelestrationsPhase, Step } from './types';
import { TelestrationsSetup } from './components/TelestrationsSetup';
import { TelestrationsStart } from './components/TelestrationsStart';
import { TelestrationsGuess } from './components/TelestrationsGuess';
import { TelestrationsGallery } from './components/TelestrationsGallery';

interface TelestrationsGameProps {
  playerNames: string[];
  onBack: () => void;
  initialDifficulty?: Difficulty;
}

export const TelestrationsGame: React.FC<TelestrationsGameProps> = ({ playerNames, onBack, initialDifficulty }) => {
  const [shuffledPlayers, setShuffledPlayers] = useState(() => shuffle(playerNames));
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const [initState] = useState(() => {
    if (!initialDifficulty) return null;
    const word = contentService.getTelestrationsWord(initialDifficulty);
    return { word, difficulty: initialDifficulty };
  });

  const [phase, setPhase] = useState<TelestrationsPhase>(initState ? TelestrationsPhase.Start : TelestrationsPhase.Setup);
  const [difficulty, setDifficulty] = useState<Difficulty>(initState?.difficulty ?? 'medium');
  const [initialWord, setInitialWord] = useState(initState?.word ?? '');
  const [currentWord, setCurrentWord] = useState(initState?.word ?? '');
  const [wordRevealed, setWordRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useCountdown(phase === TelestrationsPhase.Action);

  const currentPlayer = shuffledPlayers[currentRound % shuffledPlayers.length];
  const isDrawingRound = currentRound % 2 === 0;

  const handleStartGame = () => {
    const word = contentService.getTelestrationsWord(difficulty);
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

  const finishAction = (content: string, type: 'draw' | 'guess') => {
    const settings = storageService.getSettings();
    if (type === 'guess') setCurrentWord(content);
    const newSteps: Step[] = [...steps, { type, content, author: currentPlayer }];
    setSteps(newSteps);
    if (currentRound === shuffledPlayers.length - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.celebrate);
      if (settings.visualEffects) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#f97316', '#ffffff'] });
      }
      setPhase(TelestrationsPhase.Gallery);
    } else {
      feedbackService.playSound('click');
      setCurrentRound(prev => prev + 1);
      setPhase(TelestrationsPhase.Transition);
    }
  };

  useEffect(() => {
    if (phase === TelestrationsPhase.Action && !isDrawingRound && timeLeft === 0) finishAction(guess, 'guess');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, isDrawingRound]);

  const subtitle = phase === TelestrationsPhase.Setup
    ? `${playerNames.length} игроков`
    : `${currentRound + 1}/${shuffledPlayers.length} · ${DIFFICULTY_CONFIG[difficulty].label}${phase === TelestrationsPhase.Action || phase === TelestrationsPhase.Transition ? ` · ${isDrawingRound ? 'рисует' : 'угадывает'}` : ''}`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden">
      <GameHeader
        title="TELESTRATIONS"
        subtitle={subtitle}
        icon={Pencil}
        theme="orange"
        onBack={onBack}
      />

      <div className="flex-1 relative min-h-0">
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
              onReveal={() => setWordRevealed(true)}
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
              className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-5"
            >
              <div className="flex items-center gap-1.5">
                {shuffledPlayers.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentRound ? 'bg-premium-orange/40 w-3' :
                    i === currentRound ? 'bg-premium-orange w-6' : 'bg-white/10 w-3'
                  }`} />
                ))}
              </div>
              <div className="w-full max-w-sm">
                <PassPhoneCard
                  playerName={currentPlayer}
                  badge={isDrawingRound ? 'Рисует' : 'Угадывает'}
                  badgeColor={isDrawingRound ? 'orange' : 'sky'}
                  instruction={isDrawingRound ? 'Нажми чтобы увидеть слово' : 'Нажми чтобы увидеть рисунок'}
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
                  onFinish={(dataUrl) => finishAction(dataUrl, 'draw')}
                />
              ) : (
                <TelestrationsGuess
                  lastDrawing={steps[steps.length - 1].content}
                  timeLeft={timeLeft}
                  currentRound={currentRound}
                  shuffledPlayers={shuffledPlayers}
                  guess={guess}
                  onGuessChange={setGuess}
                  onSubmit={() => finishAction(guess, 'guess')}
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
