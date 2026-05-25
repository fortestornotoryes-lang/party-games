import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { feedbackService } from '@/services/feedbackService';
import { storageService } from '@/services/storageService';
import { contentService } from '@/services/contentService';
import { useGameSettings } from '@/contexts/GameSettingsContext';
import { GameHeader } from '@/components/GameHeader';
import { GAMES_REGISTRY } from '@/registry/GameRegistry';
import { WavelengthPhase } from './types';
import { PassPhase }    from './phases/PassPhase';
import { CluePhase }    from './phases/CluePhase';
import { GuessingPhase } from './phases/GuessingPhase';
import { RevealPhase }  from './phases/RevealPhase';

interface WavelengthGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [phase, setPhase] = useState<WavelengthPhase>(WavelengthPhase.Pass);
  const [currentPair, setCurrentPair] = useState<string[]>(['', '']);
  const [targetValue, setTargetValue] = useState(50);
  const [guessValue, setGuessValue]   = useState(50);
  const [psychicIdx, setPsychicIdx]   = useState(0);

  useEffect(() => {
    startNewRound();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psychicIdx]);

  const startNewRound = () => {
    const pair = contentService.getWavelengthPair(difficulty);
    setCurrentPair(pair);
    setTargetValue(Math.floor(Math.random() * 90) + 5);
    setGuessValue(50);
    setPhase(WavelengthPhase.Pass);
  };

  const psychic = playerNames[psychicIdx];

  const calculateScore = () => {
    const diff = Math.abs(guessValue - targetValue);
    if (diff <= 2)  return 4;
    if (diff <= 7)  return 3;
    if (diff <= 12) return 2;
    return 0;
  };

  const score = calculateScore();

  useEffect(() => {
    if (phase !== WavelengthPhase.Reveal) return;
    const settings = storageService.getSettings();

    if (score >= 3) {
      feedbackService.playSound('success');
      feedbackService.vibrate([50, 30, 50]);
      if (settings.visualEffects) {
        const colors = score === 4 ? ['#a855f7', '#ffffff', '#eab308'] : ['#a855f7', '#ffffff'];
        confetti({ particleCount: score === 4 ? 200 : 100, spread: 80, origin: { y: 0.6 }, colors });
      }
    } else if (score === 0) {
      feedbackService.playSound('error');
      feedbackService.vibrate(100);
    } else {
      feedbackService.playSound('click');
    }
  }, [phase, score]);

  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY.wavelength.title}
        subtitle="На одной волне"
        icon={Radio}
        theme="purple"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden relative flex flex-col p-6">
        <AnimatePresence mode="wait">

          {phase === WavelengthPhase.Pass && (
            <PassPhase
              psychic={psychic}
              onReady={() => setPhase(WavelengthPhase.Clue)}
            />
          )}

          {phase === WavelengthPhase.Clue && (
            <CluePhase
              psychic={psychic}
              currentPair={currentPair}
              targetValue={targetValue}
              onDone={() => setPhase(WavelengthPhase.Guessing)}
            />
          )}

          {phase === WavelengthPhase.Guessing && (
            <GuessingPhase
              currentPair={currentPair}
              guessValue={guessValue}
              onGuessChange={setGuessValue}
              onConfirm={() => setPhase(WavelengthPhase.Reveal)}
            />
          )}

          {phase === WavelengthPhase.Reveal && (
            <RevealPhase
              currentPair={currentPair}
              targetValue={targetValue}
              guessValue={guessValue}
              score={score}
              onNext={() => setPsychicIdx(i => (i + 1) % playerNames.length)}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
