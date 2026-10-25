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
  games/      — 21 игра, по папке на игру
  shared/     — components, helpers, hooks, i18n, services, theme, types
  debug/      — инструменты балансировки (bunkerBalance)
```

## Роутинг и жизненный цикл игры

Маршруты: `/` (меню) → `/game/:gameKey/setup` (Setup: инструкции + игроки + настройки) → `/game/:gameKey/play`. Прочее: `/settings`, `*` → `/`. Только в dev: `/design-lab` (`pages/design-lab/`) — витрина 3 дизайн-вариантов общих экранов (передача телефона, показ слова, выбор слова, команды) на демо-данных; после выбора варианта перенести его в shared/features и удалить лабораторию вместе с маршрутом.

- Игроки передаются из Setup через navigation state; при прямом заходе/F5 берутся из `storageService.getPlayers()`. Если игроков меньше `minPlayers` — redirect на setup (`GamePlayRoute.tsx`).
- Setup при «Начать игру» очищает сессию партии; `sessionService.syncPlayers` в GamePlayRoute инвалидирует сессию при смене состава.

## GameRegistry — единая точка описания игр

- `src/entities/game/types.ts` — `GameKey` (const-объект), `GameMetadataDef` (структура: theme, min/maxPlayers, `modes`, `settings`, `hasDifficulty`, `difficultySublabel(d, remaining, t)`) и `GameMetadata` (+ локализованные title/subtitle/description/placeholder)
- `src/entities/game/registry.tsx` — `GAMES_REGISTRY`: только структура; все тексты — в словарях i18n `registry.games.<gameKey>`; локализация — `useLocalizedGame(s)` (`entities/game/useLocalizedGame.ts`)
- `src/entities/game/instructions.ts` — инструкции ru + en, выбор через `getGameInstructions(gameKey, lang)`
- `src/pages/game/GamePlayRoute.tsx` — lazy-импорты + `GAME_COMPONENTS`: все игры рендерятся одним маппингом с общим контрактом `GameComponentProps` (`entities/game/types.ts`) — `playerNames`, `onBack` + опциональные `onRestart` (Bunker), `initialDifficulty` (Telestrations); особых веток нет

## Перенос на React Native (все 18 игр перенесены, этап 7 в работе)

Детальный план и полная история по партиям — `docs/react-native-migration.md`. RN-проект — папка **`mobile-app/` внутри этого репо** (решение 2026-07-30). Стек: Expo SDK 57 + expo-router + NativeWind v4 + MMKV + moti + `@shopify/react-native-skia` (рисование) + `react-native-gesture-handler`/`reanimated` (жесты, доски).

- Фундамент (этапы 0–3, 2026-07-30): shared-ядро, UI-кит (витрина `/showcase`), каркас приложения (меню/настройки/Setup/play-роут). Игры рендерятся через `GAME_COMPONENTS` (`app/game/[gameKey]/play.tsx`); расходуемый контент игры регистрируется в `contentService.WORD_POOLS`.
- Все 18 игр (этапы 4–6, 2026-07-31): «Рецепт переноса игры» — в `mobile-app/README.md`. Ключевые паттерны, зафиксированные по ходу переноса:
  - enum фаз (веб) → const-объект **с теми же строковыми значениями** (иначе рвётся восстановление персистентных сессий); `AnimatePresence` из moti с `exitBeforeEnter` (не `mode="wait"` — framer-motion 6 внутри moti).
  - Сетки без CSS grid (Codenames, Decrypto, MemoRisk, ConnectFour) — `flex-row flex-wrap` + `width: '<100/n>%'` на ячейке.
  - Доски/раздача ролей — `features/role-distribution` (RN-API: `gradientColors`/`glowColor` вместо tailwind-градиентов) переиспользуют SpyHunt, Resistance, FakeArtist.
  - Интерактивные доски: `react-native-svg` (Corridor — пешки на `useSharedValue`+`useAnimatedProps` spring), `react-native-gesture-handler` (Wavelength — слайдер на `Gesture.Pan`; `GestureHandlerRootView` уже стоял в `app/_layout.tsx` с этапа 0). Hover-эффекты (призрак колонки, подсветка слота) везде опущены — на тач-устройствах нет аналога.
  - Рисование (FakeArtist, Telestrations) — `DrawingCanvas` переписан на Skia: штрихи как массив точек, каждый — `<Path>`; undo = pop последнего; экспорт кадра — `canvasRef.makeImageSnapshot().encodeToBase64()` → тот же формат dataURL, что и веб `canvas.toDataURL()`. `@shopify/react-native-skia` **требует нативной пересборки dev build** после установки — не работает в Expo Go.
- localStorage заменён адаптером `mobile-app/src/shared/services/kvStorage.ts` (MMKV, синхронный) — API сервисов не менялся. MMKV/Skia **не работают в Expo Go**, только dev build.
- Этап 7 (полировка, 2026-07-31, частично): брендинг (иконка/adaptive-icon/сплэш/favicon) сгенерирован из существующего веб-лого `public/icon.svg` через `mobile-app/scripts/generateAppIcons.mjs` (sharp) — своего лого у RN-проекта не было, переиспользован веб-бренд «Party Hub». `app.json`: `name` → «Party Hub», `userInterfaceStyle: dark`, фон сплэша/adaptive-icon — тёмный бренд-цвет вместо дефолтного Expo-синего. `useKeepAwake()` подключён в `app/game/[gameKey]/play.tsx` — экран не гаснет во время партии. Мёртвые scaffold-ассеты шаблона `create-expo-app` удалены. Остались: анимации-переходы до паритета с вебом, профилирование производительности — не сделано.
- Цвета: `mobile-app/scripts/generateTailwindColors.mjs` генерирует `tailwind.colors.json` из PREMIUM_RGB (`npm run theme:gen`, вшит в prestart) — аналог веб-`theme:gen`.
- `mobile-app/` исключён из корневого tsconfig; у него свои tsconfig/CLAUDE.md/README.
- Пока веб жив — контент-правки дублировать в оба проекта (файлы контента копируются 1:1).

## Аудит UX на мобильных

`docs/web-ux-fixes.md` — найденные и исправленные проблемы веб-версии на телефонах/планшетах (длинные слова, строки без `min-w-0`, `100vh`, рисование, safe-area, цели нажатия) + рекомендации и чеклист для RN. Правки веба, которые нужно повторить в RN, фиксируются отдельными файлами в `docs/` (примеры: `docs/web-alias-teams.md` — команды и составы в Alias; `docs/web-crocodile.md` — новая игра Крокодил, пока только веб; `docs/web-two-truths-who-among-us.md` — две новые игры, пока только веб, с чеклистом переноса; `docs/web-game-animations.md` — анимации Alias/Крокодила/Двух правд/Кто из нас, с чеклистом для RN). Игра ориентирована на телефоны и планшеты — десктопный вид не приоритет.

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

_Ревизия: 2026-10-25_