import { Difficulty } from '../types';
import { GameKey } from '../types/games';
import { ALIAS_CATEGORIES } from '../constants/aliasContent';
import { JUST_ONE_DATA_BY_DIFFICULTY } from '../constants/justOneContent';
import { WAVELENGTH_DATA_BY_DIFFICULTY } from '../constants/wavelengthContent';
import { FAKE_ARTIST_DATA_BY_DIFFICULTY } from '../constants/fakeArtistContent';
import { LOCATIONS_BY_DIFFICULTY, SpyDifficulty } from '../constants/spyHuntContent';
import { WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS } from '../constants/telestrationsContent';
import { WORDS_BY_DIFFICULTY as CODENAMES_WORDS } from '../constants/codenamesContent';
import { WORDS_BY_DIFFICULTY as DECRYPTO_WORDS } from '../constants/decryptoContent';
import { TRUTHS_BY_DIFFICULTY, DARES_BY_DIFFICULTY } from '../constants/truthOrDareContent';
import { TABOO_REVERSE_CARDS } from '../constants/tabooReverseContent';
import { TABOO_CLASSIC_CARDS } from '../constants/tabooContent';
import { storageService } from './storageService';

export const contentService = {
  getAliasWords(difficulty: Difficulty): string[] {
    const targetCategories = ALIAS_CATEGORIES.filter(c => {
      if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
      if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
      return true;
    });

    const staticWords = targetCategories.flatMap(c => c.words);
    const customWords = [
      ...storageService.getCustomWords(GameKey.Alias),
      ...storageService.getCustomWordsByKey(`${GameKey.Alias}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Alias);
    const all = [...staticWords, ...customWords];

    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.Alias);
      available = all;
    }
    return available;
  },

  getCodenamesWords(difficulty: Difficulty): string[] {
    const pool = CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium;
    const custom = [
      ...storageService.getCustomWords(GameKey.Codenames),
      ...storageService.getCustomWordsByKey(`${GameKey.Codenames}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Codenames);
    const all = [...pool, ...custom];

    let available = all.filter(w => !used.includes(w));
    if (available.length < 25) {
      storageService.resetUsedWords(GameKey.Codenames);
      available = all;
    }

    const selected = [...available].sort(() => Math.random() - 0.5).slice(0, 25);
    selected.forEach(w => storageService.markWordAsUsed(GameKey.Codenames, w));
    return selected;
  },

  getDecryptoWords(difficulty: Difficulty, count: number = 4): string[] {
    const pool = DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium;
    const custom = [
      ...storageService.getCustomWords(GameKey.Decrypto),
      ...storageService.getCustomWordsByKey(`${GameKey.Decrypto}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Decrypto);
    const all = [...pool, ...custom];

    let available = all.filter(w => !used.includes(w));
    if (available.length < count) {
      storageService.resetUsedWords(GameKey.Decrypto);
      available = all;
    }

    const selected = [...available].sort(() => Math.random() - 0.5).slice(0, count);
    selected.forEach(w => storageService.markWordAsUsed(GameKey.Decrypto, w));
    return selected;
  },

  getJustOneWord(difficulty: Difficulty): string {
    const pool = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
    const custom = [
      ...storageService.getCustomWords(GameKey.JustOne),
      ...storageService.getCustomWordsByKey(`${GameKey.JustOne}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.JustOne);
    const all = [...pool, ...custom];

    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.JustOne);
      available = all;
    }

    const word = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.JustOne, word);
    return word;
  },

  getWavelengthPair(difficulty: Difficulty): string[] {
    const pool = (WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium) as string[][];
    const custom = [
      ...storageService.getCustomWords(GameKey.Wavelength),
      ...storageService.getCustomWordsByKey(`${GameKey.Wavelength}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Wavelength);

    const all = [
      ...pool,
      ...custom.map(w => w.split(' - ').length === 2 ? w.split(' - ') : [w, '...']),
    ];

    let available = all.filter(pair => !used.includes(pair.join(' - ')));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.Wavelength);
      available = all;
    }

    const pair = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.Wavelength, pair.join(' - '));
    return pair;
  },

  getTelestrationsWord(difficulty: Difficulty): string {
    const pool = TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium;
    const custom = [
      ...storageService.getCustomWords(GameKey.Telestrations),
      ...storageService.getCustomWordsByKey(`${GameKey.Telestrations}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.Telestrations);
    const all = [...pool, ...custom];

    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.Telestrations);
      available = all;
    }

    const word = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.Telestrations, word);
    return word;
  },

  getFakeArtistWord(difficulty: Difficulty): { word: string; category: string } {
    const staticPool = FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty];
    const custom = [
      ...storageService.getCustomWords(GameKey.FakeArtist),
      ...storageService.getCustomWordsByKey(`${GameKey.FakeArtist}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.FakeArtist);

    const pool = [...staticPool, ...custom.map(w => ({ word: w, category: 'Своё' }))];

    let available = pool.filter(item => !used.includes(item.word));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.FakeArtist);
      available = pool;
    }

    const item = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.FakeArtist, item.word);
    return item;
  },

  getSpyHuntLocation(difficulty: string) {
    const defaultRoles = ['Агент', 'Специалист', 'Наблюдатель', 'Сотрудник', 'Гость', 'Персонал', 'Охранник'];
    const diffKey = (difficulty as SpyDifficulty) in LOCATIONS_BY_DIFFICULTY
      ? difficulty as SpyDifficulty
      : 'medium';

    const custom = [
      ...storageService.getCustomWords(GameKey.Spy),
      ...storageService.getCustomWordsByKey(`${GameKey.Spy}_${diffKey}`),
    ];
    const used = storageService.getUsedWords(GameKey.Spy);
    const all = [
      ...LOCATIONS_BY_DIFFICULTY[diffKey],
      ...custom.map(name => ({ name, roles: defaultRoles, difficulty: diffKey })),
    ];

    let available = all.filter(l => !used.includes(l.name));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.Spy);
      available = all;
    }

    const location = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.Spy, location.name);
    return location;
  },

  getTruthOrDareQuestion(type: 'truth' | 'dare', difficulty: Difficulty): string {
    const staticPool = type === 'truth' ? TRUTHS_BY_DIFFICULTY[difficulty] : DARES_BY_DIFFICULTY[difficulty];
    const custom = storageService.getCustomWordsByKey(`tod_${type}_${difficulty}`);
    const used = storageService.getUsedWords(GameKey.TruthOrDare);
    const all = [...staticPool, ...custom];

    let available = all.filter(q => !used.includes(q));
    if (available.length === 0) {
      storageService.resetUsedWords(GameKey.TruthOrDare);
      available = all;
    }

    const question = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed(GameKey.TruthOrDare, question);
    return question;
  },

  getWordStats(gameId: GameKey, difficulty: Difficulty): { total: number; remaining: number } {
    const used = storageService.getUsedWords(gameId);
    const custom = [
      ...storageService.getCustomWords(gameId),
      ...storageService.getCustomWordsByKey(`${gameId}_${difficulty}`),
    ];

    switch (gameId) {
      case GameKey.Alias: {
        const cats = ALIAS_CATEGORIES.filter(c => {
          if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
          if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
          return true;
        });
        const all = [...cats.flatMap(c => c.words), ...custom];
        return { total: all.length, remaining: all.filter(w => !used.includes(w)).length };
      }
      case GameKey.JustOne: {
        const all = [...(JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium), ...custom];
        return { total: all.length, remaining: all.filter(w => !used.includes(w)).length };
      }
      case GameKey.Wavelength: {
        const pool = (WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium) as string[][];
        const customPairs = custom.map(w => w.split(' - ').length === 2 ? w.split(' - ') : [w, '...']);
        const all = [...pool, ...customPairs];
        return { total: all.length, remaining: all.filter(pair => !used.includes(pair.join(' - '))).length };
      }
      case GameKey.FakeArtist: {
        const pool = FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty];
        const allNames = [...pool.map(i => i.word), ...custom];
        return { total: allNames.length, remaining: allNames.filter(w => !used.includes(w)).length };
      }
      case GameKey.Telestrations: {
        const all = [...(TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter(w => !used.includes(w)).length };
      }
      case GameKey.Spy: {
        const pool = LOCATIONS_BY_DIFFICULTY[difficulty as SpyDifficulty] ?? LOCATIONS_BY_DIFFICULTY.medium;
        const allNames = [...pool.map(l => l.name), ...custom];
        return { total: allNames.length, remaining: allNames.filter(n => !used.includes(n)).length };
      }
      case GameKey.Codenames: {
        const all = [...(CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter(w => !used.includes(w)).length };
      }
      case GameKey.Decrypto: {
        const all = [...(DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter(w => !used.includes(w)).length };
      }
      case GameKey.TruthOrDare: {
        const truths = [...TRUTHS_BY_DIFFICULTY[difficulty], ...storageService.getCustomWordsByKey(`tod_truth_${difficulty}`)];
        const dares = [...DARES_BY_DIFFICULTY[difficulty], ...storageService.getCustomWordsByKey(`tod_dare_${difficulty}`)];
        const all = [...truths, ...dares];
        const used = storageService.getUsedWords(GameKey.TruthOrDare);
        return { total: all.length, remaining: all.filter(q => !used.includes(q)).length };
      }
      case GameKey.TabooReverse: {
        const cards = TABOO_REVERSE_CARDS.filter(c => c.difficulty === difficulty);
        const allWords = cards.map(c => c.word);
        return { total: allWords.length, remaining: allWords.filter(w => !used.includes(w)).length };
      }
      case GameKey.Taboo: {
        const cards = TABOO_CLASSIC_CARDS.filter(c => c.difficulty === difficulty);
        const allWords = cards.map(c => c.word);
        return { total: allWords.length, remaining: allWords.filter(w => !used.includes(w)).length };
      }
      default:
        return { total: 0, remaining: 0 };
    }
  },
};
