import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Skull } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '@/types';
import { storageService } from '@/services/storageService';
import { feedbackService } from '@/services/feedbackService';
import { GAME_DURATION_BY_DIFFICULTY } from '@/constants/spyHuntContent';
import { useGameSettings } from '@/contexts/GameSettingsContext';
import { GameHeader } from '@/components/GameHeader';
import { GAMES_REGISTRY } from '@/registry/GameRegistry';
import { RoleDistribution } from './components/RoleDistribution';
import { initSpyHunt } from '@/utils/gameLogic';
import { SpyHuntPhase } from './types';
import { PlayingPhase } from './phases/PlayingPhase';
import { RevealPhase }  from './phases/RevealPhase';

interface GameProps {
  playerNames: string[];
  onBack: () => void;
}

export const SpyHuntGame: React.FC<GameProps> = ({ playerNames, onBack }) => {
  const { difficulty, mode } = useGameSettings();
  const [players, setPlayers]   = useState<Player[]>([]);
  const [location, setLocation] = useState('');
  const [phase, setPhase]       = useState<SpyHuntPhase>(SpyHuntPhase.Distributing);

  const gameDuration = GAME_DURATION_BY_DIFFICULTY[(difficulty as keyof typeof GAME_DURATION_BY_DIFFICULTY) ?? 'medium'] ?? 480;
  const [timeLeft, setTimeLeft] = useState(gameDuration);

  useEffect(() => {
    const { players: p, location: loc } = initSpyHunt(playerNames, difficulty, mode);
    setPlayers(p);
    setLocation(loc);
  }, [playerNames, difficulty, mode]);

  useEffect(() => {
    if (timeLeft <= 0 || phase !== SpyHuntPhase.Playing) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, phase]);

  useEffect(() => {
    if (phase !== SpyHuntPhase.Reveal) return;
    const settings = storageService.getSettings();
    feedbackService.playSound('success');
    feedbackService.vibrate([50, 30, 50]);
    if (settings.visualEffects) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ef4444', '#ffffff'] });
    }
  }, [phase]);

  const spy = players.find(p => p.isSpy);
  const subtitle = phase === SpyHuntPhase.Distributing
    ? 'Раздача ролей'
    : phase === SpyHuntPhase.Playing
      ? 'Идет поиск...'
      : 'Результаты';

  if (players.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <GameHeader
        title={GAMES_REGISTRY.spy.title}
        subtitle={subtitle}
        icon={Skull}
        theme="red"
        onBack={onBack}
      />

      <AnimatePresence mode="wait">

        {phase === SpyHuntPhase.Distributing && (
          <motion.div
            key="distributing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <RoleDistribution
              players={players}
              location={location}
              onFinish={() => setPhase(SpyHuntPhase.Playing)}
            />
          </motion.div>
        )}

        {phase === SpyHuntPhase.Playing && (
          <PlayingPhase
            players={players}
            timeLeft={timeLeft}
            onReveal={() => setPhase(SpyHuntPhase.Reveal)}
          />
        )}

        {phase === SpyHuntPhase.Reveal && (
          <RevealPhase
            spy={spy}
            location={location}
            onBack={onBack}
          />
        )}

      </AnimatePresence>
    </div>
  );
};
