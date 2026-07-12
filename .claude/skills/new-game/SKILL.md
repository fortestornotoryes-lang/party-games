---
name: new-game
description: Добавление новой party-игры в проект — создание папки игры, регистрация в GameRegistry, роутинг, инструкции, персистенция. Использовать, когда пользователь просит добавить/создать новую игру.
---

# Добавление новой игры

## Шаг 0 — уточнить у пользователя (если не сказано)

- Правила игры и игровой цикл (фазы, кто что видит на «одном телефоне»)
- Мин/макс игроков
- Нужны ли: режимы, сложность, раунды, таймер, контент-пул (слова/задания)
- Название (ru + en), иконка (lucide), тема оформления

## Шаг 1 — прочитать конвенции

Обязательно перед кодом прочитать из `.claude/memory/`:
- `conventions.md` — const-объект вместо enum, фазы, настройки, персистенция, контент-пулы, feedbackService, i18n
- `ui.md` — темы, glass-card, общие компоненты, анимации
- `gotchas.md` — известные грабли

Как образец смотреть существующую игру похожего типа в `src/games/` (например, `JustOneGame` — простая игра с фазами и контентом).

## Шаг 2 — папка игры `src/games/<Name>Game/`

```
<Name>Game/
  types.ts          — фазы игры (const-объект, НЕ enum), доменные типы
  constants.ts      — константы, режимы (<NAME>_MODES), магические числа
  content.ts        — контент-пул по Difficulty (или contents/ если объёмный)
  helpers.ts        — чистая игровая логика (тестируемая, без React)
  <Name>Game.tsx    — корневой компонент, пропсы GameComponentProps: { playerNames, onBack }
  phases/           — компонент на каждую фазу (или components/)
```

- Состояние партии — через `usePersistedState(gameKey, field, initial, codec?)`, чтобы переживало F5 (для Set/Map нужен codec)
- Слова/задания брать только через пул-хелперы `shared/helpers/contentPool.ts`
- Звук/вибрация/конфетти — только через `feedbackService`
- Таймеры — `useTimer` / `useCountdown` из `shared/hooks`
- Комментарии в коде — на русском

## Шаг 3 — регистрация (6 точек, все обязательны)

1. `src/entities/game/types.ts` — ключ в const-объект `GameKey`
2. `src/entities/game/registry.tsx` — запись в `GAMES_REGISTRY`: **только структура** — иконка, theme, min/maxPlayers, `modes` (id + иконки), декларативные `settings` (key + значения опций), `hasDifficulty`. Никаких текстов в реестре!
3. Словари i18n `src/shared/i18n/ru.ts` **и** `en.ts` — тексты игры в `registry.games.<gameKey>` (title/subtitle/description/placeholder + name/description режимов + label/options настроек, ключи опций — `String(value)`) и отдельный неймспейс игры для внутриигровых строк (тип — в `types.ts`, неймспейс — в `keys.ts`). UI-компоненты берут локализованные метаданные через `useLocalizedGame`
4. `src/entities/game/instructions.ts` — инструкции для экрана Setup в оба словаря: `GAME_INSTRUCTIONS` (ru) и `GAME_INSTRUCTIONS_EN`
5. `src/pages/game/GamePlayRoute.tsx` — lazy-импорт + запись в `GAME_COMPONENTS`
6. Настройки (difficulty/mode/rounds/timer) читать через `useGameSettings()` — персистятся сами, вручную не сохранять

Особых веток в роутинге не делать — всё рендерится единым маппингом.

## Шаг 4 — проверка

1. `npm run lint` (eslint + tsc) — должен пройти чисто
2. Прогнать игру в dev (`npm run dev`, порт 3333): карточка в меню → setup → полный игровой цикл → F5 посреди партии (состояние должно восстановиться) → «Назад»
3. Предложить пользователю запустить субагентов: `logic-test-writer` (тесты на helpers.ts) и `content-reviewer` (если добавлялся контент-пул)

## Шаг 5 — память

Обновить `.claude/memory/` при необходимости (например, число игр в project.md, новые грабли — в gotchas.md).