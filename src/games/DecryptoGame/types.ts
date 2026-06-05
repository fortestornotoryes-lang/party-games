export enum DecryptoPhase {
    Setup = 'setup',
    PassCaptain = 'pass_captain',
    CaptainClues = 'captain_clues',
    PassEnemy = 'pass_enemy',
    EnemyIntercept = 'enemy_intercept',
    PassTeam = 'pass_team',
    TeamGuess = 'team_guess',
    Reveal = 'reveal',
    GameOver = 'game_over',
}

export type TeamColor = 'red' | 'blue';

export interface RoundData {
    code: number[];
    clues: string[];
    interceptionGuess: number[] | null;
    teamGuess: number[];
}

export interface TeamState {
    words: string[];
    players: string[];
    interceptions: number;
    fails: number;
    history: RoundData[];
    captainIndex: number;
}
