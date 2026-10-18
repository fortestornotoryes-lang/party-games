import { Brain } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import { buildTeams, movePlayerToNextTeam } from './helpers';
import { getAliasWords } from './model/aliasContent';
import { GameOverPhase } from './phases/GameOverPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { RoundEndPhase } from './phases/RoundEndPhase';
import { SetupPhase } from './phases/SetupPhase';
import { StartPhase } from './phases/StartPhase';
import type { Team } from './types';
import { AliasPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import {
  ALIAS_DIFFICULTY_CONFIG,
  MIN_TEAMS,
  TEAM_STYLES,
  WIN_SCORE,
} from '@/games/AliasGame/constants.ts';
import { GameHeader } from '@/shared/components/GameHeader';
import { pickRandom } from '@/shared/helpers/random';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { storageService } from '@/shared/services/storageService';

interface AliasGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const [teams, setTeams] = usePersistedState<Team[]>(GameKey.Alias, 'teams', []);
  const [currentTeamIdx, setCurrentTeamIdx] = usePersistedState(GameKey.Alias, 'currentTeamIdx', 0);
  const [phase, setPhase] = usePersistedState<AliasPhase>(GameKey.Alias, 'phase', AliasPhase.Setup);
  const [currentWord, setCurrentWord] = usePersistedState(GameKey.Alias, 'currentWord', '');
  const [roundScore, setRoundScore] = usePersistedState(GameKey.Alias, 'roundScore', 0);

  const roundTime = ALIAS_DIFFICULTY_CONFIG[difficulty].roundTime;
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useTimer({
    initialTime: roundTime,
    onTimeUp: () => {
      setPhase(AliasPhase.RoundEnd);
    },
  });

  // После перезагрузки страницы в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.Alias,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === AliasPhase.Playing
  );

  useEffect(() => {
    // Команды уже восстановлены из сессии — не перетасовываем заново.
    if (teams.length > 0) return;
    setTeams(buildTeams(playerNames, MIN_TEAMS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

  // Смена числа команд и «Перемешать» — новая случайная раздача; ручные правки сбрасываются.
  const reshuffle = (count: number) => { setTeams(buildTeams(playerNames, count)); };

  const nextWord = () => {
    const available = getAliasWords(difficulty);
    const word = pickRandom(available);
    setCurrentWord(word);
    storageService.markWordAsUsed(GameKey.Alias, word);
  };

  const startRound = () => {
    resetTimer(roundTime);
    setRoundScore(0);
    nextWord();
    setPhase(AliasPhase.Playing);
    startTimer();
  };

  const handleCorrect = () => {
    feedbackService.playSound('success');
    feedbackService.vibrate(VIBRATE.correct);
    setRoundScore((s) => s + 1);
    nextWord();
  };

  const handleSkip = () => {
    feedbackService.playSound('error');
    feedbackService.vibrate(VIBRATE.error);
    setRoundScore((s) => s - 1);
    nextWord();
  };

  const finishRound = () => {
    const updatedTeams = teams.map((t, i) =>
      i === currentTeamIdx
        ? { ...t, score: t.score + roundScore, turnsPlayed: (t.turnsPlayed ?? 0) + 1 }
        : t
    );
    setTeams(updatedTeams);
    if (updatedTeams[currentTeamIdx].score >= WIN_SCORE) {
      setPhase(AliasPhase.GameOver);
    } else {
      setCurrentTeamIdx((i) => (i + 1) % teams.length);
      setPhase(AliasPhase.Start);
    }
  };

  useEffect(() => {
    if (phase !== AliasPhase.GameOver) return;
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    feedbackService.celebrate('win', {
      origin: { y: 0.6 },
      colors: [TEAM_STYLES[teams[currentTeamIdx].color].confetti, '#ffffff'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (teams.length === 0) return null;

  const currentTeam = teams[currentTeamIdx];

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.alias.title')}
        subtitle={t(`${NS.ALIAS}.subtitle`)}
        icon={Brain}
        theme="blue"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === AliasPhase.Setup && (
            <SetupPhase
              teams={teams}
              playersCount={playerNames.length}
              onTeamsCountChange={reshuffle}
              onShuffle={() => { reshuffle(teams.length); }}
              onMovePlayer={(player) => { setTeams((prev) => movePlayerToNextTeam(prev, player)); }}
              onStart={() => { setPhase(AliasPhase.Start); }}
            />
          )}

          {phase === AliasPhase.Start && (
            <StartPhase teams={teams} currentTeamIdx={currentTeamIdx} onStart={startRound} />
          )}

          {phase === AliasPhase.Playing && (
            <PlayingPhase
              currentWord={currentWord}
              roundScore={roundScore}
              timeLeft={timeLeft}
              roundTime={roundTime}
              onCorrect={handleCorrect}
              onSkip={handleSkip}
            />
          )}

          {phase === AliasPhase.RoundEnd && (
            <RoundEndPhase roundScore={roundScore} onContinue={finishRound} />
          )}

          {phase === AliasPhase.GameOver && (
            <GameOverPhase currentTeam={currentTeam} onBack={onBack} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
