# План переноса Party Games на React Native

> Статус: **все 18 игр перенесены (2026-07-31)** — этапы 0–6 выполнены; этап 7 (полировка) в работе — брендинг и keep-awake сделаны, анимации/производительность остаются. Этап 8 (сборка/публикация) не начат. См. отметки ниже.
> Решения зафиксированы с владельцем проекта: **Expo** (managed workflow), **отдельный RN-проект** (веб-версия не является источником общего кода, код копируется и адаптируется), платформы **iOS + Android**, стилизация — **NativeWind**.
> Уточнение 2026-07-30: RN-проект живёт в папке **`mobile-app/` внутри этого репозитория** (не отдельное репо `party-games-native`) — по явному решению владельца. Из корневого tsconfig папка исключена.

---

## 1. Что переносим

Текущее приложение: SPA/PWA, 18 pass-the-phone игр, ~40 000 строк TS/TSX, всё состояние в localStorage, бэкенда нет. Это идеальный кандидат на RN: нет сети, нет серверной части, нет платформозависимых фич кроме вибрации/звука/canvas.

## 2. Целевой стек и соответствия

| Сейчас (web)                          | Станет (RN)                                               | Комментарий                                                                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite 6 + PWA                          | **Expo SDK 53+** (RN 0.79+, New Architecture)             | `npx create-expo-app`                                                                                                                                                                                                                  |
| react-router 7 (data router)          | **expo-router** (file-based)                              | Маршруты 1:1: `/`, `/settings`, `/game/[gameKey]/setup`, `/game/[gameKey]/play`                                                                                                                                                        |
| Tailwind CSS 4 (`@theme` в CSS)       | **NativeWind v4** + tailwind.config.js                    | ⚠️ NativeWind работает на конфиге Tailwind 3 — токены из `src/app/styles/index.css` переносятся в `tailwind.config.js` вручную                                                                                                         |
| motion v12 (`motion/react`)           | **react-native-reanimated** + **moti**                    | Moti даёт близкий к motion API (`AnimatePresence`, `from/animate/exit`) поверх Reanimated                                                                                                                                              |
| lucide-react                          | **lucide-react-native**                                   | Тот же набор иконок, требует `react-native-svg`                                                                                                                                                                                        |
| canvas-confetti                       | **react-native-confetti-cannon** (или свой на Reanimated) |                                                                                                                                                                                                                                        |
| localStorage + storageService         | **react-native-mmkv**                                     | ⚠️ Ключевое решение: MMKV **синхронный**, как localStorage — `storageService`, `sessionService` и `usePersistedState` переносятся без перевода на async. AsyncStorage не подходит: сломал бы синхронные чтения при инициализации state |
| `<canvas>` / DrawingCanvas            | **@shopify/react-native-skia**                            | Рисование пальцем: Skia `Path` + `react-native-gesture-handler`. DPR/ResizeObserver-грабли из веба исчезают — Skia сам работает в физических пикселях                                                                                  |
| `navigator.vibrate` (feedbackService) | **expo-haptics**                                          | Паттерны `VIBRATE` маппятся на `impactAsync`/`notificationAsync`                                                                                                                                                                       |
| Web Audio API (feedbackService)       | **expo-audio**                                            | Синтез тонов заменить на короткие бандленные сэмплы (проще и надёжнее)                                                                                                                                                                 |
| `backdrop-filter` (.glass-card)       | **expo-blur** (`BlurView`)                                | ⚠️ На Android дорого; для слабых устройств fallback — полупрозрачный фон без blur                                                                                                                                                      |
| CSS-градиенты                         | **expo-linear-gradient**                                  |                                                                                                                                                                                                                                        |
| safe-top/safe-bottom (CSS env)        | **react-native-safe-area-context**                        | Входит в Expo                                                                                                                                                                                                                          |
| Модалки (InstructionsModal)           | RN `Modal` / expo-router modal-роуты                      |                                                                                                                                                                                                                                        |

Стор-зависимости (dev): EAS Build (облачная сборка iOS без Mac), eslint + prettier + typescript — конфиги переносятся почти как есть (typescript-eslint, запрет enum и т.д.).

## 3. Что переносится почти без изменений (~50–60% кода)

Вся «логика без DOM» копируется с минимальными правками импортов:

