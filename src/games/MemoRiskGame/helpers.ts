import {
  DECK_SIZE,
  INITIAL_ESCALATION,
  type MemoRiskDifficultyConfig,
  RARITY_META,
  SHAPE_ORDER,
  SUPER_CARDS_COUNT,
} from './constants';
import {
  MemoCardState,
  MemoRarity,
  type CardsState,
  type MemoCard,
  type MemoShape,
  type RoundShapes,
} from './types';

import { shuffle } from '@/shared/helpers/random';

function rollRarity(): MemoRarity {
  const rarities = Object.values(MemoRarity);
  const totalWeight = rarities.reduce((sum, r) => sum + RARITY_META[r].weight, 0);
  let roll = Math.random() * totalWeight;
  for (const rarity of rarities) {
    roll -= RARITY_META[rarity].weight;
    if (roll < 0) return rarity;
  }
  return MemoRarity.Common;
}

/** Колода на партию: DECK_SIZE карт — фигуры поровну, редкость по весам, супер-карты. */
function buildDeck(cfg: MemoRiskDifficultyConfig): MemoCard[] {
  const shapes = SHAPE_ORDER.slice(0, cfg.shapeCount);

  const cards: Omit<MemoCard, 'id'>[] = [];
  for (let i = 0; i < DECK_SIZE - SUPER_CARDS_COUNT; i++) {
    cards.push({
      shape: shapes[i % shapes.length],
      rarity: rollRarity(),
      isSuper: false,
      state: MemoCardState.Hidden,
    });
  }
  for (let i = 0; i < SUPER_CARDS_COUNT; i++) {
    cards.push({
      shape: shapes[0],
      rarity: MemoRarity.Common,
      isSuper: true,
      state: MemoCardState.Hidden,
    });
  }

  return shuffle(cards).map((card, id) => ({ ...card, id }));
}

/** Новая партия: раздаёт поле из колоды, остаток — добор. */
export function createGame(cfg: MemoRiskDifficultyConfig): CardsState {
  const deck = buildDeck(cfg);
  const slots = cfg.gridSize * cfg.gridSize;
  return { board: deck.slice(0, slots), deck: deck.slice(slots) };
}

/**
 * Конец хода: открытые карты переворачиваются обратно,
 * забранные слоты пополняются из колоды (или пустеют, если она кончилась).
 */
export function endOfTurnCleanup(cards: CardsState): CardsState {
  const deck = [...cards.deck];
  const board = cards.board.map((card) => {
    if (!card) return null;
    if (card.state === MemoCardState.Revealed) return { ...card, state: MemoCardState.Hidden };
    if (card.state === MemoCardState.Collected) return deck.shift() ?? null;
    return card;
  });
  return { board, deck };
}

/** Виды фигур, ещё оставшиеся на поле (супер-карты и забранные не считаются). */
export function remainingShapes(board: (MemoCard | null)[]): MemoShape[] {
  const present = new Set<MemoShape>();
  for (const card of board) {
    if (card && !card.isSuper && card.state !== MemoCardState.Collected) present.add(card.shape);
  }
  return [...present];
}

/**
 * Выбирает целевые и опасные фигуры хода. Уровень риска (escalation) задаёт
 * их количество, но клампится так, чтобы наборы не пересекались.
 * Старается сохранить фигуры из prevRound, если они ещё есть на поле.
 * null — фигур меньше двух видов, партия окончена (колода и поле истощены).
 */
export function pickRoundShapes(
  board: (MemoCard | null)[],
  escalation: number,
  prevRound?: RoundShapes | null
): RoundShapes | null {
  const available = remainingShapes(board);
  if (available.length < 2) return null;

  // По очереди добавляем в цели и опасности:
  // E=1: T=1, D=1 (всего 2)
  // E=2: T=2, D=1 (всего 3)
  // E=3: T=2, D=2 (всего 4)
  // E=4: T=3, D=2 (всего 5)
  // E=5: T=3, D=3 (всего 6)
  const safeE = Math.max(1, Math.min(escalation, available.length - 1));
  const tCount = Math.floor(safeE / 2) + 1;
  const dCount = Math.ceil(safeE / 2);

  let targets: MemoShape[] = [];
  let dangers: MemoShape[] = [];

  if (prevRound) {
    // Пытаемся сохранить старые фигуры, если они всё ещё на поле
    targets = prevRound.targets.filter((s) => available.includes(s));
    dangers = prevRound.dangers.filter((s) => available.includes(s));
  }

  // Обрезаем лишние, если уровень сложности упал или фигуры перемешались
  if (targets.length > tCount) targets = targets.slice(0, tCount);
  if (dangers.length > dCount) dangers = dangers.slice(0, dCount);

  const picked = new Set([...targets, ...dangers]);
  const pool = shuffle(available.filter((s) => !picked.has(s)));

  // Добираем недостающие из свободных на поле
  while (targets.length < tCount && pool.length > 0) {
    targets.push(pool.shift()!);
  }
  while (dangers.length < dCount && pool.length > 0) {
    dangers.push(pool.shift()!);
  }

  return { targets, dangers };
}

/** Можно ли начать следующий ход на этом поле. */
export function canStartRound(board: (MemoCard | null)[]): boolean {
  return pickRoundShapes(board, INITIAL_ESCALATION) !== null;
}

/** Все фигуры раунда ещё присутствуют на поле (иначе нужен новый розыгрыш). */
export function isRoundValid(round: RoundShapes, board: (MemoCard | null)[]): boolean {
  const present = new Set(remainingShapes(board));
  return [...round.targets, ...round.dangers].every((shape) => present.has(shape));
}

export function cardPoints(card: MemoCard): number {
  return RARITY_META[card.rarity].points;
}
