import {useCallback, useState} from 'react';

/**
 * Хук для циклического перебора игроков/команд.
 *
 * Устраняет дублирование паттерна `currentIdx → (idx + 1) % items.length`,
 * который встречается в большинстве игр.
 *
 * @example
 * const { current, idx, isLast, next, reset } = usePlayerCycle(playerNames);
 *
 * // Вместо:
 * const [psychicIdx, setPsychicIdx] = useState(0);
 * const psychic = playerNames[psychicIdx];
 * const nextPsychic = () => setPsychicIdx(i => (i + 1) % playerNames.length);
 */
export const usePlayerCycle = <T>(items: T[]) => {
    const [idx, setIdx] = useState(0);

    const current = items[idx];
    const isLast = idx === items.length - 1;

    const next = useCallback(() => {
        setIdx((i) => (i + 1) % items.length);
    }, [items.length]);
    const reset = useCallback(() => {
        setIdx(0);
    }, []);

    return {current, idx, isLast, next, reset};
};
