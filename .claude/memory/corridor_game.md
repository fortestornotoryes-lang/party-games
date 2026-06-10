---
name: corridor-game
description: "Архитектура игры «Коридор» (Quoridor) — SVG-доска, механика стен, BFS-валидация"
metadata:
  type: project
---

**GameKey:** `Corridor = 'corridor'`
**GameStatus:** `CorridorPlaying = 'corridor_playing'`
**minPlayers:** 2, **players:** `'2'` (строго два игрока)
**Тема:** `teal` (P1 бирюзовый #14b8a6, P2 оранжевый #ff8a1f)
**Иконка:** `Route` (lucide-react)

## Файлы (после разбиения god-компонента, 2026-06-10)

- `types.ts` — `CorridorPhase`, `Pos`, `WallGrid`, `ActionMode`
- `constants.ts` — `CELL`, `GAP`, `STEP`, `BOARD_SZ`, `WALLS_INIT`, `PLAYER_COLOR`
- `helpers.ts` — чистая логика: `emptyWalls`, `isBlocked`, `validMoves`, `canReach` (BFS), `canPlaceWall` (PORTABLE для RN)
- `components/CorridorBoard.tsx` — SVG-доска (клетки, слоты стен, стены, фишки) + тип `HoveredSlot`
- `components/PlayerStatusBar.tsx`, `components/ActionControls.tsx`, `components/GameOverOverlay.tsx`
- `CorridorGame.tsx` — корень: persisted-состояние + обработчики ходов/стен

## Доска

SVG с viewBox `0 0 440 440`:
- `CELL = 40`, `GAP = 10`, `STEP = 50`
- Клетки 9×9; стены хранятся в 8×8 булевых сетках (`hWalls`, `vWalls`)

## Логика стен

`hWalls[r][c]` — горизонтальная стена между строками r↔r+1, перекрывает столбцы c и c+1.
`vWalls[r][c]` — вертикальная стена между столбцами c↔c+1, перекрывает строки r и r+1.

**Проверка прохода** `isBlocked(r1,c1,r2,c2,hW,vW)`:
- Вверх: `hW[r2][c1] || (c1>0 && hW[r2][c1-1])`
- Вниз: `hW[r1][c1] || (c1>0 && hW[r1][c1-1])`
- Влево: `vW[r1][c2] || (r1>0 && vW[r1-1][c2])`
- Вправо: `vW[r1][c1] || (r1>0 && vW[r1-1][c1])`

**Валидность размещения** — нельзя перекрываться (|idx - idx'| < 2 в одном ряду/столбце) и пересекаться (hWall и vWall в одной клетке). После размещения BFS проверяет, что оба игрока имеют путь к цели.

## Прыжок через соперника

Если соперник стоит рядом и за ним свободно — прыжок прямо. Если стена/край — прыжок по диагонали (влево/вправо или вверх/вниз от соперника).

## ActionMode (3 режима в UI)

| Режим | Кнопка | Действие |
|-------|--------|---------|
| `move` | Ход | Подсвечивает допустимые ходы; тап по клетке |
| `wall_h` | Стена ─ | Показывает горизонтальные слоты; тап ставит стену |
| `wall_v` | Стена │ | Показывает вертикальные слоты; тап ставит стену |

**Why:** SVG выбран вместо CSS-grid, потому что стены нужно точно позиционировать в зазорах между клетками.
**How to apply:** Логику стен/ходов менять в `helpers.ts` (чистые функции, без contentService/storageService); рендер доски — в `components/CorridorBoard.tsx`; состояние и обработчики — в `CorridorGame.tsx`.