import { pickRandom, shuffle } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';

interface PoolOptions<T> {
  /** Ключ для used-хранилища. По умолчанию `String(item)`. */
  keyOf?: (item: T) => string;
  /** Сбросить колоду, когда доступных элементов меньше этого числа. По умолчанию 1. */
  minRemaining?: number;
}

/**
 * Отфильтровывает уже использованные элементы пула. Если доступных меньше
 * `minRemaining`, сбрасывает used-список игры и возвращает весь пул.
 * Ничего НЕ помечает использованным — это делают `drawFromPool`/`drawBatchFromPool`.
 */
export function availableFromPool<T>(gameId: string, pool: T[], opts: PoolOptions<T> = {}): T[] {
  const { keyOf = (x: T) => String(x), minRemaining = 1 } = opts;
  const used = storageService.getUsedWords(gameId);
  const available = pool.filter((item) => !used.includes(keyOf(item)));
  if (available.length < minRemaining) {
    storageService.resetUsedWords(gameId);
    return pool;
  }
  return available;
}

/** Берёт случайный доступный элемент и помечает его использованным. */
export function drawFromPool<T>(gameId: string, pool: T[], opts: PoolOptions<T> = {}): T {
  const keyOf = opts.keyOf ?? ((x: T) => String(x));
  const item = pickRandom(availableFromPool(gameId, pool, opts));
  storageService.markWordAsUsed(gameId, keyOf(item));
  return item;
}

/**
 * Берёт `count` перемешанных доступных элементов и помечает их все использованными.
 * По умолчанию сбрасывает колоду, когда доступных меньше `count`.
 */
export function drawBatchFromPool<T>(
  gameId: string,
  pool: T[],
  count: number,
  opts: PoolOptions<T> = {}
): T[] {
  const keyOf = opts.keyOf ?? ((x: T) => String(x));
  const available = availableFromPool(gameId, pool, { keyOf, minRemaining: opts.minRemaining ?? count });
  const selected = shuffle(available).slice(0, count);
  selected.forEach((item) => {
    storageService.markWordAsUsed(gameId, keyOf(item));
  });
  return selected;
}
