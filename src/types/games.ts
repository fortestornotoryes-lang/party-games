import type {LucideIcon} from 'lucide-react';

import type {GameTheme} from '../types';

export enum GameKey {
    Spy = 'spy',
    FakeArtist = 'fake_artist',
    Resistance = 'resistance',
    Alias = 'alias',
    JustOne = 'just_one',
    Telestrations = 'telestrations',
    Wavelength = 'wavelength',
    Codenames = 'codenames',
    Decrypto = 'decrypto',
    Mafia = 'mafia',
    TruthOrDare = 'truth_or_dare',
    ConnectFour = 'connect_four',
    TabooReverse = 'taboo_reverse',
    Taboo = 'taboo',
    Bunker = 'bunker',
    Millionaire = 'millionaire',
    Corridor = 'corridor',
}

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
    readonly modes?: readonly GameMode[];
    readonly backgroundImage?: string;
}

export type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
export type GamesRegistryMap = Record<GameKey, GameMetadata>;
