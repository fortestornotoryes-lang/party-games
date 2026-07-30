import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

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

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<Difficulty>(DEFAULT_GAME_CONFIG.difficulty);
  const [mode, setModeState] = useState<GameMode['id']>(DEFAULT_GAME_CONFIG.mode);
  const [rounds, setRoundsState] = useState<number>(DEFAULT_GAME_CONFIG.rounds);
  const [timerSeconds, setTimerSecondsState] = useState<number>(DEFAULT_GAME_CONFIG.timerSeconds);
  const [countHiddenTraits, setCountHiddenTraitsState] = useState<boolean>(
    DEFAULT_GAME_CONFIG.countHiddenTraits
  );
  const [currentGameId, setCurrentGameIdState] = useState<GameKey | null>(null);

  const setCurrentGameId = async (id: GameKey | null) => {
    setCurrentGameIdState(id);
    if (!id) return;
    const savedConfig = await storageService.getGameConfigAsync<SavedConfig>(id);
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
  };

  const setDifficulty = (d: Difficulty) => {
    setDifficultyState(d);
    if (currentGameId) {
      void storageService.saveGameConfigAsync(currentGameId, {
        difficulty: d,
        mode,
        rounds,
        timerSeconds,
      });
    }
  };

  const setMode = (m: GameMode['id']) => {
    setModeState(m);
    if (currentGameId) {
      void storageService.saveGameConfigAsync(currentGameId, {
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
      void storageService.saveGameConfigAsync(currentGameId, {
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
      void storageService.saveGameConfigAsync(currentGameId, {
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
      void storageService.saveGameConfigAsync(currentGameId, {
        difficulty,
        mode,
        rounds,
        timerSeconds,
        countHiddenTraits: v,
      });
    }
  };

  return (
    <GameSettingsContext.Provider
      value={{
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
        currentGameId,
        setCurrentGameId,
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
