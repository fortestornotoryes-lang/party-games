const STORAGE_KEYS = {
  PLAYERS: 'party_app_players',
  USED_WORDS: 'party_app_used_words',
  CUSTOM_WORDS: 'party_app_custom_words',
  CUSTOM_KEYED: 'party_app_custom_keyed',
  SETTINGS: 'party_app_settings',
  HISTORY: 'party_app_history',
};

// Partial: данные из localStorage — ключа игры может не быть
type GameDictionary = Partial<Record<string, string[]>>;

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

/**
 * Кэш распарсенных значений по ключу localStorage. Словарь used-слов растёт до тысяч строк,
 * а читается на каждом ходе (свайп в Alias, звук клика читает настройки) — без кэша каждый
 * вызов заново парсил весь JSON прямо в момент старта анимации.
 * Пишем только через writeJson (он обновляет кэш); изменения из других вкладок — событие storage.
 */
const parsedCache = new Map<string, unknown>();

function readJson<T>(key: string, fallback: T): T {
  if (parsedCache.has(key)) return parsedCache.get(key) as T;
  const value = safeParseJson<T>(localStorage.getItem(key), fallback);
  parsedCache.set(key, value);
  return value;
}

function writeJson(key: string, value: unknown) {
  parsedCache.set(key, value);
  localStorage.setItem(key, JSON.stringify(value));
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === null) parsedCache.clear();
    else parsedCache.delete(e.key);
  });
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
  getUsedWords: (gameId: string): string[] => {
    const used = readJson<GameDictionary>(STORAGE_KEYS.USED_WORDS, {});
    // Копия: массив живёт в кэше и дописывается markWordAsUsed
    return [...(used[gameId] ?? [])];
  },
  getUsedWordsAsync: (gameId: string): Promise<string[]> => {
    return Promise.resolve(storageService.getUsedWords(gameId));
  },
  markWordAsUsed: (gameId: string, word: string) => {
    const used = readJson<GameDictionary>(STORAGE_KEYS.USED_WORDS, {});
    const list = (used[gameId] ??= []);
    if (!list.includes(word)) {
      list.push(word);
      writeJson(STORAGE_KEYS.USED_WORDS, used);
    }
  },
  markWordAsUsedAsync: async (gameId: string, word: string): Promise<void> => {
    await Promise.resolve();
    storageService.markWordAsUsed(gameId, word);
  },
  resetUsedWords: (gameId: string) => {
    const used = readJson<GameDictionary>(STORAGE_KEYS.USED_WORDS, {});
    used[gameId] = [];
    writeJson(STORAGE_KEYS.USED_WORDS, used);
  },
  resetUsedWordsAsync: async (gameId: string): Promise<void> => {
    await Promise.resolve();
    storageService.resetUsedWords(gameId);
  },

  // Custom Words
  getCustomWords: (gameId: string): string[] => {
    const custom = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_WORDS, {});
    return [...(custom[gameId] ?? [])];
  },
  getCustomWordsAsync: (gameId: string): Promise<string[]> => {
    return Promise.resolve(storageService.getCustomWords(gameId));
  },
  addCustomWord: (gameId: string, word: string) => {
    const custom = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_WORDS, {});
    const list = (custom[gameId] ??= []);
    if (!list.includes(word)) {
      list.push(word);
      writeJson(STORAGE_KEYS.CUSTOM_WORDS, custom);
    }
  },
  addCustomWordAsync: async (gameId: string, word: string): Promise<void> => {
    await Promise.resolve();
    storageService.addCustomWord(gameId, word);
  },
  removeCustomWord: (gameId: string, word: string) => {
    const custom = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_WORDS, {});
    const list = custom[gameId];
    if (list) {
      custom[gameId] = list.filter((w) => w !== word);
      writeJson(STORAGE_KEYS.CUSTOM_WORDS, custom);
    }
  },

  removeCustomWordAsync: async (gameId: string, word: string): Promise<void> => {
    await Promise.resolve();
    storageService.removeCustomWord(gameId, word);
  },

  // Полный список кастомных слов игры: общие + привязанные к сложности
  getAllCustomWords: (gameId: string, difficulty: string): string[] => {
    return [
      ...storageService.getCustomWords(gameId),
      ...storageService.getCustomWordsByKey(`${gameId}_${difficulty}`),
    ];
  },
  getAllCustomWordsAsync: (gameId: string, difficulty: string): Promise<string[]> => {
    return Promise.resolve(storageService.getAllCustomWords(gameId, difficulty));
  },

  // Keyed custom words (difficulty-specific, e.g. TruthOrDare: "tod_truth_easy")
  getCustomWordsByKey: (key: string): string[] => {
    const store = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_KEYED, {});
    return [...(store[key] ?? [])];
  },
  getCustomWordsByKeyAsync: (key: string): Promise<string[]> => {
    return Promise.resolve(storageService.getCustomWordsByKey(key));
  },
  addCustomWordByKey: (key: string, word: string) => {
    const store = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_KEYED, {});
    const list = (store[key] ??= []);
    if (!list.includes(word)) {
      list.push(word);
      writeJson(STORAGE_KEYS.CUSTOM_KEYED, store);
    }
  },
  addCustomWordByKeyAsync: async (key: string, word: string): Promise<void> => {
    await Promise.resolve();
    storageService.addCustomWordByKey(key, word);
  },
  removeCustomWordByKey: (key: string, word: string) => {
    const store = readJson<GameDictionary>(STORAGE_KEYS.CUSTOM_KEYED, {});
    const list = store[key];
    if (list) {
      store[key] = list.filter((w) => w !== word);
      writeJson(STORAGE_KEYS.CUSTOM_KEYED, store);
    }
  },

  removeCustomWordByKeyAsync: async (key: string, word: string): Promise<void> => {
    await Promise.resolve();
    storageService.removeCustomWordByKey(key, word);
  },

  // Settings
  getSettings: (): GameSettings => {
    const defaults: GameSettings = { visualEffects: true, vibration: true, sounds: true };
    const saved = readJson<Partial<GameSettings>>(STORAGE_KEYS.SETTINGS, {});
    return { ...defaults, ...saved };
  },
  getSettingsAsync: (): Promise<GameSettings> => {
    return Promise.resolve(storageService.getSettings());
  },
  saveSettings: (settings: Partial<GameSettings>) => {
    const current = storageService.getSettings();
    writeJson(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
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
