import { Skull } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoleDistribution } from './components/RoleDistribution';
import { initSpyHunt } from './model/initSpyHunt';
import { PlayingPhase } from './phases/PlayingPhase';
import { RevealPhase } from './phases/RevealPhase';
import { SpyHuntPhase } from './types';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import type { Player } from '@/entities/player/types';
import { GAME_DURATION_BY_DIFFICULTY } from '@/games/SpyHuntGame/constants';
import { GameHeader } from '@/shared/components/GameHeader';
import { useGameInit } from '@/shared/hooks/useGameInit';
import { usePersistedState, usePersistedTimer } from '@/shared/hooks/usePersistedState';
import { useTimer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { DIFFICULTY } from '@/shared/types';

interface GameProps {
  playerNames: string[];
  onBack: () => void;
}

export const SpyHuntGame: React.FC<GameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, mode } = useGameConfig();
  const insets = useSafeAreaInsets();
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

  // После перезапуска приложения в фазе Playing — продолжаем отсчёт.
  usePersistedTimer(
    GameKey.Spy,
    'timeLeft',
    { timeLeft, start: startTimer, reset: resetTimer },
    phase === SpyHuntPhase.Playing
  );

  useGameInit(
    players.length > 0,
    () => {
      const { players: p, location: loc } = initSpyHunt(playerNames, difficulty, mode);
      setPlayers(p);
      setLocation(loc);
    },
    [playerNames, difficulty, mode]
  );

  useEffect(() => {
    if (phase !== SpyHuntPhase.Reveal) return;
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    feedbackService.celebrate('success', { colors: ['#ef4444', '#ffffff'] });
  }, [phase]);

  // useCallback — стабильная ссылка для memo-компонента GameBody (PlayingPhase.tsx),
  // иначе 1Hz-тик таймера (timeLeft меняется каждую секунду в SpyHuntGame) заново
  // перерендеривал бы весь список игроков.
  const handleReveal = useCallback(() => {
    setPhase(SpyHuntPhase.Reveal);
  }, [setPhase]);

  const spy = players.find((p) => p.isSpy);
  const subtitle =
    phase === SpyHuntPhase.Distributing
      ? t(`${NS.SPY_HUNT}.subtitleDistributing`)
      : phase === SpyHuntPhase.Playing
        ? t(`${NS.SPY_HUNT}.subtitlePlaying`)
        : t(`${NS.SPY_HUNT}.subtitleReveal`);

  if (players.length === 0) return null;

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.spy.title')}
        subtitle={subtitle}
        icon={Skull}
        theme="red"
        onBack={onBack}
      />

      {/* Скролл — внутри фаз (DistributionFlow и PlayingPhase имеют свои ScrollView) */}
      <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
        <AnimatePresence exitBeforeEnter>
          {phase === SpyHuntPhase.Distributing && (
            <MotiView
              key="distributing"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 200 }}
              className="flex-1"
            >
              <RoleDistribution
                players={players}
                location={location}
                onFinish={() => {
                  setPhase(SpyHuntPhase.Playing);
                  startTimer();
                }}
              />
            </MotiView>
          )}

          {phase === SpyHuntPhase.Playing && (
            <PlayingPhase
              key="playing"
              players={players}
              timeLeft={timeLeft}
              onReveal={handleReveal}
            />
          )}

          {phase === SpyHuntPhase.Reveal && (
            <RevealPhase key="reveal" spy={spy} location={location} onBack={onBack} />
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};
