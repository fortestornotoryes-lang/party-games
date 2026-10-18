import { Trophy } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getGuaranteedAmount, type MillionaireQuestion, simulateAudienceVote } from './content';
import { getMillionaireQuestions } from './model/millionaireContent';
import { BetweenPhase } from './phases/BetweenPhase';
import { GameOverPhase } from './phases/GameOverPhase';
import { PassPhase } from './phases/PassPhase';
import { QuestionPhase } from './phases/QuestionPhase';
import { WinPhase } from './phases/WinPhase';
import type { QuestionState } from './types';
import { EMPTY_QUESTION_STATE, MillionairePhase } from './types';

import { GameKey } from '@/entities/game/types';
import { PRIZE_LADDER } from '@/games/MillionaireGame/constants';
import { GameHeader } from '@/shared/components/GameHeader';
import { shuffle } from '@/shared/helpers/random';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface MillionaireGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const MillionaireGame: React.FC<MillionaireGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const K = GameKey.Millionaire;
  const [phase, setPhase] = usePersistedState<MillionairePhase>(K, 'phase', MillionairePhase.Pass);
  const playerIdxState = usePersistedState(K, 'playerIdx', 0);
  const { current: currentPlayer, next: nextPlayer } = usePlayerCycle(playerNames, playerIdxState);
  const [questionIndex, setQuestionIndex] = usePersistedState(K, 'questionIndex', 0);
  const [isCorrect, setIsCorrect] = usePersistedState(K, 'isCorrect', false);
  const [usedLifelines, setUsedLifelines] = usePersistedState<Set<string>>(
    K,
    'usedLifelines',
    new Set(),
    { save: (s) => [...s], load: (raw) => new Set(raw as string[]) }
  );
  // Эфемерное состояние текущего вопроса — одним объектом, чтобы сброс на новый вопрос
  // (handlePassDone/handleContinue) не мог случайно забыть одно из полей.
  const [questionState, setQuestionState] = usePersistedState<QuestionState>(
    K,
    'questionState',
    EMPTY_QUESTION_STATE
  );
  const { selectedAnswer, eliminatedOptions, audienceVotes, phoneFriendSuggestion } = questionState;
  const [playerScores, setPlayerScores] = usePersistedState<Record<string, string>>(
    K,
    'playerScores',
    {}
  );
  const [currentQuestions, setCurrentQuestions] = usePersistedState<MillionaireQuestion[]>(
    K,
    'currentQuestions',
    []
  );

  const initQuestionsForPlayer = useCallback(() => {
    setCurrentQuestions(getMillionaireQuestions());
  }, []);

  useEffect(() => {
    if (phase !== MillionairePhase.Reveal) return;
    const timer = setTimeout(() => {
      if (isCorrect) {
        if (questionIndex === 14) {
          setPlayerScores((prev) => ({ ...prev, [currentPlayer]: PRIZE_LADDER[14] }));
          feedbackService.vibrate(VIBRATE.celebrate);
          setPhase(MillionairePhase.Win);
        } else {
          feedbackService.vibrate(VIBRATE.correct);
          setPhase(MillionairePhase.Between);
        }
      } else {
        const guaranteed = getGuaranteedAmount(questionIndex);
        setPlayerScores((prev) => ({ ...prev, [currentPlayer]: guaranteed }));
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
    setQuestionState(EMPTY_QUESTION_STATE);
    setPhase(MillionairePhase.Question);
  };

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === currentQuestions[questionIndex].correctIndex;
    setQuestionState((s) => ({ ...s, selectedAnswer: answerIndex }));
    setIsCorrect(correct);
    feedbackService.vibrate(VIBRATE.tap);
    setPhase(MillionairePhase.Reveal);
  };

  const handleTakeMoney = () => {
    setPlayerScores((prev) => ({ ...prev, [currentPlayer]: PRIZE_LADDER[questionIndex] }));
    feedbackService.vibrate(VIBRATE.win);
    setPhase(MillionairePhase.Win);
  };

  const handleContinue = () => {
    setQuestionIndex((prev) => prev + 1);
    setQuestionState(EMPTY_QUESTION_STATE);
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
    setQuestionState((s) => ({ ...s, eliminatedOptions: toEliminate }));
    setUsedLifelines((prev) => new Set([...prev, '50_50']));
    feedbackService.vibrate(VIBRATE.tap);
  };

  const handlePhoneFriend = () => {
    if (usedLifelines.has('phone') || !currentQuestions.length) return;
    const suggestion = currentQuestions[questionIndex].correctIndex;
    setQuestionState((s) => ({ ...s, phoneFriendSuggestion: suggestion }));
    setUsedLifelines((prev) => new Set([...prev, 'phone']));
    feedbackService.vibrate(VIBRATE.tap);
  };

  const handleAskAudience = () => {
    if (usedLifelines.has('audience') || !currentQuestions.length) return;
    const votes = simulateAudienceVote(currentQuestions[questionIndex].correctIndex);
    setQuestionState((s) => ({ ...s, audienceVotes: votes }));
    setUsedLifelines((prev) => new Set([...prev, 'audience']));
    feedbackService.vibrate(VIBRATE.tap);
  };

  const currentQuestion = currentQuestions[questionIndex];

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <GameHeader
        title={t(`${NS.MILLIONAIRE}.gameTitle`)}
        subtitle={t(`${NS.MILLIONAIRE}.subtitle`)}
        icon={Trophy}
        theme="yellow"
        onBack={onBack}
      />
      <View className="flex-1 overflow-hidden">
        <AnimatePresence exitBeforeEnter>
          {phase === MillionairePhase.Pass && (
            <PassPhase key="pass" currentPlayer={currentPlayer} onPassDone={handlePassDone} />
          )}

          {(phase === MillionairePhase.Question || phase === MillionairePhase.Reveal) &&
            !!currentQuestion && (
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
      </View>
    </View>
  );
};
