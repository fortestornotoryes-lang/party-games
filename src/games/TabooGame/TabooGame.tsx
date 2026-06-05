import confetti from 'canvas-confetti';
import {Ban} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useCallback, useEffect, useState} from 'react';

import {useGameSettings} from '../../contexts/GameSettingsContext';
import {GAMES_REGISTRY} from '../../registry/GameRegistry';

import {GameOverPhase} from './phases/GameOverPhase';
import {PassPhase} from './phases/PassPhase';
import {PlayingPhase} from './phases/PlayingPhase';
import {VerdictPhase} from './phases/VerdictPhase';
import {TabooPhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import type {TabooClassicCard} from '@/constants/tabooContent';
import {getNextTabooClassicCard, TABOO_CLASSIC_CARDS} from '@/constants/tabooContent';
import {useTimer} from '@/hooks/useTimer';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {storageService} from '@/services/storageService';
import {GameKey} from '@/types/games';


interface TabooGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const TabooGame: React.FC<TabooGameProps> = ({playerNames, onBack}) => {
    const {difficulty, timerSeconds} = useGameSettings();
    const {t} = useTranslation();
    const cardTimer = timerSeconds;

    // ── Players & scores ───────────────────────────────────────────────────────
    const [scores, setScores] = useState<Record<string, number>>(() =>
        Object.fromEntries(playerNames.map((p) => [p, 0]))
    );
    const [explainerIdx, setExplainerIdx] = useState(0);
    const currentExplainer = playerNames[explainerIdx % playerNames.length];
    const otherPlayers = playerNames.filter((p) => p !== currentExplainer);

    // ── Round counter ──────────────────────────────────────────────────────────
    const [roundNum, setRoundNum] = useState(1);

    // ── Card ───────────────────────────────────────────────────────────────────
    const buildUsedIds = (): Set<number> => {
        const usedWords = storageService.getUsedWords(GameKey.Taboo);
        if (usedWords.length === 0) return new Set<number>();
        const usedSet = new Set(usedWords);
        return new Set(
            TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty && usedSet.has(c.word)).map(
                (c) => c.id
            )
        );
    };

    const [usedCardIds, setUsedCardIds] = useState<ReadonlySet<number>>(buildUsedIds);
    const [card, setCard] = useState<TabooClassicCard>(() =>
        getNextTabooClassicCard(difficulty, buildUsedIds())
    );

    // ── Phase ─────────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState<TabooPhase>(TabooPhase.Pass);

    // ── Timer ──────────────────────────────────────────────────────────────────
    const [timedOut, setTimedOut] = useState(false);

    const {
        timeLeft,
        start: startTimer,
        reset: resetTimer,
    } = useTimer({
        initialTime: cardTimer,
        onTimeUp: () => {
            feedbackService.vibrate(VIBRATE.timeout);
            setTimedOut(true);
            setPhase(TabooPhase.Verdict);
        },
    });

    // ── Confetti on game over ──────────────────────────────────────────────────
    useEffect(() => {
        if (phase === TabooPhase.GameOver) {
            feedbackService.playSound('win');
            feedbackService.vibrate(VIBRATE.win);
            const settings = storageService.getSettings();
            if (settings.visualEffects) {
                confetti({particleCount: 200, spread: 80, origin: {y: 0.5}});
            }
        }
    }, [phase]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleStart = useCallback(() => {
        setTimedOut(false);
        resetTimer(cardTimer);
        startTimer();
        setPhase(TabooPhase.Playing);
    }, [cardTimer, resetTimer, startTimer]);

    const handleGuessed = useCallback(() => {
        setPhase(TabooPhase.Verdict);
    }, []);

    const handleVerdict = useCallback(
        (guesser: string | null, penalty = false) => {
            const newScores = {...scores};

            if (penalty) {
                newScores[currentExplainer] = (newScores[currentExplainer] ?? 0) - 1;
                feedbackService.playSound('error');
                feedbackService.vibrate(VIBRATE.error);
            } else if (guesser) {
                newScores[guesser] = (newScores[guesser] ?? 0) + 1;
                feedbackService.playSound('success');
                const settings = storageService.getSettings();
                if (settings.visualEffects) {
                    confetti({
                        particleCount: 80,
                        spread: 60,
                        origin: {y: 0.6},
                        colors: ['#ef4444', '#ffffff'],
                    });
                }
            }

            // Mark card as used, auto-reset deck when exhausted
            const afterUsed = new Set([...usedCardIds, card.id]);
            const totalForDiff = TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty).length;
            let effectiveUsed: ReadonlySet<number>;
            if (afterUsed.size >= totalForDiff) {
                storageService.resetUsedWords(GameKey.Taboo);
                effectiveUsed = new Set<number>();
            } else {
                storageService.markWordAsUsed(GameKey.Taboo, card.word);
                effectiveUsed = afterUsed;
            }

            setUsedCardIds(effectiveUsed);
            setScores(newScores);
            setCard(getNextTabooClassicCard(difficulty, effectiveUsed));
            setRoundNum((r) => r + 1);
            setExplainerIdx((i) => i + 1);
            setPhase(TabooPhase.Pass);
        },
        [card, currentExplainer, difficulty, scores, usedCardIds]
    );

    const handleStopGame = useCallback(() => {
        setPhase(TabooPhase.GameOver);
    }, []);

    const handleRematch = useCallback(() => {
        setScores(Object.fromEntries(playerNames.map((p) => [p, 0])));
        setExplainerIdx(0);
        setRoundNum(1);
        setCard(getNextTabooClassicCard(difficulty, usedCardIds));
        setPhase(TabooPhase.Pass);
    }, [difficulty, playerNames, usedCardIds]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col min-h-screen safe-top safe-bottom">
            <GameHeader
                title={GAMES_REGISTRY.taboo.title}
                subtitle={t(`${NS.COMMON}.roundN`, {n: roundNum})}
                icon={Ban}
                theme="red"
                onBack={onBack}
            />

            <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {phase === TabooPhase.Pass && (
                        <PassPhase
                            key="pass"
                            playerNames={playerNames}
                            scores={scores}
                            currentExplainer={currentExplainer}
                            onStart={handleStart}
                        />
                    )}

                    {phase === TabooPhase.Playing && (
                        <PlayingPhase
                            key="playing"
                            card={card}
                            currentExplainer={currentExplainer}
                            timeLeft={timeLeft}
                            cardTimer={cardTimer}
                            onGuessed={handleGuessed}
                        />
                    )}

                    {phase === TabooPhase.Verdict && (
                        <VerdictPhase
                            key="verdict"
                            card={card}
                            timedOut={timedOut}
                            currentExplainer={currentExplainer}
                            otherPlayers={otherPlayers}
                            onVerdict={handleVerdict}
                            onStopGame={handleStopGame}
                        />
                    )}

                    {phase === TabooPhase.GameOver && (
                        <GameOverPhase
                            key="game-over"
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
