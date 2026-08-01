import { Lightbulb } from 'lucide-react-native';
import { AnimatePresence } from 'moti';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getJustOneWord } from './model/justOneContent';
import { GuessingPhase } from './phases/GuessingPhase';
import { HintingPhase } from './phases/HintingPhase';
import { PassPhase } from './phases/PassPhase';
import { ResultPhase } from './phases/ResultPhase';
import { JustOnePhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { usePlayerCycle } from '@/shared/hooks/usePlayerCycle';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface JustOneGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const JustOneGame: React.FC<JustOneGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const insets = useSafeAreaInsets();
  const guesserIdxState = usePersistedState(GameKey.JustOne, 'guesserIdx', () =>
    Math.floor(Math.random() * playerNames.length)
  );
  const {
    current: guesser,
    idx: guesserIdx,
    next: nextGuesser,
  } = usePlayerCycle(playerNames, guesserIdxState);

  const [word, setWord] = usePersistedState(GameKey.JustOne, 'word', () =>
    getJustOneWord(difficulty)
  );
  const [hints, setHints] = usePersistedState<Record<string, string>>(GameKey.JustOne, 'hints', {});
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
  if (guesserIdx !== prevGuesserIdx) {
    setPrevGuesserIdx(guesserIdx);
    setWord(getJustOneWord(difficulty));
    setHints({});
    setGuess('');
    setPhase(JustOnePhase.Pass);
  }

  const submitHint = useCallback((player: string, hint: string) => {
    const trimmed = hint.trim().toLowerCase();
    if (!trimmed) return;
    setHints((prev) => (prev[player] === trimmed ? prev : { ...prev, [player]: trimmed }));
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

    if (correct) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.correct);
      feedbackService.celebrate('success', { colors: ['#FFCC1F', '#ffffff'] });
    } else {
      feedbackService.playSound('error');
      feedbackService.vibrate(VIBRATE.error);
    }
    setPhase(JustOnePhase.Result);
  }, [guess, word]);

  const handleReady = useCallback(() => {
    setPhase(JustOnePhase.Hinting);
  }, []);

  const hinters = useMemo(
    () => playerNames.filter((_, i) => i !== guesserIdx),
    [playerNames, guesserIdx]
  );

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.just_one.title')}
        subtitle={t(`${NS.JUST_ONE}.subtitle`)}
        icon={Lightbulb}
        theme="yellow"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatePresence exitBeforeEnter>
          {phase === JustOnePhase.Pass && (
            <PassPhase key="pass" guesser={guesser} onReady={handleReady} />
          )}

          {phase === JustOnePhase.Hinting && (
            <HintingPhase
              key="hinting"
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
              key="guessing"
              guesser={guesser}
              visibleHints={visibleHints}
              guess={guess}
              onGuessChange={setGuess}
              onGuess={handleGuess}
            />
          )}

          {phase === JustOnePhase.Result && (
            <ResultPhase
              key="result"
              isCorrect={isCorrect}
              word={word}
              guess={guess}
              onNext={nextGuesser}
            />
          )}
        </AnimatePresence>
      </ScrollView>
    </View>
  );
};
