---
name: types-data
description: "TypeScript-типы, GameStatus enum, GameMetadata, GameState, константы контента, storageService"
metadata:
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Player (src/types.ts)

```ts
interface Player {
  id: string;
  name: string;
  role: string;
  isSpy: boolean;
}
```

## GameStatus (src/types.ts) — ENUM, не union

```ts
enum GameStatus {
  Menu = 'menu',           Settings = 'settings',
  Setup = 'setup',         Distributing = 'distributing',
  Playing = 'playing',     Result = 'result',
  Reveal = 'reveal',       Pass = 'pass',
  Hinting = 'hinting',     Guessing = 'guessing',   Review = 'review',
  Alias = 'alias',         AliasSetup = 'alias_setup',   AliasPlaying = 'alias_playing',
  FakeArtistSetup = 'fake_artist_setup',
  FakeArtistDistributing = 'fake_artist_distributing',
  FakeArtistPlaying = 'fake_artist_playing',
  FakeArtistVoting = 'fake_artist_voting',
  FakeArtistResult = 'fake_artist_result',
  ResistanceSetup = 'resistance_setup',
  ResistanceDistributing = 'resistance_distributing',
  ResistancePlaying = 'resistance_playing',
  ResistanceResult = 'resistance_result',
  WavelengthSetup = 'wavelength_setup',   WavelengthPlaying = 'wavelength_playing',
  TelestrationsSetup = 'telestrations_setup',
  TelestrationsPlaying = 'telestrations_playing',
  TelestrationsResult = 'telestrations_result',
  JustOneSetup = 'just_one_setup',   JustOnePlaying = 'just_one_playing',   JustOneResult = 'just_one_result',
  CodenamesSetup = 'codenames_setup',   CodenamesPlaying = 'codenames_playing',
  DecryptoSetup = 'decrypto_setup',   DecryptoPlaying = 'decrypto_playing',
  MafiaSetup = 'mafia_setup',   MafiaPlaying = 'mafia_playing',
}
```

**Важно:** используй `GameStatus.X` (enum), НЕ строки `'menu'` / `'playing'`. App.tsx частично не мигрирован (TS-ошибки в switch-кейсах), в новом коде — только enum.

## GameMetadata (src/types.ts, НЕ types/games.ts)

```ts
interface GameMetadata {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  theme: GameTheme;
  placeholder: string;
  description?: string;
  instructions: { title: string; content: string }[];
  minPlayers: number;
  setupStatus: GameStatus;   // enum, не строка
  modes?: GameModeOption[];
  players?: string;          // диапазон вида "4–7"
}
```

`GamesRegistryMap = Record<GameKey, GameMetadata>` живёт в `src/types/games.ts`.

## GameState (src/types.ts)

Определён в types.ts, но App.tsx его больше НЕ использует как единый объект состояния. App.tsx хранит `players: Player[]` и `status: GameStatus` раздельно.

```ts
interface GameState {
  players: Player[];
  status: GameStatus;
  location?: string;
  word?: string;
  category?: string;
  winner?: 'resistance' | 'spies' | null | string;
  canvasImage?: string;
  rounds?: number;
  currentPlayerIndex?: number;
  timeLeft?: number;
  timerSeconds?: number;
  difficulty?: Difficulty;
  mode?: GameMode;
}
```

## src/types/games.ts

```ts
enum GameKey { Spy='spy', FakeArtist='fake_artist', Resistance='resistance',
               Alias='alias', JustOne='just_one', Telestrations='telestrations',
               Wavelength='wavelength', Codenames='codenames', Decrypto='decrypto', Mafia='mafia' }

type GamesRegistryMap = Record<GameKey, GameMetadata>;
type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
```

`src/types/instructions.ts` — устаревший файл, не используется.

## GameSettingsContext

```ts
{ difficulty, setDifficulty }   // 'easy' | 'medium' | 'hard'
{ mode, setMode }
{ rounds, setRounds }
{ timerSeconds, setTimerSeconds }
{ currentGameId, setCurrentGameId }  // GameKey | null
```

## Контентные файлы (src/constants/)

| Файл | Экспорт |
|------|---------|
| spyHuntContent.ts | `LOCATIONS_BY_DIFFICULTY`, `LocationInfo`, `SpyDifficulty` |
| fakeArtistContent.ts | `FAKE_ARTIST_DATA_BY_DIFFICULTY` |
| resistanceContent.ts | `RESISTANCE_INSTRUCTIONS`, `MISSION_SIZES` |
| aliasContent.ts | `ALIAS_CATEGORIES`, `ALIAS_DIFFICULTY_CONFIG`, `WIN_SCORE = 30`, `TROPHY_THRESHOLD = 20` |
| wavelengthContent.ts | `WAVELENGTH_DATA_BY_DIFFICULTY` |
| telestrationsContent.ts | `WORDS_BY_DIFFICULTY as TELESTRATIONS_WORDS` |
| justOneContent.ts | `JUST_ONE_DATA_BY_DIFFICULTY` |
| codenamesContent.ts | `WORDS_BY_DIFFICULTY as CODENAMES_WORDS` |
| decryptoWords.ts | `WORDS_BY_DIFFICULTY as DECRYPTO_WORDS` |
| instructions.ts | `GAME_INSTRUCTIONS: GameInstructionsMap` — инструкции для Setup |

## storageService

```ts
storageService.getCustomWords(gameId)
storageService.getUsedWords(gameId)
storageService.markWordAsUsed(gameId, word)
storageService.resetUsedWords(gameId)
storageService.savePlayers(names)
storageService.getSettings()   // { visualEffects: boolean, ... }
```

## feedbackService

```ts
feedbackService.playSound('click' | 'success' | 'error' | ...)
feedbackService.vibrate(ms | ms[])
```