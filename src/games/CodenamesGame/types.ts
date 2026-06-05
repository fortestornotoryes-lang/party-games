export enum CodenamesPhase {
    Setup = 'setup',
    PassCaptain = 'pass_captain',
    Captain = 'captain',
    PassTeam = 'pass_team',
    Team = 'team',
    GameOver = 'game_over',
}

export type Team = 'red' | 'blue';
export type CardColor = Team | 'neutral' | 'assassin' | 'double_agent';

export interface Card {
    id: number;
    word: string;
    color: CardColor;
    revealed: boolean;
}
