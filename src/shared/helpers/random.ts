/**
 * Несмещённое перемешивание — алгоритм Фишера–Йейтса.
 * Не мутирует исходный массив, возвращает новый.
 *
 * `.sort(() => Math.random() - 0.5)` статистически смещён (V8 TimSort),
 * некоторые перестановки появлялись значительно реже других.
 */
export const shuffle = <T>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Случайное целое число в диапазоне [min, max] включительно. */
export const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;