- `shared/types`, `entities/game/types.ts`, `GameKey`, все const-объекты и фазы
- `entities/game/registry.tsx` — метаданные игр (иконки заменить на lucide-react-native), `instructions.ts`
- `shared/helpers/contentPool.ts` и весь контент игр (`content.ts` / `contents/`) — это самая большая часть кодовой базы
- `shared/i18n` — словари ru/en, интерполяция; контекст работает в RN как есть
- `shared/hooks` — `useTimer`, `useCountdown`, `usePlayerCycle`, `usePersistedState` (после переноса storage на MMKV)
- `shared/services` — `storageService` (заменить `localStorage.getItem/setItem` на MMKV, `safeParseJson` остаётся), `sessionService` без изменений
- `entities/game/model/GameSettingsContext.tsx` — контекст и персистенция конфигов
- Все `helpers.ts`, `constants.ts` внутри игр, логика раздачи ролей, балансировка (`debug/bunkerBalance`)

## 4. Что переписывается

- **Весь JSX-слой**: `div` → `View`, текст только внутри `Text`, `button` → `Pressable`, `input` → `TextInput`, скролл — явный `ScrollView`/`FlatList`. Классы NativeWind переносятся из существующей вёрстки процентов на 70, остальное — правки под RN-flexbox (по умолчанию `flex-direction: column`, нет `gap`-багов, нет `position: fixed`).
- **`shared/theme`**: `PREMIUM_RGB` остаётся источником цветов; `ThemeTokens` (наборы классов) переносится, но классы проверяются на совместимость с NativeWind. Двойной источник (`@theme` CSS ↔ colors.ts) схлопывается в один: `colors.ts` → генерирует `tailwind.config.js` (плюс от переезда).
- **DrawingCanvas** → компонент на Skia (жесты через Gesture Handler; аналог `touch-action: none` — `Gesture.Pan()` с блокировкой скролла).
- **feedbackService** → expo-haptics + expo-audio, сигнатуры функций сохранить, чтобы callsites в играх не менялись.
- **Анимации**: `motion/react` → moti. `AnimatePresence` с ключом фазы → `AnimatePresence` из moti (API совпадает концептуально). Stagger через `delay: index * N` работает так же.

## 5. Структура нового проекта

Папка `mobile-app/` в корне репозитория, FSD-структура сохраняется:

```
mobile-app/
  app/                      — expo-router: _layout.tsx, index.tsx, settings.tsx,
                              game/[gameKey]/setup.tsx, game/[gameKey]/play.tsx
  src/
    pages/                  — контент экранов (роуты в app/ — тонкие обёртки)
    widget/  features/  entities/  games/  shared/   — как в вебе
  assets/                   — иконки приложения, splash, звуки
  tailwind.config.js  app.json  eas.json
```

## 6. Этапы

### Этап −1 — подготовительный рефакторинг в веб-версии

Цель: сузить «платформенную поверхность» до shared-слоя, чтобы при копировании кода в RN менялись только сервисы/компоненты, а не игры. По убыванию ценности:

1. ✅ **Обёрнуто: canvas-confetti → feedbackService.** `feedbackService.celebrate(preset, overrides?)` с пресетами `CONFETTI` (win/success/small/board/top) + `fireworks(colors?)` для боковых пушек Resistance. Прямых импортов canvas-confetti в играх не осталось; проверка `visualEffects` теперь внутри сервиса.
2. ✅ **Сделано: общий canvas-слой.** DPR/ResizeObserver/маппинг координат вынесены в хук `shared/hooks/useCanvasSurface.ts`; на нём работают и `DrawingCanvas` (raster), и канвас FakeArtist (vector-штрихи). Skia-порт нужен ровно одному модулю — хуку.
3. ✅ **Сделано: raw-таймеры убраны.** FakeArtist — на `useCountdown`; интервал Resistance ушёл вместе с конфетти в `fireworks`.
4. ✅ **Сделано: пропсы унифицированы.** Общий контракт `GameComponentProps` в `entities/game/types.ts` (`onRestart`/`initialDifficulty` опциональны), GamePlayRoute рендерит все 18 игр одним маппингом без особых веток.
5. ✅ **Сделано: один источник цветов.** `PREMIUM_RGB` (`colors.ts`) — единственный источник; `scripts/generateThemeColors.ts` генерирует `src/app/styles/premium-colors.css` с `@theme`-токенами (npm `theme:gen`, вшит в predev/prebuild). В RN по тому же принципу из `colors.ts` генерируется tailwind.config.js для NativeWind.

