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

- Два раздельных контекста в `entities/game/model/GameSettingsContext.tsx` (разделены 2026-08-16, чтобы смена конфига не ре-рендерила навигационный код и наоборот): `useCurrentGame()` — `{ currentGameId, setCurrentGameId }`, только для роутов/меню (`_layout.tsx`, `index.tsx`, `MainMenu.tsx`); `useGameConfig()` — `{ difficulty, mode, rounds, timerSeconds, countHiddenTraits, set* }`, для всех игр и Setup. `setup.tsx`-роуту нужны оба. Оба провайдера объединены одним `<GameSettingsProvider>` (в `app/_layout.tsx`) — новую игру всегда подключать через `useGameConfig()`, не заводить локальные копии этих полей.
- Дефолты — `DEFAULT_GAME_CONFIG` там же (+ `GAME_DEFAULT_ROUNDS` для исключений)
- Сеттеры контекста сами персистят конфиг per-game через `storageService.saveGameConfig(gameId)` → ключ `party_app_settings_<gameId>` в MMKV. Вручную сохранять не нужно.
- Декларативные доп. настройки (кнопки в Setup) описываются в `settings` записи реестра и рендерятся `UniversalGameSettings`

## Персистенция партии (переживает kill-and-relaunch)

- `sessionService` (`shared/services/`) — ключ `party_app_session_<gameKey>` в MMKV, хранит `players` + произвольные `fields`
- В компонентах игр — `usePersistedState(gameKey, field, initial, codec?)` как drop-in замена useState; для Set/Map передавать codec
- Составное эфемерное состояние, которое всегда сбрасывается/переинициализируется группой полей разом (код раунда+подсказки+догадки в Decrypto, состояние текущего вопроса в Millionaire, состав команд/активная подсказка в Codenames) — один `usePersistedState<T>` с объектным `T`, а не N параллельных примитивных полей: так сброс — один вызов, и нельзя забыть обнулить одно из полей. Поля с независимой логикой обновления (не сбрасываются синхронно с остальными) — оставлять отдельными `usePersistedState`, не сводить искусственно в общий объект.
- Раздача ролей/раскладка при старте партии, которая не должна повториться, если состояние уже восстановлено из сессии (kill-and-relaunch) — `shared/hooks/useGameInit.ts` (`useGameInit(isRestored, initFn, deps)`), а не руками писать `useEffect` с guard-return + `eslint-disable-next-line react-hooks/exhaustive-deps` в каждой игре (используется в Alias/Codenames/Decrypto/FakeArtist/SpyHunt).
- Личный зачёт «победитель/ничья» на экране итогов партии — `shared/helpers/scoring.ts` (`getLeaderboardWinner`) + `shared/components/GameOverLeaderboard` (шапка+LeaderboardList+кнопки rematch/back), а не пересчитывать `sorted/topScore/hasWinner` в каждой игре заново. Командный/нестандартный зачёт (см. TabooReverseGame) — через проп `renderResult` компонента.
- Жизненный цикл: Setup при старте очищает сессию; `syncPlayers` в GamePlayRoute сбрасывает её при смене состава. Таймеры — только `useTimer` (`shared/hooks`, единственный таймер-хук в проекте с 2026-08-16; `useCountdown` удалён как дублирующий). API: `{ timeLeft, isActive, start, pause, reset(newTime?), setTimeLeft }`. Для условия «тикать, пока выполняется derived-условие» (не просто старт/пауза по клику) — `useEffect`, вызывающий `start()`/`pause()` при смене условия (см. `FakeArtistGame.tsx`, `TelestrationsGame.tsx`).
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
