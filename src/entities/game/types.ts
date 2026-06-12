import type { LucideIcon } from 'lucide-react';

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

export interface GameMode {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

// Общий для всех игр id режима по умолчанию
export const CLASSIC_MODE_ID = 'classic';

// ─── Декларативные настройки игры (рендерятся в UniversalGameSettings) ────────

export type GameSettingKey = 'rounds' | 'timerSeconds' | 'countHiddenTraits';

export type GameSettingValue = number | boolean;

export interface GameSettingOption {
  readonly value: GameSettingValue;
  readonly label: string;
  readonly sublabel?: string;
}

export interface GameSettingDef {
  readonly key: GameSettingKey;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly color?: GameTheme;
  readonly options: readonly GameSettingOption[];
}

export interface GameMetadata {
  readonly id: GameKey;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: LucideIcon;
  readonly theme: GameTheme;
  readonly placeholder: string;
  readonly description: string;
  readonly players: string;
  readonly minPlayers: number;
  /** Верхний предел числа игроков (по умолчанию 12 в Setup) */
  readonly maxPlayers?: number;
  readonly modes?: readonly GameMode[];
  readonly backgroundImage?: string;
  /** Дополнительные настройки игры (раунды, таймер и т.п.) */
  readonly settings?: readonly GameSettingDef[];
  /** false — у игры нет выбора сложности (по умолчанию есть) */
  readonly hasDifficulty?: boolean;
  /** Подпись под кнопкой сложности; remainingWords — остаток слов в пуле игры */
  readonly difficultySublabel?: (d: Difficulty, remainingWords?: number) => string | undefined;
}

export type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
export type GamesRegistryMap = Record<GameKey, GameMetadata>;