Мелочь: scroll-lock через `document.body.style.overflow` встречается не только в InstructionsModal, но и inline в `FakeArtistVoting.tsx` — заменить на переиспользуемый хук/модалку, чтобы прямых обращений к `document` вне shared не осталось.

**Не рефакторить ради переноса:** JSX-вёрстку и Tailwind-классы (переписываются при порте в любом случае), `motion/react` (moti маппится 1:1), роутинг (expo-router всё равно другой), i18n-выжимку оставшихся захардкоженных строк (покрытие уже 83/90 файлов — добирать попутно).

### Этап 0 — Bootstrap (фундамент)

- ✅ **Сделано (2026-07-30):** `create-expo-app` в `mobile-app/` (Expo SDK 57, RN 0.86, React 19.2, expo-router). Установлены: nativewind@4.2 + tailwindcss@3.4, react-native-mmkv@4 (+ nitro-modules), lucide-react-native + react-native-svg, moti, expo-haptics/audio/blur/linear-gradient/keep-awake, expo-dev-client. NativeWind сконфигурирован (babel/metro/tailwind.config, `src/global.css`); tsconfig — алиас `@/*` + `allowImportingTsExtensions` как в вебе. Демо-экраны шаблона удалены, каркас `src/app/` — `_layout` с провайдерами + смоук-экран `index` (список игр из реестра).
- ✅ **Android (2026-07-31):** установлена Android Studio, приложение запускается и работает локально (`expo run:android`). iOS — не прогонялось (без Mac — путь через EAS, отложено).
- ⬜ eslint/prettier перенести из веб-проекта

**Готово, когда:** dev build ставится на оба телефона, hot reload работает, NativeWind красит тестовый экран.

### Этап 1 — Ядро shared (без UI)

- ✅ **Сделано (2026-07-30):** скопированы types, contentPool + helpers (cardDeck/random/teams), i18n (полностью), hooks (useTimer/useCountdown/usePlayerCycle/usePersistedState; `NodeJS.Timeout` → `ReturnType<typeof setTimeout>`), sessionService, GameSettingsContext, registry + instructions + useLocalizedGame, theme/colors.ts. Плюс констант-файлы игр, от которых зависит реестр (Alias, Bunker, Codenames, ConnectFour, Decrypto, MemoRisk, SpyHunt + его content.ts, TabooReverse, Telestrations).
- ✅ storageService/sessionService: работают через `kvStorage` — localStorage-совместимый адаптер над MMKV (`shared/services/kvStorage.ts`), API и `safeParseJson` не менялись.
- ✅ tailwind: `scripts/generateTailwindColors.mjs` генерирует `tailwind.colors.json` из `PREMIUM_RGB` (npm `theme:gen`, вшит в `prestart`) — принцип «один источник цветов» сохранён.
- ✅ feedbackService: те же сигнатуры; vibrate — на expo-haptics; celebrate/fireworks/playSound — заглушки с TODO (конфетти — этап 2/7, сэмплы expo-audio — этап 7).
- Примечание: web-`backgroundImage` (картинки GameCard) из RN-реестра пока убраны — вернуть на этапе 3 при переносе меню (RN-импорты картинок отличаются от Vite).

**Готово, когда:** `tsc --noEmit` чистый ✅; юнит-логика (contentPool, helpers) работает в тестовом экране — проверить на dev build.

### Этап 2 — UI-кит

Перенести `shared/components` на RN-примитивы (порядок — по частоте использования): Typography, PageWrapper, PrimaryButton, IconButton, TabButton, GameHeader, PlayingHeader, TimerBar, Badge, SectionLabel, ProgressDots, Pagination, TextInput, GameCard, PassPhoneCard, StopGameButton, InstructionsModal. `glass-card` → компонент `GlassCard` на BlurView (+ fallback без blur). Плюс `entities/player/components`.

