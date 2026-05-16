export const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
export const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
