import confetti from 'canvas-confetti';
import {Lightbulb} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useCallback, useMemo, useState} from 'react';

import {useJustOneContent} from './model/useJustOneContent';
import {GuessingPhase} from './phases/GuessingPhase';
import {HintingPhase} from './phases/HintingPhase';
import {PassPhase} from './phases/PassPhase';
import {ResultPhase} from './phases/ResultPhase';
import {JustOnePhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {useGameSettings} from '@/entities/game/model/GameSettingsContext';
import {GAMES_REGISTRY} from '@/entities/game/registry';
import {GameKey} from '@/entities/game/types';
import {usePersistedState} from '@/shared/hooks/usePersistedState';
import {usePlayerCycle} from '@/shared/hooks/usePlayerCycle';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {feedbackService, VIBRATE} from '@/shared/services/feedbackService';
import {storageService} from '@/shared/services/storageService';

interface JustOneGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const JustOneGame: React.FC<JustOneGameProps> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const {difficulty} = useGameSettings();
    const guesserIdxState = usePersistedState(GameKey.JustOne, 'guesserIdx', () =>
        Math.floor(Math.random() * playerNames.length)
    );
    const {current: guesser, idx: guesserIdx, next: nextGuesser} = usePlayerCycle(
        playerNames,
        guesserIdxState
    );

    const [word, setWord] = usePersistedState(GameKey.JustOne, 'word', () =>
        useJustOneContent(difficulty)
    );
    const [hints, setHints] = usePersistedState<Record<string, string>>(
        GameKey.JustOne,
        'hints',
        {}
    );
    const [phase, setPhase] = usePersistedState<JustOnePhase>(
        GameKey.JustOne,
        'phase',
        JustOnePhase.Pass
    );
    const [guess, setGuess] = usePersistedState(GameKey.JustOne, 'guess', '');
    const [isCorrect, setIsCorrect] = usePersistedState(GameKey.JustOne, 'isCorrect', false);
    const [visibleHints, setVisibleHints] = usePersistedState<string[]>(
        GameKey.JustOne,
        'visibleHints',
        []
    );

    // Храним индекс игрока с предыдущего рендера
    const [prevGuesserIdx, setPrevGuesserIdx] = useState(guesserIdx);

    // Если индекс изменился, сбрасываем стейт прямо во время рендеринга
    // TODO: RN — replace with useEffect async load (render-time call incompatible with async)
    if (guesserIdx !== prevGuesserIdx) {
        setPrevGuesserIdx(guesserIdx);
        setWord(useJustOneContent(difficulty));
        setHints({});
        setGuess('');
        setPhase(JustOnePhase.Pass);
    }


    const submitHint = useCallback((player: string, hint: string) => {
        const trimmed = hint.trim().toLowerCase();
        if (!trimmed) return;
        setHints((prev) => (prev[player] === trimmed ? prev : {...prev, [player]: trimmed}));
    }, []);

    const startGuessing = useCallback(() => {
        const counts: Record<string, number> = {};
        const vals = Object.values(hints);

        for (const h of vals) {
            counts[h] = (counts[h] || 0) + 1;
        }

        setVisibleHints(vals.filter((h) => counts[h] === 1));
        setPhase(JustOnePhase.Guessing);
    }, [hints]);

    const handleGuess = useCallback(() => {
        const correct = guess.trim().toLowerCase() === word.toLowerCase();
        setIsCorrect(correct);
        const settings = storageService.getSettings();

        if (correct) {
            feedbackService.playSound('success');
            feedbackService.vibrate(VIBRATE.correct);
            if (settings.visualEffects) {
                void confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: {y: 0.6},
                    colors: ['#FFCC1F', '#ffffff'],
                });
            }
        } else {
            feedbackService.playSound('error');
            feedbackService.vibrate(VIBRATE.error);
        }
        setPhase(JustOnePhase.Result);
    }, [guess, word]);

    const handleReady = useCallback(() => {
        setPhase(JustOnePhase.Hinting);
    }, []);

    const hinters = useMemo(() => playerNames.filter((_, i) => i !== guesserIdx), [playerNames, guesserIdx]);

    return (
        <div className="flex flex-col h-screen">
            <GameHeader
                title={GAMES_REGISTRY.just_one.title}
                subtitle={t(`${NS.JUST_ONE}.subtitle`)}
                icon={Lightbulb}
                theme="yellow"
                onBack={onBack}
            />

            <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {phase === JustOnePhase.Pass && (
                        <PassPhase guesser={guesser} onReady={handleReady}/>
                    )}

                    {phase === JustOnePhase.Hinting && (
                        <HintingPhase
                            word={word}
                            guesser={guesser}
                            hinters={hinters}
                            hints={hints}
                            onSubmitHint={submitHint}
                            onStartGuessing={startGuessing}
                        />
                    )}

                    {phase === JustOnePhase.Guessing && (
                        <GuessingPhase
                            guesser={guesser}
                            visibleHints={visibleHints}
                            guess={guess}
                            onGuessChange={setGuess}
                            onGuess={handleGuess}
                        />
                    )}

                    {phase === JustOnePhase.Result && (
                        <ResultPhase isCorrect={isCorrect} word={word} guess={guess} onNext={nextGuesser}/>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};