- ✅ **Сделано (2026-07-30):** все 17 компонентов + GlassCard + PlayerRow/PlayerScoreList/LeaderboardList перенесены; витрина — debug-роут `/showcase` (переключатель 12 тем). Токены дизайн-системы (radius premium-\*, шкала fontSize micro…display-2xl, цвет bg) добавлены в tailwind.config. `tsc --noEmit` чистый, Metro-бандл собирается (`expo export`). На устройстве не прогонялось (нужен dev build).
- Осознанные упрощения при порте (вернуться на этапе 7 при необходимости):
  - PassPhoneCard: глитч-слои (mix-blend-mode + clip-path) и grid-текстура в RN невоспроизводимы — статичный HUD; пульс иконки сохранён (moti).
  - PlayerRow: drag-reorder (motion Reorder) не перенесён — TODO этап 3 (react-native-draggable-flatlist).
  - GlassCard: blur только iOS; Android — градиент + бордер (BlurView на Android дорогой).
  - Typography: пропс `as` убран (в RN всё `<Text>`); em-трекинг пересчитан в px от fontSize (RN не знает em).
  - Шрифт Unbounded (font-display) не подключён — системный; загрузка шрифтов — этап 7.
- ⚠️ RN-грабля: NativeWind v4 не мапит `className` на сторонние компоненты — каждый (MotiView и т.п.) регистрируется через `cssInterop` в `src/shared/nativewindInterop.ts`.

**Готово, когда:** экран-витрина (storybook-подобный debug-роут) показывает все компоненты во всех 12 темах. ✅ (проверка на устройстве — вместе с этапом 0)

### Этап 3 — Каркас приложения

- Меню (сетка GameCard из реестра), `/settings` (язык, кастомные слова)
- Setup-экран: инструкции + игроки + `UniversalGameSettings` из декларативных настроек реестра
- Play-роут: аналог `GAME_COMPONENTS` (lazy через `React.lazy` или динамический маппинг), передача игроков (в RN вместо navigation state — параметры роута + `storageService.getPlayers()` fallback, redirect при нехватке игроков), `sessionService.syncPlayers`

- ✅ **Сделано (2026-07-30):** MainMenu (лого + карточки GameMenuCard со stagger + bottom-sheet описания), `/settings` (вкладка «Общие» полностью: эффекты/вибрация/звук, язык, секции хранилища и «о приложении»), Setup (игроки: добавление/удаление/перемешивание/автоимена, чип сложности, футер с градиентом, InstructionsModal), UniversalGameSettings (сложность/режимы/декларативные настройки — 1:1 с вебом), GameLayout-аналог `app/game/[gameKey]/_layout.tsx` (валидация ключа + sync GameSettingsContext), play-роут с маппингом `GAME_COMPONENTS` (все 18 → `GameStub`) + redirect при нехватке игроков + `syncPlayers`. Игроки передаются только через storage (MMKV синхронный) — navigation state не нужен.
- Отложено внутри этапа: вкладка «Слова» в Settings — заглушка (редактор кастомных слов требует контент-модулей игр, этапы 4–6); `contentService` перенесён с пустой картой пулов — заполняется при переносе каждой игры (счётчики слов в меню появятся сами); drag-reorder игроков в Setup (см. этап 2); фоновые картинки карточек меню (ассеты — при полировке).
- `GameStub` (`src/pages/game/GameStub.tsx`) показывает дошедших игроков и конфиг — проверка полного цикла. При переносе игры меняется её запись в `GAME_COMPONENTS` (play.tsx).

**Готово, когда:** полный цикл меню → setup → «заглушка игры» → выход работает, players/config персистятся. ✅ по коду (tsc + Metro-бандл); прогон на устройстве — вместе с этапом 0 (dev build).

### Этап 4 — Пилотные игры (обкатка паттернов)

2–3 простые текстовые игры с таймером: **Taboo, Alias, TruthOrDare**. На них фиксируются паттерны переноса: фазы + AnimatePresence, таймеры, PassPhoneCard, usePersistedState, конфетти/хаптика. Результат — короткий «рецепт переноса игры» в README проекта.

