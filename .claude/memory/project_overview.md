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
  App.tsx                          # Главный state machine + роутер по GameStatus
  main.tsx
  index.css                        # Tailwind + кастомные токены + glass-card
  types.ts                         # Player, GameStatus, GameState, GameMetadata (legacy)
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
    PassPhoneCard.tsx              # Карточка "передай телефон" с анимацией и badge (используется в играх для pass-phone фаз)
    UniversalGameSettings.tsx      # Слоты настроек (сложность, режим, раунды, таймер)
    GameHeader.tsx                 # Sticky-хедер с кнопкой назад
    DrawingCanvas.tsx              # Канвас-компонент (ResizeObserver + DPR)
    InstructionsModal.tsx          # Модалка с правилами игры
    Settings.tsx                   # Экран настроек приложения
    Result.tsx                     # Экран результата (SPY HUNT)
    UI.tsx                         # Все базовые UI-компоненты (см. components_ui.md)
  games/
    AliasGame/AliasGame.tsx
    CodenamesGame/CodenamesGame.tsx
    DecryptoGame/DecryptoGame.tsx
    FakeArtistGame/
      FakeArtistGame.tsx
      components/
        FakeArtistDistribution.tsx
        FakeArtistVoting.tsx
    JustOneGame/JustOneGame.tsx
    MafiaGame/MafiaGame.tsx
    ResistanceGame/
      ResistanceGame.tsx
      components/
        ResistanceDistribution.tsx
        ResistanceResult.tsx
        ResistanceDistribution.tsx
    SpyHuntGame/
      SpyHuntGame.tsx
      components/
        RoleDistribution.tsx
    TelestrationsGame/TelestrationsGame.tsx
    WavelengthGame/WavelengthGame.tsx
  constants/                       # Контент для каждой игры + instructions.ts (GAME_INSTRUCTIONS: GameInstructionsMap)
  services/
    storageService.ts              # Кастомные слова, использованные слова, настройки, игроки
    feedbackService.ts             # Sound + вибрация
    contentService.ts
  hooks/
    useCountdown.ts
    useTimer.ts
  utils/
    random.ts
    gameLogic.ts                   # initSpyHunt, initFakeArtist, initResistance
```

## Архитектура (App.tsx)

`useState<GameStatus>` управляет всем. Нет роутера — рендер через `switch(status)` в `renderGame()`.

Три контекста/сервиса:
- `GameSettingsContext` — настройки текущей игры (difficulty, mode, rounds, timer)
- `storageService` — localStorage: customWords, usedWords, settings, playerNames
- `feedbackService` — звук и вибрация

`GAMES_REGISTRY` (объект `{ [gameId]: GameMetadata }`) — единственный источник правды о метаданных игр.

**Как добавить игру:**
1. Добавить статусы в `GameStatus` в types.ts
2. Добавить запись в `GAMES_REGISTRY` (GameRegistry.tsx)
3. Добавить кейс в `renderGame()` в App.tsx
