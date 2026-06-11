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

import {shuffle} from '@/utils/random';

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

    return shuffle(cards).map((card, id) => ({...card, id}));
}

/** Новая партия: раздаёт поле из колоды, остаток — добор. */
export function createGame(cfg: MemoRiskDifficultyConfig): CardsState {
    const deck = buildDeck(cfg);
    const slots = cfg.gridSize * cfg.gridSize;
    return {board: deck.slice(0, slots), deck: deck.slice(slots)};
}

/**
 * Конец хода: открытые карты переворачиваются обратно,
 * забранные слоты пополняются из колоды (или пустеют, если она кончилась).
 */
export function endOfTurnCleanup(cards: CardsState): CardsState {
    const deck = [...cards.deck];
    const board = cards.board.map((card) => {
        if (!card) return null;
        if (card.state === MemoCardState.Revealed) return {...card, state: MemoCardState.Hidden};
        if (card.state === MemoCardState.Collected) return deck.shift() ?? null;
        return card;
    });
    return {board, deck};
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
 * null — фигур меньше двух видов, партия окончена (колода и поле истощены).
 */
export function pickRoundShapes(board: (MemoCard | null)[], escalation: number): RoundShapes | null {
    const available = shuffle(remainingShapes(board));
    if (available.length < 2) return null;

    const level = Math.max(INITIAL_ESCALATION, Math.min(escalation, Math.floor(available.length / 2)));
    return {
        targets: available.slice(0, level),
        dangers: available.slice(level, level * 2),
    };
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
