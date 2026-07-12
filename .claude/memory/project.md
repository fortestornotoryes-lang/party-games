# Project Overview

Оффлайн party-игры «в одном телефоне» (pass-the-phone). SPA, PWA, всё состояние в localStorage — бэкенда нет (express в deps только для preview-сервера).

## Стек и команды

- React 19 + TypeScript ~5.8 + Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`, токены в `src/app/styles/index.css`)
- Анимации: `motion` v12 (импорт из `motion/react`), иконки: `lucide-react`, конфетти: `canvas-confetti`
- Роутинг: `react-router` v7 (data router, `createBrowserRouter`)
- `npm run dev` — dev-сервер на порту 3333; `npm run lint` — eslint + tsc --noEmit; `npm run lint:fix`
- База URL — `/party-games/` (vite.config.ts), в роутере учтена через `basename`

## Структура (FSD-подобная)

```
src/
  app/        — App, main, router/routes.tsx, styles/index.css
  pages/      — menu, settings, game (GameLayout, GameSetupRoute, GamePlayRoute)
  widget/     — main-menu, setup, settings
  features/   — game-settings, role-distribution, taboo-pass, word-stats
  entities/   — game (registry, types, instructions, GameSettingsContext), player
  games/      — 18 игр, по папке на игру
  shared/     — components, helpers, hooks, i18n, services, theme, types
  debug/      — инструменты балансировки (bunkerBalance)
```

## Роутинг и жизненный цикл игры

Маршруты: `/` (меню) → `/game/:gameKey/setup` (Setup: инструкции + игроки + настройки) → `/game/:gameKey/play`. Прочее: `/settings`, `*` → `/`.

- Игроки передаются из Setup через navigation state; при прямом заходе/F5 берутся из `storageService.getPlayers()`. Если игроков меньше `minPlayers` — redirect на setup (`GamePlayRoute.tsx`).
- Setup при «Начать игру» очищает сессию партии; `sessionService.syncPlayers` в GamePlayRoute инвалидирует сессию при смене состава.

## GameRegistry — единая точка описания игр

- `src/entities/game/types.ts` — `GameKey` (const-объект), `GameMetadataDef` (структура: theme, min/maxPlayers, `modes`, `settings`, `hasDifficulty`, `difficultySublabel(d, remaining, t)`) и `GameMetadata` (+ локализованные title/subtitle/description/placeholder)
- `src/entities/game/registry.tsx` — `GAMES_REGISTRY`: только структура; все тексты — в словарях i18n `registry.games.<gameKey>`; локализация — `useLocalizedGame(s)` (`entities/game/useLocalizedGame.ts`)
- `src/entities/game/instructions.ts` — инструкции ru + en, выбор через `getGameInstructions(gameKey, lang)`
- `src/pages/game/GamePlayRoute.tsx` — lazy-импорты + `GAME_COMPONENTS`: все игры рендерятся одним маппингом с общим контрактом `GameComponentProps` (`entities/game/types.ts`) — `playerNames`, `onBack` + опциональные `onRestart` (Bunker), `initialDifficulty` (Telestrations); особых веток нет

## Перенос на React Native (план, работа не начата)

Детальный план — `docs/react-native-migration.md`. Принятые решения (2026-07-06): Expo (dev build, не Expo Go), **отдельный RN-проект** `party-games-native` (не монорепо), iOS + Android, NativeWind, MMKV вместо localStorage, Skia для рисования. Пока веб жив — контент-правки дублировать в оба проекта.

## Субагенты

В `.claude/agents/`: `logic-test-writer` (vitest-тесты для чистой логики helpers; vitest ставит сам при первом запуске) и `content-reviewer` (read-only ревью контент-пулов). При смене конвенций контента/тестов — обновлять их промпты.

## Чек-лист новой игры

Оформлен как скилл `/new-game` (`.claude/skills/new-game/SKILL.md`) — при добавлении игры вызывать его; при смене чек-листа обновлять и скилл, и этот раздел.

1. Папка `src/games/<Name>Game/`: `types.ts` (фазы — см. conventions.md), `constants.ts`, `content.ts`/`contents/` (если есть контент), `helpers.ts`, компонент `<Name>Game.tsx` с пропсами `{ playerNames, onBack }`, фазы в `phases/` или `components/`
2. `GameKey` в `entities/game/types.ts`
3. Запись в `GAMES_REGISTRY` (registry.tsx) — только структура: иконка, тема, лимиты, режимы/настройки (id + иконки)
4. Тексты игры в словари i18n: `registry.games.<gameKey>` (title/subtitle/description/placeholder/modes/settings) в `ru.ts` **и** `en.ts` + неймспейс игры для внутриигровых строк
5. Инструкции в `entities/game/instructions.ts` — в оба словаря: `GAME_INSTRUCTIONS` (ru) и `GAME_INSTRUCTIONS_EN`
6. Lazy-импорт + запись в `GAME_COMPONENTS` в `GamePlayRoute.tsx`
7. Персистенция партии через `usePersistedState` (см. conventions.md), контент через пул-хелперы

_Ревизия: 2026-07-12_