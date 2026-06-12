import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import type { GameKey } from '@/entities/game/types';

const isGameKey = (key: string | undefined): key is GameKey =>
  key !== undefined && key in GAMES_REGISTRY;

/**
 * Обёртка маршрутов /game/:gameKey/*.
 * Валидирует gameKey и синхронизирует его с GameSettingsContext
 * (контекст подгружает per-game конфиг сложности/режима).
 */
export function GameLayout() {
  const { gameKey } = useParams();
  const { currentGameId, setCurrentGameId } = useGameSettings();

  useEffect(() => {
    if (isGameKey(gameKey) && currentGameId !== gameKey) {
      setCurrentGameId(gameKey);
    }
  }, [gameKey, currentGameId, setCurrentGameId]);

  if (!isGameKey(gameKey)) return <Navigate to="/" replace />;

  return <Outlet />;
}
