import { GameKey } from '@/entities/game/types';
import { ALIAS_CATEGORIES } from '@/games/AliasGame/content.ts';
import { WORDS_BY_DIFFICULTY as CODENAMES_WORDS } from '@/games/CodenamesGame/content.ts';
import { WORDS_BY_DIFFICULTY as DECRYPTO_WORDS } from '@/games/DecryptoGame/content.ts';
import { FAKE_ARTIST_DATA_BY_DIFFICULTY } from '@/games/FakeArtistGame/content.ts';
import { JUST_ONE_DATA_BY_DIFFICULTY } from '@/games/JustOneGame/content.ts';
import { LOCATIONS_BY_DIFFICULTY } from '@/games/SpyHuntGame/constants.ts';
import { TABOO_CLASSIC_CARDS } from '@/games/TabooGame/content.ts';
import { TABOO_REVERSE_CARDS } from '@/games/TabooReverseGame/content.ts';
import { WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS } from '@/games/TelestrationsGame/content.ts';
import { DARES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY } from '@/games/TruthOrDareGame/content.ts';
import { WAVELENGTH_DATA_BY_DIFFICULTY } from '@/games/WavelengthGame/content.ts';
import { storageService } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

export const contentService = {
  // TODO: RN — replace with useEffect async load (called synchronously on the UI render path of MainMenu/UniversalGameSettings)
  getWordStats(gameId: GameKey, difficulty: Difficulty): { total: number; remaining: number } {
    const used = storageService.getUsedWords(gameId);
    const custom = [
      ...storageService.getCustomWords(gameId),
      ...storageService.getCustomWordsByKey(`${gameId}_${difficulty}`),
    ];

    switch (gameId) {
      case GameKey.Alias: {
        const cats = ALIAS_CATEGORIES.filter((c) => {
          if (difficulty === DIFFICULTY.EASY)
            return c.difficulty === DIFFICULTY.EASY || c.id === 'verbs';
          if (difficulty === DIFFICULTY.HARD)
            return c.difficulty === DIFFICULTY.HARD || c.id === 'emotions';
          return true;
        });
        const all = [...cats.flatMap((c) => c.words), ...custom];
        return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
      }
      case GameKey.JustOne: {
        const all = [
          ...(JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium),
          ...custom,
        ];
        return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
      }
      case GameKey.Wavelength: {
        const pool =
          WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium;
        const customPairs = custom.map((w) =>
          w.split(' - ').length === 2 ? w.split(' - ') : [w, '...']
        );
        const all = [...pool, ...customPairs];
        return {
          total: all.length,
          remaining: all.filter((pair) => !used.includes(pair.join(' - '))).length,
        };
      }
      case GameKey.FakeArtist: {
        const pool = FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty];
        const allNames = [...pool.map((i) => i.word), ...custom];
        return {
          total: allNames.length,
          remaining: allNames.filter((w) => !used.includes(w)).length,
        };
      }
      case GameKey.Telestrations: {
        const all = [...(TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
      }
      case GameKey.Spy: {
        const pool = LOCATIONS_BY_DIFFICULTY[difficulty] ?? LOCATIONS_BY_DIFFICULTY.medium;
        const allNames = [...pool.map((l) => l.name), ...custom];
        return {
          total: allNames.length,
          remaining: allNames.filter((n) => !used.includes(n)).length,
        };
      }
      case GameKey.Codenames: {
        const all = [...(CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
      }
      case GameKey.Decrypto: {
        const all = [...(DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium), ...custom];
        return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
      }
      case GameKey.TruthOrDare: {
        const truths = [
          ...TRUTHS_BY_DIFFICULTY[difficulty],
          ...storageService.getCustomWordsByKey(`tod_truth_${difficulty}`),
        ];
        const dares = [
          ...DARES_BY_DIFFICULTY[difficulty],
          ...storageService.getCustomWordsByKey(`tod_dare_${difficulty}`),
        ];
        const all = [...truths, ...dares];
        return { total: all.length, remaining: all.filter((q) => !used.includes(q)).length };
      }
      case GameKey.TabooReverse: {
        const cards = TABOO_REVERSE_CARDS.filter((c) => c.difficulty === difficulty);
        const allWords = cards.map((c) => c.word);
        return {
          total: allWords.length,
          remaining: allWords.filter((w) => !used.includes(w)).length,
        };
      }
      case GameKey.Taboo: {
        const cards = TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty);
        const allWords = cards.map((c) => c.word);
        return {
          total: allWords.length,
          remaining: allWords.filter((w) => !used.includes(w)).length,
        };
      }
      default:
        return { total: 0, remaining: 0 };
    }
  },
};
