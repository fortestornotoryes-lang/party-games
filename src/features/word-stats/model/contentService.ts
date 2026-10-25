import { GameKey } from '@/entities/game/types';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

type PoolGetter = (difficulty: Difficulty) => readonly string[];

// Пул игры = все её used-ключи (пресет + кастомные слова). Источник — те же функции,
// которыми игры выбирают контент, поэтому счётчик не может разойтись с реальной выдачей.
// Игры без расходуемого пула (mafia, resistance, corridor и т.п.) в реестре отсутствуют.
// Контент грузится через import(): статический импорт тащил словари всех игр в стартовый
// бандл (~в 2 раза тяжелее), хотя меню нужны только счётчики. Чанки общие с lazy-играми.
const WORD_POOLS: Partial<Record<GameKey, () => Promise<PoolGetter>>> = {
  [GameKey.Alias]: () =>
    import('@/games/AliasGame/model/aliasContent').then((m) => m.getAliasWordPool),
  [GameKey.JustOne]: () =>
    import('@/games/JustOneGame/model/justOneContent').then((m) => m.getJustOneWordPool),
  [GameKey.Wavelength]: () =>
    import('@/games/WavelengthGame/model/wavelengthContent').then(
      (m) => (d) => m.getWavelengthPairPool(d).map(m.wavelengthPairKey)
    ),
  [GameKey.FakeArtist]: () =>
    import('@/games/FakeArtistGame/model/fakeArtistContent').then(
      (m) => (d) => m.getFakeArtistPool(d).map((i) => i.word)
    ),
  [GameKey.Telestrations]: () =>
    import('@/games/TelestrationsGame/model/telestrationsContent').then(
      (m) => m.getTelestrationsWordPool
    ),
  [GameKey.Spy]: () =>
    import('@/games/SpyHuntGame/model/spyHuntContent').then(
      (m) => (d) => m.getSpyHuntLocationPool(d).map((l) => l.name)
    ),
  [GameKey.Codenames]: () =>
    import('@/games/CodenamesGame/model/codenamesContent').then((m) => m.getCodenamesWordPool),
  [GameKey.Decrypto]: () =>
    import('@/games/DecryptoGame/model/decryptoContent').then((m) => m.getDecryptoWordPool),
  [GameKey.TruthOrDare]: () =>
    import('@/games/TruthOrDareGame/model/truthOrDareContent').then((m) => (d) => [
      ...m.getTruthOrDarePool('truth', d),
      ...m.getTruthOrDarePool('dare', d),
    ]),
  [GameKey.TabooReverse]: () =>
    import('@/games/TabooReverseGame/content').then((m) => m.getTabooReverseWordPool),
  [GameKey.Taboo]: () => import('@/games/TabooGame/content').then((m) => m.getTabooClassicWordPool),
  [GameKey.Millionaire]: () =>
    import('@/games/MillionaireGame/model/millionaireContent').then(
      (m) => () => m.getMillionaireQuestionPool()
    ),
};

export interface WordStats {
  total: number;
  remaining: number;
}

export const contentService = {
  /**
   * Сколько контента игры осталось несыгранным. null — у игры нет расходуемого пула.
   * В компонентах использовать хук useWordStats, а не вызывать напрямую в рендере.
   */
  async getWordStats(gameId: GameKey, difficulty: Difficulty): Promise<WordStats | null> {
    const loadPool = WORD_POOLS[gameId];
    if (!loadPool) return null;

    const all = (await loadPool())(difficulty);
    if (all.length === 0) return null;
    const used = new Set(storageService.getUsedWords(gameId));
    return { total: all.length, remaining: all.filter((w) => !used.has(w)).length };
  },
};
