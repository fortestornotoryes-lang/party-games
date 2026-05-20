---
name: truth-or-dare-plan
description: "Запланированная игра Правда или Действие — архитектура, файлы, статус реализации"
metadata:
  type: project
---

## Статус

**Реализована** (2026-05-20).

## Архитектура игры

**Тема:** `red` / `border-premium-red/30 text-premium-red`  
**Иконка:** `Flame` из lucide-react  
**GameKey:** `TruthOrDare = 'truth_or_dare'`  
**GameStatus:** `TruthOrDarePlaying = 'truth_or_dare_playing'`  
**minPlayers:** 2  
**players:** `'2+'`

## Файлы для создания

| Файл | Описание |
|------|---------|
| `src/constants/truthOrDareContent.ts` | Массивы правд и действий по сложностям (easy/medium/hard) |
| `src/games/TruthOrDareGame/types.ts` | `TruthOrDarePhase` enum |
| `src/games/TruthOrDareGame/TruthOrDareGame.tsx` | Основной компонент |

## Файлы для изменения

| Файл | Что добавить |
|------|-------------|
| `src/types.ts` | `TruthOrDarePlaying = 'truth_or_dare_playing'` в `GameStatus` |
| `src/types/games.ts` | `TruthOrDare = 'truth_or_dare'` в `GameKey` |
| `src/registry/GameRegistry.tsx` | lazy import + запись в `GAMES_REGISTRY` + экспорт |
| `src/App.tsx` | `case GameStatus.TruthOrDarePlaying` в `renderGame()` |
| `src/constants/instructions.ts` | Инструкции для `GameKey.TruthOrDare` |

## Игровой поток (фазы)

```
TruthOrDarePhase.Pass    → PassPhoneCard "[Имя игрока]", badge "Правда или Действие"
TruthOrDarePhase.Choice  → Два блока: ПРАВДА (sky) / ДЕЙСТВИЕ (red)
TruthOrDarePhase.Action  → Текст вызова + кнопка "Выполнено"
→ следующий игрок → Phase.Pass  (бесконечный цикл, выход через кнопку назад)
```

## Контент

Берётся через `useGameSettings().difficulty`.  
Структура: `TRUTHS_BY_DIFFICULTY` и `DARES_BY_DIFFICULTY` — `Record<'easy'|'medium'|'hard', string[]>`.  
Использованные задания отслеживать через `useRef(new Set<number>())` — сброс при исчерпании пула.

## Дизайн

- Truth: цвет `premium-sky` (холодный — честность)
- Dare: цвет `premium-red` (горячий — риск)
- GameHeader themeColor: `"border-premium-red/30 text-premium-red"`
- Никакого экрана Setup внутри игры — сложность берётся из `useGameSettings()`