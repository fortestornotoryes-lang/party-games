/**
 * Делит массив на две примерно равные части (первая получает «лишний» элемент
 * при нечётной длине). Используется для разбиения перемешанных игроков на команды.
 */
export function splitInHalf<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

/**
 * Раздаёт элементы по `count` группам по кругу (размеры отличаются максимум на 1).
 * Порядок внутри исходного массива сохраняется — для случайного состава
 * перемешать массив до вызова.
 */
export function splitIntoGroups<T>(items: T[], count: number): T[][] {
  const groups: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => groups[i % count].push(item));
  return groups;
}
