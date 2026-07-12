import type { LucideIcon } from 'lucide-react';

import type { TranslateFn } from '@/shared/i18n/types';
import type { Difficulty, GameTheme } from '@/shared/types';

export const GameKey = {
  Spy: 'spy',
  FakeArtist: 'fake_artist',
  Resistance: 'resistance',
  Alias: 'alias',
  JustOne: 'just_one',
  Telestrations: 'telestrations',
  Wavelength: 'wavelength',
  Codenames: 'codenames',
  Decrypto: 'decrypto',
  Mafia: 'mafia',
  TruthOrDare: 'truth_or_dare',
  ConnectFour: 'connect_four',
  TabooReverse: 'taboo_reverse',
  Taboo: 'taboo',
  Bunker: 'bunker',
  Millionaire: 'millionaire',
  Corridor: 'corridor',
  MemoRisk: 'memo_risk',
} as const;

export type GameKey = (typeof GameKey)[keyof typeof GameKey];

export interface InstructionItem {
  readonly title: string;
  readonly content: string;
}

/** Структурная часть режима в реестре — тексты живут в словарях registry.games.<id>.modes */
export interface GameModeDef {
  readonly id: string;
  readonly icon: LucideIcon;
}

/** Режим с локализованными текстами (возвращает useLocalizedGame) */
export interface GameMode extends GameModeDef {
  readonly name: string;
  readonly description: string;
}

// Общий для всех игр id режима по умолчанию
export const CLASSIC_MODE_ID = 'classic';

// ─── Декларативные настройки игры (рендерятся в UniversalGameSettings) ────────

export type GameSettingKey = 'rounds' | 'timerSeconds' | 'countHiddenTraits';

export type GameSettingValue = number | boolean;

/** Структурная часть опции — подписи живут в словарях registry.games.<id>.settings */
export interface GameSettingOptionDef {
  readonly value: GameSettingValue;
}

/** Опция с локализованными подписями (возвращает useLocalizedGame) */
export interface GameSettingOption extends GameSettingOptionDef {
  readonly label: string;
  readonly sublabel?: string;
}

/** Структурная часть настройки — label живёт в словарях */
export interface GameSettingDefBase {
  readonly key: GameSettingKey;
  readonly icon: LucideIcon;
  readonly color?: GameTheme;
  readonly options: readonly GameSettingOptionDef[];
}

/** Настройка с локализованными подписями (возвращает useLocalizedGame) */
export interface GameSettingDef extends GameSettingDefBase {
  readonly label: string;
  readonly options: readonly GameSettingOption[];
}

/**
 * Структурная запись реестра: иконки, темы, лимиты игроков.
 * Все отображаемые тексты — в словарях i18n (registry.games.<id>),
 * локализованную версию отдаёт useLocalizedGame / useLocalizedGames.
 */
export interface GameMetadataDef {
  readonly id: GameKey;
  readonly icon: LucideIcon;
  readonly theme: GameTheme;
  readonly players: string;
  readonly minPlayers: number;
  /** Верхний предел числа игроков (по умолчанию 12 в Setup) */
  readonly maxPlayers?: number;
  readonly modes?: readonly GameModeDef[];
  readonly backgroundImage?: string;
  /** Дополнительные настройки игры (раунды, таймер и т.п.) */
  readonly settings?: readonly GameSettingDefBase[];
  /** false — у игры нет выбора сложности (по умолчанию есть) */
  readonly hasDifficulty?: boolean;
  /** Подпись под кнопкой сложности; remainingWords — остаток слов в пуле игры */
  readonly difficultySublabel?: (
    d: Difficulty,
    remainingWords: number | undefined,
    t: TranslateFn
  ) => string | undefined;
}

/** Метаданные игры с локализованными текстами (возвращает useLocalizedGame) */
export interface GameMetadata extends GameMetadataDef {
  readonly title: string;
  readonly subtitle: string;
  readonly placeholder: string;
  readonly description: string;
  readonly modes?: readonly GameMode[];
  readonly settings?: readonly GameSettingDef[];
}

/**
 * Пропсы, которые GamePlayRoute передаёт каждому компоненту игры.
 * Компонент игры объявляет нужное ему подмножество — единый контракт
 * позволяет рендерить все игры одним маппингом без особых веток.
 */
export interface GameComponentProps {
  playerNames: string[];
  onBack: () => void;
  /** Перезапуск партии — переход на setup текущей игры (использует Bunker) */
  onRestart?: () => void;
  /** Сложность из настроек на момент старта (использует Telestrations) */
  initialDifficulty?: Difficulty;
}

export type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
export type GamesRegistryMap = Record<GameKey, GameMetadataDef>;
