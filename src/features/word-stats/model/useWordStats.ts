import { useCallback, useEffect, useState } from 'react';

import { contentService, type WordStats } from './contentService';

import type { GameKey } from '@/entities/game/types';
import type { Difficulty } from '@/shared/types';

const statsKey = (gameId: GameKey, difficulty: Difficulty) => `${gameId}:${difficulty}`;

/** Запуск, когда браузер свободен: не мешаем анимации входа экрана подгрузкой словарей. */
function whenIdle(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: 1500 });
    return () => {
      window.cancelIdleCallback(id);
    };
  }
  const id = setTimeout(fn, 600);
  return () => {
    clearTimeout(id);
  };
}

/**
 * Счётчики «осталось / всего» для набора игр × сложностей. Словари грузятся лениво,
 * после того как экран отрисовался, поэтому первые кадры геттер возвращает undefined
 * (счётчик просто появляется чуть позже). null — у игры нет расходуемого пула.
 */
export function useWordStats(
  gameIds: readonly GameKey[],
  difficulties: readonly Difficulty[]
): (gameId: GameKey, difficulty: Difficulty) => WordStats | null | undefined {
  const [stats, setStats] = useState<ReadonlyMap<string, WordStats | null>>(() => new Map());
  // Массивы на колл-сайтах пересоздаются каждый рендер — перезапускаем только при смене состава
  const depKey = `${gameIds.join(',')}|${difficulties.join(',')}`;

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      const jobs = gameIds.flatMap((gameId) =>
        difficulties.map(async (d) => {
          const value = await contentService.getWordStats(gameId, d);
          return [statsKey(gameId, d), value] as const;
        })
      );
      Promise.all(jobs)
        .then((entries) => {
          if (!cancelled) setStats(new Map(entries));
        })
        .catch(() => {
          // чанк словаря не загрузился (офлайн без кэша) — счётчики просто не показываем
        });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);

  return useCallback(
    (gameId: GameKey, difficulty: Difficulty) => stats.get(statsKey(gameId, difficulty)),
    [stats]
  );
}
