export interface Player {
  id: string;
  name: string;
  role: string;
  isSpy: boolean;
}

export type GameStatus = 'setup' | 'distributing' | 'playing' | 'result' | 'alias' | 'alias_setup' | 'fake_artist_setup' | 'fake_artist_distributing' | 'fake_artist_playing' | 'fake_artist_voting' | 'fake_artist_result' | 'resistance_setup' | 'resistance_distributing' | 'resistance_playing' | 'resistance_result' | 'wavelength_setup' | 'wavelength_playing' | 'telestrations_setup' | 'telestrations_playing' | 'telestrations_result' | 'just_one_setup' | 'just_one_playing' | 'just_one_result';

export interface GameState {
  players: Player[];
  location: string;
  status: GameStatus;
  currentPlayerIndex: number;
  timeLeft: number;
}
