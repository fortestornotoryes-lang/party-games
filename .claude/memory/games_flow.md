---
name: games-flow
description: "Игры: темы, lazy loading, инициализация игроков. ВНИМАНИЕ: GameStatus/setupStatus удалены — роутинг через react-router"
metadata:
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

> ⚠️ **Устарело (2026-06-10):** enum `GameStatus` и поле `setupStatus` УДАЛЕНЫ из кода.
> Роутинг теперь через react-router v7: `src/app/router/` + `src/pages/` (`/game/:gameKey/setup|play`), см. [[project-overview]].
> Упоминания GameStatus/setupStatus ниже — историческая справка о темах/цепочках фаз, не копировать в код.

## GameRegistry паттерн

Все игры регистрируются в `src/registry/GameRegistry.tsx`. Тип `GameMetadata` определён в `src/types.ts`.

Компоненты игр — **lazy-loaded** через `React.lazy`:
```ts
const AliasGame = lazy(() => import('../games/AliasGame/AliasGame').then(m => ({ default: m.AliasGame })));
```
App.tsx оборачивает `renderGame()` в `<Suspense fallback={...}>`.

Инструкции вынесены в `src/constants/instructions.ts` как `GAME_INSTRUCTIONS: GameInstructionsMap`.

---

## setupStatus и темы (GameRegistry)

| ID | setupStatus | Тема | GameHeader themeColor |
|----|-------------|------|----------------------|
| spy | `GameStatus.Playing` | red | `border-premium-red/30 text-premium-red` |
| fake_artist | `GameStatus.FakeArtistPlaying` | green | `border-premium-green/30 text-premium-green` |
| resistance | `GameStatus.ResistancePlaying` | sky | `border-premium-sky/30 text-premium-sky` |
| alias | `GameStatus.AliasPlaying` | **blue** | `border-premium-blue/50 text-premium-blue` |
| just_one | `GameStatus.JustOnePlaying` | yellow | `border-premium-yellow/30 text-premium-yellow` |
| telestrations | `GameStatus.TelestrationsPlaying` | orange | `border-premium-orange/30 text-premium-orange` |
| truth_or_dare | `GameStatus.TruthOrDarePlaying` | red | `border-premium-red/30 text-premium-red` |
| wavelength | `GameStatus.WavelengthPlaying` | purple | `border-premium-purple/30 text-premium-purple` |
| codenames | `GameStatus.CodenamesPlaying` | green | `border-premium-green/30 text-premium-green` |
| decrypto | `GameStatus.DecryptoPlaying` | purple | `border-premium-purple/30 text-premium-purple` |
| mafia | `GameStatus.MafiaPlaying` | orange | `border-premium-orange/30 text-premium-orange` |

---

## App.tsx: startGame и роутинг

`startGame(playerNames)` упрощён — никакой `initSpyHunt`/`initFakeArtist`/`initResistance`. Просто:
```ts
setPlayers(playerNames.map(name => ({ id: name, name, role: 'Игрок', isSpy: false })));
setStatus(config.setupStatus);  // GameStatus enum из GameRegistry
```

Роутинг в `renderGame()` — switch по `status`:
```ts
case 'alias_playing':      → <AliasGame>
case 'just_one_playing':   → <JustOneGame>
case 'telestrations_playing': → <TelestrationsGame initialDifficulty={difficulty}>
case 'wavelength_playing': → <WavelengthGame>
case 'codenames_playing':  → <CodenamesGame>
case 'decrypto_playing':   → <DecryptoGame>
case 'mafia_playing':      → <MafiaGame>
case 'playing':            → <SpyHuntGame>
case 'fake_artist_playing':→ <FakeArtistGame>
case 'resistance_playing': → <ResistanceGame>
case 'setup':              → <Setup> + <UniversalGameSettings>
case 'settings':           → <Settings>
default:                   → <MainMenu> + Settings-кнопка (fixed bottom-right)
```

⚠️ App.tsx частично не мигрирован: switch-кейсы используют строки, а не `GameStatus.X`. Это текущие TS-ошибки в проекте. В новом коде вне App.tsx — только `GameStatus.X`.

---

## Инициализация игроков

Все игры получают `playerNames: string[]`. Инициализацию ролей каждая игра делает сама:
- SpyHunt → `contentService.getSpyHuntLocation()` + role assignment в `initSpyHunt()`
- FakeArtist → `initFakeArtist()` в gameLogic.ts
- Resistance → `initResistance()` в gameLogic.ts
- Остальные → слова/контент через contentService, команды — внутри компонента

---

## Фазы внутри игр

Внутренние фазы — enum в `./types.ts` рядом с компонентом. Примеры:
- `AliasPhase` в `src/games/AliasGame/types.ts`
- `TelestrationsPhase` в `src/games/TelestrationsGame/types.ts`

Не использовать строковые литералы для внутренних фаз — только enum. [[phase-enum-pattern]]

---

## Telestrations — особенности (2026-05-20)

Раунды (selectedRounds / initialRounds) **полностью удалены** — игра всегда идёт ровно один круг (каждый игрок делает один ход). Причина: второй круг возвращается к игроку, знающему исходное слово — это ломает механику.

Что удалено:
- Проп `initialRounds` из `TelestrationsGame`
- Стейт `selectedRounds` из `TelestrationsGame`
- Блок "Раунды цепочки" из `TelestrationsSetup`
- Блок `currentGameId === GameKey.Telestrations && setRounds` из `UniversalGameSettings`
- `initialRounds={rounds}` из `App.tsx`

Конец игры: `currentRound === shuffledPlayers.length - 1` (одна полная цепочка).

---

## ConnectFour — особенности (2026-05-26)

**GameKey:** `ConnectFour = 'connect_four'`  
**GameStatus:** `ConnectFourPlaying = 'connect_four_playing'`  
**minPlayers:** 2, **players:** `'2'` (строго два игрока)  
**Тема:** `red` (P1 красный, P2 жёлтый)  
**Иконка:** `LayoutGrid`

Игра не использует `contentService` — вся логика inline в `ConnectFourGame.tsx`.  
Использует `canvas-confetti` при победе (отдельный npm-пакет).

### Режимы (GameModeOption)
| id | Поле | Описание |
|----|------|---------|
| `classic` | 7×6, WIN=4 | Классика |
| `large` | 9×7, WIN=4 | Большое поле |
| `connect_five` | 9×7, WIN=5 | Пять в ряд |
| `pop_out` | 7×6, WIN=4 | Pop Out — вытащи нижнюю фишку своего цвета |

### Pop Out механика
- Два действия за ход: `place` (поставить) или `pop` (вытащить снизу свою фишку).
- Кнопки переключения режима действия показываются только в режиме `pop_out`.
- `canPopCol(col)` — нижняя фишка в столбце принадлежит текущему игроку.
- После `pop` действие автоматически сбрасывается в `place`.

### Сброс при смене режима
`useEffect([mode])` сбрасывает всё состояние (доску, счёт, ход) при изменении `mode` из контекста.

### Очки
Хранятся в `useState` внутри компонента — не персистятся, живут только в рамках сессии.