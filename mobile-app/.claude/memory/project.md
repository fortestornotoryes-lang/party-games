# Project Overview

React Native порт веб-версии Party Games — офлайн party-игры «в одном телефоне» (pass-the-phone), 18 игр.
Весь стейт — MMKV (синхронное key-value хранилище), бэкенда нет.

Пока живёт внутри монорепо `party-games/`: веб-версия — в корне репозитория, план и история переноса —
`../docs/react-native-migration.md`. При выделении `mobile-app` в отдельный репозиторий эта ссылка и
договорённость «дублировать контент-правки в оба проекта» (см. conventions.md) станут неактуальны — см.
правило 6 в MEMORY.md.

## Стек и команды

- Expo SDK 57 (RN 0.86, New Architecture), expo-router (file-based роутинг)
- NativeWind v4 (Tailwind 3-конфиг), MMKV (`react-native-mmkv`) — синхронная замена localStorage
- Анимации: `moti`/`reanimated`, иконки: `lucide-react-native`, вибрация: `expo-haptics`
- Жесты: `react-native-gesture-handler`, интерактивные доски: `react-native-svg`, рисование: `@shopify/react-native-skia`
- `npm start` — Metro (сначала прогоняет `theme:gen`); `npm run typecheck` — tsc --noEmit
- **MMKV и Skia не работают в Expo Go** — только dev build: `npx expo run:android`, либо EAS (`npx eas build --profile development`); для iOS без Mac — только EAS. После установки/апдейта `@shopify/react-native-skia` нужна нативная пересборка dev build.

## Структура (FSD-подобная, повторяет веб)

```
src/
  app/        — expo-router: тонкие обёртки, реальный экран рендерит widgets/*
  entities/   — game (registry, types, instructions, GameSettingsContext), player
  features/   — game-settings, role-distribution, taboo-pass, word-stats
  games/      — 18 игр, по папке на игру (phases/ или components/ внутри)
  shared/     — components (UI-кит), helpers, hooks, i18n, services, theme, types, nativewindInterop.ts
  widgets/    — main-menu, setup, settings
```

## Роутинг и жизненный цикл игры

`app/game/[gameKey]/play.tsx` — lazy-импорты + `GAME_COMPONENTS`: все игры рендерятся одним маппингом
с общим контрактом `GameComponentProps` (`entities/game/types.ts`) — `playerNames`, `onBack` + опциональные
`onRestart` (Bunker), `initialDifficulty` (Telestrations). `useKeepAwake()` подключён в этом роуте — экран
не гаснет во время партии.

## GameRegistry — единая точка описания игр

- `src/entities/game/types.ts` — `GameKey` (const-объект), `GameMetadataDef`/`GameMetadata`
- `src/entities/game/registry.tsx` — `GAMES_REGISTRY`: только структура (иконка, тема, лимиты игроков, режимы, настройки); все тексты — в словарях i18n `registry.games.<gameKey>`, локализация через `useLocalizedGame(s)`
- `src/entities/game/instructions.ts` — инструкции ru + en, `getGameInstructions(gameKey, lang)`
- Расходуемый контент игры регистрируется в `WORD_POOLS` (`src/features/word-stats/model/contentService.ts`)

## Бэклог архитектурных улучшений

`mobile-app/docs/improvements-todo.md` — найденные архитектурные проблемы; на 2026-08-16 остался только
`as unknown as` в i18n. (Разделение `GameSettingsContext`, унификация таймер-хуков, консолидация
составного состояния раунда в Decrypto/Millionaire/Codenames — исправлены, см. conventions.md и gotchas.md.)

## Статус переноса

Все 18 игр перенесены (этапы 0–6 веб-миграции выполнены). Брендинг (иконка/сплэш из веб-лого «Party Hub»)
сделан. Не сделано: анимации-переходы до полного паритета с вебом, профилирование производительности,
сборка и публикация в сторы (этап 8 плана миграции).

**Звук и конфетти не реализованы** (найдено при аудите 2026-08-16): `feedbackService.celebrate`/`fireworks`/`playSound` (`src/shared/services/feedbackService.ts`) — пустые заглушки с `TODO(этап 2/7)`/`TODO(этап 7)`, при этом вызовы уже расставлены в 18+ играх. Реально работает только `vibrate` (через `expo-haptics`). См. подробности и файлы — `gotchas.md`.

## Рецепт переноса игры из веба

Подробный пошаговый рецепт (конвертация enum→const-объект, `motion/react`→`moti`, стили, иконки, доски/сетки/рисование, чек-лист проверки) — `mobile-app/README.md`, раздел «Рецепт переноса игры». Актуален, пока веб-версия остаётся источником для переноса контента/логики.

## Субагенты и скиллы

`../.claude/agents/` (корень репо, общие для веб и mobile): `logic-test-writer` (vitest-тесты для чистой логики helpers), `content-reviewer` (read-only ревью контент-пулов). `../.claude/skills/new-game` — чек-лист добавления новой игры (шаги те же, что и в вебе, плюс регистрация в `GAME_COMPONENTS`/`WORD_POOLS` этого проекта — см. выше). При выделении в отдельный репозиторий эти агенты/скиллы нужно скопировать в `mobile-app/.claude/` — сейчас переиспользуются из корня.

## Чек-лист новой игры (адаптация под mobile-app)

1. Папка `src/games/<Name>Game/`: `types.ts` (фазы — const-объект с теми же строковыми значениями, что в вебе), `constants.ts`, `content.ts`/`contents/`, `helpers.ts`, компонент `<Name>Game.tsx` с пропсами `{ playerNames, onBack }`, фазы в `phases/`/`components/`
2. `GameKey` в `entities/game/types.ts`
3. Запись в `GAMES_REGISTRY` (registry.tsx) — только структура
4. Тексты в i18n-словари `registry.games.<gameKey>` (ru.ts и en.ts) + неймспейс игры
5. Инструкции в `entities/game/instructions.ts` (`GAME_INSTRUCTIONS`/`GAME_INSTRUCTIONS_EN`)
6. Lazy-импорт + запись в `GAME_COMPONENTS` (`src/app/game/[gameKey]/play.tsx`)
7. Если контент расходуемый — пул в `WORD_POOLS` (`src/features/word-stats/model/contentService.ts`)
8. Персистенция через `usePersistedState`/`usePersistedTimer` (см. conventions.md)
9. `npm run typecheck` + смоук на dev build (не Expo Go!): все фазы, таймер/вибрация/конфетти, «Стоп»/реванш, kill-and-relaunch посреди раунда — фаза и остаток таймера должны восстановиться

_Ревизия: 2026-08-16_