- ✅ **Сделано (2026-07-31):** перенесены все три игры (логика/контент 1:1, JSX на RN-примитивах): TruthOrDare (PassPhoneCard, LinearGradient-кнопки выбора), Taboo (useTimer + usePersistedTimer, cardDeck, TimerBar, LeaderboardList, общая фича `features/taboo-pass` — переиспользует TabooReverse), Alias (команды, новый общий компонент `shared/components/TimerRing` — SVG-кольцо на react-native-svg + reanimated). `WORD_POOLS` contentService заполнен для трёх игр. «Рецепт переноса игры» записан в `mobile-app/README.md`.
- Зафиксированные паттерны: enum фаз → const-объект **с теми же строковыми значениями** (совместимость персистентных сессий); `AnimatePresence` из moti с `exitBeforeEnter` (внутри framer-motion 6, `mode="wait"` нет) и стабильными `key` фаз; `motion.div` → MotiView (`from`, `translateY`, duration в мс); скролл фазы — `ScrollView` с `contentContainerStyle={{flexGrow:1}}`.
- `tsc --noEmit` чистый, Metro-бандл собирается; смоук на устройстве — прогнать при следующем запуске dev build.

### Этап 5 — Массовый перенос текстовых/ролевых игр

Партиями по 2–3, от простых к сложным:

1. ✅ TabooReverse, JustOne, SpyHunt — **сделано (2026-07-31)**. TabooReverse: все 3 режима (классика/блиц/команды), переиспользует `features/taboo-pass`; в PrimaryButton добавлен вариант `orange`. JustOne: инпуты подсказок на shared TextInput (`onChangeText`/`onSubmitEditing`), `keyboardShouldPersistTaps="handled"` на ScrollView. SpyHunt: портирована фича **`features/role-distribution`** (DistributionFlow + RoleRevealCard) — RN-API вместо tailwind-градиентов принимает `gradientColors`/`glowColor` (CSS-строки ROLE_TOKENS в RN-стилях не работают); переиспользуется ролевыми играми партии 2. Пулы всех трёх добавлены в WORD_POOLS. ⚠️ Не вкладывать ScrollView в ScrollView: если фаза скроллится сама (DistributionFlow), корень игры — `View flex-1`, а не ScrollView. `tsc` чистый, Metro-бандл собирается; смоук на устройстве — при следующем запуске.
2. ✅ Mafia, Resistance, Bunker — **сделано (2026-07-31)**. Mafia и в вебе — экран «в разработке», перенесён 1:1. Resistance: раздача ролей на `features/role-distribution`, финал — `feedbackService.fireworks`. Bunker: все 8 фаз (briefing/dictator/reveal/discussion/voting/tribunal/full-reveal/survival), helpers и contents (~3300 строк) скопированы 1:1; попутно enum `BunkerPhase` в mobile `types.ts` (остался от этапа 1) приведён к const-объекту. Web-`scrollIntoView` к итогам симуляции опущен (секция просто появляется ниже в ScrollView). `tsc` чистый, Metro-бандл собирается.
3. ✅ Millionaire, MemoRisk — **сделано (2026-07-31)**. Millionaire: 5 фаз (Pass/Question/Reveal/Between/Win/GameOver — Reveal рендерится внутри QuestionPhase), 3 подсказки (50:50/звонок другу/зал), лесенка призов, content.ts (1293 строки) 1:1. Веб-keyframe-анимации ответов (тряска/пульс) заменены spring-акцентом — оценка эквивалентности на устройстве. MemoRisk: 3D-флип карточек через MotiView `rotateY` + `backfaceVisibility` (RN не поддерживает `transformStyle` как style-проп — опущен, флип работает и без него), сетка доски на flexWrap (в RN нет CSS grid) с точным вычислением ширины ячейки `100/gridSize%`. Вся игровая логика (`useMemoRiskGameLogic`, `helpers.ts`) скопирована 1:1 без изменений. `tsc` чистый, Metro-бандл собирается (4083 модуля). TruthOrDare перенесён ранее (этап 4).
4. ✅ Codenames, Decrypto — **сделано (2026-07-31)**. Обе игры — сетки/доски, но RN не имеет CSS grid: заменено на `flex-row flex-wrap` с шириной ячейки в `%` (Codenames: 5×5 карточек `width: '20%'`; Decrypto: `WordGrid` 2 колонки `width: '50%'`). Числовые/текстовые поля (номер подсказки, код-инпут капитана) — на shared `TextInput` с `keyboardType="number-pad"`. Decrypto: цветовые хелперы команд (`tBg`/`tText`/`tBadge`) возвращают готовые tailwind-строки — скопированы в mobile почти 1:1 (только `tGlow`/`tFocus` с CSS-only эффектами убраны). `tsc` чистый, Metro-бандл собирается (4103 модуля).
5. ✅ ConnectFour, Corridor, Wavelength — **сделано (2026-07-31), этап 5 завершён (17/18 игр)**. ConnectFour: доска на `flex-row flex-wrap` (паттерн партии 4), hover-«призрак» колонки убран (нет мыши на тач-устройствах), фишки — MotiView spring drop. Wavelength: перетаскиваемый ползунок реализован с нуля на `react-native-gesture-handler` (`Gesture.Pan` + `GestureDetector`) — первый в проекте жестовый компонент; `GestureHandlerRootView` уже оборачивал приложение с этапа 0, доп. настройки не потребовалось. Corridor: первая доска на `react-native-svg` (`Svg`/`Rect`/`Circle`/`G`) вместо HTML `<svg>` — пешки анимированы `useSharedValue` + `useAnimatedProps` (spring по `cx/cy`), клики по `<Rect onPress>`; hover-подсветка слотов стены (веб `onMouseEnter`) опущена — нет аналога на тач-устройствах. `tsc` чистый, Metro-бандл собирается (4126 модулей).

