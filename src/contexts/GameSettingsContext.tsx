import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Difficulty, GameMode } from '../types';
import { GameKey } from '../types/games';
import { storageService } from '../services/storageService';

interface GameSettingsContextType {
  difficulty: Difficulty;
  mode: GameMode;
  rounds: number;
  timerSeconds: number;
  setDifficulty: (d: Difficulty) => void;
  setMode: (m: GameMode) => void;
  setRounds: (r: number) => void;
  setTimerSeconds: (s: number) => void;
  currentGameId: GameKey | null;
  setCurrentGameId: (id: GameKey | null) => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

interface SavedConfig {
  difficulty?: Difficulty;
  mode?: GameMode;
  rounds?: number;
  timerSeconds?: number;
}

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<Difficulty>('medium');
  const [mode, setModeState] = useState<GameMode>('classic');
  const [rounds, setRoundsState] = useState<number>(2);
  const [timerSeconds, setTimerSecondsState] = useState<number>(30);
  const [currentGameId, setCurrentGameId] = useState<GameKey | null>(null);

  // Load config when game changes
  useEffect(() => {
    if (currentGameId) {
      const savedConfig = storageService.getGameConfig<SavedConfig>(currentGameId);
      if (savedConfig) {
        if (savedConfig.difficulty) setDifficultyState(savedConfig.difficulty);
        if (savedConfig.mode) setModeState(savedConfig.mode);
        if (savedConfig.rounds) setRoundsState(savedConfig.rounds);
        if (savedConfig.timerSeconds !== undefined) setTimerSecondsState(savedConfig.timerSeconds);
      } else {
        setDifficultyState('medium');
        setModeState('classic');
        setRoundsState(2);
        setTimerSecondsState(30);
      }
    }
  }, [currentGameId]);

  const setDifficulty = (d: Difficulty) => {
    setDifficultyState(d);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, { difficulty: d, mode, rounds, timerSeconds });
    }
  };

  const setMode = (m: GameMode) => {
    setModeState(m);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, { difficulty, mode: m, rounds, timerSeconds });
    }
  };

  const setRounds = (r: number) => {
    setRoundsState(r);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, { difficulty, mode, rounds: r, timerSeconds });
    }
  };

  const setTimerSeconds = (s: number) => {
    setTimerSecondsState(s);
    if (currentGameId) {
      storageService.saveGameConfig(currentGameId, { difficulty, mode, rounds, timerSeconds: s });
    }
  };

  return (
    <GameSettingsContext.Provider value={{ 
      difficulty, 
      mode, 
      rounds,
      timerSeconds,
      setDifficulty, 
      setMode, 
      setRounds,
      setTimerSeconds,
      currentGameId, 
      setCurrentGameId 
    }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
