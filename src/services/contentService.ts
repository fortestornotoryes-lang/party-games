import { Difficulty } from '../types';
import { ALIAS_CATEGORIES } from '../constants/aliasContent';
import { JUST_ONE_DATA_BY_DIFFICULTY } from '../constants/justOneContent';
import { WAVELENGTH_DATA_BY_DIFFICULTY } from '../constants/wavelengthContent';
import { FAKE_ARTIST_DATA_BY_DIFFICULTY } from '../constants/fakeArtistContent';
import { LOCATIONS } from '../constants/spyHuntContent';
import { WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS } from '../constants/telestrationsContent';
import { WORDS_BY_DIFFICULTY as CODENAMES_WORDS } from '../constants/codenamesContent';
import { WORDS_BY_DIFFICULTY as DECRYPTO_WORDS } from '../constants/decryptoContent';
import { storageService } from './storageService';

export const contentService = {
  getAliasWords(difficulty: Difficulty): string[] {
    const targetCategories = ALIAS_CATEGORIES.filter(c => {
      if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
      if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
      return true;
    });
    
    const staticWords = targetCategories.flatMap(c => c.words);
    const customWords = storageService.getCustomWords('alias');
    const used = storageService.getUsedWords('alias');
    const all = [...staticWords, ...customWords];
    
    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords('alias');
      available = all;
    }
    return available;
  },

  getCodenamesWords(difficulty: Difficulty): string[] {
    const pool = CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium;
    const custom = storageService.getCustomWords('codenames');
    const all = [...pool, ...custom];
    
    // Shuffle and pick 25
    return [...all].sort(() => Math.random() - 0.5).slice(0, 25);
  },

  getDecryptoWords(difficulty: Difficulty, count: number = 4): string[] {
    const pool = DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium;
    const custom = storageService.getCustomWords('decrypto');
    const all = [...pool, ...custom];
    
    return [...all].sort(() => Math.random() - 0.5).slice(0, count);
  },

  getJustOneWord(difficulty: Difficulty): string {
    const difficultyWords = JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium;
    const custom = storageService.getCustomWords('just_one');
    const used = storageService.getUsedWords('just_one');
    const all = [...difficultyWords, ...custom];
    
    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords('just_one');
      available = all;
    }
    
    const word = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed('just_one', word);
    return word;
  },

  getWavelengthPair(difficulty: Difficulty): string[] {
    const pool = WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium;
    const custom = storageService.getCustomWords('wavelength');
    const used = storageService.getUsedWords('wavelength');
    
    const all = [
      ...pool,
      ...custom.map(w => w.split(' - ').length === 2 ? w.split(' - ') : [w, '...'])
    ];

    let available = all.filter(pair => !used.includes(pair.join(' - ')));
    if (available.length === 0) {
      storageService.resetUsedWords('wavelength');
      available = all;
    }

    const pair = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed('wavelength', pair.join(' - '));
    return pair;
  },

  getFakeArtistWord(difficulty: Difficulty): { word: string, category: string } {
    const staticPool = FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty];
    const custom = storageService.getCustomWords('fake_artist');
    const used = storageService.getUsedWords('fake_artist');
    
    const pool = [
      ...staticPool,
      ...custom.map(w => ({ word: w, category: 'Своё' }))
    ];

    let available = pool.filter(item => !used.includes(item.word));
    if (available.length === 0) {
      storageService.resetUsedWords('fake_artist');
      available = pool;
    }

    const item = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed('fake_artist', item.word);
    return item;
  },

  getSpyHuntLocations(): string[] {
    return LOCATIONS;
  },

  getRemainingWordsCount(gameId: string, difficulty: Difficulty): number {
    let total = 0;
    const custom = storageService.getCustomWords(gameId);
    
    switch (gameId) {
      case 'alias': {
        const cats = ALIAS_CATEGORIES.filter(c => {
          if (difficulty === 'easy') return c.difficulty === 'easy' || c.id === 'verbs';
          if (difficulty === 'hard') return c.difficulty === 'hard' || c.id === 'emotions';
          return true;
        });
        total = cats.flatMap(c => c.words).length + custom.length;
        break;
      }
      case 'just_one':
        total = (JUST_ONE_DATA_BY_DIFFICULTY[difficulty] || JUST_ONE_DATA_BY_DIFFICULTY.medium).length + custom.length;
        break;
      case 'wavelength':
        total = (WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium).length + custom.length;
        break;
      case 'fake_artist':
        total = (FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty] || FAKE_ARTIST_DATA_BY_DIFFICULTY.medium).length + custom.length;
        break;
      case 'telestrations':
        total = (TELESTRATIONS_WORDS[difficulty] || TELESTRATIONS_WORDS.medium).length + custom.length;
        break;
      case 'spy':
        total = LOCATIONS.length;
        break;
      case 'codenames':
        total = (CODENAMES_WORDS[difficulty] || CODENAMES_WORDS.medium).length + custom.length;
        break;
      case 'decrypto':
        total = (DECRYPTO_WORDS[difficulty] || DECRYPTO_WORDS.medium).length + custom.length;
        break;
      default:
        return 0;
    }

    const usedCount = storageService.getUsedWords(gameId).length;
    return Math.max(0, total - usedCount);
  }
};
