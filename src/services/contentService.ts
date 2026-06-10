import type {Difficulty} from '../types';
import {GameKey} from '../types/games';

import {storageService} from './storageService';

import {ALIAS_CATEGORIES} from '@/constants/aliasContent';
import {WORDS_BY_DIFFICULTY as CODENAMES_WORDS} from '@/constants/codenamesContent';
import {WORDS_BY_DIFFICULTY as DECRYPTO_WORDS} from '@/constants/decryptoWords.ts';
import {FAKE_ARTIST_DATA_BY_DIFFICULTY} from '@/constants/fakeArtistContent';
import {JUST_ONE_DATA_BY_DIFFICULTY} from '@/constants/justOneContent';
import {TABOO_CLASSIC_CARDS} from '@/constants/tabooContent';
import {TABOO_REVERSE_CARDS} from '@/constants/tabooReverseContent';
import {WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS} from '@/constants/telestrationsContent';
import {DARES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY} from '@/constants/truthOrDareContent';
import {WAVELENGTH_DATA_BY_DIFFICULTY} from '@/constants/wavelengthContent';
import {LOCATIONS_BY_DIFFICULTY} from "@/games/SpyHuntGame/constants.ts";

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
                    if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
                    if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
                    return true;
                });
                const all = [...cats.flatMap((c) => c.words), ...custom];
                return {total: all.length, remaining: all.filter((w) => !used.includes(w)).length};
            }
            case GameKey.JustOne: {
                const all = [
                    ...(JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium),
                    ...custom,
                ];
                return {total: all.length, remaining: all.filter((w) => !used.includes(w)).length};
            }
            case GameKey.Wavelength: {
                const pool = (WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] ||
                    WAVELENGTH_DATA_BY_DIFFICULTY.medium);
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
                return {total: all.length, remaining: all.filter((w) => !used.includes(w)).length};
            }
            case GameKey.Spy: {
                const pool =
                    LOCATIONS_BY_DIFFICULTY[difficulty] ?? LOCATIONS_BY_DIFFICULTY.medium;
                const allNames = [...pool.map((l) => l.name), ...custom];
                return {
                    total: allNames.length,
                    remaining: allNames.filter((n) => !used.includes(n)).length,
                };
            }
            case GameKey.Codenames: {
                const all = [...(CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium), ...custom];
                return {total: all.length, remaining: all.filter((w) => !used.includes(w)).length};
            }
            case GameKey.Decrypto: {
                const all = [...(DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium), ...custom];
                return {total: all.length, remaining: all.filter((w) => !used.includes(w)).length};
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
                return {total: all.length, remaining: all.filter((q) => !used.includes(q)).length};
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
                return {total: 0, remaining: 0};
        }
    },
};
