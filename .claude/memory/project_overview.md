---
name: project-overview
description: "Стек, запуск, структура папок и архитектура Party Hub — мобильного хаба настольных игр"
metadata: 
  node_type: memory
  type: project
  originSessionId: d3ec9307-4021-49f9-822a-9589555ac09e
---

## Стек

| Слой | Технология |
|------|-----------|
| Фреймворк | React 19 |
| Сборщик | Vite 6 |
| Стили | Tailwind CSS v4 (`@import "tailwindcss"`, без tailwind.config) |
| Анимации | `motion/react` (пакет называется `motion`, НЕ `framer-motion`) |
| Иконки | lucide-react |
| Язык | TypeScript 5.8 |

## Запуск

```bash
npm run dev      # Vite dev server на порту 3000, host 0.0.0.0
npm run build    # Сборка в dist/
```

## Структура папок

Идёт миграция на FSD (июнь 2026). Этапы 1 (shared), 2 (entities), 3 (app + pages), 4 (constants → слайсы игр) и 5 (features + widget, `src/components/` удалён) выполнены. Импорты — через alias `@/...` (alias `@/* → src/*` в tsconfig+vite), баррелей нет — импорты напрямую в модуль (заглушек `index.ts` в features/widget больше нет). Конвенции слайсов: сегмент `components` (не `ui`), `types.ts` в корне слайса; слайс на компонент — папка `<slice>/components/<Component>.tsx`; в играх объёмный контент (слова/карточки/вопросы) — `content.ts` в корне слайса, конфиг, нужный снаружи (`*_MODES`, `*_DIFFICULTY_CONFIG`, `*_ROLE_IDS`), — `constants.ts` (исключение: BunkerGame держит контент в папке `contents/`).

```
src/
  app/                             # FSD app-слой
    main.tsx                       # Entry (registerSW + createRoot); index.html указывает на /src/app/main.tsx
    App.tsx                        # Только провайдеры (GameSettings, Language) + RouterProvider
    router/routes.tsx              # createBrowserRouter + RootLayout (каркас + Suspense), basename из BASE_URL
    styles/index.css               # Tailwind + кастомные токены + glass-card
  pages/                           # FSD pages-слой (route-компоненты)
    menu/MenuRoute.tsx             # MainMenu + кнопка настроек
    settings/SettingsRoute.tsx     # Обёртка Settings
    game/
      GameLayout.tsx               # /game/:gameKey/* — валидация gameKey + sync c GameSettingsContext
      GameSetupRoute.tsx           # Setup + UniversalGameSettings, navigate('../play', {state:{playerNames}})
      GamePlayRoute.tsx            # lazy-импорты всех игр + маппинг GameKey→компонент, fallback игроков
                                   #   из storage, guard minPlayers
  shared/                          # FSD shared-слой (не знает о доменах игр)
    components/                    # 13 UI-атомов: Badge, IconButton, PrimaryButton, TextInput, TabButton,
                                   #   SectionLabel, PageWrapper, Pagination, ProgressDots, TimerBar,
                                   #   Typography, DrawingCanvas, GameCard (glass-card контейнер)
    hooks/                         # useTimer, useCountdown, usePlayerCycle, usePersistedState
    helpers/random.ts              # shuffle<T>(), pickRandom<T>() — использовать везде вместо inline sort
    i18n/                          # index (LanguageContext, useTranslation), en, ru, keys, types
    types/index.ts                 # Difficulty, GameTheme, GameModeOption (Player уехал в entities/player)
    services/                      # storageService, feedbackService (VIBRATE), sessionService
                                   #   gameId/gameKey-параметры — string (shared не знает GameKey)
    theme/colors.ts                # themeConfigs, getTheme, rgba
  entities/
    game/
      types.ts                     # GameKey (const-объект), GameMode, GameMetadata, InstructionItem,
                                   #   CLASSIC_MODE_ID, GamesRegistryMap, GameInstructionsMap
      registry.tsx                 # GAMES_REGISTRY — только метаданные (lazy-импорты игр уехали в GamePlayRoute)
      instructions.ts              # GAME_INSTRUCTIONS (бывший constants/instructions.ts)
      model/GameSettingsContext.tsx # difficulty, mode, rounds, timerSeconds, currentGameId (бывший contexts/)
      components/GameMenuCard.tsx  # Карточка игры в главном меню
    player/
      types.ts                     # Player, PlayerEntry (черновик игрока на Setup)
      components/                  # PlayerRow (+DEFAULT_NAMES), PlayerScoreList, LeaderboardList
  widget/                          # FSD widget-слой (композиции страниц)
    main-menu/components/MainMenu.tsx      # Список игр из GAMES_REGISTRY + bottom-sheet описания
    setup/components/Setup.tsx             # Универсальный экран: имена игроков + настройки
    settings/components/Settings.tsx       # Экран настроек приложения (общие + слова)
  features/                        # FSD feature-слой (переиспользуемые продуктовые фичи)
    game-settings/components/UniversalGameSettings.tsx  # Слоты настроек (сложность, режим, раунды, таймер)
    role-distribution/components/DistributionFlow.tsx   # Абстрактная раздача ролей (ProgressDots + lock→reveal)
    taboo-pass/components/TabooPassPhase.tsx             # Общая Pass-фаза Taboo-семейства (PassPhoneCard + PlayerScoreList)
  games/
    AliasGame/AliasGame.tsx
    CodenamesGame/CodenamesGame.tsx
    DecryptoGame/DecryptoGame.tsx
    FakeArtistGame/
      FakeArtistGame.tsx
      components/
        FakeArtistDistribution.tsx  # использует DistributionFlow
        FakeArtistVoting.tsx
    JustOneGame/JustOneGame.tsx
    MafiaGame/MafiaGame.tsx
    ResistanceGame/
      ResistanceGame.tsx
      components/
        ResistanceDistribution.tsx  # использует DistributionFlow
        ResistanceResult.tsx
    SpyHuntGame/
      SpyHuntGame.tsx
      components/
        RoleDistribution.tsx        # использует DistributionFlow
    TelestrationsGame/TelestrationsGame.tsx
    WavelengthGame/WavelengthGame.tsx
    TabooGame/
      TabooGame.tsx                 # использует useTimer
      phases/
        PassPhase.tsx               # обёртка над TabooPassPhase (red)
        PlayingPhase.tsx            # использует PlayingHeader + TimerBar
        VerdictPhase.tsx            # использует StopGameButton
        GameOverPhase.tsx           # использует LeaderboardList
    TabooReverseGame/
      TabooReverseGame.tsx          # использует useTimer
      phases/
        PassPhase.tsx               # обёртка над TabooPassPhase (orange)
        PlayingPhase.tsx            # использует PlayingHeader + TimerBar
        VerdictPhase.tsx            # использует StopGameButton
        GameOverPhase.tsx           # использует LeaderboardList
    TruthOrDareGame/TruthOrDareGame.tsx
  services/
    contentService.ts              # единственный не перенесённый сервис — зависит от @/games/*/content (→ features позже)
```

