---
name: code-style
description: "Стиль кода: никаких магических литералов в логике; const-объект + производный тип ВМЕСТО enum; встреченные enum'ы переписывать"
metadata:
  type: feedback
---

Пользователю не нравятся магические литералы в коде (`'medium'`, `'classic'`, `'place'`, `'move'` и т.п.) и TS `enum`.

**Why:** Литералы разбросаны по коду, дублируются и не самодокументируются. Enum пользователь явно отверг (2026-06-10) в пользу структуры ниже: она не генерирует runtime-обёртку, совместима с литералами в данных и `Object.values()`.

**How to apply:**

Канонический паттерн — const-объект + производный тип (имя совпадает):

```ts
export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
```

- Режимы/фазы/варианты → const-объект в `types.ts` (см. [[phase-enum-pattern]]): `DIFFICULTY` (src/types.ts), `C4Action`, `ActionMode`, `CorridorPhase`, `CONNECT_FOUR_MODES`, `SPY_HUNT_MODES`.
- Дефолты → именованная константа в одном месте: `DEFAULT_GAME_CONFIG` (GameSettingsContext.tsx), `CLASSIC_MODE_ID` (types/games.ts).
- Списки всех значений → `Object.values(DIFFICULTY)`, не `['easy', 'medium', 'hard']`.
- **Встретил `enum` при работе — переписать** на const-объект с теми же именем/значениями (call-sites и persisted-данные совместимы). Не переписаны пока: `GameKey`, `BunkerPhase`, `TelestrationsPhase`, `AliasPhase`, `SpyHuntPhase` и др.
- НЕ трогать литералы-данные в `src/constants/*` (`difficulty: 'medium'` в тысячах строк контента) — union-тип их проверяет.