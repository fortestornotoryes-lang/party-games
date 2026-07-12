import { Brain } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import { getAliasWords } from './model/aliasContent';
import { GameOverPhase } from './phases/GameOverPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { RoundEndPhase } from './phases/RoundEndPhase';
import { StartPhase } from './phases/StartPhase';
import type { Team } from './types';
import { AliasPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { ALIAS_DIFFICULTY_CONFIG, WIN_SCORE } from '@/games/AliasGame/constants.ts';
import { GameHeader } from '@/shared/components/GameHeader';
import { pickRandom, shuffle } from '@/shared/helpers/random';
import { splitInHalf } from '@/shared/helpers/teams';
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

// Отображаемые имена команд резолвятся по color через t(alias.teamRed/teamBlue)
const TEAM_COLORS = ['red', 'blue'] as const;

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty } = useGameSettings();
  const [teams, setTeams] = usePersistedState<Team[]>(GameKey.Alias, 'teams', []);
  const [currentTeamIdx, setCurrentTeamIdx] = usePersistedState(GameKey.Alias, 'currentTeamIdx', 0);
  const [phase, setPhase] = usePersistedState<AliasPhase>(GameKey.Alias, 'phase', AliasPhase.Start);
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
    const [teamA, teamB] = splitInHalf(shuffle(playerNames));
    setTeams([
      { color: TEAM_COLORS[0], players: teamA, score: 0 },
      { color: TEAM_COLORS[1], players: teamB, score: 0 },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

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
      i === currentTeamIdx ? { ...t, score: t.score + roundScore } : t
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
      colors: currentTeamIdx === 0 ? ['#FF2E4D', '#ffffff'] : ['#3F7BFF', '#ffffff'],
    });
  }, [phase, currentTeamIdx]);

  if (teams.length === 0) return null;

  const currentTeam = teams[currentTeamIdx];

  return (
    <div className="flex h-screen flex-col">
      <GameHeader
        title={t('registry.games.alias.title')}
        subtitle={t(`${NS.ALIAS}.subtitle`)}
        icon={Brain}
        theme="blue"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
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
