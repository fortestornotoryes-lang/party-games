export interface Player {
  id: string;
  name: string;
  role: string;
  isSpy: boolean;
}

export type GameStatus = 
  | 'menu' 
  | 'settings'
  | 'setup' 
  | 'distributing' 
  | 'playing' 
  | 'result' 
  | 'reveal'
  | 'pass'
  | 'hinting'
  | 'guessing'
  | 'review'
  | 'alias' 
  | 'alias_setup' 
  | 'alias_playing'
  | 'fake_artist_setup' 
  | 'fake_artist_distributing' 
  | 'fake_artist_playing' 
  | 'fake_artist_voting' 
  | 'fake_artist_result' 
  | 'resistance_setup' 
  | 'resistance_distributing' 
  | 'resistance_playing' 
  | 'resistance_result' 
  | 'wavelength_setup' 
  | 'wavelength_playing' 
  | 'telestrations_setup' 
  | 'telestrations_playing' 
  | 'telestrations_result' 
  | 'just_one_setup' 
  | 'just_one_playing' 
  | 'just_one_result'
  | 'codenames_setup'
  | 'codenames_playing'
  | 'decrypto_setup'
  | 'decrypto_playing'
  | 'mafia_setup'
  | 'mafia_playing';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'double_agent' | 'mole' | string;

export type GameTheme = 'red' | 'emerald' | 'sky' | 'yellow' | 'orange' | 'purple' | 'blue';

export interface GameModeOption {
  id: string;
  name: string;
  description: string;
  icon: any; // Using any for icon component as they are from lucide-react
}

export interface GameMetadata {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  theme: GameTheme;
  placeholder: string;
  description?: string;
  instructions: { title: string; content: string }[];
  minPlayers: number;
  setupStatus: GameStatus;
  modes?: GameModeOption[];
  players?: string; // Range of players for display
  description: string; // Brief description for menu
}

export interface GameState {
  players: Player[];
  location?: string;
  word?: string;
  category?: string;
  status: GameStatus;
  currentPlayerIndex?: number;
  timeLeft?: number;
  winner?: 'resistance' | 'spies' | null | string;
  canvasImage?: string;
  rounds?: number;
  timerSeconds?: number;
  difficulty?: Difficulty;
  mode?: GameMode;
}
