import { GameKey } from '@/entities/game/types';
import { getAliasWordPool } from '@/games/AliasGame/model/useAliasContent';
import { getCodenamesWordPool } from '@/games/CodenamesGame/model/useCodenamesContent';
import { getDecryptoWordPool } from '@/games/DecryptoGame/model/useDecryptoContent';
import { getFakeArtistPool } from '@/games/FakeArtistGame/model/useFakeArtistContent';
import { getJustOneWordPool } from '@/games/JustOneGame/model/useJustOneContent';
import { getMillionaireQuestionPool } from '@/games/MillionaireGame/model/millionaireContent';
import { getSpyHuntLocationPool } from '@/games/SpyHuntGame/model/useSpyHuntContent';
import { getTabooClassicWordPool } from '@/games/TabooGame/content';
import { getTabooReverseWordPool } from '@/games/TabooReverseGame/content';
import { getTelestrationsWordPool } from '@/games/TelestrationsGame/model/useTelestrationsContent';
import { getTruthOrDarePool } from '@/games/TruthOrDareGame/model/useTruthOrDareContent';
import {
  getWavelengthPairPool,
  wavelengthPairKey,
} from '@/games/WavelengthGame/model/useWavelengthContent';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

// Пул игры = все её used-ключи (пресет + кастомные слова). Источник — те же функции,
// которыми игры выбирают контент, поэтому счётчик не может разойтись с реальной выдачей.
// Игры без расходуемого пула (mafia, resistance, corridor и т.п.) в реестре отсутствуют.
const WORD_POOLS: Partial<Record<GameKey, (difficulty: Difficulty) => readonly string[]>> = {
  [GameKey.Alias]: getAliasWordPool,
  [GameKey.JustOne]: getJustOneWordPool,
  [GameKey.Wavelength]: (d) => getWavelengthPairPool(d).map(wavelengthPairKey),
  [GameKey.FakeArtist]: (d) => getFakeArtistPool(d).map((i) => i.word),
  [GameKey.Telestrations]: getTelestrationsWordPool,
  [GameKey.Spy]: (d) => getSpyHuntLocationPool(d).map((l) => l.name),
  [GameKey.Codenames]: getCodenamesWordPool,
  [GameKey.Decrypto]: getDecryptoWordPool,
  [GameKey.TruthOrDare]: (d) => [
    ...getTruthOrDarePool('truth', d),
    ...getTruthOrDarePool('dare', d),
  ],
  [GameKey.TabooReverse]: getTabooReverseWordPool,
  [GameKey.Taboo]: getTabooClassicWordPool,
  [GameKey.Millionaire]: () => getMillionaireQuestionPool(),
};

export const contentService = {
  // TODO: RN — replace with useEffect async load (called synchronously on the UI render path of MainMenu/UniversalGameSettings)
  getWordStats(gameId: GameKey, difficulty: Difficulty): { total: number; remaining: number } {
    const getPool = WORD_POOLS[gameId];
    if (!getPool) return { total: 0, remaining: 0 };

    const all = getPool(difficulty);
    const used = storageService.getUsedWords(gameId);
    return { total: all.length, remaining: all.filter((w) => !used.includes(w)).length };
  },
};
