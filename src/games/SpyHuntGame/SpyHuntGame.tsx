import confetti from 'canvas-confetti';
import { Skull } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';

import { RoleDistribution } from './components/RoleDistribution';
import { initSpyHunt } from './model/initSpyHunt';
import { PlayingPhase } from './phases/PlayingPhase';
import { RevealPhase } from './phases/RevealPhase';
import { SpyHuntPhase } from './types';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import type { Player } from '@/entities/player/types';
import { GAME_DURATION_BY_DIFFICULTY } from '@/games/SpyHuntGame/constants.ts';
import { GameHeader } from '@/shared/components/GameHeader';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY } from '@/shared/types';

interface GameProps {
  playerNames: string[];
  onBack: () => void;
}

export const SpyHuntGame: React.FC<GameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, mode } = useGameSettings();
  const [players, setPlayers] = usePersistedState<Player[]>(GameKey.Spy, 'players', []);
  const [location, setLocation] = usePersistedState(GameKey.Spy, 'location', '');
  const [phase, setPhase] = usePersistedState<SpyHuntPhase>(
    GameKey.Spy,
    'phase',
    SpyHuntPhase.Distributing
  );

  const gameDuration = GAME_DURATION_BY_DIFFICULTY[difficulty ?? DIFFICULTY.MEDIUM] ?? 480;
  const {
    timeLeft,
    start: startTimer,
    reset: resetTimer,
  } = useTimer({ initialTime: gameDuration });

  // После перезагрузки страницы в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.Spy,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === SpyHuntPhase.Playing
  );

  useEffect(() => {
    // Роли уже восстановлены из сессии — не раздаём заново.
    if (players.length > 0) return;
    const { players: p, location: loc } = initSpyHunt(playerNames, difficulty, mode);
    setPlayers(p);
    setLocation(loc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames, difficulty, mode]);

  useEffect(() => {
    if (phase !== SpyHuntPhase.Reveal) return;
    const settings = storageService.getSettings();
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    if (settings.visualEffects) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#ffffff'],
      });
    }
  }, [phase]);

  const spy = players.find((p) => p.isSpy);
  const subtitle =
    phase === SpyHuntPhase.Distributing
      ? t(`${NS.SPY_HUNT}.subtitleDistributing`)
      : phase === SpyHuntPhase.Playing
        ? t(`${NS.SPY_HUNT}.subtitlePlaying`)
        : t(`${NS.SPY_HUNT}.subtitleReveal`);

  if (players.length === 0) return null;

  return (
    <div className="flex min-h-screen flex-col pb-10">
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
            className="flex flex-1 flex-col"
          >
            <RoleDistribution
              players={players}
              location={location}
              onFinish={() => {
                setPhase(SpyHuntPhase.Playing);
                startTimer();
              }}
            />
          </motion.div>
        )}

        {phase === SpyHuntPhase.Playing && (
          <PlayingPhase
            players={players}
            timeLeft={timeLeft}
            onReveal={() => {
              setPhase(SpyHuntPhase.Reveal);
            }}
          />
        )}

        {phase === SpyHuntPhase.Reveal && (
          <RevealPhase spy={spy} location={location} onBack={onBack} />
        )}
      </AnimatePresence>
    </div>
  );
};
