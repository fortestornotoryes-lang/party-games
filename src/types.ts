export interface Player {
  id: string;
  name: string;
  role: string;
  isSpy: boolean;
}

export enum GameStatus {
  Menu = 'menu',
  Settings = 'settings',
  Setup = 'setup',
  Distributing = 'distributing',
  Playing = 'playing',
  Result = 'result',
  Reveal = 'reveal',
  Pass = 'pass',
  Hinting = 'hinting',
  Guessing = 'guessing',
  Review = 'review',
  Alias = 'alias',
  AliasSetup = 'alias_setup',
  AliasPlaying = 'alias_playing',
  FakeArtistSetup = 'fake_artist_setup',
  FakeArtistDistributing = 'fake_artist_distributing',
  FakeArtistPlaying = 'fake_artist_playing',
  FakeArtistVoting = 'fake_artist_voting',
  FakeArtistResult = 'fake_artist_result',
  ResistanceSetup = 'resistance_setup',
  ResistanceDistributing = 'resistance_distributing',
  ResistancePlaying = 'resistance_playing',
  ResistanceResult = 'resistance_result',
  WavelengthSetup = 'wavelength_setup',
  WavelengthPlaying = 'wavelength_playing',
  TelestrationsSetup = 'telestrations_setup',
  TelestrationsPlaying = 'telestrations_playing',
  TelestrationsResult = 'telestrations_result',
  JustOneSetup = 'just_one_setup',
  JustOnePlaying = 'just_one_playing',
  JustOneResult = 'just_one_result',
  CodenamesSetup = 'codenames_setup',
  CodenamesPlaying = 'codenames_playing',
  DecryptoSetup = 'decrypto_setup',
  DecryptoPlaying = 'decrypto_playing',
  MafiaSetup = 'mafia_setup',
  MafiaPlaying = 'mafia_playing',
  TruthOrDarePlaying = 'truth_or_dare_playing'
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'double_agent' | 'mole' | string;

export type GameTheme = 'red'  | 'green' | 'sky' | 'yellow' | 'orange' | 'purple' | 'blue';

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
