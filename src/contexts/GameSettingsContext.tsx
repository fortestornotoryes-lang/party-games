import type {ReactNode} from 'react';
import React, {createContext, useContext, useState} from 'react';

import {storageService} from '../services/storageService';
import type {Difficulty, GameMode} from '../types';
import {GameKey} from '../types/games';

const GAME_DEFAULT_ROUNDS: Partial<Record<GameKey, number>> = {
    [GameKey.Bunker]: 5,
};

interface GameSettingsContextType {
    difficulty: Difficulty;
    mode: GameMode;
    rounds: number;
    timerSeconds: number;
    countHiddenTraits: boolean;
    setDifficulty: (d: Difficulty) => void;
    setMode: (m: GameMode) => void;
    setRounds: (r: number) => void;
    setTimerSeconds: (s: number) => void;
    setCountHiddenTraits: (v: boolean) => void;
    currentGameId: GameKey | null;
    setCurrentGameId: (id: GameKey | null) => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

interface SavedConfig {
    difficulty?: Difficulty;
    mode?: GameMode;
    rounds?: number;
    timerSeconds?: number;
    countHiddenTraits?: boolean;
}

export const GameSettingsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [difficulty, setDifficultyState] = useState<Difficulty>('medium');
    const [mode, setModeState] = useState<GameMode>('classic');
    const [rounds, setRoundsState] = useState<number>(2);
    const [timerSeconds, setTimerSecondsState] = useState<number>(30);
    const [countHiddenTraits, setCountHiddenTraitsState] = useState<boolean>(true);
    const [currentGameId, setCurrentGameIdState] = useState<GameKey | null>(null);

    const setCurrentGameId = (id: GameKey | null) => {
        setCurrentGameIdState(id);
        if (!id) return;
        const savedConfig = storageService.getGameConfig<SavedConfig>(id);
        if (savedConfig) {
            if (savedConfig.difficulty) setDifficultyState(savedConfig.difficulty);
            if (savedConfig.mode) setModeState(savedConfig.mode);
            if (savedConfig.rounds) setRoundsState(savedConfig.rounds);
            if (savedConfig.timerSeconds !== undefined) setTimerSecondsState(savedConfig.timerSeconds);
            if (savedConfig.countHiddenTraits !== undefined) setCountHiddenTraitsState(savedConfig.countHiddenTraits);
        } else {
            setDifficultyState('medium');
            setModeState('classic');
            setRoundsState(GAME_DEFAULT_ROUNDS[id] ?? 2);
            setTimerSecondsState(30);
            setCountHiddenTraitsState(true);
        }
    };

    const setDifficulty = (d: Difficulty) => {
        setDifficultyState(d);
        if (currentGameId) {
            storageService.saveGameConfig(currentGameId, {difficulty: d, mode, rounds, timerSeconds});
        }
    };

    const setMode = (m: GameMode) => {
        setModeState(m);
        if (currentGameId) {
            storageService.saveGameConfig(currentGameId, {difficulty, mode: m, rounds, timerSeconds});
        }
    };

    const setRounds = (r: number) => {
        setRoundsState(r);
        if (currentGameId) {
            storageService.saveGameConfig(currentGameId, {difficulty, mode, rounds: r, timerSeconds});
        }
    };

    const setTimerSeconds = (s: number) => {
        setTimerSecondsState(s);
        if (currentGameId) {
            storageService.saveGameConfig(currentGameId, {difficulty, mode, rounds, timerSeconds: s, countHiddenTraits});
        }
    };

    const setCountHiddenTraits = (v: boolean) => {
        setCountHiddenTraitsState(v);
        if (currentGameId) {
            storageService.saveGameConfig(currentGameId, {difficulty, mode, rounds, timerSeconds, countHiddenTraits: v});
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
