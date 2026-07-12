import { Radio } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import { getWavelengthPair } from './model/wavelengthContent';
import { CluePhase } from './phases/CluePhase';
import { GuessingPhase } from './phases/GuessingPhase';
import { PassPhase } from './phases/PassPhase';
import { RevealPhase } from './phases/RevealPhase';
import { WavelengthPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { randomInt } from '@/shared/helpers/random';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface WavelengthGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const [phase, setPhase] = usePersistedState<WavelengthPhase>(
    GameKey.Wavelength,
    'phase',
    WavelengthPhase.Pass
  );
  const [currentPair, setCurrentPair] = usePersistedState<string[]>(
    GameKey.Wavelength,
    'currentPair',
    () => getWavelengthPair(difficulty)
  );
  const [targetValue, setTargetValue] = usePersistedState(GameKey.Wavelength, 'targetValue', () =>
    randomInt(5, 94)
  );
  const [guessValue, setGuessValue] = usePersistedState(GameKey.Wavelength, 'guessValue', 50);
  const psychicIdxState = usePersistedState(GameKey.Wavelength, 'psychicIdx', 0);
  const { current: psychic, next: nextPsychic } = usePlayerCycle(playerNames, psychicIdxState);

  const handleNextRound = () => {
    nextPsychic();
    setCurrentPair(getWavelengthPair(difficulty));
    setTargetValue(randomInt(5, 94));
    setGuessValue(50);
    setPhase(WavelengthPhase.Pass);
  };
  const calculateScore = () => {
    const diff = Math.abs(guessValue - targetValue);
    if (diff <= 2) return 4;
    if (diff <= 7) return 3;
    if (diff <= 12) return 2;
    return 0;
  };

  const score = calculateScore();

  useEffect(() => {
    if (phase !== WavelengthPhase.Reveal) return;

    if (score >= 3) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.correct);
      feedbackService.celebrate('success', {
        particleCount: score === 4 ? 200 : 100,
        spread: 80,
        colors: score === 4 ? ['#a855f7', '#ffffff', '#eab308'] : ['#a855f7', '#ffffff'],
      });
    } else if (score === 0) {
      feedbackService.playSound('error');
      feedbackService.vibrate(VIBRATE.error);
    } else {
      feedbackService.playSound('click');
    }
  }, [phase, score]);

  return (
    <div className="flex h-screen flex-col">
      <GameHeader
        title={t('registry.games.wavelength.title')}
        subtitle={t(`${NS.WAVELENGTH}.subtitle`)}
        icon={Radio}
        theme="purple"
        onBack={onBack}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden p-6">
        <AnimatePresence mode="wait">
          {phase === WavelengthPhase.Pass && (
            <PassPhase
              psychic={psychic}
              onReady={() => {
                setPhase(WavelengthPhase.Clue);
              }}
            />
          )}

          {phase === WavelengthPhase.Clue && (
            <CluePhase
              psychic={psychic}
              currentPair={currentPair}
              targetValue={targetValue}
              onDone={() => {
                setPhase(WavelengthPhase.Guessing);
              }}
            />
          )}

          {phase === WavelengthPhase.Guessing && (
            <GuessingPhase
              currentPair={currentPair}
              guessValue={guessValue}
              onGuessChange={setGuessValue}
              onConfirm={() => {
                setPhase(WavelengthPhase.Reveal);
              }}
            />
          )}

          {phase === WavelengthPhase.Reveal && (
            <RevealPhase
              currentPair={currentPair}
              targetValue={targetValue}
              guessValue={guessValue}
              score={score}
              onNext={handleNextRound}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
