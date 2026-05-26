export const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
export const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
/** Случайное целое число в диапазоне [min, max] включительно. */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
