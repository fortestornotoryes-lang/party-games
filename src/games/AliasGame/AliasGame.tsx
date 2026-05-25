import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '@/services/storageService';
import { feedbackService } from '@/services/feedbackService';
import { contentService } from '@/services/contentService';
import { ALIAS_DIFFICULTY_CONFIG, WIN_SCORE } from '@/constants/aliasContent';
import { GameKey } from '@/types/games';
import { GameHeader } from '@/components/GameHeader';
import { useTimer } from '@/hooks/useTimer';
import { GAMES_REGISTRY } from '@/registry/GameRegistry';
import { useGameSettings } from '@/contexts/GameSettingsContext';
import { AliasPhase, Team } from './types';
import { StartPhase }   from './phases/StartPhase';
import { PlayingPhase } from './phases/PlayingPhase';
import { RoundEndPhase } from './phases/RoundEndPhase';
import { GameOverPhase } from './phases/GameOverPhase';

interface AliasGameProps { playerNames: string[]; onBack: () => void; }

const TEAMS_CONFIG = [
  { name: 'Красные', color: 'red' as const },
  { name: 'Синие',   color: 'blue' as const },
] as const;

export const AliasGame: React.FC<AliasGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [phase, setPhase] = useState<AliasPhase>(AliasPhase.Start);
  const [currentWord, setCurrentWord] = useState('');
  const [roundScore, setRoundScore] = useState(0);

  const roundTime = ALIAS_DIFFICULTY_CONFIG[difficulty].roundTime;
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer({
    initialTime: roundTime,
    onTimeUp: () => setPhase(AliasPhase.RoundEnd),
  });

  useEffect(() => {
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    setTeams([
      { name: TEAMS_CONFIG[0].name, color: TEAMS_CONFIG[0].color, players: shuffled.slice(0, mid), score: 0 },
      { name: TEAMS_CONFIG[1].name, color: TEAMS_CONFIG[1].color, players: shuffled.slice(mid), score: 0 },
    ]);
  }, [playerNames]);

  const nextWord = () => {
    const available = contentService.getAliasWords(difficulty);
    const word = available[Math.floor(Math.random() * available.length)];
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
    feedbackService.vibrate(20);
    setRoundScore(s => s + 1);
    nextWord();
  };

  const handleSkip = () => {
    feedbackService.playSound('error');
    feedbackService.vibrate(50);
    setRoundScore(s => s - 1);
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
      setCurrentTeamIdx(i => (i + 1) % teams.length);
      setPhase(AliasPhase.Start);
    }
  };

  useEffect(() => {
    if (phase !== AliasPhase.GameOver) return;
    const settings = storageService.getSettings();
    feedbackService.playSound('success');
    feedbackService.vibrate([100, 50, 100]);
    if (settings.visualEffects) {
      confetti({
        particleCount: 200, spread: 80, origin: { y: 0.6 },
        colors: currentTeamIdx === 0 ? ['#FF2E4D', '#ffffff'] : ['#3F7BFF', '#ffffff'],
      });
    }
  }, [phase, currentTeamIdx]);

  if (teams.length === 0) return null;

  const currentTeam = teams[currentTeamIdx];

  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY.alias.title}
        subtitle="Объясни быстрее"
        icon={Brain}
        theme="blue"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">

          {phase === AliasPhase.Start && (
            <StartPhase
              teams={teams}
              currentTeamIdx={currentTeamIdx}
              onStart={startRound}
            />
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
            <RoundEndPhase
              roundScore={roundScore}
              onContinue={finishRound}
            />
          )}

          {phase === AliasPhase.GameOver && (
            <GameOverPhase
              currentTeam={currentTeam}
              onBack={onBack}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
