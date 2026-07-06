# UI & Design System

## Темы и цвета

- 12 тем `GameTheme` (`shared/types/index.ts`); у каждой игры тема задана в реестре
- **Два источника, которые надо синхронизировать вручную:** hex-токены `@theme` в `src/app/styles/index.css` ↔ `PREMIUM_RGB` в `src/shared/theme/colors.ts` (комментарий в файле напоминает). Меняешь цвет — правь оба.
- `rgba(color, alpha)` из colors.ts — только для inline style (boxShadow, filter, background), не для className
- `ThemeTokens` (там же) — готовые наборы классов по теме: text, bg, border, кнопка, градиент, активная опция. Новые тематические стили добавлять туда, а не собирать классы на месте

## Стили

- Tailwind 4, кастомные утилиты и `@theme` — в `src/app/styles/index.css`
- `.glass-card` (index.css) — стеклянная карточка с `backdrop-filter: blur(16px)`; переиспользовать класс, не писать свой blur (см. gotchas.md про производительность)
- Safe-area: классы `safe-top` / `safe-bottom` (используются в RootLayout)
- Каркас приложения: центрированная колонка `max-w-3xl` (routes.tsx)

## Общие компоненты (`src/shared/components/`)

Перед созданием нового UI — проверить, нет ли готового: PrimaryButton, IconButton, TabButton, GameCard, GameHeader, PlayingHeader, TimerBar, PassPhoneCard (передача телефона), DrawingCanvas (рисование: DPR + ResizeObserver уже внутри), InstructionsModal, PageWrapper, Typography, Badge, SectionLabel, ProgressDots, Pagination, TextInput, StopGameButton. Игрокоспецифичные списки — `entities/player/components/`.

## Анимации

- Библиотека `motion` v12, импорт из `motion/react`
- Смена фаз/экранов — через `AnimatePresence` с ключом фазы
- Прогрессивное появление списков — stagger через `delay: index * ...`

_Ревизия: 2026-07-06_