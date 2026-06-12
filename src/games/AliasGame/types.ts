export enum AliasPhase {
  Start = 'start',
  Playing = 'playing',
  RoundEnd = 'round_end',
  GameOver = 'game_over',
}

export interface Team {
  players: string[];
  score: number;
  color: 'red' | 'blue';
}
