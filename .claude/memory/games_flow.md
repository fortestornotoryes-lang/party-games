---
name: games-flow
description: "Все 10 игр: GameStatus-цепочки, компоненты, GameRegistry-метаданные"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## GameRegistry паттерн

Все игры регистрируются в `src/registry/GameRegistry.tsx`. Тип `GameMetadata` определён в `src/types/games.ts`:
```ts
interface GameMetadata {
  readonly id: GameKey;       // enum: 'spy'|'fake_artist'|'resistance'|...
  readonly title: string;
  readonly subtitle: string;
  readonly icon: ComponentType<any>;
  readonly theme: GameTheme;  // 'red'|'sky'|'green'|'blue'|'orange'|'purple'|'yellow'
  readonly placeholder: string;
  readonly description?: string;
  readonly players: string;   // Строка вида "4–7"
  readonly minPlayers: number;
  readonly setupStatus: string;
  readonly modes?: readonly GameMode[];
}
```
Инструкции вынесены отдельно в `src/constants/instructions.ts` как `GAME_INSTRUCTIONS: GameInstructionsMap`.

`MainMenu` рендерит `Object.values(GAMES_REGISTRY)`. Порядок в реестре = порядок в меню.

---

## GameStatus → Компонент (App.tsx renderGame)

| GameStatus | Компонент |
|-----------|-----------|
| `setup` | `Setup` → `startGame` → `distributing` |
| `distributing` | `RoleDistribution` → `playing` |
| `playing` | `SpyHuntGame` |
| `alias_playing` | `AliasGame` |
| `just_one_playing` | `JustOneGame` |
| `telestrations_playing` | `TelestrationsGame` |
| `wavelength_playing` | `WavelengthGame` |
| `codenames_playing` | `CodenamesGame` |
| `decrypto_playing` | `DecryptoGame` |
| `mafia_playing` | `MafiaGame` |
| `fake_artist_distributing` | `FakeArtistDistribution` |
| `fake_artist_playing` | `FakeArtistGame` |
| `fake_artist_voting` | `FakeArtistVoting` |
| `resistance_distributing` | `ResistanceDistribution` |
| `resistance_playing` | `ResistanceGame` |

---

## Инициализация игроков (App.tsx startGame)

```
spy → initSpyHunt(playerNames, difficulty, mode) → { players, location }
fake_artist → initFakeArtist(playerNames) → { players }
resistance → initResistance(playerNames) → { players }
default → playerNames.map(name => ({ id: name, name, role: 'Игрок', isSpy: false }))
```

---

## Цепочки по играм

### SPY HUNT
`setup → distributing → playing` (onBack: reset)

### FAKE ARTIST
`setup → fake_artist_distributing → fake_artist_playing → fake_artist_voting` (onFinish передаёт `canvasImage`)

### RESISTANCE
`setup → resistance_distributing → resistance_playing` (onFinish: reset)

### ALIAS / JUST ONE / TELESTRATIONS / WAVELENGTH / CODENAMES / DECRYPTO / MAFIA
`setup → <game>_playing` (внутренняя фаза-машина)

---

## Темы игр (GameRegistry)

| ID | Тема | Цвет |
|----|------|------|
| spy | red | premium-red |
| fake_artist | green | premium-green |
| resistance | sky | premium-sky |
| alias | orange | premium-orange |
| wavelength | purple | premium-purple |
| telestrations | yellow | premium-yellow |
| just_one | blue | premium-blue |
| codenames | red | premium-red |
| decrypto | sky | premium-sky |
| mafia | purple | premium-purple |
