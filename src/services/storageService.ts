/**
 * Storage Service for managing persistence via localStorage
 */

const STORAGE_KEYS = {
    PLAYERS: 'party_app_players',
    USED_WORDS: 'party_app_used_words',
    CUSTOM_WORDS: 'party_app_custom_words',
    SETTINGS: 'party_app_settings',
    HISTORY: 'party_app_history'
};

type GameDictionary = Record<string, string[]>;

export interface GameSettings {
    spyHuntTimer?: number;
    visualEffects?: boolean;
    vibration?: boolean;
    sounds?: boolean;
    [key: string]: any;
}

export const storageService = {
    // Players
    getPlayers: (): string[] => {
        const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        return data ? JSON.parse(data) : [];
    },
    savePlayers: (players: string[]) => {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    },

    // Used Words
    getUsedWords: (gameId: string): string[] => {
        const data = localStorage.getItem(STORAGE_KEYS.USED_WORDS);
        const used: GameDictionary = data ? JSON.parse(data) : {};
        return used[gameId] || [];
    },
    markWordAsUsed: (gameId: string, word: string) => {
        const data = localStorage.getItem(STORAGE_KEYS.USED_WORDS);
        const used: GameDictionary = data ? JSON.parse(data) : {};
        if (!used[gameId]) used[gameId] = [];
        if (!used[gameId].includes(word)) {
            used[gameId].push(word);
            localStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(used));
        }
    },
    resetUsedWords: (gameId: string) => {
        const data = localStorage.getItem(STORAGE_KEYS.USED_WORDS);
        const used: GameDictionary = data ? JSON.parse(data) : {};
        used[gameId] = [];
        localStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(used));
    },

    // Custom Words
    getCustomWords: (gameId: string): string[] => {
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
        const custom: GameDictionary = data ? JSON.parse(data) : {};
        return custom[gameId] || [];
    },
    addCustomWord: (gameId: string, word: string) => {
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
        const custom: GameDictionary = data ? JSON.parse(data) : {};
        if (!custom[gameId]) custom[gameId] = [];
        if (!custom[gameId].includes(word)) {
            custom[gameId].push(word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(custom));
        }
    },
    removeCustomWord: (gameId: string, word: string) => {
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
        const custom: GameDictionary = data ? JSON.parse(data) : {};
        if (custom[gameId]) {
            custom[gameId] = custom[gameId].filter((w: string) => w !== word);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(custom));
        }
    },

    // Settings
    getSettings: (): GameSettings => {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const defaults: GameSettings = { visualEffects: true, vibration: true, sounds: true };
        return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    },
    saveSettings: (settings: GameSettings) => {
        const current = storageService.getSettings();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
    }
};
