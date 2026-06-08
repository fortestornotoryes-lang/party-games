# Memory Index

> Memory bank lives in `.claude/memory/` inside the project. Read this index at the start of every session.

- [Project Overview](project_overview.md) — стек, запуск, структура папок, архитектура, GameRegistry
- [Games & Flow](games_flow.md) — все 10 игр, GameStatus-цепочки, темы, инициализация игроков
- [Design System](design_system.md) — premium-цвета, glass-card, типографика, border-radius, themeConfigs
- [Animation Rules](animation_rules.md) — motion/react, AnimatePresence, spring, flip, stagger
- [Types & Data](types_data.md) — Player, GameStatus, GameState, GameSettingsContext, контент-константы
- [Mobile Fixes](mobile_fixes.md) — canvas ResizeObserver+DPR, touch-action none, flex-1 min-h-0
- [Performance Rules](performance_rules.md) — вложенные backdrop-filter убивают скроллинг, что безопасно
- [UI Components](components_ui.md) — Setup (до игры, инструкции+игроки), GameHeader (во время игры), PassPhoneCard, DrawingCanvas, UI.tsx
- [Storage & Word Logic](storage_wordlogic.md) — storageService gameId-ключи, какие игры используют contentService, какие inline; исправленные difficulty-баги
- [Phase Enum Pattern](phase_enum_pattern.md) — фазы игры = enum в `./types.ts`, не строковые литералы (TelestrationsPhase, AliasPhase)
- [Truth or Dare Plan](truth_or_dare_plan.md) — архитектура незавершённой игры «Правда или Действие» (GameKey, файлы, фазы, контент)
- [Hooks & Patterns](hooks_and_patterns.md) — usePlayerCycle, useTimer, VIBRATE, shuffle/pickRandom, DistributionFlow; таблица антипаттернов → замен
- [Bunker Architecture](bunker_architecture.md) — constants.ts / helpers.ts / types.ts BunkerGame; SurvivalPhase карточка катастрофы; таблица всех экспортов
