# UI & Design System

## Темы и цвета

- 12 тем `GameTheme` (`shared/types/index.ts`); у каждой игры тема задана в реестре
- **Единственный источник цветов — `PREMIUM_RGB`** (`src/shared/theme/colors.ts`). `@theme`-токены `--color-premium-*` генерируются из него скриптом `scripts/generateThemeColors.ts` в `src/app/styles/premium-colors.css` (автоматически в predev/prebuild, вручную `npm run theme:gen`). Сгенерированный css руками не править. Хардкод-оттенки в `ARBITRARY` (hover-цвета кнопок) — отдельные, подобраны вручную.
- `rgba(color, alpha)` из colors.ts — только для inline style (boxShadow, filter, background), не для className
- `ThemeTokens` (там же) — готовые наборы классов по теме: text, bg, border, кнопка, градиент, активная опция. Новые тематические стили добавлять туда, а не собирать классы на месте

## Стили

- Tailwind 4, кастомные утилиты и `@theme` — в `src/app/styles/index.css`
- `.glass-card` (index.css) — стеклянная карточка с `backdrop-filter: blur(16px)`; переиспользовать класс, не писать свой blur (см. gotchas.md про производительность)
- Safe-area: классы `safe-top` / `safe-bottom` (используются в RootLayout)
- Каркас приложения: центрированная колонка `max-w-3xl` (routes.tsx)

## Общие компоненты (`src/shared/components/`)

Перед созданием нового UI — проверить, нет ли готового: PrimaryButton, IconButton, TabButton, GameCard, GameHeader, PlayingHeader, TimerBar, RingTimer (круговой таймер раунда), FitText (текст, который не вылезает за экран — см. gotchas.md), PassPhoneCard (передача телефона), DrawingCanvas (рисование: DPR + ResizeObserver уже внутри), InstructionsModal, PageWrapper, Typography, Badge, SectionLabel, ProgressDots, Pagination, TextInput, StopGameButton. Анимационные: AnimatedNumber (прокрутка числа), VictoryHero (кубок/корона с лучами и искрами), FlipCard (3D-переворот при монтировании), UrgencyVignette (красная виньетка последних секунд). Игрокоспецифичные списки — `entities/player/components/` (LeaderboardList с `animated`, FinalStandings — финал игры на очки).

## Анимации

- Библиотека `motion` v12, импорт из `motion/react`
- **Пресеты — `src/shared/theme/motion.ts`**: пружины `SPRING` (soft/pop/snappy/flip), `PHASE_VARIANTS` (смена фаз + каскад детей), `STAGGER_ITEM`, `CARD_DEAL_VARIANTS` (3D-«раздача», родителю нужен `perspective-distant`), `SHAKE_X`. Новые анимации собирать из них, а не подбирать stiffness/damping на месте.
- Смена фаз: корень фазы `variants={PHASE_VARIANTS} initial="initial" animate="animate" exit="exit"` под `AnimatePresence mode="wait"`; дети с `variants={STAGGER_ITEM}` появляются каскадом автоматически.
- Перелёт элементов между контейнерами (игроки между командами, плашка «Ложь») — `layoutId`; у прокручиваемого предка — `layoutScroll`.
- Выбор ответа с анимацией (карточка вспыхивает, остальные гаснут) — локальный `picked` + `setTimeout(PICK_DELAY_MS)` в эффекте, потом колбэк наверх (Crocodile ChooseWord, VotePhase в TwoTruths/WhoAmongUs).
- Настройка «Визуальные эффекты» выключает движение глобально: `MotionConfig reducedMotion` в RootLayout (`app/router/routes.tsx`). Imperative `animate()` (AnimatedNumber) и конфетти этим не управляются — конфетти гасит `feedbackService`.
- Эталоны: Alias (свайп-карточка `AliasGame/components/SwipeWordCard.tsx`), TwoTruths `phases/RevealPhase.tsx` (последовательное раскрытие со звуком по таймерам).

_Ревизия: 2026-10-18_