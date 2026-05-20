import { ComponentType } from 'react';
import { GameTheme, GameStatus } from '../types';

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
    TruthOrDare = 'truth_or_dare'
}

export interface InstructionItem {
    readonly title: string;
    readonly content: string;
}

export interface GameMode {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly icon: ComponentType<any>;
}

export interface GameMetadata {
    readonly id: GameKey;
    readonly title: string;
    readonly subtitle: string;
    readonly icon: ComponentType<any>;
    readonly theme: GameTheme;
    readonly placeholder: string;
    readonly description?: string;
    readonly players: string;
    readonly minPlayers: number;
    readonly setupStatus: GameStatus;
    readonly modes?: readonly GameMode[];
}

export type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
export type GamesRegistryMap = Record<GameKey, GameMetadata>;