После каждой партии — прогон на обоих устройствах.

### Этап 6 — Игры с рисованием

✅ **Сделано (2026-07-31). Все 18 игр перенесены — перенос игр завершён.**

- Установлен `@shopify/react-native-skia` (`npx expo install`, 2.6.2) — требует нативной пересборки dev build (`expo run:android`/EAS) перед следующим запуском на устройстве, JS-часть уже проверена (`expo export`, 4400 модулей).
- `shared/components/DrawingCanvas.tsx` переписан с растрового canvas 2D (веб) на **векторный** подход: вместо битмапа с DPR-пересозданием (`useCanvasSurface`, не переносился) — массив штрихов `{points, color, width}[]`, каждый рендерится Skia `<Path path={svgString} style="stroke">`. Штрихи строятся жестом `Gesture.Pan` (`onBegin/onChange` → `runOnJS` добавляет точки, `onEnd` — коммит в массив). Undo — `pop` последнего штриха вместо `putImageData` снапшота. Экспорт кадра — `canvasRef.current.makeImageSnapshot().encodeToBase64()` → `data:image/png;base64,...` (тот же формат dataURL, что и веб `canvas.toDataURL()`, потребители ниже по цепочке не меняются). API пропсов `{word, timeLeft, playerCount, currentRound, onFinish}` сохранён 1:1. Убран нативный `<input type=color>` пикер (нет аналога в RN) — оставлены 8 пресетов, как и в вебе.
- **FakeArtist**: инлайн-канвас коллективного рисования (одна линия за ход) построен на тех же Skia-примитивах прямо в `FakeArtistGame.tsx` (как и в вебе — не вынесен в отдельный компонент). Голосование (`FakeArtistVoting`) показывает base64 PNG через RN `<Image source={{uri}}>` — data-URI работает нативно; полноэкранный просмотр — `Modal` вместо веб `position: fixed` + `document.body.style.overflow`.
- **Telestrations**: 4 компонента фаз + галерея (последняя показывает все шаги через `<Image>`), использует общий `DrawingCanvas`. Особый проп `initialDifficulty` (мгновенный старт с сессии) сохранён без изменений.
- Обе игры используют `features/role-distribution` (FakeArtist) — фича уже была на месте с этапа 5.
- `tsc` чистый; функциональная проверка рисования (жест → штрих → undo → snapshot) — на устройстве после нативной пересборки.

### Этап 7 — Полировка

