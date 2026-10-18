import { useEffect } from 'react';
import type { DependencyList } from 'react';

/**
 * Инициализация партии (раздача ролей/раскладка/тасовка), которая должна выполниться один раз
 * за партию — и не повториться, если состояние уже восстановлено из сессии (kill-and-relaunch
 * посреди игры). `isRestored` — признак того, что состояние уже есть (обычно `state.length > 0`
 * или `state !== null`); пока он `true`, `initFn` не вызывается.
 *
 * Эффект намеренно перезапускается только по `deps` (обычно `[playerNames]`), а не при смене
 * `isRestored`/`initFn` — иначе объявление своей игры сразу же считалось бы «уже восстановленной».
 */
export function useGameInit(isRestored: boolean, initFn: () => void, deps: DependencyList) {
  useEffect(() => {
    if (isRestored) return;
    initFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
