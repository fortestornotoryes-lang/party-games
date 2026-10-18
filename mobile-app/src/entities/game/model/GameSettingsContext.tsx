import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { CLASSIC_MODE_ID, GameKey, type GameMode } from '@/entities/game/types';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

const GAME_DEFAULT_ROUNDS: Partial<Record<GameKey, number>> = {
  [GameKey.Bunker]: 5,
};

/** Навигационное состояние: какая игра сейчас выбрана. Меняется редко (переход между экранами). */
interface CurrentGameContextType {
  currentGameId: GameKey | null;
  setCurrentGameId: (id: GameKey | null) => void;
}

/** Конфиг сложности/режима текущей игры. Меняется часто (каждый тап по настройке в Setup). */
interface GameConfigContextType {
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
}

const CurrentGameContext = createContext<CurrentGameContextType | undefined>(undefined);
const GameConfigContext = createContext<GameConfigContextType | undefined>(undefined);

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

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<Difficulty>(DEFAULT_GAME_CONFIG.difficulty);
  const [mode, setModeState] = useState<GameMode['id']>(DEFAULT_GAME_CONFIG.mode);
  const [rounds, setRoundsState] = useState<number>(DEFAULT_GAME_CONFIG.rounds);
  const [timerSeconds, setTimerSecondsState] = useState<number>(DEFAULT_GAME_CONFIG.timerSeconds);
  const [countHiddenTraits, setCountHiddenTraitsState] = useState<boolean>(
    DEFAULT_GAME_CONFIG.countHiddenTraits
  );
  const [currentGameId, setCurrentGameIdState] = useState<GameKey | null>(null);

  // Стабильна (нет внешних зависимостей, кроме сеттеров useState) — не пересоздаётся на каждый рендер,
  // поэтому смена конфига не заставляет CurrentGameContext.Provider ре-рендерить своих потребителей.
  const setCurrentGameId = useCallback((id: GameKey | null) => {
    setCurrentGameIdState(id);
    if (!id) return;
    const savedConfig = storageService.getGameConfig<SavedConfig>(id);
    if (savedConfig) {
      if (savedConfig.difficulty) setDifficultyState(savedConfig.difficulty);
      if (savedConfig.mode) setModeState(savedConfig.mode);
      if (savedConfig.rounds) setRoundsState(savedConfig.rounds);
      if (savedConfig.timerSeconds !== undefined) setTimerSecondsState(savedConfig.timerSeconds);
      if (savedConfig.countHiddenTraits !== undefined)
        setCountHiddenTraitsState(savedConfig.countHiddenTraits);
    } else {
      setDifficultyState(DEFAULT_GAME_CONFIG.difficulty);
      setModeState(DEFAULT_GAME_CONFIG.mode);
      setRoundsState(GAME_DEFAULT_ROUNDS[id] ?? DEFAULT_GAME_CONFIG.rounds);
      setTimerSecondsState(DEFAULT_GAME_CONFIG.timerSeconds);
      setCountHiddenTraitsState(DEFAULT_GAME_CONFIG.countHiddenTraits);
    }
  }, []);

  const setDifficulty = (d: Difficulty) => {
    setDifficultyState(d);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, { difficulty: d, mode, rounds, timerSeconds });
    }
  };

  const setMode = (m: GameMode['id']) => {
    setModeState(m);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, {
        difficulty,
        mode: m,
        rounds,
        timerSeconds,
      });
    }
  };

  const setRounds = (r: number) => {
    setRoundsState(r);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, {
        difficulty,
        mode,
        rounds: r,
        timerSeconds,
      });
    }
  };

  const setTimerSeconds = (s: number) => {
    setTimerSecondsState(s);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, {
        difficulty,
        mode,
        rounds,
        timerSeconds: s,
        countHiddenTraits,
      });
    }
  };

  const setCountHiddenTraits = (v: boolean) => {
    setCountHiddenTraitsState(v);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, {
        difficulty,
        mode,
        rounds,
        timerSeconds,
        countHiddenTraits: v,
      });
    }
  };

  const currentGameValue = useMemo<CurrentGameContextType>(
    () => ({ currentGameId, setCurrentGameId }),
    [currentGameId, setCurrentGameId]
  );

  const configValue = useMemo<GameConfigContextType>(
    () => ({
      difficulty,
      mode,
      rounds,
      timerSeconds,
      countHiddenTraits,
      setDifficulty,
      setMode,
      setRounds,
      setTimerSeconds,
      setCountHiddenTraits,
    }),
    // Сеттеры замыкают текущие difficulty/mode/rounds/timerSeconds/countHiddenTraits/currentGameId
    // (чтобы сохранить полный конфиг) — пересоздаются вместе с ними, это ожидаемо.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [difficulty, mode, rounds, timerSeconds, countHiddenTraits, currentGameId]
  );

  return (
    <CurrentGameContext.Provider value={currentGameValue}>
      <GameConfigContext.Provider value={configValue}>{children}</GameConfigContext.Provider>
    </CurrentGameContext.Provider>
  );
};

/** Только текущая выбранная игра — для навигационного кода (роуты, меню). Не ре-рендерится на смену конфига. */
// eslint-disable-next-line react-refresh/only-export-components
export const useCurrentGame = () => {
  const context = useContext(CurrentGameContext);
  if (context === undefined) {
    throw new Error('useCurrentGame must be used within a GameSettingsProvider');
  }
  return context;
};

/** Конфиг сложности/режима текущей игры — для экрана настроек и самих игр. Не ре-рендерится на смену навигации. */
// eslint-disable-next-line react-refresh/only-export-components
export const useGameConfig = () => {
  const context = useContext(GameConfigContext);
  if (context === undefined) {
    throw new Error('useGameConfig must be used within a GameSettingsProvider');
  }
  return context;
};