- ✅ **Иконка/splash/название — сделано (2026-07-31).** Реального лого у RN-проекта не было — вместо генерации нового бренда переиспользован существующий веб-брендинг: `../public/icon.svg` (SVG-контроллер, `#10b981`, тёмный радиальный фон) растеризован через `sharp` (`mobile-app/scripts/generateAppIcons.mjs`, разовый скрипт — перезапускать при правке логотипа) в полный набор: `icon.png` 1024×1024 (iOS + web favicon-источник), `android-icon-foreground/monochrome.png` (только глиф без фона, для adaptive icon), `splash-icon.png` (глиф на фирменном фоне сплэша). `app.json`: `name` → «Party Hub» (совпадает с веб `<title>` и `bundleIdentifier` `com.partyhub.mobile`), `userInterfaceStyle: "dark"` (приложение принципиально без светлой темы), splash/adaptive-icon фон — `#0b0915`/`#060807` (тёмный бренд-фон вместо дефолтного Expo-синего). Заодно удалены неиспользуемые scaffold-ассеты (`react-logo*`, `tutorial-web.png`, `expo-badge*`, `expo-logo.png`, `logo-glow.png`, `assets/expo.icon` — дефолтная иконка шаблона `create-expo-app`).
- ✅ **`expo-keep-awake` — сделано (2026-07-31).** `useKeepAwake()` в `app/game/[gameKey]/play.tsx` (корень play-роута) — экран не гаснет всю партию, снимается автоматически при уходе с экрана (unmount). Зависимость уже была в `package.json` от шаблона `create-expo-app`, использование не требовало установки.
- ⬜ Анимации переходов между фазами/экранами до уровня веба, stagger-списки — большинство уже покрыто по ходу переноса (AnimatePresence на каждую фазу, stagger в MainMenu/JustOne/RevealPhase и т.п.); точечный проход по эквивалентности с вебом не делался.
- ⬜ StatusBar уже настроен (`style="light"`, тёмный `contentStyle` фона стека — этап 0); Android NavigationBar (edge-to-edge, SDK 57 default) — не проверялось на устройстве.
- ⬜ Производительность: профилирование blur/анимаций на слабом Android — не делалось, нужен физический прогон.

### Этап 8 — Сборка и публикация

- EAS Build: eas.json (dev/preview/production), подписи
- Android: Google Play (internal testing → production) или прямой APK
- iOS: Apple Developer аккаунт, TestFlight → App Store
- Стор-ассеты: скриншоты, описания ru/en, privacy policy (данные не покидают устройство — декларации простые)

## 7. Риски и известные грабли

| Риск                                                                                                                        | Митигация                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| NativeWind ≠ Tailwind 4: часть утилит из веба не поддержана (сложные селекторы, `backdrop-filter`, произвольный CSS)        | Этап 2 выявляет всё на UI-ките; несовместимое — в inline-стили/компоненты                               |
| MMKV и Skia не работают в Expo Go                                                                                           | С этапа 0 работать только через dev build (`expo-dev-client`)                                           |
| `usePersistedState` с codec для Set/Map                                                                                     | Логика не меняется — сериализация остаётся JSON-строками в MMKV                                         |
| Вложенный blur тормозит и в RN (та же граблина, что в вебе)                                                                 | Один слой BlurView, правило зафиксировать в gotchas нового проекта                                      |
| RN flexbox: `flex-1 min-h-0` паттерн из веба не нужен, но скролл внутри flex-колонки требует явного `ScrollView` с `flex-1` | Зафиксировать в «рецепте переноса» на этапе 4                                                           |
| Жесты рисования конфликтуют со скроллом                                                                                     | `Gesture.Pan` + `simultaneousHandlers`/блокировка скролла экрана во время рисования                     |
| iOS-сборка без Mac                                                                                                          | EAS Build в облаке; локальный Mac не требуется                                                          |
| Дрейф контента: словари/контент будут обновляться в двух репо                                                               | Пока веб жив — правило: контент-правки дублировать; при желании позже вынести контент в общий npm-пакет |

## 8. Порядок работ и вехи

Этапы 0–3 строго последовательны (каждый — фундамент следующего). Этапы 4–6 — конвейер по играм. Этап 7 частично параллелен 5–6.

Вехи:

1. **M1 «Каркас»** — конец этапа 3: приложение с меню и настройками, без игр
2. **M2 «Играбельно»** — конец этапа 4: 3 игры проходятся целиком на устройстве
3. ✅ **M3 «Паритет»** — конец этапа 6: все 18 игр (2026-07-31)
4. **M4 «В сторах»** — конец этапа 8

## 9. Соглашения, которые переезжают как есть

- const-объекты вместо enum (везде, включая фазы)
- Комментарии в коде — на русском
- Пулы контента только через хелперы contentPool
- Настройки per-game через GameSettingsContext, персистенция автоматическая
- FSD-структура, чек-лист добавления новой игры (адаптировать пути под expo-router)
- В новом проекте завести свой memory bank `.claude/memory/` по образцу текущего
