import { Drama } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import {
  CROCODILE_LEVELS,
  DEFAULT_TARGET_SCORE,
  MIN_TEAMS,
  TEAM_STYLES,
  URGENT_SECONDS,
} from './constants';
import { applyReplacePenalty, buildTeams, finishTurn, movePlayerToNextTeam } from './helpers';
import { drawWordOptions } from './model/crocodileContent';
import { ChooseWordPhase } from './phases/ChooseWordPhase';
import { GameOverPhase } from './phases/GameOverPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { RoundEndPhase } from './phases/RoundEndPhase';
import { SetupPhase } from './phases/SetupPhase';
import { StartPhase } from './phases/StartPhase';
import type { Team, WordOption } from './types';
import { CrocodilePhase } from './types';

import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface CrocodileGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const CrocodileGame: React.FC<CrocodileGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const [teams, setTeams] = usePersistedState<Team[]>(GameKey.Crocodile, 'teams', []);
  const [currentTeamIdx, setCurrentTeamIdx] = usePersistedState(
    GameKey.Crocodile,
    'currentTeamIdx',
    0
  );
  const [phase, setPhase] = usePersistedState<CrocodilePhase>(
    GameKey.Crocodile,
    'phase',
    CrocodilePhase.Setup
  );
  const [targetScore, setTargetScore] = usePersistedState(
    GameKey.Crocodile,
    'targetScore',
    DEFAULT_TARGET_SCORE
  );
  const [wordOptions, setWordOptions] = usePersistedState<WordOption[]>(
    GameKey.Crocodile,
    'wordOptions',
    []
  );
  const [chosen, setChosen] = usePersistedState<WordOption | null>(
    GameKey.Crocodile,
    'chosen',
    null
  );
  const [guessed, setGuessed] = usePersistedState(GameKey.Crocodile, 'guessed', false);
  const [timedOut, setTimedOut] = usePersistedState(GameKey.Crocodile, 'timedOut', false);

  const roundTime = chosen ? CROCODILE_LEVELS[chosen.difficulty].time : 0;
  // Секунды читает только PlayingPhase — корень на тиках не перерисовывается
  const timer = useTimer({
    initialTime: roundTime,
    onTimeUp: () => {
      feedbackService.playSound('timeout');
      feedbackService.vibrate(VIBRATE.timeout);
      setGuessed(false);
      setTimedOut(true);
      setPhase(CrocodilePhase.RoundEnd);
    },
  });
  const { start: startTimer, reset: resetTimer } = timer;

  // После перезагрузки страницы в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(GameKey.Crocodile, 'timeLeft', timer, phase === CrocodilePhase.Playing);

  // Тик каждую секунду, пока идёт время; в последние секунды — выше и громче.
  useEffect(() => {
    if (phase !== CrocodilePhase.Playing) return;
    const tick = (timeLeft: number) => {
      if (timeLeft > 0)
        feedbackService.playSound(timeLeft <= URGENT_SECONDS ? 'tickUrgent' : 'tick');
    };
    tick(timer.getTimeLeft());
    return timer.subscribe(tick);
  }, [phase, timer]);

  useEffect(() => {
    // Команды уже восстановлены из сессии — не перетасовываем заново.
    if (teams.length > 0) return;
    setTeams(buildTeams(playerNames, MIN_TEAMS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

  // Смена числа команд и «Перемешать» — новая случайная раздача; ручные правки сбрасываются.
  const reshuffle = (count: number) => {
    setTeams(buildTeams(playerNames, count));
  };

  const showWords = () => {
    setWordOptions(drawWordOptions());
    setPhase(CrocodilePhase.ChooseWord);
  };

  // Замена всех трёх слов стоит команде очко (счёт может уйти в минус).
  const replaceWords = () => {
    feedbackService.playSound('error');
    feedbackService.vibrate(VIBRATE.error);
    setTeams((prev) => applyReplacePenalty(prev, currentTeamIdx));
    setWordOptions(drawWordOptions());
  };

  const chooseWord = (option: WordOption) => {
    setChosen(option);
    setGuessed(false);
    setTimedOut(false);
    resetTimer(CROCODILE_LEVELS[option.difficulty].time);
    setPhase(CrocodilePhase.Playing);
    feedbackService.playSound('start');
    startTimer();
  };

  const handleGuessed = () => {
    feedbackService.playSound('success');
    feedbackService.vibrate(VIBRATE.correct);
    setGuessed(true);
    setPhase(CrocodilePhase.RoundEnd);
  };

  const handleGiveUp = () => {
    feedbackService.playSound('error');
    feedbackService.vibrate(VIBRATE.error);
    setGuessed(false);
    setPhase(CrocodilePhase.RoundEnd);
  };

  const finishRound = () => {
    const points = guessed && chosen ? CROCODILE_LEVELS[chosen.difficulty].points : 0;
    const updatedTeams = finishTurn(teams, currentTeamIdx, points);
    setTeams(updatedTeams);
    if (updatedTeams[currentTeamIdx].score >= targetScore) {
      setPhase(CrocodilePhase.GameOver);
    } else {
      setCurrentTeamIdx((i) => (i + 1) % teams.length);
      setPhase(CrocodilePhase.Start);
    }
  };

  useEffect(() => {
    if (phase !== CrocodilePhase.GameOver) return;
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    feedbackService.celebrate('win', {
      origin: { y: 0.6 },
      colors: [TEAM_STYLES[teams[currentTeamIdx].color].confetti, '#ffffff'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (teams.length === 0) return null;

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.crocodile.title')}
        subtitle={t(`${NS.CROCODILE}.subtitle`)}
        icon={Drama}
        theme="lime"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === CrocodilePhase.Setup && (
            <SetupPhase
              teams={teams}
              playersCount={playerNames.length}
              targetScore={targetScore}
              onTargetScoreChange={setTargetScore}
              onTeamsCountChange={reshuffle}
              onShuffle={() => {
                reshuffle(teams.length);
              }}
              onMovePlayer={(player) => {
                setTeams((prev) => movePlayerToNextTeam(prev, player));
              }}
              onStart={() => {
                setPhase(CrocodilePhase.Start);
              }}
            />
          )}

          {phase === CrocodilePhase.Start && (
            <StartPhase
              teams={teams}
              currentTeamIdx={currentTeamIdx}
              targetScore={targetScore}
              onStart={showWords}
            />
          )}

          {phase === CrocodilePhase.ChooseWord && (
            <ChooseWordPhase options={wordOptions} onChoose={chooseWord} onReplace={replaceWords} />
          )}

          {phase === CrocodilePhase.Playing && chosen !== null && (
            <PlayingPhase
              chosen={chosen}
              timer={timer}
              onGuessed={handleGuessed}
              onGiveUp={handleGiveUp}
            />
          )}

          {phase === CrocodilePhase.RoundEnd && chosen !== null && (
            <RoundEndPhase
              chosen={chosen}
              roundPoints={CROCODILE_LEVELS[chosen.difficulty].points}
              guessed={guessed}
              timedOut={timedOut}
              onContinue={finishRound}
            />
          )}

          {phase === CrocodilePhase.GameOver && (
            <GameOverPhase winner={teams[currentTeamIdx]} teams={teams} onBack={onBack} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
