export const MemoRiskPhase = {
  Playing: 'playing',
  GameOver: 'game_over',
} as const;

export type MemoRiskPhase = (typeof MemoRiskPhase)[keyof typeof MemoRiskPhase];

export const MemoCardState = {
  Hidden: 'hidden',
  Revealed: 'revealed',
  Collected: 'collected',
} as const;

export type MemoCardState = (typeof MemoCardState)[keyof typeof MemoCardState];

export const MemoShape = {
  Circle: 'circle',
  Square: 'square',
  Triangle: 'triangle',
  Star: 'star',
  Heart: 'heart',
  Hexagon: 'hexagon',
} as const;

export type MemoShape = (typeof MemoShape)[keyof typeof MemoShape];

/** Редкость фигуры — определяет ценность и рамку карты */
export const MemoRarity = {
  Common: 'common',
  Uncommon: 'uncommon',
  Rare: 'rare',
  Epic: 'epic',
} as const;

export type MemoRarity = (typeof MemoRarity)[keyof typeof MemoRarity];

export const MEMO_RISK_MODES = {
  CLASSIC: 'classic',
  TIMED: 'timed',
  LIMITED: 'limited',
} as const;

export type MemoRiskMode = (typeof MEMO_RISK_MODES)[keyof typeof MEMO_RISK_MODES];

/** Чем закончился ход. Очки хода сгорают только при Busted. */
export const TurnOutcome = {
  /** Игрок сам забрал очки */
  Banked: 'banked',
  /** Открыта опасная фигура — очки хода сгорели */
  Busted: 'busted',
  /** Время хода истекло (timed) — очки сохранены */
  Timeout: 'timeout',
  /** Лимит открытий исчерпан (limited) — очки сохранены */
  OutOfFlips: 'out_of_flips',
} as const;

export type TurnOutcome = (typeof TurnOutcome)[keyof typeof TurnOutcome];

export interface MemoCard {
  /** Уникальный id карты в колоде (React key — новая карта в слоте ремоунтится без анимации) */
  id: number;
  shape: MemoShape;
  /** Редкость — ценность карты и цвет рамки */
  rarity: MemoRarity;
  /** Супер-карта: удваивает очки текущего хода, фигура и редкость игнорируются */
  isSuper: boolean;
  state: MemoCardState;
}

/**
 * Карты партии: поле + колода добора.
 * Слот поля = индекс массива; null — слот опустел (колота кончилась).
 */
export interface CardsState {
  board: (MemoCard | null)[];
  deck: MemoCard[];
}

export interface RoundShapes {
  targets: MemoShape[];
  dangers: MemoShape[];
}
