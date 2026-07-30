/**
 * Делит массив на две примерно равные части (первая получает «лишний» элемент
 * при нечётной длине). Используется для разбиения перемешанных игроков на команды.
 */
export function splitInHalf<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}
