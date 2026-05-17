export enum GameKey {
    Alias = 'ALIAS',
    Codenames = 'CODENAMES',
    Decrypto = 'DECRYPTO',
    Telestrations = 'TELESTRATIONS',
    SpyHunt = 'SPY_HUNT'
}

export interface InstructionItem {
    readonly title: string;
    readonly content: string;
}

export type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;