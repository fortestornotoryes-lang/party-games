# Conventions

Комментарии в коде — на русском. Магические литералы выносить в константы.

## Const-объект вместо enum (везде)

TS `enum` в проекте запрещён. Паттерн (`src/shared/types/index.ts`):

```ts
export const DIFFICULTY = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' } as const;
export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
```

Так же сделаны `GameKey`, режимы игр (`*_MODES` в constants.ts игры). Фазы игры — тот же паттерн, объявляются в `./types.ts` игры. Встреченный enum или строковые литералы-фазы — переписывать на паттерн.

## Настройки игры (difficulty / mode / rounds / timer)

- Читаются через `useGameSettings()` (`entities/game/model/GameSettingsContext.tsx`)
- Дефолты — `DEFAULT_GAME_CONFIG` там же (+ `GAME_DEFAULT_ROUNDS` для исключений)
- Сеттеры контекста сами персистят конфиг per-game: `storageService.saveGameConfig(gameId)` → ключ `party_app_settings_<gameId>`. Вручную сохранять не нужно.
- Декларативные доп. настройки (кнопки в Setup) описываются в `settings` записи реестра и рендерятся `UniversalGameSettings`

## Персистенция партии (переживает F5)

- `sessionService` (`shared/services/`) — ключ `party_app_session_<gameKey>`, хранит `players` + произвольные `fields`
- В компонентах игр — `usePersistedState(gameKey, field, initial, codec?)` как drop-in замена useState; для Set/Map передавать codec
- Жизненный цикл: Setup при старте очищает сессию; `syncPlayers` в GamePlayRoute сбрасывает её при смене состава. Таймеры — `useTimer`/`useCountdown` (`shared/hooks`)

## Контент и словари

- Пулы контента: `shared/helpers/contentPool.ts` — `availableFromPool` / `drawFromPool` / `drawBatchFromPool`. Used-слова хранятся per-gameId в `storageService`, при исчерпании пул автосбрасывается. Не выбирать слова вручную мимо этих хелперов.
- Кастомные слова: общие (`getCustomWords(gameId)`) + привязанные к сложности через keyed-хранилище (`getCustomWordsByKey('<gameId>_<difficulty>')`); объединение — `getAllCustomWords`
- Контент игры — `content.ts` или `contents/` в папке игры, разбит по `Difficulty`

## i18n

`shared/i18n/` — контекст с ru/en словарями (`ru.ts`, `en.ts`, ключи в `keys.ts`), интерполяция `{{var}}`. Язык хранится в настройках (`storageService`). Часть игрового контента и UI-строк пока захардкожена по-русски — при рефакторинге переносить в словари.

_Ревизия: 2026-07-06_