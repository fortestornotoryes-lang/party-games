---
name: phase-enum-pattern
description: "Паттерн: фазы игры выносятся в enum в ./types.ts рядом с компонентом, не строковые литералы"
metadata:
  type: feedback
---

Внутренние фазы игровых компонентов (`'start'`, `'playing'`, `'round_end'` и т.п.) должны быть enum в файле `./types.ts` рядом с игрой, а не строковые union-литералы внутри компонента.

**Why:** Пользователь явно попросил этого паттерна. Строковые литералы дублируются по компоненту и не дают автодополнения.

**How to apply:** При создании/рефакторинге любой игры — создать `src/games/<GameName>/types.ts` с enum и интерфейсами. Импортировать enum в основном компоненте.

**Примеры:**
- `src/games/TelestrationsGame/types.ts` → `TelestrationsPhase` enum
- `src/games/AliasGame/types.ts` → `AliasPhase` enum, `Team` interface