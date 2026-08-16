# Conventions

Комментарии в коде — на русском. Магические литералы выносить в константы.

## Const-объект вместо enum (везде)

TS `enum` в проекте запрещён. Паттерн (`src/shared/types/index.ts`):

```ts
export const DIFFICULTY = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' } as const;
export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
```

Так же сделаны `GameKey`, режимы игр (`*_MODES` в constants.ts игры). Фазы игры — тот же паттерн,
объявляются в `./types.ts` игры, **со строковыми значениями, совпадающими с веб-версией** (иначе рвётся
восстановление персистентных сессий при переносе/сверке багов между проектами).

## Настройки игры (difficulty / mode / rounds / timer)

- Читаются через `useGameSettings()` (`entities/game/model/GameSettingsContext.tsx`)
- Дефолты — `DEFAULT_GAME_CONFIG` там же (+ `GAME_DEFAULT_ROUNDS` для исключений)
- Сеттеры контекста сами персистят конфиг per-game через `storageService.saveGameConfig(gameId)` → ключ `party_app_settings_<gameId>` в MMKV. Вручную сохранять не нужно.
- Декларативные доп. настройки (кнопки в Setup) описываются в `settings` записи реестра и рендерятся `UniversalGameSettings`

## Персистенция партии (переживает kill-and-relaunch)

- `sessionService` (`shared/services/`) — ключ `party_app_session_<gameKey>` в MMKV, хранит `players` + произвольные `fields`
- В компонентах игр — `usePersistedState(gameKey, field, initial, codec?)` как drop-in замена useState; для Set/Map передавать codec
- Жизненный цикл: Setup при старте очищает сессию; `syncPlayers` в GamePlayRoute сбрасывает её при смене состава. Таймеры — `useTimer`/`useCountdown` (`shared/hooks`)
- Все чтения из MMKV идут через адаптер `shared/services/kvStorage.ts` и `storageService`/`safeParseJson` — не обращаться к MMKV напрямую в компонентах

## Контент и словари

- Пулы контента: `shared/helpers/contentPool.ts` — `availableFromPool` / `drawFromPool` / `drawBatchFromPool`. Used-слова хранятся per-gameId в `storageService`, при исчерпании пул автосбрасывается. Не выбирать слова вручную мимо этих хелперов.
- Кастомные слова: общие (`getCustomWords(gameId)`) + привязанные к сложности через keyed-хранилище (`getCustomWordsByKey('<gameId>_<difficulty>')`); объединение — `getAllCustomWords`
- Контент игры — `content.ts` или `contents/` в папке игры, разбит по `Difficulty`
- Файлы с чистой логикой/контентом переносятся из веба 1:1 — пока веб жив, правки контента дублировать в оба проекта

## Эффекты (звук / вибрация / конфетти)

Только через `feedbackService` (`shared/services/`, внутри — `expo-haptics` для вибрации): `playSound`,
`vibrate` (паттерны `VIBRATE`), `celebrate(preset, overrides?)` (пресеты `CONFETTI`), `fireworks(colors?)`
(возвращает cancel — вернуть из useEffect). Не вызывать `expo-haptics`/звуковые API напрямую в компонентах
и не проверять `settings.visualEffects` в callsite'ах — сервис делает это сам.

## i18n

`shared/i18n/` — контекст с ru/en словарями (`ru.ts`, `en.ts`, ключи в `keys.ts`), интерполяция `{{var}}`.
Язык хранится в настройках (`storageService`).

- Тексты реестра игр (title/subtitle/description/режимы/настройки) — в `registry.games.<gameKey>`; статический `GAMES_REGISTRY` хранит только структуру. Локализованные метаданные — через `useLocalizedGame`/`useLocalizedGames` (`entities/game/useLocalizedGame.ts`); `difficultySublabel` принимает `t` третьим аргументом.
- Инструкции игр: `GAME_INSTRUCTIONS` (ru) + `GAME_INSTRUCTIONS_EN` в `entities/game/instructions.ts`, выбор — `getGameInstructions(gameKey, lang)`.
- Не переводится намеренно: контент-пулы (слова/вопросы/персонажи Бункера — русский игровой контент), секция «Язык / Language» (двуязычная по дизайну), комментарии в коде.

_Ревизия: 2026-08-16_
