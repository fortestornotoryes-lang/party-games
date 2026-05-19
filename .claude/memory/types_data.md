---
name: types-data
description: "TypeScript-типы, GameStatus, GameState, константы контента, storageService"
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

## GameStatus (src/types.ts) — актуальный список

```
'menu' | 'settings'
'setup' | 'distributing' | 'playing' | 'result' | 'reveal' | 'pass'   — SPY HUNT + внутренние
'hinting' | 'guessing' | 'review'                                       — внутренние фазы игр
'alias' | 'alias_setup' | 'alias_playing'                               — Alias
'just_one_setup' | 'just_one_playing' | 'just_one_result'               — Just One
'telestrations_setup' | 'telestrations_playing' | 'telestrations_result' — Telestrations
'wavelength_setup' | 'wavelength_playing'                               — Wavelength
'codenames_setup' | 'codenames_playing'                                 — Codenames
'decrypto_setup' | 'decrypto_playing'                                   — Decrypto
'mafia_setup' | 'mafia_playing'                                         — Mafia
'fake_artist_setup' | 'fake_artist_distributing' | 'fake_artist_playing' | 'fake_artist_voting' | 'fake_artist_result'
'resistance_setup' | 'resistance_distributing' | 'resistance_playing' | 'resistance_result'
```

## GameState в App.tsx (src/types.ts)

```ts
{
  players: Player[];
  status: GameStatus;
  location?: string;          // SPY HUNT
  word?: string;              // FAKE ARTIST
  category?: string;          // FAKE ARTIST
  winner?: 'resistance' | 'spies' | null | string;
  canvasImage?: string;       // FAKE ARTIST → FakeArtistVoting
  rounds?: number;
  currentPlayerIndex?: number;
  timeLeft?: number;
  timerSeconds?: number;
  difficulty?: Difficulty;
  mode?: GameMode;
}
```

## src/types/games.ts — актуальные типы реестра

```ts
enum GameKey { Spy='spy', FakeArtist='fake_artist', Resistance='resistance',
               Alias='alias', JustOne='just_one', Telestrations='telestrations',
               Wavelength='wavelength', Codenames='codenames', Decrypto='decrypto', Mafia='mafia' }

interface GameMetadata {
  readonly id: GameKey;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: ComponentType<any>;
  readonly theme: GameTheme;
  readonly placeholder: string;
  readonly description?: string;
  readonly players: string;
  readonly minPlayers: number;
  readonly setupStatus: string;
  readonly modes?: readonly GameMode[];
}

type GamesRegistryMap = Record<GameKey, GameMetadata>;
type GameInstructionsMap = Record<GameKey, readonly InstructionItem[]>;
```

`src/types/instructions.ts` — устаревший файл с другим `GameKey` enum (не используется в основном коде).

## GameSettingsContext

```ts
{ difficulty, setDifficulty }   // 'easy' | 'medium' | 'hard'
{ mode, setMode }               // строка режима (если у игры есть modes)
{ rounds, setRounds }           // number
{ timerSeconds, setTimerSeconds }
{ currentGameId, setCurrentGameId }  // string | null
```

Используется в Setup, UniversalGameSettings, и самих играх.

## Контентные файлы (src/constants/)

| Файл | Экспорт |
|------|---------|
| spyHuntContent.ts | `LOCATIONS_DATA: LocationInfo[]` (25 лок., каждая 7 ролей) |
| fakeArtistContent.ts | `FAKE_ARTIST_DATA_BY_DIFFICULTY` — словарь по difficulty |
| resistanceContent.ts | `RESISTANCE_INSTRUCTIONS`, `MISSION_SIZES` |
| aliasContent.ts | `ALIAS_CATEGORIES: WordCategory[]` |
| wavelengthContent.ts | `WAVELENGTH_CATEGORIES: [string,string][]` — пары противоположностей |
| telestrationsContent.ts | `STARTING_WORDS: string[]` |
| justOneContent.ts | `JUST_ONE_WORDS: string[]` |
| codenamesContent.ts | контент Codenames |
| decryptoContent.ts | контент Decrypto |
| wordsDictionary.ts | общий словарь |

## storageService

```ts
storageService.getCustomWords(gameId)   // string[]
storageService.getUsedWords(gameId)     // string[]
storageService.savePlayers(names)
storageService.getSettings()            // { visualEffects: boolean, ... }
```

## feedbackService

```ts
feedbackService.playSound('click' | 'success' | ...)
feedbackService.vibrate(ms | ms[])      // паттерн вибрации
```
