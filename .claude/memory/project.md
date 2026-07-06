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

- `src/entities/game/types.ts` — `GameKey` (const-объект), `GameMetadata` (title, theme, min/maxPlayers, `modes`, декларативные `settings`, `hasDifficulty`, `difficultySublabel`)
- `src/entities/game/registry.tsx` — `GAMES_REGISTRY`: метаданные всех игр (карточка меню, Setup, настройки рендерятся из него)
- `src/entities/game/instructions.ts` — инструкции по играм
- `src/pages/game/GamePlayRoute.tsx` — lazy-импорты + `GAME_COMPONENTS`: все игры рендерятся одним маппингом с общим контрактом `GameComponentProps` (`entities/game/types.ts`) — `playerNames`, `onBack` + опциональные `onRestart` (Bunker), `initialDifficulty` (Telestrations); особых веток нет

## Перенос на React Native (план, работа не начата)

Детальный план — `docs/react-native-migration.md`. Принятые решения (2026-07-06): Expo (dev build, не Expo Go), **отдельный RN-проект** `party-games-native` (не монорепо), iOS + Android, NativeWind, MMKV вместо localStorage, Skia для рисования. Пока веб жив — контент-правки дублировать в оба проекта.

## Чек-лист новой игры

1. Папка `src/games/<Name>Game/`: `types.ts` (фазы — см. conventions.md), `constants.ts`, `content.ts`/`contents/` (если есть контент), `helpers.ts`, компонент `<Name>Game.tsx` с пропсами `{ playerNames, onBack }`, фазы в `phases/` или `components/`
2. `GameKey` в `entities/game/types.ts`
3. Запись в `GAMES_REGISTRY` (registry.tsx) — иконка, тема, описание, режимы/настройки
4. Инструкции в `entities/game/instructions.ts`
5. Lazy-импорт + запись в `GAME_COMPONENTS` в `GamePlayRoute.tsx`
6. Персистенция партии через `usePersistedState` (см. conventions.md), контент через пул-хелперы

_Ревизия: 2026-07-06_