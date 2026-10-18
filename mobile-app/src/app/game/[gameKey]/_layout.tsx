import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useCurrentGame } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import type { GameKey } from '@/entities/game/types';

const isGameKey = (key: string | undefined): key is GameKey =>
  key !== undefined && key in GAMES_REGISTRY;

/**
 * Обёртка маршрутов /game/[gameKey]/*.
 * Валидирует gameKey и синхронизирует его с GameSettingsContext
 * (контекст подгружает per-game конфиг сложности/режима) — аналог веб-GameLayout.
 */
export default function GameLayout() {
  const { gameKey } = useLocalSearchParams<{ gameKey: string }>();
  const { currentGameId, setCurrentGameId } = useCurrentGame();

  useEffect(() => {
    if (isGameKey(gameKey) && currentGameId !== gameKey) {
      setCurrentGameId(gameKey);
    }
  }, [gameKey, currentGameId, setCurrentGameId]);

  if (!isGameKey(gameKey)) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0b0915' } }} />;
}
