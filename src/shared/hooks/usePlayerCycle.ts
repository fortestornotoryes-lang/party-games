import {useCallback, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';

/**
 * Хук для циклического перебора игроков/команд.
 *
 * Устраняет дублирование паттерна `currentIdx → (idx + 1) % items.length`,
 * который встречается в большинстве игр.
 *
 * Вторым аргументом можно передать внешнее состояние индекса
 * (например, из usePersistedState — чтобы индекс переживал перезагрузку).
 *
 * @example
 * const { current, idx, isLast, next, reset } = usePlayerCycle(playerNames);
 *
 * // С персистенцией:
 * const idxState = usePersistedState(GameKey.JustOne, 'guesserIdx', () => Math.floor(Math.random() * playerNames.length));
 * const { current, next } = usePlayerCycle(playerNames, idxState);
 */
export const usePlayerCycle = <T>(
    items: T[],
    state?: [number, Dispatch<SetStateAction<number>>]
) => {
    const internal = useState(0);
    const [idx, setIdx] = state ?? internal;

    const current = items[idx];
    const isLast = idx === items.length - 1;

    const next = useCallback(() => {
        setIdx((i) => (i + 1) % items.length);
    }, [items.length, setIdx]);
    const reset = useCallback(() => {
        setIdx(0);
    }, [setIdx]);

    return {current, idx, isLast, next, reset};
};
