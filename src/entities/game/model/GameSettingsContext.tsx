import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { CLASSIC_MODE_ID, GameKey, type GameMode } from '@/entities/game/types';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

const GAME_DEFAULT_ROUNDS: Partial<Record<GameKey, number>> = {
  [GameKey.Bunker]: 5,
};

interface GameSettingsContextType {
  difficulty: Difficulty;
  mode: GameMode['id'];
  rounds: number;
  timerSeconds: number;
  countHiddenTraits: boolean;
  setDifficulty: (d: Difficulty) => void;
  setMode: (m: GameMode['id']) => void;
  setRounds: (r: number) => void;
  setTimerSeconds: (s: number) => void;
  setCountHiddenTraits: (v: boolean) => void;
  currentGameId: GameKey | null;
  setCurrentGameId: (id: GameKey | null) => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

interface SavedConfig {
  difficulty?: Difficulty;
  mode?: GameMode['id'];
  rounds?: number;
  timerSeconds?: number;
  countHiddenTraits?: boolean;
}

const DEFAULT_GAME_CONFIG: Required<SavedConfig> = {
  difficulty: DIFFICULTY.MEDIUM,
  mode: CLASSIC_MODE_ID,
  rounds: 2,
  timerSeconds: 30,
  countHiddenTraits: true,
};

type GameConfig = Required<SavedConfig>;

const defaultConfigFor = (id: GameKey): GameConfig => ({
  ...DEFAULT_GAME_CONFIG,
  rounds: GAME_DEFAULT_ROUNDS[id] ?? DEFAULT_GAME_CONFIG.rounds,
});

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [currentGameId, setCurrentGameIdState] = useState<GameKey | null>(null);
  // Последние значения для стабильных сеттеров (useCallback без зависимостей от state)
  const configRef = useRef(config);
  const gameIdRef = useRef(currentGameId);

  /** Поменять часть настроек и сохранить конфиг текущей игры целиком */
  const update = useCallback((patch: Partial<GameConfig>) => {
    const next = { ...configRef.current, ...patch };
    configRef.current = next;
    setConfig(next);
    if (gameIdRef.current) void storageService.saveGameConfigAsync(gameIdRef.current, next);
  }, []);

  const setCurrentGameId = useCallback((id: GameKey | null) => {
    gameIdRef.current = id;
    setCurrentGameIdState(id);
    if (!id) return;
    void storageService.getGameConfigAsync<SavedConfig>(id).then((saved) => {
      // Ответ пришёл, когда уже выбрана другая игра, — не перетираем её настройки
      if (gameIdRef.current !== id) return;
      // Недостающие в сохранённом конфиге поля — дефолты этой игры, а не значения прошлой
      const next = { ...defaultConfigFor(id), ...saved };
      configRef.current = next;
      setConfig(next);
    });
  }, []);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      update({ difficulty });
    },
    [update]
  );
  const setMode = useCallback(
    (mode: GameMode['id']) => {
      update({ mode });
    },
    [update]
  );
  const setRounds = useCallback(
    (rounds: number) => {
      update({ rounds });
    },
    [update]
  );
  const setTimerSeconds = useCallback(
    (timerSeconds: number) => {
      update({ timerSeconds });
    },
    [update]
  );
  const setCountHiddenTraits = useCallback(
    (countHiddenTraits: boolean) => {
      update({ countHiddenTraits });
    },
    [update]
  );

  // Стабильное значение: потребители перерисовываются только при реальной смене настроек
  const value = useMemo<GameSettingsContextType>(
    () => ({
      ...config,
      setDifficulty,
      setMode,
      setRounds,
      setTimerSeconds,
      setCountHiddenTraits,
      currentGameId,
      setCurrentGameId,
    }),
    [
      config,
      currentGameId,
      setDifficulty,
      setMode,
      setRounds,
      setTimerSeconds,
      setCountHiddenTraits,
      setCurrentGameId,
    ]
  );

  return <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
