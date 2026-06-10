import confetti from 'canvas-confetti';
import {Radio} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useEffect} from 'react';

import {useWavelengthContent} from './model/useWavelengthContent';
import {CluePhase} from './phases/CluePhase';
import {GuessingPhase} from './phases/GuessingPhase';
import {PassPhase} from './phases/PassPhase';
import {RevealPhase} from './phases/RevealPhase';
import {WavelengthPhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {useGameSettings} from '@/contexts/GameSettingsContext';
import {usePersistedState} from '@/hooks/usePersistedState';
import {usePlayerCycle} from '@/hooks/usePlayerCycle';
import {GAMES_REGISTRY} from '@/registry/GameRegistry';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {storageService} from '@/services/storageService';
import {GameKey} from '@/types/games';
import {randomInt} from '@/utils/random';

interface WavelengthGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({playerNames, onBack}) => {
    const {difficulty} = useGameSettings();
    const [phase, setPhase] = usePersistedState<WavelengthPhase>(
        GameKey.Wavelength,
        'phase',
        WavelengthPhase.Pass
    );
    const [currentPair, setCurrentPair] = usePersistedState<string[]>(
        GameKey.Wavelength,
        'currentPair',
        () => useWavelengthContent(difficulty)
    );
    const [targetValue, setTargetValue] = usePersistedState(GameKey.Wavelength, 'targetValue', () =>
        randomInt(5, 94)
    );
    const [guessValue, setGuessValue] = usePersistedState(GameKey.Wavelength, 'guessValue', 50);
    const psychicIdxState = usePersistedState(GameKey.Wavelength, 'psychicIdx', 0);
    const {current: psychic, next: nextPsychic} = usePlayerCycle(playerNames, psychicIdxState);

    const handleNextRound = () => {
        nextPsychic();
        setCurrentPair(useWavelengthContent(difficulty));
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
        const settings = storageService.getSettings();

        if (score >= 3) {
            feedbackService.playSound('success');
            feedbackService.vibrate(VIBRATE.correct);
            if (settings.visualEffects) {
                const colors = score === 4 ? ['#a855f7', '#ffffff', '#eab308'] : ['#a855f7', '#ffffff'];
                confetti({
                    particleCount: score === 4 ? 200 : 100,
                    spread: 80,
                    origin: {y: 0.6},
                    colors,
                });
            }
        } else if (score === 0) {
            feedbackService.playSound('error');
            feedbackService.vibrate(VIBRATE.error);
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
                        <PassPhase psychic={psychic} onReady={() => {
                            setPhase(WavelengthPhase.Clue);
                        }}/>
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
