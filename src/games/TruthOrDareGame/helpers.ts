import { PLAYER2_TOKEN, PLAYER_TOKEN, TIMER_TOKEN_RE } from './constants';
import type { TruthOrDareCard } from './types';

import { shuffle } from '@/shared/helpers/random';

/** Сколько ДРУГИХ игроков (кроме ходящего) нужно, чтобы сыграть шаблон */
export function requiredOtherPlayers(template: string): number {
  if (template.includes(PLAYER2_TOKEN)) return 2;
  if (template.includes(PLAYER_TOKEN)) return 1;
  return 0;
}

/** Шаблоны, которые можно сыграть при данном числе игроков */
export function playableTemplates(pool: string[], playerCount: number): string[] {
  const others = Math.max(0, playerCount - 1);
  return pool.filter((tpl) => requiredOtherPlayers(tpl) <= others);
}

/**
 * Подставляет в шаблон имена других игроков и таймер.
 * `{player}`/`{player2}` — разные случайные игроки, не ходящий.
 * `{t:N}` — первый задаёт длительность таймера, все заменяются на formatSeconds(N).
 */
export function renderCard(
  template: string,
  currentPlayer: string,
  players: string[],
  formatSeconds: (n: number) => string
): TruthOrDareCard {
  const [first = '', second = ''] = shuffle(players.filter((p) => p !== currentPlayer));
  let timerSeconds = 0;

  const text = template
    .replaceAll(PLAYER2_TOKEN, second)
    .replaceAll(PLAYER_TOKEN, first)
    .replace(TIMER_TOKEN_RE, (_, n: string) => {
      const seconds = Number(n);
      if (timerSeconds === 0) timerSeconds = seconds;
      return formatSeconds(seconds);
    });

  return { text, timerSeconds };
}
