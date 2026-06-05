import {Trophy} from 'lucide-react';
import {AnimatePresence} from 'motion/react';
import React, {useCallback, useEffect, useState} from 'react';

import {BetweenPhase} from './phases/BetweenPhase';
import {GameOverPhase} from './phases/GameOverPhase';
import {PassPhase} from './phases/PassPhase';
import {QuestionPhase} from './phases/QuestionPhase';
import {WinPhase} from './phases/WinPhase';
import {MillionairePhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {
    EASY_QUESTIONS,
    getGuaranteedAmount,
    HARD_QUESTIONS,
    MEDIUM_QUESTIONS,
    type MillionaireQuestion,
    PRIZE_LADDER,
    simulateAudienceVote,
} from '@/constants/millionaireContent';
import {usePlayerCycle} from '@/hooks/usePlayerCycle';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {shuffle} from '@/utils/random';


interface MillionaireGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const MillionaireGame: React.FC<MillionaireGameProps> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const [phase, setPhase] = useState<MillionairePhase>(MillionairePhase.Pass);
    const {current: currentPlayer, next: nextPlayer} = usePlayerCycle(playerNames);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedLifelines, setUsedLifelines] = useState<Set<string>>(new Set());
    const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
    const [audienceVotes, setAudienceVotes] = useState<number[] | null>(null);
    const [phoneFriendSuggestion, setPhoneFriendSuggestion] = useState<number | null>(null);
    const [playerScores, setPlayerScores] = useState<Record<string, string>>({});
    const [currentQuestions, setCurrentQuestions] = useState<MillionaireQuestion[]>([]);

    const initQuestionsForPlayer = useCallback(() => {
        const easy = shuffle([...EASY_QUESTIONS]).slice(0, 5);
        const medium = shuffle([...MEDIUM_QUESTIONS]).slice(0, 5);
        const hard = shuffle([...HARD_QUESTIONS]).slice(0, 5);
        setCurrentQuestions([...easy, ...medium, ...hard]);
    }, []);

    useEffect(() => {
        if (phase !== MillionairePhase.Reveal) return;
        const timer = setTimeout(() => {
            if (isCorrect) {
                if (questionIndex === 14) {
                    setPlayerScores((prev) => ({...prev, [currentPlayer]: PRIZE_LADDER[14]}));
                    feedbackService.vibrate(VIBRATE.celebrate);
                    setPhase(MillionairePhase.Win);
                } else {
                    feedbackService.vibrate(VIBRATE.correct);
                    setPhase(MillionairePhase.Between);
                }
            } else {
                const guaranteed = getGuaranteedAmount(questionIndex);
                setPlayerScores((prev) => ({...prev, [currentPlayer]: guaranteed}));
                feedbackService.vibrate(VIBRATE.error);
                setPhase(MillionairePhase.GameOver);
            }
        }, 2500);
        return () => {
            clearTimeout(timer);
        };
    }, [phase, isCorrect, questionIndex, currentPlayer]);

    const handlePassDone = () => {
        initQuestionsForPlayer();
        setQuestionIndex(0);
        setUsedLifelines(new Set());
        setEliminatedOptions([]);
        setAudienceVotes(null);
        setPhoneFriendSuggestion(null);
        setSelectedAnswer(null);
        setPhase(MillionairePhase.Question);
    };

    const handleAnswer = (answerIndex: number) => {
        const correct = answerIndex === currentQuestions[questionIndex].correctIndex;
        setSelectedAnswer(answerIndex);
        setIsCorrect(correct);
        feedbackService.vibrate(VIBRATE.tap);
        setPhase(MillionairePhase.Reveal);
    };

    const handleTakeMoney = () => {
        setPlayerScores((prev) => ({...prev, [currentPlayer]: PRIZE_LADDER[questionIndex]}));
        feedbackService.vibrate(VIBRATE.win);
        setPhase(MillionairePhase.Win);
    };

    const handleContinue = () => {
        setQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setEliminatedOptions([]);
        setAudienceVotes(null);
        setPhoneFriendSuggestion(null);
        setPhase(MillionairePhase.Question);
    };

    const handleNextPlayer = () => {
        nextPlayer();
        setPhase(MillionairePhase.Pass);
    };

    const handleFiftyFifty = () => {
        if (usedLifelines.has('50_50') || !currentQuestions.length) return;
        const question = currentQuestions[questionIndex];
        const wrongIndices = [0, 1, 2, 3].filter((i) => i !== question.correctIndex);
        const toEliminate = shuffle(wrongIndices).slice(0, 2);
        setEliminatedOptions(toEliminate);
        setUsedLifelines((prev) => new Set([...prev, '50_50']));
        feedbackService.vibrate(VIBRATE.tap);
    };

    const handlePhoneFriend = () => {
        if (usedLifelines.has('phone') || !currentQuestions.length) return;
        setPhoneFriendSuggestion(currentQuestions[questionIndex].correctIndex);
        setUsedLifelines((prev) => new Set([...prev, 'phone']));
        feedbackService.vibrate(VIBRATE.tap);
    };

    const handleAskAudience = () => {
        if (usedLifelines.has('audience') || !currentQuestions.length) return;
        setAudienceVotes(simulateAudienceVote(currentQuestions[questionIndex].correctIndex));
        setUsedLifelines((prev) => new Set([...prev, 'audience']));
        feedbackService.vibrate(VIBRATE.tap);
    };

    const currentQuestion = currentQuestions[questionIndex];

    return (
        <div className="flex flex-col h-screen">
            <GameHeader
                title={t(`${NS.MILLIONAIRE}.gameTitle`)}
                subtitle={t(`${NS.MILLIONAIRE}.subtitle`)}
                icon={Trophy}
                theme="yellow"
                onBack={onBack}
            />
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {phase === MillionairePhase.Pass && (
                        <PassPhase key="pass" currentPlayer={currentPlayer} onPassDone={handlePassDone}/>
                    )}

                    {(phase === MillionairePhase.Question || phase === MillionairePhase.Reveal) && !!currentQuestion && (
                        <QuestionPhase
                            key="question"
                            question={currentQuestion}
                            questionIndex={questionIndex}
                            selectedAnswer={selectedAnswer}
                            isRevealing={phase === MillionairePhase.Reveal}
                            isCorrect={isCorrect}
                            eliminatedOptions={eliminatedOptions}
                            audienceVotes={audienceVotes}
                            phoneFriendSuggestion={phoneFriendSuggestion}
                            usedLifelines={usedLifelines}
                            onAnswer={handleAnswer}
                            onFiftyFifty={handleFiftyFifty}
                            onPhoneFriend={handlePhoneFriend}
                            onAskAudience={handleAskAudience}
                        />
                    )}

                    {phase === MillionairePhase.Between && (
                        <BetweenPhase
                            key="between"
                            currentPlayer={currentPlayer}
                            questionIndex={questionIndex}
                            onTakeMoney={handleTakeMoney}
                            onContinue={handleContinue}
                        />
                    )}

                    {phase === MillionairePhase.Win && (
                        <WinPhase
                            key="win"
                            currentPlayer={currentPlayer}
                            prize={playerScores[currentPlayer] || '0'}
                            playerScores={playerScores}
                            onNextPlayer={handleNextPlayer}
                        />
                    )}

                    {phase === MillionairePhase.GameOver && (
                        <GameOverPhase
                            key="gameover"
                            currentPlayer={currentPlayer}
                            questionIndex={questionIndex}
                            correctAnswer={currentQuestion?.options[currentQuestion.correctIndex]}
                            guaranteed={playerScores[currentPlayer] || '0'}
                            playerScores={playerScores}
                            onNextPlayer={handleNextPlayer}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
