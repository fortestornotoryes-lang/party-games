import type {GameKey} from '../types/games';

const STORAGE_KEYS = {
    PLAYERS: 'party_app_players',
    USED_WORDS: 'party_app_used_words',
    CUSTOM_WORDS: 'party_app_custom_words',
    CUSTOM_KEYED: 'party_app_custom_keyed',
    SETTINGS: 'party_app_settings',
    HISTORY: 'party_app_history',
};

type GameDictionary = Record<string, string[]>;

export interface GameSettings {
    spyHuntTimer?: number;
    visualEffects?: boolean;
    vibration?: boolean;
    sounds?: boolean;
    language?: string;

    [key: string]: string | number | boolean | undefined;
}

/** Безопасный JSON.parse — возвращает fallback при битых данных вместо краша. */
function safeParseJson<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export const storageService = {
    // Players
    getPlayers: (): string[] => {
        return safeParseJson<string[]>(localStorage.getItem(STORAGE_KEYS.PLAYERS), []);
    },
    getPlayersAsync: (): Promise<string[]> => {
        return Promise.resolve(storageService.getPlayers());
    },
    savePlayers: (players: string[]) => {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    },
    savePlayersAsync: async (players: string[]): Promise<void> => {
        await Promise.resolve();
        storageService.savePlayers(players);
    },

    // Used Words
    getUsedWords: (gameId: GameKey): string[] => {
        const used = safeParseJson<GameDictionary>(localStorage.getItem(STORAGE_KEYS.USED_WORDS), {});
        return used[gameId] || [];
    },
    getUsedWordsAsync: (gameId: GameKey): Promise<string[]> => {
        return Promise.resolve(storageService.getUsedWords(gameId));
    },
    markWordAsUsed: (gameId: GameKey, word: string) => {
        const used = safeParseJson<GameDictionary>(localStorage.getItem(STORAGE_KEYS.USED_WORDS), {});
        if (!used[gameId]) used[gameId] = [];
        if (!used[gameId].includes(word)) {
            used[gameId].push(word);
            localStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(used));
        }
    },
    markWordAsUsedAsync: async (gameId: GameKey, word: string): Promise<void> => {
        await Promise.resolve();
        storageService.markWordAsUsed(gameId, word);
    },
    resetUsedWords: (gameId: GameKey) => {
        const used = safeParseJson<GameDictionary>(localStorage.getItem(STORAGE_KEYS.USED_WORDS), {});
        used[gameId] = [];
        localStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(used));
    },
    resetUsedWordsAsync: async (gameId: GameKey): Promise<void> => {
        await Promise.resolve();
        storageService.resetUsedWords(gameId);
    },

    // Custom Words
    getCustomWords: (gameId: GameKey): string[] => {
        const custom = safeParseJson<GameDictionary>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS),
            {}
        );
        return custom[gameId] || [];
    },
    getCustomWordsAsync: (gameId: GameKey): Promise<string[]> => {
        return Promise.resolve(storageService.getCustomWords(gameId));
    },
    addCustomWord: (gameId: GameKey, word: string) => {
        const custom = safeParseJson<GameDictionary>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS),
            {}
        );
        if (!custom[gameId]) custom[gameId] = [];
        if (!custom[gameId].includes(word)) {
            custom[gameId].push(word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(custom));
        }
    },
    addCustomWordAsync: async (gameId: GameKey, word: string): Promise<void> => {
        await Promise.resolve();
        storageService.addCustomWord(gameId, word);
    },
    removeCustomWord: (gameId: GameKey, word: string) => {
        const custom = safeParseJson<GameDictionary>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS),
            {}
        );
        if (custom[gameId]) {
            custom[gameId] = custom[gameId].filter((w: string) => w !== word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(custom));
        }
    },

    removeCustomWordAsync: async (gameId: GameKey, word: string): Promise<void> => {
        await Promise.resolve();
        storageService.removeCustomWord(gameId, word);
    },

    // Keyed custom words (difficulty-specific, e.g. TruthOrDare: "tod_truth_easy")
    getCustomWordsByKey: (key: string): string[] => {
        const store = safeParseJson<Record<string, string[]>>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_KEYED),
            {}
        );
        return store[key] || [];
    },
    getCustomWordsByKeyAsync: (key: string): Promise<string[]> => {
        return Promise.resolve(storageService.getCustomWordsByKey(key));
    },
    addCustomWordByKey: (key: string, word: string) => {
        const store = safeParseJson<Record<string, string[]>>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_KEYED),
            {}
        );
        if (!store[key]) store[key] = [];
        if (!store[key].includes(word)) {
            store[key].push(word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_KEYED, JSON.stringify(store));
        }
    },
    addCustomWordByKeyAsync: async (key: string, word: string): Promise<void> => {
        await Promise.resolve();
        storageService.addCustomWordByKey(key, word);
    },
    removeCustomWordByKey: (key: string, word: string) => {
        const store = safeParseJson<Record<string, string[]>>(
            localStorage.getItem(STORAGE_KEYS.CUSTOM_KEYED),
            {}
        );
        if (store[key]) {
            store[key] = store[key].filter((w) => w !== word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_KEYED, JSON.stringify(store));
        }
    },

    removeCustomWordByKeyAsync: async (key: string, word: string): Promise<void> => {
        await Promise.resolve();
        storageService.removeCustomWordByKey(key, word);
    },

    // Settings
    getSettings: (): GameSettings => {
        const defaults: GameSettings = {visualEffects: true, vibration: true, sounds: true};
        const saved = safeParseJson<Partial<GameSettings>>(
            localStorage.getItem(STORAGE_KEYS.SETTINGS),
            {}
        );
        return {...defaults, ...saved};
    },
    getSettingsAsync: (): Promise<GameSettings> => {
        return Promise.resolve(storageService.getSettings());
    },
    saveSettings: (settings: Partial<GameSettings>) => {
        const current = storageService.getSettings();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({...current, ...settings}));
    },
    saveSettingsAsync: async (settings: Partial<GameSettings>): Promise<void> => {
        await Promise.resolve();
        storageService.saveSettings(settings);
    },

    // Game Configs (Difficulty, Modes, etc.)
    getGameConfig: <T>(gameId: string): T | null => {
        return safeParseJson<T | null>(
            localStorage.getItem(`${STORAGE_KEYS.SETTINGS}_${gameId}`),
            null
        );
    },
    getGameConfigAsync: <T>(gameId: string): Promise<T | null> => {
        return Promise.resolve(storageService.getGameConfig<T>(gameId));
    },
    saveGameConfig: <T>(gameId: string, config: T) => {
        localStorage.setItem(`${STORAGE_KEYS.SETTINGS}_${gameId}`, JSON.stringify(config));
    },
    saveGameConfigAsync: async <T>(gameId: string, config: T): Promise<void> => {
        await Promise.resolve();
        storageService.saveGameConfig(gameId, config);
    },
};