**Временные исключения FSD (ещё не вычищены):**
- `pages/*` и `widget/*` импортируют из `@/games/*` напрямую (games ещё не оформлены как FSD-слой);
- `entities/game/registry.tsx` импортирует `*_MODES` из `@/games/*/constants` и картинки из `@/assets` — games ещё не оформлены как FSD-слой;
- `widget/main-menu` и `features/game-settings` импортируют нелейерный `@/services/contentService`;
- `services/contentService.ts` вне слоёв, импортирует entities и `@/games/*/content.ts` (utils/gameLogic.ts расформирован: generateId → shared/helpers/random.ts, init-функции → model/-сегменты игр);
- `GameModeOption` в `shared/types` — почти дубликат `GameMode` из `entities/game/types` (используют UniversalGameSettings + GameSetupRoute), кандидат на консолидацию.

## Архитектура (роутинг)

React Router v7 (`react-router`, `createBrowserRouter`). Карта URL:
`/` (меню) · `/settings` · `/game/:gameKey/setup` · `/game/:gameKey/play` · `*` → `/`.
Базовый путь `/party-games/` (vite `base`) — пробрасывается в `basename` роутера.
Фазы игр в URL не выносятся — остаются локальными enum'ами внутри игр.
`playerNames` передаются через navigation state, при обновлении страницы — из `storageService.getPlayers()`.
Спецслучаи в GamePlayRoute: Bunker (`onRestart` → navigate setup), Telestrations (`initialDifficulty`).

Три контекста/сервиса:
- `GameSettingsContext` — настройки текущей игры (difficulty, mode, rounds, timer)
- `storageService` — localStorage: customWords, usedWords, settings, playerNames
- `feedbackService` — звук и вибрация

`GAMES_REGISTRY` (объект `{ [gameId]: GameMetadata }`) — единственный источник правды о метаданных игр.

**Как добавить игру:**
1. Добавить ключ в `GameKey` (src/entities/game/types.ts)
2. Добавить запись в `GAMES_REGISTRY` (src/entities/game/registry.tsx) — поля `setupStatus` больше нет
3. Добавить компонент в `GAME_COMPONENTS` в `src/pages/game/GamePlayRoute.tsx`
