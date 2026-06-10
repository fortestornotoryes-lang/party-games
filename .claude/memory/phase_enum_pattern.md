---
name: phase-enum-pattern
description: "Паттерн: фазы игры — const-объект + производный тип в ./types.ts (НЕ enum и НЕ строковые литералы в компоненте)"
metadata:
  type: feedback
---

> ⚠️ **Обновлено 2026-06-10:** TS `enum` больше НЕ используется — пользователь выбрал паттерн «const-объект + производный тип» (см. [[code-style]]). Существующие enum'ы переписывать при первом же касании файла.

Внутренние фазы игровых компонентов (`'start'`, `'playing'`, `'round_end'` и т.п.) выносятся в `./types.ts` рядом с игрой в виде:

```ts
export const CorridorPhase = {
    Playing: 'playing',
    GameOver: 'game_over',
} as const;

export type CorridorPhase = (typeof CorridorPhase)[keyof typeof CorridorPhase];
```

Использование идентично enum: `CorridorPhase.Playing` как значение, `CorridorPhase` как тип.

**Why:** Пользователь явно попросил этого паттерна. Строковые литералы дублируются и не дают автодополнения; const-объект, в отличие от enum, не генерирует runtime-обёртку, дружит с union-литералами из данных (`difficulty: 'medium'` в контенте остаётся валидным) и с `Object.values()`.

**How to apply:**
- Новая игра → `src/games/<GameName>/types.ts` с const-объектом фаз + интерфейсами.
- Встретил `enum` при работе над файлом → переписать на const-объект с теми же именем и строковыми значениями (все call-sites `X.Member` и типовые аннотации продолжают работать, persisted-значения совместимы).

**Примеры:** `CorridorPhase`, `ActionMode` (CorridorGame/types.ts), `C4Action` (ConnectFourGame/types.ts), `DIFFICULTY` (src/types.ts).

**Ещё не переписаны (enum, ждут касания):** `GameKey` (types/games.ts), `BunkerPhase`, `TelestrationsPhase`, `AliasPhase`, `SpyHuntPhase` и прочие фазовые enum'ы игр.