---
name: session-persistence
description: "Восстановление состояния игры после перезагрузки страницы: sessionService + usePersistedState/usePersistedTimer, жизненный цикл сессии"
metadata:
  node_type: memory
  type: project
---

## Персистенция игровой сессии (2026-06-10)

Если страница перезагрузилась посреди партии, состояние восстанавливается из localStorage.

### Инфраструктура

- `src/services/sessionService.ts` — одна сессия на игру, ключ `party_app_session_{gameKey}`,
  формат `{players: string[], fields: Record<string, unknown>}`. API: `getField`, `saveField`,
  `clear`, `begin(gameKey, players)`, `syncPlayers(gameKey, players)`.
- `src/hooks/usePersistedState.ts`:
  - `usePersistedState(gameKey, field, initial, codec?)` — drop-in замена `useState`;
    восстанавливает значение при маунте, сохраняет в эффекте при каждом изменении.
    `codec` (`{save, load}`) — для `Set`/`Map` (Taboo `usedCardIds`, Millionaire `usedLifelines`).
  - `usePersistedTimer(gameKey, field, {timeLeft,start,reset}, resumeRunning)` — пишет timeLeft
    на каждом тике; при маунте в «играющей» фазе перезапускает таймер с сохранённого значения.
- `usePlayerCycle(items, state?)` — принимает вторым аргументом внешний `[idx, setIdx]`
  (из `usePersistedState`), чтобы индекс игрока переживал перезагрузку.

### Жизненный цикл

1. `GameSetupRoute.startGame` → `sessionService.begin(gameKey, playerNames)` — новая партия
   всегда с чистого листа (нельзя определять «новую игру» по `location.state` — history.state
   переживает reload).
2. Игра пишет состояние через `usePersistedState` по ходу партии.
3. `GamePlayRoute` перед маунтом игры вызывает `sessionService.syncPlayers` — сбрасывает
   сессию, если состав игроков изменился.

### Правила подключения игры

- Все значимые `useState` главного компонента → `usePersistedState` (phase, scores, card, board…).
- Init-эффекты (`initGame`, раздача ролей, shuffle команд) обязаны иметь guard
  `if (восстановлено) return;` (`players.length > 0`, `redState !== null`, `cards.length > 0`),
  иначе перетрут восстановленное состояние.
- Транзиентное состояние НЕ персистится: hover, isDrawing, currentStroke, lastActionMsg, guess-инпут.
- Telestrations: фаза `Action` при load маппится в `Transition` (codec у phase) — рисунок
  на холсте не сохранить, ход начинается заново; слово не пере-выбирается, если
  `initialWord` уже в сессии.
- ConnectFour: режим хранится в сессии (`mode`), сброс доски — только при реальной смене режима.
- Mafia — заглушка, без персистенции.

**How to apply:** новая игра (skill `new-game`) должна сразу использовать `usePersistedState`
для всех состояний партии и guard'ить init-эффекты. См. [[project-overview]], [[hooks-and-patterns]].