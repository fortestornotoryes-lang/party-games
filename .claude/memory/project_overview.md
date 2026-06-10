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

```
src/
  App.tsx                          # Только провайдеры (GameSettings, Language) + RouterProvider
  main.tsx
  index.css                        # Tailwind + кастомные токены + glass-card
  types.ts                         # Player, Difficulty, GameMode, GameTheme (GameStatus удалён)
  router/
    routes.tsx                     # createBrowserRouter + RootLayout/MenuRoute/SettingsRoute, basename из BASE_URL
    GameLayout.tsx                 # /game/:gameKey/* — валидация gameKey + sync c GameSettingsContext
    GameSetupRoute.tsx             # Setup + UniversalGameSettings, navigate('../play', {state:{playerNames}})
    GamePlayRoute.tsx              # Маппинг GameKey→компонент, fallback игроков из storage, guard minPlayers
  types/
    games.ts                       # GameKey enum, GameMetadata, GameMode, GamesRegistryMap, GameInstructionsMap
    instructions.ts                # устаревший GameKey enum (не используется в основном коде)
  registry/
    GameRegistry.tsx               # GAMES_REGISTRY — реестр всех игр + lazy imports
  contexts/
    GameSettingsContext.tsx        # difficulty, mode, rounds, timerSeconds, currentGameId
  components/
    MainMenu.tsx                   # Список игр из GAMES_REGISTRY
    Setup.tsx                      # Универсальный экран: имена игроков + настройки
    PassPhoneCard.tsx              # Карточка "передай телефон" с анимацией и badge
    UniversalGameSettings.tsx      # Слоты настроек (сложность, режим, раунды, таймер)
    GameHeader.tsx                 # Sticky-хедер с кнопкой назад
    DrawingCanvas.tsx              # Канвас-компонент (ResizeObserver + DPR)
    InstructionsModal.tsx          # Модалка с правилами игры
    Settings.tsx                   # Экран настроек приложения
    Result.tsx                     # Экран результата (SPY HUNT)
    Typography.tsx                 # 7 типографических компонентов (Display/Title/Heading/Label/Body/Caption/Score)
    # ── Атомарные переиспользуемые компоненты ──
    TimerBar.tsx                   # Полоска прогресса таймера (pct, color)
    ProgressDots.tsx               # Точки-индикаторы шагов с motion-анимацией
    PlayingHeader.tsx              # "Игрок объясняет" + таймер
    DistributionFlow.tsx           # Абстрактная основа раздачи ролей (ProgressDots + lock→reveal)
    TabooPassPhase.tsx             # Общая Pass-фаза для Taboo-семейства (PassPhoneCard + PlayerScoreList)
    PlayerScoreList.tsx            # Список игроков с очками для pass-экранов (auto-sorted)
    LeaderboardList.tsx            # Ранжированный список победителей для GameOver-экранов
    StopGameButton.tsx             # Кнопка "Завершить игру"
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
  constants/                       # Контент для каждой игры + instructions.ts
  services/
    storageService.ts              # Кастомные слова, использованные слова, настройки, игроки
    feedbackService.ts             # Sound + вибрация + VIBRATE константы
    contentService.ts              # использует shuffle/pickRandom из utils/random
  hooks/
    useCountdown.ts                # Telestrations (отдельный, не совпадает с useTimer)
    useTimer.ts                    # Универсальный таймер с onTimeUp callback
    usePlayerCycle.ts              # Циклический перебор игроков { current, idx, isLast, next, reset }
  utils/
    random.ts                      # shuffle<T>(), pickRandom<T>() — использовать везде вместо inline sort
    gameLogic.ts                   # initSpyHunt, initFakeArtist, initResistance
```

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
1. Добавить ключ в `GameKey` (types/games.ts)
2. Добавить запись в `GAMES_REGISTRY` (GameRegistry.tsx) — поля `setupStatus` больше нет
3. Добавить компонент в `GAME_COMPONENTS` в `src/router/GamePlayRoute.tsx`
