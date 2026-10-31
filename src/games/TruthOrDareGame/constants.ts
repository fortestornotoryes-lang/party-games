import { GameKey } from '@/entities/game/types';

/** Подставляется имя случайного другого игрока */
export const PLAYER_TOKEN = '{player}';
/** Подставляется имя второго другого игрока (отличного от {player}) */
export const PLAYER2_TOKEN = '{player2}';
/** `{t:30}` — таймер на 30 секунд; в тексте заменяется на «30 сек» */
export const TIMER_TOKEN_RE = /\{t:(\d+)\}/g;

/** Отдельный used-ключ штрафов: их колода не должна сбрасывать историю вопросов */
export const PENALTY_POOL_ID = `${GameKey.TruthOrDare}_penalty`;

/** Последние секунды таймера карточки — тикает громче */
export const URGENT_SECONDS = 5;
